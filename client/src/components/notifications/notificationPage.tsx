import PageTitle from "../common/PageTitle";
import Alert from "../common/Alerts";
import "./notificationPage.scss";
// import { useGetAllAlertsQuery } from "../../redux/slices/alertApiSlice";

export default function SendNotificationPage() {
  // const { data: alerts, isFetching: isFetchingAlerts } = useGetAllAlertsQuery({
  //   status: "all",
  //   contentType: "all",
  // });
  // return (
  //   <div className="notifications container">
  //     <PageTitle title="الرسائل الواردة" />
  //     <div className="notificationBox">
  //       {isFetchingAlerts
  //         ? "جاري التحميل"
  //         : alerts?.body?.length === 0
  //           ? "لا يوجد إشعارات"
  //           : alerts?.body?.map((alert) => {
  //               return (
  //                 <Alert
  //                   key={alert.notificationId}
  //                   title={"إشعار " + alert.notificationId}
  //                   info={alert.message}
  //                   buttontext={"عرض المزيد"}
  //                   Onclick={alert.onClick}
  //                   showRightBox={true}
  //                   color={
  //                     alert.contentType == "attendance" ? "red" : "mint-green"
  //                   }
  //                 />
  //               );
  //             })}
  //     </div>
  //   </div>
  // );
}
