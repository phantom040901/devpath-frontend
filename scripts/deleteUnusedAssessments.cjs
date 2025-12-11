// scripts/deleteUnusedAssessments.cjs
// This script removes duplicate and misplaced assessments from Firestore

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function deleteAssessments() {
  console.log("🗑️  Starting cleanup of unused/duplicate assessments...\n");

  const assessmentsToDelete = [
    { collection: "technicalAssessments", id: "hackathons", reason: "Duplicate - already in personal assessments" },
    { collection: "technicalAssessments", id: "hours_working", reason: "Duplicate - already in personal assessments" },
    { collection: "technicalAssessments", id: "memory_test", reason: "Duplicate/broken - memory_game is the correct one" },
    { collection: "technicalAssessments", id: "coding_skills", reason: "Not in UI - redundant with coding_challenge" },
  ];

  for (const { collection, id, reason } of assessmentsToDelete) {
    try {
      await db.collection(collection).doc(id).delete();
      console.log(`✅ Deleted: ${collection}/${id}`);
      console.log(`   Reason: ${reason}\n`);
    } catch (error) {
      console.error(`❌ Failed to delete ${collection}/${id}:`, error.message);
    }
  }

  console.log("\n🎉 Cleanup complete!");
  console.log("\n📊 New totals should be:");
  console.log("   Academic: 9");
  console.log("   Technical: 5 (coding_challenge, logical_quotient, memory_game, public_speaking, reading_writing)");
  console.log("   Personal: 3");
  console.log("   TOTAL: 17 assessments");

  process.exit(0);
}

deleteAssessments();
