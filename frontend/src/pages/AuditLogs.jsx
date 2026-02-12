import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AuditLogs = () => {

    const [logs, setLogs] =useState([])
    const navigate = useNavigate();

    useEffect(() =>{
        axios.get('http://localhost:3001/audit')
        .then(({data}) => setLogs(data))
        .catch(console.error)
    }, [])

  return (
    <div style={s.page} >
        <div style={s.header}>
            <h1>Audit Logs</h1>
            <button onClick={() => navigate('/users')} style={s.btn} >Back to Users</button>
        </div>

        <table style={s.table} >
            <thead>
                <tr>
                    <th style={s.th}>ID</th>
                    <th style={s.th}>Action</th>    
                    <th style={s.th}>Performed By</th>
                    <th style={s.th}>Target User</th>
                    <th style={s.th}>Timestamp</th>
                </tr>
            </thead>
            {logs.map(log => (
                <tr key={log.id}>
                    <td style={s.td}>{log.id}</td>
                    <td style={s.td}><span style={log.action === 'LOGIN' ? s.badgeLogin : s.badgeCreate}>
                        {log.action}
                        </span></td>
                    <td style={s.td}>{log.performedBy}</td>
                    <td style={s.td}>{log.targetUser || '-'}</td>
                    <td style={s.td}>{new Date(log.timestamp).toLocaleString() || '-'}</td>
                </tr>
            ))}
        </table>
    </div>
  )
}

const s ={
    page: {
        padding: 20,
        minHeight: '100vh',
        background: '#f0f2f5'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 20,
        border: 'none',
        borderRadius: 5,
        cursor:'pointer',
    }

}

export default AuditLogs