import React, { FormEvent } from "react";
import { toast } from "react-toastify";
import { useGetCaptainsQuery } from "../../redux/slices/captainsApiSlice";
import Button from "../common/Button";
import CustomSelect from "../common/CustomSelect";
import { useState } from "react";
import {
  useGetSectorsQuery,
  useUpdateSectorUnitCaptainMutation,
} from "../../redux/slices/sectorApiSlice";

const UnitAssignSector: React.FC = () => {
  const [chosenCaptainId, setChosenCaptainId] = useState("");
  const [chosenSectorFullName, setChosenSectorFullName] = useState("");

  const [assignSector, { isLoading: isLoadingAssignSector }] =
    useUpdateSectorUnitCaptainMutation();

  let {
    data: captains,
    isFetching: isFetchingCaptains,
    isSuccess,
  } = useGetCaptainsQuery({});

  let {
    data: sectors,
    isFetching: isFetchingSectors,
    isSuccess: isSuccessSectors,
  } = useGetSectorsQuery({});

  if (isSuccess) {
    console.log({ captains: captains?.body });
    captains = captains?.body;
  }

  if (isSuccessSectors) {
    console.log({ sectors: sectors?.body });
    sectors = sectors?.body;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    console.log({
      UnitCaptainId: chosenCaptainId,
      baseName: chosenSectorFullName.split(" - ")[0],
      suffixName: chosenSectorFullName.split(" - ")[1] || "",
    });

    try {
      const res = await assignSector({
        unitCaptainId: chosenCaptainId,
        baseName: chosenSectorFullName.split(" - ")[0],
        suffixName: chosenSectorFullName.split(" - ")[1] || "",
      }).unwrap();
      console.log(res);
      if (res.status === 400 || res.status === 500)
        throw new Error("Something went wrong while assigning the sector");
      toast.success("تم تعيين القائد بنجاح");
    } catch (err) {
      toast.error("حدث خطأ أثناء تعيين القائد");
      console.log(JSON.stringify(err));
      toast.error(JSON.stringify(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="assign-sector-to-captain">
      <CustomSelect
        name={"choose-sector"}
        label={"أختر القطاع"}
        data={
          isFetchingSectors
            ? [{ sectorId: "", fullName: "جاري التحميل" }]
            : !sectors
              ? [{ sectorId: "", fullName: "لا يوجد قطاعات" }]
              : sectors?.map((sector) => ({
                  ...sector,
                  fullName: sector.baseName + " - " + sector.suffixName,
                }))
        }
        displayMember={"fullName"}
        valueMember={"fullName"}
        selectedValue={chosenSectorFullName}
        required={true}
        onChange={(e) => {
          setChosenSectorFullName(e.target.value);
        }}
      />
      <CustomSelect
        name={"choose-captain-for-sector"}
        label={"أختر قائد"}
        data={
          isFetchingCaptains
            ? [{ captainId: "", fullName: "جاري التحميل" }]
            : !captains
              ? [{ captainId: "", fullName: "لا يوجد قادة" }]
              : captains
                  ?.filter((captain) => captain.type === "unit")
                  ?.map((captain) => ({
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
      {isLoadingAssignSector && (
        <p
          style={{
            direction: "rtl",
          }}
        >
          جاري التحميل
        </p>
      )}

      <Button className="change-captain-role__btn Button--medium Button--regular">
        إضافة
      </Button>
    </form>
  );
};

export default UnitAssignSector;
