import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'USER' });
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:3000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Ensure data is an array before setting state
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/');
      }
      console.error('Failed to fetch users:', err);
      setUsers([]); // Set empty array on error
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/api/users', newUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      setNewUser({ username: '', password: '', role: 'USER' });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed');
    }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1>Users</h1>
        <div style={s.buttons}>
          <button onClick={() => navigate('/audit')} style={s.btn}>Audit Logs</button>
          <button onClick={() => setShowModal(true)} style={s.btnPrimary}>+ Create User</button>
          <button onClick={() => { localStorage.clear(); navigate('/'); }} style={s.btnDanger}>Logout</button>
        </div>
      </div>

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>ID</th>
            <th style={s.th}>Username</th>
            <th style={s.th}>Role</th>
            <th style={s.th}>Created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td style={s.td}>{u.id}</td>
              <td style={s.td}>{u.username}</td>
              <td style={s.td}>
                <span style={u.role === 'ADMIN' ? s.badgeAdmin : s.badgeUser}>
                  {u.role}
                </span>
              </td>
              <td style={s.td}>{new Date(u.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={s.modal} onClick={() => setShowModal(false)}>
          <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
            <h2>Create User</h2>
            <form onSubmit={handleCreate} style={s.form}>
              <input
                placeholder="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                style={s.input}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                style={s.input}
                required
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                style={s.input}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={s.btnCancel}>Cancel</button>
                <button type="submit" style={s.btnSubmit}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  page: { padding: '20px', minHeight: '100vh', background: '#f5f5f5' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' },
  buttons: { display: 'flex', gap: '10px' },
  btn: { padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  btnPrimary: { padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  btnDanger: { padding: '10px 20px', background: '#f44336', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  table: { width: '100%', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  th: { background: '#f8f9fa', padding: '15px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e0e0e0' },
  td: { padding: '15px', borderBottom: '1px solid #f0f0f0' },
  badgeAdmin: { padding: '4px 12px', background: '#ffeaa7', color: '#d63031', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  badgeUser: { padding: '4px 12px', background: '#dfe6e9', color: '#2d3436', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modalBox: { background: 'white', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '400px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' },
  input: { padding: '10px', border: '1px solid #ddd', borderRadius: '6px' },
  btnCancel: { flex: 1, padding: '10px', background: '#e0e0e0', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  btnSubmit: { flex: 1, padding: '10px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};

export default UserList;