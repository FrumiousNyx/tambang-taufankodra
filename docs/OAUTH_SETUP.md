# OAuth Setup Guide for PT Semen Nusantara CMS

## Overview
This guide explains how to configure Google and Azure OAuth providers for the CMS login system.

## Prerequisites
- Supabase project with Authentication enabled
- Admin access to Google Cloud Console
- Admin access to Azure Portal

## Step 1: Configure Google OAuth

### 1.1 Create Google OAuth App
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
5. Select **Web application**
6. Configure:
   - **Name**: PT Semen Nusantara CMS
   - **Authorized JavaScript origins**: 
     - `http://localhost:8080` (development)
     - `https://yourdomain.com` (production)
   - **Authorized redirect URIs**:
     - `https://[your-project-ref].supabase.co/auth/v1/callback`
7. Click **CREATE**
8. Copy **Client ID** and **Client Secret**

### 1.2 Configure in Supabase
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click **Configure**
4. Enable the provider
5. Enter:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
6. Click **Save**

## Step 2: Configure Azure OAuth

### 2.1 Create Azure AD App
1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory**
3. Go to **App registrations** → **New registration**
4. Configure:
   - **Name**: PT Semen Nusantara CMS
   - **Supported account types**: Accounts in any organizational directory (Any Azure AD directory - Multitenant)
   - **Redirect URI**: Web → `https://[your-project-ref].supabase.co/auth/v1/callback`
5. Click **Register**
6. Copy **Application (client) ID** and **Directory (tenant) ID**
7. Go to **Certificates & secrets**
8. Click **+ New client secret**
9. Enter description and set expiration
10. Copy the **Secret Value** (you can't see it again)

### 2.2 Configure in Supabase
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Azure** and click **Configure**
4. Enable the provider
5. Enter:
   - **Client ID**: Your Azure Application ID
   - **Client Secret**: Your Azure Client Secret
   - **Tenant ID**: Your Azure Directory Tenant ID
6. Click **Save**

## Step 3: Environment Configuration

### 3.1 Update Environment Variables
Make sure your `.env` file has the correct Supabase configuration:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3.2 Redirect URLs
Ensure these URLs are configured in both Google and Azure:
- Development: `http://localhost:8080`
- Production: `https://yourdomain.com`

## Step 4: Test OAuth Login

### 4.1 Development Testing
1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:8080/auth`
3. Click **Google** or **Azure** button
4. Complete the OAuth flow
5. You should be redirected to `/dashboard`

### 4.2 Production Testing
1. Deploy your application
2. Navigate to `https://yourdomain.com/auth`
3. Test OAuth login
4. Verify redirect to dashboard

## Troubleshooting

### Common Issues

#### 1. "OAuth not available" Error
- **Cause**: OAuth providers not configured in Supabase
- **Solution**: Complete Step 1.2 and 2.2

#### 2. "Invalid redirect_uri" Error
- **Cause**: Redirect URL not configured in OAuth provider
- **Solution**: Add correct redirect URLs in Google/Azure console

#### 3. "Client authentication failed" Error
- **Cause**: Incorrect client ID or secret
- **Solution**: Verify credentials in Supabase provider settings

#### 4. CORS Issues
- **Cause**: Frontend URL not in allowed origins
- **Solution**: Add your domain to authorized origins

### Debug Steps
1. Check browser console for errors
2. Verify Supabase provider configuration
3. Check OAuth provider console settings
4. Test with different browsers
5. Clear browser cookies and cache

## Security Best Practices

### 1. Environment Variables
- Never commit OAuth secrets to version control
- Use different secrets for development and production
- Rotate secrets regularly

### 2. Provider Configuration
- Enable only necessary OAuth scopes
- Use HTTPS in production
- Monitor OAuth usage in provider dashboards

### 3. User Management
- Map OAuth users to appropriate roles in Supabase
- Implement proper user profile management
- Set up user verification workflows

## Support

For additional help:
1. Check [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
2. Review [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
3. Consult [Azure AD Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/)

## Next Steps

After OAuth setup:
1. Test user role assignment
2. Configure user profile management
3. Set up user verification emails
4. Implement admin user management
5. Add audit logging for OAuth events
