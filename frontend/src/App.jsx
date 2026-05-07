import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, LayoutDashboard, Database } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import Logs from "./pages/Logs";

import "./App.css";

const Navigation = () => {
  const location = useLocation();

  return (
    <header
      className="glass-panel"
      style={{ padding: "15px 30px", display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: "16px", zIndex: 10, flexShrink: 0, minHeight: "80px", marginBottom: "20px" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
          style={{ background: "linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-purple) 100%)", padding: "10px", borderRadius: "12px", display: "flex" }}
        >
          <Shield color="white" size={28} />
        </motion.div>
        <div style={{ margin: 15 }}>
          <h1 style={{ margin: 0, fontSize: "1.4rem", letterSpacing: "1px", background: "linear-gradient(to right, #fff, #a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            BHVL Intelligence Core
          </h1>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "2px" }}>
            Helpline Dispatch System
          </p>
        </div>
      </div>

      <nav style={{ display: "flex", gap: "15px" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "10px",
              background: location.pathname === "/" ? "rgba(99, 102, 241, 0.2)" : "transparent",
              color: location.pathname === "/" ? "white" : "var(--text-muted)",
              border: location.pathname === "/" ? "1px solid var(--accent-indigo)" : "1px solid transparent",
              fontWeight: location.pathname === "/" ? "bold" : "normal"
            }}
          >
            <LayoutDashboard size={18} /> Dashboard
          </motion.div>
        </Link>
        <Link to="/logs" style={{ textDecoration: "none" }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "10px",
              background: location.pathname === "/logs" ? "rgba(99, 102, 241, 0.2)" : "transparent",
              color: location.pathname === "/logs" ? "white" : "var(--text-muted)",
              border: location.pathname === "/logs" ? "1px solid var(--accent-indigo)" : "1px solid transparent",
              fontWeight: location.pathname === "/logs" ? "bold" : "normal"
            }}
          >
            <Database size={18} /> System Logs
          </motion.div>
        </Link>
      </nav>
    </header>
  );
};

function App() {
  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", position: "relative", padding: "20px", boxSizing: "border-box" }}>
        {/* Dynamic Background Orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          style={{ position: "absolute", top: "-10%", left: "-5%", width: "500px", height: "500px", background: "radial-gradient(circle, var(--accent-blue) 0%, transparent 70%)", filter: "blur(60px)", zIndex: -1 }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 2 }}
          style={{ position: "absolute", bottom: "-10%", right: "-5%", width: "600px", height: "600px", background: "radial-gradient(circle, var(--accent-purple) 0%, transparent 70%)", filter: "blur(80px)", zIndex: -1 }}
        />

        <Navigation />

        <div style={{ flex: 1, overflow: "hidden" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/logs" element={<Logs />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;