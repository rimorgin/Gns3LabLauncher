export class CronKeyNotFound extends Error {
  constructor() {
    super("the cron key is not found");
    this.name = "CronKeyNotFound";
  }
}
