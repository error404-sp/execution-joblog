import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { fetchJobDetails } from "../api/jobs";
import "./JobDetails.css";

export default function JobDetails() {
  const { jobId } = useParams();
  const { state, dispatch } = useApp();

  const [job, setJob] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [output, setOutput] = useState<any>("");
  const [error, setError] = useState("");

  // Fallback to context state first
  useEffect(() => {
    if (jobId && state.jobs[jobId]) {
      setJob(state.jobs[jobId]);
      setLogs(state.jobs[jobId].logs || []);
      setOutput(state.jobs[jobId].output || "");
    }
  }, [jobId, state.jobs]);

  // Fetch from API
  useEffect(() => {
    async function loadData() {
      if (!jobId) return;
      setError("");

      try {
        const result = await fetchJobDetails(jobId);
        const { job: jobData } = result;

        if (jobData) {
          const { job, output, log } = jobData;

          // Normalize logs and output
          const normalizedLogs = Array.isArray(log)
            ? log
            : log
            ? Object.values(log)
            : [];

          const normalizedOutput =
            typeof output === "object"
              ? output?.output || JSON.stringify(output, null, 2)
              : output || "";

          setJob(job);
          setLogs(normalizedLogs);
          setOutput(normalizedOutput ? normalizedLogs : null);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to fetch latest data, showing cached results");
      } finally {
      }
    }

    loadData();
  }, [jobId, dispatch]);
  if (!job) {
    return (
      <div className="job-details-container">
        <p>No job data found</p>
      </div>
    );
  }

  return (
    <div className="job-details-container">
      <h2>Job Details</h2>
      {error && <div className="error">{error}</div>}

      <div className="job-section">
        <p>
          <strong>ID:</strong> {job.id}
        </p>
        <p>
          <strong>Type:</strong> {job.type}
        </p>
        <p>
          <strong>Command:</strong>
          <span
            className={`command-readonly ${
              job.type === "script" ? "scrollable-command" : ""
            }`}
          >
            {job.command}
          </span>
        </p>
        <p>
          <strong>Status:</strong>
          <span className={`status ${job.status}`}>{job.status}</span>
        </p>

        <p>
          <strong>Priority:</strong> {job.priority}
        </p>
        <p>
          <strong>Timeout:</strong> {job.timeout}s
        </p>
        {job.parameters ? (
          <p>
            <strong>Parameters:</strong>
            <span className="command-readonly">
              {typeof job.parameters === "object"
                ? JSON.stringify(job.parameters, null, 2)
                : job.parameters}
            </span>
          </p>
        ) : (
          <p>
            <strong>Parameters:</strong> <em>-</em>
          </p>
        )}
        <p>
          <strong>Created:</strong> {new Date(job.created_at).toLocaleString()}
        </p>
        <p>
          <strong>Updated:</strong> {new Date(job.updated_at).toLocaleString()}
        </p>
      </div>

      {/* Output */}
      <div className="job-section">
        <h3>Output:</h3>
        <pre className="output-box">
          {typeof output === "object"
            ? JSON.stringify(output, null, 2)
            : output || "No output yet..."}
        </pre>
      </div>

      {/* Logs */}
      {/* Logs */}
      <div className="job-section">
        <h3>Logs:</h3>
        {logs?.length > 0 || job.logs?.length > 0 ? (
          <pre className="logs-terminal">
            {(logs.length > 0 ? logs : job.logs).map((log: any) => {
              const line =
                typeof log === "object"
                  ? `[${log.created_at}] : ${log.log}`
                  : log;
              return `> ${line}\n`;
            })}
          </pre>
        ) : (
          <p>No logs available</p>
        )}
      </div>
    </div>
  );
}
