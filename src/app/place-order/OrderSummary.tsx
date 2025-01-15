interface OrderSummaryProps {
  cartData: {
    VoucherDiscount: number;
    cartSubTotal: number;
    discount: number;
    cartProducts: any[];
    finalTotal: number;
    tax: number;
    deliveryFee: number;
  };
  addressData: {
    addressType: string | null;
    delivery_tax: string | null;
    tax: string | null;
  };
  onConfirmOrder: () => void;
  isLoading: boolean;
}

interface OrderOption {
  OptionGroupName: string;
  OptionName: string;
  Quantity: number;
  Price: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartData,
  addressData,
  onConfirmOrder,
  isLoading,
}) => {
  return (
    <div className="md:col-span-5 sticky top-0 md:fixed md:right-40 md:top-28 md:w-[460px] mt-2 p-2 md:mt-0 space-y-2 pb-24 md:pb-0">
      <div className="space-y-2">
        {cartData.cartProducts.map((item, index) => (
          <div
            key={index}
            className="p-2 bg-white shadow-[5px_0px_20px_rgba(0,0,0,0.1)] rounded-lg"
          >
            <div className="flex gap-2">
              <span className="font-extrabold text-[14px] text-[var(--text-primary)]">
                {item.ProductName}
              </span>
              <span className="font-medium text-[12px] text-white bg-[#8e8e93] px-1  rounded align-middle">
                x {item.Quantity}
              </span>
            </div>
            {item.options &&
              Array.isArray(item.options) &&
              item.options.map((option: OrderOption, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between mt-1 font-normal opacity-70 text-[12px] text-[var(--text-primary)]"
                >
                  <span>
                    {option.OptionGroupName}: {option.OptionName} x
                    {option.Quantity}
                  </span>
                  {option.Price > 0 && (
                    <span>+Rs {option.Price * Number(option.Quantity)}</span>
                  )}
                </div>
              ))}
            <div className="flex justify-between mt-2">
              <span className="font-normal text-[14px] text-[var(--text-primary)]">
                Total
              </span>
              <span className="font-normal text-[11px] text-[var(--text-primary)]">
                +Rs {item.TotalProductPrice}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="border p-3 shadow-[1px_2px_5px_#0000002b] ">
        {cartData.VoucherDiscount > 0 && (
          <div className="flex justify-between py-2 border-t border-dotted border-gray-300">
            <p className="font-semibold">Voucher</p>
            <p>Rs. -{Number(cartData.VoucherDiscount.toFixed(2))}</p>
          </div>
        )}

        <div className="flex justify-between py-2 border-dotted border-gray-300">
          <p className="font-normal opacity-70 text-[16px] text-[var(--text-primary)]">
            Gross Total:
          </p>
          <p className="font-normal text-[16px] text-[var(--text-primary)]">
            Rs.{" "}
            {Math.round(
              cartData.cartProducts.reduce((total, item) => {
                const originalPrice =
                  (item.TotalProductPrice + item.discountGiven) * item.Quantity;
                return total + originalPrice;
              }, 0)
            )}
          </p>
        </div>

        <div className="flex justify-between py-2 border-t border-dotted border-gray-300">
          <p className="font-normal opacity-70 text-[16px] text-[var(--text-primary)]">
            Subtotal:
          </p>
          <p className="font-normal text-[16px] text-[var(--text-primary)]">
            Rs.{cartData.cartSubTotal}
          </p>
        </div>

        <div className="flex justify-between  py-2 border-t border-dotted border-gray-300">
          <p className="font-normal opacity-70 text-[16px] text-[var(--text-primary)]">
            GST ({addressData.delivery_tax}%):
          </p>
          <p className="font-normal text-[16px] text-[var(--text-primary)]">
            Rs. {cartData.tax}
          </p>
        </div>

        <div className="flex justify-between py-2 border-t border-dotted border-gray-300">
          <p className="font-normal opacity-70 text-[16px] text-[var(--text-primary)]">
            Delivery:
          </p>
          <p className="font-normal text-[16px] text-[var(--text-primary)]">
            Rs. {cartData.deliveryFee}
          </p>
        </div>

        {Number(cartData.discount) > 0 && (
          <div className="flex justify-between  py-2 border-t border-dotted border-gray-300">
            <p className="font-normal opacity-70 text-[16px] text-[var(--text-primary)]">
              Discount:
            </p>
            <p className="font-normal text-[16px] text-[var(--text-primary)]">
              Rs. {cartData.discount}
            </p>
          </div>
        )}

        <div className="flex justify-between py-2 border-t border-dotted border-gray-300">
          <p className="font-normal opacity-70 text-[16px] text-[var(--text-primary)]">
            Total:
          </p>
          <p className="text-[var(--text-primary)] font-semibold">
            Rs. {cartData.finalTotal}
          </p>
        </div>
      </div>

      <button
        onClick={onConfirmOrder}
        disabled={isLoading || cartData.cartProducts.length <= 0}
        className="w-full py-3 my-4 bg-[#292929] text-white text-[14px] font-extrabold shadow-lg rounded-md disabled:opacity-50 flex items-center justify-center gap-2 uppercase"
      >
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        ) : (
          "Place Your Order"
        )}
      </button>
    </div>
  );
};

export default OrderSummary;
