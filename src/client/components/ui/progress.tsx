import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@clnt/lib/utils";

const colorMap: Record<string, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  destructive: "bg-destructive",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  info: "bg-blue-500",
};

type IndicatorColor = keyof typeof colorMap | string;

function Progress({
  className,
  indicatorColor = "primary",
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  indicatorColor?: IndicatorColor;
}) {
  const indicatorClass =
    colorMap[indicatorColor] ?? indicatorColor ?? "bg-primary";

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(indicatorClass, "h-full w-full flex-1 transition-all")}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
