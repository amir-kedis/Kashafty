import { useEffect, useState } from "react";
import Button from "../common/Button";
import PageTitle from "../common/PageTitle";
import TextInput from "../common/Inputs";
import "./InsertSector.scss";
import { useInsertSectorMutation } from "../../redux/slices/sectorApiSlice";
import { toast } from "react-toastify";
import { useGetCaptainsQuery } from "../../redux/slices/captainsApiSlice";
import CustomSelect from "../common/CustomSelect";

export default function InsertSector() {
  const [sectorBaseName, setSectorBaseName] = useState("");
  const [sectorSuffixName, setSectorSuffixName] = useState("");
  const [unitSectorLeader, setUnitSectorLeader] = useState("");

  const [insertSector, { isLoading: isLoadingInsertSector }] =
    useInsertSectorMutation();

  let unitCaptains = [];

  const { data, isFetching } = useGetCaptainsQuery({});

  if (data && !isFetching) {
    unitCaptains = data.body.filter((captain) => captain.type === "unit");
    if (unitCaptains.length === 0) {
      unitCaptains = [{ captainId: "", firstName: "لا يوجد قادة" }];
    }
  }

  useEffect(() => {
    if (unitCaptains.length === 1) {
      setUnitSectorLeader(unitCaptains[0].captainId);
    }
  }, [unitCaptains]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newSector = {
      baseName: sectorBaseName,
      suffixName: sectorSuffixName,
      unitCaptainId: unitSectorLeader,
    };
    console.log(newSector);

    // Try To Insert New Sector
    try {
      const res = await insertSector(newSector).unwrap();
      if (res.status === 400 || res.status === 500)
        throw new Error("Something went wrong while inserting the sector");
      toast.success("تم إنشاء القطاع بنجاح");
    } catch (err) {
      toast.error("حدث خطأ أثناء إنشاء القطاع");
      toast.error(JSON.stringify(err));
    }
  };

  return (
    <div className="insert-sector container">
      <PageTitle title="إنشاء قطاع جديد" />

      <form onSubmit={handleSubmit} className="insert-sector__from">
        <div className="insert-sector__form__container">
          <TextInput
            label="اسم القطاع"
            type="text"
            name="sectorBaseName"
            value={sectorBaseName}
            onChange={(e) => {
              setSectorBaseName(e.target.value);
              e.target.setCustomValidity("");
            }}
            pattern="^[\u0621-\u064Aa-zA-Z]+$"
            onInvalid={(e) => {
              const inputE = e.target as HTMLInputElement;
              inputE.setCustomValidity(
                "الرجاء إدخال أسم القطاع بطريقة صحيحة (بالعربية او الانجليزية)",
              );
            }}
            placeholder="اسم القطاع"
            required
          />
          <TextInput
            label="رقم القطاع"
            type="text"
            name="sectorSuffixName"
            value={sectorSuffixName}
            onChange={(e) => {
              setSectorSuffixName(e.target.value);
              e.target.setCustomValidity("");
            }}
            pattern="^[\u0621-\u064Aa-zA-Z]+$"
            onInvalid={(e) =>
              (e.target as HTMLInputElement).setCustomValidity(
                "الرجاء إدخال رقم القطاع بطريقة صحيحة",
              )
            }
            placeholder="مثل: أ, ب, ج"
            required
          />
          <CustomSelect
            data={unitCaptains.map((captain) => ({
              ...captain,
              text:
                captain?.firstName +
                " " +
                captain?.middleName +
                " " +
                captain?.lastName,
            }))}
            label="قائد القطاع"
            name="unitSectorLeader"
            selectedValue={unitSectorLeader}
            onChange={(e) => {
              setUnitSectorLeader(e.target.value);
            }}
            required
            displayMember="text"
            valueMember="captainId"
          />
          {isFetching && (
            <p
              style={{
                direction: "rtl",
              }}
            >
              جاري التحميل
            </p>
          )}
        </div>
        <Button className="insert-sector__btn Button--medium Button--primary-darker">
          إنشاء
        </Button>
        {isLoadingInsertSector && (
          <p
            style={{
              direction: "rtl",
            }}
          >
            جاري الإنشاء
          </p>
        )}
      </form>
    </div>
  );
}
