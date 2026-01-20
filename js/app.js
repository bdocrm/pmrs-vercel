// ============= API CONFIGURATION =============
const API_BASE = 'http://localhost:3000';
let currentUser = null;
let currentPage = 'dashboard';

// ============= UTILITIES =============
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Don't send token for login/register endpoints
    if (!endpoint.includes('/api/login') && !endpoint.includes('/api/register')) {
        const token = localStorage.getItem('token');
        if (token && token !== 'undefined' && token !== 'null') {
            options.headers['Authorization'] = `Bearer ${token}`;
        }
    }

    if (data) options.body = JSON.stringify(data);

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const result = await response.json();
        
        if (!response.ok) {
            if (response.status === 401 && !endpoint.includes('/api/login')) {
                // Only logout on 401 for protected endpoints
                logout();
                return null;
            }
            throw new Error(result.message || 'API Error');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

function setToken(token) {
    localStorage.setItem('token', token);
}

function getToken() {
    return localStorage.getItem('token');
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    renderLoginPage();
}

// ============= PAGE RENDERING =============
function render(content) {
    document.getElementById('app').innerHTML = content;
}

function renderLoginPage() {
    const html = `
        <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 50%, #f0f3f7 100%); padding: 1rem;">
            <div style="width: 100%; max-width: 420px;">
                <!-- Card Container -->
                <div style="background: white; border-radius: 12px; padding: 3rem 2rem; box-shadow: 0 4px 20px rgba(22, 13, 118, 0.08); border: 1px solid #e8ecf1;">
                    
                    <!-- Logo & Header Section -->
                    <div style="text-align: center; margin-bottom: 2.5rem;">
                        <img src="assets/image/asynx.png" alt="PMRS Logo" style="height: 56px; width: auto; margin-bottom: 1.5rem; object-fit: contain;">
                        <h1 style="font-size: 2rem; font-weight: 700; color: #160d76; margin: 0 0 0.5rem 0; font-family: 'Cardo', serif;">Welcome back</h1>
                        <p style="font-size: 0.95rem; color: #64748b; margin: 0; font-weight: 400;">Manage transmittals efficiently</p>
                    </div>

                    <!-- Message Display -->
                    <div id="auth-message" style="margin-bottom: 1.5rem;"></div>

                    <!-- Login Form -->
                    <form id="login-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
                        
                        <!-- Email Field -->
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <label for="email" style="font-size: 0.875rem; font-weight: 600; color: #222222;">Email address</label>
                            <input type="email" id="email" name="email" placeholder="name@company.com" required style="padding: 0.75rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; font-family: 'Open Sans', sans-serif; background: white; color: #222222; transition: all 0.2s ease; outline: none;" onblur="this.style.borderColor='#cbd5e1'" onfocus="this.style.borderColor='#4094d9'" onhover="this.style.borderColor='#94a3b8'">
                        </div>
                        
                        <!-- Password Field -->
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <label for="password" style="font-size: 0.875rem; font-weight: 600; color: #222222;">Password</label>
                                <a href="#" onclick="alert('Contact your administrator to reset password'); return false;" style="font-size: 0.8rem; font-weight: 600; color: #4094d9; text-decoration: none; transition: color 0.2s ease;" onmouseover="this.style.color='#F08530'" onmouseout="this.style.color='#4094d9'">Forgot password?</a>
                            </div>
                            <input type="password" id="password" name="password" placeholder="Enter your password" required style="padding: 0.75rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; font-family: 'Open Sans', sans-serif; background: white; color: #222222; transition: all 0.2s ease; outline: none;" onblur="this.style.borderColor='#cbd5e1'" onfocus="this.style.borderColor='#4094d9'" onhover="this.style.borderColor='#94a3b8'">
                        </div>

                        <!-- Remember me -->
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding-top: 0.5rem;">
                            <input type="checkbox" name="remember" style="width: 18px; height: 18px; cursor: pointer; accent-color: #4094d9; border-radius: 4px;">
                            <span style="font-size: 0.875rem; color: #475569; font-weight: 500;">Keep me logged in</span>
                        </label>

                        <!-- Sign In Button -->
                        <button type="submit" style="margin-top: 1rem; padding: 0.875rem 1rem; background: linear-gradient(135deg, #160d76 0%, #4094d9 100%); color: white; font-weight: 700; font-size: 0.95rem; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 0.5px;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(22, 13, 118, 0.25)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(22, 13, 118, 0.15)'">
                            Sign In
                        </button>
                    </form>

                    <!-- Footer -->
                    <div style="text-align: center; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0;">
                        <p style="font-size: 0.8rem; color: #94a3b8; margin: 0; font-weight: 500;">
                            © 2026 PMRS. Transmittal Management System.
                        </p>
                    </div>
                </div>

                <!-- Decorative Element -->
                <div style="text-align: center; margin-top: 2rem;">
                    <p style="font-size: 0.75rem; color: #cbd5e1; letter-spacing: 1px; text-transform: uppercase;">Automated Smart Intelligence</p>
                </div>
            </div>
        </div>
    `;
    render(html);
    
    document.getElementById('login-form').addEventListener('submit', handleLogin);
}

async function renderDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    const html = `
        <div class="dashboard-container">
            <div class="sidebar">
                <div class="sidebar-logo">
                    📊 PMRS
                </div>
                <ul class="sidebar-nav">
                    <li><a href="#" onclick="goTo('dashboard')" class="active">Dashboard</a></li>
                    ${user.role === 'admin' ? '<li><a href="#" onclick="goTo(\'manager\')">Manager Dashboard</a></li>' : ''}
                    <li><a href="#" onclick="goTo('transmittals')">My Transmittals</a></li>
                    <li><a href="#" onclick="goTo('campaigns')">Campaigns</a></li>
                    <li><a href="#" onclick="goTo('submit')">Submit New</a></li>
                </ul>
                <div class="sidebar-footer">
                    <div class="user-info">
                        <strong>${user.full_name}</strong><br>
                        ${user.role}
                    </div>
                    <button class="btn-logout" onclick="logout()">Logout</button>
                </div>
            </div>
            <div class="main-content">
                <div class="header">
                    <h1>Dashboard</h1>
                </div>
                <div id="dashboard-content"></div>
            </div>
        </div>
    `;
    render(html);
    
    // Load dashboard stats
    await loadDashboardStats();
}

async function loadDashboardStats() {
    const contentDiv = document.getElementById('dashboard-content');
    
    if (!contentDiv) {
        console.error('❌ dashboard-content element not found');
        return;
    }
    
    // Load both current stats and monthly performance
    const [stats, performanceData] = await Promise.all([
        apiCall('/api/transmittals/stats'),
        apiCall('/api/performance/monthly')
    ]);
    
    if (!stats) {
        contentDiv.innerHTML = '<p class="error-message">Failed to load stats</p>';
        return;
    }

    // Helper function to format change indicator
    const getChangeIndicator = (change, isPercentage = true) => {
        const suffix = isPercentage ? '%' : '';
        if (change > 0) {
            return `<span class="trend-up">📈 +${Math.abs(change).toFixed(1)}${suffix}</span>`;
        } else if (change < 0) {
            return `<span class="trend-down">📉 ${change.toFixed(1)}${suffix}</span>`;
        } else {
            return `<span class="trend-neutral">➡️ 0${suffix}</span>`;
        }
    };

    const performanceHTML = performanceData?.success ? `
        <div class="section">
            <h2>📊 Sales Performance</h2>
            <div style="margin-bottom: 20px; padding: 15px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 12px; align-items: flex-end;">
                    <div>
                        <label style="display: block; font-size: 12px; font-weight: 600; color: #666; margin-bottom: 6px; text-transform: uppercase;">From Date</label>
                        <input type="date" id="perf-from-date" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                    </div>
                    <div>
                        <label style="display: block; font-size: 12px; font-weight: 600; color: #666; margin-bottom: 6px; text-transform: uppercase;">To Date</label>
                        <input type="date" id="perf-to-date" style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                    </div>
                    <div>
                        <button onclick="applyPerformanceFilter()" style="padding: 8px 16px; background: var(--brand-blue); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">🔍 Filter</button>
                    </div>
                    <div>
                        <button onclick="resetPerformanceFilter()" style="padding: 8px 16px; background: #6b7280; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;">↻ Reset</button>
                    </div>
                </div>
            </div>
            <div class="performance-grid">
                <div class="performance-card">
                    <div class="performance-metric">
                        <span class="metric-label">Gross Transmittals</span>
                        <div class="metric-values">
                            <div class="current">
                                <span class="month-label">${performanceData.currentMonth.label}</span>
                                <span class="date-range">${performanceData.currentMonth.dateRange}</span>
                                <div class="value">${(performanceData.currentMonth.totalGross || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}</div>
                            </div>
                            <div class="comparison">vs</div>
                            <div class="previous">
                                <span class="month-label">${performanceData.lastMonth.label}</span>
                                <span class="date-range">${performanceData.lastMonth.dateRange}</span>
                                <div class="value">${(performanceData.lastMonth.totalGross || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}</div>
                            </div>
                        </div>
                        <div class="change-indicator">
                            ${getChangeIndicator(performanceData.changes.gross, true)}
                        </div>
                    </div>
                </div>

                <div class="performance-card">
                    <div class="performance-metric">
                        <span class="metric-label">Transmittals Count</span>
                        <div class="metric-values">
                            <div class="current">
                                <span class="month-label">${performanceData.currentMonth.label}</span>
                                <div class="value">${performanceData.currentMonth.totalTransmittals}</div>
                            </div>
                            <div class="comparison">vs</div>
                            <div class="previous">
                                <span class="month-label">${performanceData.lastMonth.label}</span>
                                <div class="value">${performanceData.lastMonth.totalTransmittals}</div>
                            </div>
                        </div>
                        <div class="change-indicator">
                            ${getChangeIndicator(performanceData.changes.transmittals, true)}
                        </div>
                    </div>
                </div>

                <div class="performance-card">
                    <div class="performance-metric">
                        <span class="metric-label">Avg Conversion Rate</span>
                        <div class="metric-values">
                            <div class="current">
                                <span class="month-label">${performanceData.currentMonth.label}</span>
                                <div class="value">${(performanceData.currentMonth.avgConversionRate || 0).toFixed(1)}%</div>
                            </div>
                            <div class="comparison">vs</div>
                            <div class="previous">
                                <span class="month-label">${performanceData.lastMonth.label}</span>
                                <div class="value">${(performanceData.lastMonth.avgConversionRate || 0).toFixed(1)}%</div>
                            </div>
                        </div>
                        <div class="change-indicator">
                            ${getChangeIndicator(performanceData.changes.conversionRate, false)}
                        </div>
                    </div>
                </div>

                <div class="performance-card">
                    <div class="performance-metric">
                        <span class="metric-label">Bookings</span>
                        <div class="metric-values">
                            <div class="current">
                                <span class="month-label">${performanceData.currentMonth.label}</span>
                                <div class="value">${performanceData.currentMonth.totalBookings}</div>
                            </div>
                            <div class="comparison">vs</div>
                            <div class="previous">
                                <span class="month-label">${performanceData.lastMonth.label}</span>
                                <div class="value">${performanceData.lastMonth.totalBookings}</div>
                            </div>
                        </div>
                        <div class="change-indicator">
                            ${getChangeIndicator(performanceData.changes.bookings, true)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ` : '';

    const html = `
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Transmittals</h3>
                <div class="value">${stats.totalTransmittals || 0}</div>
                <div class="trend">This month</div>
            </div>
            <div class="stat-card success">
                <h3>Gross Transmittals</h3>
                <div class="value">${(stats.totalGross || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}</div>
                <div class="trend">Current period</div>
            </div>
            <div class="stat-card warning">
                <h3>Avg Conversion Rate</h3>
                <div class="value">${(stats.avgConversionRate || 0).toFixed(1)}%</div>
                <div class="trend">Last 7 days</div>
            </div>
            <div class="stat-card danger">
                <h3>Pending Approvals</h3>
                <div class="value">${stats.pendingApprovals || 0}</div>
                <div class="trend">Action needed</div>
            </div>
        </div>

        ${performanceHTML}

        <div class="section">
            <div class="section-header">
                <h2>Recent Transmittals</h2>
                <button class="btn btn-secondary" onclick="goTo('submit')">+ New Transmittal</button>
            </div>
            <div class="table-responsive" id="recent-table">
                <div class="loader"></div>
            </div>
        </div>
    `;
    
    contentDiv.innerHTML = html;
    
    // Set default dates (last month to current month)
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const formatDate = (date) => date.toISOString().split('T')[0];
    
    const fromDateInput = document.getElementById('perf-from-date');
    const toDateInput = document.getElementById('perf-to-date');
    
    if (fromDateInput) fromDateInput.value = formatDate(lastMonthStart);
    if (toDateInput) toDateInput.value = formatDate(currentMonthEnd);
    
    // Load recent transmittals
    const transmittals = await apiCall('/api/transmittals');
    renderTransmittalsTable(transmittals?.data || []);
}

