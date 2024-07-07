import { useState } from "react";
import PageTitle from "../common/PageTitle";
import { TextArea, RadioInput } from "../common/Inputs";
import CustomSelect from "../common/CustomSelect";
import Button from "../common/Button";
import { useGetSectorsQuery } from "../../redux/slices/sectorApiSlice";
import {
  useSendAlertMutation,
  useCreateAlertMutation,
} from "../../redux/slices/alertApiSlice";
import "./sendNotificationPage.scss";
import { toast } from "react-toastify";

export default function SendNotificationPage() {
  const [message, setMessage] = useState("");
  const [toWhom, setToWhom] = useState("");
  const [receiver, setReceiver] = useState("");

  const { data: sectorsData, isFetching: isFetchingSectors } =
    useGetSectorsQuery();

  const [createNotification, { isLoading: isLoadingCreateNotification }] =
    useCreateAlertMutation();

  const [sendNotification, { isLoading: isLoadingSendNotification }] =
    useSendAlertMutation();

  let sectors = [];

  if (sectorsData && !isFetchingSectors) {
    sectors = sectorsData.body;
    if (sectors.length === 0) {
      sectors = [{ baseName: "لا يوجد قطاع", suffixName: "" }];
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let body: any = {
        message: message,
        contentType: "other",
      };
      let res = await createNotification(body).unwrap();
      if (res.status === 400 || res.status === 500)
        throw new Error("Something went wrong while creating notification");

      const notificationId = res?.body?.notificationId;

      if (toWhom === "إرسال إلى الكل") {
        body = {};
      } else {
        body = {
          sectorBaseName: receiver.split(" ")[0],
          sectorSuffixName: receiver.split(" ")[1] || "",
        };
      }
      res = await sendNotification(notificationId, body).unwrap();
      if (res.status === 400 || res.status === 500)
        throw new Error("Something went wrong while sending notification");
      toast.success("تم إرسال الإشعار بنجاح");
    } catch (err) {
      console.log(err);
      toast.error("حدث خطأ أثناءإرسال الإشعار");
      toast.error(JSON.stringify(err));
    }
  };

  return (
    <div className="send-notification container">
      <PageTitle title="إرسال إشعار" />
      <form onSubmit={handleSubmit}>
        <div className="form-element">
          <TextArea
            name="message"
            placeholder="المحتوى"
            label="محتوى الإشعار"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required={true}
          />
        </div>
        <div className="form-element">
          <RadioInput
            label="لمن تريد الإرسال"
            name="toWhom"
            valuesArr={["إرسال إلى الكل", "إرسال إلى قطاع"]}
            onChange={(e) => setToWhom(e.target.value)}
            required={true}
          />
        </div>
        <div className="form-element">
          <CustomSelect
            name="receiver"
            label={"اختر القطاع"}
            data={sectors.map((sector) => {
              return {
                ...sector,
                sectorName: sector.baseName + " " + sector.suffixName,
              };
            })}
            displayMember={"sectorName"}
            valueMember={"sectorName"}
            selectedValue={receiver}
            required={toWhom === "إرسال إلى قطاع"}
            onChange={(e) => setReceiver(e.target.value)}
          />
        </div>
        {isFetchingSectors && (
          <p
            style={{
              direction: "rtl",
            }}
          >
            جاري التحميل
          </p>
        )}
        <Button className="send-button Button--medium Button--primary-darker">
          إرسال الإشعار
        </Button>
        {(isLoadingCreateNotification || isLoadingSendNotification) && (
          <p
            style={{
              direction: "rtl",
            }}
          >
            جاري الإرسال
          </p>
        )}
      </form>
    </div>
  );
}
