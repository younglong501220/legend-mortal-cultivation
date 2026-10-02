import React from 'react';
import { PlayerState } from '../../types/game';
import { ROOT_NAMES } from '../../utils/constants';
import { Wind, Sparkles, Sprout, ArrowUpRight, Flame, Shield, Droplets, Mountain } from 'lucide-react';

interface CaveAbodeTabProps {
  player: PlayerState;
  qiPerSec: number;
  arrayUpgradeCost: number;
  onUpgradeSpiritArray: () => void;
  onUpgradeRoot: (key: keyof PlayerState['roots']) => void;
  onHarvestHerbs: () => void;
}

export const CaveAbodeTab: React.FC<CaveAbodeTabProps> = ({
  player,
  qiPerSec,
  arrayUpgradeCost,
  onUpgradeSpiritArray,
  onUpgradeRoot,
  onHarvestHerbs
}) => {
  const qiPct = Math.min(100, Math.max(0, (player.qi / player.qiMax) * 100));

  const getRootIcon = (key: string) => {
    switch (key) {
      case 'jin':
        return <Sparkles className="w-4 h-4 text-amber-300" />;
      case 'mu':
        return <Sprout className="w-4 h-4 text-emerald-400" />;
      case 'shui':
        return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'huo':
        return <Flame className="w-4 h-4 text-rose-400" />;
      case 'tu':
        return <Mountain className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* 洞府聚靈陣主面板 */}
      <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252b39] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-cyan-500 rounded-full" />
            <h2 className="text-base font-serif font-bold text-cyan-300 flex items-center gap-1.5">
              <span>洞府聚靈大陣</span>
              <span className="text-xs font-sans font-normal text-[#8897ae] px-2 py-0.5 bg-[#12151c] border border-[#252a37] rounded">
                階位：{player.spiritArrayLv} 階
              </span>
            </h2>
          </div>
          <div className="text-xs text-[#7e889b] font-mono">
            靈氣凝聚速度：<span className="text-cyan-400 font-bold">+{qiPerSec} 點/秒</span>
          </div>
        </div>

        <p className="text-xs text-[#7f8b9e] leading-relaxed mb-4">
          奪天地靈機於方寸之間。聚靈陣階位越高，靈氣池上限與產出速度越高，為洗鍊五行靈根不可或缺之道源。
        </p>

        {/* Qi progress bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-xs text-[#768297]">
            <span>靈池真元: <b className="text-[#e2b755] font-mono tabular-nums">{Math.floor(player.qi).toLocaleString()}</b> / <span className="font-mono tabular-nums">{player.qiMax.toLocaleString()}</span></span>
            <span className="font-mono">{qiPct.toFixed(1)}%</span>
          </div>
          <div className="w-full h-3 bg-[#0d0f14] border border-[#252b38] rounded-full overflow-hidden p-[1px]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 transition-all duration-300 shadow-[0_0_8px_rgba(212,175,55,0.4)]"
              style={{ width: `${qiPct}%` }}
            />
          </div>
        </div>

        {/* Upgrade Array Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#12151c] border border-[#232936] p-3 rounded-lg">
          <div>
            <div className="text-xs font-semibold text-[#d8dee9]">銘刻高階聚靈陣法圖紋</div>
            <div className="text-[11px] text-[#788496] mt-0.5">
              升級後：靈氣上限 +120，產能 +3/秒
            </div>
          </div>

          <button
            onClick={onUpgradeSpiritArray}
            disabled={player.stone < arrayUpgradeCost}
            className={`py-2 px-4 rounded text-xs font-semibold transition flex items-center gap-1.5 ${
              player.stone >= arrayUpgradeCost
                ? 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/60 text-amber-300 cursor-pointer active:scale-[0.98]'
                : 'bg-[#202531] text-[#5c667a] border border-[#2d3342] cursor-not-allowed opacity-60'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>晉升聚靈陣 (費 {arrayUpgradeCost.toLocaleString()} 靈石)</span>
          </button>
        </div>
      </div>

      {/* 五行靈根洗鍊 */}
      <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-between border-b border-[#252b39] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-emerald-500 rounded-full" />
            <h3 className="text-base font-serif font-bold text-emerald-300">五行靈根洗鍊</h3>
          </div>
          <span className="text-xs text-[#768297]">消耗聚靈池靈氣脫胎換骨</span>
        </div>

        <p className="text-xs text-[#7f8b9e] leading-relaxed mb-4">
          人身具金木水火土五行，洗滌靈根可大幅激發真元潛力，直接轉化為永久身家屬性。
        </p>

        {/* Roots 5-Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(['jin', 'mu', 'shui', 'huo', 'tu'] as const).map(key => {
            const rootInfo = ROOT_NAMES[key];
            const lv = player.roots[key];
            const qiCost = lv * 70;
            const canUpgrade = player.qi >= qiCost;

            return (
              <div
                key={key}
                className="bg-[#12151c] border border-[#242a37] hover:border-[#384155] rounded-lg p-3 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {getRootIcon(key)}
                      <span className={`font-serif font-bold text-sm ${rootInfo.color}`}>
                        {rootInfo.label}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#d8dee9] bg-[#1a1f29] border border-[#29303e] px-2 py-0.5 rounded">
                      Lv.{lv}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#7c889d] mb-3 leading-snug">
                    {rootInfo.desc}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1d232f] flex items-center justify-between">
                  <span className="text-xs text-[#6e7a8e] font-mono">
                    需靈氣: <b className="text-cyan-400 font-semibold">{qiCost}</b>
                  </span>
                  <button
                    onClick={() => onUpgradeRoot(key)}
                    disabled={!canUpgrade}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                      canUpgrade
                        ? 'bg-[#222938] hover:bg-[#2c3547] text-amber-300 border border-[#3b475e] hover:border-amber-500/50 cursor-pointer active:scale-[0.98]'
                        : 'bg-[#181c25] text-[#505a6e] border border-[#232835] cursor-not-allowed opacity-50'
                    }`}
                  >
                    洗鍊靈根
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 洞府靈圃 / 藥園 */}
      <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-serif font-bold text-emerald-300">洞府靈圃 (九葉雪芝圃)</div>
            <div className="text-xs text-[#7f8b9e]">
              靈田常年滋養九葉靈芝，當前儲備：<b className="text-emerald-400 font-mono">{player.herb || 0}</b> 株靈草
            </div>
          </div>
        </div>

        <button
          onClick={onHarvestHerbs}
          className="py-2 px-4 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-200 rounded text-xs font-semibold transition cursor-pointer active:scale-[0.98]"
        >
          採摘灌溉 (+3株靈草)
        </button>
      </div>
    </div>
  );
};