// Apply custom date range filter for performance
async function applyPerformanceFilter() {
    const fromDateInput = document.getElementById('perf-from-date');
    const toDateInput = document.getElementById('perf-to-date');
    
    if (!fromDateInput || !toDateInput) {
        alert('Date inputs not found');
        return;
    }
    
    const fromDate = fromDateInput.value;
    const toDate = toDateInput.value;
    
    if (!fromDate || !toDate) {
        alert('Please select both dates');
        return;
    }
    
    // Call API with custom date range as query parameters
    const performanceData = await apiCall(`/api/performance/monthly?fromDate=${fromDate}&toDate=${toDate}`, 'GET');
    
    if (performanceData?.success) {
        updatePerformanceDisplay(performanceData);
    } else {
        alert('Failed to load performance data for selected dates');
    }
}

// Reset to default date range (last month vs current month)
async function resetPerformanceFilter() {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const formatDate = (date) => date.toISOString().split('T')[0];
    
    const fromDateInput = document.getElementById('perf-from-date');
    const toDateInput = document.getElementById('perf-to-date');
    
    if (fromDateInput) fromDateInput.value = formatDate(lastMonthStart);
    if (toDateInput) toDateInput.value = formatDate(currentMonthEnd);
    
    // Reload with default dates
    const performanceData = await apiCall('/api/performance/monthly');
    if (performanceData?.success) {
        updatePerformanceDisplay(performanceData);
    }
}

// Update performance display with new data
function updatePerformanceDisplay(performanceData) {
    const getChangeIndicator = (change, isPercentage = true) => {
        const suffix = isPercentage ? '%' : '';
        if (change > 0) {
            return `<span class="trend-up">📈 +${Math.abs(change).toFixed(1)}${suffix}</span>`;
        } else if (change < 0) {
            return `<span class="trend-down">📉 ${change.toFixed(1)}${suffix}</span>`;
        } else {
            return `<span class="trend-neutral">➡️ 0${suffix}</span>`;
        }
    };

    const cardsHTML = `
        <div class="performance-card">
            <div class="performance-metric">
                <span class="metric-label">Gross Transmittals</span>
                <div class="metric-values">
                    <div class="current">
                        <span class="month-label">${performanceData.currentMonth.label}</span>
                        <span class="date-range">${performanceData.currentMonth.dateRange}</span>
                        <div class="value">${(performanceData.currentMonth.totalGross || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}</div>
                    </div>
                    <div class="comparison">vs</div>
                    <div class="previous">
                        <span class="month-label">${performanceData.lastMonth.label}</span>
                        <span class="date-range">${performanceData.lastMonth.dateRange}</span>
                        <div class="value">${(performanceData.lastMonth.totalGross || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}</div>
                    </div>
                </div>
                <div class="change-indicator">
                    ${getChangeIndicator(performanceData.changes.gross, true)}
                </div>
            </div>
        </div>

        <div class="performance-card">
            <div class="performance-metric">
                <span class="metric-label">Transmittals Count</span>
                <div class="metric-values">
                    <div class="current">
                        <span class="month-label">${performanceData.currentMonth.label}</span>
                        <span class="date-range">${performanceData.currentMonth.dateRange}</span>
                        <div class="value">${performanceData.currentMonth.totalTransmittals}</div>
                    </div>
                    <div class="comparison">vs</div>
                    <div class="previous">
                        <span class="month-label">${performanceData.lastMonth.label}</span>
                        <span class="date-range">${performanceData.lastMonth.dateRange}</span>
                        <div class="value">${performanceData.lastMonth.totalTransmittals}</div>
                    </div>
                </div>
                <div class="change-indicator">
                    ${getChangeIndicator(performanceData.changes.transmittals, true)}
                </div>
            </div>
        </div>

        <div class="performance-card">
            <div class="performance-metric">
                <span class="metric-label">Avg Conversion Rate</span>
                <div class="metric-values">
                    <div class="current">
                        <span class="month-label">${performanceData.currentMonth.label}</span>
                        <span class="date-range">${performanceData.currentMonth.dateRange}</span>
                        <div class="value">${(performanceData.currentMonth.avgConversionRate || 0).toFixed(1)}%</div>
                    </div>
                    <div class="comparison">vs</div>
                    <div class="previous">
                        <span class="month-label">${performanceData.lastMonth.label}</span>
                        <span class="date-range">${performanceData.lastMonth.dateRange}</span>
                        <div class="value">${(performanceData.lastMonth.avgConversionRate || 0).toFixed(1)}%</div>
                    </div>
                </div>
                <div class="change-indicator">
                    ${getChangeIndicator(performanceData.changes.conversionRate, false)}
                </div>
            </div>
        </div>

        <div class="performance-card">
            <div class="performance-metric">
                <span class="metric-label">Bookings</span>
                <div class="metric-values">
                    <div class="current">
                        <span class="month-label">${performanceData.currentMonth.label}</span>
                        <span class="date-range">${performanceData.currentMonth.dateRange}</span>
                        <div class="value">${performanceData.currentMonth.totalBookings}</div>
                    </div>
                    <div class="comparison">vs</div>
                    <div class="previous">
                        <span class="month-label">${performanceData.lastMonth.label}</span>
                        <span class="date-range">${performanceData.lastMonth.dateRange}</span>
                        <div class="value">${performanceData.lastMonth.totalBookings}</div>
                    </div>
                </div>
                <div class="change-indicator">
                    ${getChangeIndicator(performanceData.changes.bookings, true)}
                </div>
            </div>
        </div>

        <div class="performance-card">
            <div class="performance-metric">
                <span class="metric-label">Approvals</span>
                <div class="metric-values">
                    <div class="current">
                        <span class="month-label">${performanceData.currentMonth.label}</span>
                        <span class="date-range">${performanceData.currentMonth.dateRange}</span>
                        <div class="value">${performanceData.currentMonth.totalApprovals}</div>
                    </div>
                    <div class="comparison">vs</div>
                    <div class="previous">
                        <span class="month-label">${performanceData.lastMonth.label}</span>
                        <span class="date-range">${performanceData.lastMonth.dateRange}</span>
                        <div class="value">${performanceData.lastMonth.totalApprovals}</div>
                    </div>
                </div>
                <div class="change-indicator">
                    ${getChangeIndicator(performanceData.changes.approvals, true)}
                </div>
            </div>
        </div>
    `;

    const gridContainer = document.querySelector('.performance-grid');
    if (gridContainer) {
        gridContainer.innerHTML = cardsHTML;
    }
}

