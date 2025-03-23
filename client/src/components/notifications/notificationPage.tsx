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

  // Queries for unread and read notifications
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

  // Mutations for notification actions
  const [updateNotification] = useUpdateNotificationMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [bulkUpdateNotifications] = useBulkUpdateNotificationsMutation();
  const [bulkDeleteNotifications] = useBulkDeleteNotificationsMutation();

  // Handle marking a single notification as read with optimistic update
  const handleMarkAsRead = (notification) => {
    // Optimistic update - modify the cache immediately
    updateNotification({
      status: "READ",
      id: notification.id,
    }, {
      // Optimistic update configuration
      optimisticUpdate: {
        // Remove from unread list
        unreadList: notifications?.body?.filter(n => n.id !== notification.id) || [],
        // Add to read list
        readList: [notification, ...(ReadNotifications?.body || [])]
      }
    });
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    if (!notifications?.body?.length) {
      toast.info("لا توجد إشعارات غير مقروءة");
      return;
    }

    setIsMarkingAll(true);
    try {
      // Get all unread notification IDs
      const notificationIds = notifications.body.map(notification => notification.id);
      
      // Optimistic update - move all to read immediately in UI
      const unreadNotifications = [...(notifications.body || [])];
      
      // Call API to update all notifications
      await bulkUpdateNotifications({
        ids: notificationIds,
        status: "READ"
      }).unwrap();
      
      toast.success("تم تعليم جميع الإشعارات كمقروءة");
      
      // Refetch both lists to ensure consistency
      refetchUnread();
      refetchRead();
    } catch (error) {
      toast.error("حدث خطأ أثناء تعليم الإشعارات كمقروءة");
      console.error(error);
    } finally {
      setIsMarkingAll(false);
    }
  };

  // Handle deleting all read notifications
  const handleDeleteAllRead = async () => {
    if (!ReadNotifications?.body?.length) {
      toast.info("لا توجد إشعارات مقروءة للحذف");
      return;
    }

    setIsDeletingAll(true);
    try {
      // Get all read notification IDs
      const notificationIds = ReadNotifications.body.map(notification => notification.id);
      
      // Call API to delete all read notifications
      await bulkDeleteNotifications({
        ids: notificationIds
      }).unwrap();
      
      toast.success("تم حذف جميع الإشعارات المقروءة");
      
      // Refetch read list
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
