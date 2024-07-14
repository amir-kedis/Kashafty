import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  useGetNotificationsQuery,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
} from "../../redux/slices/notificationsApiSlice";

import "../../assets/styles/components/NotificationBox.scss";

import { RootState } from "../../redux/store";
import Alert from "./Alerts";
import { NotificationType } from "../../types/prismaTypes";

export default function NotificationBox() {
  const user = useSelector((state: RootState) => state.auth.userInfo);

  const { data: notifications, isFetching: isFetchingAlerts } =
    useGetNotificationsQuery({
      captainId: user.captainId,
    });

  const [updateNotification] = useUpdateNotificationMutation();

  const navigate = useNavigate();

  const getColor = (notType: NotificationType) => {
    switch (notType) {
      case NotificationType.attendance:
        return "red";
      case NotificationType.financeItemCreated:
        return "mint-green";
      case NotificationType.report:
        return "yellow";
      case NotificationType.other:
        return "mint-green";
    }
  };

  console.log(notifications);

  return (
    <div className="notificationBox">
      {isFetchingAlerts
        ? "جاري التحميل"
        : notifications?.body?.length === 0
          ? "لا يوجد إشعارات"
          : notifications?.body?.map((notification) => {
              return (
                <Alert
                  key={notification.id}
                  title={notification.title}
                  info={notification.message}
                  buttontext={"عرض المزيد"}
                  OnShowMoreClick={() => {
                    navigate("/notifications");
                  }}
                  OnCloseClick={() => {
                    updateNotification({
                      status: "READ",
                      id: notification.id,
                    });
                  }}
                  showRightBox={true}
                  color={getColor(notification.type)}
                />
              );
            })}
    </div>
  );
}
