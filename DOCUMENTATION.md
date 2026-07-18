# Restro Munch — Restaurant & Dhaba POS Software

## What Is Restro Munch?

Restro Munch is a **production-grade Point of Sale (POS) and billing software** built for Indian restaurants, dhabas, and food chains. Think of it as an affordable alternative to products like Petpooja or POSist — designed to handle real-world restaurant operations including order taking, kitchen coordination, billing with GST, inventory tracking, and multi-terminal sync.

The software is currently **frontend-only** (Phase 1 complete), with the backend planned for future phases. Even without a backend, the frontend is fully navigable using **Mock Service Worker (MSW)** which simulates API responses, and **Dexie.js (IndexedDB)** which enables offline data storage.

---

## Tech Stack

| Layer | Technology | Why We Chose It |
|-------|-----------|-----------------|
| **UI Framework** | React 19 + Vite 8 | Fast HMR, modern JSX, lightning-fast builds |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS, rapid UI development |
| **State Management** | Redux Toolkit 2.x | Predictable global state for orders, auth, POS |
| **Routing** | React Router DOM 7.x | SPA navigation with route guards |
| **Forms** | React Hook Form + Zod | Performant form handling with schema validation |
| **Charts** | Recharts 3.x | Sales analytics and reporting visualizations |
| **HTTP Client** | Axios | Interceptors for JWT refresh, retry logic |
| **Offline DB** | Dexie.js 4.x (IndexedDB) | Orders/bills stored locally when offline |
| **Real-time** | Socket.io-client | Live multi-terminal sync (cashier ↔ kitchen) |
| **API Mocking** | MSW 2.x | Browser-level API simulation for development |
| **Linting** | Oxlint | Fast Rust-based linter |
| **Testing** | Vitest + Testing Library + Playwright | Unit, integration, and E2E testing |

### Brand Identity

- **Primary Color:** Orange (`#F97316`) — energy, appetite, warmth
- **Accent Color:** Guava Pink (`#F43F5E`) — modern Indian aesthetic
- **Fonts:** Inter (UI text), JetBrains Mono (prices, codes)

---

## Project Folder Structure

