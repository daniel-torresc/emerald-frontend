# Phase 2: Core Data Management

**Status:** 🟡 Pending Phase 1
**Priority:** High
**Estimated Effort:** 3-4 weeks
**Dependencies:** Phase 1 (Foundation & Authentication)

---

## Overview

Phase 2 builds the core data management features: accounts, transactions, and the dashboard. Users can now create accounts, view transactions, and see their financial overview. This phase establishes the data visualization patterns and table interactions that will be reused throughout the app.

**Key Principle:** Create robust, reusable data patterns that scale.

---

## Goals

1. ✅ Implement account management (list, create, view, edit, delete)
2. ✅ Build transaction list with virtual scrolling and filtering
3. ✅ Create dashboard with account overview and charts
4. ✅ Establish data table patterns with TanStack Table
5. ✅ Implement search and basic filtering
6. ✅ Add data visualization components (Recharts)
7. ✅ Create transaction detail view

---

## Core Features

### 1. Dashboard Page

**Overview Widgets:**
- Total net worth (sum of all account balances)
- Number of accounts
- Recent transactions list (last 10)
- Balance trend chart (line chart, 30 days)
- Spending by category (pie chart, current month)

**Layout:**
```
┌─────────────────────────────────────────┐
│  Net Worth: $12,345.67    📈 +2.3%      │
│  5 Accounts                              │
├─────────────────────────────────────────┤
│  Balance Trend (30 days)                │
│  [Line Chart]                            │
├─────────────────────────────────────────┤
│  Recent Transactions                    │
│  Starbucks     -$5.42     Today        │
│  Paycheck    +$3,250.00   Yesterday    │
│  ...                                     │
├─────────────────────────────────────────┤
│  Spending by Category                   │
│  [Pie Chart]                            │
└─────────────────────────────────────────┘
```

**Deliverables:**
- [ ] Dashboard route and component
- [ ] Summary cards component
- [ ] Balance trend chart (Recharts)
- [ ] Recent transactions list
- [ ] Spending breakdown chart
- [ ] Responsive grid layout

---

### 2. Account Management

**Account List Page:**
- Grid/list view of all accounts
- Each card shows: name, balance, currency, bank, last transaction date
- Search by account name
- Filter by account type
- Sort by balance, name, date
- "Create Account" button

**Account Creation Form:**
```typescript
{
  name: string         // Required, max 100 chars
  type: enum           // checking, savings, credit, investment
  currency: string     // USD, EUR, GBP, etc.
  bank: string?        // Optional, max 100 chars
  openingBalance: number?  // Optional, defaults to 0
  notes: string?       // Optional
}
```

**Account Detail Page:**
- Account header with balance
- Edit/delete buttons (if owner)
- Transaction list for this account
- Balance history chart
- Account metadata
- Shared access list (Phase 3 feature, placeholder)

**Account Edit/Delete:**
- Edit modal with form (same fields as create)
- Delete requires confirmation
- Soft delete (mark as inactive)
- Validation prevents deletion if has transactions (warning)

**Deliverables:**
- [ ] Account list page with grid layout
- [ ] Account card component
- [ ] Create account form with validation
- [ ] Account detail page
- [ ] Edit account modal
- [ ] Delete confirmation dialog
- [ ] Search and filter UI
- [ ] Account API hooks (TanStack Query)

---

### 3. Transaction List & Detail

**Transaction List Features:**
- Virtual scrolling with TanStack Virtual (handles 10,000+ rows)
- Columns: Date, Merchant, Category, Amount, Account
- Sort by any column
- Search by merchant/description
- Filter by date range, account, category
- Color-coded: income (green), expense (red)
- Pagination or infinite scroll
- Bulk select (for future bulk operations)

**Transaction List Component:**
```tsx
<TransactionTable
  data={transactions}
  isLoading={isLoading}
  onRowClick={(transaction) => navigate to detail}
  sorting={sorting}
  onSortingChange={setSorting}
  filtering={filters}
  onFilteringChange={setFilters}
/>
```

**Transaction Detail View:**
- Modal or side drawer
- All transaction fields displayed
- Edit button (if has permission)
- Delete button (if has permission)
- Tags displayed
- Categories displayed
- Notes/comments
- Created/modified metadata

**Deliverables:**
- [ ] Transaction list page
- [ ] TanStack Table configuration
- [ ] Virtual scrolling integration
- [ ] Sort, filter, search UI
- [ ] Transaction row component
- [ ] Transaction detail modal
- [ ] Color coding for income/expense
- [ ] Transaction API hooks

---

### 4. Data Visualization Components

**Balance Trend Chart (Recharts Line Chart):**
```tsx
<LineChart data={balanceHistory}>
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Line
    type="monotone"
    dataKey="balance"
    stroke="var(--accent)"
    strokeWidth={2}
  />
</LineChart>
```

