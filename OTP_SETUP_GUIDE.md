# OTP Verification Setup Guide

This guide will walk you through setting up email-based OTP verification for user signup in your DevPath application.

## Prerequisites

- Firebase project with Blaze (pay-as-you-go) plan (required for Cloud Functions)
- Node.js installed on your system
- Firebase CLI installed (`npm install -g firebase-tools`)

## Step 1: Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

## Step 2: Login to Firebase

```bash
firebase login
```

This will open a browser window for you to authenticate with your Google account.

## Step 3: Initialize Firebase Functions

Navigate to your project directory and initialize Firebase Functions:

```bash
cd "C:\Users\WINDOWS\Desktop\DEVPATH\DevPath\Finished"
firebase init functions
```

When prompted:
- Select "Use an existing project" and choose your DevPath Firebase project
- Choose JavaScript (or TypeScript if you prefer)
- Choose whether to use ESLint (recommended: Yes)
- Choose whether to install dependencies now (Yes)

This will create a `functions` folder in your project.

## Step 4: Install Required Packages

Navigate to the functions folder and install nodemailer:

```bash
cd functions
npm install nodemailer
cd ..
```

## Step 5: Set Up Email Service

You have several options for sending emails. Here are the most common:

### Option A: Using Gmail (Easiest for testing)

1. **Create an App Password for Gmail:**
   - Go to your Google Account: https://myaccount.google.com/
   - Navigate to Security → 2-Step Verification (enable if not already)
   - Scroll down to "App passwords"
   - Select app: "Mail", Select device: "Other (Custom name)"
   - Name it "DevPath OTP"
   - Copy the 16-character password

2. **Store the credentials in Firebase:**
   ```bash
   firebase functions:config:set gmail.email="your-email@gmail.com" gmail.password="your-16-char-app-password"
   ```

### Option B: Using SendGrid (Recommended for production)

1. **Sign up for SendGrid:**
   - Go to https://sendgrid.com/
   - Create a free account (100 emails/day free)
   - Create an API key in Settings → API Keys

2. **Store the API key in Firebase:**
   ```bash
   firebase functions:config:set sendgrid.api_key="your-sendgrid-api-key"
   ```

## Step 6: Create the Cloud Function

Replace the content of `functions/index.js` with one of the following:

### For Gmail:

```javascript
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Configure Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password
  }
});

// Send OTP Email Function
exports.sendOTPEmail = functions.https.onCall(async (data, context) => {
  const { email, otp, firstName } = data;

  // Validate input
  if (!email || !otp || !firstName) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required fields: email, otp, or firstName'
    );
  }

  const mailOptions = {
    from: `DevPath <${functions.config().gmail.email}>`,
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
    console.log(`OTP email sent successfully to ${email}`);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to send OTP email'
    );
  }
});

// Keep your existing sendWelcomeEmail function if you have one
exports.sendWelcomeEmail = functions.https.onCall(async (data, context) => {
  const { email, firstName } = data;

  const mailOptions = {
    from: `DevPath <${functions.config().gmail.email}>`,
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
            <a href="https://your-app-url.com/dashboard" class="cta-button">Go to Dashboard</a>
          </center>

          <p>If you have any questions, feel free to reach out to our support team.</p>

          <p>Happy coding!<br><strong>The DevPath Team</strong></p>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send welcome email');
  }
});
```

### For SendGrid:

```javascript
const functions = require('firebase-functions');
const sgMail = require('@sendgrid/mail');

// Set SendGrid API key
sgMail.setApiKey(functions.config().sendgrid.api_key);

// Send OTP Email Function
exports.sendOTPEmail = functions.https.onCall(async (data, context) => {
  const { email, otp, firstName } = data;

  if (!email || !otp || !firstName) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required fields'
    );
  }

  const msg = {
    to: email,
    from: 'noreply@devpath.com', // Use your verified sender
    subject: 'Verify Your Email - DevPath OTP',
    html: `
      <!-- Same HTML template as above -->
    `
  };

  try {
    await sgMail.send(msg);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send OTP');
  }
});
```

## Step 7: Deploy the Cloud Function

Deploy your function to Firebase:

```bash
firebase deploy --only functions
```

This will take a few minutes. You'll see output showing the deployment progress.

## Step 8: Update Firebase Configuration (Local Testing)

For local testing, download the function config:

```bash
firebase functions:config:get > .runtimeconfig.json
```

Move this file to your `functions` folder:

```bash
move .runtimeconfig.json functions/.runtimeconfig.json
```

## Step 9: Test the OTP Flow

1. **Start your development server** (if not running):
   ```bash
   npm run dev
   ```

2. **Try signing up:**
   - Fill in the signup form
   - Click "Start Building"
   - You should receive an email with the OTP
   - Enter the OTP in the modal
   - Your account should be created

## Step 10: Verify Function Deployment

Check if your function is deployed:

```bash
firebase functions:list
```

You should see `sendOTPEmail` and `sendWelcomeEmail` in the list.

## Troubleshooting

### Function not found error:
- Make sure you deployed the functions: `firebase deploy --only functions`
- Check the Firebase Console → Functions to see if they're deployed

### Email not sending:
- Check your email credentials are correct
- For Gmail, make sure you're using an App Password, not your regular password
- Check the Firebase Functions logs: `firebase functions:log`

### "Billing account not configured" error:
- Firebase Functions require the Blaze (pay-as-you-go) plan
- Upgrade in Firebase Console → Settings → Usage and billing

### CORS errors:
- Make sure you're using `https.onCall` not `https.onRequest` in your functions
- The Cloud Functions should be called using `httpsCallable` from the client

## Testing Commands

View function logs:
```bash
firebase functions:log
```

View function config:
```bash
firebase functions:config:get
```

Delete function config (if needed):
```bash
firebase functions:config:unset gmail
```

## Security Best Practices

1. **Never commit your `.runtimeconfig.json`** - Add it to `.gitignore`
2. **Use environment variables** for sensitive data
3. **Set up email rate limiting** to prevent abuse
4. **Add CAPTCHA** for additional security (optional)
5. **Monitor function usage** in Firebase Console

## Cost Estimation

- Firebase Functions: First 2 million invocations/month are free
- SendGrid: 100 emails/day free
- Gmail: Free (but has daily sending limits ~500 emails/day)

For a small to medium application, this should remain in the free tier.

## Next Steps

1. ✅ Set up email service (Gmail or SendGrid)
2. ✅ Deploy Cloud Functions
3. ✅ Test OTP verification
4. 🔄 Consider adding:
   - Rate limiting for OTP requests
   - SMS OTP as an alternative
   - Remember device functionality
   - Brute force protection

## Support

If you encounter issues:
1. Check Firebase Console → Functions → Logs
2. Check browser console for errors
3. Verify your Firebase project is on the Blaze plan
4. Ensure all dependencies are installed

---

**Created:** October 2025
**Last Updated:** October 2025
**Version:** 1.0
