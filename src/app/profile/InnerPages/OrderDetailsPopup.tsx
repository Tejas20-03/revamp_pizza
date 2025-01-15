import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { AiOutlineShoppingCart } from "react-icons/ai";

interface OrderDetailsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: any;
  selectedOrderID: string | null;
  handleOrderAgain: (orderDetails: any) => void;
}

const OrderDetailsPopup: React.FC<OrderDetailsPopupProps> = ({
  isOpen,
  onClose,
  orderDetails,
  selectedOrderID,
  handleOrderAgain,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-hidden">
      <div className="bg-gray-100 dark:bg-[#202020] w-full sm:max-w-[800px] h-screen sm:h-[690px] z-60 sm:rounded-lg shadow-xl overflow-hidden md:overflow-y-auto slide-up">
        <div className="flex items-center justify-between px-4 py-6 border-b bg-white dark:bg-[#121212] dark:text-white">
          <button
            onClick={onClose}
            className="flex items-center bg-[var(--primary-light)] p-2 rounded-full"
          >
            <IoArrowBack size={24} />
          </button>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <span className="font-bold md:text-3xl text-xl">
              Order #{selectedOrderID}
            </span>
          </div>
        </div>
        <div className="p-2">
          <div className="mt-1">
            <div className="space-y-2">
              {orderDetails.Data.map((item: any) => (
                <div
                  key={item.ItemID}
                  className="flex flex-col border-b py-6 shadow-[5px_0px_20px_rgba(0,0,0,0.1)] rounded-lg px-2 bg-white dark:bg-[#121212] dark:text-white"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{item.ProductName}</span>
                    <span className="text-sm font-light bg-[#00c40c] text-white p-1 rounded">
                      Rs. {item.Price}
                    </span>
                  </div>
                  {item.options && item.options.length > 0 && (
                    <div className="mt-2">
                      {item.options.map((option: any) => (
                        <div
                          key={option.OptionID}
                          className="text-[14px] text-gray-600 dark:text-gray-400 ml-2"
                        >
                          {option.OptionGroupName}: {option.OptionName} x{" "}
                          {option.Quantity}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <button
                className="text-black uppercase font-extrabold flex items-center gap-2 text-[14px]"
                onClick={() => handleOrderAgain(orderDetails)}
              >
                Order Again
                <AiOutlineShoppingCart size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPopup;
