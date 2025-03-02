import Image from "next/image";

interface ItemCardProps {
  item: any;
  isSuggestive?: boolean;
  onMinusClick?: (item: any) => void;
  onAddQuantity?: (id: number) => void;
  onAddSuggestedItem?: (item: any) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isSuggestive = false,
  onMinusClick,
  onAddQuantity,
  onAddSuggestedItem,
}) => {
  return (
    <div
      className={`flex flex-col p-2 bg-white dark:bg-[#202020] transition-opacity duration-200 ${
        isSuggestive ? "opacity-80" : ""
      } hover:opacity-100`}
    >
      <div className="flex gap-3 p-2 border-b">
        <div className="w-[60px] md:w-[80px] flex-shrink-0">
          <Image
            src={isSuggestive ? item.ItemImage : item.ItemImage}
            alt={isSuggestive ? item.ItemName : item.ProductName}
            width={80}
            height={80}
            className="w-full h-auto md:rounded-lg"
          />
        </div>

        <div className="flex-1 flex flex-col min-w-0 p-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[16px] font-semibold line-clamp-2 dark:text-white">
              {isSuggestive ? item.ItemName : item.ProductName}
            </h3>
            {isSuggestive && (
              <span className="bg-[#1f9226] text-white text-xs p-1 rounded-md whitespace-nowrap">
                Suggested
              </span>
            )}
          </div>

          {!isSuggestive && item.options && (
            <div className="flex flex-col">
              {item.options.map((option: any) => (
                <div
                  key={option.OptionID}
                  className="text-[12px] text-gray-600 flex justify-between"
                >
                  <span className="font-normal">
                    {option.OptionGroupName}: {option.OptionName} x{" "}
                    {option.Quantity}
                  </span>
                  {option.Price > 0 && (
                    <span className="ml-auto text-[10px]">
                      +Rs.{option.Price}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-1 mt-3">
          {isSuggestive ? (
            <>
              <span className="text-[14px] rounded px-[4px] py-[3px] dark:text-gray-500">
                Rs. {item.price}
              </span>
              {Number(item.originalprice) > 0 && (
                <span className="text-[12px] line-through text-gray-500">
                  Rs. {item.originalprice}
                </span>
              )}
            </>
          ) : (
            <>
              {item.discountGiven > 0 && (
                <span className="text-[12px] line-through rounded px-[2px] py-[5px] dark:text-white">
                  Rs.{" "}
                  {Number(
                    (item.TotalProductPrice + item.discountGiven) *
                      Number(item.Quantity)
                  )}
                </span>
              )}
              <span className="text-[16px] font-semibold px-[4px] py-[3px] dark:text-white">
                Rs. {Number(item.TotalProductPrice * Number(item.Quantity))}
              </span>
            </>
          )}
        </div>
        {isSuggestive ? (
          <button
            className="w-full py-1 bg-[#ffc714] dark:text-black text-[var(--text-primary)] font-extrabold rounded-md text-[12px] max-w-[120px] md:max-w-[340px] hover:bg-[#e5b413] transition-colors uppercase"
            onClick={() => onAddSuggestedItem?.(item)}
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center h-8">
            <button
              className="w-8 h-8 rounded-full bg-[var(--primary-light)] flex items-center justify-center"
              onClick={() => onMinusClick?.(item)}
            >
              <span className="w-[15px] h-0.5 bg-[#000] text-[var(--text-primary)]"></span>
            </button>

            <input
              type="text"
              className="w-16 text-center mx-[5px] border border-[#ccc] rounded-[30px] h-[35px] px-2 text-[var(--text-primary)] dark:bg-transparent"
              value={item.Quantity}
              readOnly
            />

            <button
              className="w-8 h-8 rounded-full bg-[#ffc714] flex items-center justify-center"
              onClick={() => onAddQuantity?.(item.ItemID)}
            >
              <svg
                className="w-6 h-6 text-[var(--text-primary)] dark:text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
