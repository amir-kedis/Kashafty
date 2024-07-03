import bcrypt from "bcryptjs";

import { CaptainType, Gender, PrismaClient } from "@prisma/client";
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
  },
  {
    type: CaptainType.unit,
    email: "unit@gmail.com",
  },
  {
    type: CaptainType.general,
    email: "general@gmail.com",
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
        firstName: fakerAR.person.firstName(),
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
  }

  for (const sector of fixedSectors) {
    try {
      const newSector = await prisma.sector.create({
        data: {
          baseName: sector.baseName,
          suffixName: sector.suffixName,
        },
      });
      console.log(newSector);
    } catch (e) {
      console.error(e);
    }
  }

  console.log("Finished seeding sectors ...");

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
