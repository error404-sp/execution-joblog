import { useEffect, useReducer } from "react";
import { AppContext, reducer } from "./AppContext";
import { socket } from "../socket";
import type { AgentHealth } from "./AppContext.types";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    jobs: {},
    agentHealth: null,
  });

  useEffect(() => {
    socket.onAny((event, data) => {
      console.log(event);
      console.log(data);
      let time = data.time ? new Date(data.time).toLocaleTimeString() : "";
      if (event.startsWith("job_status_")) {
        const jobId = event.split("job_status_")[1];
        console.log(typeof jobId);
        if (jobId != "undefined") {
          let time = data.time ? new Date(data.time).toUTCString() : "";

          dispatch({
            type: "SET_STATUS",
            jobId,
            status: data.status,
            output: data.output ? data.output : "",
            retries: data.retries ? data.retries : 0,
            updated_at: time ? time : "",
          });
        }
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
