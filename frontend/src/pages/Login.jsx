import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login =() => {
    const [username, setUsername] =useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')
    const navigate = useNavigate();


    const handleSubmit = async (e) =>{
        e.e.preventDefault();
;
        setError('');

        try{
            const { data } = await axios.post('/api/login', {username, password});
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/users');
        } catch( err) {
            setError(err.response?.data?.error|| 'Login failed')
        }
    };

    return (
        <div style={s.container}>
            <div style={s.card}>
                <h1 style={s.title}>Admin Tool</h1>
                <form onSubmit={handleSubmit} style={s.form}>
                    <input type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={s.input}
                    />
                    <input type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                                        style={s.input}

                    />
                   
                    {error && <div>{error}</div>}
                    <button style={s.button} type="submit">Login </button>
                </form>
                <p style={s.hint} >Default: admin/ admin123</p>
            </div>

        </div>
    )
};

const s = {
    container :{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }, 
    card:{
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '12px',
        boxshadow: '0 10px 40px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',

    },
    title:{
        frontsize: '28px',
        marginBottom: '30px',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    input: {
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '14px',
    },
    button: {
        padding: '12px',
        borderRadius: '6px',
        border: 'none',
        backgroundColor: '#667eea',
        color: '#fff',
        fontSize: '16px',
cursor: 'pointer',
    },
    error: {
color: 'red',
padding: '10px',
backgroundColor: '#ffe6e6',
fontSize: '14px',borderRadius: '6px',

    },
    hint: {
        marginTop: '20px',
        fontSize: '12px',
        color: '#383434',
        textAlign: 'center',
    }
}


export default Login