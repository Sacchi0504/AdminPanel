# Product Admin Dashboard

A production-style, highly responsive Product Administration Dashboard built with **Next.js (App Router)**, **React**, **Tailwind CSS**, and **Axios**, powered by the **DummyJSON API**.

---

## 🚀 Live Demo & Repository

- **Repository**: Public GitHub repository with clean, incremental milestone commits.
- **Demo Credentials**:
  - **Username**: `emilys`
  - **Password**: `emilyspass`
  *(A convenient 1-click "Auto-fill" button is also provided on the login page)*

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Library**: React 19
- **Styling**: Tailwind CSS (Curated dark mode palette, glassmorphism, responsive table & mobile card layouts)
- **HTTP Client**: Axios (Custom shared instance with request & response interceptors)
- **Icons**: Lucide React
- **API**: [DummyJSON](https://dummyjson.com)

> [!NOTE]
> Per the project requirements, **no React Query, SWR, or ready-made table/pagination libraries** are used. All state management, pagination, request cancellation, and debouncing are implemented natively with React hooks and Axios.

---

## 📦 Setup & Local Development

### Prerequisites
- Node.js >= 18.18.0 (Tested on Node.js v24.x)
- npm >= 9.x

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd adminPanel

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=https://dummyjson.com
```

---

## ✨ Features Checklist

### 1. Authentication & Security
- [x] **Secure-looking Login**: Modern glassmorphism card UI with validation feedback.
- [x] **Credentials Validation**: Validates required inputs client-side before sending requests.
- [x] **API Error Alerts**: Displays normalized API failure banners (e.g. `Invalid credentials`).
- [x] **Protected Routes**: `/products`, `/products/new`, `/products/[id]`, `/products/[id]/edit` redirect unauthenticated users to `/login`.
- [x] **Duplicate Submission Guard**: Disables the submit button and prevents duplicate requests on rapid clicks.
- [x] **Session Persistence**: Stores auth token and user profile in `localStorage`; shared Axios interceptor automatically injects `Authorization: Bearer <token>`.
- [x] **Logout Flow**: Clears auth tokens, client state, and redirects safely to `/login`.

### 2. Product Catalog & Responsive Layout
- [x] **Desktop Table Layout**: Shows Image, Title & Brand, Category badge, Formatted Price, Star Rating with reviews count, Stock indicator badge, and Action buttons (View, Edit, Delete).
- [x] **Mobile Card Layout**: Seamlessly transforms table into clean cards on viewports under `768px`.
- [x] **Clickable Sort Headers**: Click any column header (Price, Rating, Title) to toggle ascending/descending order.

### 3. Server-Side Pagination
- [x] **Server-Side API Pagination**: Integrates with DummyJSON's `limit` and `skip` parameters (`skip = (page - 1) * pageSize`).
- [x] **Range Indicator**: Displays `Showing 21–40 of 194 products`.
- [x] **Page Size Options**: Supports `10`, `20`, and `50` items per page.
- [x] **Smart Page Numbers**: Renders numbered page buttons with ellipses (`1, 2, 3 ... 10`).
- [x] **URL Synchronization**: Persists `?page=2&pageSize=20`. Refreshing or sharing the URL preserves exact pagination state.
- [x] **URL Parameter Normalization**: Malformed values (`?page=abc`, `?page=-5`, `?pageSize=999`) safely fall back to defaults (`page=1`, `pageSize=20`).

### 4. Search with Debounce & Race Condition Mitigation
- [x] **Debounced Search**: 400ms debounce ensures API calls are not triggered on every keystroke.
- [x] **Search Resets Page**: Automatically resets to `page=1` whenever search term changes.
- [x] **Race Condition Mitigation**: Uses `AbortController` to cancel in-flight queries when new searches occur, combined with an incrementing `requestId` sequence check so older delayed responses never overwrite newer results.

### 5. Category Filtering & Sorting
- [x] **Dynamic Categories**: Populates category dropdown from `/products/categories`.
- [x] **Category URL State**: Synced with `?category=smartphones`.
- [x] **Sorting**: Supports Price (Low-High / High-Low), Rating (High-Low / Low-High), and Title (A-Z / Z-A). Synced with `?sort=price&order=asc`.
- [x] **Search + Category Combination**: Fully defined fallback behavior (see Architectural Decisions).

### 6. Product Details & Error Handling
- [x] **Product Details View (`/products/[id]`)**: Interactive thumbnail switcher, discount badges, ratings, specifications, availability status, and reviews list.
- [x] **Product Not Found (`/products/999999`)**: Clear custom 404 screen with explanation and "Back to Products" button.

### 7. Product CRUD with Local Mutation Simulation
- [x] **Add Product (`/products/new`)**: Form validation (required title >= 3 chars, positive numeric price, non-negative integer stock, required category), duplicate submission prevention, and instant local reflection.
- [x] **Edit Product (`/products/[id]/edit`)**: Pre-populated form from ID, validation, duplicate save protection, and instant update in catalog and detail views.
- [x] **Delete Product**: Accessible confirmation modal with product title, duplicate click guard, and removal from UI state.
- [x] **Simulated Mutation Layer**: Layers local creations, edits, and deletions on top of DummyJSON API queries throughout the session.

### 8. Feedback & State Design
- [x] **Loading States**: Shimmer skeleton loaders matching exact table and card geometries.
- [x] **Empty States**: Informative icon, clear messaging, and a "Reset all filters" button.
- [x] **Error States**: Banner with human-readable error description and a functional "Retry" button.
- [x] **Global Toast System**: Floating alerts for CRUD actions, errors, and session events.

---

## 🏛️ Architecture & Directory Structure

```text
src/
├── api/
│   ├── auth.ts                   # Login and session endpoints
│   ├── categories.ts             # Category listing endpoint
│   └── products.ts               # Product CRUD, search, pagination with AbortSignal
├── app/
│   ├── layout.tsx                # App root layout with Providers (Auth, Toast, Products)
│   ├── page.tsx                  # Root redirect (authenticated -> /products, guest -> /login)
│   ├── not-found.tsx             # Global 404 page
│   ├── login/
│   │   └── page.tsx              # Authenticated login with demo credentials helper
│   └── products/
│       ├── page.tsx              # Main dashboard (Table, Cards, Search, Filters, Pagination)
│       ├── new/
│       │   └── page.tsx          # Create product form
│       └── [id]/
│           ├── page.tsx          # Product details, image gallery, reviews, 404 handler
│           └── edit/
│               └── page.tsx      # Edit product form
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx    # Route guard redirecting unauthenticated users
│   ├── common/
│   │   ├── EmptyState.tsx        # Zero results empty state
│   │   ├── ErrorState.tsx        # API error state with retry button
│   │   └── LoadingSkeleton.tsx   # Table and card skeleton loaders
│   ├── filters/
│   │   ├── CategoryFilter.tsx    # Category select dropdown
│   │   ├── SearchBar.tsx         # Debounced search input with clear button
│   │   └── SortControl.tsx       # Sorting dropdown (Price, Rating, Title)
│   ├── layout/
│   │   └── AppShell.tsx          # Top navigation, user profile, logout, mobile menu
│   ├── pagination/
│   │   └── Pagination.tsx        # Range indicator, page buttons, per-page selector
│   └── products/
│       ├── DeleteConfirmModal.tsx# Deletion confirmation popup
│       ├── ProductCard.tsx       # Mobile product card
│       ├── ProductCardList.tsx   # Mobile card grid container
│       ├── ProductForm.tsx       # Reusable validated form for Add and Edit
│       ├── ProductRow.tsx        # Desktop table row
│       └── ProductTable.tsx      # Desktop table with sortable column headers
├── context/
│   ├── AuthContext.tsx           # Session management, login/logout, localStorage persistence
│   ├── ProductsContext.tsx       # Simulated mutation store (created, updated, deleted items)
│   └── ToastContext.tsx          # Toast notification queue
├── hooks/
│   ├── useDebounce.ts            # Value debouncing hook
│   └── useProducts.ts            # Fetching hook with AbortController race condition prevention
├── lib/
│   ├── axios.ts                  # Shared Axios client with request/response interceptors
│   └── validation.ts             # Form validation logic
├── types/
│   ├── auth.ts                   # Auth credentials, response, and user types
│   └── product.ts                # Product, Category, Pagination, and Form types
└── utils/
    └── urlParams.ts              # URL parameter parsing, sanitization, and serialization
```

---

## 💡 Important Architectural Decisions

### 1. Handling DummyJSON's Search + Category Limitation
DummyJSON cannot filter by category and search simultaneously (`/products/search?q=...` ignores category, and `/products/category/:category` does not accept search terms).
**Implementation Choice**:
- When **only search** exists: Query `/products/search?q=...`.
- When **only category** exists: Query `/products/category/:category`.
- When **both exist**: Query `/products/search?q=...` with a higher limit and filter the results by category **client-side**.
- The UI explicitly renders an informative badge (`Filtered by category "smartphones" within search results for "phone"`) so the user is aware of how the combined filter is resolved.

### 2. Simulated CRUD Mutations
DummyJSON does not persist `POST`, `PUT`, or `DELETE` mutations permanently on its backend database.
**Implementation Choice**:
- The frontend dispatches real API calls to DummyJSON (`POST /products/add`, `PUT /products/:id`, `DELETE /products/:id`).
- Upon success, the result is captured in `ProductsContext` (`localCreatedProducts`, `localUpdatedProducts`, `localDeletedIds`), which is synchronized across the session.
- When querying catalog pages or opening `/products/:id`, the API results are merged with the local mutation layer, allowing newly added products, edited fields, and deleted items to reflect immediately without needing a persistent backend.

### 3. Search Race Condition Prevention
When users type rapidly or slow responses occur:
**Implementation Choice**:
- Every keystroke is debounced by `400ms`.
- When a new request is initiated, the previous request's `AbortController.abort()` is called to cancel in-flight HTTP requests.
- An incrementing `requestIdRef` tracks each request's sequence. If an older request resolves after a newer request, it is discarded, guaranteeing stale results never overwrite newer queries.

### 4. URL As the Single Source of Truth
Dashboard state (`page`, `pageSize`, `search`, `category`, `sort`, `order`) lives in URL search parameters.
- Page refreshes and bookmark sharing preserve exact view state.
- Parameters are normalized defensively: non-numeric pages (`?page=abc`) default to `1`, non-standard page sizes (`?pageSize=7`) default to `20`.

### 5. Centralized Axios Interceptors
- **Request Interceptor**: Reads the token from `localStorage` and automatically sets `Authorization: Bearer <token>`.
- **Response Interceptor**: Normalizes error messages (extracting `error.response.data.message` or network errors into clear strings) and redirects `401 Unauthorized` requests to `/login`.

---

## ⚠️ Known Limitations (DummyJSON)
1. **Mutation Persistence**: DummyJSON returns mock `200/201` responses for mutations but does not persist them to a real database. (Handled via local mutation store).
2. **Server-Side Combined Search & Category**: DummyJSON does not offer a combined `search + category` endpoint. (Handled via search API + client-side category filtering).

---

## 🤖 AI Usage & Reflection

- **Architecture Guidance**: AI was utilized to draft initial component modularization and verify Next.js App Router conventions.
- **Race Condition Solution**: AI helped structure the combination of `AbortController` cancellation and sequence IDs (`requestIdRef`) for robust race-condition immunity.
- **Problem Solved**: Next.js 15 static prerendering bails out if `useSearchParams()` is accessed outside a `<Suspense>` boundary in route guards. Replaced direct hook access in `ProtectedRoute` with client-side `window.location.search` extraction, ensuring zero prerendering errors during `next build`.

---

## 🎯 Interview Walkthrough Guide & Live Coding Reference

If asked to make changes during an interview walkthrough, here is where each responsibility is located:

| Requested Change | Target File | What to Modify |
| ---------------- | ----------- | -------------- |
| **Add a new page size** (e.g. 100) | [`src/utils/urlParams.ts`](file:///c:/Users/Lenovo/Desktop/adminPanel/src/utils/urlParams.ts) | Add `100` to `ALLOWED_PAGE_SIZES` array. |
| **Add a new sort option** (e.g. Stock) | [`src/types/product.ts`](file:///c:/Users/Lenovo/Desktop/adminPanel/src/types/product.ts) & [`src/components/filters/SortControl.tsx`](file:///c:/Users/Lenovo/Desktop/adminPanel/src/components/filters/SortControl.tsx) | Add `'stock'` to `SortField` type and add options in `SortControl.tsx`. |
| **Add a new form field** | [`src/components/products/ProductForm.tsx`](file:///c:/Users/Lenovo/Desktop/adminPanel/src/components/products/ProductForm.tsx) & [`src/lib/validation.ts`](file:///c:/Users/Lenovo/Desktop/adminPanel/src/lib/validation.ts) | Add input in `ProductForm.tsx` and validation rule in `validation.ts`. |
| **Adjust search debounce timing** | [`src/components/filters/SearchBar.tsx`](file:///c:/Users/Lenovo/Desktop/adminPanel/src/components/filters/SearchBar.tsx) | Change `400` in `useDebounce(inputValue, 400)`. |
| **Change table columns / card layout** | [`src/components/products/ProductRow.tsx`](file:///c:/Users/Lenovo/Desktop/adminPanel/src/components/products/ProductRow.tsx) or [`ProductCard.tsx`](file:///c:/Users/Lenovo/Desktop/adminPanel/src/components/products/ProductCard.tsx) | Modify JSX columns or card elements. |
| **Add confirmation dialog to another action** | [`src/components/products/DeleteConfirmModal.tsx`](file:///c:/Users/Lenovo/Desktop/adminPanel/src/components/products/DeleteConfirmModal.tsx) | Reusable modal pattern. |
| **Change base API URL or headers** | [`src/lib/axios.ts`](file:///c:/Users/Lenovo/Desktop/adminPanel/src/lib/axios.ts) | Modify interceptors or Axios config. |
