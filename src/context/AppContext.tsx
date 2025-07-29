import React, { createContext, useContext } from "react";
import type { Action, State } from "./AppContext.types";

export const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: { jobs: {}, agentHealth: null },
  dispatch: () => {},
});

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INIT_JOB":
      return {
        ...state,
        jobs: { ...state.jobs, [action.job.id]: action.job },
      };
    case "SET_STATUS":
      return {
        ...state,
        jobs: {
          ...state.jobs,
          [action.jobId]: {
            ...state.jobs[action.jobId],
            status: action.status,
            output: action.output || state.jobs[action.jobId]?.output,
            logs: [...(state.jobs[action.jobId]?.logs || []), action.log],
            retries: action.retries,
          },
        },
      };
    case "ADD_LOG":
      return {
        ...state,
        jobs: {
          ...state.jobs,
          [action.jobId]: {
            ...state.jobs[action.jobId],
            logs: [...(state.jobs[action.jobId]?.logs || []), action.log],
          },
        },
        globalLogs: [...state.globalLogs, { ...action }],
      };
    case "SET_AGENT_HEALTH":
      return { ...state, agentHealth: action.health };
    case "CLEAR_JOBS":
      return { ...state, jobs: {} };

    default:
      return state;
  }
}
export function useApp() {
  return useContext(AppContext);
}
