import prisma from "../database/db";

interface GetScoutByNameFilters {
  sectorBaseName?: string;
  sectorSuffixName?: string;
  unitCaptainId?: number;
};

export default async function getScoutByName(name: string, filters: GetScoutByNameFilters) {
  try {
    const { sectorBaseName, sectorSuffixName, unitCaptainId } = filters;
    name = name.toLowerCase();

    let sectorsBaseNameInUnit: string[] = [];
    let sectorsSuffixNameInUnit: string[] = [];

    if (unitCaptainId) {
      const results = await prisma.sector.findMany({
        where: {
          unitCaptainId: unitCaptainId
        }
      });

      sectorsBaseNameInUnit = results.map((sector) => sector.baseName);
      sectorsSuffixNameInUnit = results.map((sector) => sector.suffixName);
    }

    const conditions: any[] = [
      { name: { contains: name, mode: 'insensitive' } }
    ];

    if (sectorBaseName && sectorSuffixName) {
      conditions.push({ sectorBaseName, sectorSuffixName });
    }

    if (unitCaptainId) {
      conditions.push({
        sectorBaseName: { in: sectorsBaseNameInUnit },
        sectorSuffixName: { in: sectorsSuffixNameInUnit }
      });
    }

    const scouts = await prisma.scout.findMany({
      where: {
        AND: conditions
      }
    });


    return scouts;
  } catch (error) {
    console.log(error);
    return null;
  }
}
