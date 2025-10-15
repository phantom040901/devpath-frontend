// scripts/uploadAssessments.cjs
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Load service account JSON
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function uploadAssessment(fileName, docId) {
  try {
    const filePath = path.join(__dirname, fileName);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    await db.collection("assessments").doc(docId).set(data);
    console.log(`✅ Uploaded: ${docId}`);
  } catch (error) {
    console.error("❌ Upload failed:", error);
  }
}

// Example usage: node scripts/uploadAssessments.cjs operating_systems.json operating_systems
const [,, fileName, docId] = process.argv;

if (!fileName || !docId) {
  console.log("Usage: node scripts/uploadAssessments.cjs <fileName.json> <docId>");
  process.exit(1);
}

uploadAssessment(fileName, docId);
