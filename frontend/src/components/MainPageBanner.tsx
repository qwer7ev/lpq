import eurobandImg from "@/assets/eurobandpl2.png";

export default function MainPageBanner() {
  return (
    <div className="border-black border-8 rounded-lg font-bold w-full max-w-4xl flex items-center bg-white shadow-xl">
      <img
        src={eurobandImg}
        alt="PL"
        className="w-14 sm:w-16 md:w-20 self-stretch object-cover"
      />
      <div className="w-full px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="text-xl sm:text-2xl md:text-3xl font-rdmnbold uppercase leading-tight tracking-wide text-left text-black">
          <p>
            polskie
            <br />
            tablice
            <br />
            rejestracyjne
          </p>
        </div>
        <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-rdmn tracking-wider text-black">
          QUIZ
        </div>
      </div>
    </div>
  );
}
