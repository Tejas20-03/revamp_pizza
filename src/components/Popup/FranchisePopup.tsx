import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import ContactDetails from "../UI/ContactDetails";
import Toaster from "../UI/Toaster";
import { useDispatch } from "react-redux";
import { openToaster } from "@/redux/toaster/slice";

interface FranchisePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const FranchisePopup: React.FC<FranchisePopupProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    occupation: "",
    city: "",
    ownOtherFranchise: "",
    ownProperty: "",
    hearAbout: "",
    capital: "",
    officeAddress: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.occupation ||
      !formData.city ||
      !formData.ownOtherFranchise ||
      !formData.ownProperty ||
      !formData.hearAbout ||
      !formData.capital ||
      !formData.officeAddress
    ) {
      dispatch(
        openToaster({
          title: "Information Missing",
          message: "Please fill in all the required fields.",
          buttonText: "OK",
        })
      );
      return;
    }

    try {
      const response = await fetch(
        "https://services.broadwaypizza.com.pk/BroadwayAPI.aspx?Method=franchiserequestv1",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.name,
            contact: formData.phone,
            Email: formData.email,
            occupation: formData.occupation,
            city: formData.city,
            own_other_franchises: formData.ownOtherFranchise,
            own_property: formData.ownProperty,
            hearAbout: formData.hearAbout,
            totalLiquidAssets: formData.capital,
            regions: formData.officeAddress,
          }),
        }
      );

      const data = await response.json();

      if (data.responseType === 1) {
        dispatch(
          openToaster({
            title: "Information Sent",
            message:
              "Your franchise request has been sent to our team. You will get a callback from us to assist you accordingly.",
            buttonText: "OK",
          })
        );
        setFormData({
          name: "",
          phone: "",
          email: "",
          occupation: "",
          city: "",
          ownOtherFranchise: "",
          ownProperty: "",
          hearAbout: "",
          capital: "",
          officeAddress: "",
        });
      }
    } catch (error) {
      console.error("Error submitting franchise form:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="bg-white dark:bg-[#121212] w-full max-w-[800px] h-screen sm:h-[690px] z-60 sm:rounded-md slide-up  shadow-xl overflow-y-auto pointer-events-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-[#202020] dark:text-white flex justify-between items-center p-4">
          <Image
            src="/assets/broadwayPizzaLogo.png"
            alt="Broadway Pizza"
            width={120}
            height={53}
          />
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[var(--primary-light)]"
          >
            <IoClose size={24} />
          </button>
        </div>
        <div className="p-2">
          <div className="mt-2 p-4 shadow-[5px_0px_20px_rgba(0,0,0,0.1)] rounded-lg dark:bg-[#202020]">
            <h2 className="text-3xl font-extrabold mb-4 dark:text-white">
              Become a Broadway Franchise Partner
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Your Name (*)
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 focus:outline-none  dark:bg-[#efefef45]"
                    placeholder="Type your name here"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Your Phone (*)
                  </label>
                  <input
                    type="tel"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 focus:outline-none  dark:bg-[#efefef45]"
                    placeholder="Type your number here"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Your Email (*)
                  </label>
                  <input
                    type="email"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 focus:outline-none  dark:bg-[#efefef45]"
                    placeholder="Type your email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Current Occupation (*)
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 focus:outline-none  dark:bg-[#efefef45]"
                    placeholder="Type your occupation name here"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Which city/town are you interested in opening the franchise?
                  (*)
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 focus:outline-none  dark:bg-[#efefef45]"
                  placeholder="Type city here"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Do you own any other franchise? (If yes then please specify
                  the name) (*)
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 focus:outline-none  dark:bg-[#efefef45]"
                  placeholder="Yes/No"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Do you own the property where you are interested in opening
                  the franchise? (*)
                </label>
                <div className="mt-2 dark:text-white">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="own_property"
                      value="yes"
                      className="mr-2"
                    />
                    <span>Yes</span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="own_property"
                      value="no"
                      className="mr-2"
                    />
                    <span>No</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Where did you hear about us? (*)
                </label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 focus:outline-none  dark:bg-[#efefef45]"
                >
                  <option value="">Select</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Relative">Relative</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Website">Website</option>
                  <option value="Google">Google</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Capital Investment (*)
                </label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 focus:outline-none  dark:bg-[#efefef45]"
                >
                  <option value="">Select Investment Amount</option>
                  <option value="PKR20 million">PKR20 million</option>
                  <option value="PKR25 million">PKR25 million</option>
                  <option value="PKR30 million">PKR30 million</option>
                  <option value="PKR35 million">PKR35 million</option>
                  <option value="PKR40 million">PKR40 million</option>
                  <option value="PKR45 million">PKR45 million</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Your office address (*)
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 focus:outline-none  dark:bg-[#efefef45]"
                  placeholder="Type your office address here"
                />
              </div>

              <p className="text-center text-[14px] font-normal flex items-center justify-center gap-1 dark:text-white">
                <span className="text-red-500 text-bold">Note: </span>
                This is not a job submission form!
              </p>

              <button
                type="submit"
                className="w-full bg-[#FFC714] text-[var(--text-primary)] py-4 rounded-md font-extrabold hover:bg-[#e3b013] dark:text-black transition-colors uppercase flex items-center justify-center text-[14px]"
              >
                Submit your query
              </button>
            </form>
          </div>
          <ContactDetails />
        </div>
      </div>
    </div>
  );
};

export default FranchisePopup;
