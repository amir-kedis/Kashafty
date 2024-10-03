import { CaptainType } from "@prisma/client";

const FIXED_CAPTAINS = [
  {
    type: CaptainType.regular,
    email: "regular@gmail.com",
    phoneNumber: "0000000000",
    firstName: "عادي",
    middleName: "عادي",
    lastName: "عادي",
  },
  {
    type: CaptainType.unit,
    email: "unit@gmail.com",
    phoneNumber: "1111111111",
    firstName: "وحدة",
    middleName: "وحدة",
    lastName: "وحدة",
  },
  {
    type: CaptainType.general,
    email: "general@gmail.com",
    phoneNumber: "2222222222",
    firstName: "عام",
    middleName: "عام",
    lastName: "عام",
  },
];

export default FIXED_CAPTAINS;
