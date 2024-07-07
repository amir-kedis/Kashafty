import { Link } from "react-router-dom";

// Styles
import "../../assets/styles/components/Button.scss";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  linkTo?: string;
  disabled?: boolean;
  [key: string]: any;
};

export default function Button(props: ButtonProps) {
  const { children, className, linkTo, disabled, ...rest } = props;

  return (
    <>
      {linkTo && !disabled ? (
        <Link to={linkTo} className={`Button ${className}`} {...rest}>
          {children}
        </Link>
      ) : (
        <button className={`Button ${className}`} disabled={disabled} {...rest}>
          {children}
        </button>
      )}
    </>
  );
}
