const BannerBase = ({ message, type }) => {
  const baseClasses = "w-full mb-2 select-none border-l-4 p-4 font-medium";
  let typeClasses = "";

  switch (type) {
    case "alert":
      typeClasses = "border-yellow-400 bg-yellow-100 hover:border-yellow-500";
      break;
    case "success":
      typeClasses = "border-green-400 bg-green-100 hover:border-green-500";
      break;
    default:
      typeClasses = "border-yellow-400 bg-yellow-100 hover:border-yellow-500";
  }

  return (
    <div className={`${baseClasses} ${typeClasses}`}>{message}</div>
  );
}

export default BannerBase;
