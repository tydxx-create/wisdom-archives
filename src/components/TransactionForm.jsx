import { useState } from 'react';
import FormField from './FormField.jsx';

export default function TransactionForm({ books, onSubmit }) {
  const [bookId, setBookId] = useState('');
  const [type, setType] = useState('restock');
  const [qty, setQty] = useState('1');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedId = bookId || String(books[0]?.id ?? '');
  const selected = books.find(b => String(b.id) === selectedId);

  const submit = async e => {
    e.preventDefault();
    const n = Number(qty);
    if (!selected) return setError('Choose a book.');
    if (!Number.isInteger(n) || n < 1) return setError('Quantity must be a whole number of 1 or more.');
    if (type === 'borrow' && n > selected.quantity) {
      return setError(`Only ${selected.quantity} cop${selected.quantity === 1 ? 'y' : 'ies'} available.`);
    }
    setError('');
    setSaving(true);
    const ok = await onSubmit({ bookId: selected.id, type, quantity: n });
    setSaving(false);
    if (ok) setQty('1');
  };

  return (
    <form className="panel-card form-grid" onSubmit={submit} noValidate>
      <FormField id="txBook" label="Book">
        <select id="txBook" value={selectedId} onChange={e => setBookId(e.target.value)}>
          {books.map(b => <option key={b.id} value={b.id}>{b.title} ({b.quantity} in stock)</option>)}
        </select>
      </FormField>
      <FormField id="txType" label="Action">
        <select id="txType" value={type} onChange={e => setType(e.target.value)}>
          <option value="restock">Add stock (new arrival)</option>
          <option value="borrow">Deduct stock (borrowed)</option>
        </select>
      </FormField>
      <FormField id="txQty" label="Quantity" error={error}>
        <input id="txQty" type="number" min="1" value={qty} onChange={e => { setQty(e.target.value); setError(''); }} />
      </FormField>
      <div className="field form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving || books.length === 0}>
          {saving ? 'Recording…' : 'Record Transaction'}
        </button>
      </div>
    </form>
  );
}
