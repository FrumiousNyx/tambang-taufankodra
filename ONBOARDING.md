# Customer Onboarding Guide

Welcome to PT Semen Nusantara Web Platform! This guide helps you get started quickly.

## Phase 1: Account Setup (Day 1)

### 1.1 Receive Admin Credentials
- You'll receive an email with:
  - Admin username (email)
  - Temporary password
  - Access link: `https://semen-nusantara.com/auth`

### 1.2 First Login
1. Click the access link
2. Enter credentials
3. **Recommended**: Set up 2FA (two-factor authentication)
4. Change your password to something secure

### 1.3 Team Onboarding
- Invite additional admin users via `/admin` portal
- The primary admin can create sub-admin accounts
- Each user gets audit-logged access to submissions

## Phase 2: Configuration (Days 2-3)

### 2.1 Customize Contact Form Settings
- Go to `/admin` > Settings
- Configure form fields and validation rules
- Set up automatic notifications (email/Slack)
- Test reCAPTCHA integration

### 2.2 Integration Setup
**Email Notifications**:
- Set `CONTACT_NOTIFY_URL` to your webhook receiver
- Example payload:
```json
{
  "type": "contact_submission",
  "payload": {
    "name": "John Doe",
    "email": "john@company.com",
    "message": "...",
    "created_at": "2026-02-09T10:00:00Z"
  }
}
```

**Webhook Receivers**:
- Zapier (recommended for non-technical users)
- Make.com (formerly Integromat)
- Custom HTTP endpoint

### 2.3 Analytics Setup
1. Connect Google Analytics (optional)
   - Add your GA4 property ID: `VITE_GA_ID=G-XXXXXXXXXX`
   - Data flows automatically
2. Monitor visitor behavior and form conversions

## Phase 3: Day-to-Day Operations (Week 1+)

### 3.1 Viewing Submissions
1. Log in to `/admin`
2. View live submission table
3. Filter by date, email, project type
4. Click row for full details

### 3.2 Exporting Data
1. Click "Export CSV" button
2. File downloads as `submissions.csv`
3. Import into Excel/Google Sheets for analysis
4. All exports are audit-logged

### 3.3 Responding to Contacts
- **Manual Process**: Download CSV and email contacts directly
- **Automated**: Set up webhook → CRM integration
- **Follow-up**: No auto-responses (configure yourself if desired)

## Phase 4: Monitoring & Maintenance (Ongoing)

### 4.1 Health Checks
- **Uptime**: Check https://status.semen-nusantara.com
- **Performance**: Vercel Analytics dashboard
- **Errors**: Sentry dashboard (if configured)

### 4.2 Regular Tasks
**Weekly**:
- Review new submissions
- Check for errors in Sentry
- Monitor performance metrics

**Monthly**:
- Download and archive submissions CSV
- Review analytics trends
- Update team members as needed

**Quarterly**:
- Security audit of access logs
- Backup verification
- Performance optimization

### 4.3 Troubleshooting

**Form Not Loading?**
- Check internet connection
- Clear browser cache (Ctrl+Shift+Del or Cmd+Shift+Del)
- Try incognito mode
- Report to support@semen-nusantara.com

**Submissions Not Appearing?**
- Verify reCAPTCHA is enabled
- Check rate limiting (max 5 submissions/minute per IP)
- Review admin audit logs for errors

**Export Not Working?**
- Ensure you're logged in with admin role
- Check browser popup blocker
- Try a different browser

## Phase 5: Advanced Features (Optional)

### 5.1 Custom Domains
- Request custom domain in SLA Package
- DNS setup: CNAME to `cname.vercel-dns.com`
- SSL/TLS automatic (Vercel managed)

### 5.2 White-label Portal
- Rebrand admin portal with your logo
- Custom domain + SSL
- Custom CSS styling (contact support)

### 5.3 SSO (Single Sign-On)
- Configure SAML/OIDC with your identity provider
- Admin users auto-provisioned from your AD/IdP
- Contact support for setup

### 5.4 Audit Logs
- View all admin activities: `/admin/audit-logs`
- Search by user, action, date range
- Export for compliance

## Security Best Practices

1. **Password Management**
   - Use strong, unique passwords (16+ chars, mixed types)
   - Store in password manager (1Password, LastPass, etc.)
   - Never share credentials

2. **2FA (Two-Factor Authentication)**
   - Enabled recommended for all admins
   - Use authenticator app (Google Auth, Authy)
   - Save backup codes

3. **Access Control**
   - Grant minimal necessary permissions
   - Review user access quarterly
   - Remove inactive users

4. **Data Handling**
   - Downloaded CSVs contain PII - handle securely
   - Don't share files over unsecured channels
   - Delete old exports after archival

## Support Resources

| Need | Contact | Response Time |
|------|---------|----------------|
| General questions | support@semen-nusantara.com | 24 hours |
| Technical issues | support@semen-nusantara.com | 4 hours (Premium) |
| Security incident | security@semen-nusantara.com | 2 hours |
| Billing | billing@semen-nusantara.com | 48 hours |
| Emergency hotline (24/7) | +62-XXX-XXXX-XXXX | 30 minutes |

## FAQ

**Q: Can I customize the contact form fields?**
A: Yes, via admin portal Settings. Adding/removing fields requires developer assist.

**Q: How long are submissions retained?**
A: Default 2 years. Configure via SLA Package.

**Q: Can I integrate with my CRM?**
A: Yes, via webhook + Zapier/Make.com or custom integration.

**Q: What happens if we exceed the rate limit?**
A: Submissions are rejected with error message. Limit: 5/minute per IP.

**Q: Is there a mobile app?**
A: No, but admin portal is fully responsive for tablets/phones.

**Q: How do I cancel the service?**
A: 30 days notice. All data provided in CSV format before termination.

---
**Onboarding Support**: contact support@semen-nusantara.com for scheduling setup call.
**Next Steps**: Complete Phase 1 today, then follow Phases 2-5 at your pace.
