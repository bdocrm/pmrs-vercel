# 🚀 Supabase + Vercel Setup Guide for PMRS

## ✨ Why This Stack?

- **Supabase**: PostgreSQL database + authentication + real-time (free tier!)
- **Vercel**: Deploy Express API with zero configuration + free tier
- **No MongoDB Extension Needed**: Everything works out of the box

---

## Step 1: Create Supabase Project (5 minutes)

### 1.1 Sign Up
1. Go to https://supabase.com
2. Click "Sign Up"
3. Use GitHub, Google, or email
4. Create free account

### 1.2 Create Organization & Project
1. Click "New Project"
2. Select organization
3. **Project Name**: `pmrs`
4. **Database Password**: Create secure password (save it!)
5. **Region**: Choose closest to you
6. Click "Create"
7. Wait for database setup (2-3 minutes)

### 1.3 Get Your Credentials
1. Go to Settings → API
2. Copy these values (paste in `.env.local`):
   - **Project URL** → `SUPABASE_URL`
   - **Anon Public Key** → `SUPABASE_ANON_KEY`

**Example:**
```
SUPABASE_URL=https://abcxyzdefg.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 2: Create Database Tables (5 minutes)

### 2.1 Open SQL Editor
1. In Supabase dashboard
2. Left sidebar → SQL Editor
3. Click "New Query"

### 2.2 Create Users Table
Paste this SQL and click "Run":

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);
```

### 2.3 Create Transmittals Table
Paste this SQL and click "Run":

```sql
-- Create transmittals table
CREATE TABLE IF NOT EXISTS transmittals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  week_of_month INT,
  data JSONB NOT NULL,
  view_mode TEXT DEFAULT 'weekly',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transmittals_user_id ON transmittals(user_id);
CREATE INDEX IF NOT EXISTS idx_transmittals_date ON transmittals(date);

-- Enable RLS
ALTER TABLE transmittals ENABLE ROW LEVEL SECURITY;

-- Users can only see their own transmittals
CREATE POLICY "Users can view own transmittals" ON transmittals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transmittals" ON transmittals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transmittals" ON transmittals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transmittals" ON transmittals
  FOR DELETE USING (auth.uid() = user_id);
```

### 2.4 Insert Demo User
Paste this SQL and click "Run":

```sql
-- Insert demo user
INSERT INTO users (email, name, password_hash)
VALUES (
  'user@pmrs.com',
  'Demo User',
  '$2b$10$N9qo8uLOickgx2ZMRZoMye.qC3HVW0JvSXb.7D0J.5t8nVj/Vm5Rq'  -- bcrypt hash of 'password123'
)
ON CONFLICT DO NOTHING;
```

---

## Step 3: Update Environment Variables

### 3.1 Edit `.env.local`
Open `c:\xampp1\htdocs\pmrs-vercel\.env.local`

Replace with your Supabase credentials:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
JWT_SECRET=change-this-to-something-secure
NODE_ENV=development
PORT=3001
```

---

## Step 4: Test Locally (5 minutes)

### 4.1 Install Dependencies
```bash
cd c:\xampp1\htdocs\pmrs-vercel
npm install
```

### 4.2 Start Server
```bash
npm run dev
```

You should see:
```
✅ PMRS API running on port 3001
   Health check: http://localhost:3001/api/health
```

### 4.3 Test Health Check
Open in browser: http://localhost:3001/api/health

Expected response:
```json
{
  "status": "ok",
  "message": "PMRS API running on Vercel"
}
```

### 4.4 Test Login
```bash
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@pmrs.com","password":"password123"}'
```

Expected response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "xxx",
    "email": "user@pmrs.com",
    "name": "Demo User"
  }
}
```

---

## Step 5: Update Frontend Configuration

### 5.1 Update `js/config.js`

Change the API endpoint:

**From:**
```javascript
const API_BASE_URL = 'http://localhost/pmrs/api';
```

**To:**
```javascript
const API_BASE_URL = 'http://localhost:3001/api';
```

Or for production:
```javascript
const API_BASE_URL = 'https://your-vercel-app.vercel.app/api';
```

---

## Step 6: Deploy to Vercel (5 minutes)

### 6.1 Prepare for Deployment

