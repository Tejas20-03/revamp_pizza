import LocationDisplay from "@/components/UI/LocationDialog";
import Image from "next/image";

interface OrderFormProps {
  formData: {
    name: string;
    remarks: string;
    phone: string;
    payment: string;
    address: string;
    email: string;
    landmark: string;
  };
  setFormData: (data: any) => void;
  addressData: any;
  paymentType: string;
  errors: string;
}

const OrderForm: React.FC<OrderFormProps> = ({
  formData,
  setFormData,
  addressData,
  paymentType,
  errors,
}) => {
  console.log(addressData);
  return (
    <div className="">
      <div className="space-y-4 rounded-lg shadow-[5px_0px_20px_rgba(0,0,0,0.1)] border px-2 py-6">
        <h2 className="text-xl font-bold mb-4">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {" "}
          <div>
            <label className="block text-sm opacity-70 font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:outline-none text-[14px]"
              placeholder="Type your full name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm opacity-70 font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:outline-none text-[14px]"
              placeholder="Type your phone no."
              value={formData.phone || addressData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm opacity-70 font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:outline-none text-[14px]"
            placeholder="Type your email address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium opacity-70 text-gray-700">
            Special Instructions
          </label>
          <textarea
            className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm"
            placeholder="Type special instructions here"
            rows={1}
            value={formData.remarks}
            onChange={(e) =>
              setFormData({ ...formData, remarks: e.target.value })
            }
          />
        </div>
        </div>
        

        <LocationDisplay
          city={addressData.city}
          area={addressData.area}
          outlet={addressData.outlet}
          addressType={addressData.addressType}
        />

        {addressData.addressType === "Delivery" && (
          <>
            <div>
              <label className="block text-sm opacity-70 font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:outline-none text-[14px]"
                placeholder="Type your delivery address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm opacity-70 font-medium text-gray-700">
                Nearest Landmark
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:outline-none text-[14px]"
                placeholder="Type your nearest landmark"
                value={formData.landmark}
                onChange={(e) =>
                  setFormData({ ...formData, landmark: e.target.value })
                }
              />
            </div>
          </>
        )}

        
      </div>

      <div className="mt-6 flex flex-col gap-1 mb-6">
        <h3 className="text-lg font-medium text-gray-900">Payment</h3>
        <div className="mt-2 space-y-4">
          {(paymentType === "" || paymentType === "Cash") && (
            <label className="flex items-center gap-4">
              <input
                type="radio"
                name="payment"
                value="Cash"
                checked={formData.payment === "Cash"}
                onChange={(e) =>
                  setFormData({ ...formData, payment: e.target.value })
                }
                className="w-5 h-5 appearance-none border-2 rounded-full border-gray-800 checked:border-[var(--yellow-border)] relative before:content-[''] before:block before:w-[10px] before:h-[10px] before:rounded-full before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 checked:before:bg-[var(--primary)]"
              />
              <span className="ml-2 flex items-center gap-2">
                Cash
                <Image
                  src="/assets/cash.svg"
                  alt="cash"
                  width={50}
                  height={50}
                />
              </span>
            </label>
          )}
          {(paymentType === "" || paymentType === "CreditCard") && (
            <label className="flex items-center gap-4">
              <input
                type="radio"
                name="payment"
                value="CreditCard"
                checked={formData.payment === "CreditCard"}
                onChange={(e) =>
                  setFormData({ ...formData, payment: e.target.value })
                }
                className="w-5 h-5 appearance-none border-2 rounded-full border-gray-800 checked:border-[var(--yellow-border)] relative before:content-[''] before:block before:w-[10px] before:h-[10px] before:rounded-full before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 checked:before:bg-[var(--primary)]"
              />
              <span className="ml-2 flex items-center gap-2">
                Credit/Debit Card
                <Image
                  src="/assets/card.svg"
                  alt="card"
                  width={50}
                  height={50}
                />
              </span>
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
