import "../../assets/styles/components/infoBox.scss";

type InfoBoxProps = {
  title: string;
  value: any;
  width?: "narrow" | "wide";
  color?: "dark" | "purple" | "colorful";
  spans?: boolean;
};

const InfoBox = ({
  title,
  value,
  width = "narrow",
  color = "dark",
  spans,
}: InfoBoxProps) => {
  const spanClass = spans ? "span-2-cols" : "";
  return (
    <div className={"info-box " + color + " " + width + " " + spanClass}>
      <h6>{title}</h6>
      <h6> {value}</h6>
    </div>
  );
};

export default InfoBox;
