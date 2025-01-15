const ContactDetails = () => {
  return (
    <div className="mt-6 p-4 shadow-[5px_0px_20px_rgba(0,0,0,0.1)] rounded-lg dark:bg-[#202020] dark:text-white">
      <h3 className="font-bold mb-2 text-[16px]">Broadway Pizza Pakistan</h3>
      <div className="space-y-1 mb-4 text-[14px]">
        <a
          href="tel:021111339339"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-200"
        >
          UAN: +92 21 111 339 339
        </a>
        <a
          href="https://wa.me/+9221111339339"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-200"
        >
          Whatsapp: +92 21 111 339 339
        </a>
      </div>
      <h3 className="font-bold mb-2 text-[14px]">
        For general query email us at
      </h3>
      <div className="space-x-2 flex flex-row text-[14px]">
        <a
          href="mailto:info@broadwaypizza.com.pk"
          className="inline-block text-gray-600 dark:text-gray-200  dark:bg-[#efefef45] bg-gray-100 rounded-xl hover:text-gray-800 transition-colors px-2 py-1"
        >
          info@broadwaypizza.com.pk
        </a>
        <a
          href="mailto:franchise@broadwaypizza.com.pk"
          className="inline-block text-gray-600 dark:text-gray-200 dark:bg-[#efefef45]  bg-gray-100 rounded-xl hover:text-gray-800 transition-colors px-2 py-1"
        >
          franchise@broadwaypizza.com.pk
        </a>
        <a
          href="mailto:marketing@broadwaypizza.com.pk"
          className="inline-block text-gray-600 dark:text-gray-200 dark:bg-[#efefef45] bg-gray-100 rounded-xl hover:text-gray-800 transition-colors px-2 py-1"
        >
          marketing@broadwaypizza.com.pk
        </a>
      </div>
    </div>
  );
};

export default ContactDetails;