```
restro-munch-software/
├── .github/                    # GitHub Actions workflows (CI/CD)
├── .gitignore                  # Git ignore rules
├── README.md                   # Quick project readme
├── DOCUMENTATION.md            # This file
└── client/                     # ← All frontend code lives here
    ├── index.html              # Vite HTML entry point
    ├── package.json            # Dependencies & npm scripts
    ├── vite.config.js          # Vite bundler configuration
    ├── tailwind.config.js      # Custom colors (orange, guava), fonts
    ├── postcss.config.js       # PostCSS plugins (Tailwind, Autoprefixer)
    ├── .oxlintrc.json          # Linter rules (React hooks, exports)
    ├── public/                 # Static assets served as-is
    │   ├── favicon.svg
    │   ├── icons.svg
    │   ├── mockServiceWorker.js    # MSW service worker (auto-generated)
    │   └── service-worker.js       # Custom PWA cache worker
    └── src/
        ├── main.jsx            # App bootstrap (MSW init + React render)
        ├── App.jsx             # Root component (Router + Redux + Toast)
        │
        ├── components/         # Shared reusable UI components
        │   ├── common/         # Design system primitives
        │   │   ├── Badge.jsx       # Status pills (success, warning, etc.)
        │   │   ├── Button.jsx      # Themed buttons with loading states
        │   │   ├── Card.jsx        # Container blocks with header/footer
        │   │   ├── ErrorBoundary.jsx  # Catches render crashes gracefully
        │   │   ├── Input.jsx       # Form inputs with error display
        │   │   ├── Loading.jsx     # Spinners (inline + full-page)
        │   │   ├── Modal.jsx       # Dialog overlays with backdrop
        │   │   ├── SearchBar.jsx   # Search input with clear button
        │   │   └── Table.jsx       # Data tables with skeletons & empty states
        │   └── layout/         # Page-level structural components
        │       ├── DashboardLayout.jsx  # Shell: sidebar + navbar + <Outlet/>
        │       ├── Navbar.jsx           # Top bar: breadcrumbs, online pill, user
        │       └── Sidebar.jsx          # Collapsible nav with role filtering
        │
        ├── constants/          # Centralized configuration values
        │   ├── errorCodes.js       # NETWORK_ERROR, PRINTER_OFFLINE, etc.
        │   ├── orderStatus.js      # NEW → COOKING → READY → SERVED → SETTLED
        │   ├── paymentModes.js     # CASH, CARD, UPI, SPLIT
        │   ├── roles.js            # ADMIN, MANAGER, CASHIER, KITCHEN
        │   └── tableStatus.js      # AVAILABLE, OCCUPIED, RESERVED
        │
        ├── features/           # Feature-based modules (core business logic)
        │   ├── auth/               # Authentication module
        │   │   ├── pages/LoginPage.jsx
        │   │   ├── pages/ResetPasswordPage.jsx
        │   │   └── slices/authSlice.js     # Redux: login, logout, tokens
        │   ├── dashboard/          # Dashboard overview module
        │   │   └── pages/DashboardPage.jsx
        │   ├── pos/                # Point of Sale module
        │   │   ├── pages/POSPage.jsx
        │   │   └── slices/posSlice.js      # Redux: tables, cart, menu, orders
        │   ├── kitchen/            # Kitchen Display System module
        │   │   └── pages/KitchenDisplayPage.jsx
        │   ├── admin/              # Admin management modules
        │   │   ├── menu/pages/MenuManagement.jsx
        │   │   ├── inventory/pages/InventoryPage.jsx
        │   │   ├── users/pages/UsersPage.jsx
        │   │   └── settings/pages/SettingsPage.jsx
        │   └── reports/            # Reports & analytics module
        │       └── pages/ReportsPage.jsx
        │
        ├── hooks/              # Custom React hooks
        │   ├── useAuth.js          # Login/logout + Redux selectors
        │   ├── useDebounce.js      # Delay search input updates
        │   ├── useFetch.js         # API fetch with IndexedDB fallback
        │   ├── useLocalStorage.js  # Reactive localStorage sync
        │   └── useOnline.js        # Browser online/offline status
        │
        ├── mocks/              # MSW mock API layer (dev only)
        │   ├── browser.js          # MSW worker setup
        │   ├── handlers.js         # Mock API route handlers
        │   └── data/               # Seed datasets
        │       ├── inventory.js
        │       ├── menuItems.js
        │       ├── orders.js
        │       ├── tables.js
        │       └── users.js
        │
        ├── routes/             # React Router configuration
        │   ├── AppRoutes.jsx       # All route definitions
        │   ├── ProtectedRoute.jsx  # Auth guard (redirect if not logged in)
        │   └── RoleBasedRoute.jsx  # Role guard (redirect if wrong role)
        │
        ├── services/           # External integrations & utilities
        │   ├── api/
        │   │   ├── apiClient.js    # Axios instance + JWT interceptors
        │   │   ├── endpoints.js    # Centralized API URL constants
        │   │   └── retryLogic.js   # Exponential backoff for failures
        │   ├── error/
        │   │   ├── errorHandlers.js  # HTTP status → user-friendly messages
        │   │   └── errorLogger.js    # Console + Sentry placeholder
        │   ├── notifications/
        │   │   ├── toastContext.jsx       # Toast provider + render container
        │   │   ├── toastContextObject.js  # React context instance
        │   │   └── useToast.js            # Hook: show('message', 'success')
        │   ├── offline/
        │   │   ├── db.js             # Dexie IndexedDB schema & helpers
        │   │   ├── networkStatus.js  # useOnlineStatus hook
        │   │   ├── syncEngine.js     # Auto-sync when back online
        │   │   └── syncQueue.js      # Queue offline operations for later
        │   ├── printing/
        │   │   ├── printQueue.js     # Queue receipts when printer offline
        │   │   ├── printService.js   # Browser iframe print injection
        │   │   └── printTemplates.js # KOT & Bill HTML generators
        │   └── realtime/
        │       ├── channels.js       # Socket event name constants
        │       ├── eventHandlers.js  # Socket → Redux + IndexedDB sync
        │       ├── socketManager.js  # Socket.io connection lifecycle
        │       └── useRealtime.js    # Hook: subscribe to socket events
        │
        ├── store/
        │   └── store.js        # Redux store (auth + pos reducers)
        │
        ├── styles/
        │   ├── globals.css     # Tailwind directives, fonts, scrollbars
        │   ├── print.css       # 80mm thermal printer media queries
        │   └── variables.css   # CSS custom properties (color tokens)
        │
        └── utils/
            ├── dateUtils.js        # formatDate, formatTime, getElapsedTime
            ├── formatCurrency.js   # ₹ INR formatting (Intl.NumberFormat)
            ├── taxCalculator.js    # CGST, SGST, service charge, round-off
            └── validators.js       # Email, Indian phone regex patterns
```

