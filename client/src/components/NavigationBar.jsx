import { Link } from "react-router-dom";
 
export default function Navbar() {
  return (
<nav style={{ display: "flex", gap: "15px", padding: "10px", background: "#eee" }}>
<Link to="/">Home</Link>
<Link to="/services">Services</Link>
<Link to="/login">Login</Link>
<Link to="/register">Register</Link>
<Link to="/dashboard">Dashboard</Link>
</nav>
  );
}