import { useState } from "react";
import { TextInput, RadioInput } from "../Inputs";

const AddScout = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");

  return (
    <div className="add-scout-page">
      <h1>إضافة و تعيين كشافيين</h1>
      <section className="add-new-scout">
        <h4>إضافة كشاف جديد</h4>
        <form className="add-scout-form">
          <TextInput
            type="text"
            label="الاسم الأول"
            name="firstname"
            placeholder="عبدالرحمن"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required={true}
          />

          <TextInput
            type="text"
            label="الاسم الأوسط (الأب)"
            name="middlename"
            placeholder="سامي"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            required={true}
          />

          <TextInput
            type="text"
            label="الاسم الأول (الجد)"
            name="lastname"
            placeholder="محمد"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required={true}
          />

          <RadioInput
            label="النوع"
            name="gender"
            valuesArr={["ذكر", "أنثى"]}
            onChange={(e) => setGender(e.target.value)}
            required={true}
          />

          {/* <CustomSelect
            name={"select"}
            label={"اختر القطاع"}
            data={[
              { id: 1, name: "العربية" },
              { id: 2, name: "English" },
            ]}
            displayMember={"name"}
            valueMember={"id"}
            selectedValue={selectedLanguage}
            required={true}
            onChange={(e) => setSelectedLanguage(e.target.value)}/> */}

          <TextInput
            type="text"
            name="الاسم الأول"
            placeholder="عبدالرحمن"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required={true}
          />
        </form>
      </section>
    </div>
  );
};

export default AddScout;
