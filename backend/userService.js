import axios from 'axios';
import express from 'express'
import jwt from 'jsonwebtoken'

let users =[{
    id: 1,
    username:'admin',
    password: 'admin123',
    role: 'ADMIN',
    createdAt: new Date().toISOString()
}]

let UserIdCounter = 2

const authenticateToken= (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(401).json({error: "No token provided"});

    try{
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    }catch(err){
        res.status(403).json({error:'Invalid token'})
    }
};


const isAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({error: "Admin only"});
    }
    next();
}


const logAudit = async (useActionData, performedBy, targetUser = null) => {
    try{
        await axios.post('http://localhost:3001/audit', {
            action, performedBy, targetUser, timestamp: new Date().toISOString
        })
    }catch (error){
        console.error("Audit log failed", error.message)
    }
}


//Handling Routes here 
router.post('/login', async (req, res) =>{

    const { username, password} =req.body;
    const user = users.find(u => u.username === username);

    if(!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({error: 'invalid credentials'});
    }

    const token = jwt.sign(
        {id: user.id, username:user.username, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: '24h'}
    );

    await logAudit('LOGIN', username);
    res.json({token, user: {id: user.id, username: user.username, role: user.role} });

})



//get

router.get('/users',authenticateToken, isAdmin,(req,res)=>{
    const safeUsers = users.map(({password, ...user}) => user);
    res.json(safeUsers)
} )

//post

router.post('/users', authenticateToken, isAdmin, async(req, res)=>{

    const {username , password, role} = req.body

    if(!username || !password) {
        return res.status(400).json({error:"username and password required"})
    }

    if (users.find(u => u.username === username)) {
        return res.status(400).json({error:"username exist"})
    }

    const newUser = {
        id: UserIdCounter++,
        username,
        password: await bcrypt.hash(password, 10),
        role: role || 'USER',
        createdAt: new Date().toISOString
    }

    users.push(newUser)
    await logAudit('CREATE_USER', req.user.username, username);

    const { password:_, ...safeUser} = newUser;
    res.status(201).json(safeUser)
    })



    export default router;