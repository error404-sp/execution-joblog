import { useState } from "react";
import { useApp } from "../../context/AppContext";
import "./JobInput.css";
import { createJob } from "../../api/jobs";

export default function JobInput({
  onJobCreated,
}: {
  onJobCreated?: () => void;
}) {
  const { dispatch } = useApp();

  const [formData, setFormData] = useState({
    type: "command",
    command: "",
    parameters: "",
    priority: 1,
    timeout: 60,
  });
  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const paramsObj =
        formData.parameters.trim() !== ""
          ? JSON.parse(formData.parameters)
          : null;

      const job = await createJob({
        ...formData,
        parameters: paramsObj,
      });

      dispatch({
        type: "INIT_JOB",
        job: { ...job, status: "queued", output: "", retries: 0, logs: [] },
      });

      setFormData({
        type: "command",
        command: "",
        parameters: "",
        priority: 0,
        timeout: 60,
      });

      if (onJobCreated) onJobCreated();
    } catch (err) {
      console.error("Failed to create job", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="create-job-toolbar-vertical" onSubmit={handleSubmit}>
      {/* Type + Command textarea full-width */}
      <div className="row">
        <select
          value={formData.type}
          onChange={(e) => updateField("type", e.target.value)}
          className="toolbar-select"
        >
          <option value="command">Command</option>
          <option value="script">Script</option>
        </select>

        <textarea
          className="toolbar-command-textarea-full"
          placeholder={
            formData.type === "command" ? "Enter command..." : "Enter script..."
          }
          value={formData.command}
          onChange={(e) => updateField("command", e.target.value)}
          rows={2}
          required
        />
      </div>

      {/* Other inputs */}
      <div className="row">
        <input
          type="text"
          className="toolbar-input"
          placeholder="Parameters (JSON)"
          value={formData.parameters}
          onChange={(e) => updateField("parameters", e.target.value)}
        />

        <div className="input-with-icon">
          <span className="icon">⚡</span>
          <input
            type="number"
            min={0}
            max={10}
            className="toolbar-input small"
            title="Priority"
            value={formData.priority}
            onChange={(e) => updateField("priority", Number(e.target.value))}
          />
        </div>

        <div className="input-with-icon">
          <span className="icon">⏱️</span>
          <input
            type="number"
            min={10}
            className="toolbar-input small"
            title="Timeout (s)"
            value={formData.timeout}
            onChange={(e) => updateField("timeout", Number(e.target.value))}
          />
        </div>

        <button
          type="submit"
          className="toolbar-btn"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Executing..." : "Execute"}
        </button>
      </div>
    </form>
  );
}
