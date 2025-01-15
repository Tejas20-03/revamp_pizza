import { logout } from "@/redux/auth/slice";
import { openToaster } from "@/redux/toaster/slice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

interface MyAccountProps {
  userData: {
    name: string;
    email: string;
    phone: string;
    wallet?: {
      Balance: string;
    };
  };
}

const MyAccount: React.FC<MyAccountProps> = ({ userData }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);
  const [showDeleteVerification, setShowDeleteVerification] =
    useState<boolean>(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState<string>("");

  const [formData, setFormData] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirmation(false);
    setShowDeleteVerification(true);
  };

  const handleFinalDelete = async () => {
    if (deleteConfirmText === "DELETE") {
      try {
        const response = await fetch(
          `https://services.broadwaypizza.com.pk/BroadwayAPI.aspx?method=DeleteAccount&Phone=${userData.phone}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (data.responseType === 1) {
            dispatch(logout());
          dispatch(
            openToaster({
              title: "Broadway Pizza Pakistan",
              message:
                "Your account has been deleted, we hope to see you again.",
              buttonText: "OK",
            })
          );
          router.push("/login");
        }
        setShowDeleteVerification(false);
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  const handleUpdateInformation = async () => {
    try {
      const response = await fetch(
        "https://services.broadwaypizza.com.pk/BroadwayAPI.aspx?Method=AddCustomerInfo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Name: formData.name,
            Email: formData.email,
            Mobile: formData.phone,
          }),
        }
      );

      const data = await response.json();

      if (data.responseType === 1) {
        dispatch(
          openToaster({
            title: "Information Updated",
            message: "Your information has been updated.",
            buttonText: "OK",
          })
        );
      }
    } catch (error) {
      console.error("Error updating information:", error);
    }
  };
  return (
    <div className=" w-full mx-auto px-4">
      <div className="p-4">
        <div className="py-6 px-4 rounded-lg flex justify-between items-center shadow-[5px_0px_20px_rgba(0,0,0,0.1)]">
          <div>
            <p className="text-[16px] font-medium dark:text-white">Wallet</p>
            <p className="text-[12px] text-gray-600 dark:text-gray-200">
              Use your wallet to pay for your order
            </p>
          </div>
          <div className="bg-[#1f9226] px-3 py-1 rounded-md">
            <p className="text-[#fff] font-medium">
              {userData?.wallet?.Balance || "0"}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#a2a2a229] rounded-xl p-3 mb-3">
        <h3 className="text-xl font-extrabold dark:text-white">Personal Information</h3>
      </div>

      <div className="space-y-4 p-4">
        <div className="w-full">
          <label className="text-sm text-gray-600 dark:text-gray-200 mb-1 block">
            Your Name (*)
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-4 border rounded-md bg-gray-50 opacity-70 text-[14px] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-200 mb-1 block">
              Your Email (*)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-4 border rounded-md bg-gray-50 opacity-70 text-[14px] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-200 mb-1 block">
              Your Phone (*)
            </label>
            <input
              type="text"
              value={formData.phone}
              disabled
              className="w-full p-4 border rounded-md bg-gray-50 opacity-70 text-[14px] focus:outline-none cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6">
          <button
            onClick={handleUpdateInformation}
            className="flex-1 bg-[#a2a2a229] text-black py-2 rounded-lg font-extrabold uppercase"
          >
            Update your Information
          </button>
          <button
            onClick={() => setShowDeleteConfirmation(true)}
            className="flex-1 text-red-500 font-bold uppercase text-[14px]"
          >
            Delete Your Account
          </button>
        </div>
      </div>
      {showDeleteConfirmation && (
        <div className="fixed inset-0 h-screen z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-auto">
          <div className="bg-white dark:bg-[#202020] rounded-md p-6 w-[280px] mx-4 shadow-lg pointer-events-auto">
            <h3 className="text-[20px] opacity-90 font-semibold mb-4 leading-tight dark:text-white">
              Are you sure?
            </h3>
            <p className="text-[var(--text-primary)] opacity-70 mb-6">
              We are sorry to see you go, Let us know if there is something we
              can help you with, You can always create new account by logging
              with verification otp.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="text-[var(--primary)] cursor-pointer font-medium rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="text-[var(--primary)] cursor-pointer font-medium rounded"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteVerification && (
        <div className="fixed inset-0 h-screen z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-auto">
          <div className="bg-white rounded-md p-4 w-[280px] dark:bg-[#202020] mx-4 shadow-lg pointer-events-auto">
            <h3 className="text-[20px] dark:text-white opacity-90 font-semibold mb-4 leading-tight">
              Broadway Pizza Pakistan
            </h3>
            <p className="text-[var(--text-primary)] opacity-70 mb-6">
              Please type "DELETE" below
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="w-full border-b-2 border-gray-300 dark:bg-[#202020] dark:text-white focus:border-[#FFC714] outline-none py-2 transition-colors"
              />
            <div className="flex justify-end gap-4 mt-2">
              <button
                onClick={() => {
                  setShowDeleteVerification(false);
                  setDeleteConfirmText("");
                }}
                className="text-[var(--primary)] cursor-pointer font-medium rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalDelete}
                className="text-[var(--primary)] cursor-pointer font-medium rounded"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;
