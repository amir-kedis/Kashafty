import "../../assets/styles/components/Alert.scss";
import { BellAlertIcon } from "@heroicons/react/24/outline";

type AlertProps = {
  title: string;
  info: string;
  buttontext?: string;
  OnShowMoreClick: () => void;
  OnCloseClick: () => void;
  showRightBox: boolean;
  color: string;
  date?: string | Date; 
};

const Alert = ({
  title,
  info,
  buttontext,
  OnShowMoreClick,
  OnCloseClick,
  showRightBox,
  color,
  date,
}: AlertProps) => {
  const formattedDate = date ? formatDate(date) : null;
  
  return (
    <div className="alert-item">
      <div className="top-bar">
        <div className="title-box">
          <div
            className={
              showRightBox ? "right-box " + color : "right-box hide " + color
            }
          >
            <BellAlertIcon />
          </div>
          <h6 className={"title " + color}>{title}</h6>
        </div>
        
        <div className="right-actions">
          {formattedDate && (
            <span className="date-display">{formattedDate}</span>
          )}
          <svg
            className={"exit-btn " + color}
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="20"
            viewBox="0 0 21 20"
            onClick={OnCloseClick}
          >
            <path
              d="M6.78033 5.21967C6.48744 4.92678 6.01256 4.92678 5.71967 5.21967C5.42678 5.51256 5.42678 5.98744 5.71967 6.28033L9.43934 10L5.71967 13.7197C5.42678 14.0126 5.42678 14.4874 5.71967 14.7803C6.01256 15.0732 6.48744 15.0732 6.78033 14.7803L10.5 11.0607L14.2197 14.7803C14.5126 15.0732 14.9874 15.0732 15.2803 14.7803C15.5732 14.4874 15.5732 14.0126 15.2803 13.7197L11.5607 10L15.2803 6.28033C15.5732 5.98744 15.5732 5.51256 15.2803 5.21967C14.9874 4.92678 14.5126 4.92678 14.2197 5.21967L10.5 8.93934L6.78033 5.21967Z"
              fill="#D1D5DB"
            />
          </svg>
        </div>
      </div>
      <p>{info}</p>
      {buttontext && (
        <button className={"alert-btn " + color} onClick={OnShowMoreClick}>
          {buttontext}
        </button>
      )}
    </div>
  );
};

function formatDate(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  if (isNaN(date.getTime())) {
    return '';
  }
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date >= today) {
    return `اليوم ${date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (date >= yesterday) {
    return `الأمس ${date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('ar-EG', options);
  }
}

export default Alert;