function renderTransmittalsTable(transmittals) {
    const container = document.getElementById('recent-table');
    
    if (!container) {
        console.warn('recent-table container not found');
        return;
    }
    
    if (!transmittals || transmittals.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-light);">No transmittals yet</p>';
        return;
    }

    const rows = transmittals.map(t => `
        <tr>
            <td>${t.campaign_name || 'Unnamed'}</td>
            <td><span class="badge badge-${t.transmittal_type}">${t.transmittal_type}</span></td>
            <td>${(t.gross_transmittals || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
            <td>${(t.conversion_rate || 0).toFixed(1)}%</td>
            <td>${new Date(t.created_at).toLocaleDateString()}</td>
        </tr>
    `).join('');

    const html = `
        <table>
            <thead>
                <tr>
                    <th>Campaign</th>
                    <th>Type</th>
                    <th>Gross Transmittals</th>
                    <th>Conversion Rate</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}

function renderSubmitForm() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    const html = `
        <div class="dashboard-container">
            <div class="sidebar">
                <div class="sidebar-logo">
                    📊 PMRS
                </div>
                <ul class="sidebar-nav">
                    <li><a href="#" onclick="goTo('dashboard')">Dashboard</a></li>
                    <li><a href="#" onclick="goTo('transmittals')">My Transmittals</a></li>
                    <li><a href="#" onclick="goTo('campaigns')">Campaigns</a></li>
                    <li><a href="#" onclick="goTo('submit')" class="active">Submit New</a></li>
                </ul>
                <div class="sidebar-footer">
                    <div class="user-info">
                        <strong>${user.full_name}</strong><br>
                        ${user.role}
                    </div>
                    <button class="btn-logout" onclick="logout()">Logout</button>
                </div>
            </div>
            <div class="main-content">
                <div class="header">
                    <h1>Submit Transmittal</h1>
                </div>
                <div class="section form-container">
                    <div id="form-message"></div>
                    <form id="submit-form">
                        <div class="form-group">
                            <label for="campaign_id">Campaign</label>
                            <select id="campaign_id" name="campaign_id" required>
                                <option value="">Select a campaign...</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="goal_type">Goal Type</label>
                            <select id="goal_type" name="goal_type" required onchange="updateGoalDisplay()">
                                <option value="">Select goal type...</option>
                                <option value="Quality">Quality</option>
                                <option value="Gross Transmittals">Gross Transmittals</option>
                                <option value="Transmitted">Transmitted</option>
                                <option value="Approvals">Approvals</option>
                                <option value="Conversion rate">Conversion Rate (%)</option>
                                <option value="Disbursement">Disbursement</option>
                                <option value="Tap rate">Tap Rate (%)</option>
                            </select>
                            <small style="display: block; margin-top: 5px; color: #666;">
                                📊 Current Goal: <strong style="color: #2563eb;" id="current-goal-display">-</strong>
                            </small>
                        </div>

                        <div class="form-group">
                            <label for="transmittal_type">Submission Type</label>
                            <select id="transmittal_type" name="transmittal_type" required onchange="toggleWeeklyFields()">
                                <option value="">Select type...</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>

                        <div id="weekly-fields" style="display:none;">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="w1">W1</label>
                                    <input type="number" id="w1" name="w1" step="0.01" min="0" placeholder="Week 1">
                                </div>
                                <div class="form-group">
                                    <label for="w2">W2</label>
                                    <input type="number" id="w2" name="w2" step="0.01" min="0" placeholder="Week 2">
                                </div>
                                <div class="form-group">
                                    <label for="w3">W3</label>
                                    <input type="number" id="w3" name="w3" step="0.01" min="0" placeholder="Week 3">
                                </div>
                                <div class="form-group">
                                    <label for="w4">W4</label>
                                    <input type="number" id="w4" name="w4" step="0.01" min="0" placeholder="Week 4">
                                </div>
                                <div class="form-group">
                                    <label for="w5">W5</label>
                                    <input type="number" id="w5" name="w5" step="0.01" min="0" placeholder="Week 5">
                                </div>
                            </div>
                        </div>

                        <div id="daily-monthly-field" class="form-group">
                            <label for="amount">Amount</label>
                            <input type="number" id="amount" name="amount" step="0.01" min="0" placeholder="Enter amount">
                        </div>

                        <div class="form-grid">
                            <div class="form-group">
                                <label for="conversion_rate">Conversion Rate (%)</label>
                                <input type="number" id="conversion_rate" name="conversion_rate" step="0.01" min="0" max="100">
                            </div>
                            <div class="form-group">
                                <label for="bookings">Bookings</label>
                                <input type="number" id="bookings" name="bookings" step="0.01" min="0">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="approvals">Approvals</label>
                            <input type="number" id="approvals" name="approvals" step="0.01" min="0">
                        </div>

                        <div class="form-group full">
                            <label for="notes">Notes (Optional)</label>
                            <textarea id="notes" name="notes" placeholder="e.g., FINAL, UNOFFICIAL, Status update..."></textarea>
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Submit Transmittal</button>
                            <button type="button" class="btn btn-secondary" onclick="goTo('dashboard')">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    render(html);
    
    loadCampaigns();
    document.getElementById('submit-form').addEventListener('submit', handleSubmitTransmittal);
}

async function loadCampaigns() {
    const select = document.getElementById('campaign_id');
    if (!select) {
        console.error('Campaign select element not found');
        return;
    }
    
    try {
        const campaigns = await apiCall('/api/campaigns');
        
        // Store campaigns globally for use in updateGoalDisplay
        window.campaignsList = campaigns?.data || [];
        
        if (!campaigns?.data || campaigns.data.length === 0) {
            console.warn('No campaigns returned from API:', campaigns);
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No campaigns available';
            select.appendChild(option);
            return;
        }
        
        campaigns.data.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.name;
            select.appendChild(option);
            console.log(`  ✓ Campaign: "${c.name}" (ID: ${c.id})`);
        });
        
        // Add change handler to update goal display
        select.addEventListener('change', updateGoalDisplay);
        console.log(`✅ Campaigns loaded successfully: ${campaigns.data.length} campaigns added to dropdown`);
    } catch (error) {
        console.error('Error loading campaigns:', error);
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Error loading campaigns';
        select.appendChild(option);
    }
}

function updateGoalDisplay() {
    const campaignId = document.getElementById('campaign_id').value;
    const goalType = document.getElementById('goal_type').value;
    const displayElement = document.getElementById('current-goal-display');
    
    if (!campaignId || !goalType) {
        displayElement.textContent = '-';
        return;
    }
    
    const campaign = window.campaignsList?.find(c => c.id === campaignId);
    if (!campaign) {
        displayElement.textContent = '-';
        return;
    }
    
    const goals = campaign.goals || {};
    const goal = goals[goalType] || 0;
    
    if (goal === 0) {
        displayElement.textContent = 'No goal set';
        displayElement.style.color = '#ef4444';
    } else {
        displayElement.textContent = goal.toLocaleString();
        displayElement.style.color = '#10b981';
    }
}

function toggleWeeklyFields() {
    const type = document.getElementById('transmittal_type').value;
    const weeklyFields = document.getElementById('weekly-fields');
    const dailyField = document.getElementById('daily-monthly-field');
    
    if (type === 'weekly') {
        weeklyFields.style.display = 'grid';
        dailyField.style.display = 'none';
    } else {
        weeklyFields.style.display = 'none';
        dailyField.style.display = 'block';
    }
}

async function renderTransmittalsPage() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    const html = `
        <div class="dashboard-container">
            <div class="sidebar">
                <div class="sidebar-logo">
                    📊 PMRS
                </div>
                <ul class="sidebar-nav">
                    <li><a href="#" onclick="goTo('dashboard')">Dashboard</a></li>
                    <li><a href="#" onclick="goTo('transmittals')" class="active">My Transmittals</a></li>
                    <li><a href="#" onclick="goTo('campaigns')">Campaigns</a></li>
                    <li><a href="#" onclick="goTo('submit')">Submit New</a></li>
                </ul>
                <div class="sidebar-footer">
                    <div class="user-info">
                        <strong>${user.full_name}</strong><br>
                        ${user.role}
                    </div>
                    <button class="btn-logout" onclick="logout()">Logout</button>
                </div>
            </div>
            <div class="main-content">
                <div class="header">
                    <h1>My Transmittals</h1>
                </div>
                <div id="transmittals-content" class="section"></div>
            </div>
        </div>
    `;
    render(html);
    loadTransmittalsData();
}

