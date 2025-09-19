import { NoDataDisplayProps } from "../../lib/core";
import NoDataBlockIcon from "../icons/no-data-block-icon";

const NoDataDisplay = ({
  title,
  description,
  showIcon = true,
  height = "h-[calc(100vh-200px)]",
  hasSearch = false,
  show = false,
}: NoDataDisplayProps) => {
  const getTitle = () => {
    if (show) return "";
    return title ? `No ${title} Found` : "No Data Available";
  };

  const getDescription = () => {
    if (hasSearch) return "Try adjusting your search criteria or filters";
    return description || "There is currently no data to display.";
  };

  return (
    <div
      className={`flex flex-col ${height} justify-center items-center`}
      role="alert"
      aria-live="polite"
    >
      {showIcon && <NoDataBlockIcon className="!p-0 !m-0" />}
      <div className="text-center">
        <h2 className="text-base font-normal text-gray-700">{getTitle()}</h2>
        <p className={`text-gray-500 `}>{getDescription()}</p>
      </div>
    </div>
  );
};

export default NoDataDisplay;
