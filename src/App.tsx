import "./App.css";
import JobManager from "./components/JobManager";
import JobInput from "./components/JobInput/JobInput";
import { useRef } from "react";
import LiveLog from "./components/LiveLog/LiveLog";

export default function App() {
  const jobManagerRef = useRef<any>();

  const handleJobCreated = () => {
    // Force refresh so new jobs are guaranteed to appear
    jobManagerRef.current?.refreshJobs();
  };
  return (
    <div>
      <header>
        <h2 className="text-lg font-semibold mb-4">
          Remote Job Execution System
        </h2>
      </header>
      <main className="p-6">
        <JobInput onJobCreated={handleJobCreated} />
        <LiveLog />
        <JobManager ref={jobManagerRef} />
      </main>
    </div>
  );
}
