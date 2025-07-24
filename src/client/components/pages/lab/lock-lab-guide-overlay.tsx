import { useEffect, useState, useRef } from "react";
import { LockIcon } from "lucide-react";

export function LockLabGuideOverlay({
  isLabRunning,
}: {
  isLabRunning: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState(0);

  useEffect(() => {
    if (!isLabRunning && containerRef.current) {
      const containerHeight = containerRef.current.offsetHeight;
      const rowHeight = 700; // approx height of one lock+text block
      setRows(Math.ceil(containerHeight / rowHeight));
    }
  }, [isLabRunning]);

  if (isLabRunning) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm overflow-hidden flex flex-col rounded-xl"
    >
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center justify-center flex-1 text-gray-500"
        >
          <LockIcon className="h-10 w-10" />
          <p className="text-lg mt-4 text-center">
            Start the lab instance to access the guide.
          </p>
        </div>
      ))}
    </div>
  );
}
