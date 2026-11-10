
import { useEffect, useMemo, useState } from 'react';

import {
  Activity,
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  CreditCard,
  RefreshCw,
  ShieldCheck,
  Wallet
} from 'lucide-react';

import { Link } from 'react-router-dom';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import { useAuth } from '../context/AuthContext.jsx';
import { bankingService } from '../services/bankingService.js';
import { getErrorMessage } from '../services/api.js';

import StatCard from '../components/StatCard.jsx';
import TransactionTable from '../components/TransactionTable.jsx';
import Notice from '../components/Notice.jsx';

const money = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(Number(value || 0));

const formatDate = (date) => {
  if (!date) return 'Recent';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(date);
  }

  return parsedDate.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short'
  });
};

export default function Dashboard() {
  const { user, updateUser } = useAuth();

  const [balance, setBalance] = useState(
    Number(user?.accountBalance || 0)
  );

  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  const account = user?.accountNumber;

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError('');

      if (!account) {
        setError(
          'Account number is not available. Please log out and sign in again.'
        );
        setTransactions([]);
        setLoading(false);
        return;
      }

      const results = await Promise.allSettled([
        bankingService.balance(account),
        bankingService.transactions(account)
      ]);

      if (!active) return;

      const [balanceResult, transactionResult] = results;
      const errors = [];

      if (balanceResult.status === 'fulfilled') {
        const info = balanceResult.value.data?.accountInfo;

        if (info?.accountBalance != null) {
          setBalance(Number(info.accountBalance));

          updateUser({
            accountBalance: info.accountBalance,
            accountName: info.accountName || user?.accountName
          });
        }
      } else {
        errors.push(
          `Balance: ${getErrorMessage(balanceResult.reason)}`
        );
      }

      if (transactionResult.status === 'fulfilled') {
        const data = transactionResult.value.data;

        setTransactions(Array.isArray(data) ? data : []);
      } else {
        setTransactions([]);

        errors.push(
          `Transaction history: ${getErrorMessage(transactionResult.reason)}`
        );
      }

      if (errors.length > 0) {
        setError(errors.join(' | '));
      }

      setLoading(false);
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, [account, refresh]);

  const successfulTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      return (
        !transaction.status ||
        transaction.status.toUpperCase() === 'SUCCESS'
      );
    });
  }, [transactions]);

  const totalInflow = successfulTransactions
    .filter((transaction) => {
      const type = transaction.transactionType?.toUpperCase();

      return type === 'CREDIT' || type === 'TRANSFER_CREDIT';
    })
    .reduce(
      (total, transaction) => total + Number(transaction.amount || 0),
      0
    );

  const totalOutflow = successfulTransactions
    .filter((transaction) => {
      const type = transaction.transactionType?.toUpperCase();

      return type === 'DEBIT' || type === 'TRANSFER_DEBIT';
    })
    .reduce(
      (total, transaction) => total + Number(transaction.amount || 0),
      0
    );

  const chart = [...successfulTransactions]
    .reverse()
    .slice(-7)
    .map((transaction, index) => ({
      name: formatDate(transaction.createdAt) || `Entry ${index + 1}`,
      amount: Number(transaction.amount || 0)
    }));

  return (
    <div className="dashboard-page">

      <div className="welcome-row">
        <div>
          <div className="form-eyebrow">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            }).toUpperCase()}
          </div>

          <h2>
            Welcome back, {(user?.accountName || user?.email || 'there').split(' ')[0]}
            {' '}
            <span className="wave">✦</span>
          </h2>

          <p>Here's what's happening with your money today.</p>
        </div>

        <button
          className="secondary-button refresh-button"
          onClick={() => setRefresh((value) => value + 1)}
          disabled={loading}
        >
          <RefreshCw size={16} />
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      <Notice type="error" message={error} />

      <section className="balance-hero">
        <div className="balance-copy">
          <div className="balance-label">
            <span className="balance-orb">
              <Wallet size={16} />
            </span>
            TOTAL ACCOUNT BALANCE
          </div>

          <div className="balance-amount">
            {loading ? 'Loading…' : money(balance)}
          </div>

          <div className="balance-account">
            Account number <b>{account || 'Not available'}</b>
          </div>
        </div>

        <div className="balance-hero-right">
          <div className="balance-secure">
            <ShieldCheck size={17} />
            Protected account
          </div>

          <div className="hero-watermark">LP</div>
        </div>

        <div className="hero-decoration" />
      </section>

      <section className="stats-grid">
        <StatCard
          label="Total inflow"
          value={loading ? '—' : money(totalInflow)}
          note="Successful credits and incoming transfers"
          icon={ArrowDownLeft}
          tone="green"
        />

        <StatCard
          label="Total outflow"
          value={loading ? '—' : money(totalOutflow)}
          note="Successful debits and outgoing transfers"
          icon={ArrowUpRight}
          tone="orange"
        />

        <StatCard
          label="Transactions"
          value={loading ? '—' : successfulTransactions.length}
          note="Successful account transactions"
          icon={Activity}
          tone="violet"
        />

        <StatCard
          label="Account status"
          value="Active"
          note="Your account is ready"
          icon={CreditCard}
          tone="blue"
        />
      </section>

      <section className="dashboard-grid">

        <div className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h3>Recent activity</h3>
              <p>Based on your latest successful transactions</p>
            </div>

            <span className="panel-tag">LAST 7 RECORDS</span>
          </div>

          {chart.length > 0 ? (
            <div className="chart-area">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chart}>
                  <defs>
                    <linearGradient
                      id="activityFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#3979e8"
                        stopOpacity={0.22}
                      />

                      <stop
                        offset="95%"
                        stopColor="#3979e8"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 5"
                    vertical={false}
                    stroke="#edf0f5"
                  />

                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#8791a3' }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    tick={{ fontSize: 11, fill: '#8791a3' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value}`}
                  />

                  <Tooltip formatter={(value) => money(value)} />

                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#3979e8"
                    strokeWidth={2.5}
                    fill="url(#activityFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="chart-empty">
              <Activity size={24} />
              <span>
                {loading
                  ? 'Loading account activity…'
                  : 'No transaction activity available yet.'}
              </span>
            </div>
          )}
        </div>

        <div className="panel quick-panel">
          <div className="panel-heading">
            <div>
              <h3>Quick actions</h3>
              <p>Move money with confidence</p>
            </div>
          </div>

          <div className="quick-actions">

            <Link to="/deposit">
              <span className="quick-icon green">
                <ArrowDownLeft size={19} />
              </span>

              <span>
                <b>Deposit</b>
                <small>Add money to your account</small>
              </span>

              <span className="quick-arrow">↗</span>
            </Link>

            <Link to="/withdraw">
              <span className="quick-icon orange">
                <ArrowUpRight size={19} />
              </span>

              <span>
                <b>Withdraw</b>
                <small>Access your funds</small>
              </span>

              <span className="quick-arrow">↗</span>
            </Link>

            <Link to="/transfer">
              <span className="quick-icon blue">
                <ArrowLeftRight size={19} />
              </span>

              <span>
                <b>Transfer</b>
                <small>Send money to an account</small>
              </span>

              <span className="quick-arrow">↗</span>
            </Link>

          </div>
        </div>

      </section>

      <section className="panel recent-panel">
        <div className="panel-heading">
          <div>
            <h3>Recent transactions</h3>
            <p>Your latest account activity from the database</p>
          </div>

          <Link className="text-link" to="/transactions">
            View all <span>→</span>
          </Link>
        </div>

        {loading ? (
          <div className="loading-line">
            Loading your transactions…
          </div>
        ) : transactions.length > 0 ? (
          <TransactionTable
            transactions={transactions.slice(0, 5)}
          />
        ) : (
          <div className="chart-empty">
            <Activity size={24} />
            <span>No transactions found for this account.</span>
          </div>
        )}
      </section>

    </div>
  );
}