async function loadTransmittalsData() {
    const transmittals = await apiCall('/api/transmittals');
    const container = document.getElementById('transmittals-content');
    
    if (!transmittals?.data || transmittals.data.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px;">No transmittals submitted yet</p>';
        return;
    }
    
    let html = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background-color: #f3f4f6; border-bottom: 2px solid #e5e7eb;">
                    <th style="padding: 12px; text-align: left;">Campaign</th>
                    <th style="padding: 12px; text-align: left;">Type</th>
                    <th style="padding: 12px; text-align: right;">Gross Transmittals</th>
                    <th style="padding: 12px; text-align: right;">Conversion Rate</th>
                    <th style="padding: 12px; text-align: right;">Bookings</th>
                    <th style="padding: 12px; text-align: right;">Approvals</th>
                    <th style="padding: 12px; text-align: left;">Date</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    transmittals.data.forEach(t => {
        const date = new Date(t.created_at).toLocaleDateString();
        html += `
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px;">${t.campaign_name}</td>
                <td style="padding: 12px;"><span style="background-color: #dbeafe; color: #0c4a6e; padding: 4px 8px; border-radius: 4px; font-size: 0.875rem;">${t.transmittal_type}</span></td>
                <td style="padding: 12px; text-align: right;">${(t.gross_transmittals || 0).toLocaleString()}</td>
                <td style="padding: 12px; text-align: right;">${(t.conversion_rate || 0).toFixed(2)}%</td>
                <td style="padding: 12px; text-align: right;">${(t.bookings || 0).toLocaleString()}</td>
                <td style="padding: 12px; text-align: right;">${(t.approvals || 0).toLocaleString()}</td>
                <td style="padding: 12px;">${date}</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

async function renderCampaignsPage() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    const html = `
        <div class="dashboard-container">
            <div class="sidebar">
                <div class="sidebar-logo">
                    📊 PMRS
                </div>
                <ul class="sidebar-nav">
                    <li><a href="#" onclick="goTo('dashboard')">Dashboard</a></li>
                    <li><a href="#" onclick="goTo('transmittals')">My Transmittals</a></li>
                    <li><a href="#" onclick="goTo('campaigns')" class="active">Campaigns</a></li>
                    <li><a href="#" onclick="goTo('submit')">Submit New</a></li>
                </ul>
                <div class="sidebar-footer">
                    <div class="user-info">
                        <strong>${user.full_name}</strong><br>
                        ${user.role}
                    </div>
                    <button class="btn-logout" onclick="logout()">Logout</button>
                </div>
            </div>
            <div class="main-content">
                <div class="header">
                    <h1>Campaigns</h1>
                </div>
                <div id="campaigns-content" class="section"></div>
            </div>
        </div>
    `;
    render(html);
    loadCampaignsData();
}

async function loadCampaignsData() {
    const campaigns = await apiCall('/api/campaigns');
    const container = document.getElementById('campaigns-content');
    
    if (!campaigns?.data || campaigns.data.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px;">No campaigns available</p>';
        return;
    }
    
    let html = `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
    `;
    
    campaigns.data.forEach(c => {
        const campaignType = c.name.split(' ')[0];
        let badgeClass = 'campaign-bpi';
        if (campaignType === 'MB') badgeClass = 'campaign-mb';
        else if (campaignType === 'BDO') badgeClass = 'campaign-bdo';
        else if (campaignType === 'AXA') badgeClass = 'campaign-axa';
        else if (campaignType === 'CBC') badgeClass = 'campaign-cbc';
        else if (campaignType === 'MEDICARD') badgeClass = 'campaign-medicard';
        
        html += `
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div class="campaign-badge ${badgeClass}" style="margin-bottom: 15px;">${c.name}</div>
                <p style="color: #666; margin: 10px 0;">
                    <strong>Goal:</strong> ${(c.goal || 0).toLocaleString()}
                </p>
                <p style="color: #999; font-size: 0.875rem;">
                    Created: ${new Date(c.created_at).toLocaleDateString()}
                </p>
                <button onclick="goTo('submit')" class="btn btn-primary" style="width: 100%; margin-top: 15px;">
                    Submit Data
                </button>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// ============= EVENT HANDLERS =============
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('auth-message');
    
    const result = await apiCall('/api/login', 'POST', { email, password });
    
    if (result?.success) {
        setToken(result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        currentUser = result.user;
        // If admin, go to manager dashboard; otherwise regular dashboard
        if (result.user?.role === 'admin') {
            renderManagerDashboard();
        } else {
            renderDashboard();
        }
    } else {
        messageDiv.innerHTML = `<div class="error-message">${result?.message || 'Login failed'}</div>`;
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const full_name = document.getElementById('full_name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('auth-message');
    
    const result = await apiCall('/api/register', 'POST', { full_name, email, password });
    
    if (result?.success) {
        messageDiv.innerHTML = `<div class="success-message">Account created! Logging you in...</div>`;
        setTimeout(() => {
            setToken(result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            currentUser = result.user;
            renderDashboard();
        }, 1500);
    } else {
        messageDiv.innerHTML = `<div class="error-message">${result?.message || 'Registration failed'}</div>`;
    }
}

async function handleSubmitTransmittal(e) {
    e.preventDefault();
    
    const campaign_id = document.getElementById('campaign_id')?.value;
    const transmittal_type = document.getElementById('transmittal_type')?.value;
    const messageDiv = document.getElementById('form-message');
    
    // Validation
    if (!campaign_id || campaign_id === '') {
        console.warn('⚠️ No campaign selected!');
        messageDiv.innerHTML = `<div class="error-message">❌ Please select a campaign</div>`;
        return;
    }
    
    if (!transmittal_type || transmittal_type === '') {
        messageDiv.innerHTML = `<div class="error-message">❌ Please select a submission type</div>`;
        return;
    }
    
    // Find campaign name for logging
    const campaignData = window.campaignsList?.find(c => c.id === campaign_id);
    const campaignName = campaignData?.name || 'Unknown';
    
    console.log(`📤 Submitting transmittal for campaign: "${campaignName}"`);
    console.log(`   Campaign ID: ${campaign_id}`);
    
    const goal_type = document.getElementById('goal_type').value;
    const conversion_rate = parseFloat(document.getElementById('conversion_rate').value) || 0;
    const bookings = parseFloat(document.getElementById('bookings').value) || 0;
    const approvals = parseFloat(document.getElementById('approvals').value) || 0;
    const notes = document.getElementById('notes').value;
    
    let gross_transmittals = 0;
    let w1 = 0, w2 = 0, w3 = 0, w4 = 0, w5 = 0;
    
    // Calculate gross transmittals from weekly or daily
    if (transmittal_type === 'weekly') {
        w1 = parseFloat(document.getElementById('w1').value) || 0;
        w2 = parseFloat(document.getElementById('w2').value) || 0;
        w3 = parseFloat(document.getElementById('w3').value) || 0;
        w4 = parseFloat(document.getElementById('w4').value) || 0;
        w5 = parseFloat(document.getElementById('w5').value) || 0;
        gross_transmittals = w1 + w2 + w3 + w4 + w5;
    } else {
        gross_transmittals = parseFloat(document.getElementById('amount').value) || 0;
    }
    
    const data = {
        campaign_id,
        transmittal_type,
        goal_type,
        gross_transmittals,
        w1,
        w2,
        w3,
        w4,
        w5,
        conversion_rate,
        bookings,
        approvals,
        notes
    };
    
    console.log('📊 Transmittal data:', data);
    
    const result = await apiCall('/api/transmittals', 'POST', data);
    
    if (result?.success) {
        messageDiv.innerHTML = `<div class="success-message">✅ Transmittal submitted successfully!</div>`;
        document.getElementById('submit-form').reset();
        console.log('✅ Transmittal saved:', result.data);
        setTimeout(() => goTo('dashboard'), 1500);
    } else {
        console.error('❌ Submission failed:', result);
        messageDiv.innerHTML = `<div class="error-message">❌ ${result?.message || 'Submission failed'}</div>`;
    }
}

// ============= NAVIGATION =============
function showLogin() {
    renderLoginPage();
}

function showRegister() {
    alert('Registration is not available. Please contact your administrator for account creation.');
}

function goTo(page) {
    currentPage = page;
    
    if (page === 'dashboard') renderDashboard();
    else if (page === 'manager') renderManagerDashboard();
    else if (page === 'submit') renderSubmitForm();
    else if (page === 'transmittals') renderTransmittalsPage();
    else if (page === 'campaigns') renderCampaignsPage();
}

// ============= MANAGER DASHBOARD =============
async function renderManagerDashboard() {
    const user = JSON.parse(localStorage.getItem('user'));
    const isManager = user.role === 'admin';
    
    const html = `
        <div class="dashboard-container">
            <div class="sidebar">
                <div style="flex: 1; padding-top: 20px;">
                    <ul class="sidebar-nav">
                        ${isManager ? `
                            <li><a href="#" onclick="goTo('manager')" class="active">📊 Dashboard</a></li>
                            <li><a href="#" onclick="switchManagerTab('monthly')">📈 Reports</a></li>
                            <li><a href="#" onclick="switchManagerTab('campaigns')">⚙️ Campaign Goals</a></li>
                            <li><a href="#" onclick="switchManagerTab('users')">👥 Manage Users</a></li>
                        ` : `
                            <li><a href="#" onclick="goTo('dashboard')" class="active">Dashboard</a></li>
                            <li><a href="#" onclick="goTo('transmittals')">My Transmittals</a></li>
                            <li><a href="#" onclick="goTo('campaigns')">Campaigns</a></li>
                            <li><a href="#" onclick="goTo('submit')">Submit New</a></li>
                        `}
                    </ul>
                </div>
                <div class="sidebar-footer" style="border-top: 1px solid #333; padding-top: 20px; display: flex; flex-direction: column; justify-content: space-between; height: auto;">
                    <!-- Logo Section at Top -->
                    <div style="text-align: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #333;">
                        <img src="assets/image/asynx.png" alt="PMRS Logo" style="height: 160px; width: 160px; object-fit: contain; margin-bottom: 15px;">
                        <div style="font-size: 18px; font-weight: 700; color: #fff; letter-spacing: 1.5px;">PMRS</div>
                        <div style="font-size: 12px; color: #aaa; margin-top: 6px;">Transmittal Management</div>
                    </div>
                    
                    <!-- User Info in Middle -->
                    <div class="user-info" style="margin-bottom: auto; padding: 15px 0; border-bottom: 1px solid #333;">
                        <strong>${user.full_name}</strong><br>
                        <span style="text-transform: uppercase; font-size: 10px; opacity: 0.8;">${user.role}</span>
                    </div>
                    
                    <!-- Logout Button at the Very Bottom -->
                    <button class="btn-logout" onclick="logout()" style="margin-top: 15px; width: 100%;">🚪 Logout</button>
                </div>
            </div>
            <div class="main-content" style="overflow-y: auto;">
                <div class="header">
                    <h1>📊 Manager Dashboard</h1>
                </div>
                
                <!-- Key Metrics Row -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                    <div class="metric-card" style="background: white; border-left: 4px solid var(--brand-blue); padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(22,13,118,0.08); transition: transform 0.3s ease;">
                        <div style="color: #999; font-size: 0.875rem;">Total Campaigns</div>
                        <div id="total-campaigns-metric" style="font-size: 28px; font-weight: bold; color: var(--brand-blue);">-</div>
                    </div>
                    <div class="metric-card" style="background: white; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(22,13,118,0.08); transition: transform 0.3s ease;">
                        <div style="color: #999; font-size: 0.875rem;">Average Achievement</div>
                        <div id="avg-achievement-metric" style="font-size: 28px; font-weight: bold; color: #10b981;">-</div>
                    </div>
                    <div class="metric-card" style="background: white; border-left: 4px solid var(--brand-orange); padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(22,13,118,0.08); transition: transform 0.3s ease;">
                        <div style="color: #999; font-size: 0.875rem;">Total Transmittals (MTD)</div>
                        <div id="total-transmittals-metric" style="font-size: 28px; font-weight: bold; color: var(--brand-orange);">-</div>
                    </div>
                    <div class="metric-card" style="background: white; border-left: 4px solid var(--brand-navy); padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(22,13,118,0.08); transition: transform 0.3s ease;">
                        <div style="color: #999; font-size: 0.875rem;">Campaigns On Target</div>
                        <div id="campaigns-on-target-metric" style="font-size: 28px; font-weight: bold; color: var(--brand-navy);">-</div>
                    </div>
                </div>

                <!-- Tabs for different views -->
                <div style="margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap;">
                    <button class="tab-btn active" onclick="switchManagerTab('monthly')" style="padding: 10px 20px; background: var(--brand-blue); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; transition: all 0.3s ease;">📊 Monthly View</button>
                    <button class="tab-btn" onclick="switchManagerTab('daily')" style="padding: 10px 20px; background: #e5e7eb; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; transition: all 0.3s ease;">📅 Daily View</button>
                    <button class="tab-btn" onclick="switchManagerTab('analysis')" style="padding: 10px 20px; background: #e5e7eb; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; transition: all 0.3s ease;">📈 Analysis</button>
                    <button class="tab-btn" onclick="switchManagerTab('reports')" style="padding: 10px 20px; background: #e5e7eb; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; transition: all 0.3s ease;">📋 Reports</button>
                    <button class="tab-btn" onclick="switchManagerTab('campaigns')" style="padding: 10px 20px; background: #e5e7eb; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; transition: all 0.3s ease;">⚙️ Campaign Goals</button>
                    <button class="tab-btn" onclick="switchManagerTab('users')" style="padding: 10px 20px; background: #e5e7eb; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; transition: all 0.3s ease;">👥 Manage Users</button>
                </div>

                <!-- Monthly View Tab -->
                <div id="monthly-tab" style="display: block;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                            <h3>Achievement by Campaign (Top 10)</h3>
                            <div id="top-campaigns" style="margin-top: 15px;"></div>
                        </div>
                        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                            <h3>Campaign Status Distribution</h3>
                            <div id="status-distribution" style="margin-top: 15px; display: flex; justify-content: center;"></div>
                        </div>
                    </div>
                </div>

                <!-- Daily View Tab -->
                <div id="daily-tab" style="display: none;">
                    <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 20px;">
                        <h3>Daily Campaign Performance</h3>
                        <div id="daily-performance" style="margin-top: 15px;"></div>
                    </div>
                    <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                        <h3>Daily Achievement Trend (Last 7 Days)</h3>
                        <div id="daily-trend" style="margin-top: 15px;"></div>
                    </div>
                </div>

                <!-- Analysis Tab -->
                <div id="analysis-tab" style="display: none;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                            <h3>Goal vs Actual (MTD)</h3>
                            <div id="goal-vs-actual" style="margin-top: 15px;"></div>
                        </div>
                        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                            <h3>Achievement Distribution</h3>
                            <div id="achievement-distribution" style="margin-top: 15px;"></div>
                        </div>
                    </div>
                </div>

                <!-- Reports Tab -->
                <div id="reports-tab" style="display: none;">
                    <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <h3>📊 Transmittals Report</h3>
                            <div style="display: flex; gap: 10px;">
                                <select id="report-month" style="padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px;">
                                    <option value="">Select Month</option>
                                    <option value="1">January</option>
                                    <option value="2">February</option>
                                    <option value="3">March</option>
                                    <option value="4">April</option>
                                    <option value="5">May</option>
                                    <option value="6">June</option>
                                    <option value="7">July</option>
                                    <option value="8">August</option>
                                    <option value="9">September</option>
                                    <option value="10">October</option>
                                    <option value="11">November</option>
                                    <option value="12">December</option>
                                </select>
                                <select id="report-campaign" style="padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 4px;">
                                    <option value="">All Campaigns</option>
                                </select>
                                <button onclick="loadReportsData()" style="padding: 8px 20px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">🔄 Filter</button>
                                <button onclick="exportReportCSV()" style="padding: 8px 20px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">📥 Export CSV</button>
                            </div>
                        </div>
                        <div id="reports-table" style="margin-top: 20px; overflow-x: auto;"></div>
                    </div>
                </div>

                <!-- Campaign Goals Tab -->
                <div id="campaigns-tab" style="display: none;">
                    <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                        <h3>Set Campaign Goals</h3>
                        <div id="campaign-goals-list" style="margin-top: 20px;"></div>
                    </div>
                </div>

                <!-- Users Management Tab -->
                <div id="users-tab" style="display: none;">
                    <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 20px;">
                        <h3>Create New Operator</h3>
                        <div id="create-user-form" style="margin-top: 15px;"></div>
                    </div>
                    <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                        <h3>All Operators</h3>
                        <div id="users-list" style="margin-top: 20px;"></div>
                    </div>
                </div>

                <!-- Transmittals Tab (removed, replaced by Analysis) -->
                <div id="transmittals-tab" style="display: none;">
                    <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                        <h3>January Transmittals (Internal)</h3>
                        <div id="transmittals-table" style="margin-top: 20px; overflow-x: auto;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    render(html);
    
    // Load Chart.js library
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => {
        loadManagerData();
        loadManagerMetrics(); // Load metrics data
    };
    document.head.appendChild(script);
}

// Load manager dashboard metrics
async function loadManagerMetrics() {
    try {
        const campaignsRes = await apiCall('/api/campaigns');
        const transmittalsRes = await apiCall('/api/transmittals');
        
        const campaigns = campaignsRes?.data || [];
        const transmittals = transmittalsRes?.data || [];
        
        // Calculate metrics
        const totalCampaigns = campaigns.length;
        
        // Average achievement (from campaigns with achievement_rate)
        const campaignsWithAchievement = campaigns.filter(c => c.achievement_rate !== null);
        const avgAchievement = campaignsWithAchievement.length > 0
            ? (campaignsWithAchievement.reduce((sum, c) => sum + (c.achievement_rate || 0), 0) / campaignsWithAchievement.length)
            : 0;
        
        // Total transmittals (MTD)
        const totalTransmittalsAmount = transmittals.reduce((sum, t) => sum + (t.gross_transmittals || 0), 0);
        
        // Campaigns on target (achievement_rate >= 85%)
        const campaignsOnTarget = campaigns.filter(c => (c.achievement_rate || 0) >= 85).length;
        
        // Update metrics in DOM
        const totalCampaignsEl = document.getElementById('total-campaigns-metric');
        const avgAchievementEl = document.getElementById('avg-achievement-metric');
        const totalTransmittalsEl = document.getElementById('total-transmittals-metric');
        const campaignsOnTargetEl = document.getElementById('campaigns-on-target-metric');
        
        if (totalCampaignsEl) totalCampaignsEl.textContent = totalCampaigns;
        if (avgAchievementEl) avgAchievementEl.textContent = avgAchievement.toFixed(1) + '%';
        if (totalTransmittalsEl) totalTransmittalsEl.textContent = (totalTransmittalsAmount / 1e9).toFixed(1) + 'B';
        if (campaignsOnTargetEl) campaignsOnTargetEl.textContent = `${campaignsOnTarget}/${totalCampaigns}`;
        
    } catch (error) {
        console.error('Failed to load manager metrics:', error);
    }
}

async function switchManagerTab(tab) {
    document.getElementById('monthly-tab').style.display = tab === 'monthly' ? 'block' : 'none';
    document.getElementById('daily-tab').style.display = tab === 'daily' ? 'block' : 'none';
    document.getElementById('analysis-tab').style.display = tab === 'analysis' ? 'block' : 'none';
    document.getElementById('reports-tab').style.display = tab === 'reports' ? 'block' : 'none';
    document.getElementById('campaigns-tab').style.display = tab === 'campaigns' ? 'block' : 'none';
    document.getElementById('users-tab').style.display = tab === 'users' ? 'block' : 'none';
    document.getElementById('transmittals-tab').style.display = tab === 'transmittals' ? 'block' : 'none';
    
    // Load tab-specific data
    if (tab === 'daily') {
        loadDailyPerformance();
        loadDailyTrend();
    } else if (tab === 'analysis') {
        loadGoalVsActual();
        loadAchievementDistribution();
    } else if (tab === 'reports') {
        loadReportsInitial();
    } else if (tab === 'users') {
        renderUserManagement();
    }
    
    // Update button styles - use CSS variables for colors
    const brandBlue = getComputedStyle(document.documentElement).getPropertyValue('--brand-blue').trim() || '#4094d9';
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.style.background = '#e5e7eb';
        btn.style.color = 'black';
    });
    event.target.style.background = brandBlue;
    event.target.style.color = 'white';
}

async function loadManagerData() {
    // Load campaigns for goal setting - use ADMIN endpoint that gets ALL campaigns
    const campaigns = await apiCall('/api/admin/campaigns');
    const allTransmittals = await apiCall('/api/admin/transmittals');
    const performanceData = await apiCall('/api/performance/monthly');
    
    loadTopCampaigns();
    loadStatusDistribution();
    loadCampaignGoals(campaigns?.data || []);
    loadAllTransmittals(allTransmittals?.data || []);
    loadManagerPerformanceComparison(performanceData);
}

async function loadStatusDistribution() {
    const container = document.getElementById('status-distribution');
    const campaigns = await apiCall('/api/admin/campaigns');
    const transmittals = await apiCall('/api/admin/transmittals');
    
    if (!campaigns?.data || campaigns.data.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No data available</p>';
        return;
    }
    
    // Calculate status for each campaign
    let onTarget = 0;
    let belowTarget = 0;
    let atRisk = 0;
    
    campaigns.data.forEach(campaign => {
        const campaignTransmittals = transmittals?.data?.filter(t => t.campaign_id === campaign.id) || [];
        const totalActual = campaignTransmittals.reduce((sum, t) => sum + (t.gross_transmittals || 0), 0);
        const goal = campaign.goal || 1;
        const achievement = (totalActual / goal * 100);
        
        if (achievement >= 85) onTarget++;
        else if (achievement >= 70) atRisk++;
        else belowTarget++;
    });
    
    const total = onTarget + belowTarget + atRisk;
    
    if (total === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No transmittals yet</p>';
        return;
    }
    
    // Create pie chart
    const ctx = document.createElement('canvas');
    ctx.id = 'statusChart';
    ctx.style.maxWidth = '300px';
    container.innerHTML = '';
    container.appendChild(ctx);
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [`On Target (≥85%)`, `At Risk (70-85%)`, `Below Target (<70%)`],
            datasets: [{
                data: [onTarget, atRisk, belowTarget],
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

async function loadTopCampaigns() {
    const container = document.getElementById('top-campaigns');
    const campaigns = await apiCall('/api/admin/campaigns');
    const transmittals = await apiCall('/api/admin/transmittals');
    
    if (!campaigns?.data || campaigns.data.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No campaign data available</p>';
        return;
    }
    
    // Calculate achievement for each campaign from actual transmittals
    const campaignAchievements = campaigns.data.map(campaign => {
        const campaignTransmittals = transmittals?.data?.filter(t => t.campaign_id === campaign.id) || [];
        const totalActual = campaignTransmittals.reduce((sum, t) => sum + (t.gross_transmittals || 0), 0);
        const goal = campaign.goal || 1;
        const achievement = Math.min((totalActual / goal * 100), 100);
        
        return {
            name: campaign.name,
            achievement: isNaN(achievement) ? 0 : Math.round(achievement),
            actual: totalActual,
            goal: goal
        };
    }).sort((a, b) => b.achievement - a.achievement).slice(0, 10);
    
    if (campaignAchievements.length === 0 || campaignAchievements.every(c => c.achievement === 0)) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No transmittals yet</p>';
        return;
    }
    
    // Create bar chart
    const ctx = document.createElement('canvas');
    ctx.id = 'achievementChart';
    container.innerHTML = '';
    container.appendChild(ctx);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: campaignAchievements.map(c => c.name),
            datasets: [{
                label: 'Achievement %',
                data: campaignAchievements.map(c => c.achievement),
                backgroundColor: [
                    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
                    '#06b6d4', '#ec4899', '#6366f1', '#14b8a6', '#f97316'
                ],
                borderRadius: 4,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

function loadManagerPerformanceComparison(performanceData) {
    const container = document.getElementById('monthly-view-content');
    if (!container) return;
    
    if (!performanceData?.success) {
        console.warn('No performance data available');
        return;
    }

    // Helper function to format change indicator
    const getChangeIndicator = (change, isPercentage = true) => {
        const suffix = isPercentage ? '%' : '';
        if (change > 0) {
            return `<span class="trend-up">📈 +${Math.abs(change).toFixed(1)}${suffix}</span>`;
        } else if (change < 0) {
            return `<span class="trend-down">📉 ${change.toFixed(1)}${suffix}</span>`;
        } else {
            return `<span class="trend-neutral">➡️ 0${suffix}</span>`;
        }
    };

    const performanceHTML = `
        <h2 style="margin-bottom: 20px; color: var(--brand-navy); font-size: 20px;">📊 Team Sales Performance</h2>
        <div class="performance-grid">
            <div class="performance-card">
                <div class="performance-metric">
                    <span class="metric-label">Gross Transmittals</span>
                    <div class="metric-values">
                        <div class="current">
                            <span class="month-label">${performanceData.currentMonth.label}</span>
                            <div class="value">${(performanceData.currentMonth.totalGross || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}</div>
                        </div>
                        <div class="comparison">vs</div>
                        <div class="previous">
                            <span class="month-label">${performanceData.lastMonth.label}</span>
                            <span class="date-range">${performanceData.lastMonth.dateRange}</span>
                            <div class="value">${(performanceData.lastMonth.totalGross || 0).toLocaleString('en-US', {maximumFractionDigits: 0})}</div>
                        </div>
                    </div>
                    <div class="change-indicator">
                        ${getChangeIndicator(performanceData.changes.gross, true)}
                    </div>
                </div>
            </div>

            <div class="performance-card">
                <div class="performance-metric">
                    <span class="metric-label">Transmittals Count</span>
                    <div class="metric-values">
                        <div class="current">
                            <span class="month-label">${performanceData.currentMonth.label}</span>
                            <span class="date-range">${performanceData.currentMonth.dateRange}</span>
                            <div class="value">${performanceData.currentMonth.totalTransmittals}</div>
                        </div>
                        <div class="comparison">vs</div>
                        <div class="previous">
                            <span class="month-label">${performanceData.lastMonth.label}</span>
                            <span class="date-range">${performanceData.lastMonth.dateRange}</span>
                            <div class="value">${performanceData.lastMonth.totalTransmittals}</div>
                        </div>
                    </div>
                    <div class="change-indicator">
                        ${getChangeIndicator(performanceData.changes.transmittals, true)}
                    </div>
                </div>
            </div>

            <div class="performance-card">
                <div class="performance-metric">
                    <span class="metric-label">Avg Conversion Rate</span>
                    <div class="metric-values">
                        <div class="current">
                            <span class="month-label">${performanceData.currentMonth.label}</span>
                            <span class="date-range">${performanceData.currentMonth.dateRange}</span>
                            <div class="value">${(performanceData.currentMonth.avgConversionRate || 0).toFixed(1)}%</div>
                        </div>
                        <div class="comparison">vs</div>
                        <div class="previous">
                            <span class="month-label">${performanceData.lastMonth.label}</span>
                            <span class="date-range">${performanceData.lastMonth.dateRange}</span>
                            <div class="value">${(performanceData.lastMonth.avgConversionRate || 0).toFixed(1)}%</div>
                        </div>
                    </div>
                    <div class="change-indicator">
                        ${getChangeIndicator(performanceData.changes.conversionRate, false)}
                    </div>
                </div>
            </div>

            <div class="performance-card">
                <div class="performance-metric">
                    <span class="metric-label">Bookings</span>
                    <div class="metric-values">
                        <div class="current">
                            <span class="month-label">${performanceData.currentMonth.label}</span>
                            <span class="date-range">${performanceData.currentMonth.dateRange}</span>
                            <div class="value">${performanceData.currentMonth.totalBookings}</div>
                        </div>
                        <div class="comparison">vs</div>
                        <div class="previous">
                            <span class="month-label">${performanceData.lastMonth.label}</span>
                            <span class="date-range">${performanceData.lastMonth.dateRange}</span>
                            <div class="value">${performanceData.lastMonth.totalBookings}</div>
                        </div>
                    </div>
                    <div class="change-indicator">
                        ${getChangeIndicator(performanceData.changes.bookings, true)}
                    </div>
                </div>
            </div>

            <div class="performance-card">
                <div class="performance-metric">
                    <span class="metric-label">Approvals</span>
                    <div class="metric-values">
                        <div class="current">
                            <span class="month-label">${performanceData.currentMonth.label}</span>
                            <span class="date-range">${performanceData.currentMonth.dateRange}</span>
                            <div class="value">${performanceData.currentMonth.totalApprovals}</div>
                        </div>
                        <div class="comparison">vs</div>
                        <div class="previous">
                            <span class="month-label">${performanceData.lastMonth.label}</span>
                            <span class="date-range">${performanceData.lastMonth.dateRange}</span>
                            <div class="value">${performanceData.lastMonth.totalApprovals}</div>
                        </div>
                    </div>
                    <div class="change-indicator">
                        ${getChangeIndicator(performanceData.changes.approvals, true)}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Insert at the top of monthly view
    const header = container.querySelector('h2') || container.firstChild;
    if (header) {
        const div = document.createElement('div');
        div.innerHTML = performanceHTML;
        container.insertBefore(div, header);
    } else {
        container.innerHTML = performanceHTML + container.innerHTML;
    }
}

async function loadCampaignGoals(campaigns) {
    const container = document.getElementById('campaign-goals-list');
    
    if (!campaigns || campaigns.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No campaigns available</p>';
        return;
    }
    
    const goalTypes = ['Quality', 'Gross Transmittals', 'Transmitted', 'Approvals', 'Conversion rate', 'Disbursement', 'Tap rate'];
    
    let html = `
        <div style="margin-bottom: 20px;">
            <h4 style="margin-bottom: 15px;">📊 Set Campaign Goals by Type (${campaigns.length} campaigns)</h4>
    `;
    
    campaigns.forEach(c => {
        const campaignType = c.name.split(' ')[0];
        let badgeColor = '#3b82f6';
        if (campaignType === 'MB') badgeColor = '#10b981';
        else if (campaignType === 'BDO') badgeColor = '#8b5cf6';
        else if (campaignType === 'AXA') badgeColor = '#f59e0b';
        else if (campaignType === 'CBC') badgeColor = '#ef4444';
        else if (campaignType === 'MEDICARD') badgeColor = '#ec4899';
        
        const goals = c.goals || {};
        
        html += `
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span style="background-color: ${badgeColor}22; color: ${badgeColor}; padding: 6px 12px; border-radius: 4px; font-weight: 600;">
                        ${c.name}
                    </span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px;">
        `;
        
        goalTypes.forEach(goalType => {
            const goalValue = goals[goalType] || 0;
            html += `
                <div>
                    <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 4px;">${goalType}</label>
                    <input type="number" id="goal-${c.id}-${goalType}" value="${goalValue}" placeholder="0" 
                        style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; text-align: right;">
                </div>
            `;
        });
        
        html += `
                </div>
                <button onclick="updateGoalsByType('${c.id}', '${c.name}', ${JSON.stringify(goalTypes).replace(/"/g, '&quot;')})" 
                    style="margin-top: 12px; padding: 8px 20px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; width: 100%;">
                    💾 Save All Goals
                </button>
            </div>
        `;
    });
    
    html += `</div>`;
    
    container.innerHTML = html;
}

async function updateGoal(campaignId, campaignName, goal) {
    const goalAmount = parseFloat(goal);
    
    if (!goalAmount || goalAmount <= 0) {
        alert('Please enter a valid goal amount');
        return;
    }
    
    const result = await apiCall(`/api/campaigns/${campaignId}`, 'PUT', { goal: goalAmount });
    
    if (result?.success) {
        alert(`✅ Goal updated for ${campaignName}\nNew Goal: ${goalAmount.toLocaleString()}`);
    } else {
        alert('❌ Failed to update goal');
    }
}

async function updateGoalsByType(campaignId, campaignName, goalTypes) {
    const goals = {};
    let hasValidGoal = false;
    
    goalTypes.forEach(goalType => {
        const inputId = `goal-${campaignId}-${goalType}`;
        const inputEl = document.getElementById(inputId);
        if (inputEl) {
            const value = parseFloat(inputEl.value) || 0;
            if (value > 0) hasValidGoal = true;
            goals[goalType] = value;
        }
    });
    
    if (!hasValidGoal) {
        alert('Please enter at least one goal value');
        return;
    }
    
    try {
        const result = await apiCall(`/api/campaigns/${campaignId}`, 'PUT', { goals });
        
        console.log('Update goals result:', result);
        
        if (result?.success) {
            alert(`✅ Goals updated for ${campaignName}`);
            // Reload manager data after update
            loadManagerData();
        } else {
            const errorMsg = result?.message || result?.error || 'Unknown error';
            alert(`❌ Failed to update goals:\n${errorMsg}`);
            console.error('Update goals failed:', result);
        }
    } catch (error) {
        console.error('Error updating goals:', error);
        alert(`❌ Error updating goals: ${error.message}`);
    }
}

// Daily Performance Chart
async function loadDailyPerformance() {
    const container = document.getElementById('daily-performance');
    const campaigns = await apiCall('/api/admin/campaigns');
    const transmittals = await apiCall('/api/admin/transmittals');
    
    if (!campaigns?.data || !transmittals?.data) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No data available</p>';
        return;
    }
    
    // Get today's date and calculate daily values
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dailyTransmittals = transmittals.data.filter(t => {
        const tDate = new Date(t.created_at);
        tDate.setHours(0, 0, 0, 0);
        return tDate.getTime() === today.getTime();
    });
    
    const dailyByCampaign = {};
    campaigns.data.slice(0, 10).forEach(c => {
        const campaignDaily = dailyTransmittals.filter(t => t.campaign_id === c.id);
        dailyByCampaign[c.id] = campaignDaily.reduce((sum, t) => sum + (t.gross_transmittals || 0), 0);
    });
    
    const campaignNames = campaigns.data.slice(0, 10).map(c => c.name);
    const dailyValues = campaigns.data.slice(0, 10).map(c => dailyByCampaign[c.id] || 0);
    
    if (dailyValues.every(v => v === 0)) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No transmittals today</p>';
        return;
    }
    
    const ctx = document.createElement('canvas');
    ctx.id = 'dailyChart';
    container.innerHTML = '';
    container.appendChild(ctx);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: campaignNames,
            datasets: [{
                label: 'Daily Transmittals',
                data: dailyValues,
                backgroundColor: '#3b82f6',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

// Daily Trend Chart
async function loadDailyTrend() {
    const container = document.getElementById('daily-trend');
    const transmittals = await apiCall('/api/admin/transmittals');
    const campaigns = await apiCall('/api/admin/campaigns');
    
    if (!transmittals?.data || transmittals.data.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No data available</p>';
        return;
    }
    
    // Get last 7 days of data
    const dates = [];
    const trendData = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const dayTransmittals = transmittals.data.filter(t => {
            const tDate = new Date(t.created_at);
            tDate.setHours(0, 0, 0, 0);
            return tDate.getTime() === date.getTime();
        });
        
        if (dayTransmittals.length > 0) {
            const totalActual = dayTransmittals.reduce((sum, t) => sum + (t.gross_transmittals || 0), 0);
            const totalGoal = campaigns.data.reduce((sum, c) => {
                const cTransmittals = dayTransmittals.filter(t => t.campaign_id === c.id);
                return sum + (cTransmittals.length > 0 ? (c.goal || 100000000) : 0);
            }, 0);
            
            const achievement = Math.min((totalActual / (totalGoal || 1)) * 100, 100);
            trendData.push(Math.round(achievement));
        } else {
            trendData.push(0);
        }
        
        dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    if (trendData.every(v => v === 0)) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No transmittals in last 7 days</p>';
        return;
    }
    
    const ctx = document.createElement('canvas');
    ctx.id = 'trendChart';
    container.innerHTML = '';
    container.appendChild(ctx);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Daily Achievement %',
                data: trendData,
                borderColor: '#10b981',
                backgroundColor: '#d1fae5',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#10b981'
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: { y: { min: 0, max: 100 } }
        }
    });
}

// Goal vs Actual Chart
async function loadGoalVsActual() {
    const container = document.getElementById('goal-vs-actual');
    const campaigns = await apiCall('/api/admin/campaigns');
    const transmittals = await apiCall('/api/admin/transmittals');
    
    if (!campaigns?.data) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No data available</p>';
        return;
    }
    
    const campaignNames = campaigns.data.slice(0, 8).map(c => c.name);
    const goals = campaigns.data.slice(0, 8).map(c => c.goal || 0);
    const actuals = campaigns.data.slice(0, 8).map(c => {
        const campaignTransmittals = transmittals?.data?.filter(t => t.campaign_id === c.id) || [];
        return campaignTransmittals.reduce((sum, t) => sum + (t.gross_transmittals || 0), 0);
    });
    
    if (goals.every(g => g === 0) && actuals.every(a => a === 0)) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No data available</p>';
        return;
    }
    
    const ctx = document.createElement('canvas');
    ctx.id = 'goalChart';
    container.innerHTML = '';
    container.appendChild(ctx);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: campaignNames,
            datasets: [
                {
                    label: 'Goal',
                    data: goals,
                    backgroundColor: '#dbeafe'
                },
                {
                    label: 'Actual',
                    data: actuals,
                    backgroundColor: '#3b82f6'
                }
            ]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
        }
    });
}

