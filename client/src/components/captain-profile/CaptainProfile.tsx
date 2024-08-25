import Button from "../common/Button";
import PageTitle from "../common/PageTitle";
import "./CaptainProfile.scss";
import { RootState } from "../../redux/store";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

export default function CaptainProfile() {
  const userInfo = useAuthUser();

  return (
    <div className="captain-profile">
      <PageTitle title="الصفحة الشخصية" />
      <div className="captain-profile__avatar">
        <img src="./avatar.png" alt="captain avatar" />
      </div>
      <h4 className="captain-profile__name">
        {userInfo.firstName} {userInfo.middleName} {userInfo.lastName}
      </h4>
      <h6 className="captain-profile__type">
        {
          {
            general: "قائد / نائب قائد عام",
            regular: "قائد",
            unit: "قائد وحدة",
          }[userInfo.type]
        }
      </h6>
      <div className="captain-profile__info">
        <h4>وسائل التواصل</h4>
        <div className="captain-profile__info__item">
          <h6> رقم التليفون</h6>
          <p>{userInfo.phoneNumber}</p>
        </div>
        <div className="captain-profile__info__item">
          <h6>البريد الالكتروني</h6>
          <p>{userInfo.email}</p>
        </div>
        <div className="captain-profile__info__item">
          <h6>القطاعات</h6>
          <p>
            {/* TODO: Handle What will be displayed to General and unit captains */}
            {userInfo.rSectorBaseName
              ? userInfo.rSectorBaseName + " " + userInfo.rSectorSuffixName
              : "لا يوجد"}
            {(userInfo.type === "unit" || userInfo.type == "general") && ""}
          </p>
        </div>
        <Button
          linkTo="/edit-password"
          className="captain-profile__info__btn Button--medium Button--primary"
        >
          تعديل الرمز السري
        </Button>
      </div>
    </div>
  );
}
