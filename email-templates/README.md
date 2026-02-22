# UQ Messenger Email Templates

Custom branded email templates for Supabase authentication.

## Setup Instructions

### 1. Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your UQ project: `wjzgbedvltnlzjataavt`
3. Navigate to: **Authentication → Email Templates**

### 2. Configure Magic Link Email

1. Click on **"Magic Link"** template
2. Replace the default content with the custom template
3. Copy the content from either:
   - `magic-link.html` (HTML version - recommended)
   - `magic-link.txt` (Plain text version)

### 3. Supabase Template Variables

The templates use these Supabase variables:
- `{{ .ConfirmationURL }}` - The magic link URL
- `{{ .SiteURL }}` - Your app URL (configure in Supabase settings)
- `{{ .Token }}` - The auth token
- `{{ .TokenHash }}` - The token hash

### 4. Configure Site URL

Make sure to set your Site URL in Supabase:

1. Go to: **Authentication → URL Configuration**
2. Set **Site URL** to your production domain:
   - Development: `http://localhost:5173`
   - Production: `https://yourdomain.com`
3. Add **Redirect URLs**:
   - `http://localhost:5173/**`
   - `https://yourdomain.com/**`

### 5. Test the Email

1. Go to your UQ login page
2. Request a magic link
3. Check your email for the new branded template

## Template Features

✅ UQ branding with Windows 98 aesthetic
✅ Flower logo (🌺) and ICQ-style colors
✅ Clear call-to-action button
✅ Feature highlights for new users
✅ Mobile-responsive design
✅ Plain text fallback
✅ Security messaging (1-hour expiry)

## Customization

To further customize the template:
- Edit the HTML/CSS in `magic-link.html`
- Change colors to match your brand
- Add your own logo image (host it and add `<img>` tag)
- Modify the feature list
- Update footer links

## Other Email Templates

You may also want to customize these Supabase templates:
- **Confirm Signup** - Email confirmation for new users
- **Invite User** - Team/contact invitations
- **Reset Password** - Password reset emails (if you add password auth)
- **Change Email Address** - Email change confirmation

## Troubleshooting

**Email not sending?**
- Check Supabase email settings are configured
- Verify SMTP settings if using custom SMTP
- Check spam folder

**Template not applying?**
- Make sure you saved the template in Supabase dashboard
- Clear browser cache
- Test with a new email address

**Styling broken?**
- Some email clients strip CSS
- Keep styles inline for better compatibility
- Test with multiple email clients (Gmail, Outlook, etc.)

## Support

For issues or questions:
- Check Supabase docs: https://supabase.com/docs/guides/auth/auth-email-templates
- UQ GitHub: https://github.com/LoFiTerminal/uq
