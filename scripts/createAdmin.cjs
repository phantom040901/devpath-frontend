// scripts/createAdmin.cjs
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

async function createAdmin() {
  try {
    // Create admin user in Auth
    const userRecord = await auth.createUser({
      email: 'admin@devpath.com',
      password: 'Admin@123456',
      displayName: 'System Administrator'
    });

    console.log('✅ Admin user created:', userRecord.uid);

    // Add admin document
    await db.collection('admins').doc(userRecord.uid).set({
      email: 'admin@devpath.com',
      displayName: 'System Administrator',
      role: 'admin',
      createdAt: new Date().toISOString(),
      permissions: ['read', 'write', 'delete', 'manage_users', 'manage_assessments']
    });

    console.log('✅ Admin document created in Firestore');
    console.log('\nAdmin Credentials:');
    console.log('Email: admin@devpath.com');
    console.log('Password: Admin@123456');
    console.log('\n⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    process.exit();
  }
}

createAdmin();