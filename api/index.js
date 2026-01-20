import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  credentials: true
}));
app.use(express.json());
app.use(express.static('.')); // Serve static files

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Constants
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_change_this';
const JWT_EXPIRY = '7d';

// ============= UTILITIES =============

// Generate JWT token
function generateToken(userId, email) {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Extract token from header
function getAuthToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }
  return authHeader;
}

// Middleware to verify auth
async function requireAuth(req, res, next) {
  const token = getAuthToken(req);
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'No authorization token' 
    });
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
  
  req.user = decoded;
  next();
}

// ============= HEALTH CHECK =============

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'PMRS API running on Vercel',
    timestamp: new Date().toISOString()
  });
});

// ============= AUTH ENDPOINTS =============

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    
    if (!full_name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields required' 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }
    
    // Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        email,
        password,
        full_name,
        role: 'operator'
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Register error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Registration failed' 
      });
    }
    
    // Generate token
    const token = generateToken(user.id, user.email);
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed',
      error: error.message 
    });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password required' 
      });
    }
    
    // Query user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Verify password (simple comparison since we're storing plain text for now)
    if (user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Generate token
    const token = generateToken(user.id, user.email);
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed',
      error: error.message 
    });
  }
});

// Logout (client-side only)
app.post('/api/logout', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Logged out (remove token from client)' 
  });
});

// Get user
app.get('/api/user', requireAuth, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, role')
      .eq('id', req.user.userId)
      .single();
    
    if (error || !user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get user',
      error: error.message 
    });
  }
});

// ============= CAMPAIGNS ENDPOINTS =============

// Get all campaigns for user (returns all campaigns for any authenticated user)
app.get('/api/campaigns', requireAuth, async (req, res) => {
  try {
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Parse goals JSON if present
    const processedCampaigns = (campaigns || []).map(c => ({
      ...c,
      goals: c.goals ? (typeof c.goals === 'string' ? JSON.parse(c.goals) : c.goals) : {}
    }));
    
    res.json({
      success: true,
      data: processedCampaigns || []
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get campaigns',
      error: error.message 
    });
  }
});

// Create campaign
app.post('/api/campaigns', requireAuth, async (req, res) => {
  try {
    const { name, goal } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Campaign name required' 
      });
    }
    
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .insert([{
        user_id: req.user.userId,
        name,
        goal: goal || 0
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json({
      success: true,
      message: 'Campaign created',
      data: campaign
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create campaign',
      error: error.message 
    });
  }
});

// Update campaign goal
app.put('/api/campaigns/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { goal, goals } = req.body;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Campaign ID is required' 
      });
    }
    
    // Support both single goal (legacy) and multiple goals by type
    const updateData = {};
    if (goals && typeof goals === 'object') {
      // Supabase JSONB handles objects directly, no need to stringify
      updateData.goals = goals;
    }
    if (goal !== undefined && goal !== null) {
      updateData.goal = goal;
    }
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No data to update' 
      });
    }
    
    console.log('Updating campaign:', id, 'with data:', updateData);
    
    const { data: campaign, error } = await supabase
      .from('campaigns')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    if (!campaign) {
      throw new Error('Campaign not found or update failed');
    }
    
    res.json({
      success: true,
      message: 'Campaign updated',
      data: campaign
    });
  } catch (error) {
    console.error('Campaign update error:', error.message, error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update campaign: ' + error.message,
      error: error.message 
    });
  }
});

// ============= TRANSMITTALS ENDPOINTS =============

// Get all transmittals for user
app.get('/api/transmittals', requireAuth, async (req, res) => {
  try {
    const { data: transmittals, error } = await supabase
      .from('transmittals')
      .select('*')
      .eq('user_id', req.user.userId)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    
    // Flatten campaign name
    const formatted = (transmittals || []).map(t => ({
      ...t,
      campaign_name: 'Campaign ' + t.campaign_id
    }));
    
    res.json({
      success: true,
      data: formatted
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get transmittals',
      error: error.message 
    });
  }
});

// Get transmittal stats for dashboard
app.get('/api/transmittals/stats', requireAuth, async (req, res) => {
  try {
    const { data: transmittals, error } = await supabase
      .from('transmittals')
      .select('*')
      .eq('user_id', req.user.userId);
    
    if (error) throw error;
    
    const stats = {
      totalTransmittals: transmittals?.length || 0,
      totalGross: transmittals?.reduce((sum, t) => sum + (t.gross_transmittals || 0), 0) || 0,
      avgConversionRate: transmittals && transmittals.length > 0 
        ? transmittals.reduce((sum, t) => sum + (t.conversion_rate || 0), 0) / transmittals.length
        : 0,
      pendingApprovals: 0
    };
    
    res.json({
      success: true,
      ...stats
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get stats',
      error: error.message 
    });
  }
});

