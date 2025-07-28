import "./App.css";
import JobManager from "./components/JobManager";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-blue-600 text-white p-4 shadow">
        <h2 className="text-lg font-semibold mb-4">
          Remote Job Execution System
        </h2>
      </header>
      <main className="p-6">
        <JobManager />
      </main>
    </div>
  );
}
