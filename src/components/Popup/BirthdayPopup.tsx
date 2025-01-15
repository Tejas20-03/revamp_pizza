import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import ContactDetails from "../UI/ContactDetails";
import { useDispatch } from "react-redux";
import { openToaster } from "@/redux/toaster/slice";

interface BirthdayPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BirthdayDeal {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string[];
}

const birthdayDeals: BirthdayDeal[] = [
  {
    id: "deal1",
    name: "Deal 1",
    price: "Rs 8,499/-",
    image: "https://admin.broadwaypizza.com.pk/Images/BirthdayDeals/Deal-1.jpg",
    description: [
      '10 x 6" Regular Pizzas',
      '5 X 8" Star Pizza',
      "12 Pcs Chicken Mega Bites",
      "2 X Large Drinks",
      "4 Dip Sauces",
      "5 X Kids Puzzle",
      "5 x Slice Juice",
    ],
  },
  {
    id: "deal2",
    name: "Deal 2",
    price: "Rs 10,499/-",
    image: "https://admin.broadwaypizza.com.pk/Images/BirthdayDeals/Deal-2.jpg",
    description: [
      "3 X Medium Pizza",
      "3 X Creamy Pasta",
      "3 x Square Sandwich",
      "2 X Appetizer Platter",
      "3 X Large Drinks",
      "4 Dip Sauces",
    ],
  },
  {
    id: "deal3",
    name: "Deal 3",
    price: "Rs 15,199/-",
    image: "https://admin.broadwaypizza.com.pk/Images/BirthdayDeals/Deal-3.jpg",
    description: [
      '16 x Slices Of 20" XXXL Pizza',
      '6 X 8" Star Pizza',
      "24 Pcs Chicken Mega Bites",
      "4 X Large Drinks",
      "8 x Dip Sauces",
      "6 X Kids Puzzle",
      "6 x Slice Juice",
    ],
  },
  {
    id: "deal4",
    name: "Deal 4",
    price: "Rs 15,199/-",
    image: "https://admin.broadwaypizza.com.pk/Images/BirthdayDeals/Deal-4.jpg",
    description: [
      "4 X Large Pizza",
      "4 X Creamy Pastas",
      "4 X Calzones",
      "24 x Garlic Breads",
      "5 X Large Drinks",
      "8 Dip Sauces",
    ],
  },
];

const BirthdayPopup: React.FC<BirthdayPopupProps> = ({ isOpen, onClose }) => {
  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
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

    if (selectedDeals.length === 0) {
      dispatch(
        openToaster({
          title: "Information Missing",
          message: "Please type all the required fields.",
          buttonText: "OK",
        })
      );
      return;
    }

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
        "https://services.broadwaypizza.com.pk/BroadwayAPI.aspx?Method=AddBirthdayEvent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            birthday_deal: selectedDeals.map(
              (dealId) => birthdayDeals.find((deal) => deal.id === dealId)?.name
            ),
            Name: formData.Name,
            Phone: formData.Phone,
            Email: formData.Email,
            NoofPerson: formData.NoofPerson,
            date_time: formData.date_time,
            location: formData.EventLocation,
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
        setSelectedDeals([]);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const handleDownloadMenu = () => {
    window.open("/downloads/BirthdayMenu.pdf", "_blank");
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
        <div className="p-2">
          <div className="mt-2 p-4 shadow-[5px_0px_20px_rgba(0,0,0,0.1)] rounded-lg dark:bg-[#202020]">
            <h2 className="text-3xl font-extrabold mb-2 dark:text-white">Birthdays</h2>
            <p className="text-[var(--primary-text)] text-[14px] mb-6 dark:text-gray-200">
              Indulge in the exceptional birthday deals experience brought to
              you by Broadway's Pizza. Contact us at 111-339-339 or 03011136804
              to explore the full spectrum of our birthday services.
            </p>

            <div>
              <h3 className="font-extrabold mb-4 dark:text-gray-200">Select Deal *</h3>
              <div className="flex flex-row gap-2 overflow-x-auto mb-6 p-2">
                {birthdayDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className={`flex-shrink-0 w-[140px] border rounded-lg p-1 cursor-pointer transition-all text-center dark:bg-[#ffffff0f] ${
                      selectedDeals.includes(deal.id)
                        ? "border-[#FFC714] bg-yellow-50 dark:bg-[#008c00]"
                        : "border-gray-200"
                    }`}
                    onClick={() => {
                      setSelectedDeals((prev) => {
                        if (prev.includes(deal.id)) {
                          return prev.filter((id) => id !== deal.id);
                        }
                        return [...prev, deal.id];
                      });
                    }}
                  >
                    <div className="space-y-1">
                      <Image
                        src={deal.image}
                        alt={deal.name}
                        width={180}
                        height={180}
                        className="rounded-lg w-20 h-20 object-cover mx-auto"
                      />
                      <div>
                        <h3 className="font-light text-[13px] text-[#555555] dark:text-white">
                          {deal.name}
                        </h3>
                        <p className="text-[9px] text-gray-600 dark:text-white">
                          {deal.description.join(", ")}
                        </p>
                        <p className="font-light text-[#FF0000] text-[11px]">
                          {deal.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
                    value={formData.Phone}
                    onChange={(e) =>
                      setFormData({ ...formData, Phone: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 focus:outline-none  dark:bg-[#efefef45]"
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
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 focus:outline-none  dark:bg-[#efefef45]"
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
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 focus:outline-none  dark:bg-[#efefef45]"
                    placeholder="Enter here"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Date and Time of Event (*)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.date_time}
                    onChange={(e) =>
                      setFormData({ ...formData, date_time: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 focus:outline-none  dark:bg-[#efefef45]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
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
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 focus:outline-none  dark:bg-[#efefef45]"
                    placeholder="Type your location here"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Special Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={formData.Instructions}
                    onChange={(e) =>
                      setFormData({ ...formData, Instructions: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 p-3 text-[14px] bg-gray-100 focus:outline-none  dark:bg-[#efefef45]"
                    placeholder="Type your message here"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#FFC714] dark:text-black text-[var(--text-primary)] py-2 rounded-md font-extrabold hover:bg-[#e3b013] transition-colors uppercase flex items-center justify-center text-[14px]"
              >
                Submit your query{" "}
                <span className="text-2xl text-center">&rarr;</span>
              </button>

              {/* Contact information section */}
            </form>
          </div>
        </div>
        <div className="space-y-4 p-4">
          <button
            onClick={handleDownloadMenu}
            className="w-full border-2 border-[#0ca353] text-[#0ca353] py-2 rounded-md font-extrabold transition-colors text-[14px]"
          >
            DOWNLOAD BIRTHDAY MENU
          </button>
          <ContactDetails />
        </div>
      </div>
    </div>
  );
};

export default BirthdayPopup;