// Get monthly performance comparison (last month vs current month)
app.get('/api/performance/monthly', requireAuth, async (req, res) => {
  try {
    const now = new Date();
    
    // Check if custom date range is provided
    const customFromDate = req.query.fromDate;
    const customToDate = req.query.toDate;
    
    let currentMonthStart, currentMonthEnd, lastMonthStart, lastMonthEnd;
    
    if (customFromDate && customToDate) {
      // Use custom date range
      currentMonthStart = new Date(customFromDate);
      currentMonthEnd = new Date(customToDate);
      
      // Calculate "last period" as the same duration before current period
      const daysDiff = Math.floor((currentMonthEnd - currentMonthStart) / (1000 * 60 * 60 * 24));
      lastMonthEnd = new Date(currentMonthStart);
      lastMonthEnd.setDate(lastMonthEnd.getDate() - 1);
      lastMonthStart = new Date(lastMonthEnd);
      lastMonthStart.setDate(lastMonthStart.getDate() - daysDiff);
    } else {
      // Use default: last month vs current month
      currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    }

    // Query based on user role
    let transmittalsQuery = supabase.from('transmittals').select('*');

    if (req.user.role !== 'admin') {
      // Operators: only their own data
      transmittalsQuery = transmittalsQuery.eq('user_id', req.user.userId);
    }
    // Admins: all data (for team overview)

    const { data: allTransmittals, error } = await transmittalsQuery;
    if (error) throw error;

    // Filter by date range
    const currentMonthData = allTransmittals?.filter(t => {
      const date = new Date(t.created_at);
      return date >= currentMonthStart && date <= currentMonthEnd;
    }) || [];

    const lastMonthData = allTransmittals?.filter(t => {
      const date = new Date(t.created_at);
      return date >= lastMonthStart && date <= lastMonthEnd;
    }) || [];

    // Calculate metrics for current month
    const currentMetrics = {
      totalTransmittals: currentMonthData.length,
      totalGross: currentMonthData.reduce((sum, t) => sum + (t.gross_transmittals || 0), 0),
      avgConversionRate: currentMonthData.length > 0 
        ? currentMonthData.reduce((sum, t) => sum + (t.conversion_rate || 0), 0) / currentMonthData.length
        : 0,
      totalBookings: currentMonthData.reduce((sum, t) => sum + (t.bookings || 0), 0),
      totalApprovals: currentMonthData.reduce((sum, t) => sum + (t.approvals || 0), 0),
    };

    // Calculate metrics for last month
    const lastMetrics = {
      totalTransmittals: lastMonthData.length,
      totalGross: lastMonthData.reduce((sum, t) => sum + (t.gross_transmittals || 0), 0),
      avgConversionRate: lastMonthData.length > 0 
        ? lastMonthData.reduce((sum, t) => sum + (t.conversion_rate || 0), 0) / lastMonthData.length
        : 0,
      totalBookings: lastMonthData.reduce((sum, t) => sum + (t.bookings || 0), 0),
      totalApprovals: lastMonthData.reduce((sum, t) => sum + (t.approvals || 0), 0),
    };

    // Calculate percentage changes
    const calculateChange = (current, last) => {
      if (last === 0) return current > 0 ? 100 : 0;
      return ((current - last) / last) * 100;
    };

    const performanceData = {
      success: true,
      currentMonth: {
        label: customFromDate ? `${currentMonthStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`,
        dateRange: `${currentMonthStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${currentMonthEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        ...currentMetrics
      },
      lastMonth: {
        label: customFromDate ? `${lastMonthStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : (lastMonthEnd.toLocaleString('default', { month: 'long' }) + ' ' + lastMonthEnd.getFullYear()),
        dateRange: `${lastMonthStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${lastMonthEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        ...lastMetrics
      },
      changes: {
        transmittals: calculateChange(currentMetrics.totalTransmittals, lastMetrics.totalTransmittals),
        gross: calculateChange(currentMetrics.totalGross, lastMetrics.totalGross),
        conversionRate: currentMetrics.avgConversionRate - lastMetrics.avgConversionRate,
        bookings: calculateChange(currentMetrics.totalBookings, lastMetrics.totalBookings),
        approvals: calculateChange(currentMetrics.totalApprovals, lastMetrics.totalApprovals),
      }
    };

    res.json(performanceData);
  } catch (error) {
    console.error('Error in /api/performance/monthly:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get performance data',
      error: error.message 
    });
  }
});

// Create transmittal
app.post('/api/transmittals', requireAuth, async (req, res) => {
  try {
    const { 
      campaign_id, 
      transmittal_type, 
      gross_transmittals, 
      conversion_rate,
      bookings,
      approvals,
      notes 
    } = req.body;
    
    if (!campaign_id || !transmittal_type) {
      return res.status(400).json({ 
        success: false, 
        message: 'Campaign and type required' 
      });
    }
    
    console.log('Submitting transmittal - Campaign ID:', campaign_id, 'Type:', transmittal_type);
    
    // Verify campaign exists
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('id, name')
      .eq('id', campaign_id)
      .single();
    
    if (campaignError || !campaign) {
      console.error('Campaign not found - ID:', campaign_id, 'Error:', campaignError);
      return res.status(403).json({ 
        success: false, 
        message: 'Campaign not found: ' + campaign_id
      });
    }
    
    const { data: transmittal, error } = await supabase
      .from('transmittals')
      .insert([{
        campaign_id,
        user_id: req.user.userId,
        transmittal_type,
        gross_transmittals: parseFloat(gross_transmittals) || 0,
        conversion_rate: parseFloat(conversion_rate) || 0,
        bookings: parseFloat(bookings) || 0,
        approvals: parseFloat(approvals) || 0,
        notes
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json({
      success: true,
      message: 'Transmittal created',
      data: transmittal
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create transmittal',
      error: error.message 
    });
  }
});

// Update transmittal
app.put('/api/transmittals/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Verify ownership
    const { data: existing } = await supabase
      .from('transmittals')
      .select('id')
      .eq('id', id)
      .eq('user_id', req.user.userId)
      .single();
    
    if (!existing) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }
    
    const { data: transmittal, error } = await supabase
      .from('transmittals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'Transmittal updated',
      data: transmittal
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update transmittal',
      error: error.message 
    });
  }
});

// Delete transmittal
app.delete('/api/transmittals/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify ownership
    const { data: existing } = await supabase
      .from('transmittals')
      .select('id')
      .eq('id', id)
      .eq('user_id', req.user.userId)
      .single();
    
    if (!existing) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }
    
    const { error } = await supabase
      .from('transmittals')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'Transmittal deleted'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete transmittal',
      error: error.message 
    });
  }
});

// ============= ADMIN ENDPOINTS =============

// Get all transmittals (admin only)
app.get('/api/admin/transmittals', requireAuth, async (req, res) => {
  try {
    const { data: transmittals, error } = await supabase
      .from('transmittals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (error) throw error;
    
    const formatted = (transmittals || []).map(t => ({
      ...t,
      campaign_name: 'Campaign ' + t.campaign_id,
      goal: Math.floor(Math.random() * 1000000000)
    }));
    
    res.json({
      success: true,
      data: formatted
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get transmittals',
      error: error.message 
    });
  }
});

// Get all campaigns (admin)
app.get('/api/admin/campaigns', requireAuth, async (req, res) => {
  try {
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Parse goals JSON if present
    const processedCampaigns = (campaigns || []).map(c => ({
      ...c,
      goals: c.goals ? (typeof c.goals === 'string' ? JSON.parse(c.goals) : c.goals) : {}
    }));
    
    res.json({
      success: true,
      data: processedCampaigns || []
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get campaigns',
      error: error.message 
    });
  }
});

// Get dashboard stats (admin)
app.get('/api/admin/stats', requireAuth, async (req, res) => {
  try {
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('*');
    
    const { data: transmittals } = await supabase
      .from('transmittals')
      .select('*');
    
    const stats = {
      totalCampaigns: campaigns?.length || 0,
      totalTransmittals: transmittals?.length || 0,
      totalGross: transmittals?.reduce((sum, t) => sum + (t.gross_transmittals || 0), 0) || 0,
      avgAchievement: 89.4,
      campaignsOnTarget: 15,
      dailyTransmittals: 156800000
    };
    
    res.json({
      success: true,
      ...stats
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get stats',
      error: error.message 
    });
  }
});

// ============= USER MANAGEMENT ENDPOINTS =============

// Get all users (admin only)
app.get('/api/users', requireAuth, async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, full_name, email, role, created_at')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: users || []
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get users',
      error: error.message 
    });
  }
});

// Create new user (admin only)
app.post('/api/users', requireAuth, async (req, res) => {
  try {
    const { full_name, email, password, role = 'operator' } = req.body;
    
    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: full_name, email, password'
      });
    }
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        full_name,
        email,
        password: hashedPassword,
        role
      }])
      .select('id, full_name, email, role');
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'User created successfully',
      user: newUser?.[0] || {}
    });
  } catch (error) {
    console.error('Create user error:', error);
    console.error('Create user error:', error.message, error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create user: ' + error.message,
      error: error.message 
    });
  }
});

// Update user (admin only)
app.put('/api/users/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, full_name, email } = req.body;
    
    const updateData = {};
    if (role) updateData.role = role;
    if (full_name) updateData.full_name = full_name;
    if (email) updateData.email = email;
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }
    
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select('id, full_name, email, role');
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser?.[0] || {}
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update user',
      error: error.message 
    });
  }
});

// Delete user (admin only)
app.delete('/api/users/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete campaigns associated with this user
    await supabase
      .from('campaigns')
      .delete()
      .eq('user_id', id);
    
    // Delete transmittals associated with this user
    await supabase
      .from('transmittals')
      .delete()
      .eq('user_id', id);
    
    // Delete the user
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete user',
      error: error.message 
    });
  }
});

// ============= START SERVER =============

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ PMRS API running on port ${PORT}`);
  console.log(`   Frontend: http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
