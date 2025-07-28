const BACKEND_URL = "https://joblog-backend-production.up.railway.app";

export const fetchJobs = async (page, limit) => {
  const response = await fetch(
    `${BACKEND_URL}/api/jobs?page=${page || 1}&limit=${limit || 10}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }
  const data = await response.json();
  return data;
};

export async function stopJob(jobId: string) {
  const res = await fetch(`${BACKEND_URL}/api/jobs/${jobId}/stop`, {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error(`Failed to stop job ${jobId}`);
  }
  return res.json();
}