// Achievement Distribution Chart
async function loadAchievementDistribution() {
    const container = document.getElementById('achievement-distribution');
    const campaigns = await apiCall('/api/admin/campaigns');
    const transmittals = await apiCall('/api/admin/transmittals');
    
    if (!campaigns?.data || !transmittals?.data) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No data available</p>';
        return;
    }
    
    // Calculate achievement distribution
    const distribution = { excellent: 0, good: 0, fair: 0, poor: 0 };
    
    campaigns.data.forEach(c => {
        const campaignTransmittals = transmittals.data.filter(t => t.campaign_id === c.id);
        const totalActual = campaignTransmittals.reduce((sum, t) => sum + (t.gross_transmittals || 0), 0);
        const goal = c.goal || 1;
        const achievement = Math.min((totalActual / goal) * 100, 100);
        
        if (achievement >= 90) distribution.excellent++;
        else if (achievement >= 80) distribution.good++;
        else if (achievement >= 70) distribution.fair++;
        else distribution.poor++;
    });
    
    const totalCount = Object.values(distribution).reduce((a, b) => a + b, 0);
    
    if (totalCount === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No campaigns yet</p>';
        return;
    }
    
    const ctx = document.createElement('canvas');
    ctx.id = 'distributionChart';
    container.innerHTML = '';
    container.appendChild(ctx);
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['90-100% (Excellent)', '80-89% (Good)', '70-79% (Fair)', 'Below 70% (Poor)'],
            datasets: [{
                data: [distribution.excellent, distribution.good, distribution.fair, distribution.poor],
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

async function loadAllTransmittals(transmittals) {
    const container = document.getElementById('transmittals-table');
    
    if (!transmittals || transmittals.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">No transmittals available yet</p>';
        return;
    }
    
    let html = `
        <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
                <thead>
                    <tr style="background-color: #f3f4f6; border-bottom: 2px solid #e5e7eb;">
                        <th style="padding: 10px; text-align: left;">Campaign</th>
                        <th style="padding: 10px; text-align: right;">Goal</th>
                        <th style="padding: 10px; text-align: right;">MTD</th>
                        <th style="padding: 10px; text-align: right;">Achievement</th>
                        <th style="padding: 10px; text-align: right;">Status</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    transmittals.slice(0, 20).forEach(t => {
        const achievement = Math.floor(Math.random() * 20) + 80;
        const status = achievement >= 85 ? 'On Target' : achievement >= 75 ? 'At Risk' : 'Below Target';
        const statusColor = achievement >= 85 ? '#10b981' : achievement >= 75 ? '#f59e0b' : '#ef4444';
        
        html += `
            <tr style="border-bottom: 1px solid #e5e7eb; hover: background-color: #f9fafb;">
                <td style="padding: 12px; font-weight: 500;">${t.campaign_name}</td>
                <td style="padding: 12px; text-align: right;">${(t.goal || 0).toLocaleString()}</td>
                <td style="padding: 12px; text-align: right; font-weight: 500;">${(t.gross_transmittals || 0).toLocaleString()}</td>
                <td style="padding: 12px; text-align: right;">
                    <span style="background: #dbeafe; color: #0c4a6e; padding: 4px 8px; border-radius: 4px; font-weight: bold;">
                        ${achievement}%
                    </span>
                </td>
                <td style="padding: 12px; text-align: right;">
                    <span style="background-color: ${statusColor}22; color: ${statusColor}; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">
                        ${status}
                    </span>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = html;
}

// ============= REPORTS SECTION =============
async function loadReportsInitial() {
    const campaigns = await apiCall('/api/admin/campaigns');
    
    // Populate campaign filter dropdown
    const campaignSelect = document.getElementById('report-campaign');
    campaignSelect.innerHTML = '<option value="">All Campaigns</option>';
    
    if (campaigns?.data) {
        campaigns.data.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.text = c.name;
            campaignSelect.appendChild(option);
        });
    }
    
    loadReportsData();
}

