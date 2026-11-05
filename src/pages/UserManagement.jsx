import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import UserForm from '../components/UserForm.jsx';
import UserList from '../components/UserList.jsx';

export default function UserManagement() {
  const { user } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    try { setUsers(await api.getUsers()); }
    catch (err) { toast(err.message); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleSave = async data => {
    try {
      if (editing) {
        await api.updateUser(editing.id, data);
        toast('Member updated.');
        setEditing(null);
      } else {
        await api.createUser(data);
        toast('Member added.');
      }
      await loadUsers();
      return true;
    } catch (err) {
      toast(err.message);
      return false;
    }
  };

  const handleDelete = async target => {
    if (!window.confirm(`Remove ${target.name} from Wisdom Archives?`)) return;
    try {
      await api.deleteUser(target.id);
      if (editing?.id === target.id) setEditing(null);
      toast('Member removed.');
      await loadUsers();
    } catch (err) {
      toast(err.message);
    }
  };

  const startEdit = u => {
    setEditing(u);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="view">
      <div className="section-heading">
        <h2>Members Staff</h2>
        <p>Only admins and librarians may add, update, or remove accounts.</p>
      </div>

      <UserForm key={editing?.id ?? 'new'} editing={editing} onSubmit={handleSave} onCancel={() => setEditing(null)} />

      {loading ? <p className="state-msg">Loading members…</p> : (
        <UserList users={users} currentUserId={user.id} onEdit={startEdit} onDelete={handleDelete} />
      )}
    </section>
  );
}
