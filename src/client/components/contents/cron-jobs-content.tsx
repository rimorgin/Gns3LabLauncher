import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@clnt/components/ui/card";
import { Label } from "@clnt/components/ui/label";
import { Switch } from "@clnt/components/ui/switch";
import { ClockIcon } from "lucide-react";
import { useCronJobsQuery } from "@clnt/lib/queries/cron-jobs-query";
import { useToggleCronJobMutation } from "@clnt/lib/mutations/cron-jobs/cron-jobs-toggle-mutation";
import { ICronJob } from "@clnt/types/cron-types";
import cronstrue from "cronstrue";
import Loader from "../common/loader";

export default function CronJobsContent() {
  const { data: cronJobs, isLoading } = useCronJobsQuery();
  const toggleCronJob = useToggleCronJobMutation();

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col">
      <main className="flex flex-1 flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cronJobs?.map((job: ICronJob) => (
            <Card key={job.id}>
              <CardHeader>
                <CardTitle>{job.name}</CardTitle>
                <CardDescription>
                  {job.key} – Runs at {job.schedule}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid gap-2">
                  <Label>Schedule</Label>
                  <div className="text-sm">{job.schedule}</div>
                  <div className="text-xs text-muted-foreground italic">
                    Runs at{" "}
                    {cronstrue.toString(job.schedule, {
                      use24HourTimeFormat: false, // enables AM/PM
                      verbose: true, // enables "only on Friday", etc.
                    })}{" "}
                    (based on server timezone)
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Last updated: {new Date(job.updatedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id={job.id}
                      checked={job.enabled}
                      onCheckedChange={(checked) => {
                        toggleCronJob.mutate({
                          key: job.key,
                          enabled: checked,
                        });
                      }}
                    />
                    <Label htmlFor={job.id} className="cursor-pointer">
                      Enabled
                    </Label>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
