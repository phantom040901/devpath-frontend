# EmailJS Setup Guide for OTP Verification

## Overview
EmailJS is a free email service that allows you to send emails directly from your client-side JavaScript code without needing a backend server. Perfect for OTP verification!

**Free Tier Benefits:**
- 200 emails/month (FREE)
- No credit card required
- No backend server needed
- Easy setup

---

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click **"Sign Up"** in the top right
3. Choose **"Sign up with Google"** for easiest setup (use alfredcmelencion@gmail.com)
4. Or create account with email and password
5. Verify your email if needed

---

## Step 2: Add Email Service

1. After logging in, go to **"Email Services"** in the left sidebar
2. Click **"Add New Service"**
3. Select **"Gmail"** from the list
4. Click **"Connect Account"**
5. Sign in with your Gmail account: `alfredcmelencion@gmail.com`
6. Allow EmailJS to send emails on your behalf
7. **IMPORTANT:** Copy your **Service ID** (looks like `service_xxxxxxx`)
   - Save this somewhere safe, you'll need it later!
8. Click **"Create Service"**

---

## Step 3: Create Email Template

1. Go to **"Email Templates"** in the left sidebar
2. Click **"Create New Template"**
3. You'll see a template editor with two sections:
   - **Subject**: Email subject line
   - **Content**: Email body (HTML supported)

### Template Configuration:

**Template Name:** `DevPath OTP Verification`

**Subject Line:**
```
Verify Your Email - DevPath OTP Code
```

**Email Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: system-ui, -apple-system, 'Segoe UI', Arial, sans-serif; background-color: #f4f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f7fa;">
    <tr>
      <td style="padding: 40px 20px; text-align: center;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: -0.5px;">DevPath</h1>
              <p style="margin: 12px 0 0; color: rgba(255,255,255,0.95); font-size: 15px; font-weight: 500; letter-spacing: 0.3px;">Email Verification Required</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 45px 40px;">
              <!-- Greeting -->
              <div style="margin-bottom: 25px;">
                <p style="margin: 0; color: #2c3e50; font-size: 16px; line-height: 1.6;">
                  Hello <strong style="color: #667eea;">{{to_name}}</strong>,
                </p>
              </div>

              <!-- Message -->
              <div style="margin-bottom: 35px; padding: 20px; background-color: #f8f9fc; border-left: 4px solid #667eea; border-radius: 6px;">
                <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.7;">
                  A message by <strong>DevPath</strong> has been received. Kindly respond at your earliest convenience by verifying your email address.
                </p>
              </div>

              <p style="margin: 0 0 35px; color: #4a5568; font-size: 14px; line-height: 1.7;">
                Thank you for signing up with DevPath! To complete your registration, please use the verification code below:
              </p>

              <!-- OTP Box -->
              <table role="presentation" style="width: 100%; margin: 35px 0;">
                <tr>
                  <td style="padding: 0;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; box-shadow: 0 4px 15px rgba(102,126,234,0.25);">
                      <p style="margin: 0 0 12px; color: rgba(255,255,255,0.9); font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;">Your Verification Code</p>
                      <p style="margin: 0; color: #ffffff; font-size: 42px; font-weight: bold; letter-spacing: 10px; font-family: 'Courier New', Consolas, monospace; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        {{otp_code}}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Message Info Box -->
              <div style="margin: 35px 0; padding: 20px; background-color: aliceblue; border-radius: 8px; border: 1px dashed #cbd5e0;">
                <table role="presentation" style="width: 100%;">
                  <tr>
                    <td style="vertical-align: top; width: 50px;">
                      <div style="padding: 8px 12px; margin: 0; background-color: #e3f2fd; border-radius: 6px; font-size: 26px; text-align: center;">
                        👤
                      </div>
                    </td>
                    <td style="vertical-align: top; padding-left: 15px;">
                      <div style="color: #2c3e50; font-size: 15px; margin-bottom: 4px;">
                        <strong>{{to_name}}</strong>
                      </div>
                      <div style="color: #a0aec0; font-size: 12px; margin-bottom: 10px;">
                        Just now
                      </div>
                      <p style="margin: 0; font-size: 14px; color: #4a5568; line-height: 1.6;">
                        Complete your DevPath registration by entering the verification code above. This ensures your account security.
                      </p>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Expiry Notice -->
              <div style="background-color: #fff8e1; border-left: 4px solid #ffc107; padding: 18px; margin: 30px 0; border-radius: 6px;">
                <p style="margin: 0; color: #8b6914; font-size: 13px; line-height: 1.6;">
                  ⏱️ <strong>Time Sensitive:</strong> This code will expire in <strong>10 minutes</strong>. If you didn't request this code, please ignore this email.
                </p>
              </div>

              <!-- Security Tip -->
              <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 18px; margin: 20px 0; border-radius: 6px;">
                <p style="margin: 0; color: #991b1b; font-size: 13px; line-height: 1.6;">
                  🔒 <strong>Security Tip:</strong> Never share this code with anyone. DevPath will never ask for your verification code via email, phone, or any other method.
                </p>
              </div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fc; padding: 35px 40px; text-align: center;">
              <p style="margin: 0 0 12px; color: #4a5568; font-size: 14px; line-height: 1.6;">
                Best regards,<br>
                <strong style="color: #667eea;">{{from_name}} Team</strong>
              </p>
              <p style="margin: 15px 0 0; color: #a0aec0; font-size: 12px; line-height: 1.5;">
                This is an automated email. Please do not reply to this message.
              </p>
              <p style="margin: 8px 0 0; color: #cbd5e0; font-size: 11px;">
                © 2025 DevPath. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

        <!-- Bottom Spacing -->
        <div style="margin-top: 25px; text-align: center;">
          <p style="margin: 0; color: #a0aec0; font-size: 11px;">
            If you have any questions, please contact our support team.
          </p>
        </div>

      </td>
    </tr>
  </table>
