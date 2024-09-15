import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import newWeekScheduler from "./scheduler";

dotenv.config();

console.log("==== DB CONFIG ====");
console.log({
  URL: process.env.DATABASE_URL,
});

const basePrisma = new PrismaClient();

const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      $allOperations({ model, operation, args, query }) {
        if (operation.match(/^(find|update|upsert)|aggregate|groupBy/)) {
          if (model === "Scout") {
            if ("where" in args) {
              args.where = { ...args.where, expelled: false };
            } else if (!operation.match(/^create/)) {
              args = { ...args, where: { expelled: false } };
            }
          } else if (
            [
              "Sector",
              "ActivityAttendance",
              "Report",
              "ScoutAttendance",
              "ScoutScore",
            ].includes(model) &&
            !operation.match(/aggregate|groupBy/)
          ) {
            if ("include" in args) {
              if (
                args.include &&
                "Scout" in args.include &&
                typeof args.include.Scout === "object"
              ) {
                if (
                  "where" in args.include.Scout &&
                  typeof args.include.Scout.where === "object"
                ) {
                  args.include = {
                    ...args.include,
                    Scout: {
                      ...args.include.Scout,
                      where: { ...args.include.Scout.where, expelled: false },
                    },
                  };
                } else {
                  args.include = {
                    ...args.include,
                    Scout: {
                      ...args.include.Scout,
                      where: { expelled: false },
                    },
                  };
                }
              } else {
                args.include = {
                  ...args.include,
                  Scout: { where: { expelled: false } },
                };
              }
            } else {
              args = {
                ...args,
                include: { Scout: { where: { expelled: false } } },
              };
            }
          }
        }
        return query(args);
      },
    },
  },
});

try {
  newWeekScheduler.start();
} catch (error) {
  console.error(error);
}

export { prisma, basePrisma };
export default prisma;
