export const bookStockToPersian = (action) => {
  switch (action) {
    case "DECREASE_STOCK":
      return "کاهش موجودی";
    case "INCREASE_STOCK":
      return "افزایش موجودی";
    default:
      return action;
  }
};
