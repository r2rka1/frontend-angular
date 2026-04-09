export type JobStatus = 'pending' | 'running' | 'done' | 'failed';

export interface Job {
  id: string;
  status: JobStatus;
  started_at?: string | null;
  finished_at?: string | null;
  error?: string | null;
}
