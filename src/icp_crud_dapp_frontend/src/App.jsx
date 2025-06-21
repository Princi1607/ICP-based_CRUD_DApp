import React, { useEffect, useState } from "react";
import { icp_crud_dapp_backend } from "../../declarations/icp_crud_dapp_backend";
import "./index.scss";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const [updateForm, setUpdateForm] = useState({ id: "", name: "", email: "" });
  const [readId, setReadId] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const userList = await icp_crud_dapp_backend.list_users();
    setUsers(userList);
  };

  const handleCreate = async () => {
    await icp_crud_dapp_backend.create_user(form.name, form.email);
    setForm({ name: "", email: "" });
    fetchUsers();
  };

  const handleRead = async () => {
    if (!readId) return alert("Enter user ID");
    const user = await icp_crud_dapp_backend.read_user(Number(readId));
    if (user) {
      alert(`User Found: ${user.name} (${user.email})`);
    } else {
      alert("User not found");
    }
  };

  const handleUpdate = async () => {
    const success = await icp_crud_dapp_backend.update_user(
      Number(updateForm.id),
      updateForm.name,
      updateForm.email
    );
    if (success) {
      alert("User updated");
      fetchUsers();
    } else {
      alert("Update failed");
    }
  };

  const handleDelete = async () => {
    if (users.length === 0) return;
    const lastUserId = users[users.length - 1].id;
    const success = await icp_crud_dapp_backend.delete_user(lastUserId);
    if (success) {
      alert(`Deleted user with ID ${lastUserId}`);
      fetchUsers();
    } else {
      alert("Delete failed");
    }
  };

  return (
    <div className="app-container">
      <h1>🚀 ICP CRUD DApp</h1>

      <div className="section">
        <h2>Create User</h2>
        <div className="input-group">
          <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <button onClick={handleCreate}>Create</button>
        </div>
      </div>

      <div className="section">
        <h2>Read User</h2>
        <div className="input-group">
          <input type="number" placeholder="User ID" value={readId} onChange={e => setReadId(e.target.value)} />
          <button onClick={handleRead}>Read</button>
        </div>
      </div>

      <div className="section">
        <h2>Update User</h2>
        <div className="input-group">
          <input type="number" placeholder="ID" value={updateForm.id} onChange={e => setUpdateForm({ ...updateForm, id: e.target.value })} />
          <input type="text" placeholder="New Name" value={updateForm.name} onChange={e => setUpdateForm({ ...updateForm, name: e.target.value })} />
          <input type="email" placeholder="New Email" value={updateForm.email} onChange={e => setUpdateForm({ ...updateForm, email: e.target.value })} />
          <button onClick={handleUpdate}>Update</button>
        </div>
      </div>

      <div className="section">
        <h2>Delete Last User</h2>
        <button className="danger" onClick={handleDelete}>Delete Last</button>
      </div>

      <div className="section">
        <h2>All Users</h2>
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Email</th></tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{Number(user.id)}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
