# Admin Tutorial Guide

## Quick Start (5 minutes)

### Step 1: Log In
1. Go to `https://semen-nusantara.com/auth`
2. Enter your email and password
3. Click "Sign In"

### Step 2: Navigate to Admin Portal
1. After login, go to `https://semen-nusantara.com/admin`
2. You should see a table with contact submissions

### Step 3: View Submissions
- **Table shows**: Email, Phone, Project Type, Project Value, Location, Message
- **Columns visible**: First 8 fields (scroll right for more)
- **Action**: Click refresh to load latest submissions

### Step 4: Export Data
1. Click **Export CSV** button
2. File `submissions.csv` downloads automatically
3. Open in Excel or Google Sheets
4. Analyze and share with team

---

## Detailed Features

## 1. Dashboard Overview

### Submission Table
| Column | Description |
|--------|-------------|
| email | Customer email address |
| phone | Contact phone number |
| project_type | Type: residential, commercial, industrial, infrastructure |
| project_value | Project budget: <1M, 1-5M, 5-10M, >10M |
| location | Geographic location (city, province) |
| message | Full project description |
| request_proposal | Boolean: did customer request a proposal? |
| created_at | Submission timestamp |

### Controls
- **Refresh Button**: Load latest submissions
- **Export CSV**: Download all submissions as CSV file
- **Limit Selector**: Show 100, 200, 500, or 1000 submissions per page

---

## 2. Common Tasks

### Task: Find submissions from a specific date
1. Export CSV (all data)
2. Open in Google Sheets or Excel
3. Use Filter > Filter by date range
4. Share filtered list with team

### Task: Identify high-value opportunities
1. Export CSV
2. Filter by `project_value > "5-10M"`
3. Sort by `created_at` (newest first)
4. Contact top prospects first

### Task: Respond to submission
1. Find submission in table or CSV
2. Copy customer email
3. Compose email (use CRM or Gmail)
4. Example template:
```
Subject: Re: Penawaran Semen Nusantara untuk Proyek Anda

Yth. [Customer Name],

Terima kasih atas pertanyaan Anda mengenai produk semen Nusantara.

Kami telah menerima permintaan untuk [Project Type] di [Location] dengan nilai estimasi [Project Value].

Berikut informasi yang Anda minta:
- Spesifikasi produk: [...]
- Harga khusus: [...]
- Pengiriman: dapat dalam 1-2 minggu
- Garansi kualitas: [...]

Untuk pertanyaan lebih lanjut, hubungi tim sales kami di [phone/email].

Salam hormat,
PT Semen Nusantara
```

### Task: Track response rate
1. Export CSV every week
2. Count submissions and responses
3. Calculate: Response% = Responses / Submissions
4. Target: 50%+ response rate

### Task: Identify trending project types
1. Export CSV (last 30 days)
2. Pivot table by `project_type`
3. Count entries per type
4. Analyze which products are popular

---

## 3. Best Practices

### Security
- ✅ **DO**: Use strong password (16+ chars, mixed case, numbers, symbols)
- ✅ **DO**: Enable 2FA for account protection
- ✅ **DO**: Log out when done
- ❌ **DON'T**: Share password with colleagues
- ❌ **DON'T**: Download CSVs on public WiFi
- ❌ **DON'T**: Leave browser unattended while logged in

### Data Management
- ✅ **DO**: Download and archive CSV monthly
- ✅ **DO**: Back up csv files to secure location
- ✅ **DO**: Review submissions daily
- ❌ **DON'T**: Store passwords in CSV files
- ❌ **DON'T**: Share CSVs via unsecured email

### Performance
- ✅ **DO**: Respond to inquiries within 24 hours
- ✅ **DO**: Track follow-up in CRM
- ✅ **DO**: Monitor submission volume (unusual spikes?)
- ❌ **DON'T**: Let submissions pile up unanswered

---

## 4. Troubleshooting

### Admin Portal Not Loading
**Problem**: Page shows blank or error
**Solution**:
1. Refresh page (F5 or Cmd+R)
2. Clear cache: Ctrl+Shift+Del (or Cmd+Shift+Del on Mac)
3. Try incognito/private mode
4. Try different browser
5. If still failing, email support@semen-nusantara.com

### CSV Export Not Working
**Problem**: Export button not responsive
**Solution**:
1. Check browser popup blocker (allow semen-nusantara.com)
2. Ensure you're logged in with admin role
3. Check if table has data (need ≥1 submission to export)
4. Try another browser
5. Contact support if persistent

### Slow Loading / Timeout
**Problem**: Page slow or times out
**Solution**:
1. Check internet connection
2. Reduce `Limit` value (try 100 instead of 1000)
3. Wait 30 seconds before clicking again
4. Try during off-peak hours (early morning)
5. Report to support with browser/OS info

### "Unauthorized" Error
**Problem**: Shows 401 or 403 error
**Solution**:
1. Log out and log in again
2. Check if your account has `admin` role
3. Check if password recently changed
4. Try different browser
5. Contact support to verify account permissions

---

## 5. Advanced Usage

### Integration with CRM
1. **Option A**: Manual copy-paste
   - Export CSV
   - Import into CRM (Salesforce, HubSpot, Pipedrive)
   
2. **Option B**: Webhook auto-sync
   - Email support for webhook setup
   - Configure custom endpoint
   - Receive real-time notifications

3. **Option C**: Zapier/Make.com
   - No coding required
   - Auto-create CRM leads
   - Set up notifications

### Analytics Reporting
1. Export CSV monthly
2. Create charts in Google Sheets:
   - Line chart: submissions over time
   - Pie chart: submissions by project type
   - Bar chart: submissions by location
3. Share dashboards with management

### Team Collaboration
1. Download CSV
2. Share with team via Slack/Teams
3. Use shared Google Sheet for live tracking
4. Assign leads and track responses

---

## 6. FAQ for Admins

**Q: Why does it say "Not authenticated"?**
A: Your JWT token expired. Log out and log in again.

**Q: Can I delete submissions?**
A: Not via UI currently. Contact support to delete specific records.

**Q: What if I accidentally reject/delete a submission?**
A: Submissions are archived. Contact support to recover (within 30 days).

**Q: How often should I check for new submissions?**
A: Daily recommended. Set reminder in email for new submissions.

**Q: Can I customize form fields?**
A: Yes, contact support for custom form configuration.

**Q: How secure is the exported CSV?**
A: Contains PII. Keep secure, don't share via unencrypted email.

**Q: What if form is getting spam?**
A: reCAPTCHA is enabled. If still spam, contact support to increase rate limits.

**Q: Can I invite other admins?**
A: Contact primary admin or support to provision new admin users.

---

## 7. Keyboard Shortcuts

- **F5**: Refresh page
- **Ctrl+A**: Select all
- **Ctrl+C**: Copy
- **Ctrl+V**: Paste
- **Ctrl+S**: Save (if in edit mode)
- **Esc**: Close dialogs

---

## 8. Contact & Support

| Need | Contact | Response Time |
|------|---------|----------------|
| How-to questions | support@semen-nusantara.com | 24 hours |
| Technical issues | support@semen-nusantara.com | 4 hours (Premium) |
| Urgent issues | +62-XXX-XXXX-XXXX | 30 minutes |

---

**Last Updated**: February 2026
**Version**: 1.0
