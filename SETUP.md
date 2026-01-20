# PMRS Transmittal Management System

A professional web-based transmittal management system with user authentication, dashboard, and data submission forms.

## Features

✅ User Registration & Login
✅ Professional Dashboard with Stats
✅ Campaign Management
✅ Transmittal Submission (Daily/Weekly/Monthly)
✅ Real-time Data Tracking
✅ Responsive Design
✅ JWT Authentication

## Setup Instructions

### 1. Database Setup

1. Go to your Supabase Dashboard
2. Click **SQL Editor** → **New Query**
3. Copy and paste the contents of `database-setup.sql`
4. Click **Run**

This creates:
- `users` table
- `campaigns` table  
- `transmittals` table

### 2. Create Sample Data (Optional)

If you want to test with sample campaigns, run this SQL:

```sql
-- Insert a sample user
INSERT INTO users (email, password, full_name, role) 
VALUES ('test@example.com', 'password123', 'John Doe', 'operator');

-- Get the user ID from above and replace 'USER_ID_HERE' with the actual ID, then:
INSERT INTO campaigns (user_id, name, goal) 
VALUES ('USER_ID_HERE', 'BPI PA Outbound', 897300000.00);

INSERT INTO campaigns (user_id, name, goal) 
VALUES ('USER_ID_HERE', 'BPI PA Inbound', 65700000.00);
```

### 3. Start the Server

```bash
npm run dev
```

The server will run on `http://localhost:3000`

### 4. Access the Application

Open your browser to: **http://localhost:3000**

## Login Credentials (After DB Setup)

**Email:** test@example.com  
**Password:** password123

Or create a new account through the signup page.

## How to Use

### Dashboard
- View stats on total transmittals, gross transmittals, conversion rates
- See recent transmittal submissions
- Quick access to submit new transmittals

### Submit Transmittal
1. Click "Submit New" in sidebar
2. Select a campaign
3. Choose submission type (Daily/Weekly/Monthly)
4. Fill in data:
   - Gross Transmittals (USD)
   - Conversion Rate (%)
   - Bookings (USD)
   - Approvals (USD)
5. Add optional notes
6. Submit

### Campaigns
- View all your campaigns
- See campaign goals and transmittal history

## File Structure

```
pmrs-vercel/
├── api/
│   └── index.js              # Express API server
├── css/
│   └── styles.css            # Stylesheet
├── js/
│   └── app.js                # Frontend application
├── index.html                # Main page
├── database-setup.sql        # Supabase SQL setup
├── .env                      # Environment variables
├── package.json              # Dependencies
└── README.md                 # This file
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout

### Campaigns  
- `GET /api/campaigns` - Get user's campaigns
- `POST /api/campaigns` - Create new campaign

### Transmittals
- `GET /api/transmittals` - Get all transmittals
- `GET /api/transmittals/stats` - Get dashboard stats
- `POST /api/transmittals` - Create transmittal
- `PUT /api/transmittals/:id` - Update transmittal
- `DELETE /api/transmittals/:id` - Delete transmittal

## Technology Stack

- **Backend:** Node.js, Express.js
- **Database:** Supabase (PostgreSQL)
- **Authentication:** JWT
- **Frontend:** Vanilla HTML/CSS/JavaScript
- **Styling:** Custom CSS with responsive design

## Environment Variables (.env)

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
JWT_SECRET=your_jwt_secret_key_here
```

## Troubleshooting

### Port Already in Use
If port 3000 is in use, set a different port:
```bash
PORT=3001 npm run dev
```

### Database Connection Issues
1. Check your `.env` file has correct Supabase URL and key
2. Verify tables were created in Supabase
3. Check network connectivity

### Login Not Working
1. Ensure you've created a user in the database
2. Check the password matches exactly
3. Check browser console for error messages

## Future Enhancements

- [ ] Admin dashboard with user management
- [ ] Advanced filtering and search
- [ ] Data export (CSV/Excel)
- [ ] Email notifications
- [ ] Historical data comparison
- [ ] Performance analytics

## Support

For issues or questions, check the console logs in your terminal and browser developer tools.
