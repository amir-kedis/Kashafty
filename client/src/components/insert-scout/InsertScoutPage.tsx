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
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [chosenSector, setChosenSector] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [enrollDate, setEnrollDate] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [photo, setPhoto] = useState("");
  const [birthCertificate, setBirthCertificate] = useState("");

  const [insertScout, { isLoading: isLoadingInsertScout }] =
    useInsertScoutMutation();

  let sectors = [];

  const { data, isFetching } = useGetSectorsQuery({});

  if (data && !isFetching) {
    sectors = data?.body;
    if (sectors.length === 0) {
      sectors = [{ baseName: "لا يوجد قطاع", suffixName: "" }];
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newScout = {
      name: name,
      gender: gender === "ذكر" ? "male" : "female",
      sectorBaseName: chosenSector.split(" ")[0],
      sectorSuffixName: chosenSector.split(" ")[1] || "",
      phoneNumber: phoneNumber,
      address: address,
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
      toast.error("حدث خطأ أثناء إنشاء الكشاف");
      toast.error(err?.data?.arabicMessage);
      console.log(err?.data?.message);
    }
  };

  return (
    <div className="add-scout-page container">
      <PageTitle title="إضافة وتعيين كشافيين" />
      <section className="add-new-scout">
        <h4>إضافة كشاف جديد</h4>
        <form className="add-scout-form" onSubmit={handleSubmit}>
          <div>
            <div className="horizontally-aligned">
              <TextInput
                type="text"
                label="الاسم"
                name="name"
                placeholder="جون دوي السيد"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  e.target.setCustomValidity("");
                }}
                pattern="^[\u0621-\u064AazAZ\s]+$"
                onInvalid={(e: FormEvent) => {
                  const inputEl = e.target as HTMLInputElement;
                  inputEl.setCustomValidity(
                    "الرجاء إدخال الاسم الأول فقط (باللغة العربية أو الإنجليزية)",
                  );
                }}
                required={true}
              />
            </div>
            <div className="horizontally-aligned">
              <div className="form-card">
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
              <div className="form-card">
                <RadioInput
                  label="النوع"
                  name="gender"
                  valuesArr={["ذكر", "أنثى"]}
                  checkedValue={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required={true}
                />
              </div>
            </div>
          </div>
          <div>
            <small>*المعلومات التالية غير ضرورية ويمكن تعديلها لاحقاً</small>
            <div className="horizontally-aligned">
              <TextInput
                type="text"
                label="عنوان الإقامة"
                name="address"
                placeholder="١٢٣ شارع الرئيسي، الحي السابع، مدينة المستقبل، القاهرة، مصر"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  e.target.setCustomValidity("");
                }}
                pattern="^[\u0621-\u064Aa-zA-Z0-9\s,.-/]+$"
                onInvalid={(e) => {
                  const inputEl = e.target as HTMLInputElement;
                  inputEl.setCustomValidity(
                    "الرجاء إدخال العنوان فقط (باللغة العربية أو الإنجليزية)",
                  );
                }}
              />
            </div>
            <div className="horizontally-aligned">
              <TextInput
                type="tel"
                label="رقم الهاتف"
                name="phoneNumber"
                placeholder="01234567890"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  e.target.setCustomValidity("");
                }}
                pattern="^[\d\s()+-]+$"
                onInvalid={(e) => {
                  const inputEl = e.target as HTMLInputElement;
                  inputEl.setCustomValidity(
                    "الرجاء إدخال رقم الهاتف فقط (باللغة العربية أو الإنجليزية)",
                  );
                }}
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
                />
              </div>
              <div className="form-card">
                <TextInput
                  type="date"
                  label="تاريخ دخول الكشافة"
                  name="enrollDate"
                  value={enrollDate}
                  onChange={(e) => setEnrollDate(e.target.value)}
                />
              </div>
            </div>
            <div className="horizontally-aligned">
              <div className="form-card">
                <TextInput
                  type="file"
                  label="صورة شخصية"
                  name="photo"
                  value={photo}
                  onChange={(e) => {
                    setPhoto(e.target.value);
                    e.target.setCustomValidity("");
                  }}
                  onInvalid={(e) => {
                    const inputEl = e.target as HTMLInputElement;
                    inputEl.setCustomValidity(
                      "الرجاء إدخال صورة شخصية (باللغة العربية أو الإنجليزية)",
                    );
                  }}
                  disabled={true}
                />
              </div>
              <div className="form-card">
                <TextInput
                  type="file"
                  label="شهادة الميلاد"
                  name="birthCertificate"
                  value={birthCertificate}
                  onChange={(e) => {
                    setBirthCertificate(e.target.value);
                    e.target.setCustomValidity("");
                  }}
                  onInvalid={(e) => {
                    const inputEl = e.target as HTMLInputElement;
                    inputEl.setCustomValidity(
                      "الرجاء إدخال شهادة الميلاد (باللغة العربية أو الإنجليزية)",
                    );
                  }}
                  disabled={true}
                />
              </div>
            </div>
          </div>

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
