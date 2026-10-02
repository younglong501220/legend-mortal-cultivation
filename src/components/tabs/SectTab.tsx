import React, { useState } from 'react';
import { PlayerState, Disciple } from '../../types/game';
import { SECT_TITLES, SECT_BENEFITS, DISCIPLE_RECRUITS } from '../../utils/constants';
import { Building2, Users, Sprout, ArrowUpRight, Plus, UserPlus, CheckCircle, PackageCheck, Zap, Sparkles, Gem, ShieldCheck } from 'lucide-react';

interface SectTabProps {
  player: PlayerState;
  onUpgradeSect: () => void;
  onRecruitDisciple: () => void;
  onOpenNewField: () => void;
  onAssignDisciple: (discipleId: string, fieldIndex: number | null) => void;
  onCollectSectGains: () => void;
}

export const SectTab: React.FC<SectTabProps> = ({
  player,
  onUpgradeSect,
  onRecruitDisciple,
  onOpenNewField,
  onAssignDisciple,
  onCollectSectGains
}) => {
  const sect = player.sect;
  const currentBenefit = SECT_BENEFITS[sect.level] || SECT_BENEFITS[1];
  const nextBenefit = SECT_BENEFITS[sect.level + 1];

  const canUpgradeSect = nextBenefit && player.stone >= nextBenefit.cost;
  const recruitCost = 80;
  const canRecruit = player.stone >= recruitCost && sect.disciples.length < sect.maxDisciples;

  // New field opening cost: 120 * fields
  const openFieldCost = (sect.herbFields + 1) * 120;
  const canOpenField = sect.herbFields < sect.maxFields && player.stone >= openFieldCost;

  // Unassigned disciples
  const idleDisciples = sect.disciples.filter(d => d.assignedField === null);

  // Total automated yields accumulated
  const hasAccumulated =
    sect.autoGatherAccumulated.herb > 0 ||
    sect.autoGatherAccumulated.ore > 0 ||
    sect.autoGatherAccumulated.stone > 0;

  return (
    <div className="space-y-4">
      {/* 宗門大殿頂部資訊 */}
      <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252b39] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-amber-400 rounded-full" />
            <h2 className="text-base font-serif font-bold text-amber-300 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>{sect.name}</span>
              <span className="text-xs font-sans font-normal text-amber-300 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
                【{SECT_TITLES[sect.level]}】
              </span>
            </h2>
          </div>

          {nextBenefit ? (
            <button
              onClick={onUpgradeSect}
              disabled={!canUpgradeSect}
              className={`py-1.5 px-3.5 rounded text-xs font-serif font-semibold transition flex items-center gap-1.5 ${
                canUpgradeSect
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 cursor-pointer active:scale-[0.98]'
                  : 'bg-[#181c25] text-[#555f72] border border-[#232835] cursor-not-allowed opacity-50'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>晉階宗門 (費 {nextBenefit.cost} 靈石)</span>
            </button>
          ) : (
            <span className="text-xs text-amber-400 font-serif">已達萬古至高聖地</span>
          )}
        </div>

        {/* Global Sect Buffs grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#12151c] border border-[#232936] p-3 rounded-lg text-xs font-mono mb-3">
          <div>
            <div className="text-[11px] text-[#717e92] font-sans">宗門聚靈增益</div>
            <div className="text-cyan-300 font-bold mt-0.5">+{currentBenefit.qiBonusPct}% 蓄氣速度</div>
          </div>
          <div>
            <div className="text-[11px] text-[#717e92] font-sans">宗門道韻加持</div>
            <div className="text-emerald-300 font-bold mt-0.5">+{currentBenefit.rateBonus} 修為/跳</div>
          </div>
          <div>
            <div className="text-[11px] text-[#717e92] font-sans">門派弟子席位</div>
            <div className="text-amber-300 font-bold mt-0.5">{sect.disciples.length} / {sect.maxDisciples} 人</div>
          </div>
          <div>
            <div className="text-[11px] text-[#717e92] font-sans">開闢宗門藥田</div>
            <div className="text-purple-300 font-bold mt-0.5">{sect.herbFields} / {sect.maxFields} 畝</div>
          </div>
        </div>

        <p className="text-xs text-[#7c899c] leading-relaxed">
          開宗立派，聚四方氣運於山門。宗門階位越高，宗門靈脈越昌盛，全體弟子自動掛機採集產能與洞府蓄氣效率越高。
        </p>
      </div>

      {/* 宗門藥田與自動掛機採集收成 */}
      <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252b39] pb-3">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-serif font-bold text-emerald-300">宗門靈圃藥田 · 弟子掛機採集</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCollectSectGains}
              disabled={!hasAccumulated}
              className={`py-1.5 px-3 rounded text-xs font-medium transition flex items-center gap-1.5 ${
                hasAccumulated
                  ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 cursor-pointer active:scale-[0.98]'
                  : 'bg-[#181c25] text-[#555f72] border border-[#232835] cursor-not-allowed opacity-50'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>收取採集產出</span>
            </button>

            <button
              onClick={onOpenNewField}
              disabled={!canOpenField}
              className={`py-1.5 px-3 rounded text-xs font-medium transition flex items-center gap-1.5 ${
                canOpenField
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 cursor-pointer active:scale-[0.98]'
                  : 'bg-[#181c25] text-[#555f72] border border-[#232835] cursor-not-allowed opacity-50'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>開闢藥田 (費 {openFieldCost} 靈石)</span>
            </button>
          </div>
        </div>

        {/* Accumulated Harvests Banner */}
        <div className="bg-[#11141c] border border-[#242b3a] p-2.5 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="text-[#8794a8] flex items-center gap-2">
            <span className="text-[#65738c]">靈圃待收穫：</span>
            <span className="text-emerald-400 font-mono font-semibold">靈草 +{sect.autoGatherAccumulated.herb} 株</span>
            <span className="text-cyan-400 font-mono font-semibold">寒鐵 +{sect.autoGatherAccumulated.ore} 塊</span>
            <span className="text-amber-400 font-mono font-semibold">靈石 +{sect.autoGatherAccumulated.stone}</span>
          </div>
          <div className="text-[11px] text-[#616e82]">
            每週期由駐守弟子自動轉化
          </div>
        </div>

        {/* Medicine Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {Array.from({ length: sect.herbFields }).map((_, fIdx) => {
            const assignedDisc = sect.disciples.find(d => d.assignedField === fIdx);

            return (
              <div
                key={fIdx}
                className="bg-[#131620] border border-[#272e3d] p-3 rounded-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-serif font-bold text-xs text-[#e2b755]">
                      第 {fIdx + 1} 畝 · 靈泉藥田
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.2 rounded">
                      已開闢
                    </span>
                  </div>

                  {assignedDisc ? (
                    <div className="text-xs text-[#d8dee9] space-y-1 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-300 font-medium">{assignedDisc.name}</span>
                        <span className="text-[10px] text-[#788599] font-mono">{assignedDisc.realm}</span>
                      </div>
                      <div className="text-[11px] text-cyan-300">
                        資質：{assignedDisc.talentName} (產能+{assignedDisc.efficiency})
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-[#5f6c82] py-2 italic text-center mb-3">
                      暫無指派弟子，藥田處於荒蕪狀態
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#1d232f]">
                  {assignedDisc ? (
                    <button
                      onClick={() => onAssignDisciple(assignedDisc.id, null)}
                      className="w-full py-1 text-xs text-[#8997ae] hover:text-rose-300 bg-[#181d28] border border-[#2b3344] rounded transition cursor-pointer"
                    >
                      召回堂前待命
                    </button>
                  ) : idleDisciples.length > 0 ? (
                    <button
                      onClick={() => onAssignDisciple(idleDisciples[0].id, fIdx)}
                      className="w-full py-1 text-xs text-emerald-300 hover:text-emerald-200 bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-600/40 rounded transition cursor-pointer"
                    >
                      指派【{idleDisciples[0].name}】駐守採集
                    </button>
                  ) : (
                    <div className="text-[11px] text-[#556276] text-center">
                      無閒置弟子可指派
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 弟子堂 (Recruit & Manage Disciples) */}
      <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-[#252b39] pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-serif font-bold text-[#c9d3e3]">宗門弟子堂 · 廣招英才</h3>
          </div>

          <button
            onClick={onRecruitDisciple}
            disabled={!canRecruit}
            className={`py-1.5 px-3 rounded text-xs font-medium transition flex items-center gap-1.5 ${
              canRecruit
                ? 'bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 cursor-pointer active:scale-[0.98]'
                : 'bg-[#181c25] text-[#555f72] border border-[#232835] cursor-not-allowed opacity-50'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>招募弟子 (費 {recruitCost} 靈石)</span>
          </button>
        </div>

        {sect.disciples.length === 0 ? (
          <div className="text-center py-6 text-xs text-[#637084]">
            當前山門尚無門人弟子，點擊上方【招募弟子】招攬天下向道之士！
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {sect.disciples.map(disciple => {
              const isAssigned = disciple.assignedField !== null;

              return (
                <div
                  key={disciple.id}
                  className="bg-[#12151c] border border-[#232835] p-2.5 rounded-lg flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif font-bold text-[#e2b755]">{disciple.name}</span>
                      <span className="text-[10px] text-[#717e92] border border-[#272e3d] px-1 py-0.2 rounded font-mono">
                        {disciple.realm}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#7d8b9e] mt-0.5">
                      資質：<span className="text-cyan-400">{disciple.talentName}</span>
                    </div>
                  </div>

                  <div>
                    {isAssigned ? (
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                        第 {disciple.assignedField! + 1} 畝藥田
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#6d7b90] bg-[#181c25] border border-[#262c3a] px-2 py-0.5 rounded">
                        堂前待命
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
