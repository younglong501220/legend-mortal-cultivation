import React, { useState } from 'react';
import { PlayerState, Companion } from '../../types/game';
import {
  BookOpen,
  Heart,
  Sparkles,
  Swords,
  Shield,
  CheckCircle2,
  Lock,
  Flame,
  Award,
  Compass,
  Star,
  Zap,
  ArrowRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';

interface CompanionCompendiumViewProps {
  player: PlayerState;
  onSetActiveCompanion: (companionId: string) => void;
  onSwitchToInteraction?: () => void;
}

export const CompanionCompendiumView: React.FC<CompanionCompendiumViewProps> = ({
  player,
  onSetActiveCompanion,
  onSwitchToInteraction
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedRoute, setSelectedRoute] = useState<string>('all');

  const companions = Object.values(player.companions);
  const unlockedCount = companions.filter(c => c.unlocked).length;
  const totalFavor = companions.reduce((acc, c) => acc + c.favor, 0);

  const filteredCompanions = companions.filter(c => {
    if (filter === 'unlocked') return c.unlocked;
    if (filter === 'locked') return !c.unlocked;
    return true;
  });

  const getMilestoneStatus = (favor: number, reqFavor: number) => {
    return favor >= reqFavor;
  };

  const getFavorStageInfo = (favor: number) => {
    if (favor >= 800) return { label: '生死相許', nextReq: 1000, color: 'text-rose-400', progressColor: 'from-rose-500 to-pink-500' };
    if (favor >= 500) return { label: '心有靈犀', nextReq: 800, color: 'text-amber-300', progressColor: 'from-amber-500 to-rose-400' };
    if (favor >= 200) return { label: '莫逆之交', nextReq: 500, color: 'text-cyan-300', progressColor: 'from-cyan-500 to-amber-400' };
    return { label: '泛泛之交', nextReq: 200, color: 'text-[#8b98ad]', progressColor: 'from-slate-600 to-cyan-400' };
  };

  return (
    <div className="space-y-4">
      {/* 圖鑑總覽面板 */}
      <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252b39] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-rose-400 rounded-full" />
            <h2 className="text-base font-serif font-bold text-rose-300 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-rose-400" />
              <span>諸天紅塵 · 道侶仙緣圖鑑總綱</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#8794a8] font-mono">
              結識仙緣：<b className="text-rose-400">{unlockedCount}</b> / {companions.length} 位
            </span>
            {onSwitchToInteraction && (
              <button
                onClick={onSwitchToInteraction}
                className="px-2.5 py-1 bg-[#1e2432] hover:bg-[#273043] border border-[#333e54] text-rose-300 rounded font-serif text-xs transition cursor-pointer flex items-center gap-1"
              >
                <span>前往洞府雙修</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* 雙修路線導引說明 */}
        <p className="text-xs text-[#828fa3] leading-relaxed">
          修仙之路逆天而行，亦需相生相濟。道侶圖鑑記載每位佳人之<b>命相五行、專屬好感度詞條解鎖條件與本命連攜神通</b>。隨好感度跨越不同里程碑，將逐層激活巨額被動修為與天道庇佑加成，助道友按流派規劃最契合之雙修仙途！
        </p>

        {/* 篩選切換列 */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex bg-[#11141c] border border-[#232938] p-1 rounded-lg text-xs gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded transition cursor-pointer ${
                filter === 'all'
                  ? 'bg-rose-950/60 text-rose-300 font-semibold border border-rose-600/40'
                  : 'text-[#7e8aa0] hover:text-[#c4cedd]'
              }`}
            >
              全部道侶 ({companions.length})
            </button>
            <button
              onClick={() => setFilter('unlocked')}
              className={`px-3 py-1 rounded transition cursor-pointer ${
                filter === 'unlocked'
                  ? 'bg-rose-950/60 text-rose-300 font-semibold border border-rose-600/40'
                  : 'text-[#7e8aa0] hover:text-[#c4cedd]'
              }`}
            >
              已結識伴侶 ({unlockedCount})
            </button>
            <button
              onClick={() => setFilter('locked')}
              className={`px-3 py-1 rounded transition cursor-pointer ${
                filter === 'locked'
                  ? 'bg-rose-950/60 text-rose-300 font-semibold border border-rose-600/40'
                  : 'text-[#7e8aa0] hover:text-[#c4cedd]'
              }`}
            >
              待探索仙緣 ({companions.length - unlockedCount})
            </button>
          </div>

          <div className="text-[11px] text-[#717e92] font-mono">
            累計情意總和：<span className="text-rose-400 font-bold">{totalFavor}</span> 點
          </div>
        </div>
      </div>

      {/* 雙修四大流派路線規劃速查面板 (Route Planner Matrix) */}
      <div className="bg-[#141722] border border-[#272f3f] rounded-lg p-3.5 space-y-2 text-xs">
        <div className="text-xs font-serif font-bold text-amber-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>天道推演 · 雙修路線規劃導航矩陣</span>
          </span>
          <span className="text-[10px] text-[#727f94] font-normal">根據當前修煉瓶頸切換同行伴侶</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 font-sans">
          <div className="bg-[#0f121a] border border-[#202737] p-2.5 rounded-lg space-y-1">
            <div className="font-serif font-bold text-cyan-300 flex items-center gap-1">
              <Swords className="w-3.5 h-3.5 text-cyan-400" />
              <span>劍道攻伐流</span>
            </div>
            <div className="text-[11px] text-amber-300/90 font-medium">代表道侶：南宮婉</div>
            <p className="text-[11px] text-[#7b889d] leading-relaxed">
              核心加成：致命暴擊穿透 + 雙修修為吞吐。適合人間歷練開荒與仙盟爭霸挑戰強大守護神煞。
            </p>
          </div>

          <div className="bg-[#0f121a] border border-[#202737] p-2.5 rounded-lg space-y-1">
            <div className="font-serif font-bold text-emerald-300 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>穩健修心流</span>
            </div>
            <div className="text-[11px] text-amber-300/90 font-medium">代表道侶：紫菱</div>
            <p className="text-[11px] text-[#7b889d] leading-relaxed">
              核心加成：雙修深度淨化心魔 + 氣血上限。適合心魔深種破境受阻或遭遇卡關時洗滌道心。
            </p>
          </div>

          <div className="bg-[#0f121a] border border-[#202737] p-2.5 rounded-lg space-y-1">
            <div className="font-serif font-bold text-rose-300 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>狂暴煞氣流</span>
            </div>
            <div className="text-[11px] text-amber-300/90 font-medium">代表道侶：燕如嫣</div>
            <p className="text-[11px] text-[#7b889d] leading-relaxed">
              核心加成：最高修為加成（+24/跳）+ 削防致命暴擊。追求極限飛速破境提升境界之不二之選。
            </p>
          </div>

          <div className="bg-[#0f121a] border border-[#202737] p-2.5 rounded-lg space-y-1">
            <div className="font-serif font-bold text-purple-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>逍遙避劫流</span>
            </div>
            <div className="text-[11px] text-amber-300/90 font-medium">代表道侶：銀月</div>
            <p className="text-[11px] text-[#7b889d] leading-relaxed">
              核心加成：天道雷劫免傷 + 高額閃避靈幕。衝擊大境界九重天劫時能保命免受雷罰反噬！
            </p>
          </div>
        </div>
      </div>

      {/* 道侶圖鑑卡片清單 */}
      <div className="space-y-4">
        {filteredCompanions.map(comp => {
          const isUnlocked = comp.unlocked;
          const isActive = player.activeCompanionId === comp.id;
          const stage = getFavorStageInfo(comp.favor);
          const favorPct = Math.min(100, (comp.favor / 1000) * 100);

          return (
            <div
              key={comp.id}
              className={`p-4 rounded-xl border transition space-y-3.5 ${
                isUnlocked
                  ? isActive
                    ? 'bg-[#181c28] border-rose-500/60 shadow-lg shadow-rose-950/20'
                    : 'bg-[#141722] border-[#293142]'
                  : 'bg-[#101219] border-[#1d222d] opacity-60'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#222837] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border font-serif font-bold text-base ${
                    isUnlocked
                      ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                      : 'bg-[#171a24] border-[#262c3b] text-[#556073]'
                  }`}>
                    {comp.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-serif font-bold text-base ${isUnlocked ? 'text-[#e2b755]' : 'text-[#707c91]'}`}>
                        {comp.name}
                      </span>
                      <span className="text-xs text-[#8c99af] border border-[#273042] px-2 py-0.5 rounded font-sans">
                        {comp.title}
                      </span>
                      {comp.element && (
                        <span className="text-[11px] text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded font-mono">
                          {comp.element}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#6d7b92] italic mt-0.5">
                      {comp.voiceLine}
                    </div>
                  </div>
                </div>

                {/* Status action button */}
                <div>
                  {isUnlocked ? (
                    isActive ? (
                      <span className="px-3 py-1 bg-rose-950/60 border border-rose-500/50 text-rose-300 rounded text-xs font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                        <span>同行出戰伴修中</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onSetActiveCompanion(comp.id)}
                        className="px-3 py-1 bg-[#1d2433] hover:bg-[#283247] border border-[#35415c] text-rose-200 rounded text-xs font-serif font-medium transition cursor-pointer flex items-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-rose-400" />
                        <span>設為同行伴侶</span>
                      </button>
                    )
                  ) : (
                    <span className="px-2.5 py-1 bg-[#151821] border border-[#232938] text-[#5b677a] rounded text-xs flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-[#505a6b]" />
                      <span>待人間歷練尋訪結識</span>
                    </span>
                  )}
                </div>
              </div>

              {/* 好感度進度條 (Favor Progress Bar with Milestones) */}
              <div className="bg-[#10131c] border border-[#212736] p-3 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8492a8] flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>情意好感進度：<b className={stage.color}>{stage.label}</b></span>
                  </span>
                  <span className="font-mono text-rose-300 font-bold">
                    {comp.favor} / 1000 點 ({Math.round(favorPct)}%)
                  </span>
                </div>

                {/* Progress bar line */}
                <div className="relative w-full h-3 bg-[#0a0c12] border border-[#242b3a] rounded-full overflow-hidden p-[1px]">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${stage.progressColor} transition-all duration-300`}
                    style={{ width: `${favorPct}%` }}
                  />
                </div>

                {/* Milestones markers */}
                <div className="grid grid-cols-4 gap-1 text-[11px] font-mono pt-1 text-center">
                  <div className={`${comp.favor >= 0 ? 'text-amber-300 font-semibold' : 'text-[#485366]'}`}>
                    ● 0 泛泛之交
                  </div>
                  <div className={`${comp.favor >= 200 ? 'text-cyan-300 font-semibold' : 'text-[#485366]'}`}>
                    ● 200 莫逆之交
                  </div>
                  <div className={`${comp.favor >= 500 ? 'text-amber-300 font-semibold' : 'text-[#485366]'}`}>
                    ● 500 心有靈犀
                  </div>
                  <div className={`${comp.favor >= 800 ? 'text-rose-400 font-semibold' : 'text-[#485366]'}`}>
                    ● 800 生死相許
                  </div>
                </div>
              </div>

              {/* 獨特加成詞條清單 (Unique Bonus Affixes) */}
              <div className="space-y-1.5">
                <div className="text-xs font-serif font-bold text-[#b9c6d8] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>好感度專屬被動詞條庫</span>
                  </span>
                  <span className="text-[10px] text-[#6a778c]">好感度達標自動永久解鎖激活</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {comp.affixes && comp.affixes.map((affix, idx) => {
                    const isAffixActive = isUnlocked && comp.favor >= affix.levelReq;
                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border transition flex items-start gap-2 ${
                          isAffixActive
                            ? 'bg-[#151924] border-amber-500/40 text-[#c8d4e5]'
                            : 'bg-[#0f1118] border-[#1d222e] text-[#556175]'
                        }`}
                      >
                        <div className="mt-0.5">
                          {isAffixActive ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-[#4a5466] shrink-0" />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`font-serif font-bold ${isAffixActive ? 'text-amber-300' : 'text-[#67748a]'}`}>
                              {affix.title}
                            </span>
                            <span className="text-[10px] font-mono px-1 rounded bg-[#0a0c12] text-[#78869c]">
                              {affix.levelName} ({affix.levelReq}好感)
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed">
                            {affix.effect}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 連攜合體戰鬥神通 */}
              <div className="bg-[#11141c] border border-[#212737] p-2.5 rounded-lg text-xs space-y-1">
                <div className="flex items-center justify-between text-amber-300 font-serif font-bold">
                  <span className="flex items-center gap-1">
                    <Swords className="w-3.5 h-3.5 text-rose-400" />
                    <span>本命連攜神通 · 【{comp.battleSkillName}】</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">同行歷練與爭霸觸發</span>
                </div>
                <p className="text-[11px] text-[#8694a9] leading-relaxed">
                  {comp.battleSkillDesc}
                </p>
              </div>

              {/* 雙修路線規劃建議指南 */}
              {comp.routeRecommendation && (
                <div className="bg-[#0f121a] border border-[#1f2635] p-2.5 rounded-lg text-xs">
                  <div className="text-[11px] font-serif font-bold text-cyan-300 mb-0.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>雙修路線規劃建議：</span>
                  </div>
                  <p className="text-[11px] text-[#7d8b9f] leading-relaxed">
                    {comp.routeRecommendation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
