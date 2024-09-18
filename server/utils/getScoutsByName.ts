import prisma from "../database/db";

export default async function getScoutByName(name: string) {
  try {
    const scouts = await prisma.scout.findUnique({
      where: {
        name,
      },
    });
    return scouts;
  } catch (error) {
    console.log(error);
    return null;
  }
}
