import "./../../../assets/styles/components/Inputs.scss";
import { InputHTMLAttributes } from "react";

interface RadioButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  disabled: boolean;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  id,
  disabled = false,
  ...rest
}) => {
  return (
    <div
      style={{
        direction: "rtl",
        display: "flex",
        gap: "0.3rem",
        alignItems: "center",
      }}
    >
      <input type="radio" id={id} disabled={disabled} {...rest} />
      <label htmlFor={id} style={{ fontSize: "1rem" }}>
        {label}
      </label>
    </div>
  );
};

export default RadioButton;
