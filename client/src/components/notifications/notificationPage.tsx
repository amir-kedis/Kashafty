import PageTitle from "../common/PageTitle";
import Alert from "../common/Alerts";
import "./notificationPage.scss";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useUpdateNotificationMutation,
} from "../../redux/slices/notificationsApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function NotificationPage() {
  const user = useSelector((state: RootState) => state.auth.userInfo);

  const { data: notifications, isFetching: isFetchingNotifications } =
    useGetNotificationsQuery({
      captainId: user.captainId,
    });

  const { data: ReadNotifications, isFetching: isFetchingReadNotifications } =
    useGetNotificationsQuery({
      captainId: user.captainId,
      status: "READ",
    });

  const [updateNotification] = useUpdateNotificationMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  return (
    <>
      <div className="notifications container">
        <PageTitle title="الرسائل الواردة" />
        <div className="notificationBox">
          {notifications?.body?.length !== 0 &&
            notifications?.body?.map((notification) => {
              return (
                <Alert
                  key={notification.id}
                  title={notification.title}
                  info={notification.message}
                  OnShowMoreClick={() => {}}
                  OnCloseClick={() => {
                    updateNotification({
                      status: "READ",
                      id: notification.id,
                    });
                  }}
                  showRightBox={true}
                  color={
                    notification.type == "attendance" ? "red" : "mint-green"
                  }
                />
              );
            })}
          <PageTitle title="الرسائل المقروءة" />
          {ReadNotifications?.body?.length !== 0 &&
            ReadNotifications?.body?.map((notification) => {
              return (
                <Alert
                  key={notification.id}
                  title={notification.title}
                  info={notification.message}
                  buttontext={"حذف"}
                  OnShowMoreClick={() => {
                    deleteNotification({
                      id: notification.id,
                    });
                  }}
                  OnCloseClick={() => {
                    updateNotification({
                      status: "READ",
                      id: notification.id,
                    });
                  }}
                  showRightBox={true}
                  color={
                    notification.type == "attendance" ? "red" : "mint-green"
                  }
                />
              );
            })}
        </div>
      </div>
    </>
  );
}