**Spending Breakdown (Recharts Pie Chart):**
```tsx
<PieChart>
  <Pie
    data={spendingByCategory}
    dataKey="amount"
    nameKey="category"
    cx="50%"
    cy="50%"
    fill="var(--accent)"
  />
  <Tooltip />
  <Legend />
</PieChart>
```

**Chart Theming:**
- Dark mode colors
- Accent color for primary data
- No shadows or heavy borders
- Clean, minimal axes
- Tooltips styled with dark theme

**Deliverables:**
- [ ] Reusable chart wrapper components
- [ ] Line chart component
- [ ] Pie chart component
- [ ] Bar chart component (for future)
- [ ] Responsive chart containers
- [ ] Dark mode chart theme
- [ ] Loading states for charts

---

### 5. Search & Filter System

**Search Component:**
- Real-time search (debounced)
- Search icon + clear button
- Placeholder text
- Keyboard shortcuts (Cmd+K)

**Filter Panel:**
```tsx
<FilterPanel>
  <DateRangeFilter />
  <AccountFilter />
  <CategoryFilter />
  <AmountRangeFilter />
  <ClearFiltersButton />
</FilterPanel>
```

**Filter State Management (Zustand):**
```typescript
interface FilterState {
  search: string
  dateRange: { start: Date; end: Date } | null
  accounts: string[]
  categories: string[]
  amountRange: { min: number; max: number } | null
}
```

**URL State Sync (TanStack Router):**
- Filters reflected in URL search params
- Shareable filtered views
- Back button restores filters

**Deliverables:**
- [ ] Search input component
- [ ] Date range picker
- [ ] Multi-select dropdowns (accounts, categories)
- [ ] Amount range inputs
- [ ] Filter state store
- [ ] URL sync with filters
- [ ] Clear all filters button

---

## API Endpoints Required

### Accounts
- `GET /api/accounts` - List user's accounts
- `POST /api/accounts` - Create new account
- `GET /api/accounts/:id` - Get account details
- `PATCH /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account (soft)
- `GET /api/accounts/:id/transactions` - Get account transactions
- `GET /api/accounts/:id/balance-history` - Balance over time

### Transactions
- `GET /api/transactions` - List transactions (with pagination, filters)
- `GET /api/transactions/:id` - Get transaction details
- `PATCH /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Dashboard
- `GET /api/dashboard/summary` - Net worth, account count, etc.
- `GET /api/dashboard/balance-trend` - 30-day balance history
- `GET /api/dashboard/spending-by-category` - Current month breakdown

---

## Testing Requirements

### Unit Tests
- Account form validation
- Transaction filters logic
- Date range calculations
- Amount formatting utilities

### Integration Tests
- Account creation flow
- Transaction list rendering with data
- Chart data transformation
- Search and filter interactions

### E2E Tests
- Create account end-to-end
- View and edit account
- Navigate to transaction detail
- Apply filters and see results
- Dashboard loads with data

---

## Performance Targets

- Transaction list: Render 1000 rows in < 200ms
- Virtual scrolling: Smooth 60fps scroll
- Dashboard load: < 2s with all charts
- Chart rendering: < 500ms per chart
- Filter application: < 100ms response

---

## Design Requirements

### Account Cards
```
┌────────────────────────────┐
│ Checking                  │
│ $4,234.56                 │
│ Chase Bank                │
│ Last: 2 hours ago         │
└────────────────────────────┘
```
- No heavy borders or shadows
- Typography-based hierarchy
- Hover: subtle background change
- Click: navigate to detail

### Transaction Rows
```
Today
┃ Starbucks Coffee     -$5.42
┃ Grocery Store       -$84.32
Yesterday
┃ Paycheck         +$3,250.00
```
- Timeline-style with accent line
- Date grouping
- Tabular number formatting
- Color-coded amounts

---

## Definition of Done

Phase 2 is complete when:

- [ ] Dashboard displays account summary and charts
- [ ] User can create/edit/delete accounts
- [ ] Transaction list displays with virtual scrolling
- [ ] Search and filters work correctly
- [ ] Charts render with correct data
- [ ] Account detail page works
- [ ] Transaction detail modal works
- [ ] All Phase 2 tests pass (>80% coverage)
- [ ] Performance targets met
- [ ] Mobile responsive

---

## Dependencies & Blockers

**Backend Requirements:**
- Account CRUD endpoints
- Transaction list endpoint with pagination
- Dashboard summary endpoint
- Balance history calculations

**Phase 1 Prerequisites:**
- Authentication working
- Routing infrastructure
- Component library
- API client configured

**External:**
- Recharts library integration
- TanStack Table learning curve
- Virtual scrolling performance tuning

---

## Next Phase Preview

Phase 3 will add:
- CSV import wizard (drag-drop, column mapping, preview)
- Category management
- Transaction categorization
- Auto-categorization rules
- Transaction splitting
- Account sharing (permissions)

**Phase 2 provides:**
- Data table patterns
- Chart components
- Filter architecture
- CRUD operations established