---

## Modules & Features

### 1. Authentication (`/auth/login`)

**What it does:** Staff members log in with email and password. The system assigns a role-based dashboard view.

**Current state:** Mock login — any email with any password works. The role is auto-detected from the email:
- `admin@restro.com` → Admin role
- `cashier@restro.com` → Cashier role
- `kitchen@restro.com` → Kitchen Staff role
- `manager@restro.com` → Manager role

**Features:**
- JWT token storage (localStorage)
- Automatic token refresh via Axios interceptors
- "Remember me" checkbox
- Password reset flow (simulated)
- Role-based redirect after login

### 2. Dashboard (`/dashboard`)

**What it does:** Landing page after login showing a quick overview of the restaurant's status.

**Features:**
- Welcome banner with logged-in user name
- Today's sales total (₹24,850 — mock data)
- Orders settled count with average ticket value
- Active/total tables occupancy ratio
- Recent orders feed with status badges (NEW, COOKING, READY)
- System announcements panel (GST updates, low stock warnings)

**Who sees it:** All roles

### 3. Point of Sale — POS (`/pos`)

**What it does:** The core billing terminal. Cashiers select a table, add menu items, and generate bills.

**Layout:** 3-column responsive grid:
- **Left (Tables Grid):** Visual floor plan — green (empty), orange (occupied), blue (reserved)
- **Center (Menu Catalog):** Category tabs + item cards with prices and quick-add buttons
- **Right (Bill Cart):** Running order with quantities, subtotal, GST calculation, and "Settle & Print" button

**Features:**
- Table selection with color-coded status
- Menu item filtering by category
- Cart management (add/remove items, update quantities, add notes)
- Real-time subtotal + GST (CGST 2.5% + SGST 2.5%) calculation
- Bill settlement with payment mode selection
- KOT (Kitchen Order Ticket) generation
- Table move and merge operations

**Who sees it:** Admin, Manager, Cashier

### 4. Kitchen Display System — KDS (`/kitchen`)

**What it does:** A Kanban-style board for kitchen staff to track incoming orders.

**Layout:** 3-column Kanban:
- **New Tickets** (blue) — freshly placed orders with item details and special notes
- **Cooking** (yellow) — orders currently being prepared
- **Ready to Serve** (green) — completed preparations awaiting pickup

**Features:**
- Real-time order cards with table number, elapsed time, and item list
- "Start Preparing" button moves order from New → Cooking
- "Mark as Ready" button moves order from Cooking → Ready
- Special instruction highlighting (e.g., "Make extra spicy" in red)
- Auto-sync via WebSocket (when backend is connected)

**Who sees it:** Admin, Kitchen Staff

### 5. Menu Management (`/admin/menu`)

**What it does:** CRUD interface for the restaurant's food catalog.

**Features:**
- Searchable, sortable table of all menu items
- Columns: Name, Category, Price (₹), Status (Active/Sold Out), Actions
- Add/Edit/Delete item controls
- Category management
- Bulk upload support (endpoint ready)

**Who sees it:** Admin, Manager

### 6. Inventory Management (`/admin/inventory`)

**What it does:** Tracks raw material stock levels against minimum thresholds.

**Features:**
- Stock listing with current quantity, unit, and reorder level
- Visual alerts: green "Sufficient" vs red pulsing "Reorder" badges
- Low-stock detection triggers (connected to WebSocket alerts)

