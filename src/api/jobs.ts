const apiUrl = "https://joblog-backend-production.up.railway.app";
import { socket } from "../socket";

export const fetchJobs = async (page, limit) => {
  const response = await fetch(
    `${apiUrl}/api/jobs?page=${page || 1}&limit=${limit || 10}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }
  const data = await response.json();
  return data;
};

export async function stopJob(jobId: string) {
  socket.emit("stop_job", jobId);
  const res = await fetch(`${apiUrl}/api/jobs/${jobId}/stop`, {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error(`Failed to stop job ${jobId}`);
  }
  return res.json();
}

export async function fetchJobDetails(jobId: string) {
  const res = await fetch(`${apiUrl}/api/jobs/${jobId}`);
  if (!res.ok) throw new Error("Failed to fetch job details");
  return res.json();
}

export async function createJob(jobData: {
  type: string;
  command: string;
  parameters: any;
  priority: number;
  timeout: number;
}) {
  try {
    const response = await fetch(`${apiUrl}/api/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create job: ${errorText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Create job failed", err);
    throw err;
  }
}
