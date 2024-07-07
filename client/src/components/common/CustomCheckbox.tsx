type CustomCheckboxProps = {
  labels: string[];
  values: string[];
  checkedValues: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  required?: boolean;
  className?: string;
};

export default function CustomCheckbox(props: CustomCheckboxProps) {
  const { labels, values, checkedValues, onChange, name, required, className } =
    props;
  return (
    <div className={"input input--checkbox" + " " + className}>
      {labels.map((label, index) => (
        <label key={index}>
          <input
            type="checkbox"
            name={name}
            value={values[index]}
            onChange={onChange}
            required={required}
            checked={checkedValues.includes(values[index])}
            style={{
              marginBlock: "0.5rem",
              marginInline: "0.5rem",
            }}
          />
          <span
            style={{
              userSelect: "none",
            }}
          >
            {label}
          </span>
        </label>
      ))}
    </div>
  );
}
