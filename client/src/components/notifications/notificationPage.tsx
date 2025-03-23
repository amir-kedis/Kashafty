import { useState } from "react";
import PageTitle from "../common/PageTitle";
import Alert from "../common/Alerts";
import Button from "../common/Button";
import "./notificationPage.scss";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useUpdateNotificationMutation,
  useBulkUpdateNotificationsMutation,
  useBulkDeleteNotificationsMutation,
} from "../../redux/slices/notificationsApiSlice";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { toast } from "react-toastify";

export default function NotificationPage() {
  const user = useAuthUser();
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const { 
    data: notifications, 
    isLoading: isLoadingUnread,
    refetch: refetchUnread
  } = useGetNotificationsQuery({
    captainId: user.captainId,
  });

  const { 
    data: ReadNotifications, 
    isLoading: isLoadingRead,
    refetch: refetchRead
  } = useGetNotificationsQuery({
    captainId: user.captainId,
    status: "READ",
  });

  const [updateNotification] = useUpdateNotificationMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [bulkUpdateNotifications] = useBulkUpdateNotificationsMutation();
  const [bulkDeleteNotifications] = useBulkDeleteNotificationsMutation();

  const handleMarkAsRead = (notification) => {
    updateNotification({
      id: notification.id,
      status: "READ"
    });
  };

  const handleMarkAllAsRead = async () => {
    if (!notifications?.body?.length) {
      toast.info("لا توجد إشعارات غير مقروءة");
      return;
    }

    setIsMarkingAll(true);
    try {
      await bulkUpdateNotifications({
        captainId: user.captainId
      }).unwrap();
      
      toast.success("تم تعليم جميع الإشعارات كمقروءة");
      
      refetchUnread();
      refetchRead();
    } catch (error) {
      toast.error("حدث خطأ أثناء تعليم الإشعارات كمقروءة");
      console.error(error);
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleDeleteAllRead = async () => {
    if (!ReadNotifications?.body?.length) {
      toast.info("لا توجد إشعارات مقروءة للحذف");
      return;
    }

    setIsDeletingAll(true);
    try {
      await bulkDeleteNotifications({
        captainId: user.captainId
      }).unwrap();
      
      toast.success("تم حذف جميع الإشعارات المقروءة");
      
      refetchRead();
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الإشعارات المقروءة");
      console.error(error);
    } finally {
      setIsDeletingAll(false);
    }
  };

  const isLoading = isLoadingUnread || isLoadingRead;

  return (
    <>
      <div className="notifications container">
        <PageTitle title="الرسائل الواردة" />
        
        {/* Action buttons for notifications */}
        <div className="notification-actions">
          <Button 
            className="Button--medium Button--primary"
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll || !notifications?.body?.length}
          >
            {isMarkingAll ? "جاري التعليم..." : "تعليم الكل كمقروء"}
          </Button>
          
          <Button 
            className="Button--medium Button--danger"
            onClick={handleDeleteAllRead}
            disabled={isDeletingAll || !ReadNotifications?.body?.length}
          >
            {isDeletingAll ? "جاري الحذف..." : "حذف جميع المقروءة"}
          </Button>
        </div>
        
        <div className="notificationBox">
          {isLoading ? (
            <p className="loading-text">جاري تحميل الإشعارات...</p>
          ) : (
            <>
              {/* Unread notifications */}
              {notifications?.body?.length === 0 ? (
                <p className="no-notifications">لا توجد رسائل جديدة</p>
              ) : (
                notifications?.body?.map((notification) => (
                  <Alert
                    key={notification.id}
                    title={notification.title}
                    info={notification.message}
                    OnShowMoreClick={() => {}}
                    OnCloseClick={() => handleMarkAsRead(notification)}
                    showRightBox={true}
                    color={notification.type === "attendance" ? "red" : "mint-green"}
                    date={notification.createdAt}
                  />
                ))
              )}
              
              {/* Read notifications section */}
              <div className="read-notifications-section">
                <PageTitle title="الرسائل المقروءة" />
                
                {ReadNotifications?.body?.length === 0 ? (
                  <p className="no-notifications">لا توجد رسائل مقروءة</p>
                ) : (
                  ReadNotifications?.body?.map((notification) => (
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
                      OnCloseClick={() => {}}
                      showRightBox={true}
                      color={notification.type === "attendance" ? "red" : "mint-green"}
                      date={notification.createdAt}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
