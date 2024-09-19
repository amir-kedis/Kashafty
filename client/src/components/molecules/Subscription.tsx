import TextInput from "../common/Inputs";

export default function Subscription({ subscription, setSubscription }) {
  return (
    <div className="subscription-box">
      <div className="info-box colorful">
        <h4>تسجيل الاشتراك</h4>
        <TextInput
          name="subscription"
          label=""
          type="number"
          placeholder="المبلغ المدفوع"
          value={subscription.toString()}
          onChange={(e) => setSubscription(parseInt(e.target.value))}
          required={true}
        />
        <p>يرجى إدخال إجمالي الاشتراك الفعلي</p>
      </div>
    </div>
  );
}
