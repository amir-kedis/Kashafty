import React, { FormEvent, useState } from "react";

import PageTitle from "../common/PageTitle";
import TextInput from "../common/Inputs";
import CustomSelect from "../common/CustomSelect";
import Button from "../common/Button";

import "../../assets/styles/components/MoneyPage.scss";

import { useInsertActivityMutation } from "../../redux/slices/activitiesApiSlice";
import { useGetAllWeeksQuery } from "../../redux/slices/termApiSlice";
import { toast } from "react-toastify";

const AddActivityPage: React.FC = () => {
  const [activityName, setActivityName] = useState("");
  const [activityType, setActivityType] = useState("");
  const [activityPlace, setActivityPlace] = useState("");
  const [activityDay, setActivityDay] = useState("");
  const [activityWeek, setActivityWeek] = useState("");

  const activityTypesList = [
    { value: "entertainment", name: "ترفيه" },
    { value: "rowing", name: "تجديف" },
    { value: "camping", name: "نخييم" },
    { value: "wildCooking", name: "طهي في البرية" },
    { value: "scouting", name: "كشفي" },
    { value: "volunteering", name: "تطوعي" },
    { value: "other", name: "غير ذلك" },
  ];

  const days = [
    { name: "السبت", value: "sat" },
    { name: "الأحد", value: "sun" },
    { name: "الاثنين", value: "mon" },
    { name: "الثلاثاء", value: "tue" },
    { name: "الأربعاء", value: "wed" },
    { name: "الخميس", value: "thu" },
    { name: "الجمعة", value: "fri" },
  ];

  const [insertActivity, { isLoading }] = useInsertActivityMutation();
  const { data: WeeksAvailable, isFetching: isFetchingWeeks } =
    useGetAllWeeksQuery({});

  let weeksList: any;
  if (!isFetchingWeeks && WeeksAvailable) {
    weeksList = WeeksAvailable.body.map((week: any) => {
      return {
        ...week,
        allWeekInfo: week.weekNumber + " - " + week.startDate.split("T")[0],
        weekId: week.termNumber + "-" + week.weekNumber,
      };
    });
    console.log("weeks = ", WeeksAvailable, weeksList);
  }
  const HandleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newActivity = {
      name: activityName,
      place: activityPlace,
      weekNumber: activityWeek.split("-")[1],
      termNumber: activityWeek.split("-")[0],
      day: activityDay,
      type: activityType,
    };

    console.log(newActivity);
    try {
      const res = await insertActivity(newActivity).unwrap();
      if (res.status === 400 || res.status === 500 || res.status === 404)
        throw new Error("Something went wrong while inserting the activity");
      toast.success("تم إنشاء النشاط بنجاح");
    } catch (err) {
      console.log();
      toast.error("حدث خطأ أثناء إنشاء النشاط");
      toast.error(err?.data?.arabicMessage);
      console.log(err?.data?.message);
    }
  };

  return (
    <div className="money-page">
      <PageTitle title="إضافة نشاط" />
      <form className="add-item" onSubmit={HandleSubmit}>
        <h4>إضافة بند</h4>
        <TextInput
          type="text"
          label="اسم النشاط"
          name="activityName"
          placeholder="أضف النشاط"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          required={true}
        />

        <CustomSelect
          label="اختر النوع"
          name="activityType"
          data={activityTypesList}
          displayMember="name"
          valueMember="value"
          selectedValue={activityType}
          onChange={(e) => setActivityType(e.target.value)}
          required={true}
        />

        <TextInput
          type="text"
          label="اسم المكان"
          name="activityPlace"
          placeholder="اختر اسم المكان"
          value={activityPlace}
          onChange={(e) => setActivityPlace(e.target.value)}
          required={false}
        />

        <CustomSelect
          label="اختر اليوم"
          name="activityDay"
          data={days}
          displayMember="name"
          valueMember="value"
          selectedValue={activityDay}
          onChange={(e) => setActivityDay(e.target.value)}
          required={true}
        />
        <CustomSelect
          label="اختر الأسبوع"
          name="activityWeek"
          data={isFetchingWeeks ? [] : weeksList}
          displayMember="allWeekInfo"
          valueMember="weekId"
          selectedValue={activityWeek}
          onChange={(e) => setActivityWeek(e.target.value)}
          required={true}
        />

        <Button className="insert-sector__btn Button--medium Button--primary-darker">
          إضافة
        </Button>

        {isLoading && (
          <p
            style={{
              direction: "rtl",
            }}
          >
            جاري الإضافة
          </p>
        )}
      </form>
    </div>
  );
};

export default AddActivityPage;