**Who sees it:** Admin, Manager

### 7. Staff Management (`/admin/users`)

**What it does:** Manage restaurant staff accounts and their system roles.

**Features:**
- Staff directory table with name, role badge, and email
- Role assignment (Admin, Manager, Cashier, Kitchen Staff)
- Add/edit/remove staff members

**Who sees it:** Admin only

### 8. Settings (`/settings`)

**What it does:** Configure restaurant metadata and tax structures.

**Sections:**
- **General Info:** Restaurant name, address, contact number
- **Tax Configuration:** GST rate (%), service charge (%), GSTIN number
- Auto-split GST into CGST and SGST

**Who sees it:** Admin, Manager

### 9. Reports & Analytics (`/reports`)

**What it does:** Business intelligence dashboards for management decision-making.

**Features:**
- Sales by hour curve chart (Recharts placeholder)
- Food cost breakdown bar chart
- Day-end sales PDF export button
- Inventory consumption reports

**Who sees it:** Admin, Manager

---

## Role-Based Access Matrix

| Page | Admin | Manager | Cashier | Kitchen |
|------|:-----:|:-------:|:-------:|:-------:|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| POS Terminal | ✅ | ✅ | ✅ | ❌ |
| Kitchen KDS | ✅ | ❌ | ❌ | ✅ |
| Menu Management | ✅ | ✅ | ❌ | ❌ |
| Inventory | ✅ | ✅ | ❌ | ❌ |
| Staff Management | ✅ | ❌ | ❌ | ❌ |
| Reports | ✅ | ✅ | ❌ | ❌ |
| Settings | ✅ | ✅ | ❌ | ❌ |

---

## How to Run & Navigate

### Prerequisites
- Node.js 18+ and npm

### Start the Dev Server
```bash
cd client
npm install
npm run dev
```
The app runs at `http://localhost:5173`.

### Login & Explore Each Role

**Step 1:** Open the app → you'll see the Login Page.

**Step 2:** Enter any of these emails with ANY password:

| Email | Role | Pages You'll See |
|-------|------|-----------------|
| `admin@restro.com` | Admin | Everything — all sidebar links visible |
| `manager@restro.com` | Manager | Dashboard, POS, Menu, Inventory, Reports, Settings |
| `cashier@restro.com` | Cashier | Dashboard, POS only |
| `kitchen@restro.com` | Kitchen | Dashboard, Kitchen KDS only |

**Step 3:** After login, the sidebar shows only the pages your role can access. Click through each link to explore.

**Step 4:** To switch roles, click the logout icon (top-right) and re-login with a different email.

### Build for Production
```bash
cd client
npm run build    # Output in client/dist/
npm run preview  # Preview the production build
```

### Lint the Code
```bash
cd client
npm run lint     # Runs Oxlint
```

---

## Offline-First Architecture

Restro Munch is designed to work **without internet** — critical for dhabas on highways or restaurants with unreliable connectivity.

### How It Works

1. **IndexedDB Local Database** (`services/offline/db.js`)
   - Uses **Dexie.js** to create local tables: `orders`, `tables`, `bills`, `inventory`, `users`, `settings`
   - When the API responds, data is cached locally
   - When offline, the `useFetch` hook reads from IndexedDB instead

2. **Sync Queue** (`services/offline/syncQueue.js`)
   - Offline operations (new order, settle bill, move table) are queued in IndexedDB
   - Each operation gets a unique ID, type, timestamp, and retry counter

3. **Sync Engine** (`services/offline/syncEngine.js`)
   - Listens for the browser `online` event
   - Runs a 30-second polling interval as fallback
   - When back online, processes the queue in order
   - Failed operations retry up to 5 times before being discarded

4. **Service Worker** (`public/service-worker.js`)
   - Caches static assets (HTML, CSS, JS) on first load
   - API GET requests: network-first with cache fallback
   - Static assets: cache-first with network fallback

5. **Network Status Indicator**
   - The Navbar shows a live green "Online" or red pulsing "Offline Mode" pill
   - Uses the `useOnlineStatus` hook which listens to browser events

