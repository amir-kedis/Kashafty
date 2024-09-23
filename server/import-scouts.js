const reader = require("xlsx");
const fs = require("fs/promises");
const fs_ = require("fs");
const csv = require("csv-parser");
const {PrismaClient} = require("@prisma/client");
const path = require("path");



const state = {};
const prisma = new PrismaClient();

const captainsG = [];
const sectors = [];

function processCSV(file)
{
	const data = [];

	return new Promise((resolve, reject) => {

	fs_.createReadStream(file)
	   .pipe(csv())
	   .on("data", row => data.push(row))
	   .on("end", () => resolve(data))
	   .on("error", (err) => reject(err));

	});
}

// You first call it with your input 

async function prepareFile(file)
{
	const [filename, extension] = path.basename(file).split(".");

	if(extension === "csv")
	{
		await fs.copyFile(file, `./data/${filename}.${extension}`)
	}
	else if(extension === "xlsx")
	{
		const file = reader.readFile(file);
		const sheets = file.SheetNames;

		for(let i = 0; i < sheets.length; i++)
		{
			const data = reader.utils.sheet_to_csv(file.Sheets[file.SheetNames[i]]);
			fs.writeFileSync(`./data/${sheets[i]}.csv`, data);
		}
	}
};


function parseCaptain(captain)
{
	const [firstName, middleName, lastName] = captain["الاسم الثلاثي بالعربي"].split(" ");
	const phoneNumber = captain["رقم الهاتف"];
	const email = captain["البريد الالكتروني ان وجد"];
	const sector = captain["القطاع"];
	const rank = captain["الرتبة"];
	const {sectorBaseName, sectorSuffixName} = parseSectorName(sector);

	return {
		firstName,
		middleName,
		lastName,
		phoneNumber,
		email,
		sector,
		type: rank,
		rSectorBaseName : sectorBaseName,
		rSectorSuffixName : sectorSuffixName
	};
}

function parseScout(data, sectorBaseName, sectorSuffixName) {

	const {
	  "الاسم الثلاثي \n(يجب أن يكون أسم الكشاف مميز)": fullName,
	  "النوع": gender,
	  "رقم التليفون": phoneNumber,
	  "تاريخ الميلاد": birthDate,
	  "تاريخ دخول الكشافة": joinDate,
	  "العنوان": address
	} = data;
  
	const nameParts = fullName ? fullName.split(' ') : [];
	const firstName = nameParts[0] || "";
	const middleName = nameParts[1] || "";
	const lastName = nameParts.length > 2 ? nameParts.slice(2).join(' ') : null;
  
	let genderEnum;
	switch (gender) {
	  case 'ذكر':
		genderEnum = 'Male';
		break;
	  case 'أنثى':
		genderEnum = 'Female';
		break;
	  default:
		genderEnum = null;
	}
}
  
function getSectors(captains)
{
	const sectors = new Set();
	const sectorsData = [];

	let defaultCaptain = "كسبان موسى"
	let lastUnitCaptain = null;

	for(const captain of captains)
	{
		if(captain.rank === "قائد وحدة")
		{
			lastUnitCaptain = captain;
		}


		if(captain.rank === "قائد")
		{
			if(!sectors.has(captain.sector) && captain.sector != "")
			{
				sectors.add(captain.sector);
				const {basename, suffixname} = parseSectorName(captain.sector);

				sectorsData.push({
					name: captain.sector,
					basename,
					suffixname,
					captains: [captain],
					unitCaptain: lastUnitCaptain == "" ? defaultCaptain : lastUnitCaptain
				});
			}
			else{
				const sector = sectorsData.find(sector => sector.name === captain.sector);
				if(sector)
					sector.captains.push(captain);
			}	
		}
	}

	return sectorsData;
}

async function processCaptainsData(file)
{
	const captains = await processCSV(file);
	
	const parsedCaptains = captains.map(parseCaptain);
	const sectors = getSectors(parsedCaptains);

	state.sectors = sectors;
	state.captains = parsedCaptains;
};

