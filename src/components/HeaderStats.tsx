import React from 'react';
import { PlayerState } from '../types/game';
import { REALMS, BODY_REALMS, EQUIPMENT_LIST } from '../utils/constants';
import { sound } from '../utils/audio';
import { Volume2, VolumeX, Save, RotateCcw, Sparkles, Shield, Swords, Heart } from 'lucide-react';

interface HeaderStatsProps {
  player: PlayerState;
  expPerTick: number;
  qiPerSec: number;
  onOpenSettings: () => void;
  onManualSave: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const HeaderStats: React.FC<HeaderStatsProps> = ({
  player,
  expPerTick,
  qiPerSec,
  onOpenSettings,
  onManualSave,
  isMuted,
  onToggleMute
}) => {
  const realmStr = `${REALMS[player.realmIdx]} ${player.realmSubLevel}層`;
  const bodyStr = `${BODY_REALMS[player.bodyIdx]} ${player.bodySubLevel}階`;

  // Calculate equipped bonuses
  let bonusAtk = 0;
  let bonusDef = 0;
  let bonusHp = 0;
  let bonusCrit = 0;

  if (player.equipped) {
    const w = EQUIPMENT_LIST.find(e => e.id === player.equipped.weapon);
    const a = EQUIPMENT_LIST.find(e => e.id === player.equipped.armor);
    const art = EQUIPMENT_LIST.find(e => e.id === player.equipped.artifact);
    [w, a, art].forEach(eq => {
      if (eq) {
        bonusAtk += eq.atkBonus;
        bonusDef += eq.defBonus;
        bonusHp += eq.hpBonus;
        bonusCrit += eq.critBonus;
      }
    });
  }

  const effectiveAtk = player.atk + bonusAtk;
  const effectiveDef = player.def + bonusDef;
  const effectiveHp = player.hpMax + bonusHp;
  const effectiveCrit = player.critRate + bonusCrit;

  return (
    <header className="relative bg-gradient-to-b from-[#1b1f2a] to-[#12151c] border-b border-[#2d3342] px-4 py-3 select-none">
      {/* Title & Quick Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg md:text-xl font-bold tracking-widest text-[#e2b755] drop-shadow-sm">
            凡人修真傳
          </span>
          <span className="hidden sm:inline text-xs text-[#7e889b] border border-[#2e3440] px-2 py-0.5 rounded">
            致敬經典文字放置MUD
          </span>
          {player.ascended && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded animate-pulse">
              <Sparkles className="w-3 h-3 text-amber-400" />
              已飛升三十三天
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className="p-1.5 text-xs text-[#9aa4b8] hover:text-[#e2b755] bg-[#1a1e27] border border-[#2f3545] rounded transition"
            title={isMuted ? "開啟道音" : "靜音"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onManualSave}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#9aa4b8] hover:text-[#e2b755] bg-[#1a1e27] border border-[#2f3545] rounded transition"
            title="手動保存進度"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden md:inline">保存</span>
          </button>
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#9aa4b8] hover:text-[#e2b755] bg-[#1a1e27] border border-[#2f3545] rounded transition"
            title="道藏設定 / 存檔導出"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">天道盤</span>
          </button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
        {/* 境界 / 肉身 */}
        <div className="bg-[#141720]/80 border border-[#272d3b] rounded p-2 flex flex-col justify-between">
          <span className="text-[#727d92] text-[11px]">境界 · 肉身</span>
          <div className="truncate font-medium text-[#d8dee9] mt-0.5">
            <span className="text-[#e2b755] font-semibold">{realmStr}</span>
            <span className="text-[#565f73] mx-1">/</span>
            <span className="text-[#d08770]">{bodyStr}</span>
          </div>
        </div>

        {/* 戰鬥實力 */}
        <div className="bg-[#141720]/80 border border-[#272d3b] rounded p-2 flex flex-col justify-between">
          <span className="text-[#727d92] text-[11px] flex items-center justify-between">
            <span>氣血 · 戰力</span>
            <span className="text-[10px] text-[#5e81ac]">暴擊 {effectiveCrit}%</span>
          </span>
          <div className="truncate font-mono tabular-nums text-[#d8dee9] mt-0.5 flex items-center gap-1.5">
            <span className="text-emerald-400 flex items-center gap-0.5" title="氣血上限">
              <Heart className="w-3 h-3 inline text-emerald-500" />
              {effectiveHp}
            </span>
            <span className="text-[#565f73]">|</span>
            <span className="text-rose-400 flex items-center gap-0.5" title="攻擊力">
              <Swords className="w-3 h-3 inline text-rose-500" />
              {effectiveAtk}
            </span>
            <span className="text-[#565f73]">|</span>
            <span className="text-cyan-400 flex items-center gap-0.5" title="防禦力">
              <Shield className="w-3 h-3 inline text-cyan-500" />
              {effectiveDef}
            </span>
          </div>
        </div>

        {/* 當前修為 */}
        <div className="bg-[#141720]/80 border border-[#272d3b] rounded p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#727d92] text-[11px]">
            <span>當前修為</span>
            <span className={player.mindDemon >= 80 ? "text-rose-400" : "text-emerald-400"}>
              {player.mindDemon >= 80 ? "心魔阻滯" : `+${expPerTick}/跳`}
            </span>
          </div>
          <div className="font-mono tabular-nums text-[#88c0d0] font-semibold text-sm mt-0.5">
            {Math.floor(player.exp).toLocaleString()}
          </div>
        </div>

        {/* 聚靈陣靈氣 */}
        <div className="bg-[#141720]/80 border border-[#272d3b] rounded p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#727d92] text-[11px]">
            <span>靈池蓄氣</span>
            <span className="text-cyan-400">+{qiPerSec}/秒</span>
          </div>
          <div className="font-mono tabular-nums text-[#d4af37] font-semibold text-sm mt-0.5">
            {Math.floor(player.qi).toLocaleString()}
            <span className="text-[#5b6579] font-normal text-xs ml-1">/ {player.qiMax}</span>
          </div>
        </div>

        {/* 靈石與靈草 */}
        <div className="col-span-2 sm:col-span-1 bg-[#141720]/80 border border-[#272d3b] rounded p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#727d92] text-[11px]">
            <span>儲物資糧</span>
            <span className="text-[#a3be8c]">草: {player.herb || 0}</span>
          </div>
          <div className="font-mono tabular-nums text-amber-300 font-semibold text-sm mt-0.5 flex items-center justify-between">
            <span>{player.stone.toLocaleString()} <span className="text-xs font-normal text-[#8c97ad]">靈石</span></span>
            {player.mindDemon > 0 && (
              <span className={`text-[11px] ${player.mindDemon >= 80 ? 'text-rose-400 font-bold' : player.mindDemon >= 40 ? 'text-amber-400' : 'text-[#7e889b]'}`}>
                魔: {player.mindDemon}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
