export default function UserList({ users, currentUserId, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr><th>Name</th><th>Membership ID</th><th>Role</th><th>Username</th><th>Joined</th><th></th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.membershipId}</td>
              <td><span className={'role-pill ' + u.role}>{u.role}</span></td>
              <td>{u.username}</td>
              <td>{u.joined}</td>
              <td>
                <div className="row-actions">
                  <button className="btn btn-sm btn-ghost" onClick={() => onEdit(u)}>Update</button>
                  <button
                    className="btn btn-sm btn-danger"
                    disabled={u.id === currentUserId}
                    title={u.id === currentUserId ? "You can't delete your own account" : ''}
                    onClick={() => onDelete(u)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
