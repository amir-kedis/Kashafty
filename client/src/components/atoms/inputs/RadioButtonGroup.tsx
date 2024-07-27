import RadioButton from "./RadionButton";

export interface IOption {
  label: string;
  name?: string;
  disabled?: boolean;
}

export interface IOptionGroup {
  label?: string;
  options: IOption[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedItem: String;
}

const RadioButtonGroup = ({
  label,
  options,
  onChange,
  selectedItem,
}: IOptionGroup) => {
  return (
    <fieldset style={{ border: "none", appearance: "none" }}>
      <legend
        style={{
          textAlign: "right",
          direction: "rtl",
        }}
      >
        {label}
      </legend>
      <div style={{ display: "flex", gap: "0.5rem", direction: "rtl" }}>
        <RenderOptions
          selectedItem={selectedItem}
          options={options}
          onChange={onChange}
        />
      </div>
    </fieldset>
  );
};
export default RadioButtonGroup;

interface RenderOptionsProps {
  options: IOption[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedItem: String;
}

const RenderOptions = ({
  options,
  onChange,
  selectedItem,
}: RenderOptionsProps) => {
  return options.map(({ label, name, disabled }) => {
    const optionId = `radio-option-${label.replace(/\s+/g, "")}`;

    return (
      <RadioButton
        label={label}
        key={optionId}
        id={optionId}
        value={label}
        name={name}
        disabled={disabled}
        checked={selectedItem === label}
        onChange={onChange}
      />
    );
  });
};
