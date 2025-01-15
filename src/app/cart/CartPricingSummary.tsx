import VoucherDialog from "@/components/Popup/VoucherDialog";
import { cartActions } from "@/redux/cart/slice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface CartPricingSummaryProps {
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
  maxMinDeliveryPrice: number;
  onCheckout: () => void;
  isLoading: boolean;
}

const CartPricingSummary: React.FC<CartPricingSummaryProps> = ({
  cartData,
  addressData,
  maxMinDeliveryPrice,
  onCheckout,
  isLoading
}) => {
  const dispatch = useDispatch();
  const [voucherDialog, setVoucherDialog] = useState<boolean>(false);

  useEffect(() => {
    dispatch(
      cartActions.calculateCartTotals({
        addressType: addressData.addressType,
        delivery_tax: addressData.delivery_tax,
      })
    );
  }, [cartData.cartProducts, addressData, cartData.VoucherDiscount, dispatch]);

  const handleShowVoucherDialog = (val: boolean) => {
    setVoucherDialog(val);
  };

  const handleRemoveVoucher = () => {
    dispatch(cartActions.applyVoucher({ code: "", amount: 0 }));
  };

  const calculateGrossTotal = () => {
    return Math.round(
      cartData.cartProducts.reduce((total, item) => {
        const originalPrice = (item.TotalProductPrice + item.discountGiven) * item.Quantity;
        return total + originalPrice;
      }, 0)
    );
  };

  return (
    <div className="md:col-span-5 sticky top-0 md:fixed md:right-32 md:top-32 md:w-[400px] mt-2 p-2 md:mt-0 pb-24 md:pb-0">
      <div
        className="border-2 border-dashed border-[#ccc] py-2 text-center cursor-pointer mb-3"
        onClick={() => cartData.VoucherDiscount > 0 ? handleRemoveVoucher() : handleShowVoucherDialog(true)}
      >
        {cartData.VoucherDiscount > 0 ? (
          <p className="text-[#e59401] font-bold">Remove Voucher</p>
        ) : (
          <>
            <p className="text-[#e59401] font-bold text-[14px]">Have a Voucher?</p>
            <p className="mt-0.75 text-[14px] text-[#e59401]">Add your voucher to add discount</p>
          </>
        )}
      </div>

      <div className="border p-3 shadow-[1px_2px_5px_#0000002b]">
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

        <div className="flex justify-between py-2 border-t border-gray-300">
          <p className="font-normal opacity-70 text-[16px] text-[var(--text-primary)]">Subtotal:</p>
          <p className="font-normal text-[16px] text-[var(--text-primary)]">Rs.{cartData.cartSubTotal}</p>
        </div>

        <div className="flex justify-between py-2 border-t border-gray-300">
          <p className="font-normal opacity-70 text-[16px] text-[var(--text-primary)]">
            GST ({addressData.delivery_tax}%):
          </p>
          <p className="font-normal text-[16px] text-[var(--text-primary)]">Rs. {cartData.tax}</p>
        </div>

        <div className="flex justify-between py-2 border-t border-gray-300">
          <p className="font-normal opacity-70 text-[16px] text-[var(--text-primary)]">Delivery:</p>
          <p className="font-normal text-[16px] text-[var(--text-primary)]">Rs. {cartData.deliveryFee}</p>
        </div>

        {Number(cartData.discount) > 0 && (
          <div className="flex justify-between py-2 border-t border-gray-300">
            <p className="font-normal opacity-70 text-[16px] text-[var(--text-primary)]">Discount:</p>
            <p className="font-normal text-[16px] text-[var(--text-primary)]">Rs. {cartData.discount}</p>
          </div>
        )}

        <div className="flex justify-between py-2 border-t border-gray-300">
          <p className="font-normal opacity-70 text-[16px] text-[var(--text-primary)]">Total:</p>
          <p className="text-[var(--text-primary)] font-semibold">Rs. {cartData.finalTotal}</p>
        </div>
      </div>

      {cartData.cartSubTotal - cartData.VoucherDiscount >= 299 ? (
         <button
         disabled={cartData.cartProducts.length <= 0 || isLoading}
         className="w-full py-3 my-4 bg-[#292929] text-white font-bold shadow-lg rounded-md disabled:opacity-50 flex items-center justify-center gap-2"
         onClick={onCheckout}
       >
         {isLoading ? (
           <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
         ) : (
           <>
             CONTINUE
             <svg
               xmlns="http://www.w3.org/2000/svg"
               width="20"
               height="20"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
             >
               <path d="M5 12h14" />
               <path d="m12 5 7 7-7 7" />
             </svg>
           </>
         )}
       </button>
      ) : (
        <div className="w-full p-4 my-2 text-center text-gray-600">
          <p className="text-sm bg-[#ffeae1] rounded-md px-2 py-1">
            Min delivery of <span className="font-bold">Rs 299</span> is required to place order
          </p>
        </div>
      )}

      <VoucherDialog
        voucherDialog={voucherDialog}
        handleShowVoucherDialog={handleShowVoucherDialog}
      />
    </div>
  );
};

export default CartPricingSummary;
