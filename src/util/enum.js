export const NO_IDX = -1;
export const NO_ID = "-1";

const deepCopyAry = (ary) => {
  return JSON.parse(JSON.stringify(ary));
};

export const ORDER_TEMP = () => {
  const TEMP = {
    id: NO_ID,
    item_id: NO_ID,
    count: 1,
    note: "",
    display: true,
    user_uid: ""
  };

  return deepCopyAry(TEMP);
};

export const ITEM_TEMP = () => {
  const TEMP = {
    id: "",
    name: "",
    price: 0,
    stock: 0,
    img: "",
    update_time: "",
    display: true
  };

  return deepCopyAry(TEMP);
};

export const ERROR_MSG = {
  LOGIN_FAILED: "login failed",
  IS_REQUIRED: "this field is required",
  AT_LEAST_ONE: "at least 1",
  AT_LEAST_ZERO: "at least 0",
  UNDERSTOCK: "understock"
};

export const USER_TYPE = {
  1: "ADMIN",
  2: "CUSTOMER",
  ADMIN: "1",
  CUSTOMER: "2",
  NONE: "-1"
};
