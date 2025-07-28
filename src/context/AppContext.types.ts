export interface Job {
  id: string;
  status: string;
  logs?: string[];
  output?: string;
  updated_at: string;
  retries?: number;
}

export type State = {
  jobs: Record<string, Job>;
  agentHealth: AgentHealth | null;
};

export interface AgentHealth {
  agentId: string;
  workers: number;
  queueLength: number;
  memory: number;
  timestamp: string;
}

export type Action =
  | {
      type: "SET_STATUS";
      jobId: string;
      status: string;
      output?: string;
      time: string;
      retries?: number;
    }
  | { type: "ADD_LOG"; jobId: string; log: string; time?: string }
  | { type: "INIT_JOB"; job: Job }
  | { type: "SET_AGENT_HEALTH"; health: AgentHealth };
