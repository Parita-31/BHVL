import { useState, useRef } from "react";
import { processAudio } from "../services/api";
import { Mic, Square, UploadCloud, Send } from "lucide-react";
import { motion } from "framer-motion";

function VoiceInput({ setResult }) {
  const [file, setFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    setFile(null); // reset old file

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();
      setRecording(true);

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setFile(audioBlob);
        audioChunksRef.current = [];
      };
    } catch (err) {
      console.error("Mic access error:", err);
      alert("Microphone access is required to record.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please record or upload an audio file first.");
      return;
    }
    
    setProcessing(true);
    try {
      const data = await processAudio(file);
      setResult(data);
    } catch (err) {
      console.error("Error processing audio:", err);
      alert("Failed to process audio.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      
      {/* File Upload Area */}
      <div 
        style={{
          border: "2px dashed var(--panel-border)",
          borderRadius: "12px",
          padding: "20px",
          textAlign: "center",
          transition: "border-color 0.3s ease",
          cursor: "pointer",
          position: "relative"
        }}
        onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--accent-blue)"}
        onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--panel-border)"}
      >
        <UploadCloud size={32} color="var(--text-muted)" style={{ marginBottom: "10px" }} />
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: 0 }}>
          {file && !recording ? file.name || "Audio recorded ready to process" : "Click to upload audio file"}
        </p>
        <input 
          type="file" 
          accept="audio/*"
          onChange={(e) => setFile(e.target.files[0])} 
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            opacity: 0, cursor: "pointer"
          }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ height: "1px", background: "var(--panel-border)", flex: 1 }}></div>
        <span style={{ margin: "0 10px", color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: "600" }}>OR RECORD</span>
        <div style={{ height: "1px", background: "var(--panel-border)", flex: 1 }}></div>
      </div>

      {/* Mic Controls */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", padding: "10px 0" }}>
        <motion.button
          whileHover={{ scale: recording ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={recording ? stopRecording : startRecording}
          className={recording ? "pulse-animation" : ""}
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: recording ? "rgba(239, 68, 68, 0.2)" : "var(--panel-border)",
            border: `2px solid ${recording ? "var(--danger)" : "transparent"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: recording ? "var(--danger)" : "var(--text-primary)",
            transition: "all 0.3s ease"
          }}
        >
          {recording ? <Square size={32} fill="currentColor" /> : <Mic size={32} />}
        </motion.button>
      </div>

      {/* Process Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={processing || (!file && !recording)}
        style={{
          background: processing ? "var(--text-muted)" : "linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-indigo) 100%)",
          color: "#fff",
          padding: "16px",
          borderRadius: "12px",
          fontWeight: "600",
          fontSize: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          opacity: (!file && !recording) ? 0.5 : 1,
          cursor: (!file && !recording) || processing ? "not-allowed" : "pointer",
          boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)"
        }}
      >
        <Send size={20} />
        {processing ? "Processing Intelligence..." : "Process Audio"}
      </motion.button>

    </div>
  );
}

export default VoiceInput;