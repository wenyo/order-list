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
