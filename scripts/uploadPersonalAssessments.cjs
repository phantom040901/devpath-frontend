// scripts/uploadPersonalAssessments.cjs
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Load service account JSON (reuse existing)
const serviceAccount = require("./serviceAccountKey.json");

// Initialize only if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// Personal assessment metadata
const PERSONAL_ASSESSMENTS = {
  career_preferences: {
    mode: "survey",
    title: "Career Preferences Survey",
  },
  personal_interests: {
    mode: "survey",
    title: "Personal Interests Survey",
  },
  personality_workstyle: {
    mode: "survey",
    title: "Personality & Work Style Survey",
  },
};

async function uploadAssessment(fileName, docId) {
  try {
    const filePath = path.join(__dirname, fileName);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    
    const metadata = PERSONAL_ASSESSMENTS[docId];
    const enrichedData = {
      ...data,
      mode: metadata.mode,
      title: metadata.title,
    };
    
    await db.collection("personalAssessments").doc(docId).set(enrichedData);
    console.log(`✅ Uploaded to personalAssessments: ${docId} (mode: ${metadata.mode})`);
  } catch (error) {
    console.error(`❌ Upload failed for ${docId}:`, error);
  }
}

async function uploadAll() {
  const assessments = [
    { file: "career_preferences.json", id: "career_preferences" },
    { file: "personal_interests.json", id: "personal_interests" },
    { file: "personality_workstyle.json", id: "personality_workstyle" },
  ];

  for (const { file, id } of assessments) {
    await uploadAssessment(file, id);
  }
  
  console.log("\n🎉 All personal assessments uploaded!");
  process.exit(0);
}

// Run
const [,, fileName, docId] = process.argv;

if (fileName === "all" || (!fileName && !docId)) {
  uploadAll();
} else if (fileName && docId) {
  uploadAssessment(fileName, docId).then(() => process.exit(0));
} else {
  console.log("Usage:");
  console.log("  Upload all: node scripts/uploadPersonalAssessments.cjs all");
  console.log("  Upload one: node scripts/uploadPersonalAssessments.cjs <fileName.json> <docId>");
  process.exit(1);
}