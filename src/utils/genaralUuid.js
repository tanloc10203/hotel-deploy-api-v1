import { v4 as uuidv4 } from "uuid";

const createUUID = (options) => {
  return uuidv4(options).split("-").join("");
};

export default createUUID;
