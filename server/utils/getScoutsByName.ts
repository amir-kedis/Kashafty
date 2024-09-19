import prisma from "../database/db";

interface GetScoutByNameFilters {
  sectorBaseName?: string;
  sectorSuffixName?: string;
  unitCaptainId?: number;
};

export default async function getScoutByName(name: string, filters: GetScoutByNameFilters) {
  try {
    const { sectorBaseName, sectorSuffixName, unitCaptainId } = filters;
    const searchTerms = name.split(" ").map(term => term.toLowerCase());

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

    const scouts = await prisma.scout.findMany({
      where: {
        AND: [
          {
            OR: searchTerms.map(function checkTermExists(term) {
              return {
                OR: [
                  { firstName: { contains: term, mode: 'insensitive' } },
                  { middleName: { contains: term, mode: 'insensitive' } },
                  { lastName: { contains: term, mode: 'insensitive' } },
                ]
              }
            })
          },
          ...((sectorBaseName && sectorSuffixName) ? [{ sectorBaseName, sectorSuffixName }] : []),
          ...((unitCaptainId) ? [{ sectorBaseName: { in: sectorsBaseNameInUnit }, sectorSuffixName: { in: sectorsSuffixNameInUnit } }] : []),
        ]
      }
    });

    return scouts;
  } catch (error) {
    console.log(error);
    return null;
  }
}
