export default function TransactionTable({ transactions }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead><tr><th>Date</th><th>Book</th><th>Action</th><th>Qty</th><th>Handled By</th></tr></thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr><td colSpan="5" className="muted-cell">No transactions recorded yet.</td></tr>
          ) : transactions.map(t => (
            <tr key={t.id}>
              <td>{t.date}</td>
              <td>{t.bookTitle}</td>
              <td><span className={'tx-type ' + t.type}>{t.type === 'restock' ? 'Stock added' : 'Borrowed'}</span></td>
              <td>{t.quantity}</td>
              <td>{t.handledBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
