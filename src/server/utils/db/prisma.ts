import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  errorFormat: "pretty",
  log: ["warn", "error"],
});
/* 
// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
}); */

export default prisma;
