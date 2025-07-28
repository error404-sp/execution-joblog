import { useApp } from "../context/AppContext";
import { stopJob } from "../api/jobs";
import "./JobTile.css";
import { delayedStatusUpdate } from "../context/AppProvider";

interface JobTileProps {
  job: {
    id: string;
    command: string;
    priority: string;
    timeout: number;
    status: string;
    retries?: number;
    output?: string;
    time?: string;
  };
}

export const JobTile: React.FC<JobTileProps> = ({ job }) => {
  const { state, dispatch } = useApp();
  const latestJob = state.jobs[job.id] || job;

  // Retry logic: if failed and retries < 3 → display retrying
  const displayStatus =
    latestJob.status === "failed" && (latestJob.retries || 0) < 3
      ? "retrying"
      : latestJob.status;

  const handleClick = () => {
    console.log("Job clicked:", latestJob.id);
    // TODO: Navigate to details or open modal
  };

  const handleStop = async (e: React.MouseEvent) => {
    e.stopPropagation();

    delayedStatusUpdate(dispatch, {
      type: "SET_STATUS",
      jobId: latestJob.id,
      status: "stopping",
    });

    try {
      await stopJob(latestJob.id);
    } catch (err) {
      console.error("Stop job failed:", err);

      delayedStatusUpdate(dispatch, {
        type: "SET_STATUS",
        jobId: latestJob.id,
        status: latestJob,
      });
    }
  };

  // Disable Stop button for completed or final failed jobs
  const disableStop =
    displayStatus === "completed" || displayStatus === "failed";

  return (
    <tr onClick={handleClick} className="job-row">
      <td>{latestJob.id}</td>
      <td>{latestJob?.command}</td>
      <td>{latestJob?.priority}</td>
      <td>{latestJob?.timeout}s</td>
      <td className={`status ${displayStatus}`}>
        {displayStatus}
        {/* Show retry count if retrying */}
        {displayStatus === "retrying" && (
          <span className="retry-count"> ({latestJob.retries || 0}/3)</span>
        )}
      </td>
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
            width="32"
            height="32"
            fill="currentColor"
          >
            <rect x="6" y="6" width="12" height="12" />
          </svg>
        </button>
      </td>
    </tr>
  );
};
