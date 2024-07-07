import React from "react";
import PageTitle from "../common/PageTitle";
import "./AssignCaptainPage.scss";
import ChangeCaptainType from "./ChangeCaptainType";
import AssignSector from "./AssignSector";
import UnitAssignSector from "./UnitAssignSector";

const AssignCaptainPage: React.FC = () => {
  return (
    <div className="assign-captain-page container">
      <PageTitle title="تعيين قائد" />
      <div className="assign-captain-page__form__container">
        <h4 className="assign-captain-page__form__title">تغيير رتبة قائد</h4>
        <ChangeCaptainType />
      </div>

      <div className="assign-captain-page__form__container">
        <h4 className="assign-captain-page__form__title">
          تعيين قطاع لقائد عادي
        </h4>
        <AssignSector />
      </div>
      <div className="assign-captain-page__form__container">
        <h4 className="assign-captain-page__form__title">
          تعيين قطاعات لقائد وحدة
        </h4>
        <UnitAssignSector />
      </div>
    </div>
  );
};

export default AssignCaptainPage;
