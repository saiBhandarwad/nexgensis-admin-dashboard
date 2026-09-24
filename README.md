# NexGensis Admin Dashboard

A responsive **Product Admin Dashboard** built with React and Vite. The application provides authentication, product management, search, filtering, sorting, pagination, and responsive layouts using the DummyJSON API.

## Live Demo

> Add your Vercel/Netlify URL here after deployment.

## GitHub Repository

> Add repository URL here if required.

---

## Features

### Authentication

* Login using DummyJSON authentication API
* Protected product dashboard
* Logout functionality
* Access token stored locally
* Axios request interceptor automatically attaches the token
* Centralized handling of `401 Unauthorized` responses
* Prevents duplicate login requests while login is in progress

### Product Management

* View products in a responsive dashboard
* Product image, title, category, price, rating and stock
* Add new products
* Edit existing products
* Delete products with confirmation
* Client-side form validation
* Loading states during mutations
* Local UI updates after successful mutations

> **Note:** DummyJSON product mutations are simulated and are not permanently persisted on the server. Therefore, the application updates the local UI state after successful add/edit/delete operations.

### Search

* Product search using DummyJSON search API
* Debounced search input
* Automatically returns to page 1 when search changes
* Previous API request is cancelled when a newer request starts
* Prevents stale search results from overwriting newer results

### Filtering

* Filter products by category
* Categories loaded dynamically from the API
* Category state stored in URL parameters

### Sorting

* Price: Low to High
* Price: High to Low
* Rating: High to Low
* Title: A to Z

### Pagination

* Page sizes:

  * 10
  * 20
  * 50
* Previous / Next navigation
* Current result range displayed
* Invalid page and limit values are handled safely
* Automatically corrects pages that exceed the available number of pages

### URL State

Product dashboard state is stored in URL query parameters.

Example:

```text
/products?search=phone&category=smartphones&sort=price-desc&page=2&limit=20
```

This allows users to:

* Refresh without losing their current state
* Share a filtered/sorted product view
* Navigate using browser history

### Responsive Design

* Desktop table-style product layout
* Mobile card-style layout
* Responsive sidebar/navigation
* Responsive product actions and filters

### Error & Loading Handling

* Loading state
* Empty state
* API error state
* Retry functionality
* Request cancellation handling

---

## Tech Stack

### Frontend

* React
* Vite
* JavaScript (ES6+)
* Tailwind CSS
* React Router
* Axios

### API

* DummyJSON

### Development Tools

* Git
* GitHub
* VS Code
* Vercel / Netlify for deployment

---

## Project Structure

The project is being organized into small, reusable modules:

```text
src/
│
├── api/
│   └── axios.js
│
├── components/
│   ├── auth/
│   │   └── ...
│   │
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Modal.jsx
│   │   ├── Loader.jsx
│   │   ├── EmptyState.jsx
│   │   └── ErrorState.jsx
│   │
│   └── products/
│       ├── ProductForm.jsx
│       ├── ProductRow.jsx
│       ├── ProductFilters.jsx
│       ├── ProductList.jsx
│       ├── ConfirmDialog.jsx
│       └── Pagination.jsx
│
├── hooks/
│   ├── useDebounce.js
│   └── ...
│
├── layouts/
│   └── DashboardLayout.jsx
│
├── pages/
│   ├── Login.jsx
│   ├── Products.jsx
│   ├── ProductDetails.jsx
│   └── NotFound.jsx
│
├── services/
│   ├── authService.js
│   └── productService.js
│
├── utils/
│   ├── urlParams.js
│   ├── validation.js
│   └── ...
│
├── App.jsx
├── main.jsx
└── index.css
```

The current implementation is being progressively refactored into this structure to keep UI components, API logic, reusable utilities and page-level logic separated.

---

## API Architecture

All API requests go through a shared Axios instance.

```text
React Component
       ↓
Service Layer
       ↓
Axios Instance
       ↓
Request Interceptor
       ↓
DummyJSON API
       ↓
Response Interceptor
       ↓
Component
```

The service layer keeps API calls outside the UI components.

Example:

```js
const data = await getProducts({
    limit,
    skip,
});
```

instead of directly calling Axios inside the component.

---

## Authentication Flow

```text
Login Form
    ↓
authService
    ↓
POST /auth/login
    ↓
Access Token
    ↓
localStorage
    ↓
Protected Route
    ↓
Products Dashboard
```

For subsequent requests:

```text
API Request
    ↓
Axios Request Interceptor
    ↓
Authorization: Bearer <token>
    ↓
API
```

If the API returns `401`:

```text
401 Response
    ↓
Axios Response Interceptor
    ↓
Remove Token
    ↓
Redirect to Login
```

---

## Search Request Flow

The search input uses debouncing to avoid sending a request for every keystroke.

```text
User types
    ↓
Search Input
    ↓
500ms debounce
    ↓
URL updated
    ↓
API request
```

When another search starts before the previous request finishes:

```text
Old Request
    ↓
AbortController
    ↓
Cancelled

New Request
    ↓
Latest Search Results
```

This prevents older responses from replacing newer search results.

---

## URL Query Parameters

