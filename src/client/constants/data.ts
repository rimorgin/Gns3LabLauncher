import {
  IconDashboard,
  IconUserScreen,
  IconFolder,
  //IconHelp,
  IconUsers,
  IconHeartCog,
  IconCheckupList,
  IconCalendarWeekFilled,
  IconChalkboardTeacher,
  IconMessage2Code,
  IconUsersGroup,
  IconDatabase,
  IconLibrary,
  IconSandbox,
  IconBox,
  IconBuildingLighthouse,
  IconHourglassLow,
} from "@tabler/icons-react";

// Define NavConfig type if not imported from elsewhere
export type NavConfig = {
  main: Array<{ title: string; icon: React.FC }>;
  reports: Array<{ title: string; icon: React.FC }>;
  system: Array<{ title: string; icon: React.FC }>;
  secondary: Array<{ title: string; icon: React.FC }>;
};

export const data = {
  nav: {
    main: [
      {
        title: "Dashboard",
        icon: IconDashboard,
      },
      {
        title: "Users",
        icon: IconUsers,
      },
      {
        title: "User Groups",
        icon: IconUsersGroup,
      },
      {
        title: "Course",
        icon: IconChalkboardTeacher,
      },
      {
        title: "Classroom",
        icon: IconUserScreen,
      },
      {
        title: "Projects",
        icon: IconFolder,
      },
      {
        title: "Labs Library",
        icon: IconLibrary,
      },
      {
        title: "Labs Playground",
        icon: IconSandbox,
      },
      {
        title: "Lab Instances",
        icon: IconBox,
      },
    ],
    /*   documents: [
      {
        name: "Data Library",
        url: "#",
        icon: IconDatabase,
      },
      {
        name: "Reports",
        url: "#",
        icon: IconReport,
      },
      {
        name: "Word Assistant",
        url: "#",
        icon: IconFileWord,
      },
    ], */
    reports: [
      {
        title: "Completions",
        icon: IconCheckupList,
      },
      {
        title: "Calendar",
        icon: IconCalendarWeekFilled,
      },
    ],
    system: [
      {
        title: "Data Library",
        icon: IconDatabase,
      },
      {
        title: "Cron Jobs",
        icon: IconHourglassLow,
      },
      {
        title: "System Health",
        icon: IconHeartCog,
      },
      {
        title: "System Logs",
        icon: IconMessage2Code,
      },
    ],
    secondary: [
      /* {
        title: "Get Help",
        icon: IconHelp,
      }, */
      {
        title: "Tutorials",
        icon: IconBuildingLighthouse,
      },
    ],
  } satisfies NavConfig,

  navItemsByRole: {
    administrator: [
      "Dashboard",
      "Users",
      "User Groups",
      "Course",
      "Classroom",
      "Projects",
      "Labs Library",
      "Labs Playground",
      "Lab Instances",
      //"Completions",
      "Calendar",
      "Data Library",
      "Cron Jobs",
      "System Health",
      "System Logs",
    ],
    instructor: [
      "Dashboard",
      "Users",
      "User Groups",
      "Course",
      "Classroom",
      "Projects",
      "Labs Library",
      "Labs Playground",
      "Lab Instances",
      //"Completions",
      "Calender",
    ],
    student: ["Classroom", "Completions", "Calendar"],
  },
};
