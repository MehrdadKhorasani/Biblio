export const toPersianNumber = (number) => {
  return number.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
};