</body>
</html>
```

4. **IMPORTANT:** Make sure these variables are in your template:
   - `{{to_name}}` - Recipient's name
   - `{{to_email}}` - Recipient's email (auto-filled by EmailJS)
   - `{{otp_code}}` - The 6-digit OTP code
   - `{{from_name}}` - Your app name (DevPath)

5. Click **"Save"** at the top right
6. **IMPORTANT:** Copy your **Template ID** (looks like `template_xxxxxxx`)
   - Save this somewhere safe!

---

## Step 4: Get Your Public Key

1. Go to **"Account"** in the left sidebar
2. Scroll down to **"API Keys"** section
3. You'll see your **Public Key** (looks like a long string of random characters)
4. **IMPORTANT:** Copy this **Public Key**
   - Save it somewhere safe!

---

## Step 5: Update Your Code

Now that you have all three values, let's update the SignUpModal.jsx:

1. Open `SignUpModal.jsx`
2. Find these lines (around line 189-191):
```javascript
const serviceId = 'YOUR_SERVICE_ID';  // Replace after EmailJS setup
const templateId = 'YOUR_TEMPLATE_ID'; // Replace after EmailJS setup
const publicKey = 'YOUR_PUBLIC_KEY';   // Replace after EmailJS setup
```

3. Replace with your actual values:
```javascript
const serviceId = 'service_xxxxxxx';  // Your Service ID from Step 2
const templateId = 'template_xxxxxxx'; // Your Template ID from Step 3
const publicKey = 'your_long_public_key_here';   // Your Public Key from Step 4
```

**Example:**
```javascript
const serviceId = 'service_abc1234';
const templateId = 'template_xyz5678';
const publicKey = 'aBcDeFgHiJkLmNoPqRsTuVwXyZ123456';
```

---

## Step 6: Test Your OTP System

1. Run your development server: `npm run dev`
2. Go to signup page
3. Fill out the signup form with a real email you can access
4. Click "Sign Up"
5. You should receive an email with the OTP code
6. Enter the OTP code in the verification modal
7. Complete signup!

---

## Troubleshooting

### Not Receiving Emails?

1. **Check Spam Folder** - EmailJS emails often go to spam initially
2. **Verify Email Service** - Make sure Gmail service is connected in EmailJS dashboard
3. **Check Template Variables** - Ensure {{to_name}}, {{otp_code}}, {{from_name}} are in template
4. **Console Errors** - Open browser console (F12) and check for errors
5. **EmailJS Dashboard** - Check "History" tab to see if email was sent

### Invalid Template Error?

- Double-check Service ID, Template ID, and Public Key are correct
- Make sure there are no extra spaces in the values
- Verify template is saved and active in EmailJS dashboard

### Email Limit Reached?

- Free tier allows 200 emails/month
- Check "History" tab in EmailJS dashboard to see usage
- Consider upgrading if you need more emails

---

## Security Best Practice

**IMPORTANT:** After testing, consider moving these values to environment variables:

1. Create `.env` file in project root:
```
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

2. Update SignUpModal.jsx:
```javascript
const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
```

3. Add `.env` to `.gitignore` to keep keys private

---

## Summary of What You Need

✅ **Service ID** (from Email Services)
✅ **Template ID** (from Email Templates)
✅ **Public Key** (from Account > API Keys)

Once you have these three values, replace them in SignUpModal.jsx and you're done!

---

## Questions?

If you encounter any issues:
1. Check EmailJS documentation: https://www.emailjs.com/docs/
2. Verify all template variables match exactly
3. Check browser console for error messages
4. Test with different email addresses

Good luck! 🚀
