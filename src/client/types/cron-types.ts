export interface ICronJob {
  id: string;
  key: string;
  name: string;
  enabled: boolean;
  schedule: string;
  updatedAt: string | Date;
  createdAt: string | Date;
}
