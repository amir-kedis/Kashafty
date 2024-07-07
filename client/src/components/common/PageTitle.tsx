import PropTypes from "prop-types";
import "../../assets/styles/components/PageTitle.scss";

const PageTitle = ({ title }) => {
  return (
    <div className="pageTitle container">
      <h1>{title}</h1>
    </div>
  );
};

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default PageTitle;
