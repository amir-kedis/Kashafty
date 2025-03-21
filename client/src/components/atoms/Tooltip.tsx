import { ReactNode, useState } from "react";
import "./Tooltip.scss";

interface TooltipProps {
  text: string;
  children: ReactNode;
  className?: string;
}

const Tooltip = ({ text, children, className = "" }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div 
      className={`tooltip-container ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && <div className="tooltip-text">{text}</div>}
    </div>
  );
};

export default Tooltip;