import React, { FormEvent } from "react";
import { toast } from "react-toastify";
import {
  useGetCaptainsQuery,
  useUpdateCaptainTypeMutation,
} from "../../redux/slices/captainsApiSlice";
import Button from "../common/Button";
import CustomSelect from "../common/CustomSelect";
import { useState } from "react";

const ChangeCaptainType: React.FC = () => {
  const [chosenCaptainId, setChosenCaptainId] = useState("");
  const [type, setType] = useState("regular");

  const [updateCaptainType, { isLoading: isLoadingUpdateCaptainType }] =
    useUpdateCaptainTypeMutation();

  let {
    data: captains,
    isFetching: isFetchingCaptains,
    isSuccess,
  } = useGetCaptainsQuery({});

  if (isSuccess) {
    console.log(captains?.body);
    captains = captains?.body;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log({ captainId: chosenCaptainId, type });

    try {
      const res = await updateCaptainType({
        captainId: chosenCaptainId,
        type,
      }).unwrap();
      if (res.status === 400 || res.status === 500)
        throw new Error("Something went wrong while updating the captain type");
      toast.success("تم تعديل الرتبة بنجاح");
    } catch (err) {
      console.log(err);
      toast.error("حدث خطأ أثناء تعديل الرتبة");
      toast.error(JSON.stringify(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="change-captain-role">
      <CustomSelect
        name={"choose-captain"}
        label={"أختار القائد"}
        data={
          isFetchingCaptains
            ? [{ captainId: "", fullName: "جاري التحميل" }]
            : !captains
              ? [{ captainId: "", fullName: "لا يوجد قادة" }]
              : captains?.map((captain) => ({
                  ...captain,
                  fullName:
                    captain.firstName +
                    " " +
                    captain.middleName +
                    " " +
                    captain.lastName,
                }))
        }
        displayMember={"fullName"}
        valueMember={"captainId"}
        selectedValue={chosenCaptainId}
        required={true}
        onChange={(e) => {
          setChosenCaptainId(e.target.value);
        }}
      />
      {isFetchingCaptains && (
        <p
          style={{
            direction: "rtl",
          }}
        >
          جاري التحميل
        </p>
      )}

      <CustomSelect
        name={"choose-type"}
        label={"أختار الرتبة"}
        data={[
          { name: "قائد عادي", value: "regular" },
          { name: "قائد وحدة", value: "unit" },
          { name: "قائد عام او نائب قائد عام", value: "general" },
        ]}
        displayMember={"name"}
        valueMember={"value"}
        selectedValue={type}
        required={true}
        onChange={(e) => {
          setType(e.target.value);
        }}
      />

      {isLoadingUpdateCaptainType && (
        <p
          style={{
            direction: "rtl",
          }}
        >
          جاري التحميل
        </p>
      )}

      <Button className="change-captain-role__btn Button--medium Button--primary-darker">
        تعيين الرتبة
      </Button>
    </form>
  );
};

export default ChangeCaptainType;
