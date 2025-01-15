import React, { useState } from "react";

import { IoClose } from "react-icons/io5";
import Image from "next/image";
import ContactDetails from "../UI/ContactDetails";
import { openToaster } from "@/redux/toaster/slice";
import { useDispatch } from "react-redux";

interface CateringPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CateringPopup: React.FC<CateringPopupProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    Name: "",
    Phone: "",
    Email: "",
    NoofPerson: "",
    date_time: "",
    EventLocation: "",
    Instructions: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.Name ||
      !formData.Phone ||
      !formData.Email ||
      !formData.NoofPerson ||
      !formData.date_time ||
      !formData.EventLocation
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
        "https://services.broadwaypizza.com.pk/BroadwayAPI.aspx?Method=AddCateringEvent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Name: formData.Name,
            Phone: formData.Phone,
            Email: formData.Email,
            NoofPerson: formData.NoofPerson,
            date_time: formData.date_time,
            Location: formData.EventLocation,
            Instructions: formData.Instructions,
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
          date_time: "",
          EventLocation: "",
          Instructions: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDownloadMenu = () => {
    window.open("/downloads/CateringMenu.pdf", "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="bg-white dark:bg-[#121212] w-full max-w-[800px] h-screen sm:h-[690px] z-60 sm:rounded-md slide-up  shadow-xl overflow-y-auto pointer-events-auto">
        <div className="sticky top-0 z-10 bg-white dark:bg-[#202020] flex justify-between items-center p-4 dark:text-white">
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
        <div className="p-2 ">
          <div className="mt-2 p-4 shadow-[5px_0px_20px_rgba(0,0,0,0.1)] rounded-lg dark:bg-[#202020]">
            <h2 className="text-3xl font-extrabold mb-4 dark:text-white">
              Catering
            </h2>

            <p className="text-gray-600 text-[14px] mb-6 dark:text-white">
              Indulge in the exceptional catering experience brought to you by
              Broadway's Pizza on Wheels. Elevate your event with our
              full-service catering, perfect for intimate family gatherings of
              30 or grand celebrations hosting 300+ guests, including birthday
              parties, baby showers, bridal showers, Mehndi, Mayon, and more.
              Our tailored menus are designed exclusively for your occasion,
              ensuring a unique culinary experience. For added convenience, we
              offer pick-up services as well. Contact us at 111-339-339 or
              03011136804 to explore the full spectrum of our catering services.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium dark:text-gray-200 text-gray-700">
                    Full Name (*)
                  </label>
                  <input
                    type="text"
                    value={formData.Name}
                    onChange={(e) =>
                      setFormData({ ...formData, Name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 dark:bg-[#efefef45] focus:outline-none"
                    placeholder="Type your name here"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-gray-200 text-gray-700">
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
                  <label className="block text-sm font-medium dark:text-gray-200 text-gray-700">
                    Email Address (*)
                  </label>
                  <input
                    type="email"
                    value={formData.Email}
                    onChange={(e) =>
                      setFormData({ ...formData, Email: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 focus:outline-none dark:bg-[#efefef45]"
                    placeholder="Type your email address here"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-gray-200 text-gray-700">
                    Number of Persons (*)
                  </label>
                  <input
                    type="number"
                    value={formData.NoofPerson}
                    onChange={(e) =>
                      setFormData({ ...formData, NoofPerson: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 focus:outline-none dark:bg-[#efefef45]"
                    placeholder="Enter here"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-gray-200 text-gray-700">
                    Date and Time of Event (*)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.date_time}
                    onChange={(e) =>
                      setFormData({ ...formData, date_time: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 focus:outline-none dark:bg-[#efefef45]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-gray-200 text-gray-700">
                    Event Location (*)
                  </label>
                  <input
                    type="number"
                    value={formData.EventLocation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        EventLocation: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 focus:outline-none dark:bg-[#efefef45]"
                    placeholder="Type your location here"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-gray-200 text-gray-700">
                    Special Instructions
                  </label>
                  <textarea
                    rows={4}
                    value={formData.Instructions}
                    onChange={(e) =>
                      setFormData({ ...formData, Instructions: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 focus:outline-none dark:bg-[#efefef45]"
                    placeholder="Type your message here"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#FFC714] text-[var(--text-primary)] py-2 rounded-md font-extrabold hover:bg-[#e3b013] transition-colors dark:text-black uppercase flex items-center justify-center text-[14px]"
              >
                Submit your query{" "}
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
            DOWNLOAD CATERING MENU
          </button>

          <ContactDetails />
        </div>
      </div>
    </div>
  );
};

export default CateringPopup;
