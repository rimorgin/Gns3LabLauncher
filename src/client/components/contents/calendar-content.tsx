import PageMeta from "@clnt/components/common/page-meta";
import FullCalendar from "../common/calendar";

const CalendarContent = () => {
  return (
    <>
      <PageMeta title="Calendar" description="Calendar Dashboard page" />
      <div className="w-full h-full">
        <FullCalendar />
      </div>
    </>
  );
};

export default CalendarContent;
