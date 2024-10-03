import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

console.log("==== DB CONFIG ====");
console.log({
  URL: process.env.DATABASE_URL,
});

function processScoutInclude(scoutInclude: any) {
  if (scoutInclude && typeof scoutInclude === "object") {
    if (scoutInclude.where && typeof scoutInclude.where === "object") {
      return {
        ...scoutInclude,
        where: { ...scoutInclude.where, expelled: false },
      };
    }
    return { ...scoutInclude, where: { expelled: false } };
  }
  return { where: { expelled: false } };
}

function handleScoutInclusion(args: any) {
  if ("include" in args) {
    args.include = {
      ...args.include,
      Scout: processScoutInclude(args.include.Scout),
    };
  } else {
    args = {
      ...args,
      include: { Scout: { where: { expelled: false } } },
    };
  }
  return args;
}

const scoutInclusionModels = [
  "Sector",
  "ActivityAttendance",
  "Report",
  "ScoutAttendance",
  "ScoutScore",
];
const NotAllowedOperations = ["findUnique", "update"];
const prisma = new PrismaClient().$extends({
  query: {
    $allModels: {
      $allOperations({ model, operation, args, query }) {
        if (
          operation.match(/^(find|update|upsert)|aggregate|groupBy/) &&
          !NotAllowedOperations.includes(operation) &&
          model === "Scout"
        ) {
          if ("where" in args) {
            args.where = { ...args.where, expelled: false };
          } else if (!operation.match(/^create/)) {
            args = { ...args, where: { expelled: false } };
          }
        }

        if (scoutInclusionModels.includes(model) && operation.match(/^find/)) {
          args = handleScoutInclusion(args);
        }

        return query(args);
      },
    },
  },
});

export { prisma };
export default prisma;