function parseSectorName(sector)
{
	const parts = sector.split(" ");
	let basename = null;
	let suffixname = "أ"; 

	for (const part of parts) {
		if (basename == null) {
			basename = part; 
		} else {
			if (part.length > 1) {
				basename += " " + part; 
			} else {
				suffixname = part; 	
			}
		}	
	}

	return {basename, suffixname};
}

async function processSectorData(file)
{
	const sectorName = path.basename(file).split(".")[0];
	const {basename, suffixname} = parseSectorName(sectorName);
	const data = await processCSV(file);
	const scouts = data.map(scout => parseScout(scout, basename, suffixname));

	state.scouts = scouts;
};	


async function insertGeneralAndUnitCaptains(captains)
{
	await prisma.$connect();

	captains.forEach(async captain =>
	{
		console.log(captain);
		if(captain.phoneNumber == "")
			return;

		const captain = await prisma.captain.create({
			data: {
				firstName: captain.firstName,
				middleName: captain.middleName,
				lastName: captain.lastName,
				phoneNumber: captain.phoneNumber,
				email: captain.email,
				gender: captain.gender,
				type: captain.type			
			}
		});

		captainsG.insert(captain);
	});
}

async function insertSectorCaptains(captain)
{
	for(const captain of captains)
	{
		if(captain.phoneNumber == "")
			continue;

		const captain = await prisma.captain.create({
			data: {
				firstName: captain.firstName,
				middleName: captain.middleName,
				lastName: captain.lastName,
				phoneNumber: captain.phoneNumber,
				email: captain.email,
				rSectorBaseName: captain.rSectorBaseName,
				rSectorSuffixName: captain.rSector,
				gender: captain.gender,
				type: captain.type
			}
		});

		captains.insert(captain);
	}
}

async function insertSectors(sectors)
{
	for(const sector of sectors)
	{
		const c = captains.find(captain => captain.firstName === sector.unitCaptain.split(" ")[0]);

		if(c == null)
			continue;

		const sector = await prisma.sector.create({
			data: {
				basename: sector.basename,
				suffixname: sector.suffixname,
				unitCaptainId: c.id
			}
		});

		sectors.insert(sector);
	}
}



async function main(folder) {
    const files = await fs.readdir(folder);
    
    // Process each file asynchronously in a controlled manner
    for (const file of files) {
        const [filename, extension] = file.split(".");
        if (extension === "csv") {
            if (filename.includes("القادة")) {
                await processCaptainsData(path.join(folder, `${filename}.csv`));
            } else {
                await processSectorData(path.join(folder, `${filename}.csv`));
            }
        }
    }

	const {generalCaptains, unitCaptains, sectorCaptains} = await categorizeCaptains(state.captains);

	// Insert general captains
	await insertGeneralAndUnitCaptains(generalCaptains);
	await insertGeneralAndUnitCaptains(unitCaptains);

	// Insert sectors
	await insertSectors(state.sectors);

	// Insert sector captains
	await insertSectorCaptains(sectorCaptains);
}


async function categorizeCaptains(captains)
{
	const generalCaptains = [];
	const unitCaptains = [];
	const sectorCaptains = [];

	for(const captain of captains)
	{
		if(captain.rank === "قائد")
		{
			sectorCaptains.push(captain);
		}
		else if(captain.rank === "قائد وحدة")
		{
			unitCaptains.push(captain);
		}
		else{
			generalCaptains.push(captain);
		}
	}

	return {generalCaptains, unitCaptains, sectorCaptains};
}

prisma.$connect().then(() => {
	console.log("Connected to database");
	// Call main and wait for it to complete
	main("./data").then(() => {
		console.log(state); 
	}).catch(err => {
		console.error("Error processing files:", err);
	});

}).catch(err => {
	console.error("Failed to connect to database:", err);
});



/*

We have an excel file 
We need to parse it into secotrs-data and captains-data
We need to parse the captains-data to get all captains and all sectors 

The sector needs 

	- basename
	- suffix
	- Captain_Sector_unitCaptainIdToCaptain

The cptain needs

	- firstName
    - middleName
	- lastName
	- password
	- phoneNumber
	- email
	- gender
	- type
	- rSectorBaseName
	- rSectorSuffixName



Insert captains with no sectors 

Insert Sectors 

Insert captain with sectors

Insert scouts 

*/














