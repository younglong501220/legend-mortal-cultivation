import React from 'react';
import { PlayerState } from '../../types/game';
import { SKILLS_DATA } from '../../utils/constants';
import { BookOpen, Check, ScrollText, Swords, Shield, Heart, Zap } from 'lucide-react';

interface SectGongfaTabProps {
  player: PlayerState;
  onLearnSkill: (skillId: string) => void;
}

export const SectGongfaTab: React.FC<SectGongfaTabProps> = ({ player, onLearnSkill }) => {
  // Calculate total bonuses
  let totalBonusRate = 0;
  let totalBonusAtk = 0;
  let totalBonusDef = 0;
  let totalBonusHp = 0;

  SKILLS_DATA.forEach(sk => {
    if (player.learnedSkills.includes(sk.id)) {
      if (sk.type === 'rate') totalBonusRate += sk.val;
      if (sk.type === 'atk') totalBonusAtk += sk.val;
      if (sk.type === 'def') {
        totalBonusDef += sk.val;
        if (sk.id === 'sk3') totalBonusHp += 150;
        if (sk.id === 'sk8') totalBonusHp += 1500;
      }
      if (sk.type === 'hp') {
        totalBonusHp += sk.val;
        if (sk.id === 'sk6') totalBonusDef += 35;
      }
      if (sk.id === 'sk7') {
        totalBonusRate += 30; // bonus rate from sword canon
      }
    }
  });

  return (
    <div className="space-y-4">
      {/* 宗門概況與功法總成 */}
      <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252b39] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-amber-500 rounded-full" />
            <h2 className="text-base font-serif font-bold text-amber-300 flex items-center gap-1.5">
              <span>藏經閣 · 仙門道典</span>
            </h2>
          </div>
          <span className="text-xs text-[#768297]">
            已參透：<b className="text-amber-400 font-mono">{player.learnedSkills.length}</b> / {SKILLS_DATA.length} 卷
          </span>
        </div>

        <p className="text-xs text-[#7f8b9e] leading-relaxed mb-4">
          修習仙家古卷心法，可永久增幅修士根基與吐納效率。每一門功法皆蘊含天地玄機，不可輕易荒廢。
        </p>

        {/* Passive Stats Summary Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#12151c] border border-[#232936] p-3 rounded-lg text-xs">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[11px] text-[#717d92]">吐納增幅</div>
              <div className="font-mono font-bold text-emerald-300">+{totalBonusRate} 修為/跳</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <div className="text-[11px] text-[#717d92]">攻訣增幅</div>
              <div className="font-mono font-bold text-rose-300">+{totalBonusAtk} 攻擊</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[11px] text-[#717d92]">護體玄罡</div>
              <div className="font-mono font-bold text-cyan-300">+{totalBonusDef} 防禦</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <div className="text-[11px] text-[#717d92]">本命命元</div>
              <div className="font-mono font-bold text-emerald-400">+{totalBonusHp} 氣血</div>
            </div>
          </div>
        </div>
      </div>

      {/* 藏經閣經卷列表 */}
      <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md space-y-3">
        <h3 className="text-sm font-serif font-bold text-[#c9d3e3] flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-amber-400" />
          <span>經閣藏卷典籍目錄</span>
        </h3>

        <div className="space-y-2.5">
          {SKILLS_DATA.map(skill => {
            const isLearned = player.learnedSkills.includes(skill.id);
            const canAfford = player.stone >= skill.cost;

            return (
              <div
                key={skill.id}
                className={`p-3 rounded-lg border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isLearned
                    ? 'bg-[#12151c]/60 border-[#242934] opacity-90'
                    : 'bg-[#141822] border-[#293040] hover:border-[#3d485e]'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-serif font-bold text-sm ${isLearned ? 'text-amber-400/80' : 'text-amber-300'}`}>
                      {skill.name}
                    </span>
                    <span className="text-[10px] text-[#6d7a91] border border-[#282f3f] px-1.5 py-0.2 rounded">
                      {skill.source}
                    </span>
                    {isLearned && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.2 rounded">
                        <Check className="w-3 h-3" /> 已參透
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#8c98ac] leading-relaxed">
                    {skill.desc}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {!isLearned ? (
                    <button
                      onClick={() => onLearnSkill(skill.id)}
                      disabled={!canAfford}
                      className={`w-full sm:w-auto py-1.5 px-3.5 rounded text-xs font-medium transition flex items-center justify-center gap-1.5 ${
                        canAfford
                          ? 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 cursor-pointer active:scale-[0.98]'
                          : 'bg-[#1a1e28] text-[#555f72] border border-[#262c3a] cursor-not-allowed opacity-60'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>參悟研讀 (費 {skill.cost.toLocaleString()} 靈石)</span>
                    </button>
                  ) : (
                    <div className="text-xs text-[#636f84] italic">
                      經文銘刻元神
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
