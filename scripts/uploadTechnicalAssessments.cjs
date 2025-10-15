// scripts/uploadTechnicalAssessments.cjs
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const ASSESSMENT_MODES = {
  coding_skills: "mcq",
  logical_quotient: "mcq",
  memory_test: "mcq",
  hackathons: "survey",
  hours_working: "survey",
};

const ASSESSMENT_TITLES = {
  coding_skills: "Coding Skills Assessment",
  logical_quotient: "Logical Quotient Test",
  memory_test: "Memory Passage Test",
  hackathons: "Hackathon Experience Survey",
  hours_working: "Study Habits Survey",
};

async function uploadAssessment(fileName, docId) {
  try {
    const filePath = path.join(__dirname, fileName);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    
    const mode = ASSESSMENT_MODES[docId] || "mcq";
    const title = ASSESSMENT_TITLES[docId] || data.title || docId;
    
    const enrichedData = {
      ...data,
      mode,
      title,
    };
    
    await db.collection("technicalAssessments").doc(docId).set(enrichedData);
    console.log(`✅ Uploaded to technicalAssessments: ${docId} (mode: ${mode})`);
  } catch (error) {
    console.error(`❌ Upload failed for ${docId}:`, error);
  }
}

async function uploadAll() {
  const assessments = [
    { file: "coding_skills.json", id: "coding_skills" },
    { file: "logical_quotient.json", id: "logical_quotient" },
    { file: "memory_test.json", id: "memory_test" },
    { file: "hackathons.json", id: "hackathons" },
    { file: "hours_working.json", id: "hours_working" },
  ];

  for (const { file, id } of assessments) {
    await uploadAssessment(file, id);
  }
  
  console.log("\n🎉 All technical assessments uploaded!");
  process.exit(0);
}

const [,, fileName, docId] = process.argv;

if (fileName === "all" || (!fileName && !docId)) {
  uploadAll();
} else if (fileName && docId) {
  uploadAssessment(fileName, docId).then(() => process.exit(0));
} else {
  console.log("Usage:");
  console.log("  Upload all: node scripts/uploadTechnicalAssessments.cjs all");
  console.log("  Upload one: node scripts/uploadTechnicalAssessments.cjs <fileName.json> <docId>");
  process.exit(1);
}