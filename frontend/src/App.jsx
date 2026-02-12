import React from "react";
import Login from "./pages/Login";
import UserList from "./pages/UserList";
import AuditLogs from "./pages/AuditLogs";
import Welcome from "./pages/Welcome";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/users"
          element={
            <ProtectedRoute>

              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit"
          element={
            <ProtectedRoute>
              <AuditLogs />
              </ProtectedRoute>
          }
        />
<Route path="/welcome" element={ <ProtectedRoute> <Welcome /> </ProtectedRoute> } />
      </Routes>
    </Router>
  );
}

export default App;
