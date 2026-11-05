import { useEffect, useState } from 'react';
import { api } from '../api.js';
import BookCard from '../components/BookCard.jsx';

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.getBooks(), api.stats()])
      .then(([b, s]) => { setBooks(b); setStats(s); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const q = search.trim().toLowerCase();
  const shown = q
    ? books.filter(b => [b.title, b.author, b.genre].some(v => v.toLowerCase().includes(q)))
    : books;

  return (
    <section className="view">
      <div className="hero">
        <p className="hero-eyebrow">Community Library Catalogue</p>
        <h1 className="hero-title">Browse the shelves of<br />Wisdom Archives</h1>
        <p className="hero-sub">Welcome at Wisdom Archives. How may we assist you today?</p>
      </div>

      {error && <p className="form-error">{error}</p>}

      {stats && (
        <div className="stats-row">
          <div className="stat-card"><div className="num">{stats.titles}</div><div className="label">Titles in catalogue</div></div>
          <div className="stat-card"><div className="num">{stats.copies}</div><div className="label">Total copies held</div></div>
          <div className="stat-card warn"><div className="num">{stats.lowStock}</div><div className="label">Titles low on stock</div></div>
          <div className="stat-card"><div className="num">{stats.members}</div><div className="label">Registered members</div></div>
        </div>
      )}

      <div className="section-heading">
        <h2>Current Availability</h2>
        <p>Take a look at our established catalogue.</p>
      </div>

      <input
        className="search-box"
        type="search"
        placeholder="Search by title, author or genre…"
        aria-label="Search books"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="state-msg">Loading books…</p>
      ) : shown.length === 0 ? (
        <p className="state-msg">No books match your search.</p>
      ) : (
        <div className="book-grid">
          {shown.map(b => <BookCard key={b.id} book={b} />)}
        </div>
      )}
    </section>
  );
}
