import eurobandImg from "@/assets/eurobandpl2.png";

/*
  Baner strony glownej - dokladny uklad i klasy ze STARY_PROJEKT (wersja bez animacji).
*/
export default function MainPageBanner() {
  return (
    <div className="border-black border-8 rounded-md font-bold w-[45%] flex z-30 bg-white">
      <img src={eurobandImg} alt="PL" className="sbg-blue-900 hd-17 w-16" />
      <div className="w-full pl-1 flex items-center justify-between">
        <div className="text-3xl pl-4 font-rdmnbold uppercase asd text-black">
          <p>
            polskie
            <br />
            tablice
            <br />
            rejestracyjne
          </p>
        </div>
        <div className="text-9xl font-rdmn tracking-wider pr-4 z-10 flex text-black">
          QUIZ
        </div>
      </div>
    </div>
  );
}
