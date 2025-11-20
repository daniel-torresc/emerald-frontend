# Phase 3: Advanced Features

**Status:** 🟡 Pending Phase 2
**Priority:** High
**Estimated Effort:** 4-5 weeks
**Dependencies:** Phase 2 (Core Data Management)

---

## Overview

Phase 3 implements the platform's most distinctive features: CSV import with pre-persistence editing, multi-taxonomy categorization, auto-categorization rules, transaction splitting, and account sharing. This is where Emerald truly differentiates from competitors.

**Key Principle:** Unique features executed flawlessly.

---

## Goals

1. ✅ Build CSV import wizard with drag-drop and column mapping
2. ✅ Implement pre-persistence transaction editing (unique feature)
3. ✅ Create category and taxonomy management
4. ✅ Build auto-categorization rule engine
5. ✅ Add transaction splitting functionality
6. ✅ Implement account sharing with permissions
7. ✅ Add bulk transaction operations

---

## Core Features

### 1. CSV Import Wizard (6-Step Flow)

**Step 1: File Upload**
- Drag-and-drop zone
- File picker button
- CSV format validation
- File size limit (max 10MB)
- Papa Parse with Web Worker

**Step 2: Account Selection**
- Select destination account (dropdown)
- Option to create new account inline
- Account balance preview

**Step 3: Column Mapping**
- Auto-detect common column names
- Manual mapping dropdowns:
  - Date → transaction date
  - Description/Merchant → merchant name
  - Amount → transaction amount
  - Category → category (optional)
- Preview table shows first 5 rows
- Save mapping template for future imports

**Step 4: Pre-Persistence Editing** ⭐ UNIQUE FEATURE
- Editable table with all parsed transactions
- Inline editing for any field:
  - Date (date picker)
  - Merchant (text input)
  - Amount (number input)
  - Category (dropdown)
  - Tags (multi-select)
- Visual indicators for modified rows (accent border)
- Undo/redo functionality
- Search and filter within preview
- Validation warnings (invalid dates, negative amounts for expense accounts)

**Step 5: Duplicate Detection**
- Check against existing transactions
- Show potential duplicates
- Allow user to skip duplicates
- Configurable matching rules (date + amount + merchant)

**Step 6: Confirmation & Import**
- Summary: X transactions to import, Y duplicates skipped, Z modified
- Progress bar during import
- Success message with link to transactions
- Option to import more files

**Deliverables:**
- [ ] CSV upload component
- [ ] Column mapper component
- [ ] Editable transaction table (pre-import)
- [ ] Duplicate detection UI
- [ ] Import progress tracker
- [ ] Import history list (with rollback option)
- [ ] Saved mapping templates

---

### 2. Category & Taxonomy Management

**Multi-Taxonomy System:**
```typescript
interface CategoryTaxonomy {
  id: string
  name: string // e.g., "Expense Type", "Projects", "Trips", "People"
  categories: Category[]
  color: string
  icon: string
}

interface Category {
  id: string
  name: string
  taxonomyId: string
  parentId: string | null // For hierarchical categories
  color: string
}
```

**Category Manager Page:**
- Create/edit/delete taxonomies
- Create/edit/delete categories within taxonomies
- Hierarchical tree view (parent-child)
- Drag-and-drop reordering
- Color picker for categories
- Icon picker
- Category usage statistics

**Transaction Categorization:**
- Assign multiple categories from different taxonomies
- Example: "Groceries" (Expense Type) + "Vacation 2025" (Trip) + "Home" (Project)
- Category badges with colors
- Quick add from transaction list

**Deliverables:**
- [ ] Taxonomy management page
- [ ] Category creation forms
- [ ] Hierarchical category tree
- [ ] Color and icon pickers
- [ ] Multi-select category dropdowns
- [ ] Category statistics dashboard

---

### 3. Auto-Categorization Rules

**Rule Engine:**
```typescript
interface CategorizationRule {
  id: string
  name: string
  priority: number
  conditions: {
    field: 'merchant' | 'amount' | 'description'
    operator: 'contains' | 'equals' | 'greater_than' | 'less_than' | 'matches_regex'
    value: string | number
  }[]
  actions: {
    type: 'set_category' | 'add_tag' | 'set_notes'
    value: string
  }[]
  isActive: boolean
}
```

**Rules Management Page:**
- List all rules
- Create/edit/delete rules
- Enable/disable rules
- Set rule priority (execution order)
- Test rule against sample transactions
- View rule match history

**Rule Builder UI:**
- Visual rule builder (no-code)
- Condition groups (AND/OR logic)
- Preview matching transactions
- Suggested rules based on historical data

**Auto-Application:**
- Run rules on CSV import
- Run rules on manual transaction creation
- Bulk re-apply rules to existing transactions

**Deliverables:**
- [ ] Rule management page
- [ ] Rule builder component
- [ ] Rule testing interface
- [ ] Bulk rule application
- [ ] Rule match statistics

---

### 4. Transaction Splitting

**Split Transaction Flow:**
1. Select transaction to split
2. Click "Split" button
3. Define split parts:
   - Each part has: amount, category, notes
   - Sum of parts must equal original amount
   - Visual pie chart shows split distribution
