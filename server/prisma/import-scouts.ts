import { Scout } from "@prisma/client";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import prisma from "../database/db";

const importData = async (fileName: string) => {
  const pathParts = fileName.replace(".csv", "").split("/");
  const sectorBaseName = pathParts[pathParts.length - 1].split(" ")[0];
  const sectorSuffixName = pathParts[pathParts.length - 1].split(" ")[1];

  const scouts: any = [];
  fs.createReadStream(fileName)
    .pipe(csv())
    .on("data", (data) => scouts.push(data))
    .on("end", async () => {
      let scoutsPrismaCreate: Scout[];
      scoutsPrismaCreate = scouts.map((scout: any) => {
        const { "الاسم الثلاثي": name, النوع: gender } = scout;

        const [firstName, middleName, ...lastNameParts] = name.split(" ");
        const lastName: string = lastNameParts.join(" ");

        //TODO: add birth date

        return {
          firstName,
          middleName,
          lastName,
          gender: gender === "ذكر" ? "male" : "female",
          sectorBaseName: sectorBaseName,
          sectorSuffixName: sectorSuffixName,
        } as Scout;
      });
      console.log(scoutsPrismaCreate);
      const QueryResult = await prisma.scout.createMany({
        data: scoutsPrismaCreate,
        skipDuplicates: true,
      });

      console.log(QueryResult);
    });
};

function getAllFiles(dirPath: string, arrayOfFiles: any) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
}

const main = () => {
  const files = getAllFiles(
    "/home/amir/dev/Kashafty/server/prisma/scouts-csv/",
    [],
  );
  for (const file of files) {
    console.log("Importing ");
    console.log(file);
    importData(file);
  }
};

main();
