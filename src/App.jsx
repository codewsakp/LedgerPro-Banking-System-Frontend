import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import AppLayout from './components/AppLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Operation from './pages/Operation.jsx';
import Transactions from './pages/Transactions.jsx';
import Statements from './pages/Statements.jsx';
import Profile from './pages/Profile.jsx';
import './styles/app.css';
export default function App() {
  const { token } = useAuth();
  return <Routes>
    <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
    <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <Register />} />
    <Route element={<ProtectedRoute />}><Route element={<AppLayout />}>
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/deposit" element={<Operation type="deposit" />} />
      <Route path="/withdraw" element={<Operation type="withdraw" />} />
      <Route path="/transfer" element={<Operation type="transfer" />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/statements" element={<Statements />} />
      <Route path="/profile" element={<Profile />} />
    </Route></Route>
    <Route path="*" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
  </Routes>;
}