import { useDispatch, useSelector } from "react-redux";
import { StoreDispatch, StoreState } from "@/redux/reduxStore";
import Image from "next/image";
import { useEffect, useState } from "react";
import OrderDetailsPopup from "./OrderDetailsPopup";
import { useRouter } from "next/navigation";
import { addToCart } from "@/redux/cart/action";
import { setLoading } from "@/redux/toaster/slice";
import { login } from "@/redux/auth/slice";

interface Order {
  ID: string;
  CustomerName: string;
  OrderAmount: string;
  Created: string;
  OutletName: string;
  Status: string;
  FeedbackURL: string;
}

const MyOrders: React.FC = () => {
  const { userData } = useSelector((state: StoreState) => state.auth);
  const orders = userData?.orders;
  const dispatch = useDispatch<StoreDispatch>();
  const router = useRouter();
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [selectedOrderID, setSelectedOrderID] = useState<string | null>(null);

  const refreshOrders = async () => {
    dispatch(setLoading(true));
    try {
      const ordersResponse = await fetch(
        `https://services.broadwaypizza.com.pk/BroadwayAPI.aspx?method=MyOrders&Number=${userData?.phone}`
      );
      const ordersData = await ordersResponse.json();
      dispatch(login({ ...userData, orders: ordersData }));
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    refreshOrders();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleOrderAgain = (orderDetails: any) => {
    orderDetails.Data.forEach((item: any) => {
      const cartItem = {
        ItemID: item.ItemID,
        ProductName: item.ProductName,
        Quantity: 1,
        Price: item.Price,
        options: item.options || [],
        SizeID: item.SizeID,
        CategoryName: item.CategoryName,
        MinimumDelivery: item.MinimumDelivery,
        TotalProductPrice: item.Price,
        discountGiven: 0,
        ItemImage: item.ItemImage,
        ID: item.ItemID,
        PaymentType: item.PaymentType,
      };

      dispatch(addToCart({ products: cartItem }));

      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      existingCart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(existingCart));
    });

    router.push("/cart");
    setShowOrderDetails(false);
  };

  const handleOrderAgainClick = async (orderId: string) => {
    try {
      const response = await fetch(
        `https://services.broadwaypizza.com.pk/BroadwayAPI.aspx?Method=ReOrder&OrderID=${orderId}`
      );
      const data = await response.json();
      if (data.ResponseType === 1) {
        handleOrderAgain(data);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handleViewDetails = async (orderId: string) => {
    dispatch(setLoading(true));

    try {
      const response = await fetch(
        `https://services.broadwaypizza.com.pk/BroadwayAPI.aspx?Method=ReOrder&OrderID=${orderId}`
      );
      const data = await response.json();
      if (data.ResponseType === 1) {
        setSelectedOrderID(orderId);
        setSelectedOrderDetails(data);
        setShowOrderDetails(true);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto lg:px-4">
      {orders && orders?.Data?.length > 0 && (
        <div className="w-full bg-[#a2a2a229] rounded-xl p-3 mb-3 dark:text-white">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-extrabold">My Orders</h3>
            <span className="text-[16px] font-bold">
              {orders.Data.length} Orders
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 lg:p-0">
        {orders && orders?.Data?.length > 0 ? (
          orders.Data.map((order) => (
            <div
              key={order.ID}
              className="bg-white dark:bg-[#202020] rounded-lg border border-gray-200 dark:border-gray-500 transition-shadow"
            >
              <div className="p-3">
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Image
                        src="/assets/brand-identity.svg"
                        alt="Order ID"
                        width={24}
                        height={24}
                      />
                      <div className="flex flex-col items-left">
                        <span className="text-gray-600 dark:text-gray-200 text-sm font-medium">
                          Order ID
                        </span>
                        <h3 className="text-[14px] font-bold dark:text-gray-200">
                          #{order.ID}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Image
                        src="/assets/clock.svg"
                        alt="Clock"
                        width={24}
                        height={24}
                      />
                      <div className="flex flex-col items-left">
                        <span className="text-gray-600 dark:text-gray-200 text-sm font-medium">
                          <div className="flex items-center gap-2">
                            Order On
                          </div>
                        </span>

                        <h3 className="text-[14px] font-bold whitespace-nowrap dark:text-gray-200">
                          {formatDate(order.Created)}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <Image
                        src="/assets/wallet.svg"
                        alt="Total"
                        width={24}
                        height={24}
                      />
                      <div className="flex flex-col items-left">
                        <span className="text-gray-600 dark:text-gray-200 text-sm font-medium">
                          <div className="flex items-center gap-2">Total</div>
                        </span>
                        <h3 className="font-bold text-[14px] dark:text-gray-200">
                          Rs. {order.OrderAmount}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex mt-2 justify-between items-center gap-4 px-4 py-1 border-t">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600 dark:text-gray-200">
                    Status:
                  </span>
                  <span
                    className={` text-sm font-medium ${
                      order.Status === "Confirmed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.Status}
                  </span>
                </div>
                {order.FeedbackURL && (
                  <a
                    href={order.FeedbackURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-black px-12 py-2 rounded-md bg-[#a2a2a229] transition-colors font-extrabold uppercase text-[16px]"
                  >
                    Feedback
                  </a>
                )}
              </div>

              <div className="flex mt-2">
                <button
                  className="flex-1 border bg-[#a2a2a229] text-gray-700 dark:text-gray-200 px-4 transition-colors text-sm font-medium py-4"
                  onClick={() => handleViewDetails(order.ID)}
                >
                  View Details
                </button>
                <button
                  className="flex-1 bg-[var(--primary)] text-black dark:text-gray-200 px-4 py-2 transition-colors text-sm font-medium"
                  onClick={() => handleOrderAgainClick(order.ID)}
                >
                  Order Again
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No orders found</div>
        )}
      </div>
      {showOrderDetails && (
        <OrderDetailsPopup
          isOpen={showOrderDetails}
          onClose={() => setShowOrderDetails(false)}
          orderDetails={selectedOrderDetails}
          selectedOrderID={selectedOrderID}
          handleOrderAgain={handleOrderAgain}
        />
      )}
    </div>
  );
};

export default MyOrders;
