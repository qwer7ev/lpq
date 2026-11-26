import eurobandImg from "@/assets/eurobandpl2.png";

/*
  Komponent tablicy rejestracyjnej z zachowaniem dokladnego UI ze starego projektu.
*/
export default function LicensePlate(props: { plate?: string; plateData?: string }) {
  const plateText = props.plate ?? props.plateData ?? "";

  return (
    <div className="border-black border-8 rounded-md font-bold aw-7/12 flex bg-white">
      <img src={eurobandImg} alt="PL" className="sbg-blue-900 hd-17 w-16" />
      <div className="pl-1 text-8xl md:text-9xl m-auto">
        <p className="font-rdmn tracking-wider text-black select-none">
          {plateText}
        </p>
      </div>
    </div>
  );
}
