import React, { FormEvent, useState } from "react";
import TextInput, { RadioInput } from "../common/Inputs";
import CustomSelect from "../common/CustomSelect";
import "../../assets/styles/components/InsertScoutPage.scss";
import PageTitle from "../common/PageTitle";
import { useInsertScoutMutation } from "../../redux/slices/scoutApiSlice";
import Button from "../common/Button";
import { toast } from "react-toastify";
import { useGetSectorsQuery } from "../../redux/slices/sectorApiSlice";

const InsertScoutPage: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [chosenSector, setChosenSector] = useState("");
  const [studyYear, setStudyYear] = useState("");
  const [enrollDate, setEnrollDate] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [insertScout, { isLoading: isLoadingInsertScout }] =
    useInsertScoutMutation();

  let sectors = [];

  const { data, isFetching } = useGetSectorsQuery({});

  if (data && !isFetching) {
    sectors = data.body;
    if (sectors.length === 0) {
      sectors = [{ baseName: "لا يوجد قطاع", suffixName: "" }];
    }
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
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newScout = {
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      gender: gender === "ذكر" ? "male" : "female",
      sectorBaseName: chosenSector.split(" ")[0],
      sectorSuffixName: chosenSector.split(" ")[1] || "",
      schoolGrade: studyYear,
      photo: null,
      birthCertificate: null,
      birthDate: birthDate,
      enrollDate: enrollDate,
    };

    console.log(newScout);
    try {
      const res = await insertScout(newScout).unwrap();
      if (res.status === 400 || res.status === 500)
        throw new Error("Something went wrong while inserting the scout");
      toast.success("تم إنشاء الكشاف بنجاح");
    } catch (err) {
      console.log();
      toast.error("حدث خطأ أثناء إنشاء الكشاف");
      toast.error(JSON.stringify(err));
    }
  };

  return (
    <div className="add-scout-page">
      <PageTitle title="إضافة و تعيين كشافيين" />
      <section className="add-new-scout">
        <h4>إضافة كشاف جديد</h4>
        <form className="add-scout-form" onSubmit={handleSubmit}>
          <div>
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
                  onInvalid={(e: FormEvent) => {
                    const inputEl = e.target as HTMLInputElement;
                    inputEl.setCustomValidity(
                      "الرجاء إدخال الاسم الاول فقط (باللغة العربية او الانجليزية)",
                    );
                  }}
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
                  onInvalid={(e) => {
                    const inputE = e.target as HTMLInputElement;
                    inputE.setCustomValidity(
                      "الرجاء إدخال الاسم الاوسط فقط (باللغة العربية او الانجليزية)",
                    );
                  }}
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
                  onInvalid={(e) => {
                    const inputEl = e.target as HTMLInputElement;
                    inputEl.setCustomValidity(
                      "الرجاء إدخال الاسم الأخير فقط (باللغة العربية او الانجليزية)",
                    );
                  }}
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
          </div>

          <div className="choose-sector">
            <CustomSelect
              name="sectors"
              label={"اختر القطاع"}
              data={sectors.map((sector) => {
                return {
                  ...sector,
                  sectorAllName: sector.baseName + " " + sector.suffixName,
                };
              })}
              displayMember={"sectorAllName"}
              valueMember={"sectorAllName"}
              selectedValue={chosenSector}
              required={true}
              onChange={(e) => setChosenSector(e.target.value)}
            />
          </div>

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
            إضافة
          </Button>

          {isLoadingInsertScout && (
            <p
              style={{
                direction: "rtl",
              }}
            >
              جاري الإضافة
            </p>
          )}
        </form>
      </section>
    </div>
  );
};

export default InsertScoutPage;
