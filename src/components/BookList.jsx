// Table of books. Update / Delete buttons only appear when handlers are passed in.
export default function BookList({ books, onEdit, onDelete }) {
  const editable = !!(onEdit || onDelete);
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr><th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Qty</th>{editable && <th></th>}</tr>
        </thead>
        <tbody>
          {books.length === 0 && (
            <tr><td colSpan={editable ? 6 : 5} className="muted-cell">No books in the catalogue yet.</td></tr>
          )}
          {books.map(b => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.genre}</td>
              <td>{b.isbn}</td>
              <td>{b.quantity < 2 ? <span className="low-badge">{b.quantity}</span> : b.quantity}</td>
              {editable && (
                <td>
                  <div className="row-actions">
                    <button className="btn btn-sm btn-ghost" onClick={() => onEdit(b)}>Update</button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(b)}>Delete</button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
