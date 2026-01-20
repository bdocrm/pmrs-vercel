/**
 * js/config.js - Application Configuration
 * Updated for Supabase + Vercel
 */

// ============= API CONFIGURATION =============

// Development (Local Node.js server)
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

const API_BASE_URL = isDevelopment 
  ? 'http://localhost:3001/api'  // Local Node.js server
  : 'https://pmrs-vercel-xxx.vercel.app/api';  // Update with your Vercel URL

// ============= STORAGE KEYS =============

const STORAGE_KEYS = {
  TOKEN: 'pmrs_auth_token',
  USER: 'pmrs_user',
  TRANSMITTALS: 'pmrs_transmittals'
};

// ============= DEMO MODE =============

const DEMO_MODE = {
  ENABLED: true,  // Always allow demo mode as fallback
  DEMO_USER: {
    email: 'user@pmrs.com',
    password: 'password123'
  },
  DEMO_TOKEN: 'demo_token_' + Date.now()
};

// ============= CALCULATION CONSTANTS =============

const CALCULATIONS = {
  WEEKS_PER_MONTH: 5,
  DAYS_PER_MONTH: 31,
  WORKING_DAYS_PER_WEEK: 5
};

// ============= UI CONFIG =============

const UI_CONFIG = {
  THEME: 'light',
  DATE_FORMAT: 'YYYY-MM-DD',
  CURRENCY: 'USD'
};

// ============= DEBUG =============

// Enable console logging in development
const DEBUG = isDevelopment;

if (DEBUG) {
  console.log('🔧 PMRS Configuration Loaded');
  console.log('   API Base URL:', API_BASE_URL);
  console.log('   Environment:', isDevelopment ? 'Development' : 'Production');
  console.log('   Demo Mode:', DEMO_MODE.ENABLED);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    API_BASE_URL,
    STORAGE_KEYS,
    DEMO_MODE,
    CALCULATIONS,
    UI_CONFIG,
    DEBUG
  };
}
