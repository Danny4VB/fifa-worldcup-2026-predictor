const admin = require("firebase-admin");
const { onDocumentWritten } = require("firebase-functions/v2/firestore");

admin.initializeApp();

const db = admin.firestore();

function safeId(value) {
  return String(value || "unknown")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 120) || "unknown";
}

async function rebuildMatchBestPlayerSummary(matchId) {
  const playersSnap = await db
    .collection("bestPlayerPollCounts")
    .doc(matchId)
    .collection("players")
    .get();

  let totalVotes = 0;
  let top = null;

  playersSnap.forEach((doc) => {
    const data = doc.data() || {};
    const voteCount = Number(data.voteCount || 0);
    totalVotes += voteCount;

    if (!top || voteCount > top.voteCount) {
      top = {
        playerId: doc.id,
        playerName: data.playerName || "Player",
        voteCount
      };
    }
  });

  const topPercent =
    top && totalVotes > 0 ? Math.round((top.voteCount / totalVotes) * 100) : 0;

  await db.collection("bestPlayerPollSummary").doc(matchId).set(
    {
      matchId,
      totalVotes,
      topPlayerId: top ? top.playerId : "",
      topPlayerName: top ? top.playerName : "",
      topPlayerVoteCount: top ? top.voteCount : 0,
      topPlayerPercent: topPercent,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  );
}

exports.aggregateBestPlayerVote = onDocumentWritten(
  "bestPlayerVotes/{voteId}",
  async (event) => {
    const before = event.data.before.exists ? event.data.before.data() : null;
    const after = event.data.after.exists ? event.data.after.data() : null;

    const beforeMatchId = before ? String(before.matchId || "") : "";
    const afterMatchId = after ? String(after.matchId || "") : "";
    const matchId = afterMatchId || beforeMatchId;

    if (!matchId) return;

    const beforePlayerName = before ? String(before.playerName || "") : "";
    const afterPlayerName = after ? String(after.playerName || "") : "";

    if (beforePlayerName === afterPlayerName && after) {
      await rebuildMatchBestPlayerSummary(matchId);
      return;
    }

    const batch = db.batch();

    if (beforePlayerName) {
      const beforePlayerId = safeId(beforePlayerName);
      const beforeRef = db
        .collection("bestPlayerPollCounts")
        .doc(matchId)
        .collection("players")
        .doc(beforePlayerId);

      batch.set(
        beforeRef,
        {
          playerName: beforePlayerName,
          voteCount: admin.firestore.FieldValue.increment(-1),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
      );
    }

    if (afterPlayerName) {
      const afterPlayerId = safeId(afterPlayerName);
      const afterRef = db
        .collection("bestPlayerPollCounts")
        .doc(matchId)
        .collection("players")
        .doc(afterPlayerId);

      batch.set(
        afterRef,
        {
          playerName: afterPlayerName,
          voteCount: admin.firestore.FieldValue.increment(1),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
      );
    }

    await batch.commit();
    await rebuildMatchBestPlayerSummary(matchId);
  }
);