The dashboard uses URL parameters as the source of truth for table state.

| Parameter  | Example       | Purpose           |
| ---------- | ------------- | ----------------- |
| `page`     | `2`           | Current page      |
| `limit`    | `20`          | Products per page |
| `search`   | `phone`       | Search query      |
| `category` | `smartphones` | Category filter   |
| `sort`     | `price-desc`  | Sorting           |

Example:

```text
/products?page=2&limit=20&search=phone&category=smartphones&sort=price-desc
```

---

## Important Implementation Decisions

### Why Axios Interceptors?

Instead of manually adding the token to every request, the request interceptor automatically adds:

```text
Authorization: Bearer <accessToken>
```

This keeps authentication logic centralized.

### Why Debounce Search?

Without debounce:

```text
p
ph
pho
phon
phone
```

could generate five API requests.

With debounce, the application waits until the user stops typing before making the request.

### Why AbortController?

If a previous search request is still running when a new search begins, the previous request is cancelled.

This prevents stale API responses from updating the UI.

### Why URL Parameters?

URL parameters make dashboard state:

* Refresh-safe
* Shareable
* Browser-history friendly

---

## Handling DummyJSON Limitations

DummyJSON is used as a demonstration API rather than a production database.

Product mutations such as:

```text
POST
PUT
DELETE
```

are simulated.

Therefore, after a successful mutation, the application updates its local React state so the change is immediately visible to the user.

The behavior and limitation are documented rather than pretending that the server permanently stores the changes.

---

## Future Updates

The following improvements can be added in future versions:

### Product Management

* Complete Product Details page
* Product image gallery
* Product reviews
* Better Add/Edit product modal
* Advanced product validation
* Optimistic UI updates
* Better mutation error recovery

### Search & Filtering

* Combined search + category filtering
* Multiple filters
* Clear-all-filters functionality
* Advanced sorting options

### UI/UX

* Reusable modal system
* Toast notifications
* Skeleton loaders
* Improved empty/error states
* Accessibility improvements
* Dark mode

### Architecture

* Complete component separation
* Custom reusable hooks
* Centralized URL parameter utilities
* Centralized validation utilities
* Better separation between page and business logic

### Backend & Production Improvements

For a real production application, DummyJSON could be replaced with a custom backend providing:

* Node.js
* Express
* MongoDB/PostgreSQL
* JWT authentication
* Role-based access control
* Server-side pagination
* Server-side filtering and sorting
* Redis caching
* Rate limiting
* Centralized logging
* API validation
* Docker
* CI/CD
* AWS deployment

### Testing

* Unit testing
* Component testing
* API/service testing
* End-to-end testing

Potential tools:

```text
Vitest
React Testing Library
Playwright
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/saiBhandarwad/nexgensis-admin-dashboard.git
```

Go to the project:

```bash
cd nexgensis-admin-dashboard
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Create production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Demo Credentials

The application uses DummyJSON authentication.

```text
Username: emilys
Password: emilyspass
```

---

## Environment Variables

Currently, the DummyJSON base URL is configured directly in the Axios setup.

For a production application, this can be moved to an environment variable:

```text
VITE_API_BASE_URL=
```

Example:

```js
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});
```

---

## Challenges & Solutions

### Challenge 1 — Duplicate Login Requests

**Problem:** Users could repeatedly click Login while the request was running.

**Solution:** Disable the button and guard the submit handler while `loading` is true.

---

### Challenge 2 — Stale Search Results

**Problem:** An older API request could finish after a newer search request.

**Solution:** Used `AbortController` to cancel the previous request.

---

### Challenge 3 — Invalid URL Parameters

**Problem:**

```text
?page=abc
?page=999
?limit=999
```

could cause invalid pagination behavior.

**Solution:** Validate URL values and fall back to safe defaults. Pages exceeding the available range are corrected.

---

### Challenge 4 — Responsive Product Layout

**Problem:** A desktop table structure does not work well on small screens.

**Solution:** Use a table-style grid on desktop and card-style layout on mobile.

---

### Challenge 5 — DummyJSON Mutations

**Problem:** Add/Edit/Delete responses are simulated and aren't permanently persisted.

**Solution:** Update the local React state after successful mutation and document the API limitation.

---

## AI Usage

AI tools were used as a development assistant during the project.

AI assistance was used for:

* Understanding API behavior
* Discussing React architecture
* Debugging implementation issues
* Reviewing code
* Exploring edge cases
* Improving component structure
* Understanding concepts such as debouncing, request cancellation and Axios interceptors

All generated code was reviewed, tested and adapted to the project's requirements.

The developer remains responsible for understanding and explaining the implementation.

---

## Development Approach

The project is being developed incrementally:

```text
Authentication
      ↓
Product Listing
      ↓
Pagination
      ↓
Search + Debounce
      ↓
Category Filter
      ↓
Sorting
      ↓
CRUD Operations
      ↓
Product Details
      ↓
Reusable Components
      ↓
Error / Empty / Loading States
      ↓
Testing
      ↓
Deployment
```

The codebase will continue to be refactored into smaller reusable components as functionality is completed.

---

## License

This project was created as a frontend development assignment and learning project.
