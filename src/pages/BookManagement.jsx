import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { useToast } from '../context/ToastContext.jsx';
import AddBookForm from '../components/AddBookForm.jsx';
import BookList from '../components/BookList.jsx';

export default function BookManagement() {
  const toast = useToast();
  const [books, setBooks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadBooks = useCallback(async () => {
    try { setBooks(await api.getBooks()); }
    catch (err) { toast(err.message); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { loadBooks(); }, [loadBooks]);

  // Returns true on success so the form knows whether to clear itself
  const handleSave = async data => {
    try {
      if (editing) {
        await api.updateBook(editing.id, data);
        toast('Book updated.');
        setEditing(null);
      } else {
        await api.createBook(data);
        toast('Book added.');
      }
      await loadBooks();
      return true;
    } catch (err) {
      toast(err.message);
      return false;
    }
  };

  const handleDelete = async book => {
    if (!window.confirm(`Remove "${book.title}" from the catalogue?`)) return;
    try {
      await api.deleteBook(book.id);
      if (editing?.id === book.id) setEditing(null);
      toast('Book removed.');
      await loadBooks();
    } catch (err) {
      toast(err.message);
    }
  };

  const startEdit = book => {
    setEditing(book);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="view">
      <div className="section-heading">
        <h2>Manage Books</h2>
        <p>Add new titles, edit details, or remove books no longer in our hands.</p>
      </div>

      {/* key forces a fresh form whenever a different book is chosen */}
      <AddBookForm key={editing?.id ?? 'new'} editing={editing} onSubmit={handleSave} onCancel={() => setEditing(null)} />

      {loading ? <p className="state-msg">Loading books…</p> : (
        <BookList books={books} onEdit={startEdit} onDelete={handleDelete} />
      )}
    </section>
  );
}
