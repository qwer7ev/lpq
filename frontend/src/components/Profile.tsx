import defaultAvatar from "@/assets/default-profile-picture.png";
import { timeAndScoreTB } from "@/database/db";
import { useAuth } from "@/context/AuthContext";

interface ProfileProps {
  onBackToHome?: () => void;
}

/*
  Podstrona profilu uzytkownika - dokladny uklad i tabele ze STARY_PROJEKT.
*/
export default function Profile({ onBackToHome }: ProfileProps) {
  const { user } = useAuth();
  const scores = user?.scores || {};

  function humanTime(secs: number) {
    if (!secs) return "00:00";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div className="min-h-screen w-full bg-violet-50 pb-12">
      {onBackToHome && (
        <div className="p-4">
          <button
            onClick={onBackToHome}
            className="text-violet-600 hover:text-violet-800 font-semibold cursor-pointer"
          >
            ← Wróć na stronę główną
          </button>
        </div>
      )}

      <section className="w-full grid grid-cols-4 h-60h">
        <div className="col-span-1 w-4/6 mt-1 ml-[20%]">
          <img
            src={defaultAvatar}
            alt="User Profile Picture"
            className="ml-[20%]"
          />
        </div>
        <div className="col-span-2">
          <h1 className="text-6xl ml-12 mt-8">{user?.username || "JanKowalski"}</h1>
          <h2 className="text-4xl ml-12 mt-8">{user?.name || "Jan"}</h2>
        </div>
        <div className="col-span-1">
          <h1 className="text-6xl ml-12 mt-8">poziom</h1>
          <h2 className="text-4xl ml-12 mt-8">ranga</h2>
        </div>
      </section>

      <section className="text-center mt-8 text-xl w-11/12 mx-auto">
        {/* Tabela 1 */}
        <table className="w-full my-4">
          <tbody>
            <tr>
              <th className="score-th">Wszystkie</th>
              <th className="score-th">Dolnośląskie</th>
              <th className="score-th">Kujawsko - pomorskie</th>
              <th className="score-th">Lubelskie</th>
              <th className="score-th">Lubuskie</th>
              <th className="score-th">Łódzkie</th>
            </tr>
            <tr>
              <td className="score-td" data-voi-info="all">
                <p
                  className={
                    scores.score_all === timeAndScoreTB.all.score
                      ? "text-[#c0ae47]"
                      : ""
                  }
                >
                  {scores.score_all || 0} / {timeAndScoreTB.all.score}
                </p>
                {humanTime(scores.time_all || 0)}
              </td>
              <td className="score-td" data-voi-info="DOL">
                <p
                  className={
                    scores.score_D === timeAndScoreTB.D.score
                      ? "text-[#c0ae47]"
                      : ""
                  }
                >
                  {scores.score_D || 0} / {timeAndScoreTB.D.score}
                </p>
                {humanTime(scores.time_D || 0)}
              </td>
              <td className="score-td" data-voi-info="KUJPOM">
                <p
                  className={
                    scores.score_C === timeAndScoreTB.C.score
                      ? "text-[#c0ae47]"
                      : ""
                  }
                >
                  {scores.score_C || 0} / {timeAndScoreTB.C.score}
                </p>
                {humanTime(scores.time_C || 0)}
              </td>
              <td className="score-td" data-voi-info="LUBEL">
                <p
                  className={
                    scores.score_L === timeAndScoreTB.L.score
                      ? "text-[#c0ae47]"
                      : ""
                  }
                >
                  {scores.score_L || 0} / {timeAndScoreTB.L.score}
                </p>
                {humanTime(scores.time_L || 0)}
              </td>
              <td className="score-td" data-voi-info="LUBU">
                <p
                  className={
                    scores.score_F === timeAndScoreTB.F.score
                      ? "text-[#c0ae47]"
                      : ""
                  }
                >
                  {scores.score_F || 0} / {timeAndScoreTB.F.score}
                </p>
                {humanTime(scores.time_F || 0)}
              </td>
              <td className="score-td" data-voi-info="LODZKI">
                <p
                  className={
                    scores.score_E === timeAndScoreTB.E.score
                      ? "text-[#c0ae47]"
                      : ""
                  }
                >
                  {scores.score_E || 0} / {timeAndScoreTB.E.score}
                </p>
                {humanTime(scores.time_E || 0)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Tabela 2 */}
        <table className="w-full my-4">
          <tbody>
            <tr>
              <th className="score-th">Małopolskie</th>
              <th className="score-th">Mazowieckie</th>
              <th className="score-th">Opolskie</th>
              <th className="score-th">Podkarpackie</th>
              <th className="score-th">Podlaskie</th>
              <th className="score-th">Pomorskie</th>
            </tr>
            <tr>
              <td className="score-td" data-voi-info="MALOPO">
                <p
                  className={
                    scores.score_K === timeAndScoreTB.K.score
                      ? "text-[#c0ae47]"
                      : ""
                  }
                >
                  {scores.score_K || 0} / {timeAndScoreTB.K.score}
                </p>
                {humanTime(scores.time_K || 0)}
              </td>
              <td className="score-td" data-voi-info="MAZOW">
                <p
                  className={
                    scores.score_W === timeAndScoreTB.W.score
                      ? "text-[#c0ae47]"
                      : ""
                  }
                >
                  {scores.score_W || 0} / {timeAndScoreTB.W.score}
                </p>
                {humanTime(scores.time_W || 0)}
              </td>
              <td className="score-td" data-voi-info="OPO">
                <p
                  className={
                    scores.score_O === timeAndScoreTB.O.score
                      ? "text-[#c0ae47]"
                      : ""
                  }
                >
                  {scores.score_O || 0} / {timeAndScoreTB.O.score}
                </p>
                {humanTime(scores.time_O || 0)}
              </td>
              <td className="score-td" data-voi-info="PODKAR">
                <p
                  className={
                    scores.score_R === timeAndScoreTB.R.score
                      ? "text-[#c0ae47]"
                      : ""
                  }
                >
                  {scores.score_R || 0} / {timeAndScoreTB.R.score}
                </p>
                {humanTime(scores.time_R || 0)}
              </td>
              <td className="score-td" data-voi-info="PODLA">
                <p
                  className={
                    scores.score_B === timeAndScoreTB.B.score
                      ? "text-[#c0ae47]"
                      : ""
                  }
                >
                  {scores.score_B || 0} / {timeAndScoreTB.B.score}
                </p>
                {humanTime(scores.time_B || 0)}
              </td>
              <td className="score-td" data-voi-info="POMOR">
                <p
                  className={
                    scores.score_G === timeAndScoreTB.G.score
                      ? "text-[#c0ae47]"
                      : ""
                  }
                >
                  {scores.score_G || 0} / {timeAndScoreTB.G.score}
                </p>
                {humanTime(scores.time_G || 0)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Tabela 3 */}
        <table className="w-full my-4">
          <tbody>
            <tr>
              <th className="score-th">Śląskie</th>
              <th className="score-th">Świętokrzyskie</th>
              <th className="score-th">Warmińsko - mazurskie</th>
              <th className="score-th">Wielkopolskie</th>
              <th className="score-th">Zachodniopomorskie</th>
              <th className="score-th">Dzielnice Warszawy</th>
            </tr>
            <tr>
              <td className="score-td" data-voi-info="SLAS">
                <p
                  className={
                    scores.score_S === timeAndScoreTB.S.score
                      ? "text-[#c0ae47]"
                      : ""
                  }
                >
                  {scores.score_S || 0} / {timeAndScoreTB.S.score}
                </p>
                {humanTime(scores.time_S || 0)}
              </td>
              <td className="score-td" data-voi-info="SWIETOKR">
                <p
                  className={
                    scores.score_T === timeAndScoreTB.T.score
                      ? "text-[#c0ae47]"
                      : ""
                  }
                >
                  {scores.score_T || 0} / {timeAndScoreTB.T.score}
                </p>
                {humanTime(scores.time_T || 0)}
              </td>
              <td className="score-td" data-voi-info="WARMMAZ">
                <p
                  className={
                    scores.score_N === timeAndScoreTB.N.score
                      ? "text-[#c0ae47]"
                      : ""
                  }
                >
                  {scores.score_N || 0} / {timeAndScoreTB.N.score}
                </p>
                {humanTime(scores.time_N || 0)}
              </td>
              <td className="score-td" data-voi-info="WLKPL">
                <p
                  className={
                    scores.score_P === timeAndScoreTB.P.score
                      ? "text-[#c0ae47]"
                      : ""
                  }
                >
                  {scores.score_P || 0} / {timeAndScoreTB.P.score}
                </p>
                {humanTime(scores.time_P || 0)}
              </td>
              <td className="score-td" data-voi-info="ZACHOD">
                <p
                  className={
                    scores.score_Z === timeAndScoreTB.Z.score
                      ? "text-[#c0ae47]"
                      : ""
                  }
                >
                  {scores.score_Z || 0} / {timeAndScoreTB.Z.score}
                </p>
                {humanTime(scores.time_Z || 0)}
              </td>
              <td className="score-td" data-voi-info="WAW">
                <p
                  className={
                    scores.score_X === timeAndScoreTB.X.score
                      ? "text-[#c0ae47]"
                      : ""
                  }
                >
                  {scores.score_X || 0} / {timeAndScoreTB.X.score}
                </p>
                {humanTime(scores.time_X || 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