---

## Real-Time Multi-Terminal Sync

When the backend is connected, multiple POS terminals and KDS screens stay synchronized via WebSocket.

### Architecture
- **Socket Manager** (`services/realtime/socketManager.js`): Manages Socket.io connection with JWT auth and auto-reconnection (10 attempts)
- **Channels** (`services/realtime/channels.js`): Named events like `order:new`, `table:updated`, `kitchen:done`, `inventory:low`
- **Event Handlers** (`services/realtime/eventHandlers.js`): Incoming socket events update both Redux store AND IndexedDB cache
- **useRealtime Hook** (`services/realtime/useRealtime.js`): Components subscribe to specific events with automatic cleanup

### Flow Example
1. Cashier at Terminal A creates an order → emits `order:new`
2. Server broadcasts `order:updated` to all terminals
3. Kitchen KDS receives the event → new ticket appears in "New" column
4. Kitchen marks order ready → emits `kitchen:done`
5. All cashier terminals see the table status update

---

## Thermal Printing

### How Bills & KOTs Are Printed

1. **Print Templates** (`services/printing/printTemplates.js`)
   - `generateKOTHTML()` — Kitchen Order Ticket with item list, quantities, special notes
   - `generateBillHTML()` — Full customer bill with restaurant header, GSTIN, item breakdown, CGST/SGST split, round-off, grand total, and footer

2. **Print Service** (`services/printing/printService.js`)
   - Creates a hidden iframe, injects the receipt HTML, and triggers `window.print()`
   - Designed for 80mm thermal printers

3. **Print Queue** (`services/printing/printQueue.js`)
   - If printing fails (printer offline), the job is stored in IndexedDB
   - Jobs can be retried later when the printer is back

4. **Print CSS** (`styles/print.css`)
   - `@media print` rules that hide everything except the receipt area
   - Optimized for 80mm paper width with monospace fonts

---

## Tax Calculation (GST)

The `utils/taxCalculator.js` handles Indian GST billing:

```
Subtotal (sum of items × qty)
  - Discount (percentage or flat amount)
  = Discounted Subtotal
  + Service Charge (optional %)
  + CGST (half of GST rate)
  + SGST (half of GST rate)
  ± Round Off (to nearest ₹1)
  = Grand Total
```

Default: 5% GST = 2.5% CGST + 2.5% SGST (configurable in Settings).

---

## Error Handling Strategy

| Layer | Tool | What It Does |
|-------|------|-------------|
| **Render Errors** | `ErrorBoundary.jsx` | Catches React component crashes, shows fallback UI with reload button |
| **API Errors** | `errorHandlers.js` | Maps HTTP 401/403/404/5xx to user-friendly messages |
| **Network Errors** | Axios interceptor | Detects offline state, flags error for sync queue |
| **Retry Logic** | `retryLogic.js` | Exponential backoff (1s → 2s → 4s) for network/5xx errors, max 3 retries |
| **Logging** | `errorLogger.js` | Console logging now, Sentry integration placeholder for production |
| **User Feedback** | `ToastProvider` | Color-coded toast notifications (success/error/warning/info) |

---

## Do Restaurants Need All These Features?

**Yes.** Here's why each module exists for real dhabas and restaurants:

| Feature | Why It's Essential |
|---------|-------------------|
| **POS Terminal** | Core requirement — every restaurant needs to take orders and generate bills |
| **KDS (Kitchen Display)** | Eliminates paper KOTs, reduces miscommunication, tracks prep time |
| **Menu Management** | Prices change, seasonal items rotate, items run out — needs CRUD |
| **Inventory Tracking** | Prevents stockouts (running out of paneer mid-service is a disaster) |
| **GST Billing** | Legal requirement in India — GSTIN, CGST/SGST split on every bill |
| **Thermal Printing** | Customers expect printed receipts; kitchen needs physical tickets |
| **Offline Mode** | Highway dhabas, rural areas — internet drops are common |
| **Multi-Terminal Sync** | Busy restaurants have 2-3 billing counters + kitchen — all must stay in sync |
| **Role-Based Access** | Kitchen staff shouldn't access settings; cashiers shouldn't delete menu items |
| **Reports** | Owners need daily sales, food cost analysis, and stock consumption data |

