import "../../assets/styles/components/Alert.scss";
import { BellAlertIcon } from "@heroicons/react/24/outline";

type AlertProps = {
  title: string;
  info: string;
  buttontext: string;
  Onclick: () => void;
  showRightBox: boolean;
  color: string;
};

const Alert = ({
  title,
  info,
  buttontext,
  Onclick,
  showRightBox,
  color,
}: AlertProps) => {
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
        <svg
          className={"exit-btn " + color}
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="20"
          viewBox="0 0 21 20"
        >
          <path
            d="M6.78033 5.21967C6.48744 4.92678 6.01256 4.92678 5.71967 5.21967C5.42678 5.51256 5.42678 5.98744 5.71967 6.28033L9.43934 10L5.71967 13.7197C5.42678 14.0126 5.42678 14.4874 5.71967 14.7803C6.01256 15.0732 6.48744 15.0732 6.78033 14.7803L10.5 11.0607L14.2197 14.7803C14.5126 15.0732 14.9874 15.0732 15.2803 14.7803C15.5732 14.4874 15.5732 14.0126 15.2803 13.7197L11.5607 10L15.2803 6.28033C15.5732 5.98744 15.5732 5.51256 15.2803 5.21967C14.9874 4.92678 14.5126 4.92678 14.2197 5.21967L10.5 8.93934L6.78033 5.21967Z"
            fill="#D1D5DB"
          />
        </svg>
      </div>
      <p>{info}</p>
      <button className={"alert-btn " + color} onClick={Onclick}>
        {buttontext}
      </button>
    </div>
  );
};

export default Alert;
