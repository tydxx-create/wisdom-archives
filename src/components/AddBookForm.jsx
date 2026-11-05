import { useState } from 'react';
import FormField from './FormField.jsx';

const EMPTY = { title: '', author: '', genre: '', isbn: '', quantity: '' };

function validate(f) {
  const e = {};
  if (!f.title.trim()) e.title = 'Title is required.';
  if (!f.author.trim()) e.author = 'Author is required.';
  if (!f.genre.trim()) e.genre = 'Genre is required.';
  const digits = f.isbn.replace(/[-\s]/g, '');
  if (!f.isbn.trim()) e.isbn = 'ISBN is required.';
  else if (!/^\d{9}[\dXx]$|^\d{13}$/.test(digits)) e.isbn = 'ISBN must have 10 or 13 digits.';
  if (f.quantity === '') e.quantity = 'Quantity is required.';
  else if (!Number.isInteger(Number(f.quantity)) || Number(f.quantity) < 0) e.quantity = 'Enter a whole number, 0 or more.';
  return e;
}

// Used both for adding a book and (when `editing` is set) for updating one.
export default function AddBookForm({ editing, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    editing ? { ...editing, quantity: String(editing.quantity) } : EMPTY
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = field => e => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  const submit = async e => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    const ok = await onSubmit({
      title: form.title.trim(),
      author: form.author.trim(),
      genre: form.genre.trim(),
      isbn: form.isbn.trim(),
      quantity: Number(form.quantity)
    });
    setSaving(false);
    if (ok && !editing) setForm(EMPTY);
  };

  return (
    <form className="panel-card form-grid" onSubmit={submit} noValidate>
      <FormField id="bookTitle" label="Title" error={errors.title}>
        <input id="bookTitle" type="text" placeholder="e.g. The Idiot" value={form.title} onChange={set('title')} />
      </FormField>
      <FormField id="bookAuthor" label="Author" error={errors.author}>
        <input id="bookAuthor" type="text" placeholder="e.g. Fyodor Dostoevsky" value={form.author} onChange={set('author')} />
      </FormField>
      <FormField id="bookGenre" label="Genre" error={errors.genre}>
        <input id="bookGenre" type="text" placeholder="e.g. Classic Literature" value={form.genre} onChange={set('genre')} />
      </FormField>
      <FormField id="bookIsbn" label="ISBN" error={errors.isbn}>
        <input id="bookIsbn" type="text" placeholder="978-0-000-00000-0" value={form.isbn} onChange={set('isbn')} />
      </FormField>
      <FormField id="bookQty" label={editing ? 'Quantity' : 'Initial Quantity'} error={errors.quantity}>
        <input id="bookQty" type="number" min="0" placeholder="0" value={form.quantity} onChange={set('quantity')} />
      </FormField>
      <div className="field form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Book'}
        </button>
        {editing && <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel Edit</button>}
      </div>
    </form>
  );
}
