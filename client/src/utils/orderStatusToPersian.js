export const orderStatusToPersian = (status) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "در انتظار پرداخت";
    case "paid":
      return "پرداخت شده";
    case "shipped":
      return "ارسال شده";
    case "delivered":
      return "تحویل داده شده";
    case "cancelled":
    case "canceled":
      return "لغو شده";
    default:
      return status;
  }
};