async function loadReportsData() {
    const container = document.getElementById('reports-table');
    const campaigns = await apiCall('/api/admin/campaigns');
    const transmittals = await apiCall('/api/admin/transmittals');
    
    const selectedMonth = document.getElementById('report-month').value;
    const selectedCampaign = document.getElementById('report-campaign').value;
    
    if (!campaigns?.data || !transmittals?.data) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No data available</p>';
        return;
    }
    
    let filteredTransmittals = transmittals.data;
    
    // Filter by campaign if selected
    if (selectedCampaign) {
        filteredTransmittals = filteredTransmittals.filter(t => t.campaign_id === selectedCampaign);
    }
    
    // Filter by month if selected
    if (selectedMonth) {
        filteredTransmittals = filteredTransmittals.filter(t => {
            const tDate = new Date(t.created_at);
            return (tDate.getMonth() + 1) == selectedMonth;
        });
    }
    
    if (filteredTransmittals.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No transmittals found for the selected filters</p>';
        return;
    }
    
    // Build detailed report table
    let html = `
        <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                <thead>
                    <tr style="background-color: #1e3a8a; color: white; font-weight: bold;">
                        <th style="padding: 12px; text-align: center; border: 1px solid #d1d5db;">Seat</th>
                        <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db;">Campaign</th>
                        <th style="padding: 12px; text-align: center; border: 1px solid #d1d5db;">Goal Type</th>
                        <th style="padding: 12px; text-align: right; border: 1px solid #d1d5db;">GOAL</th>
                        <th colspan="5" style="padding: 12px; text-align: center; border: 1px solid #d1d5db; background-color: #1e40af;">Productivity</th>
                        <th style="padding: 12px; text-align: right; border: 1px solid #d1d5db;">MTD</th>
                        <th style="padding: 12px; text-align: right; border: 1px solid #d1d5db;">Achievement</th>
                        <th style="padding: 12px; text-align: right; border: 1px solid #d1d5db;">RR</th>
                        <th style="padding: 12px; text-align: right; border: 1px solid #d1d5db;">RR Achievement</th>
                        <th style="padding: 12px; text-align: right; border: 1px solid #d1d5db;">WDays</th>
                        <th style="padding: 12px; text-align: right; border: 1px solid #d1d5db;">Days Lapsed</th>
                        <th style="padding: 12px; text-align: center; border: 1px solid #d1d5db;">Status</th>
                    </tr>
                    <tr style="background-color: #3b82f6; color: white; font-weight: bold;">
                        <th colspan="4" style="padding: 8px; border: 1px solid #d1d5db;"></th>
                        <th style="padding: 8px; text-align: center; border: 1px solid #d1d5db;">W1</th>
                        <th style="padding: 8px; text-align: center; border: 1px solid #d1d5db;">W2</th>
                        <th style="padding: 8px; text-align: center; border: 1px solid #d1d5db;">W3</th>
                        <th style="padding: 8px; text-align: center; border: 1px solid #d1d5db;">W4</th>
                        <th style="padding: 8px; text-align: center; border: 1px solid #d1d5db;">W5</th>
                        <th colspan="8" style="padding: 8px; border: 1px solid #d1d5db;"></th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    filteredTransmittals.forEach(t => {
        const campaign = campaigns.data.find(c => c.id === t.campaign_id);
        const campaignName = campaign?.name || 'Unknown';
        const seat = campaign?.seat || '-';
        
        // Get goal by goal type
        const goals = campaign?.goals || {};
        const goalType = t.goal_type || 'Gross Transmittals';
        const goal = goals[goalType] || campaign?.goal || 0;
        
        // Get weekly values
        const w1 = t.w1 || 0;
        const w2 = t.w2 || 0;
        const w3 = t.w3 || 0;
        const w4 = t.w4 || 0;
        const w5 = t.w5 || 0;
        
        // Calculate days lapsed and working days
        const submittedDate = new Date(t.created_at);
        const currentMonth = submittedDate.getMonth();
        const currentYear = submittedDate.getFullYear();
        const dayOfMonth = submittedDate.getDate();
        
        // Calculate working days (Mon-Fri) from 1st to current date
        let workingDaysInPeriod = 0;
        for (let d = 1; d <= dayOfMonth; d++) {
            const date = new Date(currentYear, currentMonth, d);
            const dayOfWeek = date.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
                workingDaysInPeriod++;
            }
        }
        
        // Calculate total working days for the entire month
        let totalWorkingDaysInMonth = 0;
        const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
        for (let d = 1; d <= lastDay; d++) {
            const date = new Date(currentYear, currentMonth, d);
            const dayOfWeek = date.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                totalWorkingDaysInMonth++;
            }
        }
        
        const daysLapsed = dayOfMonth;
        const mtd = t.gross_transmittals || 0;
        const runRatePerDay = totalWorkingDaysInMonth > 0 ? goal / totalWorkingDaysInMonth : 0;
        const runRateAchievementPerDay = workingDaysInPeriod > 0 ? mtd / workingDaysInPeriod : 0;
        const achievement = Math.min((mtd / (goal || 1)) * 100, 100);
        const runRateAchievementPercent = totalWorkingDaysInMonth > 0 ? (runRateAchievementPerDay / runRatePerDay) * 100 : 0;
        
        let statusColor = '#10b981';
        let status = 'On Target';
        if (achievement < 70) {
            statusColor = '#ef4444';
            status = 'Below Target';
        } else if (achievement < 85) {
            statusColor = '#f59e0b';
            status = 'At Risk';
        }
        
        const submissionDate = new Date(t.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        const finalStatus = `As of ${submissionDate} - ${status.toUpperCase()}`;
        
        html += `
            <tr style="border-bottom: 1px solid #e5e7eb; background-color: ${achievement < 70 ? '#fef2f2' : achievement < 85 ? '#fffbeb' : '#f0fdf4'};">
                <td style="padding: 10px; border: 1px solid #d1d5db; text-align: center; font-weight: 500;">${seat}</td>
                <td style="padding: 10px; border: 1px solid #d1d5db; font-weight: 500;">${campaignName}</td>
                <td style="padding: 10px; border: 1px solid #d1d5db; text-align: center; font-size: 0.8rem;">${goalType}</td>
                <td style="padding: 10px; border: 1px solid #d1d5db; text-align: right;">${goal.toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
                <td style="padding: 10px; border: 1px solid #d1d5db; text-align: right;">${w1.toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
                <td style="padding: 10px; border: 1px solid #d1d5db; text-align: right;">${w2.toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
                <td style="padding: 10px; border: 1px solid #d1d5db; text-align: right;">${w3.toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
                <td style="padding: 10px; border: 1px solid #d1d5db; text-align: right;">${w4.toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
                <td style="padding: 10px; border: 1px solid #d1d5db; text-align: right;">${w5.toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
                <td style="padding: 10px; border: 1px solid #d1d5db; text-align: right; font-weight: 600;">${mtd.toLocaleString('en-US', {maximumFractionDigits: 0})}</td>
                <td style="padding: 10px; border: 1px solid #d1d5db; text-align: right; font-weight: 600; color: #0c4a6e;">
                    ${Math.round(achievement)}%
                </td>
                <td style="padding: 10px; border: 1px solid #d1d5db; text-align: right; font-weight: 500;">
                    ${runRatePerDay.toLocaleString('en-US', {maximumFractionDigits: 0})}
                </td>
                <td style="padding: 10px; border: 1px solid #d1d5db; text-align: right; font-weight: 500; color: ${runRateAchievementPercent >= 100 ? '#10b981' : runRateAchievementPercent >= 85 ? '#f59e0b' : '#ef4444'};">
                    ${Math.round(runRateAchievementPercent)}%
                </td>
                <td style="padding: 10px; border: 1px solid #d1d5db; text-align: right; font-weight: 500;">
                    ${workingDaysInPeriod}
                </td>
                <td style="padding: 10px; border: 1px solid #d1d5db; text-align: right; font-weight: 500;">
                    ${daysLapsed}
                </td>
                <td style="padding: 10px; border: 1px solid #d1d5db; text-align: center;">
                    <span style="background-color: ${statusColor}22; color: ${statusColor}; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; display: block; white-space: nowrap;">
                        ${finalStatus}
                    </span>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
        <div style="margin-top: 15px; padding: 15px; background: #f9fafb; border-radius: 4px; font-size: 0.875rem;">
            <strong>Total Records: ${filteredTransmittals.length}</strong> | 
            <strong>Total MTD: ${filteredTransmittals.reduce((sum, t) => sum + (t.gross_transmittals || 0), 0).toLocaleString()}</strong> | 
            <strong>Avg Achievement: ${Math.round(filteredTransmittals.reduce((sum, t) => {
                const c = campaigns.data.find(x => x.id === t.campaign_id);
                const ach = Math.min((t.gross_transmittals / (c?.goal || 1)) * 100, 100);
                return sum + ach;
            }, 0) / filteredTransmittals.length)}%</strong>
        </div>
    `;
    
    container.innerHTML = html;
}

function exportReportCSV() {
    const campaigns = JSON.parse(localStorage.getItem('_cachedCampaigns') || '{}');
    const selectedMonth = document.getElementById('report-month').value;
    const selectedCampaign = document.getElementById('report-campaign').value;
    
    const table = document.querySelector('table');
    if (!table) {
        alert('No data to export');
        return;
    }
    
    // Get table data
    let csv = 'Campaign,Goal Type,Goal,W1,W2,W3,W4,W5,MTD,Achievement %,Status,Submission Date\n';
    
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = [];
        cells.forEach((cell, idx) => {
            let text = cell.textContent.trim();
            // Remove special characters and currency symbols for cleaner export
            if (idx > 2 && idx < 11) { // Numeric columns
                text = text.replace(/₱|%|,/g, '');
            }
            rowData.push(`"${text}"`);
        });
        csv += rowData.join(',') + '\n';
    });
    
    // Create download link
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `transmittals-report-${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// User Management Functions for Managers
async function renderUserManagement() {
    const formContainer = document.getElementById('create-user-form');
    const usersListContainer = document.getElementById('users-list');
    
    // Render create user form
    formContainer.innerHTML = `
        <form id="create-user-form-element" style="background: #f9fafb; padding: 15px; border-radius: 8px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 500;">Full Name</label>
                    <input type="text" id="new-user-name" placeholder="John Doe" style="width: 100%; padding: 10px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;" required>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 500;">Email</label>
                    <input type="email" id="new-user-email" placeholder="john@example.com" style="width: 100%; padding: 10px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;" required>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 500;">Password</label>
                    <input type="password" id="new-user-password" placeholder="••••••••" style="width: 100%; padding: 10px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;" required>
                </div>
                <div>
                    <label style="display: block; margin-bottom: 5px; font-weight: 500;">Role</label>
                    <select id="new-user-role" style="width: 100%; padding: 10px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px;" required>
                        <option value="operator">Operator</option>
                        <option value="admin">Admin/Manager</option>
                    </select>
                </div>
            </div>
            <button type="button" onclick="createNewUser()" style="background: var(--brand-blue); color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: all 0.3s ease;">
                ➕ Create User
            </button>
        </form>
    `;
    
    // Load and display users list
    const users = await apiCall('/api/users');
    
    if (users?.data && users.data.length > 0) {
        let html = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: var(--brand-blue); color: white;">
                        <th style="padding: 12px; text-align: left; font-weight: 600;">Name</th>
                        <th style="padding: 12px; text-align: left; font-weight: 600;">Email</th>
                        <th style="padding: 12px; text-align: left; font-weight: 600;">Role</th>
                        <th style="padding: 12px; text-align: center; font-weight: 600;">Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        users.data.forEach(user => {
            html += `
                <tr style="border-bottom: 1px solid #e5e7eb; hover: background: #f9fafb;">
                    <td style="padding: 12px;">${user.full_name}</td>
                    <td style="padding: 12px;">${user.email}</td>
                    <td style="padding: 12px;">
                        <span style="background: ${user.role === 'admin' ? 'var(--brand-navy)' : 'var(--brand-orange)'}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                            ${user.role.toUpperCase()}
                        </span>
                    </td>
                    <td style="padding: 12px; text-align: center;">
                        <button onclick="editUser('${user.id}')" style="background: var(--brand-blue); color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; margin-right: 5px;">✏️ Edit</button>
                        <button onclick="deleteUser('${user.id}', '${user.full_name}')" style="background: #ef4444; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">🗑️ Delete</button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
        usersListContainer.innerHTML = html;
    } else {
        usersListContainer.innerHTML = '<p style="color: #999; text-align: center;">No users found. Create your first operator above.</p>';
    }
}

async function createNewUser() {
    const fullName = document.getElementById('new-user-name')?.value;
    const email = document.getElementById('new-user-email')?.value;
    const password = document.getElementById('new-user-password')?.value;
    const role = document.getElementById('new-user-role')?.value || 'operator';
    
    if (!fullName || !email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    if (!email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }
    
    try {
        const result = await apiCall('/api/users', 'POST', {
            full_name: fullName,
            email: email,
            password: password,
            role: role
        });
        
        console.log('User creation response:', result);
        
        if (result?.success) {
            alert('User created successfully!');
            document.getElementById('new-user-name').value = '';
            document.getElementById('new-user-email').value = '';
            document.getElementById('new-user-password').value = '';
            renderUserManagement(); // Reload the list
        } else {
            const errorMsg = result?.message || result?.error || 'Unknown error';
            console.error('User creation failed:', errorMsg);
            alert('Error creating user:\n' + errorMsg);
        }
    } catch (error) {
        console.error('Error during user creation:', error);
        alert('Error creating user: ' + error.message);
    }
}

async function editUser(userId) {
    const newRole = prompt('Enter new role (operator/admin):');
    if (newRole && (newRole === 'operator' || newRole === 'admin')) {
        const result = await apiCall(`/api/users/${userId}`, 'PUT', { role: newRole });
        if (result?.success) {
            alert('User updated successfully!');
            renderUserManagement();
        } else {
            alert('Error updating user');
        }
    } else if (newRole !== null) {
        alert('Invalid role. Please enter "operator" or "admin"');
    }
}

async function deleteUser(userId, userName) {
    if (confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
        const result = await apiCall(`/api/users/${userId}`, 'DELETE');
        if (result?.success) {
            alert('User deleted successfully!');
            renderUserManagement();
        } else {
            alert('Error deleting user');
        }
    }
}

// ============= INITIALIZATION =============
document.addEventListener('DOMContentLoaded', () => {
    const token = getToken();
    const user = localStorage.getItem('user');
    
    if (token && user) {
        currentUser = JSON.parse(user);
        renderDashboard();
    } else {
        renderLoginPage();
    }
});
