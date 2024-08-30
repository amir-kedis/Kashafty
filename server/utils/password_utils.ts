import bcrypt from "bcryptjs";

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hashSync(password, 10);
}

async function validatePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compareSync(password, hashedPassword);
}

export { hashPassword, validatePassword };
