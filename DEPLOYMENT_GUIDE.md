# 🚀 Complete Deployment Guide: PMRS to Vercel

## Overview

This guide covers deploying PMRS with:
- **Frontend**: Static HTML/CSS/JS deployed to Vercel
- **Backend**: Node.js Express API on Vercel
- **Database**: Supabase (PostgreSQL) for data persistence
- **Hosting**: Vercel (free tier!)

---

## Architecture

```
                        Your Domain
                              │
                              ↓
                    ┌──────────────────┐
                    │ Vercel (CDN)     │
                    │ - Serving files  │
                    │ - API routing    │
                    └────────┬─────────┘
                             │
                ┌────────────┴────────────┐
                ↓                         ↓
        Frontend (HTML/CSS/JS)      API (Node.js)
        └────────────────────┘     └─────────────┘
                                         │
                                         ↓
                                   Supabase
                                (PostgreSQL)
```

---

## Prerequisites

- [ ] GitHub account (for code storage)
- [ ] Vercel account (free at https://vercel.com)
- [ ] Supabase account (free at https://supabase.com)
- [ ] Node.js 18+ installed locally
- [ ] Git installed

---

## Phase 1: Local Setup (10 minutes)

### 1.1 Organize Your Project

```
c:\xampp1\htdocs\pmrs-vercel\
├── api/
│   └── index.js              # Express server
├── public/
│   ├── index.html            # Frontend
│   ├── js/
│   │   ├── config.js
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   └── app.js
│   └── css/
│       └── styles.css
├── .env.local                # Your secrets
├── .gitignore
├── package.json
├── vercel.json
└── SUPABASE_SETUP.md
```

### 1.2 Copy Frontend Files

Copy all these files from old location to `public/`:
- `index.html`
- `js/*.js` (all JavaScript files)
- `css/*.css` (all CSS files)

### 1.3 Install Dependencies

```bash
cd c:\xampp1\htdocs\pmrs-vercel
npm install
```

Expected output:
```
added 50 packages in 5s
```

### 1.4 Create `.env.local`

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_key_here
JWT_SECRET=super-secret-key-change-in-production
NODE_ENV=development
PORT=3001
```

### 1.5 Test Locally

```bash
npm run dev
```

Visit: http://localhost:3001 (should see login page)

---

## Phase 2: Supabase Setup (15 minutes)

Follow the complete guide in `SUPABASE_SETUP.md`:

1. Create Supabase project
2. Get credentials
3. Run SQL to create tables
4. Insert demo user
5. Update `.env.local`

**Credential Example:**
```env
SUPABASE_URL=https://abcxyzdefg.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Phase 3: Git Setup (5 minutes)

### 3.1 Initialize Git

```bash
cd c:\xampp1\htdocs\pmrs-vercel

git init
git add .
git commit -m "Initial commit: PMRS with Supabase and Vercel"
```

### 3.2 Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name**: `pmrs-vercel`
3. **Description**: PMRS Supabase Vercel
4. **Visibility**: Public (recommended for free tier)
5. Click "Create repository"

### 3.3 Push to GitHub

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pmrs-vercel.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Phase 4: Vercel Deployment (5 minutes)

### 4.1 Connect to Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Click "Import Git Repository"
5. Search for `pmrs-vercel`
6. Click "Import"

### 4.2 Configure Environment

**Environment Variables:**

| Variable | Value |
|----------|-------|
| SUPABASE_URL | `https://your-project.supabase.co` |
| SUPABASE_ANON_KEY | `your_anon_key...` |
| JWT_SECRET | `your-secret-key` |

Paste these and click "Deploy"

### 4.3 Wait for Deployment

Vercel will:
- Build your project (1 min)
- Deploy to CDN (30 sec)
- Give you a URL (e.g., `https://pmrs-vercel-xxx.vercel.app`)

### 4.4 Test Deployment

Your app is now live at: `https://pmrs-vercel-xxx.vercel.app`

Test:
1. Open the URL in your browser
2. You should see the login page
3. Login with: `user@pmrs.com` / `password123`
4. Click Dashboard
5. Create a new transmittal
6. Verify it saves!

---

## Phase 5: Custom Domain (Optional)

### 5.1 Add Domain to Vercel

1. In Vercel dashboard
2. Settings → Domains
3. Enter your domain (e.g., `pmrs.yourdomain.com`)
4. Follow DNS instructions

### 5.2 Update Frontend

Edit `js/config.js`:

```javascript
const API_BASE_URL = 'https://pmrs.yourdomain.com/api';
```

### 5.3 Update Frontend Deployment

```bash
git add js/config.js
git commit -m "Update API endpoint to custom domain"
git push
```

Vercel auto-deploys! (Usually 2-3 minutes)

---

## Phase 6: Continuous Integration (CI/CD)

### How It Works

Every time you push to GitHub:
1. Vercel automatically builds your project
2. Runs tests (optional)
3. Deploys to production
4. Your site updates automatically!

### To Update in Future

```bash
# Make changes
git add .
git commit -m "Your description"
git push

# Wait 2-3 minutes for automatic deployment
```

---

## 🔍 Monitoring & Debugging

### Check Deployment Status

1. Go to https://vercel.com/dashboard
2. Click on `pmrs-vercel`
3. See recent deployments
4. Check logs for errors

### View API Logs

1. In Vercel dashboard
2. Click "Functions" tab
3. Select `api/index.js`
4. See real-time logs

### Test API Endpoints

```bash
# Test health check
curl https://pmrs-vercel-xxx.vercel.app/api/health

# Test login
curl -X POST https://pmrs-vercel-xxx.vercel.app/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@pmrs.com","password":"password123"}'
```

---

## 📈 Performance Optimization

### 1. Enable Caching

Vercel automatically caches static assets. No config needed!

### 2. Monitor Performance

1. In Vercel dashboard
2. Analytics tab
3. See real-time metrics

### 3. Database Optimization

Supabase tips:
- Indexes on frequently queried columns (already done)
- Connection pooling (automatic)
- Enable caching for repeated queries (in Supabase settings)

---

## 🔐 Security Checklist

- ✅ Store secrets in environment variables
- ✅ Use HTTPS (automatic with Vercel)
- ✅ Enable RLS on Supabase tables
- ✅ JWT tokens for authentication
- ✅ Bcrypt password hashing
- ✅ CORS properly configured

### Secrets Management

**Local Development:**
- Store in `.env.local`
- Never commit this file

**Production:**
- Set in Vercel dashboard
- No environment file needed

---

## 💰 Cost Breakdown

| Service | Cost |
|---------|------|
| Vercel | Free (5GB bandwidth/month) |
| Supabase | Free ($10/month tier available) |
| Domain | ~$1-15/year (optional) |
| **Total** | **Free to $15/year** |

### If You Need More

**Supabase Pro Tier**: $25/month
- 10GB database storage
- 500GB data transfer
- Advanced features

**Vercel Pro**: $20/month
- Unlimited bandwidth
- Team collaboration
- Advanced analytics

---

## 🚀 Scaling for Production

### When You Have Users

1. **Database**: Upgrade Supabase tier
2. **API**: Vercel handles scaling automatically
3. **Frontend**: CDN caching automatically enabled

### Multi-Region Setup

Vercel deploys to edge locations worldwide. Your API is fast everywhere!

---

## ✅ Deployment Checklist

- [ ] GitHub repository created
- [ ] Supabase project created
- [ ] Database tables created
- [ ] Environment variables configured
- [ ] Project imported to Vercel
- [ ] Environment variables added to Vercel
- [ ] Deployment successful
- [ ] Login works
- [ ] Create transmittal works
- [ ] Data persists in database
- [ ] Optional: Custom domain configured

---

## 📞 Troubleshooting

### Deployment Fails

**Error: "Cannot find module 'express'"**
- Solution: `npm install` and push again

**Error: "SUPABASE_URL is undefined"**
- Solution: Add environment variables in Vercel dashboard

**Error: "Database connection failed"**
- Solution: Check SUPABASE_URL and SUPABASE_ANON_KEY are correct

### Login Not Working

1. Check Supabase demo user exists:
   ```sql
   SELECT * FROM users WHERE email = 'user@pmrs.com';
   ```

2. Check API logs in Vercel dashboard

3. Test API directly:
   ```bash
   curl -X POST https://your-url.vercel.app/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"user@pmrs.com","password":"password123"}'
   ```

### Changes Not Appearing

1. Force refresh: `Ctrl+Shift+R`
2. Check deployment in Vercel (might still building)
3. Check browser console for errors (F12)

---

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Login page loads
- ✅ Can login with demo credentials
- ✅ Dashboard loads with empty table
- ✅ Can add a transmittal
- ✅ Can refresh page, data still there (in database!)
- ✅ Can logout and login again

---

## Next Steps

1. **Follow Supabase setup** (15 min) - See `SUPABASE_SETUP.md`
2. **Setup GitHub** (5 min) - Create repository
3. **Deploy to Vercel** (5 min) - Import and deploy
4. **Test everything** (5 min) - Verify all features work
5. **Optional**: Add custom domain

**Total time to production: ~35 minutes!**

---

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Express.js**: https://expressjs.com
- **PostgreSQL**: https://postgresql.org

---

**Created**: January 16, 2026
**Version**: 1.0.0
**Status**: Ready for Deployment
**Next**: Start with Supabase setup
