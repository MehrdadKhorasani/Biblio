import { orderStatusToPersian } from "../../utils/orderStatusToPersian";

const getOrderSteps = (status) => {
  const stepsNormal = ["pending", "paid", "shipped", "delivered"];
  const stepsCancelled = ["pending", "cancelled"];

  if (
    status.toLowerCase() === "cancelled" ||
    status.toLowerCase() === "canceled"
  ) {
    return stepsCancelled;
  }
  return stepsNormal;
};

const OrderStatusBar = ({ currentStatus }) => {
  const steps = getOrderSteps(currentStatus.toLowerCase());
  const currentIndex = steps.indexOf(currentStatus.toLowerCase());

  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex;

        return (
          <div key={step} className="flex items-center gap-2 flex-1">
            {/* دایره وضعیت */}
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center
                ${isCompleted ? "bg-green-500 text-white" : "bg-gray-300 text-gray-500"}`}
            >
              {index + 1}
            </div>

            {/* نام وضعیت */}
            <span className="text-sm font-medium">
              {orderStatusToPersian(step)}
            </span>

            {/* خط بین مراحل */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 ${index < currentIndex ? "bg-green-500" : "bg-gray-300"}`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusBar;
