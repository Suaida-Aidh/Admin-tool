import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    action: '',
    performedBy: '',
    targetUser: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    axios.get('http://localhost:3002/audit')
      .then(({ data }) => setLogs(data))
      .catch(console.error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3002/audit', {
        ...formData,
        timestamp: new Date().toISOString()
      });
      setShowModal(false);
      setFormData({ action: '', performedBy: '', targetUser: '' });
      fetchLogs(); // Refresh the logs
    } catch (error) {
      console.error('Error posting audit log:', error);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1>Audit Logs</h1>
        <div>
          <button onClick={() => setShowModal(true)} style={s.postBtn}>Post Audit</button>
          <button onClick={() => navigate('/users')} style={s.btn}>Back to Users</button>
        </div>
      </div>

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>ID</th>
            <th style={s.th}>Action</th>
            <th style={s.th}>Performed By</th>
            <th style={s.th}>Target User</th>
            <th style={s.th}>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td style={s.td}>{log.id}</td>
              <td style={s.td}>
                <span style={log.action === 'LOGIN' ? s.badgeLogin : s.badgeCreate}>
                  {log.action}
                </span>
              </td>
              <td style={s.td}>{log.performedBy}</td>
              <td style={s.td}>{log.targetUser || '-'}</td>
              <td style={s.td}>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={s.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Post New Audit Log</h2>
            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.formGroup}>
                <label style={s.label}>Action:</label>
                <input
                  type="text"
                  value={formData.action}
                  onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                  style={s.input}
                  required
                  placeholder="e.g., LOGIN, CREATE, UPDATE"
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Performed By:</label>
                <input
                  type="text"
                  value={formData.performedBy}
                  onChange={(e) => setFormData({ ...formData, performedBy: e.target.value })}
                  style={s.input}
                  required
                  placeholder="Username"
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Target User (Optional):</label>
                <input
                  type="text"
                  value={formData.targetUser}
                  onChange={(e) => setFormData({ ...formData, targetUser: e.target.value })}
                  style={s.input}
                  placeholder="Target username"
                />
              </div>
              <div style={s.formActions}>
                <button type="submit" style={s.submitBtn}>Submit</button>
                <button type="button" onClick={() => setShowModal(false)} style={s.cancelBtn}>Cancel</button>
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
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' },
  btn: { padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginLeft: '10px' },
  postBtn: { padding: '10px 20px', background: '#48bb78', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  table: { width: '100%', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  th: { background: '#f8f9fa', padding: '15px', textAlign: 'left', fontWeight: '600', borderBottom: '2px solid #e0e0e0' },
  td: { padding: '15px', borderBottom: '1px solid #f0f0f0' },
  badgeLogin: { padding: '4px 12px', background: '#d1f2eb', color: '#0c7356', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  badgeCreate: { padding: '4px 12px', background: '#d6eaf8', color: '#1b4f72', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { background: 'white', borderRadius: '12px', padding: '30px', width: '90%', maxWidth: '500px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' },
  form: { marginTop: '20px' },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' },
  input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  formActions: { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '25px' },
  submitBtn: { padding: '10px 24px', background: '#48bb78', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  cancelBtn: { padding: '10px 24px', background: '#e2e8f0', color: '#4a5568', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }
};

export default AuditLogs;