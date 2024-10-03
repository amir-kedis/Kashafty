import React, { useEffect, useState } from "react";
import TextInput, { RadioInput } from "../common/Inputs";
import CustomSelect from "../common/CustomSelect";
import "../../assets/styles/components/InsertScoutPage.scss";
import PageTitle from "../common/PageTitle";
import {
  useGetScoutsInSectorQuery,
  useUpdateScoutMutation,
} from "../../redux/slices/scoutApiSlice";
import Button from "../common/Button";
import { toast } from "react-toastify";
import { useGetSectorsQuery } from "../../redux/slices/sectorApiSlice";
import RadioButtonGroup from "../atoms/inputs/RadioButtonGroup";

const UpdateScoutPage = () => {
  const [name, setName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [currentChosenSector, setCurrentChosenSector] = useState("");
  const [newSector, setNewSector] = useState("");
  const [chosenScout, setChosenScout] = useState("");
  const [enrollDate, setEnrollDate] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [photo, setPhoto] = useState("");
  const [birthCertificate, setBirthCertificate] = useState("");

  const [updateScout, { isLoading: isLoadingUpdateScout }] =
    useUpdateScoutMutation();

  const setScoutData = (scoutId) => {
    const chosenScout = scouts.filter((scout) => scout?.scoutId == scoutId);

    if (!chosenScout) return;
    console.log("chosen scout = " +  JSON.stringify(chosenScout[0], null, 2))
    setName(chosenScout[0].name);
    setGender(chosenScout[0].gender === "male" ? "ذكر" : "أنثى");
    setAddress(chosenScout[0].address);
    const birthDate = chosenScout[0].birthDate ? chosenScout[0].birthDate.split('T')[0] : "";
    setBirthDate(birthDate);
    setPhoneNumber(chosenScout[0].phoneNumber);
    setBirthCertificate(chosenScout[0].birthCertificate);
    setPhoto(chosenScout[0].photo);
    console.log(
      chosenScout[0].sectorBaseName + " " + chosenScout[0].sectorSuffixName,
    );
    setNewSector(
      chosenScout[0].sectorBaseName + " " + chosenScout[0].sectorSuffixName,
    );
    const enrollDate = chosenScout[0].enrollDate ? chosenScout[0].enrollDate.split('T')[0] : "";
    setEnrollDate(enrollDate);
  };

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
    sectorBaseName: currentChosenSector.split(" ")[0],
    sectorSuffixName: currentChosenSector.split(" ")[1],
  };

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
    scouts = scoutsData?.body;
    if (scouts.length === 0) {
      scouts = [
        {
          name: "لا يوجد كشافين في هذا القطاع",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newScout = {
      scoutId: Number(chosenScout),
      name: name,
      gender: gender === "ذكر" ? "male" : "female",
      sectorBaseName: newSector.split(" ")[0],
      sectorSuffixName: newSector.split(" ")[1] || "",
      phoneNumber: phoneNumber,
      address: address,
      photo: null,
      birthCertificate: null,
      birthDate: birthDate,
      enrollDate: enrollDate,
    };

    try {
      const res = await updateScout(newScout).unwrap();
      if (res.status === 400 || res.status === 500)
        throw new Error("Something went wrong while updating the scout");
      toast.success("تم تعديل الكشاف بنجاح");
    } catch (err) {
      toast.error("حدث خطأ أثناء تعديل الكشاف");
      toast.error(err?.data?.arabicMessage);
      console.log(err?.data?.message);
    }
  };

  return (
    <div className="add-scout-page container">
      <PageTitle title="تعديل كشافيين" />
      <section className="add-new-scout">
        <form className="add-scout-form" onSubmit={handleSubmit}>
          <h4>اختار الكشاف</h4>
          <div>
            <div className="horizontally-aligned">
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
            </div>
            <div className="horizontally-aligned">
              <CustomSelect
                name="scouts"
                label={"اختر الكشاف"}
                data={scouts.map((scout) => {
                  return {
                    ...scout,
                    scoutAllName:
                      scout.name
                  };
                })}
                displayMember={"scoutAllName"}
                valueMember={"scoutId"}
                selectedValue={chosenScout}
                required={true}
                onChange={(e) => {
                  setChosenScout(e.target.value);
                  setScoutData(e.target.value);
                }}
              />
            </div>
          </div>

          <h4>تعديل الكشاف</h4>
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
                      "الرجاء إدخال الاسم الأول فقط (باللغة العربية أو الإنجليزية)"
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
                  selectedValue={newSector}
                  required={true}
                  onChange={(e) => setNewSector(e.target.value)}
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
                    "الرجاء إدخال العنوان فقط (باللغة العربية أو الإنجليزية)"
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
                    "الرجاء إدخال رقم الهاتف فقط (باللغة العربية أو الإنجليزية)"
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
                      "الرجاء إدخال صورة شخصية (باللغة العربية أو الإنجليزية)"
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
                      "الرجاء إدخال شهادة الميلاد (باللغة العربية أو الإنجليزية)"
                    );
                  }}
                  disabled={true}
                />
              </div>
            </div>
          </div>

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
