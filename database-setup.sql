-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'operator', -- 'admin' or 'operator'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  seat INT,
  goal DECIMAL(15, 2),
  goals JSONB, -- Store goals by type: {"Quality": 100, "Gross Transmittals": 500000, ...}
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drop existing transmittals table if it exists
DROP TABLE IF EXISTS transmittals CASCADE;

-- Create transmittals table (daily, weekly, monthly submissions)
CREATE TABLE transmittals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transmittal_type VARCHAR(50) NOT NULL, -- 'daily', 'weekly', 'monthly'
  goal_type VARCHAR(100), -- 'Quality', 'Gross Transmittals', 'Transmitted', 'Approvals', 'Conversion rate', 'Disbursement', 'Tap rate'
  gross_transmittals DECIMAL(15, 2),
  conversion_rate DECIMAL(5, 2),
  bookings DECIMAL(15, 2),
  approvals DECIMAL(15, 2),
  w1 DECIMAL(15, 2),
  w2 DECIMAL(15, 2),
  w3 DECIMAL(15, 2),
  w4 DECIMAL(15, 2),
  w5 DECIMAL(15, 2),
  week_number INT,
  month INT,
  year INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_transmittals_campaign_id ON transmittals(campaign_id);
CREATE INDEX idx_transmittals_user_id ON transmittals(user_id);
CREATE INDEX idx_transmittals_type ON transmittals(transmittal_type);

-- Insert sample campaigns (requires a user to exist first)
-- Note: Replace the user_id with actual user UUIDs from your users table
INSERT INTO campaigns (name, goal, user_id) VALUES
('BPI PA OUTBOUND', 100000, (SELECT id FROM users LIMIT 1)),
('BPI PA INBOUND', 100000, (SELECT id FROM users LIMIT 1)),
('BPI PL', 150000, (SELECT id FROM users LIMIT 1)),
('BPI BL', 120000, (SELECT id FROM users LIMIT 1)),
('BPI FF', 80000, (SELECT id FROM users LIMIT 1)),
('MB ACQ', 110000, (SELECT id FROM users LIMIT 1)),
('MB PL', 130000, (SELECT id FROM users LIMIT 1)),
('MB PA', 95000, (SELECT id FROM users LIMIT 1)),
('BDO SGM', 140000, (SELECT id FROM users LIMIT 1)),
('BDO CIE', 105000, (SELECT id FROM users LIMIT 1)),
('BDO SUPPLE', 90000, (SELECT id FROM users LIMIT 1)),
('BDO VC', 115000, (SELECT id FROM users LIMIT 1)),
('BDO NTH CARD', 125000, (SELECT id FROM users LIMIT 1)),
('AXA', 160000, (SELECT id FROM users LIMIT 1)),
('AXA CLP', 135000, (SELECT id FROM users LIMIT 1)),
('CBC', 100000, (SELECT id FROM users LIMIT 1)),
('CBC HPL', 145000, (SELECT id FROM users LIMIT 1)),
('MEDICARD', 120000, (SELECT id FROM users LIMIT 1))
ON CONFLICT DO NOTHING;
