import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Activity, ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Bell, ChevronDown, CreditCard, FileText, LayoutDashboard, LogOut, Menu, UserRound, Wallet, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
const links = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/deposit', label: 'Deposit funds', icon: ArrowDownLeft },
  { to: '/withdraw', label: 'Withdraw funds', icon: ArrowUpRight },
  { to: '/transfer', label: 'Transfer money', icon: ArrowLeftRight },
  { to: '/transactions', label: 'Transactions', icon: Activity },
  { to: '/statements', label: 'Statements', icon: FileText },
  { to: '/profile', label: 'My profile', icon: UserRound }
];
const titles = { '/dashboard': 'Overview', '/deposit': 'Deposit funds', '/withdraw': 'Withdraw funds', '/transfer': 'Transfer money', '/transactions': 'Transactions', '/statements': 'Bank statements', '/profile': 'My profile' };
export default function AppLayout() {
  const [open, setOpen] = useState(false); const { user, logout } = useAuth(); const nav = useNavigate(); const loc = useLocation();
  const initials = (user?.accountName || user?.email || 'LP').split(' ').map(x => x[0]).slice(0,2).join('').toUpperCase();
  const signOut = () => { logout(); nav('/login'); };
  return <div className="app-shell">
    {open && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setOpen(false)} />}
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Wallet size={21}/></div><span>Ledger<span className="brand-light">Pro</span></span><button className="sidebar-close" onClick={() => setOpen(false)}><X size={19}/></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav">{links.map(({to,label,icon:Icon}) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={18}/><span>{label}</span>{to === '/transactions' && <span className="nav-dot"/>}</NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CreditCard size={18}/></div><strong>Banking, made simple.</strong><span>Your money. Your control.</span></div><button className="nav-link logout-link" onClick={signOut}><LogOut size={18}/><span>Sign out</span></button><div className="sidebar-foot">LEDGERPRO · DIGITAL BANKING</div></div>
    </aside>
    <main className="main-area"><header className="topbar"><div className="topbar-left"><button className="menu-button" onClick={() => setOpen(true)}><Menu size={21}/></button><div><div className="eyebrow">YOUR FINANCIAL SPACE</div><h1>{titles[loc.pathname] || 'Overview'}</h1></div></div><div className="topbar-right"><div className="secure-pill"><span/> Secure session</div><button className="icon-button" aria-label="Notifications"><Bell size={19}/><i/></button><button className="profile-chip" onClick={() => nav('/profile')}><span className="avatar">{initials}</span><span className="profile-chip-name">{user?.accountName || user?.email || 'Account'}</span><ChevronDown size={15}/></button></div></header><div className="page-content"><Outlet/></div><footer className="app-footer"><span>© {new Date().getFullYear()} LedgerPro Financial</span><span>Designed for clarity. Built for confidence.</span></footer></main>
  </div>;
}