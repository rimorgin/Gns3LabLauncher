export interface ICronJob {
  id: string;
  key: string;
  name: string;
  description?: string;
  enabled: boolean;
  schedule: string;
  updatedAt: string | Date;
  createdAt: string | Date;
}
