import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "USER",
  });
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/users", newUser, {
        // headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      setNewUser({ username: "", password: "", role: "USER" });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || "Failed");
    }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1>Users</h1>
        <div style={s.buttons}>
          <button onClick={() => navigate("/audit")}>Audit Logs</button>
          <button onClick={() => setShowModal(true)}>Create User</button>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </button>
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
          {users.map((u) => (
            <tr key={u.id}>
              <td style={s.td}>{u.id}</td>
              <td style={s.td}>{u.username}</td>
              <td style={s.td}>
                <span style={u.role === "ADMIN" ? s.badgeAdmin : s.badgeUser}>
                  {u.role}
                </span>
              </td>
              <td style={s.td}>{new Date(u.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

     <div style={s.modal} onClick={() =>setShowModal(false)} >
        <div style={s.modalBox} onClick={(e) => e.stopPropagation()} >
          <h2>Create User</h2>
          <form style={s.form} onSubmit={handleCreate} >
            <input type="uername" 
            value={newUser.username}
            onChange={(e) => setNewUser({...newUser, username: e.target.value})}
            style={s.input}
            required 
            />
            <input type="password" 
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            style={s.input}
            required 
            />
            <select
            value={newUser.role}
            onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            style={s.input}
            >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
                </select>
                <div>
                    <button type="button" onClick={()=> setShowModal(false)} style={s.btcancel}>Cancel</button>
                    <button type="submit" style={s.btnSubmit}>Create</button>
                </div>
          </form>
        </div>
     </div>
    </div>
  );
};

const s = {
  page: {
    padding: 20,
    minHeight: "100vh",
    background: "#f0f2f5",
  },
};

export default UserList;
