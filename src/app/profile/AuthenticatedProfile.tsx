import { useState } from "react";
import MyOrders from "./InnerPages/MyOrders";
import MyAccount from "./InnerPages/MyAccount";
import { BsBoxSeam } from "react-icons/bs";
import { FiUser } from "react-icons/fi";

interface AuthenticatedProfileProps {
  userData: {
    name: string;
    email: string;
    phone: string;
    wallet?: {
      Balance: string;
    };
  };
}

const AuthenticatedProfile: React.FC<AuthenticatedProfileProps> = ({
  userData,
}) => {
  const [activePage, setActivePage] = useState<"orders" | "account">("account");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOrdersClick = () => {
    setActivePage("orders");
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:min-h-screen lg:absolute lg:top-0 lg:left-[62px] right-0">
      <div className="lg:hidden fixed top-[70px] left-0 right-0 z-10">
        <nav className="flex text-[14px]">
          <button
            onClick={handleOrdersClick}
            className={`flex-1 py-4 flex justify-center items-center gap-2 transition-colors duration-200 ${
              activePage === "orders"
                ? "bg-[var(--yellow-bg)] text-[var(--primary-text)] font-medium"
                : ""
            }`}
          >
            <BsBoxSeam size={18} />
            My Orders
          </button>
          <button
            onClick={() => setActivePage("account")}
            className={`flex-1 py-4 flex justify-center items-center gap-2 transition-colors duration-200 ${
              activePage === "account"
                ? "bg-[var(--yellow-bg)] text-[var(--primary-text)] font-medium"
                : ""
            }`}
          >
            <FiUser size={18} />
            My Account
          </button>
        </nav>
      </div>
      <div className="lg:hidden fixed top-[70px] left-0 right-0 lg:bg-[var(--primary-light)] z-10">
        <nav className="flex text-[14px]">
          <button
            onClick={handleOrdersClick}
            className={`flex-1 py-4 flex justify-center items-center gap-2 transition-colors duration-200 ${
              activePage === "orders"
                ? "bg-[var(--yellow-bg)] text-[var(--primary-text)] font-medium"
                : ""
            }`}
          >
            <BsBoxSeam size={18} />
            My Orders
          </button>
          <button
            onClick={() => setActivePage("account")}
            className={`flex-1 py-4 flex justify-center items-center gap-2 transition-colors duration-200 ${
              activePage === "account"
                ? "bg-[var(--yellow-bg)] text-[var(--primary-text)] font-medium"
                : ""
            }`}
          >
            <FiUser size={18} />
            My Account
          </button>
        </nav>
      </div>
      <div className="hidden lg:block lg:fixed lg:top-0 lg:left-[62px] lg:h-screen w-[25%] bg-[var(--primary-light)]">
        <nav className="space-y-0 text-[14px] mt-[100px]">
          <button
            onClick={handleOrdersClick}
            className={` w-full text-left p-4 transition-colors duration-200 flex items-center gap-3 ${
              activePage === "orders"
                ? "bg-[var(--yellow-bg)] text-[var(--primary-text)] font-medium"
                : ""
            }`}
          >
            <BsBoxSeam size={18} />
            My Orders
          </button>
          <button
            onClick={() => setActivePage("account")}
            className={` w-full text-left  p-4 transition-colors duration-200 flex items-center gap-3 ${
              activePage === "account"
                ? "bg-[var(--yellow-bg)] text-[var(--primary-text)] font-medium"
                : ""
            }`}
          >
            <FiUser size={18} />
            My Account
          </button>
        </nav>
      </div>
      <div className="flex-1 w-full bg-white dark:bg-[#202020] lg:p-6 mt-[70px] lg:ml-[25%]">
        {activePage === "orders" ? (
          <MyOrders key={refreshKey} />
        ) : (
          <MyAccount userData={userData} />
        )}
      </div>
    </div>
  );
};

export default AuthenticatedProfile;