### Features We Could Add Later
- **QR Code Menu** — Customers scan table QR to view menu on their phones
- **Online Order Integration** — Accept Zomato/Swiggy orders directly into POS
- **Customer Loyalty** — Points system for repeat customers
- **Multi-Outlet Support** — Chain restaurants managing multiple locations
- **Waiter App** — Mobile order taking at tables
- **SMS/WhatsApp Receipts** — Digital bills sent to customer phones
- **Shift Management** — Staff clock-in/clock-out with cash handover

---

## Backend Plan (Future Phases)

The frontend is backend-ready. Here's what the server will include:

### Tech Stack (Planned)
- **Runtime:** Node.js + Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Auth:** JWT (access + refresh tokens)
- **Real-time:** Socket.io server
- **File Storage:** Cloudinary (menu item images)
- **Deployment:** Docker + CI/CD

### Backend API Modules

#### 1. Auth Service (`/api/v1/auth/`)
- POST `/login` — Email + password authentication
- POST `/logout` — Invalidate refresh token
- POST `/refresh-token` — Issue new access token
- POST `/reset-password` — Send recovery email
- POST `/verify-token` — Validate current session

#### 2. Orders Service (`/api/v1/orders/`)
- GET `/` — List active orders (filterable by status, table)
- POST `/` — Create new order
- PUT `/:id` — Update order items/status
- POST `/:id/settle` — Settle bill with payment mode
- POST `/:id/move` — Move order to different table
- POST `/:id/split` — Split order across tables

#### 3. Menu Service (`/api/v1/menu/`)
- GET `/categories` — List all food categories
- GET `/items` — List menu items (with search, pagination)
- POST `/items` — Add new menu item
- PUT `/items/:id` — Update item details/price/availability
- DELETE `/items/:id` — Remove menu item
- POST `/items/bulk-upload` — CSV/Excel bulk import

#### 4. Inventory Service (`/api/v1/inventory/`)
- GET `/materials` — List raw materials with stock levels
- POST `/materials` — Add new ingredient
- PUT `/materials/:id` — Update stock/reorder level
- GET `/recipes` — Ingredient-to-menu-item mappings
- GET `/low-stock-alerts` — Items below reorder threshold

#### 5. Users Service (`/api/v1/users/`)
- GET `/` — List staff members
- POST `/` — Create new staff account
- PUT `/:id` — Update role/credentials
- DELETE `/:id` — Deactivate staff account

#### 6. Settings Service (`/api/v1/settings/`)
- GET/PUT `/general` — Restaurant name, address, phone
- GET/PUT `/taxes` — GST rate, service charge, GSTIN
- GET/PUT `/integrations` — Aggregator API keys

#### 7. Reports Service (`/api/v1/reports/`)
- GET `/sales` — Sales summaries (daily/weekly/monthly)
- GET `/inventory` — Stock consumption reports
- GET `/food-cost` — Ingredient cost vs menu price analysis

#### 8. WebSocket Events (Socket.io)
- `order:new` / `order:updated` — Sync orders across terminals
- `table:updated` — Table status changes
- `kitchen:queued` / `kitchen:done` — KDS pipeline events
- `inventory:low` — Real-time low stock alerts

### Backend Security
- Helmet.js for HTTP headers
- Rate limiting on auth endpoints
- Role-based middleware guards
- Input sanitization (express-validator)
- CORS whitelist configuration

---

## Summary

Restro Munch is a complete restaurant management solution with:
- **9 frontend modules** covering every aspect of restaurant operations
- **4 user roles** with granular access control
- **Offline-first** architecture for unreliable networks
- **Real-time sync** infrastructure for multi-terminal setups
- **Indian GST-compliant** billing with thermal printer support
- **Production-ready** error handling, retry logic, and logging

The frontend is fully navigable today using mock data. The backend (Node.js + MongoDB) will plug in seamlessly through the pre-configured Axios client, endpoint constants, and Socket.io manager.
