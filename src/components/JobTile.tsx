import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { stopJob } from "../api/jobs";
import { timeAgo, truncateText } from "../helpers/helper";
import "./JobManager.css";

interface JobTileProps {
  job: any;
}

export const JobTile: React.FC<JobTileProps> = ({ job: initialJob }) => {
  const { state, dispatch } = useApp();
  const [job, setJob] = useState(initialJob);
  let timer;

  // Update when the job's data in state changes (status, retries, updated_at etc.)
  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }

    // status update
    const updatedJob = state.jobs[job.id];

    if (updatedJob && updatedJob.status !== job.status) {
      timer = setTimeout(() => {
        setJob(updatedJob);
      }, 1000);
    }
  }, [state.jobs]);

  const displayStatus = job.status;

  // Click handler (for navigation or modal)
  const handleClick = () => {
    // TODO: Add navigation or modal logic
  };

  // Stop job handler
  const handleStop = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Update status immediately to "stopping"
    dispatch({
      type: "SET_STATUS",
      jobId: job.id,
      status: "stopping",
      updated_at: job.updated_at,
    });

    try {
      await stopJob(job.id);
    } catch (err) {
      console.error("Stop job failed:", err);
    }
  };

  const disableStop =
    displayStatus === "completed" || displayStatus === "failed";

  const formattedTime = timeAgo(job.updated_at);

  return (
    <tr onClick={handleClick} className="job-row">
      <td>{truncateText(job.id, 10)}</td>
      <td className="job-command" title={job.command}>
        {truncateText(job.command, 25)}
      </td>
      <td>{job.priority}</td>
      <td>{job.timeout}s</td>
      <td className={`status ${displayStatus}`}>
        {displayStatus}
        {displayStatus === "retrying" && (
          <span className="retry-count"> ({job.retries || 0}/3)</span>
        )}
      </td>
      <td>{formattedTime}</td>
      <td>
        <button
          className="stop-btn"
          onClick={handleStop}
          title="Stop Job"
          disabled={disableStop}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
          >
            <rect x="6" y="6" width="32" height="32" />
          </svg>
        </button>
      </td>
    </tr>
  );
};
