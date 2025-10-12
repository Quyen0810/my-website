# Supabase Authentication Setup Guide

## 🚀 Quick Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `vilaw-auth`
   - Database Password: (generate strong password)
   - Region: Choose closest to your users

### 2. Get API Keys
1. Go to your project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

### 3. Configure Environment Variables
Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For server-side operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Enable Authentication Providers
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Enable **Google** provider (optional):
   - Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com)
   - Add Client ID and Client Secret to Supabase

### 5. Configure Email Templates (Optional)
1. Go to **Authentication** → **Email Templates**
2. Customize templates for:
   - Confirm signup
   - Reset password
   - Magic link

## 🔧 Features Implemented

### Authentication Pages
- **`/supabase-login`** - Login/Register page with Supabase
- **`/supabase-demo`** - Demo page showing user info

### API Routes
- **`/api/auth/supabase-login`** - Login endpoint
- **`/api/auth/supabase-register`** - Register endpoint  
- **`/api/auth/supabase-session`** - Get current session
- **`/api/auth/supabase-logout`** - Logout endpoint

### Components
- **`AuthProvider`** - React context for authentication state
- **`useAuth`** - Hook to access auth state
- **Middleware** - Route protection

## 🧪 Testing

### Test Accounts
You can create test accounts directly through the Supabase dashboard:

1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Enter email and password
4. Or use the registration form at `/supabase-login`

### Demo Flow
1. Visit `/supabase-login`
2. Register a new account
3. Check email for confirmation (if enabled)
4. Login with your credentials
5. Visit `/supabase-demo` to see user info

## 🔒 Security Features

- **JWT Tokens**: Automatic token management
- **Session Management**: Secure session handling
- **Route Protection**: Middleware-based auth guards
- **CSRF Protection**: Built-in CSRF protection
- **Email Verification**: Optional email confirmation

## 📱 OAuth Providers

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`
6. Copy Client ID and Secret to Supabase

### Other Providers
Supabase supports many OAuth providers:
- GitHub
- Facebook
- Twitter
- Discord
- Apple
- And more...

## 🚨 Troubleshooting

### Common Issues

**"Invalid API key"**
- Check your `.env.local` file
- Ensure keys are copied correctly
- Restart your development server

**"Email not confirmed"**
- Check spam folder
- Verify email templates in Supabase
- Disable email confirmation in Supabase settings

**"OAuth redirect mismatch"**
- Check redirect URLs in provider settings
- Ensure URLs match exactly

### Debug Mode
Add to your `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_DEBUG=true
```

## 📚 Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Auth Helpers](https://github.com/supabase/auth-helpers)

## 🎯 Next Steps

1. **Customize UI**: Modify login/register forms
2. **Add User Profiles**: Create user profile management
3. **Role-Based Access**: Implement user roles and permissions
4. **Email Templates**: Customize authentication emails
5. **Analytics**: Add authentication analytics
