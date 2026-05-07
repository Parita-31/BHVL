import { useState, useRef, useEffect } from "react";
import VoiceInput from "../components/VoiceInput";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, CheckCircle, HelpCircle, Activity, Mic2, Cpu, Volume2, Shield, Radio, Zap } from "lucide-react";

const Waveform = () => (
  <div className="waveform-container">
    <div className="wave-bar"></div>
    <div className="wave-bar"></div>
    <div className="wave-bar"></div>
    <div className="wave-bar"></div>
    <div className="wave-bar"></div>
    <div className="wave-bar"></div>
    <div className="wave-bar"></div>
  </div>
);

function Dashboard() {
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState([]);
  const [callActive, setCallActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const logsEndRef = useRef(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleConfirm = async (response) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/confirm`, {
        response,
        id: result?.id, // Added ID for DB update
      });

      if (res.data.status === "VERIFIED") {
        setLogs((prev) => [...prev, { text: "Verified successfully", type: "success" }, { text: "Routed to correct department", type: "info" }]);
        alert("Complaint Verified & Routed");
        setResult(null);
        setCallActive(false);
      } else {
        setLogs((prev) => [...prev, { text: "Reprocessing requested", type: "warning" }]);
        alert(res.data.message);
        setResult(null);
      }
    } catch (err) {
      setLogs((prev) => [...prev, { text: "Error connecting to server", type: "error" }]);
    }
  };

  const addLogsSequentially = (newLogs, delay = 600) => {
    newLogs.forEach((logObj, index) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, logObj]);
      }, index * delay);
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      
      {/* Main Grid */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ display: "grid", gridTemplateColumns: "320px 1fr 380px", gap: "25px", padding: "0 20px 20px", flex: 1, overflow: "hidden", zIndex: 10 }}
      >
        
        {/* LEFT PANEL */}
        <motion.div variants={itemVariants} className="glass-panel floating" style={{ padding: "25px", display: "flex", flexDirection: "column", animationDelay: "0s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "30px" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }}>
              <Activity color="var(--accent-blue)" />
            </motion.div>
            <h2 style={{ fontSize: "1.2rem", margin: 0 }}>Input Stream</h2>
          </div>

          <VoiceInput setResult={(data) => {
            setResult(data);
            setIsProcessing(false);
            setCallActive(true);
            setLogs([]); 
            addLogsSequentially([
              { text: "Call Intercepted", type: "info" },
              { text: "Audio Stream Received", type: "success" },
              { text: "Processing via Multimodal LLM", type: "warning" },
              { text: "Extracting Dialect & Intent", type: "info" },
              { text: "Synthesizing AI Response", type: "success" },
              { text: "Awaiting Dispatcher Verification", type: "warning" }
            ]);
          }} onProcessStart={() => {
            setIsProcessing(true);
            setResult(null);
          }} />

          <div style={{ marginTop: "auto", paddingTop: "20px", borderTop: "1px solid var(--panel-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: callActive || isProcessing ? "var(--success)" : "var(--text-muted)" }}>
              <motion.div 
                animate={callActive || isProcessing ? { scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ width: "12px", height: "12px", borderRadius: "50%", background: callActive || isProcessing ? "var(--success)" : "var(--text-muted)", boxShadow: callActive || isProcessing ? "0 0 10px var(--success)" : "none" }}
              />
              <span style={{ fontSize: "0.95rem", fontWeight: "600", letterSpacing: "1px" }}>
                {isProcessing ? "Processing Data..." : callActive ? "Live Session Active" : "System Standby"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* CENTER PANEL */}
        <motion.div variants={itemVariants} className="glass-panel floating" style={{ padding: "30px", display: "flex", flexDirection: "column", overflowY: "auto", animationDelay: "1s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "30px", borderBottom: "1px solid var(--panel-border)", paddingBottom: "15px" }}>
            <Radio color="var(--accent-purple)" />
            <h2 style={{ fontSize: "1.4rem", margin: 0 }}>Live Analysis Feed</h2>
          </div>

          {isProcessing ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1 }}>
              <Waveform />
              <motion.h3 animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ marginTop: "20px", color: "var(--accent-indigo)" }}>
                Extracting Intelligence...
              </motion.h3>
            </div>
          ) : !result ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, opacity: 0.3 }}>
              <Zap size={64} style={{ marginBottom: "20px", color: "var(--accent-blue)" }} />
              <h3>Awaiting Input Stream...</h3>
              <p>Record or upload audio to begin processing.</p>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 120 }} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "25px" }}>
                
                {/* Caller Section */}
                <motion.div whileHover={{ scale: 1.01 }} style={{ background: "rgba(0,0,0,0.3)", padding: "20px", borderRadius: "16px", borderLeft: "4px solid var(--accent-blue)", boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)" }}>
                  <p style={{ color: "var(--accent-blue)", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "bold", margin: "0 0 10px 0" }}>Raw Transcript</p>
                  <p style={{ fontSize: "1.15rem", lineHeight: "1.6", margin: 0 }}>"{result.transcript}"</p>
                </motion.div>

                {/* AI Restatement Section */}
                <motion.div whileHover={{ scale: 1.01 }} style={{ background: "rgba(99, 102, 241, 0.15)", padding: "20px", borderRadius: "16px", borderLeft: "4px solid var(--accent-purple)", boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "15px" }}>
                    <p style={{ color: "var(--accent-purple)", fontSize: "0.85rem", textTransform: "uppercase", fontWeight: "bold", margin: 0 }}>AI Synthesized Response</p>
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}><Volume2 size={20} color="var(--accent-purple)" /></motion.div>
                  </div>
                  <p style={{ fontSize: "1.25rem", fontWeight: "500", margin: "0 0 20px 0", color: "white" }}>{result.restated}</p>
                  
                  <audio controls autoPlay style={{ width: "100%", height: "45px", borderRadius: "8px", outline: "none", filter: "invert(1) hue-rotate(180deg) brightness(1.5)" }}>
                    <source src={`${import.meta.env.VITE_API_URL}/audio/${result.audio}`} />
                  </audio>
                </motion.div>

                {/* Action Buttons */}
                <div style={{ marginTop: "auto", display: "flex", gap: "15px", paddingTop: "20px" }}>
                  <motion.button whileHover={{ scale: 1.05, backgroundColor: "rgba(16, 185, 129, 0.2)", boxShadow: "0 0 15px rgba(16, 185, 129, 0.5)" }} whileTap={{ scale: 0.95 }} onClick={() => handleConfirm("YES")} style={{ flex: 1, padding: "16px", borderRadius: "12px", border: "1px solid var(--success)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                    <CheckCircle size={20} /> Verify
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05, backgroundColor: "rgba(245, 158, 11, 0.2)", boxShadow: "0 0 15px rgba(245, 158, 11, 0.5)" }} whileTap={{ scale: 0.95 }} onClick={() => handleConfirm("PARTIAL")} style={{ flex: 1, padding: "16px", borderRadius: "12px", border: "1px solid var(--warning)", color: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                    <HelpCircle size={20} /> Revise
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.05, backgroundColor: "rgba(239, 68, 68, 0.2)", boxShadow: "0 0 15px rgba(239, 68, 68, 0.5)" }} whileTap={{ scale: 0.95 }} onClick={() => handleConfirm("NO")} style={{ flex: 1, padding: "16px", borderRadius: "12px", border: "1px solid var(--danger)", color: "var(--danger)", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                    <ShieldAlert size={20} /> Reject
                  </motion.button>
                </div>

              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>

        {/* RIGHT PANEL */}
        <motion.div variants={itemVariants} className="glass-panel floating" style={{ padding: "25px", display: "flex", flexDirection: "column", animationDelay: "2s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <Cpu color="var(--accent-indigo)" />
            <h2 style={{ fontSize: "1.2rem", margin: 0 }}>Intelligence Metadata</h2>
          </div>

          {result && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ background: "rgba(0,0,0,0.3)", padding: "20px", borderRadius: "16px", marginBottom: "20px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Detected Intent</span>
                <span style={{ fontWeight: "600", color: "var(--accent-blue)" }}>{result.intent}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Dialect Base</span>
                <span style={{ fontWeight: "600", color: "var(--accent-purple)" }}>{result.dialect}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Emotion State</span>
                <span style={{ fontWeight: "600", color: result.emotion.toLowerCase().includes('distress') || result.emotion.toLowerCase().includes('anger') ? "var(--warning)" : "var(--success)" }}>{result.emotion}</span>
              </div>
              
              <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Confidence Score</span>
                  <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5 }} style={{ fontWeight: "700", color: result.confidence < 60 ? "var(--danger)" : "var(--success)" }}>
                    {result.confidence}%
                  </motion.span>
                </div>
                <div style={{ width: "100%", height: "8px", background: "rgba(0,0,0,0.5)", borderRadius: "4px", overflow: "hidden", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }} transition={{ duration: 1.5, type: "spring" }} style={{ height: "100%", background: result.confidence < 60 ? "var(--danger)" : "linear-gradient(90deg, var(--success), #34d399)", boxShadow: "0 0 10px currentColor" }} />
                </div>
                
                {result.confidence < 60 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "15px", padding: "12px", background: "rgba(239,68,68,0.15)", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.4)", display: "flex", alignItems: "center", gap: "10px" }}>
                    <ShieldAlert size={18} color="var(--danger)" />
                    <span style={{ color: "var(--danger)", fontSize: "0.85rem", fontWeight: "700", letterSpacing: "0.5px" }}>ESCALATION RECOMMENDED</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          <h3 style={{ fontSize: "1rem", marginBottom: "15px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Activity size={16} /> Event Timeline
          </h3>
          
          <div style={{ flex: 1, overflowY: "auto", paddingRight: "5px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <AnimatePresence>
              {logs.length === 0 && !result && !isProcessing && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} style={{ color: "var(--text-muted)", fontSize: "0.95rem", textAlign: "center", marginTop: "30px" }}>
                  System initialized.<br/>Waiting for network events...
                </motion.p>
              )}
              {logs.map((log, i) => {
                let bulletColor = "var(--text-muted)";
                if (log.type === "success") bulletColor = "var(--success)";
                if (log.type === "warning") bulletColor = "var(--warning)";
                if (log.type === "error") bulletColor = "var(--danger)";
                if (log.type === "info") bulletColor = "var(--accent-blue)";

                return (
                  <motion.div 
                    key={i} initial={{ opacity: 0, x: 20, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }}
                    style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", background: "rgba(0,0,0,0.2)", borderRadius: "10px", borderLeft: `4px solid ${bulletColor}`, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                  >
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: bulletColor, boxShadow: `0 0 8px ${bulletColor}` }} />
                    <span style={{ color: "var(--text-primary)", fontSize: "0.9rem", fontWeight: "500" }}>{log.text}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={logsEndRef} />
          </div>

        </motion.div>

      </motion.main>
    </div>
  );
}

export default Dashboard;
