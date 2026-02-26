<div align="center">

# 🍕 Eatzy Frontend

### Food Delivery Platform — Multi-App React Ecosystem

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.x-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)

**4 independent Single Page Applications in a mono-repo architecture — powering the complete food delivery experience for customers, drivers, restaurants, and administrators.**

[Apps](#-applications) · [Features](#-features) · [Tech Stack](#-tech-stack) · [Quick Start](#-quick-start) · [Architecture](#-architecture) · [Deployment](#-deployment)

---

| App | Live URL | Description |
|:---|:---|:---|
| 🛒 **Customer** | [`customer-eatzy.hoanduong.net`](https://customer-eatzy.hoanduong.net) | Browse, order & track food |
| 🚗 **Driver** | [`driver-eatzy.hoanduong.net`](https://driver-eatzy.hoanduong.net) | Accept & deliver orders |
| 🍳 **Restaurant** | [`restaurant-eatzy.hoanduong.net`](https://restaurant-eatzy.hoanduong.net) | Manage menu & orders |
| 👨‍💼 **Admin** | [`admin-eatzy.hoanduong.net`](https://admin-eatzy.hoanduong.net) | Platform management |

</div>

---

## 📖 Overview

**Eatzy Frontend** is a mono-repo containing **4 independent React SPAs** built with **Vite** and orchestrated by **Turborepo** for parallel development. Each app has its own entry point, Vite config, and routing — sharing a common design system, API layer, and utility modules.

The frontend connects to a Spring Boot backend via REST APIs and **STOMP WebSocket** for real-time features like live order tracking, driver location, and in-app chat.

---

## 📱 Applications

<table>
<tr>
<td width="50%">

### 🛒 Customer App
The consumer-facing application for browsing and ordering food.

**Pages:**
- 🏠 **Home** — Browse nearby restaurants, search food
- 🍕 **Restaurant Detail** — View menu, add items to cart
- 🛒 **Checkout** — Cart review, payment selection (Wallet / COD / VNPay)
- 📦 **Current Order** — Real-time order tracking with driver location on map
- 📋 **Order History** — Past orders with re-order capability
- ❤️ **Favorites** — Saved restaurants
- 👤 **Profile** — Account management
- 🔐 **Login / Register** — Auth with email verification

</td>
<td width="50%">

### 🚗 Driver App
The delivery partner application for managing deliveries.

**Pages:**
- 🏠 **Home** — Available orders, active delivery with map navigation
- 📋 **History** — Completed deliveries & earnings
- 💰 **Wallet** — Earnings, deposits, withdrawals, transaction history
- 👤 **Profile** — Driver info, vehicle details, availability toggle
- 🔐 **Login / Register** — Driver onboarding

</td>
</tr>
<tr>
<td>

### 🍳 Restaurant App
The merchant portal for managing stores and orders.

**Pages:**
- 📦 **Orders** — Incoming orders, accept/reject, status management
- 🍽️ **Menu** — Dish management, categories, options & option groups
- 🏪 **Store** — Restaurant info, open/close toggle, images
- 📊 **Reports** — Revenue analytics, order stats, review analysis
  - Revenue overview (chart + table)
  - Menu performance
  - Order trends
  - Review distribution
- ⭐ **Reviews** — Customer feedback & response
- 💰 **Wallet** — Restaurant earnings & transaction history
- 📜 **History** — Past orders archive
- 🔐 **Login / Register** — Merchant onboarding

</td>
<td>

### 👨‍💼 Admin Dashboard
The platform management dashboard.

**Pages:**
- 📊 **Dashboard** — KPIs, order stats, revenue overview with charts
- 🍳 **Restaurants** — Restaurant management (approve, lock, filter)
- 🚗 **Drivers** — Driver management (verify, lock, filter)
- 👥 **Customers** — User management (lock, filter)
- 💰 **Finance** — Platform revenue, commission tracking
- 🎫 **Promotions** — Voucher & promotion management
- 🔒 **Permissions** — Role & permission configuration (RBAC)
- ⚙️ **System Config** — Platform settings (radius, fees, etc.)
- 🔐 **Login** — Admin authentication

</td>
</tr>
</table>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📡 Real-Time Features
- **Live Order Tracking** — WebSocket-powered status updates
- **Driver Location** — Real-time driver position on interactive map
- **In-App Chat** — Customer ↔ Driver chat per order
- **Typing Indicators** — Real-time typing status
- **Toast Notifications** — Instant feedback on all actions

</td>
<td width="50%">

### 🗺️ Maps & Navigation
- **Interactive Maps** — Mapbox GL JS with React bindings
- **Restaurant Locations** — Browse restaurants on map
- **Delivery Routes** — Driver route visualization
- **Geolocation** — Auto-detect user location
- **Real-Time Driver Tracking** — Live marker updates

</td>
</tr>
<tr>
<td>

### 📊 Data Visualization
- **Revenue Charts** — Interactive charts with Recharts
- **Order Analytics** — Trend analysis and comparisons
- **Review Distribution** — Rating breakdown visualization
- **Menu Performance** — Best-selling dish analytics
- **Financial Reports** — Commission & earnings overview

</td>
<td>

### 🎨 UI / UX
- **Responsive Design** — Mobile-first, works on all devices
- **Modern CSS** — CSS Modules with custom properties
- **Icon Library** — Lucide React for consistent iconography
- **Filter & Search** — Advanced filtering with modal components
- **Pagination** — Server-side pagination with smooth navigation

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

| Category | Technology |
|:---|:---|
| **Framework** | React 18.3 with JSX |
| **Build Tool** | Vite 5.2 (with SWC for fast compilation) |
| **Orchestration** | Turborepo — parallel dev server for all 4 apps |
| **Package Manager** | pnpm 10.x |
| **Routing** | React Router v7 — client-side routing with protected routes |
| **HTTP Client** | Axios — interceptors for JWT auth & auto token refresh |
| **WebSocket** | @stomp/stompjs + sockjs-client — real-time communication |
| **Maps** | Mapbox GL JS + react-map-gl — interactive map components |
| **Charts** | Recharts — data visualization & analytics |
| **Icons** | Lucide React — modern icon library |
| **Notifications** | React Toastify — toast notifications |
| **State Management** | React Context API — auth, cart, global state |
| **Styling** | Vanilla CSS with CSS Modules |
| **Linting** | ESLint with React plugins |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v20.x+
- **pnpm** v10.x+ (`npm install -g pnpm`)

### 1. Clone & Install

```bash
git clone https://github.com/hieuduong1810/eatzy_frontend_react.git
cd eatzy_frontend_react
pnpm install
```

### 2. Configure Environment

Create a `.env` file:

```env
VITE_BACKEND_URL=http://localhost:8080
```

### 3. Run All Apps (Turborepo)

```bash
pnpm dev
```

This starts all 4 apps simultaneously via Turborepo:

| App | URL | Vite Config |
|:---|:---|:---|
| Customer | `http://localhost:3001` | `vite.customer.config.js` |
| Driver | `http://localhost:3002` | `vite.driver.config.js` |
| Restaurant | `http://localhost:3003` | `vite.restaurant.config.js` |
| Admin | `http://localhost:3004` | `vite.admin.config.js` |

### Run Individual App

```bash
pnpm dev:customer      # Customer app only
pnpm dev:driver        # Driver app only
pnpm dev:restaurant    # Restaurant app only
pnpm dev:admin         # Admin app only
```

---

## 🏗️ Architecture

### Mono-Repo Structure

```
eatzy_frontend_react/
├── src/
│   ├── api/                          # 🔌 Shared API Layer
│   │   ├── axios.js                  #    Axios instance + JWT interceptors
│   │   ├── authApi.js                #    Auth endpoints (login, register, refresh)
│   │   ├── admin/                    #    Admin-specific API modules (10 files)
│   │   ├── customer/                 #    Customer-specific APIs
│   │   ├── driver/                   #    Driver-specific APIs
│   │   └── restaurant/               #    Restaurant-specific APIs
│   │
│   ├── apps/                         # 📱 Application Modules
│   │   ├── customer/                 #    🛒 Customer App
│   │   │   ├── CustomerApp.jsx       #       App shell + routing
│   │   │   ├── pages/               #       12 page components
│   │   │   ├── components/          #       12 reusable components
│   │   │   ├── context/             #       Cart context
│   │   │   └── data/                #       Static data & constants
│   │   │
│   │   ├── driver/                   #    🚗 Driver App
│   │   │   ├── DriverApp.jsx         #       App shell + routing
│   │   │   ├── pages/               #       6 page components
│   │   │   └── components/          #       7 reusable components
│   │   │
│   │   ├── restaurant/               #    🍳 Restaurant App
│   │   │   ├── RestaurantApp.jsx     #       App shell + routing
│   │   │   ├── pages/               #       22 page components (incl. reports)
│   │   │   └── components/          #       7 reusable components
│   │   │
│   │   └── admin/                    #    👨‍💼 Admin Dashboard
│   │       ├── AdminApp.jsx          #       App shell + routing
│   │       ├── pages/               #       13 page components
│   │       └── components/          #       33 reusable components
│   │
│   ├── components/                   # 🧩 Shared Components
│   │   └── shared/                   #    PageHeader, common UI elements
│   │
│   ├── contexts/                     # 🌐 Global Contexts
│   │   └── AuthContext               #    Authentication state
│   │
│   ├── layouts/                      # 📐 Layout Components
│   │   ├── CustomerLayout.jsx        #    Customer app shell
│   │   ├── DriverLayout.jsx          #    Driver app shell
│   │   ├── RestaurantLayout.jsx      #    Restaurant sidebar layout
│   │   └── AdminLayout.jsx           #    Admin sidebar layout
│   │
│   ├── stores/                       # 📦 State Stores
│   ├── utils/                        # 🔧 Utility Functions
│   │
│   ├── main-customer.jsx             # Entry: Customer
│   ├── main-driver.jsx               # Entry: Driver
│   ├── main-restaurant.jsx           # Entry: Restaurant
│   ├── main-admin.jsx                # Entry: Admin
│   └── index.css                     # Global styles & design tokens
│
├── customer.html                     # HTML entry: Customer
├── driver.html                       # HTML entry: Driver
├── restaurant.html                   # HTML entry: Restaurant
├── admin.html                        # HTML entry: Admin
│
├── vite.customer.config.js           # Vite config: Customer
├── vite.driver.config.js             # Vite config: Driver
├── vite.restaurant.config.js         # Vite config: Restaurant
├── vite.admin.config.js              # Vite config: Admin
│
├── turbo.json                        # Turborepo task config
├── package.json                      # Dependencies & scripts
└── pnpm-lock.yaml                    # Lockfile
```

### Multi-App Build Architecture

```
┌────────────────────────────────────────────────────────────┐
│                      TURBOREPO                             │
│              Parallel Task Orchestration                    │
├──────────────┬──────────────┬──────────┬──────────────────┤
│              │              │          │                    │
│  customer    │  driver      │ restaurant│  admin            │
│  .html       │  .html       │  .html   │  .html            │
│     ↓        │     ↓        │     ↓    │     ↓             │
│  main-       │  main-       │  main-    │  main-            │
│  customer    │  driver      │ restaurant│  admin            │
│  .jsx        │  .jsx        │  .jsx    │  .jsx             │
│     ↓        │     ↓        │     ↓    │     ↓             │
│  vite.       │  vite.       │  vite.    │  vite.            │
│  customer    │  driver      │ restaurant│  admin            │
│  .config.js  │  .config.js  │  .config │  .config.js       │
│              │              │          │                    │
│  :3001       │  :3002       │  :3003   │  :3004            │
└──────────────┴──────────────┴──────────┴──────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Shared Modules   │
                    │  api/ · contexts/ │
                    │  layouts/ · utils/│
                    │  components/      │
                    └───────────────────┘
```

---

## 🔐 Authentication Flow

```
Login → JWT Access Token + Refresh Token (stored in memory)
                    │
        ┌───────────▼────────────┐
        │   Axios Interceptors   │
        │                        │
        │  Request: Attach token │
        │  Response: Auto-refresh│
        │  on 401 → retry        │
        └────────────────────────┘
```

- **Access Token** — Attached to every API request via Axios interceptor
- **Refresh Token** — Automatically refreshes expired access tokens
- **Protected Routes** — React Router guards redirect unauthenticated users
- **Role-Based Navigation** — Different sidebar/menu items per user role

---

## 🚢 Deployment

### CI/CD Pipeline (Planned)

Each app will be deployed independently to its own subdomain via GitHub Actions:

```
Push to main → Build all 4 apps → Deploy to VPS → Nginx serves subdomains
```

| App | Domain | Build Output |
|:---|:---|:---|
| Customer | `customer-eatzy.hoanduong.net` | `dist/customer/` |
| Driver | `driver-eatzy.hoanduong.net` | `dist/driver/` |
| Restaurant | `restaurant-eatzy.hoanduong.net` | `dist/restaurant/` |
| Admin | `admin-eatzy.hoanduong.net` | `dist/admin/` |

### Production Build

```bash
# Build all apps
pnpm build

# Preview production build
pnpm preview
```

### Nginx Configuration (Example)

```nginx
# Customer App
server {
    server_name customer-eatzy.hoanduong.net;
    root /var/www/eatzy/customer;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Driver App
server {
    server_name driver-eatzy.hoanduong.net;
    root /var/www/eatzy/driver;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Restaurant App
server {
    server_name restaurant-eatzy.hoanduong.net;
    root /var/www/eatzy/restaurant;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Admin App
server {
    server_name admin-eatzy.hoanduong.net;
    root /var/www/eatzy/admin;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 📊 Component Summary

| App | Pages | Components | CSS Files |
|:---|:---:|:---:|:---:|
| 🛒 Customer | 12 | 12 | 6 |
| 🚗 Driver | 6 | 7 | 1 |
| 🍳 Restaurant | 22 | 7 | 12 |
| 👨‍💼 Admin | 13 | 33 | 4 |
| **Total** | **53** | **59** | **23** |

---

## 📄 License

⚠️ **Educational Purpose** — This project is built for learning and portfolio demonstration.

---

<div align="center">

**Built with ❤️ by Hieu Duong**

[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/)
[![Mapbox](https://img.shields.io/badge/Mapbox-000000?style=flat&logo=mapbox&logoColor=white)](https://www.mapbox.com/)

</div>
