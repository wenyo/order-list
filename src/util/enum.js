export const NO_IDX = -1;
export const NO_ID = "-1";

export const ORDER_TEMP = () => {
  const TEMP = {
    id: NO_ID,
    name: "",
    count: 1,
    price: 0,
    note: "",
    display: true
  };

  return JSON.parse(JSON.stringify(TEMP));
};

export const ERROR_MSG = {
  IS_REQUIRED: "this field is required",
  AT_LEAST_ONE: "at least 1",
  AT_LEAST_ZERO: "at least 0"
};
