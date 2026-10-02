import React, { useState } from 'react';
import { PlayerState } from '../../types/game';
import { REALMS, REALM_TITLES, BODY_REALMS, BODY_DESC } from '../../utils/constants';
import { Flame, Shield, Sparkles, Zap, AlertTriangle, Moon, CheckCircle2, ChevronRight } from 'lucide-react';

interface CultivationTabProps {
  player: PlayerState;
  reqExp: number;
  bodyCost: number;
  successRate: number;
  expPerTick: number;
  onAttemptBreakthrough: (usePillId?: string) => void;
  onMeditateInstant: () => void;
  onQuenchedBody: () => void;
  onSlayMindDemon: () => void;
  onUseItem: (itemId: string) => void;
}

export const CultivationTab: React.FC<CultivationTabProps> = ({
  player,
  reqExp,
  bodyCost,
  successRate,
  expPerTick,
  onAttemptBreakthrough,
  onMeditateInstant,
  onQuenchedBody,
  onSlayMindDemon,
  onUseItem
}) => {
  const [selectedPill, setSelectedPill] = useState<string>('none');

  const expPct = Math.min(100, Math.max(0, (player.exp / reqExp) * 100));
  const bodyPct = Math.min(100, Math.max(0, (player.exp / bodyCost) * 100));

  const hasZhujiPill = (player.inventory['pill_zhuji'] || 0) > 0;
  const hasPozhangPill = (player.inventory['pill_pozhange'] || 0) > 0;
  const hasQingxinPill = (player.inventory['pill_qingxin'] || 0) > 0;

  // Calculate rate with pill if selected
  let effectiveSuccessRate = successRate;
  if (selectedPill === 'pill_zhuji' && hasZhujiPill) {
    effectiveSuccessRate = Math.min(100, effectiveSuccessRate + 15);
  } else if (selectedPill === 'pill_pozhange' && hasPozhangPill) {
    effectiveSuccessRate = Math.min(100, effectiveSuccessRate + 20);
  }

  const isMajorBreak = player.realmSubLevel === 10;
  const isDemonLocked = player.mindDemon >= 80;

  return (
    <div className="space-y-4">
      {/* 氣海突破主區塊 */}
      <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252b39] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-amber-500 rounded-full" />
            <h2 className="text-base font-serif font-bold text-[#e2b755] flex items-center gap-1.5">
              <span>修士仙命 · 氣海修行</span>
              {isMajorBreak && (
                <span className="text-[11px] font-sans text-rose-400 bg-rose-950/60 border border-rose-800/40 px-2 py-0.5 rounded">
                  天劫降臨
                </span>
              )}
            </h2>
          </div>
          <div className="text-xs text-[#7e889b] font-mono">
            {isDemonLocked ? (
              <span className="text-rose-400 font-bold flex items-center gap-1 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                心魔橫生 · 修為凍結
              </span>
            ) : (
              <span className="text-emerald-400">
                凝神吸納: +{expPerTick} 修為 / 1.5秒
              </span>
            )}
          </div>
        </div>

        {/* Current Realm Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <div className="text-xs text-[#768297]">當前道境</div>
            <div className="text-lg font-serif font-bold text-[#f3d37a] flex items-center gap-2 mt-0.5">
              <span>{REALMS[player.realmIdx]} {player.realmSubLevel}層</span>
              <span className="text-xs font-normal text-[#8c97ad] px-2 py-0.5 bg-[#12141c] border border-[#252a37] rounded">
                {REALM_TITLES[player.realmIdx]}
              </span>
            </div>
          </div>

          <div className="md:text-right">
            <div className="text-xs text-[#768297]">破境預測成功率</div>
            <div className="text-base font-mono font-bold mt-0.5 flex items-center md:justify-end gap-1.5">
              <span className={effectiveSuccessRate >= 70 ? 'text-emerald-400' : effectiveSuccessRate >= 50 ? 'text-amber-400' : 'text-rose-400'}>
                {effectiveSuccessRate}%
              </span>
              {selectedPill !== 'none' && (
                <span className="text-xs text-amber-300 font-normal">
                  (丹藥加持)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Exp Progress Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-xs text-[#768297]">
            <span>修為積蓄: <b className="text-cyan-300 font-mono tabular-nums">{Math.floor(player.exp).toLocaleString()}</b> / <span className="font-mono tabular-nums">{reqExp.toLocaleString()}</span></span>
            <span className="font-mono">{expPct.toFixed(1)}%</span>
          </div>
          <div className="w-full h-3 bg-[#0d0f14] border border-[#252b38] rounded-full overflow-hidden p-[1px]">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                expPct >= 100
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-300 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-500'
              }`}
              style={{ width: `${expPct}%` }}
            />
          </div>
        </div>

        {/* Pill Boost selection */}
        {(hasZhujiPill || hasPozhangPill) && (
          <div className="bg-[#12151c] border border-[#232936] rounded p-2.5 mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="text-[#8e9bb0] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>使用破境輔助靈丹：</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedPill('none')}
                className={`px-2 py-1 rounded border transition ${
                  selectedPill === 'none'
                    ? 'border-amber-500 text-amber-300 bg-amber-950/30'
                    : 'border-[#2d3342] text-[#717b8f]'
                }`}
              >
                不使用
              </button>
              {hasZhujiPill && (
                <button
                  onClick={() => setSelectedPill('pill_zhuji')}
                  className={`px-2 py-1 rounded border transition ${
                    selectedPill === 'pill_zhuji'
                      ? 'border-amber-500 text-amber-300 bg-amber-950/30 font-medium'
                      : 'border-[#2d3342] text-[#8e9bb0]'
                  }`}
                >
                  築基丹 (+15%機率, 餘{player.inventory['pill_zhuji']})
                </button>
              )}
              {hasPozhangPill && (
                <button
                  onClick={() => setSelectedPill('pill_pozhange')}
                  className={`px-2 py-1 rounded border transition ${
                    selectedPill === 'pill_pozhange'
                      ? 'border-amber-500 text-amber-300 bg-amber-950/30 font-medium'
                      : 'border-[#2d3342] text-[#8e9bb0]'
                  }`}
                >
                  破障丹 (+20%機率, 餘{player.inventory['pill_pozhange']})
                </button>
              )}
            </div>
          </div>
        )}

        {/* Actions Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              onAttemptBreakthrough(selectedPill !== 'none' ? selectedPill : undefined);
              if (selectedPill !== 'none') setSelectedPill('none');
            }}
            disabled={player.exp < reqExp}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded font-serif font-semibold text-sm transition flex items-center justify-center gap-2 ${
              player.exp >= reqExp
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-[#0c0d12] shadow-lg shadow-amber-900/30 cursor-pointer active:scale-[0.98]'
                : 'bg-[#202531] text-[#5c667a] border border-[#2d3342] cursor-not-allowed opacity-60'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{isMajorBreak ? '迎天劫 · 破大圓滿' : '引氣入體 · 叩關突破'}</span>
          </button>

          <button
            onClick={onMeditateInstant}
            className="px-4 py-2.5 bg-[#1f2430] hover:bg-[#282f3f] border border-[#373f52] hover:border-amber-500/50 text-[#d8dee9] rounded text-sm transition flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
            title="手動吐納微助 (+15 修為)"
          >
            <Moon className="w-4 h-4 text-cyan-400" />
            <span>聚氣沉思 (+15)</span>
          </button>
        </div>

        {/* Lore / Hint */}
        <p className="mt-3 text-[11px] text-[#636e82] leading-relaxed">
          道友箴言：修行乃奪天地造化之舉，每重境界皆需厚積薄發。渡大境界天劫時成功率驟降，切勿急躁，可藉由肉身淬鍊與清心寧神提高成算。
        </p>
      </div>

      {/* Grid: 肉身成聖 & 紫府心魔 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 肉身成聖 */}
        <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#252b39] pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-rose-500 rounded-full" />
                <h3 className="text-sm font-serif font-bold text-[#e0a899]">肉身成聖 (體魄修煉)</h3>
              </div>
              <span className="text-[11px] text-[#768297]">反哺氣血與減傷</span>
            </div>

            <div className="space-y-1 mb-3">
              <div className="text-xs text-[#768297]">當前體質品階</div>
              <div className="text-base font-serif font-bold text-[#e0917e]">
                {BODY_REALMS[player.bodyIdx]} {player.bodySubLevel}階
              </div>
              <div className="text-[11px] text-[#858f9f] italic">
                {BODY_DESC[player.bodyIdx]}
              </div>
            </div>

            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-xs text-[#768297]">
                <span>消耗修為: <b className="text-rose-300 font-mono">{bodyCost.toLocaleString()}</b></span>
                <span className="font-mono">{bodyPct.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#0d0f14] border border-[#252b38] rounded-full overflow-hidden p-[1px]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-700 to-rose-400 transition-all duration-300"
                  style={{ width: `${bodyPct}%` }}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={onQuenchedBody}
              disabled={player.exp < bodyCost}
              className={`w-full py-2 px-3 rounded text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                player.exp >= bodyCost
                  ? 'bg-rose-950/80 hover:bg-rose-900 border border-rose-600/60 text-rose-200 cursor-pointer active:scale-[0.98]'
                  : 'bg-[#202531] text-[#5c667a] border border-[#2d3342] cursor-not-allowed opacity-60'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>淬體伐髓 (需 {bodyCost} 修為)</span>
            </button>
            <p className="mt-2 text-[10px] text-[#5f6878]">
              強大肉身能顯著提升命元上限與防禦力，更為日後抗衡南天門九霄天劫之基石。
            </p>
          </div>
        </div>

        {/* 紫府心魔 */}
        <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#252b39] pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-purple-500 rounded-full" />
                <h3 className="text-sm font-serif font-bold text-purple-300">紫府心魔 (道心砥礪)</h3>
              </div>
              <div className="text-xs">
                {player.mindDemon >= 80 ? (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> 走火入魔
                  </span>
                ) : player.mindDemon >= 40 ? (
                  <span className="text-amber-400">執念雜念</span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 道心通明
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1 mb-3">
              <div className="flex justify-between text-xs text-[#768297]">
                <span>心魔擾攘值 (≥80 凍結修行)</span>
                <span className="font-mono text-purple-400 font-bold">{player.mindDemon} / 100</span>
              </div>
              <div className="w-full h-2.5 bg-[#0d0f14] border border-[#252b38] rounded-full overflow-hidden p-[1px]">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    player.mindDemon >= 80
                      ? 'bg-gradient-to-r from-red-600 to-purple-600 animate-pulse'
                      : 'bg-gradient-to-r from-purple-700 to-indigo-500'
                  }`}
                  style={{ width: `${player.mindDemon}%` }}
                />
              </div>
            </div>

            <div className="text-[11px] text-[#7e899b] leading-relaxed mb-4">
              {player.mindDemon >= 80 ? (
                <span className="text-rose-400">
                  心魔已遮蔽靈臺！氣海真元逆流，所有自然修為與靈氣增長已停滯！請即刻閉關斬除心魔。
                </span>
              ) : player.mindDemon >= 40 ? (
                <span>
                  雜念紛至沓來，突破天劫成功率受心魔侵蝕有所降低。
                </span>
              ) : (
                <span>
                  靈臺空明無瑕，神思敏銳，修煉與突破無阻礙。
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                onClick={onSlayMindDemon}
                disabled={player.mindDemon <= 0}
                className={`flex-1 py-2 px-3 rounded text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                  player.mindDemon > 0
                    ? 'bg-[#252b38] hover:bg-[#303848] border border-[#3b4354] hover:border-purple-400/50 text-[#d8dee9] cursor-pointer active:scale-[0.98]'
                    : 'bg-[#181c25] text-[#555f72] border border-[#242934] cursor-not-allowed opacity-50'
                }`}
              >
                <span>靜心息念 (-25心魔)</span>
              </button>

              {hasQingxinPill && (
                <button
                  onClick={() => onUseItem('pill_qingxin')}
                  className="py-2 px-3 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-200 rounded text-xs font-semibold transition flex items-center gap-1 cursor-pointer active:scale-[0.98]"
                  title="服用清心玉露丹 (-40 心魔)"
                >
                  <span>服丹 (-40)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
