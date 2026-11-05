export default function BookCard({ book }) {
  const low = book.quantity < 2;
  return (
    <div className={'book-card' + (low ? ' low-stock' : '')}>
      <span className="genre-tag">{book.genre}</span>
      <h3>{book.title}</h3>
      <p className="author">{book.author}</p>
      <div className="meta-row">
        <span>{low ? <span className="low-badge">Low stock</span> : 'ISBN ' + book.isbn}</span>
        <span className="qty">{book.quantity} in stock</span>
      </div>
    </div>
  );
}
