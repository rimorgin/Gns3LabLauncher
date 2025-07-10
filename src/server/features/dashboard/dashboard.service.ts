import prisma from "@srvr/utils/db/prisma.ts";

function calculateTrend(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
}

export async function getDashboardSummaryMetrics() {
  const now = new Date();

  const startOfThisMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  );
  const startOfLastMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1),
  );

  const [
    activeClassrooms,
    totalStudents,
    totalInstructors,
    totalOnlineStudents,
    totalOnlineInstructors,
    currentSubmissions,
    previousSubmissions,
    currentProjectsInProgress,
    previousProjectsInProgress,
    currentAvgProgress,
    previousAvgProgress,
  ] = await Promise.all([
    prisma.classroom.count({ where: { status: "active" } }),
    prisma.student.count(),
    prisma.instructor.count(),
    prisma.student.count({ where: { isOnline: true } }),
    prisma.instructor.count({ where: { isOnline: true } }),

    prisma.submission.count({
      where: { submittedAt: { gte: startOfThisMonth } },
    }),
    prisma.submission.count({
      where: {
        submittedAt: { gte: startOfLastMonth, lt: startOfThisMonth },
      },
    }),

    prisma.progress.count({
      where: { status: "in-progress", updatedAt: { gte: startOfThisMonth } },
    }),
    prisma.progress.count({
      where: {
        status: "in-progress",
        updatedAt: { gte: startOfLastMonth, lt: startOfThisMonth },
      },
    }),

    prisma.progress.aggregate({
      where: { updatedAt: { gte: startOfThisMonth } },
      _avg: { percent: true },
    }),
    prisma.progress.aggregate({
      where: { updatedAt: { gte: startOfLastMonth, lt: startOfThisMonth } },
      _avg: { percent: true },
    }),
  ]);

  return {
    activeClassrooms: { value: activeClassrooms, trend: null }, // static
    totalStudents: { value: totalStudents, trend: null }, // static
    totalInstructors: { value: totalInstructors, trend: null }, // static
    submissionsThisMonth: {
      value: currentSubmissions,
      trend: calculateTrend(currentSubmissions, previousSubmissions),
    },
    projectsInProgress: {
      value: currentProjectsInProgress,
      trend: calculateTrend(
        currentProjectsInProgress,
        previousProjectsInProgress,
      ),
    },
    avgProgress: {
      value: currentAvgProgress._avg.percent ?? 0,
      trend: calculateTrend(
        currentAvgProgress._avg.percent ?? 0,
        previousAvgProgress._avg.percent ?? 0,
      ),
    },
    totalOnlineUsers: {
      value: totalOnlineStudents + totalOnlineInstructors,
      trend: null, // static
    },
  };
}
export async function getDashboardOnlineUsersTimeSeries() {
  const onlineCountsByDate = await prisma.$queryRaw<
    {
      date: Date;
      students_online: bigint;
      instructors_online: bigint;
    }[]
  >`
    SELECT DATE_TRUNC('day', "lastActiveAt") AS date,
          SUM(CASE WHEN "isOnline" AND role = 'student' THEN 1 ELSE 0 END) AS students_online,
          SUM(CASE WHEN "isOnline" AND role = 'instructor' THEN 1 ELSE 0 END) AS instructors_online
    FROM (
      SELECT "userId", "isOnline", "lastActiveAt", 'student' AS role FROM "Student"
      UNION ALL
      SELECT "userId", "isOnline", "lastActiveAt", 'instructor' AS role FROM "Instructor"
    ) AS users
    WHERE "lastActiveAt" IS NOT NULL
    GROUP BY DATE_TRUNC('day', "lastActiveAt")
    ORDER BY date;
  `;

  return onlineCountsByDate.map((row) => ({
    date: row.date,
    students_online: Number(row.students_online),
    instructors_online: Number(row.instructors_online),
  }));
}
