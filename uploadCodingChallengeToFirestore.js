// uploadCodingChallengeToFirestore.js
// Standalone script to upload Coding Challenge assessment to Firestore
// Run with: node uploadCodingChallengeToFirestore.js

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3-3vCQq9jS0WKzUKZvxbkhQs0D31zlZU",
  authDomain: "devpath-capstone.firebaseapp.com",
  projectId: "devpath-capstone",
  storageBucket: "devpath-capstone.appspot.com",
  messagingSenderId: "181305261700",
  appId: "1:181305261700:web:a1ac888626bc2a0d058cd1",
  databaseURL: "https://devpath-capstone-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Coding Challenge Assessment Data
const codingChallengeData = {
  title: "Coding Challenge",
  description: "Test your programming skills with 10 coding problems of varying difficulty",
  duration: 30,
  field: "coding skills rating",
  scoringType: "numeric",
  questions: [
    {
      id: "q1",
      difficulty: "Easy",
      question: "What will be the output of the following code?\n\n```python\nx = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)\n```",
      options: [
        { value: "A", label: "[1, 2, 3]", correct: false },
        { value: "B", label: "[1, 2, 3, 4]", correct: true },
        { value: "C", label: "[4]", correct: false },
        { value: "D", label: "Error", correct: false }
      ]
    },
    {
      id: "q2",
      difficulty: "Easy",
      question: "Which of the following is the correct way to create a function in JavaScript?",
      options: [
        { value: "A", label: "function myFunc() {}", correct: true },
        { value: "B", label: "def myFunc():", correct: false },
        { value: "C", label: "func myFunc() {}", correct: false },
        { value: "D", label: "create myFunc() {}", correct: false }
      ]
    },
    {
      id: "q3",
      difficulty: "Easy",
      question: "What is the time complexity of accessing an element in an array by index?",
      options: [
        { value: "A", label: "O(1)", correct: true },
        { value: "B", label: "O(n)", correct: false },
        { value: "C", label: "O(log n)", correct: false },
        { value: "D", label: "O(n²)", correct: false }
      ]
    },
    {
      id: "q4",
      difficulty: "Medium",
      question: "What will be the output of this code?\n\n```javascript\nlet a = [1, 2, 3];\nlet b = a.map(x => x * 2);\nconsole.log(b);\n```",
      options: [
        { value: "A", label: "[1, 2, 3]", correct: false },
        { value: "B", label: "[2, 4, 6]", correct: true },
        { value: "C", label: "[1, 4, 9]", correct: false },
        { value: "D", label: "undefined", correct: false }
      ]
    },
    {
      id: "q5",
      difficulty: "Medium",
      question: "Which data structure uses LIFO (Last In First Out) principle?",
      options: [
        { value: "A", label: "Queue", correct: false },
        { value: "B", label: "Stack", correct: true },
        { value: "C", label: "Array", correct: false },
        { value: "D", label: "Tree", correct: false }
      ]
    },
    {
      id: "q6",
      difficulty: "Medium",
      question: "What is the purpose of the 'async' keyword in JavaScript?",
      options: [
        { value: "A", label: "To create a function that returns a Promise", correct: true },
        { value: "B", label: "To make code run faster", correct: false },
        { value: "C", label: "To pause execution", correct: false },
        { value: "D", label: "To handle errors", correct: false }
      ]
    },
    {
      id: "q7",
      difficulty: "Medium",
      question: "In object-oriented programming, what is 'polymorphism'?",
      options: [
        { value: "A", label: "Having multiple constructors", correct: false },
        { value: "B", label: "Ability to take many forms", correct: true },
        { value: "C", label: "Hiding implementation details", correct: false },
        { value: "D", label: "Creating multiple classes", correct: false }
      ]
    },
    {
      id: "q8",
      difficulty: "Hard",
      question: "What is the space complexity of a recursive function that calculates Fibonacci numbers without memoization?",
      options: [
        { value: "A", label: "O(1)", correct: false },
        { value: "B", label: "O(n)", correct: true },
        { value: "C", label: "O(2^n)", correct: false },
        { value: "D", label: "O(log n)", correct: false }
      ]
    },
    {
      id: "q9",
      difficulty: "Hard",
      question: "Which sorting algorithm has the best average-case time complexity?",
      options: [
        { value: "A", label: "Bubble Sort - O(n²)", correct: false },
        { value: "B", label: "Quick Sort - O(n log n)", correct: true },
        { value: "C", label: "Selection Sort - O(n²)", correct: false },
        { value: "D", label: "Insertion Sort - O(n²)", correct: false }
      ]
    },
    {
      id: "q10",
      difficulty: "Hard",
      question: "What is a 'closure' in JavaScript?",
      options: [
        { value: "A", label: "A way to close the browser window", correct: false },
        { value: "B", label: "A function that has access to outer function's variables", correct: true },
        { value: "C", label: "A method to end execution", correct: false },
        { value: "D", label: "A type of loop", correct: false }
      ]
    }
  ]
};

async function uploadCodingChallenge() {
  console.log('🚀 Starting Coding Challenge Upload...\n');

  try {
    console.log('📤 Uploading to Firestore...');
    const assessmentRef = doc(db, 'technicalAssessments', 'coding_challenge');
    await setDoc(assessmentRef, codingChallengeData, { merge: true });

    console.log('✅ Successfully uploaded Coding Challenge!');
    console.log('');
    console.log('📍 Firestore Location:');
    console.log('   Collection: technicalAssessments');
    console.log('   Document ID: coding_challenge');
    console.log('');
    console.log('📊 Assessment Details:');
    console.log(`   Title: ${codingChallengeData.title}`);
    console.log(`   Questions: ${codingChallengeData.questions.length}`);
    console.log(`   Duration: ${codingChallengeData.duration} minutes`);
    console.log(`   Field: ${codingChallengeData.field}`);
    console.log(`   Scoring Type: ${codingChallengeData.scoringType}`);
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('   1. Navigate to http://localhost:5173/technical-assessments');
    console.log('   2. Click on "Coding Challenge" card');
    console.log('   3. Verify assessment loads with 10 questions');
    console.log('   4. Complete assessment and check score calculation');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('   - Ensure Firebase is properly configured');
    console.error('   - Check your internet connection');
    console.error('   - Verify Firestore permissions');
    console.error('   - Make sure you have write access to the project');
    console.error('');
    process.exit(1);
  }
}

uploadCodingChallenge();
