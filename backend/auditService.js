import express from 'express';

const app = express();
app.use(express.json())

let auditLogs =[]

app.post('/audit', (req, res) => {

const { action, performedBy, targetUser, timestamp } = req.body;

const logEntry ={
    id: auditLogs.length +1,
    action,
    performedBy,
    targetUser: targetUser || null,
    timestamp : timestamp || null
}
auditLogs.push(logEntry)
console.log("Audit", logEntry)
res.status(201).json(logEntry)
})

app.get('audit', (req, res)=> {
        res.json(auditLogs)
    });

app.listen(3001, () => {
    console.log("Audit Service: locaholst: 3001")
})