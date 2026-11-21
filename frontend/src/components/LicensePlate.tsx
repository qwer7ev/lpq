import eurobandImg from "@/assets/eurobandpl2.png";

export default function LicensePlate(props: { plate?: string; plateData?: string }) {
  const plateText = props.plate ?? props.plateData ?? "";

  return (
    <div className="border-black border-8 rounded-lg font-bold flex bg-white max-w-full items-center shadow-lg select-none">
      <img
        src={eurobandImg}
        alt="PL"
        className="w-14 sm:w-16 md:w-20 self-stretch object-cover"
      />
      <div className="px-4 md:px-8 py-2 md:py-4 text-5xl sm:text-7xl md:text-8xl lg:text-9xl m-auto tracking-wider font-rdmn text-black whitespace-nowrap">
        {plateText}
      </div>
    </div>
  );
}
