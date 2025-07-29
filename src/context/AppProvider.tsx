import { useEffect, useReducer } from "react";
import { AppContext, reducer } from "./AppContext";
import { socket } from "../socket";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    jobs: {},
    agentHealth: null,
    globalLogs: [],
  });

  useEffect(() => {
    socket.onAny((event: any, data: any) => {
      let time = data.time ? new Date(data.time).toLocaleTimeString() : "";
      if (event.startsWith("job_status_")) {
        const jobId = event.split("job_status_")[1];

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

    return () => {
      socket.offAny();
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
