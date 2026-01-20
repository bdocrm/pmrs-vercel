# Sales Performance Monitoring Feature

## Overview
Added comprehensive sales performance monitoring to both operator and manager dashboards, comparing current month vs last month metrics.

## Features Added

### Backend API Endpoint
**`GET /api/performance/monthly`** (Authentication Required)

Calculates monthly performance comparison with the following metrics:

**Current Month Data:**
- Total Transmittals (count)
- Total Gross Transmittals (amount)
- Average Conversion Rate (%)
- Total Bookings
- Total Approvals

**Last Month Data:**
- Same metrics as current month

**Change Calculations:**
- Percentage change for: Transmittals, Gross Transmittals, Bookings, Approvals
- Absolute difference for: Conversion Rate (in percentage points)

**Role-Based Data:**
- **Operators**: See their own personal performance (own user_id data)
- **Admins/Managers**: See team-wide aggregated performance (all users' data combined)

### Frontend Components

#### Operator Dashboard (`renderDashboard()` / `loadDashboardStats()`)
- Displays personal sales performance comparison
- Shows 5 performance cards comparing last month vs current month:
  1. Gross Transmittals ($)
  2. Transmittals Count (#)
  3. Avg Conversion Rate (%)
  4. Bookings (#)
  5. Approvals (#)

#### Manager Dashboard (`renderManagerDashboard()` / `loadManagerPerformanceComparison()`)
- Displays team-wide sales performance comparison
- Same 5 performance cards but with aggregated data
- Shows in the Monthly View tab
- Automatically loads when manager dashboard initializes

### UI/UX Components

#### Performance Card Display
Each performance card includes:
- **Metric Label**: Clear identifier (uppercase, small font)
- **Side-by-Side Comparison**: 
  - Current Month (left)
  - "vs" separator (center)
  - Last Month (right)
- **Change Indicator**: Visual trend indicator with emoji
  - 📈 Green badge for increases
  - 📉 Red badge for decreases
  - ➡️ Gray badge for no change
  - Percentage or absolute change displayed

#### Visual Styling
- Gradient background (light blue-gray)
- Hover effects with shadow and slight elevation
- Responsive grid layout (auto-fit minimum 320px width)
- Color-coded badges for quick visual scanning

### CSS Classes Added
```css
.performance-grid          /* Container for performance cards */
.performance-card          /* Individual card styling */
.performance-metric        /* Content wrapper */
.metric-label              /* Label text styling */
.metric-values             /* Grid for comparison display */
.current / .previous       /* Month data containers */
.month-label               /* Month name styling */
.comparison                /* "vs" separator styling */
.change-indicator          /* Container for trend display */
.trend-up                  /* Green/success styling */
.trend-down                /* Red/danger styling */
.trend-neutral             /* Gray/neutral styling */
```

## Data Flow

### Operator Dashboard
```
renderDashboard() 
  → loadDashboardStats()
    → Promise.all([
        apiCall('/api/transmittals/stats'),
        apiCall('/api/performance/monthly')  // NEW
      ])
    → Renders performance cards with user's personal data
```

### Manager Dashboard
```
renderManagerDashboard()
  → loadManagerData()
    → loadManagerPerformanceComparison(performanceData)  // NEW
    → Inserts performance cards into monthly view
```

## Response Example

```json
{
  "success": true,
  "currentMonth": {
    "label": "January 2026",
    "totalTransmittals": 45,
    "totalGross": 125000.50,
    "avgConversionRate": 8.5,
    "totalBookings": 12,
    "totalApprovals": 38
  },
  "lastMonth": {
    "label": "December 2025",
    "totalTransmittals": 38,
    "totalGross": 98000.75,
    "avgConversionRate": 7.2,
    "totalBookings": 9,
    "totalApprovals": 31
  },
  "changes": {
    "transmittals": 18.42,      // 18.42% increase
    "gross": 27.55,              // 27.55% increase
    "conversionRate": 1.3,       // +1.3 percentage points
    "bookings": 33.33,           // 33.33% increase
    "approvals": 22.58           // 22.58% increase
  }
}
```

## Performance Indicators

### Visual Interpretation
- **Green 📈**: Metric improved vs last month (positive change)
- **Red 📉**: Metric declined vs last month (negative change)
- **Gray ➡️**: Metric unchanged vs last month (no change)

### Conversion Rate Special Case
- Shows absolute difference in percentage points (not %)
- Example: 8.5% → 9.2% = +0.7 percentage points

## Files Modified

1. **api/index.js**
   - Added `GET /api/performance/monthly` endpoint
   - Calculates monthly metrics and percentage changes

2. **js/app.js**
   - Updated `loadDashboardStats()` to fetch performance data
   - Added `loadManagerPerformanceComparison()` function
   - Updated `loadManagerData()` to load performance data

3. **css/styles.css**
   - Added performance card styles
   - Added responsive grid layout
   - Added trend indicator styling

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript Promise support
- Grid layout supported in all modern browsers

## Future Enhancements

1. **Charts**: Add Chart.js visualization for trend lines
2. **Filters**: Filter by campaign, date range, goal type
3. **Export**: Download performance reports as CSV/PDF
4. **Alerts**: Set performance thresholds with notifications
5. **Individual Operator View**: Managers can click to see individual operator performance
6. **Goal vs Actual**: Show progress toward campaign goals in monthly comparison
7. **Weekly Breakdown**: Show week-by-week trend within each month

## Testing

To test the feature:

1. **Operator View**:
   - Login as operator
   - Go to Dashboard
   - Verify performance cards show below stats grid
   - Check that metrics compare current vs last month

2. **Manager View**:
   - Login as admin/manager
   - Go to Manager Dashboard
   - Click "📊 Monthly View" tab
   - Verify performance cards show aggregated team data
   - Check percentage changes are calculated correctly

3. **Edge Cases**:
   - Test with no transmittals in a month (should show 0 or N/A)
   - Test with first month of data (last month will be 0)
   - Test month transitions (e.g., Dec 31 → Jan 1)
