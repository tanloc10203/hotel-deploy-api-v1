import _ from "lodash";

// Sử dụng cho vnpay
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }

  str.sort();

  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }

  return sorted;
}

const getFieldOfObject = ({ fileds = [], object = {} }) => {
  if (_.isEmpty(object)) return {};

  return _.pick(object, fileds);
};

const deleteKeyObjectOrNullOrUndefinedOrEmpty = (obj) => {
  let newObj = {};

  Object.keys(obj).forEach((key) => {
    if (!obj[key]) {
      delete obj[key];
    } else {
      newObj = { ...newObj, [key]: obj[key] };
    }
  });

  return newObj;
};

function generateOrderId(date = "") {
  let now = new Date();
  if (date) {
    now = new Date(date);
  }
  const year = now.getFullYear();
  const month = ("0" + (now.getMonth() + 1)).slice(-2);
  const day = ("0" + now.getDate()).slice(-2);
  const hours = ("0" + now.getHours()).slice(-2);
  const minutes = ("0" + now.getMinutes()).slice(-2);
  const seconds = ("0" + now.getSeconds()).slice(-2);

  const orderId = `${year}${month}${day}${hours}${minutes}${seconds}`;
  return orderId;
}

function formatDate(dateInput) {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);

  return `${day}-${month}-${year}`;
}

export {
  deleteKeyObjectOrNullOrUndefinedOrEmpty,
  formatDate,
  generateOrderId,
  getFieldOfObject,
  sortObject,
};
