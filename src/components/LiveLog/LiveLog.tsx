import { useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import "./LiveLog.css";

export default function LiveLog() {
  const { state } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [state.globalLogs]);
  console.log(state.globalLogs);

  return (
    <div className="live-log-container" ref={containerRef}>
      {state.globalLogs.length === 0 ? (
        <div className="log-line empty">No logs yet...</div>
      ) : (
        state.globalLogs.map((entry, idx) => (
          <div key={idx} className="log-line">
            <span className="log-time">{entry.time}</span>
            <span className="log-job">[{entry.jobId.slice(0, 8)}]</span>
            <span className="log-text">{entry.log}</span>
          </div>
        ))
      )}
    </div>
  );
}
