import "../../assets/styles/components/NotificationBox.scss";
import { useGetAllAlertsQuery } from "../../redux/slices/alertApiSlice";
import Alert from "./Alerts";

export default function NotificationBox() {
  const { data: alerts, isFetching: isFetchingAlerts } = useGetAllAlertsQuery({
    status: "unread",
    contentType: "all",
  });

  return (
    <div className="notificationBox">
      {isFetchingAlerts
        ? "جاري التحميل"
        : alerts?.body?.length === 0
          ? "لا يوجد إشعارات"
          : alerts?.body?.map((alert) => {
              return (
                <Alert
                  key={alert.notificationId}
                  title={"إشعار " + alert.notificationId}
                  info={alert.message}
                  buttontext={"عرض المزيد"}
                  Onclick={alert.onClick}
                  showRightBox={true}
                  color={
                    alert.contentType == "attendance" ? "red" : "mint-green"
                  }
                />
              );
            })}
    </div>
  );
}
