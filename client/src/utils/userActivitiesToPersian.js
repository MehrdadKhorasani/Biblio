export const userActivitiesToPersian = (action) => {
  switch (action) {
    case "CREATE_USER":
      return "ایجاد کاربر";
    case "UPDATE_USER":
      return "ویرایش کاربر";
    case "DELETE_USER":
      return "حذف کاربر";
    case "CHANGE_PASSWORD":
      return "تغییر رمز عبور";
    case "CREATE_BOOK":
      return "ایجاد کتاب";
    case "UPDATE_BOOK":
      return "ویرایش کتاب";
    case "DELETE_BOOK":
      return "حذف کتاب";
    case "CREATE_ORDER":
      return "ایجاد سفارش";
    case "UPDATE_ORDER_STATUS":
      return "تغییر وضعیت سفارش";
    case "CHANGE_MY_PASSWORD":
      return "تغییر رمز عبور";
    case "UPDATE_PROFILE":
      return "بروزرسانی پروفایل";
    default:
      return action;
  }
};
