# Restaurant Dashboard — Frontend

A modern restaurant management dashboard built to provide restaurant staff with a centralized interface for managing and monitoring daily operations.

The frontend provides a responsive dashboard interface and communicates with a dedicated backend API for application data and management operations.

## ✨ Features

* 📊 Restaurant management dashboard
* 📦 Manage restaurant data
* 🍔 Manage menu items
* 📝 Create, update, and delete resources
* 📋 View and manage orders
* 👤 User authentication
* 📈 Dashboard statistics
* 🔍 Search and filtering
* 📱 Responsive dashboard interface
* 🔔 User feedback and notifications
* 🧩 Reusable UI components

## 🛠️ Tech Stack

* **React** — UI development
* **TypeScript** — Type-safe development
* **Tailwind CSS** — Responsive styling
* **Lucide React** — Interface icons

## 🏗️ Architecture

The frontend is responsible for the dashboard interface, client-side state, user interactions, and communication with the backend API.

```text id="9t0hyk"
Restaurant-Dashboard/
├── src/
│   ├── components/
│   ├── pages/
│   ├── ...
│   └── ...
├── public/
├── package.json
└── ...
```

## 🔌 Backend Integration

The dashboard communicates with a separate backend server through REST API endpoints.

**Backend Repository:**

https://github.com/wasem7112011/Restaurant-Dashboard-Backend

The backend handles data persistence, authentication, and business logic.

## ⚙️ Getting Started

### Prerequisites

* Node.js 18+
* npm

### Installation

Clone the repository:

```bash id="r1t9fz"
git clone https://github.com/wasem7112011/Restaurant-Dashboard.git
```

Navigate to the project:

```bash id="5y6p0u"
cd Restaurant-Dashboard
```

Install dependencies:

```bash id="e9w8cm"
npm install
```

### Environment Variables

Create the required environment file based on the project's configuration.

Example:

```env id="0o7h4f"
VITE_API_URL=http://localhost:5000
```

Use the exact variable names required by the project.

### Run the Development Server

```bash id="4kq5se"
npm run dev
```

The application will be available at the local development URL shown by the terminal.

## 📱 Responsive Design

The dashboard is designed to adapt to different screen sizes, providing a usable experience across desktop, tablet, and mobile layouts.

## 📌 Technical Highlights

* Component-based React architecture
* TypeScript for type safety
* Responsive dashboard UI
* REST API integration
* Reusable interface components
* Separate frontend and backend architecture

## 🔗 Related Repository

**Backend:**
https://github.com/wasem7112011/Restaurant-Dashboard-Backend
