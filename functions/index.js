const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Initialize Firebase Admin
admin.initializeApp();

// Configure Gmail transporter with your credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'alfredcmelencion@gmail.com',
    pass: 'ahtzestithclebcc'
  }
});

// Send OTP Email Function
exports.sendOTPEmail = functions
  .runWith({
    timeoutSeconds: 60,
    memory: '256MB'
  })
  .https.onCall(async (data, context) => {
  const { email, otp, firstName } = data;

  // Validate input
  if (!email || !otp || !firstName) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required fields: email, otp, or firstName'
    );
  }

  const mailOptions = {
    from: 'DevPath <alfredcmelencion@gmail.com>',
    to: email,
    subject: 'Verify Your Email - DevPath OTP',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .otp-box {
            background: white;
            border: 2px dashed #667eea;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
            border-radius: 8px;
          }
          .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            letter-spacing: 8px;
            margin: 10px 0;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 12px;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🚀 Welcome to DevPath!</h1>
        </div>
        <div class="content">
          <h2>Hi ${firstName},</h2>
          <p>Thank you for signing up for DevPath! To complete your registration, please verify your email address with the code below:</p>

          <div class="otp-box">
            <p style="margin: 0; color: #666; font-size: 14px;">Your verification code is:</p>
            <div class="otp-code">${otp}</div>
            <p style="margin: 0; color: #666; font-size: 12px;">Valid for 10 minutes</p>
          </div>

          <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <p style="margin: 5px 0 0 0;">If you didn't request this code, please ignore this email. Never share this code with anyone.</p>
          </div>

          <p>Once verified, you'll have access to:</p>
          <ul>
            <li>✅ Personalized learning paths</li>
            <li>✅ Technical assessments</li>
            <li>✅ Career guidance</li>
            <li>✅ Progress tracking</li>
          </ul>

          <p>Best regards,<br><strong>The DevPath Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated email, please do not reply.</p>
          <p>© ${new Date().getFullYear()} DevPath. All rights reserved.</p>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent successfully to ${email}`);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to send OTP email: ' + error.message
    );
  }
});

// Send Welcome Email Function (existing function)
exports.sendWelcomeEmail = functions
  .runWith({
    timeoutSeconds: 60,
    memory: '256MB'
  })
  .https.onCall(async (data, context) => {
  const { email, firstName } = data;

  // Validate input
  if (!email || !firstName) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required fields: email or firstName'
    );
  }

  const mailOptions = {
    from: 'DevPath <alfredcmelencion@gmail.com>',
    to: email,
    subject: 'Welcome to DevPath! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .header h1 {
            color: white;
            margin: 0;
            font-size: 32px;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .cta-button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 Welcome to DevPath!</h1>
        </div>
        <div class="content">
          <h2>Hi ${firstName},</h2>
          <p>Your account has been successfully created! We're excited to have you join our community of developers.</p>

          <p>Ready to start your journey? Here's what you can do next:</p>
          <ul>
            <li>📝 Complete your first assessment</li>
            <li>🎯 Discover your learning path</li>
            <li>📊 Track your progress</li>
            <li>🚀 Build your skills</li>
          </ul>

          <center>
            <a href="http://localhost:5173/dashboard" class="cta-button">Go to Dashboard</a>
          </center>

          <p>If you have any questions, feel free to reach out to our support team.</p>

          <p>Happy coding!<br><strong>The DevPath Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated email, please do not reply.</p>
          <p>© ${new Date().getFullYear()} DevPath. All rights reserved.</p>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent successfully to ${email}`);
    return { success: true, message: 'Welcome email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to send welcome email: ' + error.message
    );
  }
});

// Reset Password Function
exports.resetUserPassword = functions
  .runWith({
    timeoutSeconds: 60,
    memory: '256MB'
  })
  .https.onCall(async (data, context) => {
  const { email, verificationCode, newPassword } = data;

  // Validate input
  if (!email || !verificationCode || !newPassword) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required fields: email, verificationCode, or newPassword'
    );
  }

  // Validate password strength
  if (newPassword.length < 8) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Password must be at least 8 characters long'
    );
  }

  if (!/[A-Z]/.test(newPassword)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Password must contain at least one uppercase letter'
    );
  }

  if (!/[a-z]/.test(newPassword)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Password must contain at least one lowercase letter'
    );
  }

  if (!/[0-9]/.test(newPassword)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Password must contain at least one number'
    );
  }

  try {
    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);

    // Update user password
    await admin.auth().updateUser(userRecord.uid, {
      password: newPassword,
    });

    console.log(`✅ Password reset successfully for user: ${email}`);
    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    console.error('❌ Error resetting password:', error);

    if (error.code === 'auth/user-not-found') {
      throw new functions.https.HttpsError(
        'not-found',
        'No user found with this email address'
      );
    }

    throw new functions.https.HttpsError(
      'internal',
      'Failed to reset password: ' + error.message
    );
  }
});
