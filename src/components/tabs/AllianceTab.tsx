import React, { useState } from 'react';
import { PlayerState, AllianceData, HegemonyBattlefield } from '../../types/game';
import {
  ALLIANCE_TITLES,
  DEFAULT_ALLIANCES,
  ALLIANCE_SUTRAS_CONFIG,
  HEGEMONY_BATTLEFIELDS
} from '../../utils/constants';
import {
  Shield,
  Pickaxe,
  Swords,
  BookOpen,
  Award,
  Crown,
  Users,
  Coins,
  CheckCircle2,
  Sparkles,
  Flame,
  ArrowUpRight,
  TrendingUp,
  LogOut,
  BarChart3
} from 'lucide-react';
import { HegemonyStatsView } from '../alliance/HegemonyStatsView';

interface AllianceTabProps {
  player: PlayerState;
  onJoinAlliance: (allianceName: string) => void;
  onCreateAlliance: (name: string) => void;
  onLeaveAlliance: () => void;
  onCheckInAlliance: () => void;
  onInfuseMineVein: () => void;
  onClaimMineDividend: () => void;
  onFightHegemony: (battlefield: HegemonyBattlefield) => void;
  onUpgradeSutra: (sutraId: string) => void;
}

export const AllianceTab: React.FC<AllianceTabProps> = ({
  player,
  onJoinAlliance,
  onCreateAlliance,
  onLeaveAlliance,
  onCheckInAlliance,
  onInfuseMineVein,
  onClaimMineDividend,
  onFightHegemony,
  onUpgradeSutra
}) => {
  const [subTab, setSubTab] = useState<'mine' | 'hegemony' | 'stats' | 'sutras'>('mine');
  const [customName, setCustomName] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string>('');
  const [showLeaveConfirm, setShowLeaveConfirm] = useState<boolean>(false);

  const alliance = player.alliance;

  // If not joined any alliance, show recruitment & creation lobby
  if (!alliance || !alliance.joined) {
    return (
      <div className="space-y-4">
        <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-5 shadow-md text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-300">
            <Crown className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-amber-300">
              仙盟總舵 · 諸天同盟
            </h2>
            <p className="text-xs text-[#828fa3] max-w-lg mx-auto mt-1 leading-relaxed">
              大道漫漫，孤木難支。加入或創建仙盟，與同道盟友共採天地靈礦、研習仙盟心法同源共振、並於每週仙盟爭霸戰中逐鹿九州名山！
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setShowCreateModal(true);
                setCreateError('');
              }}
              className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-serif font-bold text-xs rounded-lg transition shadow-lg shadow-amber-950/30 cursor-pointer active:scale-[0.98]"
            >
              自立仙門 · 創建仙盟 (需 300 靈石)
            </button>
          </div>
        </div>

        {/* Create modal */}
        {showCreateModal && (
          <div className="bg-[#131620] border border-amber-500/50 p-4 rounded-lg space-y-3 animate-in fade-in duration-200">
            <div className="text-xs font-serif font-bold text-amber-300">
              開闢仙盟 · 題定盟名
            </div>
            {createError && (
              <div className="text-xs text-rose-400 bg-rose-950/30 border border-rose-900/50 p-1.5 rounded">
                {createError}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={customName}
                onChange={e => {
                  setCustomName(e.target.value);
                  setCreateError('');
                }}
                maxLength={8}
                placeholder="請輸入仙盟名稱（如：逍遙天盟）"
                className="flex-1 bg-[#181d28] border border-[#2c3447] rounded px-3 py-1.5 text-xs text-[#d8dee9] focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={() => {
                  if (!customName.trim()) {
                    setCreateError('請填寫仙盟名稱');
                    return;
                  }
                  if (player.stone < 300) {
                    setCreateError('靈石不足 300，難以奠定仙盟基石！');
                    return;
                  }
                  onCreateAlliance(customName.trim());
                  setShowCreateModal(false);
                }}
                className="px-4 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 rounded text-xs font-semibold cursor-pointer"
              >
                定立盟約
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1.5 bg-[#1a1f2c] border border-[#2b3345] text-[#717d92] rounded text-xs cursor-pointer"
              >
                取消
              </button>
            </div>
          </div>
        )}

        {/* Existing Alliances to Join */}
        <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md space-y-3">
          <h3 className="text-sm font-serif font-bold text-[#c9d3e3] flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>九州現世巨擘仙盟名錄</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DEFAULT_ALLIANCES.map(al => (
              <div
                key={al.name}
                className="bg-[#131620] border border-[#272e3d] hover:border-[#3d475d] p-3.5 rounded-lg transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-serif font-bold text-sm text-[#e2b755]">
                      {al.name}
                    </span>
                    <span className="text-[10px] text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-1.5 py-0.2 rounded font-mono">
                      {al.members} / 50 仙友
                    </span>
                  </div>

                  <p className="text-xs text-[#7e8b9e] leading-relaxed mb-2">
                    {al.desc}
                  </p>

                  <div className="text-[11px] text-emerald-400 font-mono mb-3">
                    特質：{al.specialty}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1d232f] flex justify-end">
                  <button
                    onClick={() => onJoinAlliance(al.name)}
                    className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 rounded text-xs font-semibold cursor-pointer active:scale-[0.98]"
                  >
                    叩問盟約 · 申請入盟
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Claim cooldown calculation (once per 20 hours or immediately if first time)
  const canClaimMine =
    Date.now() - alliance.lastMineClaimTime >= 20 * 3600 * 1000 ||
    alliance.lastMineClaimTime === 0;

  return (
    <div className="space-y-4">
      {/* 仙盟頂端狀態列 */}
      <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252b39] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-amber-400 rounded-full" />
            <h2 className="text-base font-serif font-bold text-amber-300 flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>{alliance.name}</span>
              <span className="text-xs font-sans font-normal text-amber-300 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
                【{ALLIANCE_TITLES[alliance.level] || '三階仙盟'}】
              </span>
              <span className="text-xs font-sans text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-1.5 py-0.5 rounded">
                職務：{alliance.role}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={onCheckInAlliance}
              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 rounded font-serif font-semibold transition cursor-pointer"
            >
              仙盟每日簽到 (+50貢獻)
            </button>
            <button
              onClick={() => setShowLeaveConfirm(true)}
              className="p-1.5 text-[#6c788d] hover:text-rose-400 rounded transition cursor-pointer"
              title="脫離仙盟"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Leave Confirmation Banner */}
        {showLeaveConfirm && (
          <div className="mb-3 p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg flex items-center justify-between gap-3 text-xs animate-in fade-in">
            <span className="text-rose-300">
              道友當真要脫離【{alliance.name}】重歸逍遙散修嗎？仙盟加持將會卸除！
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowLeaveConfirm(false);
                  onLeaveAlliance();
                }}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-medium cursor-pointer"
              >
                確認脫離
              </button>
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="px-2.5 py-1 bg-[#232938] hover:bg-[#2e3649] text-[#a6b4c9] rounded cursor-pointer"
              >
                暫留
              </button>
            </div>
          </div>
        )}

        {/* Global Alliance metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#12151c] border border-[#232936] p-3 rounded-lg text-xs font-mono">
          <div>
            <div className="text-[11px] text-[#717e92] font-sans">我的仙盟貢獻</div>
            <div className="text-amber-300 font-bold text-sm mt-0.5">
              {alliance.contribution} 點
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[#717e92] font-sans">同盟修士陣容</div>
            <div className="text-cyan-300 font-bold text-sm mt-0.5">
              {alliance.membersCount} / {alliance.maxMembers} 人
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[#717e92] font-sans">仙脈共用靈礦</div>
            <div className="text-emerald-400 font-bold text-sm mt-0.5">
              {alliance.mineVeinLevel} 階靈脈
            </div>
          </div>
          <div>
            <div className="text-[11px] text-[#717e92] font-sans">爭霸戰功總評</div>
            <div className="text-purple-300 font-bold text-sm mt-0.5">
              {alliance.hegemonyScore} 戰功
            </div>
          </div>
        </div>
      </div>

      {/* 仙盟子分頁切換 */}
      <div className="flex bg-[#12151d] border border-[#262c3b] p-1 rounded-lg gap-1 text-xs">
        <button
          onClick={() => setSubTab('mine')}
          className={`flex-1 py-2 rounded-md font-serif font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            subTab === 'mine'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-[#7e8aa0] hover:text-[#c4cedd]'
          }`}
        >
          <Pickaxe className="w-3.5 h-3.5 text-amber-400" />
          <span>共用靈礦資源</span>
        </button>

        <button
          onClick={() => setSubTab('hegemony')}
          className={`flex-1 py-2 rounded-md font-serif font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            subTab === 'hegemony'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'text-[#7e8aa0] hover:text-[#c4cedd]'
          }`}
        >
          <Swords className="w-3.5 h-3.5 text-rose-400" />
          <span>每週仙盟爭霸</span>
        </button>

        <button
          onClick={() => setSubTab('stats')}
          className={`flex-1 py-2 rounded-md font-serif font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            subTab === 'stats'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-[#7e8aa0] hover:text-[#c4cedd]'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
          <span>爭霸戰績趨勢</span>
        </button>

        <button
          onClick={() => setSubTab('sutras')}
          className={`flex-1 py-2 rounded-md font-serif font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            subTab === 'sutras'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-[#7e8aa0] hover:text-[#c4cedd]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>仙盟共享心法</span>
        </button>
      </div>

      {/* 1. 共用靈礦資源 */}
      {subTab === 'mine' && (
        <div className="space-y-4">
          <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252b39] pb-3">
              <div className="flex items-center gap-2">
                <Pickaxe className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-serif font-bold text-amber-300">
                  仙盟共有地下靈脈礦場 (百盟同採)
                </h3>
              </div>
              <span className="text-xs text-[#717e92] font-mono">
                靈脈蓄積：{alliance.mineVeinLevel * 250} 靈石/日
              </span>
            </div>

            <p className="text-xs text-[#7f8b9e] leading-relaxed">
              由仙盟全體修士共同探尋開闢之遠古靈脈。每日全盟成員均可自礦脈中分配開採儲備；亦可主動注入氣海純陽靈氣淬鍊靈脈，提升全盟產能並獲取仙盟貢獻！
            </p>

            {/* Mine reserves banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#11141c] border border-[#232936] p-3 rounded-lg text-xs font-mono">
              <div>
                <div className="text-[11px] text-[#717e92] font-sans">待分配靈石儲備</div>
                <div className="text-amber-300 font-bold text-sm mt-0.5">
                  +{alliance.mineReserves.stones} 靈石
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#717e92] font-sans">玄金礦砂結晶</div>
                <div className="text-cyan-300 font-bold text-sm mt-0.5">
                  +{alliance.mineReserves.ores} 塊寒鐵
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#717e92] font-sans">地脈極品溫玉</div>
                <div className="text-emerald-400 font-bold text-sm mt-0.5">
                  +{alliance.mineReserves.rareJades} 塊溫玉
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onClaimMineDividend}
                disabled={!canClaimMine}
                className={`py-2 px-4 rounded text-xs font-serif font-semibold transition flex items-center gap-1.5 ${
                  canClaimMine
                    ? 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 cursor-pointer active:scale-[0.98]'
                    : 'bg-[#181c25] text-[#555f72] border border-[#232835] cursor-not-allowed opacity-50'
                }`}
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{canClaimMine ? '領取今日靈礦分紅' : '今日分紅已入袋 (冷卻中)'}</span>
              </button>

              <button
                onClick={onInfuseMineVein}
                disabled={player.qi < 120}
                className={`py-2 px-4 rounded text-xs font-serif font-medium transition flex items-center gap-1.5 ${
                  player.qi >= 120
                    ? 'bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 cursor-pointer active:scale-[0.98]'
                    : 'bg-[#181c25] text-[#555f72] border border-[#232835] cursor-not-allowed opacity-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>注入靈氣淬脈 (消耗 120 靈氣 · 得 40 貢獻)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 每週仙盟爭霸 */}
      {subTab === 'hegemony' && (
        <div className="space-y-4">
          <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-[#252b39] pb-3">
              <div className="flex items-center gap-2">
                <Swords className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-serif font-bold text-rose-300">
                  仙盟爭霸戰場 · 名山天池逐鹿
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#717e92] hidden sm:inline">
                  道侶連攜出戰 · 斬魔奪地
                </span>
                <button
                  onClick={() => setSubTab('stats')}
                  className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded text-xs font-serif flex items-center gap-1 transition cursor-pointer active:scale-95"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>爭霸戰績統計視窗</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-[#7f8b9e] leading-relaxed">
              每週九州仙界開啟造化靈脈爭奪。挑戰鎮守神煞守衛，插上本盟戰旗！獲勝可為仙盟贏得巨額爭霸積分，並掠得仙盟貢獻與海量靈石。
            </p>

            {/* Battlefields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {HEGEMONY_BATTLEFIELDS.map(bf => (
                <div
                  key={bf.id}
                  className="bg-[#131620] border border-[#272e3d] p-3.5 rounded-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-serif font-bold text-sm text-[#e2b755]">
                        {bf.name}
                      </span>
                      <span className="text-[10px] text-rose-300 bg-rose-950/40 border border-rose-800/40 px-1.5 py-0.2 rounded font-mono">
                        {bf.level}階天脈
                      </span>
                    </div>

                    <p className="text-xs text-[#7e8b9e] leading-relaxed mb-3">
                      {bf.desc}
                    </p>

                    <div className="bg-[#0c0e14] border border-[#1d222e] p-2 rounded text-[11px] font-mono text-[#8a96ab] mb-3 space-y-0.5">
                      <div>守護神煞：<span className="text-rose-400">{bf.guardianName}</span></div>
                      <div>神煞戰力：<span className="text-emerald-400">HP {bf.guardianHp} · 攻 {bf.guardianAtk}</span></div>
                      <div>戰勝犒賞：<span className="text-amber-300 font-bold">+{bf.rewardContribution} 貢獻 · +{bf.rewardStones} 靈石</span></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1d232f]">
                    <button
                      onClick={() => onFightHegemony(bf)}
                      className="w-full py-1.5 bg-gradient-to-r from-rose-900 to-rose-700 hover:from-rose-800 hover:to-rose-600 border border-rose-500/50 text-rose-100 rounded text-xs font-serif font-semibold transition cursor-pointer active:scale-[0.98]"
                    >
                      出征爭霸 · 迎戰神煞
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. 爭霸戰績統計視窗 (recharts 圖表) */}
      {subTab === 'stats' && (
        <HegemonyStatsView
          player={player}
          onGoToBattle={() => setSubTab('hegemony')}
        />
      )}

      {/* 3. 仙盟共享心法 */}
      {subTab === 'sutras' && (
        <div className="space-y-4">
          <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-[#252b39] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-serif font-bold text-cyan-300">
                  仙盟共享心法傳承 (全盟同益)
                </h3>
              </div>
              <span className="text-xs font-mono text-amber-300">
                可用仙盟貢獻：{alliance.contribution} 點
              </span>
            </div>

            <p className="text-xs text-[#7f8b9e] leading-relaxed">
              消耗仙盟貢獻參悟仙盟心法，修為、氣血、殺伐與天劫突破機率皆可獲得仙盟天道意志之巨額加持！
            </p>

            {/* Sutras Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {ALLIANCE_SUTRAS_CONFIG.map(sutra => {
                const currentLv = alliance.sutras[sutra.id] || 0;
                const isMax = currentLv >= sutra.maxLevel;
                const cost = Math.floor(sutra.costBase * Math.pow(sutra.costMult, currentLv));
                const canAfford = alliance.contribution >= cost;

                return (
                  <div
                    key={sutra.id}
                    className="bg-[#131620] border border-[#272e3d] p-3.5 rounded-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-serif font-bold text-sm text-[#e2b755]">
                          {sutra.name}
                        </span>
                        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded">
                          Lv.{currentLv} / {sutra.maxLevel}
                        </span>
                      </div>

                      <p className="text-xs text-[#7e8b9e] leading-relaxed mb-2">
                        {sutra.desc}
                      </p>

                      <div className="text-xs font-mono text-emerald-300 mb-3">
                        當前加成：{sutra.displayEffect(currentLv)}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#1d232f] flex items-center justify-between">
                      <span className="text-[11px] text-[#636f84] font-mono">
                        {isMax ? '已至至尊圓滿' : `需貢獻: ${cost} 點`}
                      </span>

                      {!isMax ? (
                        <button
                          onClick={() => onUpgradeSutra(sutra.id)}
                          disabled={!canAfford}
                          className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                            canAfford
                              ? 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 cursor-pointer active:scale-[0.98]'
                              : 'bg-[#181c25] text-[#555f72] border border-[#232835] cursor-not-allowed opacity-50'
                          }`}
                        >
                          研讀精進
                        </button>
                      ) : (
                        <span className="text-xs text-[#525f75] italic">心法大成</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
