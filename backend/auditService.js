import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import AuditLog from './model/AuditLog.js';

dotenv.config({ path: '../.env' });
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.post('/audit', async (req, res) => {
  try {
    const { action, performedBy, targetUser, timestamp } = req.body;
    
    const logEntry = new AuditLog({
      action,
      performedBy,
      targetUser: targetUser || null,
      timestamp: timestamp || new Date()
    });

    await logEntry.save();
    
    console.log("Audit Log Created:", logEntry);
    res.status(201).json(logEntry);
  } catch (error) {
    console.error("Error creating audit log:", error.message);
    res.status(500).json({ error: 'Failed to create audit log' });
  }
});

app.get('/audit', async (req, res) => {
  try {
    const auditLogs = await AuditLog.find().sort({ timestamp: -1 });
    res.json(auditLogs);
  } catch (error) {
    console.error("❌ Error fetching audit logs:", error.message);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Audit Service' });
});

const PORT = process.env.AUDIT_PORT || 3002;

app.listen(PORT, () => {
  console.log(` Audit Service running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try a different port.`);
    process.exit(1);
  } else {
    console.error(' Server error:', err);
  }
});