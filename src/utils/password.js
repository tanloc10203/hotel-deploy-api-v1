import bcrypt from "bcrypt";

async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    Promise.reject(error);
  }
}

async function comparePassword(password, passwordHash) {
  try {
    return await bcrypt.compare(password, passwordHash);
  } catch (error) {
    Promise.reject(error);
  }
}

export { hashPassword, comparePassword };
