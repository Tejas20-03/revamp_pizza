import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import ContactDetails from "../UI/ContactDetails";
import { openToaster } from "@/redux/toaster/slice";
import { useDispatch } from "react-redux";

interface CorporatePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CorporatePopup: React.FC<CorporatePopupProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    Name: "",
    Phone: "",
    Email: "",
    NoofPerson: "",
    Instructions: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.Name ||
      !formData.Phone ||
      !formData.Email ||
      !formData.NoofPerson
    ) {
      dispatch(
        openToaster({
          title: "Information Missing",
          message: "Please type all the required fields.",
          buttonText: "OK",
        })
      );
      return;
    }

    try {
      const response = await fetch(
        "https://services.broadwaypizza.com.pk/BroadwayAPI.aspx?Method=AddCorporateEvent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Name: formData.Name,
            Phone: formData.Phone,
            Email: formData.Email,
            Organization: formData.NoofPerson,
            Query: formData.Instructions,
          }),
        }
      );

      const data = await response.json();

      if (data.responseType === 1) {
        dispatch(
          openToaster({
            title: "Information Sent",
            message:
              "Your information has been sent to our team. You will get a callback from you to assist you accordingly.",
            buttonText: "OK",
          })
        );
        setFormData({
          Name: "",
          Phone: "",
          Email: "",
          NoofPerson: "",
          Instructions: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDownloadMenu = () => {
    window.open("/downloads/CorporateMenu.pdf", "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
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
            <h2 className="text-3xl font-extrabold mb-4 dark:text-gray-200">
              Corporate Alliances
            </h2>

            <p className="text-gray-600 text-[14px] mb-6 dark:text-gray-200">
              The Broadway Pizza is excited to introduce our exclusive Prepaid
              Gift Voucher Program, designed specifically to meet the
              requirements of our esteemed corporate partners. Our program
              offers versatile Prepaid Gift Vouchers that corporate clients can
              present to their employees as a gesture of gratitude or to their
              valued customers as a premium corporate gift.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Full Name (*)
                  </label>
                  <input
                    type="text"
                    value={formData.Name}
                    onChange={(e) =>
                      setFormData({ ...formData, Name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100  dark:bg-[#efefef45] focus:outline-none"
                    placeholder="Type your name here"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Your Phone (*)
                  </label>
                  <input
                    type="tel"
                    value={formData.Phone}
                    onChange={(e) =>
                      setFormData({ ...formData, Phone: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100  dark:bg-[#efefef45] focus:outline-none"
                    placeholder="Type your number here"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Email Address (*)
                  </label>
                  <input
                    type="email"
                    value={formData.Email}
                    onChange={(e) =>
                      setFormData({ ...formData, Email: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100  dark:bg-[#efefef45] focus:outline-none"
                    placeholder="Type your email address here"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Number of Persons (*)
                  </label>
                  <input
                    type="number"
                    value={formData.NoofPerson}
                    onChange={(e) =>
                      setFormData({ ...formData, NoofPerson: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100  dark:bg-[#efefef45] focus:outline-none"
                    placeholder="Enter here"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Your Requirements/Queries
                  </label>
                  <textarea
                    rows={2}
                    value={formData.Instructions}
                    onChange={(e) =>
                      setFormData({ ...formData, Instructions: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100  dark:bg-[#efefef45] focus:outline-none"
                    placeholder="Type your query here"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#FFC714] dark:text-black text-[var(--text-primary)] py-2 rounded-md font-extrabold hover:bg-[#e3b013] transition-colors uppercase flex items-center justify-center text-[14px]"
              >
                Send your message{" "}
                <span className="text-2xl text-center">&rarr;</span>
              </button>
            </form>
          </div>
        </div>
        <div className="space-y-4 p-4">
          <button
            onClick={handleDownloadMenu}
            className="w-full border-2 border-[#0ca353] text-[#0ca353] py-2 rounded-md font-extrabold transition-colors text-[14px]"
          >
            DOWNLOAD CORPORATE PROPOSAL
          </button>

          <ContactDetails />
        </div>
      </div>
    </div>
  );
};

export default CorporatePopup;
