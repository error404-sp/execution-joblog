import { useEffect, useReducer } from "react";
import { AppContext, reducer } from "./AppContext";
import { socket } from "../socket";
import type { AgentHealth } from "./AppContext.types";

export function delayedStatusUpdate(
  dispatch: any,
  jobId: string,
  status: string,
  output?: string,
  retries?: number,
  time: string
) {
  setTimeout(() => {
    dispatch({
      type: "SET_STATUS",
      jobId,
      status,
      output: data.output ? data.output : "",
      retries: data.retries ? data.retries : 0,
      time,
    });
  }, 2000);
}
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    jobs: {},
    agentHealth: null,
  });

  useEffect(() => {
    socket.onAny((event, data) => {
      let time = data.time ? new Date(data.time).toLocaleTimeString() : "";
      if (event.startsWith("job_status_")) {
        const jobId = event.split("job_status_")[1];
        let time = data.time ? new Date(data.time).toUTCString() : "";

        delayedStatusUpdate(dispatch, data.id, data.status, data.output);
      }
      if (event == "log") {
        dispatch({ type: "ADD_LOG", jobId: data.jobId, log: data.log, time });
      }
    });

    // Listen to agent health updates
    socket.on("agent_health", (health: AgentHealth) => {
      dispatch({ type: "SET_AGENT_HEALTH", health });
    });

    return () => {
      socket.offAny();
      socket.off("agent_health");
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
