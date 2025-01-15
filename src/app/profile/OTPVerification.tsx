import { login } from "@/redux/auth/slice";
import {
  hideProgressLoader,
  openToaster,
  showProgressLoader,
} from "@/redux/toaster/slice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface OTPVerificationProps {
  phone: string;
  name: string;
  email: string;
  onVerificationSuccess: (userData: any) => void;
}

const OTPVerification = ({
  phone,
  name,
  email,
  onVerificationSuccess,
}: OTPVerificationProps) => {
  const dispatch = useDispatch();
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [timer, setTimer] = useState(30);
  const [isResendActive, setIsResendActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendActive(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendCode = async () => {
    if (isResendActive) {
      try {
        const response = await fetch(
          `https://services.broadwaypizza.com.pk/BroadwayAPI.aspx?method=CheckNumber&Number=${phone}`
        );
        const data = await response.json();
        setTimer(30);
        setIsResendActive(false);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleVerificationSubmit = async () => {
    dispatch(
      showProgressLoader({ progressLoader: true, message: "Verifying" })
    );

    try {
      const verificationResponse = await fetch(
        `https://services.broadwaypizza.com.pk/BroadwayAPI.aspx?method=CheckVerificationCode&Name=${name}&Number=${phone}&Email=${email}&StudentID=&Code=${verificationCode}`
      );
      const verificationData = await verificationResponse.json();

      if (verificationData.responseType === "1") {
        const [walletResponse, ordersResponse, infoResponse] =
          await Promise.all([
            fetch(
              `https://services.broadwaypizza.com.pk/BroadwayAPI.aspx?Method=MyWallet&Number=${phone}`
            ),
            fetch(
              `https://services.broadwaypizza.com.pk/BroadwayAPI.aspx?method=MyOrders&Number=${phone}`
            ),
            fetch(
              `https://services.broadwaypizza.com.pk/BroadwayAPI.aspx?method=GetCustomerInfo&Phone=${phone}`
            ),
          ]);

        const [walletData, ordersData, infoData] = await Promise.all([
          walletResponse.json(),
          ordersResponse.json(),
          infoResponse.json(),
        ]);

        const userData = {
          name,
          phone,
          email,
          wallet: walletData,
          orders: ordersData,
          info: infoData,
        };

        dispatch(login(userData));
        onVerificationSuccess(userData);
        dispatch(
          openToaster({
            title: "Welcome",
            message:
              "Welcome, you have been logged in. Tap on Pickup or Delivery to start ordering your favourite pizza.",
            buttonText: "OK",
          })
        );
      } else {
        dispatch(
          openToaster({
            title: "Broadway Pizza Pakistan",
            message: "Invalid Verification Code",
            buttonText: "OK",
          })
        );
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      dispatch(hideProgressLoader());
    }
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-[var(--primary-light)] min-h-screen w-full md:items-center md:bg-[#a2a2a229]">
      <div className="w-full h-full md:h-auto md:max-w-lg bg-[var(--primary-light)] md:bg-[var(--primary-light)] p-6 md:rounded-lg md:shadow-lg mt-16 md:mt-0">
        <h1 className="text-[38px] font-extrabold dark:text-white text-left mb-2">
          Verification
        </h1>
        <p className="text-gray-500 mb-6 text-[14px] dark:text-gray-300">
          You will receive verification code via SMS.
        </p>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            Verification Code
          </label>
          <input
            type="text"
            className="w-full p-4 rounded-lg focus:outline-none dark:bg-[#202020] dark:text-white"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
          />

          <button
            onClick={handleResendCode}
            className={`w-full py-2 rounded-lg border mt-2  text-[var(--text-primary)] font-extrabold uppercase dark:text-black ${
              isResendActive
                ? "hover:bg-yellow-50"
                : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!isResendActive}
          >
            Resend Code {!isResendActive && `(${timer}s)`}
          </button>

          <button
            onClick={handleVerificationSubmit}
            className="w-full bg-yellow-400 text-[var(--text-primary)] dark:text-black font-extrabold py-3 rounded-lg hover:bg-yellow-500 transition-colors uppercase"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