4. Save split
5. Original transaction marked as "split"
6. Child transactions created and linked

**Split UI:**
```
Original: Costco -$234.56

Split into:
┌─────────────────────────────┐
│ Groceries      -$150.00  64%│
│ Electronics     -$84.56  36%│
├─────────────────────────────┤
│ Total:         -$234.56 100%│
│ [Add Part] [Save]           │
└─────────────────────────────┘
```

**Deliverables:**
- [ ] Split transaction modal
- [ ] Split part editor
- [ ] Visual split distribution
- [ ] Split validation
- [ ] Linked transaction indicator

---

### 5. Account Sharing & Permissions

**Sharing Model:**
```typescript
interface AccountShare {
  id: string
  accountId: string
  userId: string
  permission: 'viewer' | 'editor' | 'admin'
  invitedBy: string
  invitedAt: Date
  acceptedAt: Date | null
}
```

**Permissions:**
- **Viewer:** View transactions, cannot edit
- **Editor:** View and edit transactions, cannot delete account
- **Admin:** Full control (edit, delete, share)

**Sharing Flow:**
1. Account owner clicks "Share"
2. Enter user email or username
3. Select permission level
4. Send invitation
5. Invitee receives notification
6. Invitee accepts/declines
7. Access granted

**Shared Account Indicators:**
- Badge on account card: "Shared with 2 users"
- List of users with access
- Ability to revoke access

**Deliverables:**
- [ ] Share account modal
- [ ] User search/autocomplete
- [ ] Permission selector
- [ ] Invitation system
- [ ] Access management page
- [ ] Permission-based UI rendering

---

### 6. Bulk Operations

**Bulk Actions:**
- Select multiple transactions (checkbox)
- Actions available:
  - Categorize (assign category to all)
  - Tag (add tag to all)
  - Delete (with confirmation)
  - Export (CSV, JSON)
  - Mark as reviewed

**Bulk Edit Modal:**
```
5 transactions selected

Actions:
[ ] Categorize as: [Dropdown]
[ ] Add tags: [Multi-select]
[ ] Mark as reviewed

[Cancel] [Apply]
```

**Deliverables:**
- [ ] Bulk selection UI
- [ ] Bulk action toolbar
- [ ] Bulk edit modal
- [ ] Bulk delete confirmation
- [ ] Bulk export functionality

---

## API Endpoints Required

### CSV Import
- `POST /api/import/upload` - Upload CSV file
- `POST /api/import/map-columns` - Save column mapping
- `POST /api/import/preview` - Get parsed transactions preview
- `POST /api/import/execute` - Import transactions
- `GET /api/import/history` - Import history
- `POST /api/import/rollback/:importId` - Rollback import

### Categories & Taxonomies
- `GET /api/taxonomies` - List taxonomies
- `POST /api/taxonomies` - Create taxonomy
- `PATCH /api/taxonomies/:id` - Update taxonomy
- `DELETE /api/taxonomies/:id` - Delete taxonomy
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PATCH /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Rules
- `GET /api/rules` - List rules
- `POST /api/rules` - Create rule
- `PATCH /api/rules/:id` - Update rule
- `DELETE /api/rules/:id` - Delete rule
- `POST /api/rules/:id/test` - Test rule
- `POST /api/rules/apply-bulk` - Apply rules to transactions

### Splits
- `POST /api/transactions/:id/split` - Split transaction
- `GET /api/transactions/:id/splits` - Get split parts

### Sharing
- `POST /api/accounts/:id/share` - Share account
- `GET /api/accounts/:id/shares` - List account shares
- `DELETE /api/accounts/:id/shares/:shareId` - Revoke access
- `POST /api/invitations/:id/accept` - Accept invitation

---

## Testing Requirements

### Unit Tests
- CSV parsing logic
- Column mapping validation
- Duplicate detection algorithm
- Rule matching logic
- Split validation

### Integration Tests
- Complete import flow
- Category assignment
- Rule application
- Split transaction creation
- Sharing invitation flow

### E2E Tests
- Import CSV end-to-end
- Edit transactions before import
- Create and apply rule
- Split transaction
- Share account and accept invitation

---

## Performance Targets

- CSV parsing (10K rows): < 5 seconds
- Editable table (1K rows): < 200ms render
- Rule execution (1K transactions): < 2 seconds
- Duplicate detection (10K transactions): < 3 seconds
- Import progress updates: Real-time

---

## Definition of Done

Phase 3 is complete when:

- [ ] CSV import wizard fully functional
- [ ] Pre-persistence editing works flawlessly
- [ ] Multi-taxonomy categorization implemented
- [ ] Auto-categorization rules work
- [ ] Transaction splitting functional
- [ ] Account sharing with permissions works
- [ ] Bulk operations implemented
- [ ] All Phase 3 tests pass (>80% coverage)
- [ ] Import performance meets targets
- [ ] Mobile-responsive import flow

---

## Next Phase Preview

Phase 4 will focus on:
- Advanced analytics and reporting
- Budget tracking
- Performance optimization
- Accessibility audit
- PWA features (offline support)
- Admin dashboard
- Settings and preferences

**Phase 3 provides:**
- Complete import workflow
- Flexible categorization
- Automation capabilities
- Collaboration features
