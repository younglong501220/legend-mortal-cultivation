import React from 'react';
import { PlayerState, MapData, AdventureEvent } from '../../types/game';
import { MAPS, REALMS } from '../../utils/constants';
import { Compass, Footprints, Play, Pause, Home, Swords, Skull, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';

interface AdventureTabProps {
  player: PlayerState;
  onStartAdventure: (mapId: number) => void;
  onTakeStep: () => void;
  onToggleAutoRoam: () => void;
  onCancelAdventure: () => void;
  onResolveEventChoice: (eventId: string, actionId: string) => void;
}

export const AdventureTab: React.FC<AdventureTabProps> = ({
  player,
  onStartAdventure,
  onTakeStep,
  onToggleAutoRoam,
  onCancelAdventure,
  onResolveEventChoice
}) => {
  const currentMap = MAPS.find(m => m.id === player.currentMapId);
  const stepPct = currentMap ? Math.min(100, (player.adventureStep / currentMap.steps) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* 互動奇遇機緣懸浮彈出框 (當觸發遊歷事件時) */}
      {player.activeEvent && (
        <div className="bg-gradient-to-b from-[#1b2230] to-[#131722] border-2 border-amber-500/60 rounded-xl p-4 sm:p-5 shadow-2xl space-y-3 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-2 border-b border-[#2d384e] pb-2.5">
            <span className="w-2 h-4 bg-amber-400 rounded-full" />
            <h3 className="text-base font-serif font-bold text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{player.activeEvent.title}</span>
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-[#d4dceb] leading-relaxed font-serif">
            {player.activeEvent.description}
          </p>

          <div className="pt-2 space-y-2">
            <div className="text-[11px] text-[#8694aa] flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-cyan-400" />
              <span>道友請作抉擇：</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {player.activeEvent.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => onResolveEventChoice(player.activeEvent!.id, choice.actionId)}
                  className="p-2.5 bg-[#141926] hover:bg-[#1f273b] border border-[#2d384e] hover:border-amber-400/60 rounded-lg text-left text-xs transition cursor-pointer active:scale-[0.98] group flex flex-col justify-between"
                >
                  <span className="font-serif font-medium text-[#e2b755] group-hover:text-amber-300">
                    {choice.text}
                  </span>
                  {choice.costDesc && (
                    <span className="text-[10px] text-[#717e94] mt-1">
                      代價/備註: {choice.costDesc}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 歷練實況狀態盒 */}
      <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252b39] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-rose-500 rounded-full" />
            <h2 className="text-base font-serif font-bold text-rose-300 flex items-center gap-1.5">
              <span>人間歷練 · 神遊探索實況</span>
            </h2>
          </div>
          {currentMap && (
            <span className="text-xs font-mono text-amber-300 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
              歷練進行中
            </span>
          )}
        </div>

        {currentMap ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#12151c] border border-[#232936] p-3 rounded-lg text-xs">
              <div>
                <div className="text-[#727d92]">當前禁地地塹</div>
                <div className="text-sm font-serif font-bold text-[#e2b755] mt-0.5">
                  {currentMap.name}
                </div>
              </div>
              <div>
                <div className="text-[#727d92]">探尋步伐進度</div>
                <div className="text-sm font-mono font-bold text-cyan-300 mt-0.5">
                  {player.adventureStep} / {currentMap.steps} 步
                </div>
              </div>
              <div>
                <div className="text-[#727d92]">領主妖魔警訊</div>
                <div className="text-xs font-serif font-medium text-rose-400 mt-0.5 flex items-center gap-1">
                  <Skull className="w-3.5 h-3.5" />
                  <span>{currentMap.bossName} (鎮守終點)</span>
                </div>
              </div>
            </div>

            {/* Step Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-[#768297]">
                <span>涉足縱深</span>
                <span className="font-mono">{stepPct.toFixed(0)}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#0d0f14] border border-[#252b38] rounded-full overflow-hidden p-[1px]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-600 via-rose-500 to-red-500 transition-all duration-300"
                  style={{ width: `${stepPct}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onTakeStep}
                disabled={player.isAutoRoaming || !!player.activeEvent}
                className={`py-2 px-4 rounded text-xs font-semibold transition flex items-center gap-1.5 ${
                  !player.isAutoRoaming && !player.activeEvent
                    ? 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 cursor-pointer active:scale-[0.98]'
                    : 'bg-[#181c25] text-[#555f72] border border-[#232835] cursor-not-allowed opacity-50'
                }`}
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>深入探秘一步</span>
              </button>

              <button
                onClick={onToggleAutoRoam}
                disabled={!!player.activeEvent}
                className={`py-2 px-4 rounded text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer active:scale-[0.98] ${
                  player.isAutoRoaming
                    ? 'bg-rose-950/80 hover:bg-rose-900 border border-rose-600/60 text-rose-300 animate-pulse'
                    : 'bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-300'
                }`}
              >
                {player.isAutoRoaming ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>停止神遊 (自動歷練中...)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>神遊出竅 (自動行走探索)</span>
                  </>
                )}
              </button>

              <button
                onClick={onCancelAdventure}
                className="py-2 px-3 bg-[#1e232e] hover:bg-[#282f3e] border border-[#353d50] text-[#a0abbd] rounded text-xs transition flex items-center gap-1 cursor-pointer active:scale-[0.98]"
              >
                <Home className="w-3.5 h-3.5" />
                <span>御劍回洞府</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-[#768399] space-y-2">
            <Compass className="w-8 h-8 text-[#4c566a] mx-auto" />
            <p>道友當前身處自家洞府之中，請自下方凡間九大禁地中挑選目標，駕馭遁光前去歷練神遊。</p>
          </div>
        )}
      </div>

      {/* 九州禁地名錄 */}
      <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-between border-b border-[#252b39] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-amber-500 rounded-full" />
            <h3 className="text-base font-serif font-bold text-amber-300">九州禁地名錄</h3>
          </div>
          <span className="text-xs text-[#768297]">產出妖丹、寒鐵石、赤陽花等煉器丹材</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MAPS.map(map => {
            const isUnlocked = player.realmIdx >= map.reqRealmIdx;
            const isCurrent = player.currentMapId === map.id;
            const reqRealmName = REALMS[map.reqRealmIdx];

            return (
              <div
                key={map.id}
                className={`p-3.5 rounded-lg border transition flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-[#1e2330] border-amber-500/70 shadow-md shadow-amber-950/20'
                    : isUnlocked
                    ? 'bg-[#131620] border-[#272e3d] hover:border-[#3c475d]'
                    : 'bg-[#101217] border-[#1d222b] opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-[#e2b755]">
                        {map.name}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] text-amber-400 bg-amber-950/50 border border-amber-700/50 px-1.5 py-0.2 rounded">
                          歷練中
                        </span>
                      )}
                    </div>
                    <span className={`text-[11px] font-mono ${isUnlocked ? 'text-emerald-400' : 'text-rose-400'}`}>
                      需【{reqRealmName}】
                    </span>
                  </div>

                  <p className="text-xs text-[#798599] leading-relaxed mb-3">
                    {map.description}
                  </p>

                  <div className="grid grid-cols-3 gap-1 bg-[#0d0f14] border border-[#202531] p-2 rounded text-[11px] font-mono text-[#8a96ab] mb-3">
                    <div>
                      步數: <span className="text-[#d8dee9]">{map.steps}步</span>
                    </div>
                    <div>
                      建議攻: <span className="text-rose-400">{map.minAtk}</span>
                    </div>
                    <div>
                      靈石產: <span className="text-amber-400">~{map.stoneReward}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1d232f] flex items-center justify-between">
                  <div className="text-[11px] text-[#636f84] flex items-center gap-1">
                    <Swords className="w-3 h-3 text-rose-500" />
                    <span>妖王: {map.bossName}</span>
                  </div>

                  <button
                    onClick={() => onStartAdventure(map.id)}
                    disabled={!isUnlocked || isCurrent}
                    className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                      isCurrent
                        ? 'bg-[#1c222c] text-amber-300 border border-amber-600/40 cursor-default'
                        : isUnlocked
                        ? 'bg-gradient-to-r from-amber-600/80 to-amber-500/80 hover:from-amber-600 hover:to-amber-500 text-[#0c0d12] cursor-pointer active:scale-[0.98]'
                        : 'bg-[#181c25] text-[#555f72] border border-[#232835] cursor-not-allowed opacity-50'
                    }`}
                  >
                    {isCurrent ? '正在探索' : isUnlocked ? '御劍降臨' : '禁制未解'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
