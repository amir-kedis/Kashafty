import { CaptainType, Gender, PrismaClient, Scout } from "@prisma/client";

import csv from "csv-parser";
import fs from "fs";
import path from "path";

import FIXED_CAPTAINS from "./fixtures/fixed_captains";
import UNIFIED_PASSWORD from "./fixtures/passwords";
import SECTORS from "./fixtures/sectors";

const prisma = new PrismaClient();

async function main() {
  console.log("IMPORT SCRIPT");

  console.log("Resetting database ...");
  try {
    await resetDB();
  } catch (error) {
    console.error("Error in resetting database", error);
  }

  console.log("Inserting fixed captains ...");
  try {
    await insertFixedCaptains();
  } catch (error) {
    console.error("Error in inserting fixed captains", error);
  }

  console.log("Inserting fixed sectors ...");
  try {
    await insertFixedSectors();
  } catch (error) {
    console.error("Error in inserting fixed sectors", error);
  }

  console.log("Parsing and inserting captains ...");
  try {
    await insertCaptains();
  } catch (error) {
    console.error("Error in parsing and inserting captains", error);
  }

  console.log("Parsing and inserting scouts ...");
  try {
    await insertScouts();
  } catch (error) {
    console.error("Error in parsing and inserting scouts", error);
  }

  console.log("Add starting Term ...");
  try {
    await prisma.term.create({
      data: {
        termNumber: 1,
        termName: "هلم نبني",
        startDate: new Date("2024-09-19"),
        endDate: new Date("2024-12-30"),
      },
    });
  } catch (error) {
    console.error("Error in adding starting Term", error);
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});

async function resetDB() {
  await prisma.scout.deleteMany();
  await prisma.captain.deleteMany();
  await prisma.sector.deleteMany();
}

// 1. Insert Fixed Captains
async function insertFixedCaptains() {
  for (const captain of FIXED_CAPTAINS) {
    const captainData = {
      ...captain,
      password: await UNIFIED_PASSWORD,
      gender: Gender.male,
    };
    await prisma.captain.create({
      data: captainData,
    });
  }
}

// 2. Insert Fixed Sectors
async function insertFixedSectors() {
  for (const sector of SECTORS) {
    const sectorBaseName = sector.split(" ")[0];
    const sectorSuffix = sector.split(" ")[1] ?? "أ";
    const unitCaptain = await prisma.captain.findFirst({
      where: { type: CaptainType.unit },
    });

    await prisma.sector.create({
      data: {
        baseName: sectorBaseName,
        suffixName: sectorSuffix,
        unitCaptainId: unitCaptain?.captainId,
      },
    });
  }
}

// 3. Parse and Insert Captains
async function insertCaptains() {
  const FILE_PATH = path.join(__dirname, "data", "بيانات القادة.csv");
  const PASSWORD = await UNIFIED_PASSWORD;

  const captains: any[] = [];

  fs.createReadStream(FILE_PATH)
    .pipe(csv())
    .on("data", (row) => {
      if (!row["الاسم الثلاثي بالعربي"] || !row["رقم الهاتف"]) {
        return;
      }

      let type: CaptainType = CaptainType.regular;
      switch (row["الرتبة"]) {
        case "قائد وحدة":
          type = CaptainType.unit;
          break;
        case "قائد عام":
          type = CaptainType.general;
          break;
      }

      let sectorBaseName = row["القطاع"].split(" ")[0] ?? undefined;
      if (sectorBaseName === "الرئدات") {
        sectorBaseName = "الرائدات";
      }
      const sectorSuffix = sectorBaseName
        ? row["القطاع"].split(" ")[1] ?? "أ"
        : undefined;

      const captainData = {
        firstName: row["الاسم الثلاثي بالعربي"].split(" ")[0],
        middleName: row["الاسم الثلاثي بالعربي"].split(" ")[1],
        lastName: row["الاسم الثلاثي بالعربي"].split(" ")[2] ?? "",
        phoneNumber: row["رقم الهاتف"],
        email:
          row["البريد الالكتروني ان وجد"] === ""
            ? undefined
            : row["البريد الالكتروني ان وجد"] ?? undefined,
        gender: row["النوع"] === "ذكر" ? Gender.male : Gender.female,
        rSectorBaseName: sectorBaseName,
        rSectorSuffixName: sectorSuffix,
        type,
        password: PASSWORD,
      };

      captains.push(captainData);
    })
    .on("end", async () => {
      console.log("Captains CSV file successfully processed");
      for (const captain of captains) {
        try {
          await prisma.captain.create({
            data: captain,
          });
        } catch (error) {
          console.error("Error in inserting captain", captain, error);
        }
      }
      console.log("Captains inserted successfully");
    });
}

// 4. Insert Scouts
async function insertScouts() {
  const files = fs.readdirSync(path.join(__dirname, "data", "scouts"));

  for (const file of files) {
    const fileName = file.split(".")[0];
    const sectorBaseName = fileName.split(" ")[0];
    const sectorSuffix = fileName.split(" ")[1] ?? "أ";

    try {
      await insertScoutFile(
        path.join(__dirname, "data", "scouts", file),
        sectorBaseName,
        sectorSuffix,
      );
    } catch (error) {
      console.error("Error in inserting scouts", error);
    }
  }
}

async function insertScoutFile(
  filePath: string,
  sectorBaseName: string,
  sectorSuffix: string,
) {
  const scouts: any[] = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      const scoutData = {
        name: row["الاسم الثلاثي \n(يجب أن يكون أسم الكشاف مميز)"],
        sectorBaseName,
        sectorSuffixName: sectorSuffix,
        phoneNumber: row["رقم التليفون"] || undefined,
        birthDate: parseDate(row["تاريخ الميلاد"]),
        enrollDate: parseDate(row["تاريخ دخول الكشافة"]),
        address: row["العنوان"] || undefined,
        gender: row["النوع"] === "ذكر" ? Gender.male : Gender.female,
      };

      scouts.push(scoutData);
    })
    .on("end", async () => {
      console.log("Scouts CSV file successfully processed");
      for (const scout of scouts) {
        try {
          await prisma.scout.create({
            data: scout,
          });
        } catch (error) {
          console.error("Error in inserting scout", scout, error);
        }
      }
      console.log("Scouts inserted successfully");
    });
}

function parseDate(date: string) {
  if (!date || date === "") return undefined;

  if (date.length === 4) {
    let data = new Date(date);
    if (data.toString() === "Invalid Date") {
      return undefined;
    }
    return data;
  }

  const [day, month, year] = date.split("-").map(Number);
  let data = new Date(year, month - 1, day);

  if (data.toString() === "Invalid Date") {
    return undefined;
  }
  return data;
}
