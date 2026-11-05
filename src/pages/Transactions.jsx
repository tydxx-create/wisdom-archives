import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { isStaff, useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionTable from '../components/TransactionTable.jsx';

export default function Transactions() {
  const { user } = useAuth();
  const toast = useToast();
  const allowed = isStaff(user);

  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [b, t] = await Promise.all([api.getBooks(), api.getTransactions()]);
      setBooks(b);
      setTransactions(t);
    } catch (err) {
      toast(err.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const handleRecord = async tx => {
    try {
      await api.createTransaction(tx);
      toast(tx.type === 'restock' ? 'Stock added.' : 'Stock deducted.');
      await load(); // refresh stock levels and the history log
      return true;
    } catch (err) {
      toast(err.message);
      return false;
    }
  };

  return (
    <section className="view">
      <div className="section-heading">
        <h2>Transactions</h2>
        <p>
          {allowed
            ? 'Move stock in and out as books are borrowed and returned.'
            : 'Read-only history of stock movements at Wisdom Archives.'}
        </p>
      </div>

      {allowed && <TransactionForm books={books} onSubmit={handleRecord} />}

      {loading ? <p className="state-msg">Loading transactions…</p> : <TransactionTable transactions={transactions} />}
    </section>
  );
}
