import bcrypt from "bcryptjs";

const UNIFIED_PASSWORD = bcrypt.hash("1234", 10);

export default UNIFIED_PASSWORD;
