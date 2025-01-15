"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface OrderStatus {
  customername: string;
  status: string;
  orderamount: string;
  deliverytime: string;
  ordertype: string;
  created: string;
  outletid: string;
  RiderName: string;
  RiderPhone: string;
}

interface OrderDetails {
  CustomerName: string;
  CustomerMobile: string;
  OrderType: string;
  UserArea: string;
  DeliveryAddress: string;
  City: string;
  Outlet: string;
  DeliveryTax: string;
  Tax: string;
  TaxAmount: string;
  OrderAmount: string;
  Remarks: string;
  SubTotal: string;
  RiderName: string;
  RiderPhone: string;
  PaymentType: string;
  DeliveryFee: string;
  Data: Array<{
    ItemID: string;
    ItemImage: string;
    ProductName: string;
    Quantity: string;
    CategoryName: string;
    MinimumDelivery: string;
    options: Array<{
      OptionID: string;
      OptionName: string;
      OptionGroupName: string;
      Price: string;
      Quantity: string;
    }>;
    Price: string;
    TotalProductPrice: string;
    discountGiven: string;
  }>;
}

const OrderContent = () => {
  const searchParams = useSearchParams();
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      const data = searchParams.get("data");
      if (!data) return;

      const parsedData = JSON.parse(data);
      const orderId = parsedData.OrderID;

      try {
        const statusResponse = await fetch(
          `https://services.broadwaypizza.com.pk/BroadwayAPI.aspx?Method=CheckOrderStatus&OrderID=${orderId}`
        );
        const statusData = await statusResponse.json();
        if (statusData.ResponseType === 1) {
          setOrderStatus(statusData.Data[0]);
        }

        const detailsResponse = await fetch(
          `https://services.broadwaypizza.com.pk/BroadwayAPI.aspx?Method=ReOrder&OrderID=${orderId}`
        );
        const detailsData = await detailsResponse.json();
        if (detailsData.ResponseType === 1) {
          setOrderDetails(detailsData);
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400" />
      </div>
    );
  }

  return (
    <>
      {orderStatus && (
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#FFC71442] p-2 rounded-lg flex md:items-center flex-col md:flex-row space-x-2">
            <Image
              src="/assets/order-number.png"
              alt="Order Number"
              width={48}
              height={48}
            />
            <div>
              <h3 className="text-[12px]">Order</h3>
              <p className="text-[14px] font-bold">
                #
                {searchParams.get("data")
                  ? JSON.parse(searchParams.get("data")!).OrderID
                  : "-"}
              </p>
            </div>
          </div>

          <div className="bg-[#FFC71442] p-2 rounded-lg flex flex-col md:flex-row md:items-center space-x-2">
            <Image
              src="/assets/approx-time.png"
              alt="Delivery Time"
              width={48}
              height={48}
            />
            <div>
              <h3 className="text-[12px]">Approx. time</h3>
              <p className="text-[14px] font-bold">
                {orderStatus?.deliverytime || "-"} mins
              </p>
            </div>
          </div>

          <div className="bg-[#FFC71442] p-2 rounded-lg flex flex-col md:flex-row md:items-center space-x-2">
            <Image
              src="/assets/total.png"
              alt="Order Amount"
              width={48}
              height={48}
            />
            <div>
              <h3 className="text-[12px]">Total</h3>
              <p className="text-[14px] font-bold">
                Rs. {orderStatus?.orderamount || "-"}
              </p>
            </div>
          </div>
        </div>
      )}
      {orderDetails && (
        <div className="flex flex-col items-center gap-2 mt-2">
          <div className="bg-[#A2A2A229] rounded-lg shadow-md p-2 w-full">
            <h2 className="text-[14px] font-extrabold mb-2">Order Details</h2>
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 text-[14px] ">Order Type</td>
                  <td className="text-right font-bold text-[14px]">
                    {orderDetails.OrderType}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-[14px] ">Delivery Address</td>
                  <td className="text-right font-bold text-[14px]">
                    {orderDetails.DeliveryAddress}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-[14px]">Outlet</td>
                  <td className="text-right font-bold text-[14px]">
                    {orderDetails.Outlet}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 text-[14px] ">Payment Method:</td>
                  <td className="text-right font-bold text-[14px]">
                    {orderDetails.PaymentType}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-2 w-full">
            <h3 className="text-[16px] font-extrabold my-4">Items</h3>
            <table className="w-full border-collapse text-[14px] font-bold">
              <tbody>
                {orderDetails.Data.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-1">
                      <div className="flex items-center gap-3">
                        <span>
                          {item.ProductName} x{item.Quantity}
                        </span>
                      </div>
                      {item.options &&
                        Array.isArray(item.options) &&
                        item.options.map((option, idx) => (
                          <div
                            key={idx}
                            className="text-[12px] font-normal opacity-70 ml-2"
                          >
                            {option.OptionGroupName}: {option.OptionName}
                          </div>
                        ))}
                    </td>
                  </tr>
                ))}
                <tr className="flex items-center justify-between border-b">
                  <td className="py-2 px-1">Subtotal</td>
                  <td className="py-2 px-1">{orderDetails.SubTotal}</td>
                </tr>
                <tr className="flex items-center justify-between border-b">
                  <td className="py-2 px-1">GST ({orderDetails.Tax}%)</td>
                  <td className="py-2 px-1">{orderDetails.TaxAmount}</td>
                </tr>
                <tr className="flex items-center justify-between border-b">
                  <td className="py-2 px-1">Delivery</td>
                  <td className="py-2 px-1">{orderDetails.DeliveryFee}</td>
                </tr>
                <tr className="flex items-center justify-between">
                  <td className="py-2 px-1">Total</td>
                  <td className="py-2 px-1">{orderDetails.OrderAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="text-center mt-4  pt-4">
            <p className="text-[14px] text-gray-600">
              Need Support? Call our UAN
            </p>
          </div>
          <Link
            href="tel://021-111-339-339"
            className="block md:w-[500px] mb-12 w-full"
          >
            <button className="w-full py-3 text-[14px] bg-[#A2A2A229] dark:text-black dark:bg-gray-400 hover:bg-gray-200 text-gray-900 font-extrabold rounded-lg transition-colors">
              +92 21 111 339 339
            </button>
          </Link>
        </div>
      )}
    </>
  );
};

const ThankYouPage = () => {
  return (
    <div>
      <div className="relative w-full h-1 overflow-hidden">
        <div className="absolute inset-0">
          <div className="h-full animate-progress-loading"></div>
        </div>
      </div>
      <div className="max-w-[850px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between flex-col md:flex-row">
          <div className="flex flex-col">
            <h1 className="text-[28px] md:text-[32px] font-extrabold text-[#212121]">
              Enjoy your meal
            </h1>

            <p className="text-sm">
              Have any feedback or need assistance? Call us 021-111-339-339
            </p>
          </div>
          <Image
            src="/assets/delivered.svg"
            alt="Thank you"
            width={200}
            height={200}
            className="animate-bounce"
          />
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400" />
            </div>
          }
        >
          <OrderContent />
        </Suspense>
      </div>
    </div>
  );
};

export default ThankYouPage;
