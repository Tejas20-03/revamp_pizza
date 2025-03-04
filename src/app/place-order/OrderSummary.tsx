import { useCallback } from "react";
import ItemCard from "../cart/ItemCard";
import { addQuantity, removeFromCart, removeQuantity } from "@/redux/cart/action";
import { useDispatch } from "react-redux";
import { StoreDispatch } from "@/redux/reduxStore";

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
  const dispatch = useDispatch<StoreDispatch>();

  const calculateGrossTotal = () => {
    return Math.round(
      cartData.cartProducts.reduce((total, item) => {
        const originalPrice =
          (item.TotalProductPrice + item.discountGiven) * item.Quantity;
        return total + originalPrice;
      }, 0)
    );
  };
  const handleMinusClick = useCallback(
    (item: any) => {
      if (!item?.ItemID) return;
      if (item.Quantity <= 1) {
        dispatch(removeFromCart({ id: item.ItemID }));
      } else {
        dispatch(removeQuantity({ id: item.ItemID }));
      }
    },
    [dispatch]
  );

  const handleAddQuantity = useCallback(
    (id: number) => {
      const item = cartData.cartProducts.find(
        (product) => Number(product.ItemID) === Number(id)
      );
      if (item) {
        dispatch(
          addQuantity({
            id: Number(id),
            options: item.options,
          })
        );
      }
    },
    [dispatch, cartData.cartProducts]
  );
  return (
<div className="sticky top-4 max-h-screen w-full md:w-[450px] bg-[#F3F3F7] shadow-xl transform transition-transform duration-300 rounded-lg">

      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-[24px] font-semibold">
            {cartData.cartProducts.length} item for Rs. {cartData.finalTotal}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {cartData.cartProducts.map((item, index) => (
            <ItemCard key={index} item={item} onMinusClick={handleMinusClick}
            onAddQuantity={handleAddQuantity} />
          ))}
        </div>
        {cartData.cartProducts.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="space-y-2">
              {cartData.VoucherDiscount > 0 && (
                <div className="flex justify-between py-2 border-t border-dotted border-gray-300">
                  <p className="font-semibold">Voucher</p>
                  <p>Rs. -{Number(cartData.VoucherDiscount.toFixed(2))}</p>
                </div>
              )}

              {calculateGrossTotal() > cartData.cartSubTotal && (
                <div className="flex justify-between py-2 border-gray-300">
                  <p className="font-normal opacity-70 text-[16px] text-[var(--text-primary)]">
                    Gross Total:
                  </p>
                  <p className="font-normal text-[16px] text-[var(--text-primary)]">
                    Rs. {calculateGrossTotal()}
                  </p>
                </div>
              )}

              {Number(cartData.discount) > 0 && (
                <div className="flex justify-between py-2 border-t border-gray-300">
                  <p className="font-normal opacity-70 text-[16px] text-[var(--text-primary)]">
                    Discount:
                  </p>
                  <p className="font-normal text-[16px] text-[var(--text-primary)]">
                    Rs. {cartData.discount}
                  </p>
                </div>
              )}

              <div className="flex justify-between py-2 border-t border-gray-300">
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
              className="w-full bg-[#FFC714] text-white py-3 rounded-full font-semibold hover:bg-[#e6b313] transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Place Your Order"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
