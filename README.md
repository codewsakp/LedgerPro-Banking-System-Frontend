# LedgerPro — Banking Application Frontend

LedgerPro is a modern, responsive banking application frontend built using React. It provides an interface for customers to access their banking information, perform transactions, and view their account activity.

The frontend communicates with a Spring Boot REST API backend and uses JWT authentication for protected operations.

## Tech Stack

- **Library:** React 18
- **Build Tool:** Vite 6
- **Language:** JavaScript
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Charts:** Recharts
- **Styling:** CSS
- **Version Control:** Git and GitHub

## Features

### Authentication
- User registration.
- User login.
- JWT-based authentication.
- Protected application routes.
- Logout functionality.

### Banking Dashboard
- Account overview.
- Current account balance.
- Account information.
- Banking summary cards.
- Recent transaction activity.
- Financial charts and visualizations.

### Banking Operations
- Deposit money.
- Withdraw money.
- Transfer funds between accounts.
- View transaction history.

### Bank Statements
- Select a statement date range.
- Request bank statement generation.
- Receive the generated PDF through email.

### User Experience
- Responsive dashboard layout.
- Sidebar navigation.
- Summary cards and transaction tables.
- Interactive charts.
- Form validation and error notifications.

## Project Structure

```text
src/
├── components/
│   ├── AppLayout.jsx
│   ├── ProtectedRoute.jsx
│   ├── Sidebar.jsx
│   ├── StatCard.jsx
│   ├── TransactionTable.jsx
│   └── Notice.jsx
│
├── context/
│   └── AuthContext.jsx
│
├── pages/
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Transactions.jsx
│   ├── Statements.jsx
│   ├── Analytics.jsx
│   ├── Budgets.jsx
│   └── Profile.jsx
│
├── services/
│   ├── api.js
│   ├── bankingService.js
│   ├── authService.js
│   └── ...
│
├── App.jsx
└── main.jsx
```

## Prerequisites

- Node.js (LTS recommended).
- npm.
- Git.
- LedgerPro Spring Boot backend running locally.

## Installation

Clone the frontend repository:

```bash
git clone https://github.com/codewsakp/LedgerPro-Banking-System-Frontend.git
cd ledgerpro-frontend
```

Install dependencies:

```bash
npm install
```

## Environment Configuration

Create a `.env` file in the frontend project root if you want to configure the backend URL explicitly:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

The Axios configuration uses this variable to connect to the Spring Boot backend. If it is not set, the application uses its configured default API base URL.

Do not commit environment files containing private credentials.

## Run the Application

Start the Vite development server:

```bash
npm run dev
```

The frontend is generally available at:

```text
http://localhost:5173
```

## Production Build

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Backend Integration

The frontend communicates with the Spring Boot backend through Axios service modules.

Main backend operations include:

- User registration and login.
- Balance inquiry.
- Account-name inquiry.
- Deposits and withdrawals.
- Fund transfers.
- Transaction history retrieval.
- Bank statement generation.

JWT tokens are attached to protected API requests through the Axios configuration.

## Application Workflow

1. A customer registers or logs in.
2. The backend authenticates the customer and returns a JWT token and account information.
3. The frontend stores the authentication state.
4. Protected pages retrieve account information from the backend.
5. Customers perform banking operations through REST APIs.
6. Transaction records are stored by the backend in MySQL.
7. Customers can request PDF statements through the statement feature.

## Future Improvements

- Enhanced analytics and financial visualizations.
- Improved accessibility and form validation.
- Additional account activity filters.
- Production deployment and performance optimization.

## Author

**Sakshi Patil**
GitHub: https://github.com/codewsakp
