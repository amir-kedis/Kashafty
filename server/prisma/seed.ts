import bcrypt from "bcryptjs";

import { CaptainType, Gender, PrismaClient, Term } from "@prisma/client";
import { fakerAR, fakerEN } from "@faker-js/faker";

const prisma = new PrismaClient();

const captainCounts = [
  { type: CaptainType.general, count: 2 },
  { type: CaptainType.unit, count: 3 },
  { type: CaptainType.regular, count: 5 },
];

const fixedCaptains = [
  {
    type: CaptainType.regular,
    email: "regular@gmail.com",
    firstName: "عادي",
  },
  {
    type: CaptainType.unit,
    email: "unit@gmail.com",
    firstName: "وحدة",
  },
  {
    type: CaptainType.general,
    email: "general@gmail.com",
    firstName: "عام",
  },
];

const numberOfSectors = 5;
const fixedSectors = [
  {
    baseName: "أشبال",
    suffixName: "أ",
  },
  {
    baseName: "جوالة",
    suffixName: "ج",
  },
];

const scoutsCount = 30;
const today = new Date();
let startDate: any = new Date(today).setDate(today.getDate() - 7 * 8);
startDate = new Date(startDate);
let endDate: any = new Date(today).setDate(today.getDate() + 7 * 8);
endDate = new Date(endDate);
const fixedTerm: Term = {
  startDate,
  endDate,
  termName: "هلم نبني",
  termNumber: 1,
};

async function main() {
  console.log("Start seeding ...");
  console.log("Seeding captains ...");

  await prisma.captain.deleteMany();

  const unifiedPassword = await bcrypt.hash("1234", 10);

  for (const captainCount of captainCounts) {
    for (let i = 0; i < captainCount.count; i++) {
      const gender = fakerEN.helpers.arrayElement([Gender.male, Gender.female]);

      const captain = await prisma.captain.create({
        data: {
          firstName: fakerAR.person.firstName(gender),
          middleName: fakerAR.person.firstName(),
          lastName: fakerAR.person.lastName(),
          password: unifiedPassword,
          phoneNumber: fakerAR.phone.number(),
          email: fakerEN.internet.email(),
          gender,
          type: captainCount.type,
        },
      });
      console.log(captain);
    }
  }

  for (const captain of fixedCaptains) {
    const newCaptain = await prisma.captain.create({
      data: {
        firstName: captain.firstName,
        middleName: fakerAR.person.firstName(),
        lastName: fakerAR.person.lastName(),
        password: unifiedPassword,
        phoneNumber: fakerAR.phone.number(),
        email: captain.email,
        gender: Gender.male,
        type: captain.type,
      },
    });
    console.log(newCaptain);
  }

  console.log("Finished seeding captains ...");

  console.log("Seeding sectors ...");

  await prisma.sector.deleteMany();

  for (let i = 0; i < numberOfSectors; i++) {
    try {
      const sector = await prisma.sector.create({
        data: {
          baseName: fakerAR.helpers.arrayElement([
            "أشبال",
            "جوالة",
            "فريق",
            "مرشدات",
          ]),
          suffixName: fakerAR.helpers.arrayElement(["أ", "ب", "ج", "د", "ه"]),
        },
      });
      console.log(sector);
    } catch (e) {
      console.warn(e);
    }
  }

  for (const sector of fixedSectors) {
    try {
      const newSector = await prisma.sector.create({
        data: {
          baseName: sector.baseName,
          suffixName: sector.suffixName,
          Captain_Sector_unitCaptainIdToCaptain: {
            connect: {
              email: fixedCaptains[1].email,
            },
          },
        },
      });
      console.log(newSector);
    } catch (e) {
      console.error(e);
    }
  }

  console.log("Finished seeding sectors ...");

  console.log("Seeding scouts ...");

  await prisma.scout.deleteMany();

  for (let i = 0; i < scoutsCount; i++) {
    const gender = fakerEN.helpers.arrayElement([Gender.male, Gender.female]);

    const scout = await prisma.scout.create({
      data: {
        name: fakerAR.person.fullName({ sex: gender }),
        gender,
        sectorBaseName: fixedSectors[0].baseName,
        sectorSuffixName: fixedSectors[0].suffixName,
      },
    });
    console.log({ scoutName: scout.name });
  }

  console.log("Finished seeding scouts ...");

  console.log("Seeding terms ...");

  try {
    await prisma.activity.deleteMany();
    await prisma.scoutAttendance.deleteMany();
    await prisma.captainAttendance.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.week.deleteMany();
    await prisma.term.deleteMany();
  } catch (e) {
    console.warn(e);
  }

  const term = await prisma.term.create({
    data: fixedTerm,
  });

  console.log(term);

  console.log("Finished seeding terms ...");

  console.log("Seeding weeks ...");

  await prisma.week.deleteMany();

  for (let i = 0; i < 8; i++) {
    const weekDate = new Date(fixedTerm.startDate).setDate(
      fixedTerm.startDate.getDate() + i * 7,
    );
    const week = await prisma.week.create({
      data: {
        weekNumber: i + 1,
        termNumber: fixedTerm.termNumber,
        startDate: new Date(weekDate),
      },
    });
    console.log(week);
  }

  console.log("Finished seeding weeks ...");

  console.log("Seeding connections between captains and sectors ...");

  await prisma.captain.updateMany({
    data: {
      rSectorBaseName: fixedSectors[0].baseName,
      rSectorSuffixName: fixedSectors[0].suffixName,
    },
    where: {
      email: {
        in: fixedCaptains.map((captain) => captain.email),
      },
    },
  });

  // TODO: delete later
  await prisma.captain.updateMany({
    data: {
      rSectorBaseName: fixedSectors[0].baseName,
      rSectorSuffixName: fixedSectors[0].suffixName,
    },
  });

  console.log("Finished seeding connections between captains and sectors ...");

  console.log("Finished seeding ...");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
