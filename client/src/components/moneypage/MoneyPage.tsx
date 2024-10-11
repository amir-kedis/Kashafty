import React, { useState } from "react";
import TextInput, { RadioInput } from "../common/Inputs";
import PageTitle from "../common/PageTitle";
import Button from "../common/Button";
import InfoSectionMoneyPage from "./InfoSectionMoneyPage";
import { useInsertOtherItemMutation } from "../../redux/slices/financeApiSlice";
import { toast } from "react-toastify";
import "../../assets/styles/components/MoneyPage.scss";

const MoneyPage = () => {
  const [item, setItem] = useState("");
  const [description, setDiscription] = useState("");
  const [itemType, setItemType] = useState("");

  const [insertOtherItem, { isLoading: isLoadingInsertingItem }] =
    useInsertOtherItemMutation();

  const HandleSubmit = async (e) => {
    e.preventDefault();
    const newItem = {
      value: item,
      type:
        itemType === "مصروف" ? "expense" : itemType === "ايراد" ? "income" : "",
      description: description,
    };

    try {
      const res = await insertOtherItem(newItem).unwrap();
      if (res.status === 400 || res.status === 500)
        throw new Error("Something went wrong while inserting the item");
      toast.success("تم إضافة بند بنجاح");
    } catch (err) {
      console.log();
      toast.error("حدث خطأ أثناء إضافة بند");
      toast.error(err?.data?.arabicMessage);
      console.log(err?.data?.message);
    }
  };

  return (
    <div className="money-page container">
      <PageTitle title="إدارة الماليات" />
      <form className="add-item" onSubmit={HandleSubmit}>
        <h4>إضافة بند</h4>
        <TextInput
          type="text"
          label="القيمة"
          name="item"
          placeholder="أضف قيمة"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          required={true}
        />

        <RadioInput
          label="النوع"
          name="itemType"
          checkedValue={itemType}
          valuesArr={["ايراد", "مصروف"]}
          onChange={(e) => setItemType(e.target.value)}
          required={true}
        />

        <TextInput
          type="text"
          label="الوصف"
          name="description"
          placeholder="أضف وصف"
          value={description}
          onChange={(e) => setDiscription(e.target.value)}
          required={false}
        />

        <Button className="Button--medium Button--primary-darker">إضافة</Button>
      </form>

      <section>
        <h4 className="section__heading">الماليات</h4>
        <InfoSectionMoneyPage />
      </section>
    </div>
  );
};

export default MoneyPage;
