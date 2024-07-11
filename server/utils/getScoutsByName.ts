import prisma from "../database/db";

export default async function getScoutByName(name: string) {
  try {
    let searchConditions: string[] = [];
    name.split(" ").forEach((searchTerm, index) => {
      searchConditions.push(
        `lower(concat(U."firstName", U."middleName", U."lastName")) like '%${searchTerm}%' ${
          index + 1 === name?.split(" ").length ? "" : "AND"
        }`,
      );
    });
    const scouts = await prisma.$queryRawUnsafe(
      `SELECT U.* FROM public."Scout" U WHERE (${searchConditions.join(" ")});`,
    );
    return scouts;
  } catch (error) {
    console.log(error);
    return null;
  }
}
