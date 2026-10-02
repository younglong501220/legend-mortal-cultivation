import React from 'react';
import { PlayerState } from '../../types/game';
import { HEAVENS_33, REALMS, BODY_REALMS } from '../../utils/constants';
import { Sparkles, Crown, CheckCircle2, XCircle, Landmark, Coins, ShieldCheck } from 'lucide-react';

interface HeavensTabProps {
  player: PlayerState;
  onTryAscend: () => void;
  onClaimHeavenSalary: () => void;
}

export const HeavensTab: React.FC<HeavensTabProps> = ({
  player,
  onTryAscend,
  onClaimHeavenSalary
}) => {
  const condRealm = player.realmIdx >= 10;
  const condBody = player.bodyIdx >= 6;
  const condQi = player.spiritArrayLv >= 20;
  const allCondMet = condRealm && condBody && condQi;

  const canClaimSalary = player.ascended && Date.now() - player.lastHeavenClaimTime >= 24 * 3600 * 1000;
  const hoursUntilClaim = player.ascended
    ? Math.max(0, Math.ceil((player.lastHeavenClaimTime + 24 * 3600 * 1000 - Date.now()) / (1000 * 3600)))
    : 0;

  return (
    <div className="space-y-4">
      {/* 南天門 · 登仙台 */}
      <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252b39] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-amber-400 rounded-full" />
            <h2 className="text-base font-serif font-bold text-amber-300 flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>南天門 · 登仙台 (仙凡之變)</span>
            </h2>
          </div>
          {player.ascended && (
            <span className="text-xs font-mono text-amber-300 bg-amber-950/60 border border-amber-600/50 px-2 py-0.5 rounded flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              仙籍在冊 · 榮登天界
            </span>
          )}
        </div>

        <p className="text-xs text-[#8a96ab] leading-relaxed mb-4">
          仙凡有別，大道通天。凡人修士唯有修煉至<b>【散仙境界】</b>、淬體達到<b>【千山金身】</b>，且洞府聚靈陣達<b>【二十階】</b>，方能叩開南天仙門，硬抗九重天劫洗禮，踏足至高三十三天闕！
        </p>

        {/* 3 Conditions Status Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#11141c] border border-[#232936] p-3 rounded-lg mb-4 text-xs">
          {/* Realm Condition */}
          <div className="flex items-start gap-2">
            {condRealm ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-[#6d798e]">1. 境界考驗</div>
              <div className={`font-semibold mt-0.5 ${condRealm ? 'text-emerald-300' : 'text-rose-400'}`}>
                {condRealm ? '已達散仙之境' : `當前【${REALMS[player.realmIdx]}】(需散仙)`}
              </div>
            </div>
          </div>

          {/* Body Condition */}
          <div className="flex items-start gap-2">
            {condBody ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-[#6d798e]">2. 肉身橫渡</div>
              <div className={`font-semibold mt-0.5 ${condBody ? 'text-emerald-300' : 'text-rose-400'}`}>
                {condBody ? '肉身已成金身' : `當前【${BODY_REALMS[player.bodyIdx]}】(需金身)`}
              </div>
            </div>
          </div>

          {/* Qi Array Condition */}
          <div className="flex items-start gap-2">
            {condQi ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-[#6d798e]">3. 聚靈陣底蘊</div>
              <div className={`font-semibold mt-0.5 ${condQi ? 'text-emerald-300' : 'text-rose-400'}`}>
                {condQi ? '聚靈陣底蘊充足' : `當前【${player.spiritArrayLv}階】(需20階)`}
              </div>
            </div>
          </div>
        </div>

        {/* Ascend / Action button */}
        {!player.ascended ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={onTryAscend}
              disabled={!allCondMet}
              className={`py-2.5 px-6 rounded font-serif font-bold text-sm transition flex items-center gap-2 ${
                allCondMet
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-lg shadow-amber-900/40 cursor-pointer active:scale-[0.98]'
                  : 'bg-[#202531] text-[#5c667a] border border-[#2d3342] cursor-not-allowed opacity-60'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>肉身橫渡 · 叩仙門飛升三十三天</span>
            </button>
            <span className="text-xs text-[#6e7b91]">
              {allCondMet ? '萬事俱備，只待道友扣關引動接引仙光！' : '根基尚淺，請繼續在凡間厚積真元。'}
            </span>
          </div>
        ) : (
          <div className="bg-[#141a24] border border-amber-500/30 p-3 rounded-lg flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs font-serif font-bold text-amber-300">已榮登仙道正籍</div>
                <div className="text-[11px] text-[#828fa3]">
                  道友已名列天闕，每日可自仙宮領取天界俸祿 500 靈石與極品靈露。
                </div>
              </div>
            </div>

            <button
              onClick={onClaimHeavenSalary}
              disabled={!canClaimSalary && player.lastHeavenClaimTime > 0}
              className={`py-2 px-4 rounded text-xs font-semibold transition flex items-center gap-1.5 ${
                canClaimSalary || player.lastHeavenClaimTime === 0
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/60 text-amber-300 cursor-pointer active:scale-[0.98]'
                  : 'bg-[#181c25] text-[#555f72] border border-[#242934] cursor-not-allowed opacity-60'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>{canClaimSalary || player.lastHeavenClaimTime === 0 ? '領取今日天俸 (+500靈石)' : `冷卻中 (${hoursUntilClaim}小時後)`}</span>
            </button>
          </div>
        )}
      </div>

      {/* 三十三天闕全覽 */}
      <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-[#252b39] pb-3">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-serif font-bold text-[#c9d3e3]">三十三天宮闕全覽</h3>
          </div>
          <span className="text-xs text-[#768297]">
            仙界重霄 · 浩瀚無垠
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-96 overflow-y-auto pr-1">
          {HEAVENS_33.map((heaven, idx) => {
            const isAccessible = player.ascended && (idx < 3 || player.realmIdx >= 10 + Math.floor(idx / 3));

            return (
              <div
                key={heaven.level}
                className={`p-2.5 rounded border transition flex items-center justify-between text-xs ${
                  isAccessible
                    ? 'bg-[#1a202c] border-amber-500/40 text-amber-200'
                    : 'bg-[#12151c] border-[#222734] text-[#6a7589]'
                }`}
              >
                <div>
                  <div className={`font-serif font-medium ${isAccessible ? 'text-amber-300' : 'text-[#8c97aa]'}`}>
                    {heaven.name}
                  </div>
                  <div className="text-[10px] text-[#5c677a] mt-0.5">
                    需：{heaven.reqLevel}
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[11px] font-mono ${isAccessible ? 'text-emerald-400' : 'text-[#505a6e]'}`}>
                    {isAccessible ? '仙府已入駐' : '仙罡阻隔'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
