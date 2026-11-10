
import { useCallback, useEffect, useState } from 'react';

import { Activity, RefreshCw } from 'lucide-react';

import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { bankingService } from '../services/bankingService.js';
import { getErrorMessage } from '../services/api.js';

import TransactionTable from '../components/TransactionTable.jsx';
import Notice from '../components/Notice.jsx';

export default function Transactions() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const loadTransactions = useCallback(async () => {
    if (!user?.accountNumber) {
      setError('Account number is not available. Please log in again.');
      setItems([]);
      setLoaded(false);
      return;
    }

    setBusy(true);
    setError('');

    try {
      const { data } = await bankingService.transactions(
        user.accountNumber
      );

      setItems(Array.isArray(data) ? data : []);
      setLoaded(true);
    } catch (exception) {
      setError(getErrorMessage(exception));
      setItems([]);
      setLoaded(false);
    } finally {
      setBusy(false);
    }
  }, [user?.accountNumber]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions, refresh]);

  return (
    <div className="operation-page">

      <div className="page-intro page-intro-row">
        <div>
          <div className="form-eyebrow">ACCOUNT ACTIVITY</div>

          <h2>Transaction history</h2>

          <p>
            Review credits, debits and transfers recorded on your account.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={() => setRefresh((value) => value + 1)}
          disabled={busy}
        >
          <RefreshCw size={16} />
          {busy ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      <Notice type="error" message={error} />

      <section className="panel recent-panel">

        <div className="panel-heading">
          <div>
            <h3>All transactions</h3>

            <p>
              {loaded
                ? `${items.length} records found`
                : 'Retrieving your account activity'}
            </p>
          </div>

          <span className="panel-tag">
            <Activity size={13} />
            ACCOUNT DATA
          </span>
        </div>

        {busy ? (
          <div className="loading-line">
            Loading transaction history…
          </div>
        ) : loaded && items.length > 0 ? (
          <TransactionTable transactions={items} />
        ) : loaded ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Activity size={23} />
            </div>

            <strong>No transactions yet</strong>

            <span>
              Your account transactions will appear here when you make a
              deposit, withdrawal or transfer.
            </span>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Activity size={23} />
            </div>

            <strong>Transaction history unavailable</strong>

            <span>
              Check your connection and try refreshing the page.
            </span>
          </div>
        )}

      </section>

      <p className="page-footnote">
        Your transaction history is retrieved directly from the banking
        database. Downloading or emailing a PDF statement is a separate
        operation available on the{' '}
        <Link to="/statements">Statements</Link> page.
      </p>

    </div>
  );
}
