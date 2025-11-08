// Clean up incomplete students - Remove students without assessment data
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, deleteDoc, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD3-3vCQq9jS0WKZvxbkhQs0D31zlZU",
  authDomain: "devpath-capstone.firebaseapp.com",
  projectId: "devpath-capstone",
  storageBucket: "devpath-capstone.appspot.com",
  messagingSenderId: "181305261700",
  appId: "1:181305261700:web:a1ac888626bc2a0d058cd1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// List of the 20 students we created
const studentsToDelete = [
  "miguel.santos2003@gmail.com",
  "ana.reyes2002@gmail.com",
  "carlos.cruz2004@gmail.com",
  "elena.garcia2003@gmail.com",
  "rafael.mendoza2005@gmail.com",
  "sofia.rodriguez2002@gmail.com",
  "luis.martinez2004@gmail.com",
  "isabel.lopez2003@gmail.com",
  "diego.hernandez2005@gmail.com",
  "carmen.perez2002@gmail.com",
  "gabriel.gonzales2004@gmail.com",
  "valentina.sanchez2003@gmail.com",
  "fernando.ramirez2005@gmail.com",
  "mariana.mariana2002@gmail.com",
  "antonio.flores2004@gmail.com",
  "rosa.rivera2003@gmail.com",
  "ricardo.gomez2005@gmail.com",
  "lucia.diaz2002@gmail.com",
  "roberto.morales2004@gmail.com",
  "paula.jimenez2003@gmail.com"
];

async function deleteIncompleteStudents() {
  console.log('Finding and deleting incomplete students...\n');

  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);

  let deleted = 0;

  for (const docSnap of snapshot.docs) {
    const userData = docSnap.data();

    // Delete if it's a student without completed assessment
    if (userData.role === 'student' &&
        !userData.assessmentCompleted &&
        studentsToDelete.includes(userData.email)) {

      const uid = docSnap.id;
      const name = `${userData.firstName} ${userData.lastName}`;

      try {
        // Delete Firestore document
        await deleteDoc(doc(db, 'users', uid));
        console.log(`✓ Deleted: ${name} (${userData.email})`);
        deleted++;

        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`✗ Error deleting ${name}: ${error.message}`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✓ Cleanup complete! Deleted ${deleted} incomplete students`);
  console.log('='.repeat(60));

  process.exit(0);
}

deleteIncompleteStudents().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
