import PageMeta from "@clnt/components/common/page-meta";
import FullCalendar from "../common/calendar";

const CalendarContent = () => {
  return (
    <>
      <PageMeta title="Calendar" description="Calendar Dashboard page" />
      <div className="w-full h-full bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <FullCalendar />
      </div>
    </>
  );
};

export default CalendarContent;
