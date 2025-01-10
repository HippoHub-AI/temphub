const Cards = ({ icon, heading, text, onClick }: any) => {
  return (
    <div
      className="w-[25%]  p-8 border rounded-2xl shadow-custom-dark bg-white cursor-pointer"
      onClick={onClick}
    >
      {icon && <div className="flex justify-center mb-4">{icon}</div>}
      <h2 className="text-[#1B2559] font-PlusJakartaSans font-bold text-center">
        {heading}
      </h2>
      <p className="text-[14px] text-[#475569] font-PlusJakartaSans text-center">
        {text}
      </p>
    </div>
  );
};

export default Cards;
