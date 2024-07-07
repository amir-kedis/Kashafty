import React, { useState } from "react";
import TextInput, { RadioInput } from "../common/Inputs";
import CustomSelect from "../common/CustomSelect";
import "../../assets/styles/components/InsertScoutPage.scss";
import PageTitle from "../common/PageTitle";
import {
  useGetScoutsInSectorQuery,
  useInsertScoutMutation,
  useUpdateScoutMutation,
} from "../../redux/slices/scoutApiSlice";
import Button from "../common/Button";
import { toast } from "react-toastify";
import { useGetSectorsQuery } from "../../redux/slices/sectorApiSlice";

const UpdateScoutPage = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [currentChosenSector, setCurrentChosenSector] = useState("");
  const [newSector, setNewSector] = useState("");
  const [chosenScout, setChosenScout] = useState("");

  const [studyYear, setStudyYear] = useState("");
  const [enrollDate, setEnrollDate] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [updateScout, { isLoading: isLoadingUpdateScout }] =
    useUpdateScoutMutation();

  let sectors = [];
  let scouts = [];

  //getting allSectors in the system
  const {
    data: sectorData,
    isFetching: isFetchingSector,
    isSuccess: isSuccessSector,
  } = useGetSectorsQuery({});

  //getting scouts in the chosen sector
  let sectorToQuery = {
    baseName: currentChosenSector.split(" ")[0],
    suffixName: currentChosenSector.split(" ")[1],
  };

  console.log(sectorToQuery);

  const {
    data: scoutsData,
    isFetching: isFetchingScouts,
    isSuccess: isSuccessScouts,
  } = useGetScoutsInSectorQuery(sectorToQuery);

  if (sectorData && !isFetchingSector) {
    sectors = sectorData.body;
    if (sectors.length === 0) {
      sectors = [{ baseName: "لا يوجد قطاع", suffixName: "" }];
    }
  }

  if (!isFetchingScouts && scoutsData) {
    scouts = scoutsData.body;
    if (scouts.length === 0) {
      scouts = [
        {
          firstName: "لا يوجد كشافين في هذا القطاع",
          middleName: "",
          lastName: "",
          scoutId: null,
        },
      ];
    }
  }

  if (isSuccessSector) {
    console.log("sectorData = ", sectorData);
  }

  if (isSuccessScouts) {
    console.log("scoutsData = ", scoutsData);
  }

  const schoolYears = [
    { name: "الأول الإبتدائي", value: 1 },
    { name: "الثاني الإبتدائي", value: 2 },
    { name: "الثالث الإبتدائي", value: 3 },
    { name: "الرابع الإبتدائي", value: 4 },
    { name: "الخامس الإبتدائي", value: 5 },
    { name: "السادس الإبتدائي", value: 6 },
    { name: "الأول الإعدادي", value: 7 },
    { name: "الثاني الإعدادي", value: 8 },
    { name: "الثالث الإعدادي", value: 9 },
    { name: "الأول الثانوي", value: 10 },
    { name: "الثاني الثانوي", value: 11 },
    { name: "الثالث الثانوي", value: 12 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newScout = {
      scoutId: Number(chosenScout),
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      gender: gender === "ذكر" ? "male" : "female",
      sectorBaseName: newSector.split(" ")[0],
      sectorSuffixName: newSector.split(" ")[1] || "",
      schoolGrade: studyYear,
      photo: null,
      birthCertificate: null,
      birthDate: birthDate,
      enrollDate: enrollDate,
    };

    console.log("newScout = ", newScout);

    try {
      const res = await updateScout(newScout).unwrap();
      if (res.status === 400 || res.status === 500)
        throw new Error("Something went wrong while updating the scout");
      toast.success("تم تعديل الكشاف بنجاح");
    } catch (err) {
      toast.error("حدث خطأ أثناء تعديل الكشاف");
      toast.error(JSON.stringify(err));
    }
  };

  console.log("chosenScout = ", chosenScout);

  return (
    <div className="add-scout-page">
      <PageTitle title="تعديل كشافيين" />
      <section className="add-new-scout">
        <form className="add-scout-form" onSubmit={handleSubmit}>
          <h4>اختار الكشاف</h4>
          <CustomSelect
            name="currentSectors"
            label={"اختر القطاع"}
            data={sectors.map((sector) => {
              return {
                ...sector,
                sectorAllName: sector.baseName + " " + sector.suffixName,
              };
            })}
            displayMember={"sectorAllName"}
            valueMember={"sectorAllName"}
            selectedValue={currentChosenSector}
            required={true}
            onChange={(e) => setCurrentChosenSector(e.target.value)}
          />

          <CustomSelect
            name="scouts"
            label={"اختر الكشاف"}
            data={scouts.map((scout) => {
              return {
                ...scout,
                scoutAllName:
                  scout.firstName +
                  " " +
                  scout.middleName +
                  " " +
                  scout.lastName,
              };
            })}
            displayMember={"scoutAllName"}
            valueMember={"scoutId"}
            selectedValue={chosenScout}
            required={true}
            onChange={(e) => setChosenScout(e.target.value)}
          />

          <h4>تعديل الكشاف</h4>
          <div className="horizontally-aligned">
            <div className="form-card ">
              <TextInput
                type="text"
                label="الاسم الأول"
                name="firstname"
                placeholder="جون"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  e.target.setCustomValidity("");
                }}
                pattern="^[\u0621-\u064Aa-zA-Z]+$"
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "الرجاء إدخال الاسم الاول فقط (باللغة العربية او الانجليزية)",
                  )
                }
                required={true}
              />
            </div>
            <div className="form-card">
              <TextInput
                type="text"
                label="الاسم الأوسط (الأب)"
                name="middlename"
                placeholder="دوي"
                value={middleName}
                onChange={(e) => {
                  setMiddleName(e.target.value);
                  e.target.setCustomValidity("");
                }}
                pattern="^[\u0621-\u064Aa-zA-Z]+$"
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "الرجاء إدخال الاسم الاوسط فقط (باللغة العربية او الانجليزية)",
                  )
                }
                required={true}
              />
            </div>
          </div>
          <div className="horizontally-aligned">
            <div className="form-card form-item">
              <TextInput
                type="text"
                label="الاسم الأخير (الجد)"
                name="lastname"
                placeholder="السيد"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  e.target.setCustomValidity("");
                }}
                pattern="^[\u0621-\u064Aa-zA-Z]+$"
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "الرجاء إدخال الاسم الأخير فقط (باللغة العربية او الانجليزية)",
                  )
                }
                required={true}
              />
            </div>
            <div className="form-card">
              <RadioInput
                label="النوع"
                name="gender"
                valuesArr={["ذكر", "أنثى"]}
                onChange={(e) => setGender(e.target.value)}
                required={true}
              />
            </div>
          </div>

          <CustomSelect
            name="newSectors"
            label={"اختر القطاع"}
            data={sectors.map((sector) => {
              return {
                ...sector,
                sectorAllName: sector.baseName + " " + sector.suffixName,
              };
            })}
            displayMember={"sectorAllName"}
            valueMember={"sectorAllName"}
            selectedValue={newSector}
            required={true}
            onChange={(e) => setNewSector(e.target.value)}
          />

          <small>*المعلومات التالية غير ضرورية ويمكن تعديلها لاحقاً</small>
          <div className="horizontally-aligned">
            <div className="form-card ">
              <TextInput
                type="date"
                label="تاريخ الميلاد"
                name="birthDate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required={true}
              />
            </div>
            <div className="form-card">
              <TextInput
                type="date"
                label="تاريخ دخول الكشافة"
                name="enrollDate"
                value={enrollDate}
                onChange={(e) => setEnrollDate(e.target.value)}
                required={true}
              />
            </div>
          </div>

          <CustomSelect
            label="السنة الدراسية"
            name="studyYear"
            data={schoolYears}
            displayMember="name"
            valueMember="value"
            selectedValue={studyYear}
            onChange={(e) => setStudyYear(e.target.value)}
            required={false}
          />
          <Button className="insert-sector__btn Button--medium Button--primary-darker">
            تعديل
          </Button>

          {isLoadingUpdateScout && (
            <p
              style={{
                direction: "rtl",
              }}
            >
              جاري التعديل
            </p>
          )}
        </form>
      </section>
    </div>
  );
};

export default UpdateScoutPage;
