import { FormEvent, useState } from "react";
import PageTitle from "../common/PageTitle";
import TextInput, { TextArea, RadioInput } from "../common/Inputs";
import CustomSelect from "../common/CustomSelect";
import Button from "../common/Button";
import { useGetSectorsQuery } from "../../redux/slices/sectorApiSlice";
import { useSendNotificationMutation } from "../../redux/slices/notificationsApiSlice";
import "./sendNotificationPage.scss";
import { toast } from "react-toastify";

export default function SendNotificationPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [toWhom, setToWhom] = useState("");
  const [receiver, setReceiver] = useState("");

  const { data: sectorsData, isFetching: isFetchingSectors } =
    useGetSectorsQuery({});

  const [sendNotification, { isLoading: isLoadingSendNotification }] =
    useSendNotificationMutation();

  let sectors = [];

  if (sectorsData && !isFetchingSectors) {
    sectors = sectorsData.body;
    if (sectors.length === 0) {
      sectors = [{ baseName: "لا يوجد قطاع", suffixName: "" }];
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      toast.success("تم إرسال الإشعار بنجاح");

      const response = await sendNotification({
        type: "other",
        title,
        message,
        sectorBaseName:
          toWhom === "إرسال إلى قطاع" ? receiver.split(" ")[0] : "",
        sectorSuffixName:
          toWhom === "إرسال إلى قطاع" ? receiver.split(" ")[1] : "",
      }).unwrap();

      toast.success(response.message);
    } catch (err) {
      console.log(err);
      toast.error("حدث خطأ أثناءإرسال الإشعار");
    }
  };

  return (
    <div className="send-notification container">
      <PageTitle title="إرسال إشعار" />
      <form onSubmit={handleSubmit}>
        <div className="form-element">
          <TextInput
            type="text"
            name="title"
            placeholder="عنوان الإشعار"
            label="عنوان الإشعار"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required={true}
          />
        </div>
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
        {isLoadingSendNotification && (
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
