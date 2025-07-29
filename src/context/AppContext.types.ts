// export interface Job {
//   id: string;
//   status: string;
//   logs?: string[];
//   output?: string;
//   updated_at: string;
//   retries?: number;
// }

// export type State = {
//   jobs: Record<string, Job>;
//   agentHealth: AgentHealth | null;
//   globalLogs: GlobalLogs[];
// };

// export interface AgentHealth {
//   agentId: string;
//   memory: number;
//   timestamp: string;
// }

// export interface GlobalLogs {
//   time?: string;
//   log: any;
//   jobId: string;
// }

// export type Action =
//   | {
//       type: "SET_STATUS";
//       jobId: string;
//       status: string;
//       output?: string;
//       retries?: number;
//       updated_at: string;
//       log?: any;
//     }
//   | { type: "ADD_LOG"; jobId: string; log: string; time?: string }
//   | { type: "INIT_JOB"; job: Job }
//   | { type: "SET_AGENT_HEALTH"; health: AgentHealth }
//   | { type: "CLEAR_JOBS"; globalLogs: GlobalLogs[] };
