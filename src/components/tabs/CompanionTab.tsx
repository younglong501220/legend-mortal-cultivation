import React, { useState } from 'react';
import { PlayerState, Companion } from '../../types/game';
import { Heart, Sparkles, Swords, Gift, Shield, CheckCircle2, Lock, Flame, RefreshCw, Volume2, BookOpen, Compass } from 'lucide-react';
import { CompanionCompendiumView } from '../companion/CompanionCompendiumView';

interface CompanionTabProps {
  player: PlayerState;
  onDualCultivate: (companionId: string) => void;
  onGiftCompanion: (companionId: string, giftType: 'stone' | 'herb' | 'pill') => void;
  onSetActiveCompanion: (companionId: string) => void;
}

export const CompanionTab: React.FC<CompanionTabProps> = ({
  player,
  onDualCultivate,
  onGiftCompanion,
  onSetActiveCompanion
}) => {
  const [viewMode, setViewMode] = useState<'interaction' | 'compendium'>('interaction');
  const companionsList = Object.values(player.companions);
  const activeCompanion = player.activeCompanionId ? player.companions[player.activeCompanionId] : null;

  const getFavorStage = (favor: number): { label: string; color: string } => {
    if (favor >= 800) return { label: "生死相許", color: "text-rose-400 font-bold" };
    if (favor >= 500) return { label: "心有靈犀", color: "text-amber-300 font-semibold" };
    if (favor >= 200) return { label: "莫逆之交", color: "text-cyan-300" };
    return { label: "泛泛之交", color: "text-[#8895a9]" };
  };

  const DUAL_COOLDOWN_MS = 60 * 1000; // 60 seconds

  return (
    <div className="space-y-4">
      {/* 頂部視窗分頁切換按鈕 */}
      <div className="flex bg-[#12151d] border border-[#262c3b] p-1 rounded-lg gap-1 text-xs">
        <button
          onClick={() => setViewMode('interaction')}
          className={`flex-1 py-2 rounded-md font-serif font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            viewMode === 'interaction'
              ? 'bg-rose-950/60 text-rose-300 border border-rose-600/40 shadow'
              : 'text-[#7e8aa0] hover:text-[#c4cedd]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>紅塵雙修 · 伴修互動</span>
        </button>
        <button
          onClick={() => setViewMode('compendium')}
          className={`flex-1 py-2 rounded-md font-serif font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            viewMode === 'compendium'
              ? 'bg-rose-950/60 text-rose-300 border border-rose-600/40 shadow'
              : 'text-[#7e8aa0] hover:text-[#c4cedd]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-rose-400" />
          <span>道侶圖鑑 · 雙修路線規劃</span>
        </button>
      </div>

      {/* 視窗 2: 道侶圖鑑視窗 */}
      {viewMode === 'compendium' && (
        <CompanionCompendiumView
          player={player}
          onSetActiveCompanion={onSetActiveCompanion}
          onSwitchToInteraction={() => setViewMode('interaction')}
        />
      )}

      {/* 視窗 1: 紅塵雙修互動視窗 */}
      {viewMode === 'interaction' && (
        <div className="space-y-4">
          {/* 頂部紅塵仙緣概覽 */}
          <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252b39] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-rose-400 rounded-full" />
                <h2 className="text-base font-serif font-bold text-rose-300 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>紅塵道侶 · 仙緣雙修</span>
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {activeCompanion ? (
                  <div className="flex items-center gap-1.5 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/40 px-2.5 py-0.5 rounded">
                    <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                    <span>伴修出戰中：【{activeCompanion.name}】</span>
                  </div>
                ) : (
                  <span className="text-xs text-[#6e7b91]">尚未指定同行道侶</span>
                )}
                <button
                  onClick={() => setViewMode('compendium')}
                  className="px-2 py-0.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-700/50 text-rose-200 rounded text-xs flex items-center gap-1 transition cursor-pointer"
                >
                  <Compass className="w-3 h-3 text-rose-400" />
                  <span>路線圖鑑</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-[#828fa3] leading-relaxed">
              大道獨行，亦需知音相惜。於人間歷練奇遇中結識紅塵知己，可攜手閉關行雙修之禮以通暢經脈消弭心魔；同行涉險時更可於生死之際觸發道侶本命連攜神通！
            </p>
          </div>

          {/* 道侶卡片清單 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companionsList.map(comp => {
              const isUnlocked = comp.unlocked;
              const isActive = player.activeCompanionId === comp.id;
              const stage = getFavorStage(comp.favor);
              const favorPct = Math.min(100, (comp.favor / 1000) * 100);

              const cooldownElapsed = Date.now() - comp.lastDualCultivateTime;
              const canDual = cooldownElapsed >= DUAL_COOLDOWN_MS || comp.lastDualCultivateTime === 0;
              const cooldownSecs = Math.max(0, Math.ceil((DUAL_COOLDOWN_MS - cooldownElapsed) / 1000));

              return (
                <div
                  key={comp.id}
                  className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                    isUnlocked
                      ? isActive
                        ? 'bg-[#181c28] border-rose-500/60 shadow-lg shadow-rose-950/30'
                        : 'bg-[#141722] border-[#293142] hover:border-[#3c485f]'
                      : 'bg-[#101218] border-[#1d222b] opacity-65'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-serif font-bold text-base ${isUnlocked ? 'text-[#e2b755]' : 'text-[#6e7b91]'}`}>
                            {comp.name}
                          </span>
                          <span className="text-[11px] text-[#7a879d] border border-[#272f3e] px-1.5 py-0.2 rounded">
                            {comp.title}
                          </span>
                        </div>
                      </div>

                      <div>
                        {isUnlocked ? (
                          isActive ? (
                            <span className="text-[10px] text-rose-300 bg-rose-950/60 border border-rose-600/50 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-rose-400" /> 同行結伴中
                            </span>
                          ) : (
                            <button
                              onClick={() => onSetActiveCompanion(comp.id)}
                              className="text-[11px] text-[#8695ad] hover:text-rose-300 bg-[#1c2230] border border-[#2e374a] px-2 py-0.5 rounded transition cursor-pointer"
                            >
                              設為同行
                            </button>
                          )
                        ) : (
                          <span className="text-[10px] text-[#616e82] bg-[#161922] border border-[#222734] px-2 py-0.5 rounded flex items-center gap-1">
                            <Lock className="w-3 h-3 text-[#505a6e]" /> 仙緣未至
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Voice line / Bio */}
                    <div className="bg-[#0e1017] border border-[#1f2533] p-2.5 rounded-lg mb-3 text-xs">
                      {isUnlocked ? (
                        <>
                          <div className="text-amber-200/90 italic font-serif mb-1">
                            {comp.voiceLine}
                          </div>
                          <div className="text-[11px] text-[#717e94] leading-relaxed">
                            {comp.bio}
                          </div>
                        </>
                      ) : (
                        <div className="text-[11px] text-[#556175] italic py-2 text-center">
                          此佳人隱居於九州禁地。請於【人間歷練】探索中尋覓其行蹤，觸發奇遇即可解鎖結識！
                        </div>
                      )}
                    </div>

                    {isUnlocked && (
                      <>
                        {/* Favor Bar */}
                        <div className="space-y-1 mb-3">
                          <div className="flex justify-between text-xs text-[#717e93]">
                            <span>情意羈絆：<b className={stage.color}>{stage.label}</b></span>
                            <span className="font-mono text-rose-400">{comp.favor} / 1000</span>
                          </div>
                          <div className="w-full h-2 bg-[#0c0d13] border border-[#212735] rounded-full overflow-hidden p-[1px]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-rose-600 to-pink-400 transition-all duration-300"
                              style={{ width: `${favorPct}%` }}
                            />
                          </div>
                        </div>

                        {/* Combat Synergy Skill Info */}
                        <div className="bg-[#11141c] border border-[#232938] p-2.5 rounded-lg mb-3 text-xs space-y-1">
                          <div className="flex items-center justify-between text-amber-300 font-serif font-bold text-xs">
                            <span className="flex items-center gap-1">
                              <Swords className="w-3.5 h-3.5 text-rose-400" />
                              <span>連攜神通 · 【{comp.battleSkillName}】</span>
                            </span>
                            <span className="text-[10px] text-emerald-400 font-mono">歷練出戰生效</span>
                          </div>
                          <div className="text-[11px] text-[#8492a6] leading-snug">
                            {comp.battleSkillDesc}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {isUnlocked && (
                    <div className="pt-2 border-t border-[#1d232f] space-y-2">
                      {/* Action buttons: Dual Cultivate & Gift */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => onDualCultivate(comp.id)}
                          disabled={!canDual}
                          className={`flex-1 py-1.5 px-3 rounded text-xs font-serif font-semibold transition flex items-center justify-center gap-1.5 ${
                            canDual
                              ? 'bg-rose-950/70 hover:bg-rose-900 border border-rose-500/50 text-rose-200 cursor-pointer active:scale-[0.98]'
                              : 'bg-[#171a23] text-[#555f72] border border-[#232835] cursor-not-allowed opacity-60'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                          <span>{canDual ? '閉關雙修 (增修為/定心魔)' : `雙修調息 (${cooldownSecs}秒)`}</span>
                        </button>

                        <button
                          onClick={() => onGiftCompanion(comp.id, 'herb')}
                          disabled={(player.herb || 0) < 2}
                          className={`py-1.5 px-3 rounded text-xs font-medium transition flex items-center gap-1 ${
                            (player.herb || 0) >= 2
                              ? 'bg-[#1c2230] hover:bg-[#273042] border border-[#303a4e] text-emerald-300 cursor-pointer active:scale-[0.98]'
                              : 'bg-[#171a23] text-[#555f72] border border-[#232835] cursor-not-allowed opacity-50'
                          }`}
                          title="贈送 2 株靈草增加好感度"
                        >
                          <Gift className="w-3.5 h-3.5 text-emerald-400" />
                          <span>贈草 (+30好感)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

