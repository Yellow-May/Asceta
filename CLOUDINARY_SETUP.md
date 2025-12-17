# Cloudinary Setup Guide

This guide will help you set up Cloudinary for file uploads in the ACCADD application form.

## What is Cloudinary?

Cloudinary is a cloud-based image and video management service that provides APIs for uploading, storing, transforming, and delivering media files.

## Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Click on **"Sign Up"** or **"Start Free"**
3. Fill in your details:
   - Email address
   - Password
   - Full name
   - Company name (optional)
4. Verify your email address
5. Complete the signup process

## Step 2: Get Your Cloudinary Credentials

After signing up, you'll be taken to your dashboard. Here's how to find your credentials:

1. **Cloud Name**:

   - Found in the dashboard URL: `https://console.cloudinary.com/console/cms/cloud_name/YOUR_CLOUD_NAME`
   - Or displayed at the top of your dashboard
   - Example: `dxyz123abc`

2. **API Key**:

   - Go to your dashboard
   - Click on **"Settings"** (gear icon) or go to **"Account Details"**
   - Under **"Account Details"**, you'll see **"API Key"**
   - Example: `123456789012345`

3. **API Secret**:
   - In the same **"Account Details"** section
   - Click **"Reveal"** next to **"API Secret"** to show it
   - ⚠️ **Important**: Keep this secret secure and never commit it to version control
   - Example: `abcdefghijklmnopqrstuvwxyz123456`

## Step 3: Add Credentials to Backend .env File

1. Navigate to the `backend` directory
2. Open or create a `.env` file
3. Add the following environment variables:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Example:**

```env
CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

## Step 4: Install Dependencies

The Cloudinary package has already been added to `package.json`. Run:

```bash
cd backend
yarn install
```

## Step 5: Verify Setup

1. Start your backend server:

   ```bash
   yarn dev
   ```

2. Try submitting an application form with a passport photo
3. Check your Cloudinary dashboard → **Media Library** to see if the uploaded image appears

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Keep your API Secret secure** - don't share it publicly
3. **Use environment variables** in production (e.g., Render, Heroku, AWS)
4. **Set up upload presets** in Cloudinary for additional security (optional)

## Cloudinary Free Tier Limits

The free tier includes:

- **25 GB** storage
- **25 GB** monthly bandwidth
- **25,000** monthly transformations
- Unlimited uploads

This should be sufficient for development and small-scale production use.

## Troubleshooting

### Upload fails with "Invalid API credentials"

- Double-check your credentials in the `.env` file
- Ensure there are no extra spaces or quotes around the values
- Verify your Cloudinary account is active

### "File too large" error

- Check file size limit (currently set to 5MB)
- Compress images before uploading if needed

### Images not appearing in Cloudinary

- Check the backend logs for error messages
- Verify your Cloudinary credentials are correct
- Ensure the backend server has internet connectivity

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Cloudinary Dashboard](https://console.cloudinary.com)

## Need Help?

If you encounter any issues:

1. Check the backend console logs for error messages
2. Verify your `.env` file has the correct format
3. Ensure Cloudinary credentials are correct
4. Check Cloudinary dashboard for upload history and errors
