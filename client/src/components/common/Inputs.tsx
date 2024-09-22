import "./../../assets/styles/components/Inputs.scss";

type TextInputProps = {
  label?: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  pattern?: string;
  onInvalid?: (e: React.FormEvent<HTMLInputElement>) => void;
  dir?: string;
  disabled?: boolean;
};

function TextInput({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  required,
  pattern,
  onInvalid,
  dir,
  disabled,
}: TextInputProps) {
  return (
    <label className="input input--text">
      {label}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        pattern={pattern}
        onInvalid={onInvalid}
        disabled={disabled}
        {...(dir && { style: { direction: dir as "ltr" | "rtl" } })}
      />
    </label>
  );
}

type TextAreaProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  required?: boolean;
};

function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
}: TextAreaProps) {
  return (
    <label className="input input--text">
      {label}
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </label>
  );
}

type RadioInputProps = {
  label: string;
  name: string;
  required: boolean;
  valuesArr: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checkedValue?: string;
};

function RadioInput({
  label,
  name,
  required,
  valuesArr,
  onChange,
  checkedValue,
}: RadioInputProps) {
  return (
    <label className="input input--radio">
      {label}
      <div className="radio-buttons">
        {valuesArr.map((value) => (
          <div key={value}>
            <input
              type="radio"
              name={name}
              value={value}
              onChange={onChange}
              required={required}
              checked={checkedValue === value}
            />
            <span>{value}</span>
          </div>
        ))}
      </div>
    </label>
  );
}

export { RadioInput, TextArea, TextInput };
export default TextInput;
