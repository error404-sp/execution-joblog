import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { fetchJobs } from "../api/jobs";
import { JobTile } from "./JobTile";

export default function JobManager() {
  const { state, dispatch } = useApp();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  async function loadJobs(currentPage: number) {
    setLoading(true);
    try {
      const data = await fetchJobs(currentPage, 10);

      setTotalPages(data.totalPages);

      data.jobs.forEach((job: any) => {
        dispatch({
          type: "INIT_JOB",
          job: { ...job, output: "", retries: 0, logs: [] },
        });
      });
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs(page);
  }, [page, dispatch]);

  return (
    <>
      <div className="table-container">
        <table className="jobs-table">
          <thead>
            <tr>
              <th>Job id</th>
              <th>Command/Script</th>
              <th>Priority</th>
              <th>timeout</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Stop</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center">
                  Loading jobs...
                </td>
              </tr>
            ) : (
              Object.values(state.jobs)
                .slice((page - 1) * 10, page * 10)
                .map((job) => <JobTile job={job} />)
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="pagination-container">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="pagination-btn"
        >
          Prev
        </button>
        <span className="pagination-text">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </>
  );
}
