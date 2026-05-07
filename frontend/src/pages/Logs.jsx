import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Activity, ShieldAlert, CheckCircle, HelpCircle, RefreshCcw } from "lucide-react";

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/logs`)
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Verified": return <CheckCircle size={16} color="var(--success)" />;
      case "Revise": return <HelpCircle size={16} color="var(--warning)" />;
      case "Retry": return <RefreshCcw size={16} color="var(--danger)" />;
      default: return <Activity size={16} color="var(--accent-blue)" />;
    }
  };

  const getPriorityBadge = (priority) => {
    if (priority === "High") {
      return (
        <span style={{ padding: "4px 8px", background: "rgba(239, 68, 68, 0.2)", color: "var(--danger)", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "bold" }}>
          HIGH
        </span>
      );
    }
    return (
      <span style={{ padding: "4px 8px", background: "rgba(59, 130, 246, 0.2)", color: "var(--accent-blue)", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "bold" }}>
        NORMAL
      </span>
    );
  };

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="glass-panel" style={{ padding: "25px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
            <Activity color="var(--accent-purple)" /> Continuous Improvement & Call Logs
          </h2>
          <button 
            onClick={fetchLogs} 
            style={{ background: "var(--accent-blue)", color: "white", border: "none", padding: "10px 15px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
          >
            <RefreshCcw size={16} /> Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <RefreshCcw size={32} color="var(--accent-blue)" />
            </motion.div>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: "auto", background: "rgba(0,0,0,0.2)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead style={{ background: "rgba(255,255,255,0.05)", position: "sticky", top: 0 }}>
                <tr>
                  <th style={{ padding: "15px", color: "var(--text-muted)", fontSize: "0.9rem" }}>Date/Time</th>
                  <th style={{ padding: "15px", color: "var(--text-muted)", fontSize: "0.9rem" }}>Priority</th>
                  <th style={{ padding: "15px", color: "var(--text-muted)", fontSize: "0.9rem" }}>Transcript</th>
                  <th style={{ padding: "15px", color: "var(--text-muted)", fontSize: "0.9rem" }}>Intent / Emotion</th>
                  <th style={{ padding: "15px", color: "var(--text-muted)", fontSize: "0.9rem" }}>Confidence</th>
                  <th style={{ padding: "15px", color: "var(--text-muted)", fontSize: "0.9rem" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)" }}>No logs found. Start a call to populate.</td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "15px", fontSize: "0.9rem" }}>{new Date(log.timestamp).toLocaleString()}</td>
                      <td style={{ padding: "15px" }}>{getPriorityBadge(log.priority_level)}</td>
                      <td style={{ padding: "15px", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={log.transcript}>{log.transcript}</td>
                      <td style={{ padding: "15px" }}>
                        <div style={{ fontWeight: "bold", color: "var(--accent-indigo)" }}>{log.intent}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{log.emotion}</div>
                      </td>
                      <td style={{ padding: "15px" }}>
                        <span style={{ color: log.confidence < 60 ? "var(--danger)" : "var(--success)", fontWeight: "bold" }}>
                          {log.confidence}%
                        </span>
                      </td>
                      <td style={{ padding: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                        {getStatusIcon(log.status)}
                        <span style={{ fontSize: "0.9rem", fontWeight: "bold" }}>{log.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Logs;
