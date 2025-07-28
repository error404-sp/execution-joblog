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
      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr>
              <th>Job id</th>
              <th>Command/Script</th>
              <th>Priority</th>
              <th>timeout</th>
              <th>Status</th>
              <th>Status</th>
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
              Object.keys(state.jobs).map((jobId) => (
                <JobTile key={jobId} job={state.jobs[jobId]} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  );
}
