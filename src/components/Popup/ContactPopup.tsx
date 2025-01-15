import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import ContactDetails from "../UI/ContactDetails";
import { useDispatch } from "react-redux";
import { openToaster } from "@/redux/toaster/slice";

interface ContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactPopup: React.FC<ContactPopupProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    Name: "",
    Phone: "",
    Instructions: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.Name || !formData.Phone) {
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
        "https://services.broadwaypizza.com.pk/BroadwayAPI.aspx?Method=ContactUs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Name: formData.Name,
            Phone: formData.Phone,
            Remarks: formData.Instructions,
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
          Instructions: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
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
          <div className="mt-2 p-4 shadow-[5px_0px_20px_rgba(0,0,0,0.1)] rounded-lg">
            <h2 className="text-3xl font-extrabold mb-4 dark:text-white">Contact</h2>

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
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 focus:outline-none dark:bg-[#efefef45]"
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
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 focus:outline-none dark:bg-[#efefef45]"
                    placeholder="Type your number here"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Your Message
                  </label>
                  <textarea
                    rows={2}
                    value={formData.Instructions}
                    onChange={(e) =>
                      setFormData({ ...formData, Instructions: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 focus:outline-none dark:bg-[#efefef45]"
                    placeholder="Type your query here"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#FFC714] text-[var(--text-primary)] py-3 dark:text-black rounded-md font-extrabold hover:bg-[#e3b013] transition-colors uppercase flex items-center justify-center text-[14px]"
              >
                SEND YOUR MESSAGE
              </button>
            </form>
          </div>
          <ContactDetails />
        </div>
      </div>
    </div>
  );
};

export default ContactPopup;
