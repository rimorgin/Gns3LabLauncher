import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  errorFormat: "pretty"
}).$extends({
  model: {
    user: {
      async safeUpdate(args: Prisma.UserUpdateArgs) {
        const allowedFields = ["password"];
        const updatedFields = Object.keys(args.data ?? {});

        const disallowed = updatedFields.filter((field) => !allowedFields.includes(field));
        if (disallowed.length > 0) {
          throw new Error("❌ Only 'password' can be updated on the User model.");
        }

        return prisma.user.update(args).then(({ password, ...rest }) => rest);
      },
      async safeCreate(args: Prisma.UserCreateArgs) {
        const result = await prisma.user.create(args);
        const { password, ...rest } = result;
        return rest;
      },
      async safeFindUnique(args: Prisma.UserFindUniqueArgs) {
        const result = await prisma.user.findUnique(args);
        if (!result) return null;
        const { password, ...rest } = result;
        return rest;
      },
      async safeFindMany(args: Prisma.UserFindManyArgs) {
        const result = await prisma.user.findMany(args);
        return result.map(({ password, ...rest }) => rest);
      },
    },
  },
});

export default prisma;
