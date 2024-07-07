//----------------------------------------------------------------
// Usage:
{
  /* <CustomSelect
  name={"select"}
  label={"اختر اللغة"}
  data={[
    { id: 1, name: "العربية" },
    { id: 2, name: "English" },
  ]}
  displayMember={"name"}
  valueMember={"id"}
  selectedValue={selectedLanguage}
  required={true}
  onChange={(e) => setSelectedLanguage(e.target.value)} */
}
// />
//----------------------------------------------------------------

type CustomSelectProps = {
  data: any[];
  displayMember: string;
  valueMember: string;
  defaultValue?: string;
  selectedValue: any;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  label?: string;
  required?: boolean;
};

export default function CustomSelect(props: CustomSelectProps) {
  const {
    data,
    displayMember,
    valueMember,
    defaultValue,
    selectedValue,
    onChange,
    name,
    label,
    required,
  } = props;

  return (
    <label className="input input--select">
      <span>{label}</span>
      <select
        name={name}
        onChange={onChange}
        defaultValue={defaultValue}
        required={required}
        value={selectedValue}
      >
        <option value="" disabled>
          اختر
        </option>
        {data.map((item) => (
          <option key={item[valueMember]} value={item[valueMember]}>
            {item[displayMember]}
          </option>
        ))}
      </select>
    </label>
  );
}
