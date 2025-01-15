"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login } from "@/redux/auth/slice";
import OTPVerification from "./OTPVerification";
import AuthenticatedProfile from "./AuthenticatedProfile";
import { hideProgressLoader, openToaster, showProgressLoader } from "@/redux/toaster/slice";

const ProfilePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, userData } = useSelector((state: any) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [showVerification, setShowVerification] = useState<boolean>(false);


  useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      dispatch(
        openToaster({
          title: "Information missing",
          message: "Please type name, number and email.",
          buttonText: "OK",
        })
      );
      return;
    }
    dispatch(showProgressLoader({ progressLoader: true, message: "Sending OTP" }));

    try {
      const response = await fetch(
        `https://services.broadwaypizza.com.pk/BroadwayAPI.aspx?method=CheckNumber&Number=${formData.phone}`
      );
      const data = await response.json();
      if (data.NewCustomer === "false") {
        setShowVerification(true);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      dispatch(hideProgressLoader());
    }
  };

  if (isAuthenticated) {
    return <AuthenticatedProfile userData={userData} />;
  }

  if (showVerification) {
    return (
      <OTPVerification
        phone={formData.phone}
        name={formData.name}
        email={formData.email}
        onVerificationSuccess={(userData) => {
          dispatch(login(userData));
          router.push("/profile");
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-[var(--primary-light)] min-h-screen w-full md:items-center md:bg-[#a2a2a229] ">
      <div className="w-full h-full md:h-auto md:max-w-[500px] bg-[var(--primary-light)] md:bg-[var(--primary-light)] p-4 md:rounded-xl md:shadow-md  mt-16 md:mt-0">
        <h1 className="text-[38px] font-bold text-left mb-2 text-[var(--text-primary)]">
          Your Account
        </h1>

        <p className="text-[var(--text-primary)] opacity-70 mb-6 text-[14px]">
          Please provide us with your contact details for updates, exclusive
          offers, and an easy ordering experience right at your fingertips.
        </p>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label
              htmlFor="name"
              className="block text-[var(--text-primary)] font-medium mb-2 text-[14px]"
            >
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-[15px] text-[14px] border border-[#99999980] dark:text-gray-400 rounded-[5px] focus:outline-none dark:bg-[#1c1c1d]"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Type your full name"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-[var(--text-primary)] font-medium mb-2 text-[14px]"
            >
              Your Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full p-[15px] text-[14px] border border-[#99999980] dark:text-gray-400 rounded-[5px] focus:outline-none dark:bg-[#1c1c1d]"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="Type your phone number"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-[var(--text-primary)] font-medium mb-2 text-[14px]"
            >
              Your Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-[15px] text-[14px] border border-[#99999980] dark:text-gray-400 rounded-[5px] focus:outline-none dark:bg-[#1c1c1d]"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Type your email address"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 dark:text-[#1c1c1d] text-[14px] text-[var(--text-primary)] font-extrabold py-3 rounded-md hover:bg-yellow-500 transition-colors uppercase"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
