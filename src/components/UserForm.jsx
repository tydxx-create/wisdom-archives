import { useState } from 'react';
import FormField from './FormField.jsx';

const EMPTY = { name: '', membershipId: '', role: 'member', username: '', password: '' };

function validate(f, editing) {
  const e = {};
  if (!f.name.trim()) e.name = 'Full name is required.';
  if (!f.membershipId.trim()) e.membershipId = 'Membership ID is required.';
  if (!f.username.trim()) e.username = 'Username is required.';
  else if (/\s/.test(f.username.trim())) e.username = 'Username cannot contain spaces.';
  else if (f.username.trim().length < 3) e.username = 'Username must be at least 3 characters.';
  if (!editing && !f.password.trim()) e.password = 'Password is required.';
  else if (f.password.trim() && f.password.trim().length < 6) e.password = 'Password must be at least 6 characters.';
  return e;
}

export default function UserForm({ editing, onSubmit, onCancel }) {
  const [form, setForm] = useState(editing ? { ...editing, password: '' } : EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = field => e => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  const submit = async e => {
    e.preventDefault();
    const found = validate(form, !!editing);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    const ok = await onSubmit({
      name: form.name.trim(),
      membershipId: form.membershipId.trim(),
      role: form.role,
      username: form.username.trim(),
      password: form.password.trim() // blank on edit = keep current password
    });
    setSaving(false);
    if (ok && !editing) setForm(EMPTY);
  };

  return (
    <form className="panel-card form-grid" onSubmit={submit} noValidate>
      <FormField id="userName" label="Full Name" error={errors.name}>
        <input id="userName" type="text" value={form.name} onChange={set('name')} />
      </FormField>
      <FormField id="userMembership" label="Membership ID" error={errors.membershipId}>
        <input id="userMembership" type="text" placeholder="e.g. MEM-002" value={form.membershipId} onChange={set('membershipId')} />
      </FormField>
      <FormField id="userRole" label="Role">
        <select id="userRole" value={form.role} onChange={set('role')}>
          <option value="member">Member</option>
          <option value="librarian">Librarian</option>
          <option value="admin">Admin</option>
        </select>
      </FormField>
      <FormField id="userUsername" label="Username" error={errors.username}>
        <input id="userUsername" type="text" autoComplete="off" value={form.username} onChange={set('username')} />
      </FormField>
      <FormField id="userPassword" label={editing ? 'New Password (optional)' : 'Password'} error={errors.password}>
        <input
          id="userPassword" type="password" autoComplete="new-password"
          placeholder={editing ? 'Leave blank to keep current' : ''}
          value={form.password} onChange={set('password')}
        />
      </FormField>
      <div className="field form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Member'}
        </button>
        {editing && <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel Edit</button>}
      </div>
    </form>
  );
}