Create `c:\xampp1\htdocs\pmrs-vercel\.gitignore`:
```
node_modules/
.env.local
.env.*.local
dist/
build/
```

### 6.2 Push to GitHub
```bash
cd c:\xampp1\htdocs\pmrs-vercel
git init
git add .
git commit -m "Initial commit: PMRS with Supabase"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pmrs-vercel.git
git push -u origin main
```

### 6.3 Deploy to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Click "Import"
5. Add environment variables:
   - `SUPABASE_URL`: Your Supabase URL
   - `SUPABASE_ANON_KEY`: Your Supabase key
   - `JWT_SECRET`: Your secret key
6. Click "Deploy"

Vercel will automatically:
- Build your project
- Deploy the API
- Give you a URL like `https://pmrs-vercel-xxx.vercel.app`

### 6.4 Update Frontend for Production
Update `js/config.js` with your Vercel URL:
```javascript
const API_BASE_URL = 'https://pmrs-vercel-xxx.vercel.app/api';
```

---

## Step 7: Add Custom Domain (Optional)

### 7.1 In Vercel Dashboard
1. Go to Settings → Domains
2. Add your domain
3. Follow DNS instructions

### 7.2 Result
Your API will be at:
- https://your-domain.com/api/login
- https://your-domain.com/api/transmittals/get
- etc.

---

## 📊 Current Architecture

```
┌─────────────────────┐
│   Frontend (HTML)   │  ← Your existing app
│   (js/css files)    │
└──────────┬──────────┘
           │ (fetch API)
           ↓
┌─────────────────────────────┐
│   Node.js API (Vercel)      │  ← New Express backend
│   api/index.js              │
└──────────┬──────────────────┘
           │ (SQL queries)
           ↓
┌─────────────────────────────┐
│   Supabase (PostgreSQL)     │  ← Cloud database
│   - users table             │
│   - transmittals table      │
└─────────────────────────────┘
```

---

## 🎯 API Endpoints

All endpoints require Authorization header:
```
Authorization: Bearer <your_token>
```

### Authentication
- `POST /api/login` - Login user
- `POST /api/logout` - Logout (client-side)
- `GET /api/user/get` - Get current user

### Transmittals
- `GET /api/transmittals/get` - Get all user transmittals
- `POST /api/transmittals/create` - Create new transmittal
- `PUT /api/transmittals/update` - Update transmittal
- `DELETE /api/transmittals/delete` - Delete transmittal

### Diagnostics
- `GET /api/health` - Health check
- `GET /api/debug` - Debug info

---

## 🔐 Security Checklist

- ✅ Row-level security (RLS) enabled on Supabase
- ✅ JWT tokens for authentication
- ✅ Bcrypt password hashing
- ✅ CORS enabled
- ✅ User isolation (can only access own data)

### For Production:
1. Change `JWT_SECRET` to a secure value
2. Enable HTTPS (Vercel does this automatically)
3. Set `NODE_ENV=production`
4. Use Supabase Team tier for backups

---

## ✅ What Works Now

- ✅ Local testing on `http://localhost:3001`
- ✅ Demo user login
- ✅ Full CRUD operations
- ✅ Ready for Vercel deployment
- ✅ PostgreSQL database with Supabase
- ✅ Zero MongoDB extension issues!

---

## 🚀 Next Steps

1. **Create Supabase account** (5 min)
2. **Create project & tables** (5 min)
3. **Update environment variables** (2 min)
4. **Test locally** (5 min)
5. **Deploy to Vercel** (5 min)
6. **Update frontend config** (2 min)

**Total time to production: ~25 minutes!**

---

## 📞 Troubleshooting

### "Failed to connect to Supabase"
- Check `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env.local`
- Restart server: `npm run dev`

### "Invalid credentials"
- Make sure demo user was created (see Step 2.4)
- Use `user@pmrs.com` / `password123`

### "Row level security violation"
- Ensure your UUID matches the logged-in user
- Check RLS policies in Supabase

### "CORS error"
- CORS is enabled by default
- If still getting errors, check Vercel logs

---

**Created**: January 16, 2026
**Status**: Ready for Setup
**Next**: Create Supabase account and follow steps above
