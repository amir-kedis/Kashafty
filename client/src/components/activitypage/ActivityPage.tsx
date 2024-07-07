import React from "react";
import PageTitle from "../common/PageTitle";
import ActivityCard from "../common/ActivityCard";
import Button from "../common/Button";

import "./ActivityPage.scss";
import { useGetAllActivitiesQuery } from "../../redux/slices/activitiesApiSlice";

const ActivityPage: React.FC = () => {
  const { data: activityList, isFetching: isFetchingActivity } =
    useGetAllActivitiesQuery({});

  if (!isFetchingActivity) {
    console.log("activities = ", activityList);
  }
  return (
    <div className="activity-page">
      <PageTitle title="الأنشطة" />
      <Button
        className="Button--medium Button--success add-button"
        linkTo="/add-activity"
      >
        إضافة
      </Button>
      <div className="activity-section">
        {isFetchingActivity
          ? "جاري التحميل..."
          : activityList.body.map((act: any) => {
              return <ActivityCard key={act} activity={act} />;
            })}
      </div>
    </div>
  );
};

export default ActivityPage;
