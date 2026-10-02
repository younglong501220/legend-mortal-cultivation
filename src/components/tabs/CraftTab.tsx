import React, { useState } from 'react';
import { PlayerState, DanRecipe, ForgeRecipe, EquipmentItem } from '../../types/game';
import { DAN_RECIPES, FORGE_RECIPES, EQUIPMENT_LIST, INVENTORY_ITEMS, ALCHEMY_TITLES, FORGE_TITLES } from '../../utils/constants';
import { Flame, Hammer, Shield, Swords, Sparkles, CheckCircle2, ChevronRight, Gem, ShieldAlert, Award } from 'lucide-react';

interface CraftTabProps {
  player: PlayerState;
  onCraftDan: (recipe: DanRecipe) => void;
  onForgeEquipment: (recipe: ForgeRecipe) => void;
  onEquipItem: (equipId: string) => void;
  onUnequipSlot: (slot: 'weapon' | 'armor' | 'artifact') => void;
}

export const CraftTab: React.FC<CraftTabProps> = ({
  player,
  onCraftDan,
  onForgeEquipment,
  onEquipItem,
  onUnequipSlot
}) => {
  const [subTab, setSubTab] = useState<'alchemy' | 'forge' | 'armory'>('alchemy');

  // Alchemy Exp required for next level: 100 * level * 1.5
  const alchemyReqExp = player.alchemyLevel * 120;
  const alchemyPct = Math.min(100, (player.alchemyExp / alchemyReqExp) * 100);

  // Forge Exp required for next level: 100 * level * 1.5
  const forgeReqExp = player.forgeLevel * 120;
  const forgePct = Math.min(100, (player.forgeExp / forgeReqExp) * 100);

  // Equipped gear items
  const equippedWeapon = EQUIPMENT_LIST.find(e => e.id === player.equipped.weapon);
  const equippedArmor = EQUIPMENT_LIST.find(e => e.id === player.equipped.armor);
  const equippedArtifact = EQUIPMENT_LIST.find(e => e.id === player.equipped.artifact);

  // Calculate total equipped gear stats
  let gearAtk = 0;
  let gearDef = 0;
  let gearHp = 0;
  let gearCrit = 0;
  let gearDodge = 0;

  [equippedWeapon, equippedArmor, equippedArtifact].forEach(eq => {
    if (eq) {
      gearAtk += eq.atkBonus;
      gearDef += eq.defBonus;
      gearHp += eq.hpBonus;
      gearCrit += eq.critBonus;
      gearDodge += eq.dodgeBonus;
    }
  });

  // Gear in player's bag that can be equipped
  const unequippedGear = EQUIPMENT_LIST.filter(eq => (player.inventory[eq.id] || 0) > 0);

  const getItemName = (id: string): string => {
    const inv = INVENTORY_ITEMS.find(i => i.id === id);
    if (inv) return inv.name;
    const eq = EQUIPMENT_LIST.find(e => e.id === id);
    if (eq) return eq.name;
    return id;
  };

  return (
    <div className="space-y-4">
      {/* Sub navigation bar */}
      <div className="flex bg-[#12151d] border border-[#262c3b] p-1 rounded-lg gap-1 text-xs">
        <button
          onClick={() => setSubTab('alchemy')}
          className={`flex-1 py-2 rounded-md font-serif font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            subTab === 'alchemy'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-[#7e8aa0] hover:text-[#c4cedd]'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>洞府煉丹房</span>
        </button>

        <button
          onClick={() => setSubTab('forge')}
          className={`flex-1 py-2 rounded-md font-serif font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            subTab === 'forge'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-[#7e8aa0] hover:text-[#c4cedd]'
          }`}
        >
          <Hammer className="w-3.5 h-3.5 text-cyan-400" />
          <span>九幽煉器閣</span>
        </button>

        <button
          onClick={() => setSubTab('armory')}
          className={`flex-1 py-2 rounded-md font-serif font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            subTab === 'armory'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'text-[#7e8aa0] hover:text-[#c4cedd]'
          }`}
        >
          <Swords className="w-3.5 h-3.5 text-purple-400" />
          <span>本命法寶裝備</span>
        </button>
      </div>

      {/* 1. 煉丹房 */}
      {subTab === 'alchemy' && (
        <div className="space-y-4">
          {/* 煉丹師造詣資訊條 */}
          <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252b39] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-amber-500 rounded-full" />
                <h3 className="text-base font-serif font-bold text-amber-300 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>丹道傳承 · 地火靈鼎</span>
                </h3>
              </div>
              <div className="text-xs font-mono text-amber-300 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded">
                造詣：{ALCHEMY_TITLES[player.alchemyLevel] || '九品丹聖'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 text-xs">
              <div className="text-[#8794a8]">
                爐火溫度：<b className="text-amber-400">地脈三昧真火</b> · 丹成率加成：<b className="text-emerald-400">+{player.alchemyLevel * 3}%</b>
              </div>
              <div className="sm:text-right text-[#8794a8]">
                累計成丹：<b className="text-[#d8dee9]">{player.totalPillsCrafted || 0}</b> 爐 · 機會一爐雙丹
              </div>
            </div>

            {/* Alchemy Exp Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-[#717e93]">
                <span>丹道感悟進度</span>
                <span className="font-mono">{player.alchemyExp} / {alchemyReqExp} ({alchemyPct.toFixed(0)}%)</span>
              </div>
              <div className="w-full h-2 bg-[#0d0f14] border border-[#252b38] rounded-full overflow-hidden p-[1px]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-600 to-yellow-400 transition-all duration-300"
                  style={{ width: `${alchemyPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* 丹方名錄清單 */}
          <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md space-y-3">
            <h4 className="text-sm font-serif font-bold text-[#c9d3e3] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>諸品金丹奇方目錄</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DAN_RECIPES.map(recipe => {
                const canLevel = player.alchemyLevel >= recipe.reqAlchemyLevel;
                const hasStones = player.stone >= recipe.stoneCost;
                const hasQi = player.qi >= recipe.qiCost;

                // Check materials
                let hasAllMats = true;
                const matStatus = recipe.materials.map(m => {
                  const currentCount = player.inventory[m.itemId] || (m.itemId === 'herb_lingcao' ? player.herb : 0);
                  const isSufficient = currentCount >= m.count;
                  if (!isSufficient) hasAllMats = false;
                  return {
                    name: getItemName(m.itemId),
                    need: m.count,
                    have: currentCount,
                    isSufficient
                  };
                });

                const canCraft = canLevel && hasStones && hasQi && hasAllMats;

                return (
                  <div
                    key={recipe.id}
                    className={`p-3.5 rounded-lg border transition flex flex-col justify-between ${
                      canCraft
                        ? 'bg-[#141822] border-[#2c3548] hover:border-[#42506d]'
                        : 'bg-[#101218] border-[#1f2430] opacity-75'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-serif font-bold text-sm text-amber-300">
                            {recipe.name}
                          </span>
                          <span className="text-[10px] text-amber-400/80 bg-amber-950/40 border border-amber-800/40 px-1.5 py-0.2 rounded">
                            {recipe.grade}品
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-400">
                          成丹率: {Math.min(100, recipe.successRate + player.alchemyLevel * 3)}%
                        </span>
                      </div>

                      <p className="text-xs text-[#828fa3] leading-relaxed mb-3">
                        {recipe.desc}
                      </p>

                      {/* Materials List */}
                      <div className="bg-[#0b0d13] border border-[#1d222e] rounded p-2 mb-3 text-[11px] space-y-1">
                        <div className="text-[#68758b]">所需藥材配伍：</div>
                        <div className="flex flex-wrap gap-2">
                          {matStatus.map((m, idx) => (
                            <span
                              key={idx}
                              className={`px-1.5 py-0.5 rounded border ${
                                m.isSufficient
                                  ? 'text-emerald-300 bg-emerald-950/30 border-emerald-800/40'
                                  : 'text-rose-400 bg-rose-950/30 border-rose-800/40'
                              }`}
                            >
                              {m.name}: {m.have}/{m.need}
                            </span>
                          ))}
                        </div>
                        <div className="text-[#59657a] text-[10px] pt-1">
                          消耗: {recipe.stoneCost} 靈石 · {recipe.qiCost} 靈氣 · 需【{ALCHEMY_TITLES[recipe.reqAlchemyLevel]}】
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#1d232f] flex items-center justify-between">
                      <span className="text-[11px] text-[#636f84]">
                        感悟: +{recipe.masteryGain} 丹道經驗
                      </span>

                      <button
                        onClick={() => onCraftDan(recipe)}
                        disabled={!canCraft}
                        className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                          canCraft
                            ? 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 cursor-pointer active:scale-[0.98]'
                            : 'bg-[#181c25] text-[#555f72] border border-[#232835] cursor-not-allowed opacity-50'
                        }`}
                      >
                        起爐煉丹
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. 煉器閣 */}
      {subTab === 'forge' && (
        <div className="space-y-4">
          {/* 煉器師造詣資訊條 */}
          <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252b39] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-cyan-500 rounded-full" />
                <h3 className="text-base font-serif font-bold text-cyan-300 flex items-center gap-1.5">
                  <Hammer className="w-4 h-4 text-cyan-400" />
                  <span>九幽煉器閣 · 萬物熔爐</span>
                </h3>
              </div>
              <div className="text-xs font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded">
                造詣：{FORGE_TITLES[player.forgeLevel] || '九品神匠'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 text-xs">
              <div className="text-[#8794a8]">
                真火淬金：<b className="text-cyan-400">紫微天火</b> · 鍛器成功率：<b className="text-emerald-400">+{player.forgeLevel * 3}%</b>
              </div>
              <div className="sm:text-right text-[#8794a8]">
                累計鍛造：<b className="text-[#d8dee9]">{player.totalArtifactsForged || 0}</b> 件法寶神兵
              </div>
            </div>

            {/* Forge Exp Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-[#717e93]">
                <span>器道錘煉進度</span>
                <span className="font-mono">{player.forgeExp} / {forgeReqExp} ({forgePct.toFixed(0)}%)</span>
              </div>
              <div className="w-full h-2 bg-[#0d0f14] border border-[#252b38] rounded-full overflow-hidden p-[1px]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-600 to-blue-400 transition-all duration-300"
                  style={{ width: `${forgePct}%` }}
                />
              </div>
            </div>
          </div>

          {/* 煉器圖譜清單 */}
          <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md space-y-3">
            <h4 className="text-sm font-serif font-bold text-[#c9d3e3] flex items-center gap-2">
              <Gem className="w-4 h-4 text-cyan-400" />
              <span>本命法寶神兵器譜</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {FORGE_RECIPES.map(recipe => {
                const targetEquip = EQUIPMENT_LIST.find(e => e.id === recipe.targetEquipId);
                const canLevel = player.forgeLevel >= recipe.reqForgeLevel;
                const hasStones = player.stone >= recipe.stoneCost;
                const hasQi = player.qi >= recipe.qiCost;

                // Check materials
                let hasAllMats = true;
                const matStatus = recipe.materials.map(m => {
                  const currentCount = player.inventory[m.itemId] || (m.itemId === 'herb_lingcao' ? player.herb : 0);
                  const isSufficient = currentCount >= m.count;
                  if (!isSufficient) hasAllMats = false;
                  return {
                    name: getItemName(m.itemId),
                    need: m.count,
                    have: currentCount,
                    isSufficient
                  };
                });

                const canForge = canLevel && hasStones && hasQi && hasAllMats;

                return (
                  <div
                    key={recipe.id}
                    className={`p-3.5 rounded-lg border transition flex flex-col justify-between ${
                      canForge
                        ? 'bg-[#141822] border-[#2c3548] hover:border-[#42506d]'
                        : 'bg-[#101218] border-[#1f2430] opacity-75'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-serif font-bold text-sm text-cyan-300">
                            {recipe.name}
                          </span>
                          {targetEquip && (
                            <span className="text-[10px] text-cyan-400/80 bg-cyan-950/40 border border-cyan-800/40 px-1.5 py-0.2 rounded">
                              {targetEquip.grade}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-emerald-400">
                          成功率: {Math.min(100, recipe.successRate + player.forgeLevel * 3)}%
                        </span>
                      </div>

                      <p className="text-xs text-[#828fa3] leading-relaxed mb-3">
                        {recipe.desc}
                      </p>

                      {/* Materials List */}
                      <div className="bg-[#0b0d13] border border-[#1d222e] rounded p-2 mb-3 text-[11px] space-y-1">
                        <div className="text-[#68758b]">所需靈材精金：</div>
                        <div className="flex flex-wrap gap-2">
                          {matStatus.map((m, idx) => (
                            <span
                              key={idx}
                              className={`px-1.5 py-0.5 rounded border ${
                                m.isSufficient
                                  ? 'text-emerald-300 bg-emerald-950/30 border-emerald-800/40'
                                  : 'text-rose-400 bg-rose-950/30 border-rose-800/40'
                              }`}
                            >
                              {m.name}: {m.have}/{m.need}
                            </span>
                          ))}
                        </div>
                        <div className="text-[#59657a] text-[10px] pt-1">
                          消耗: {recipe.stoneCost} 靈石 · {recipe.qiCost} 靈氣 · 需【{FORGE_TITLES[recipe.reqForgeLevel]}】
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#1d232f] flex items-center justify-between">
                      <span className="text-[11px] text-[#636f84]">
                        感悟: +{recipe.masteryGain} 器道經驗
                      </span>

                      <button
                        onClick={() => onForgeEquipment(recipe)}
                        disabled={!canForge}
                        className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                          canForge
                            ? 'bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 cursor-pointer active:scale-[0.98]'
                            : 'bg-[#181c25] text-[#555f72] border border-[#232835] cursor-not-allowed opacity-50'
                        }`}
                      >
                        運起真火鍛造
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. 本命法寶裝備庫 */}
      {subTab === 'armory' && (
        <div className="space-y-4">
          {/* Current Equipped 3 Slots */}
          <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#252b39] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-purple-500 rounded-full" />
                <h3 className="text-base font-serif font-bold text-purple-300">本命法寶槽位</h3>
              </div>
              <span className="text-xs text-[#768297]">祭煉通靈，護佑仙軀</span>
            </div>

            {/* Gear Bonuses summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#12151c] border border-[#232936] p-2.5 rounded-lg mb-4 text-xs font-mono">
              <div>
                <span className="text-[#6c788d]">法寶增攻:</span> <b className="text-rose-400 font-bold">+{gearAtk}</b>
              </div>
              <div>
                <span className="text-[#6c788d]">法寶增防:</span> <b className="text-cyan-400 font-bold">+{gearDef}</b>
              </div>
              <div>
                <span className="text-[#6c788d]">命元氣血:</span> <b className="text-emerald-400 font-bold">+{gearHp}</b>
              </div>
              <div>
                <span className="text-[#6c788d]">暴/閃加成:</span> <b className="text-amber-400 font-bold">+{gearCrit}% / +{gearDodge}%</b>
              </div>
            </div>

            {/* 3 Equipment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Weapon */}
              <div className="bg-[#11141c] border border-[#262c3b] p-3 rounded-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#738096] flex items-center gap-1">
                      <Swords className="w-3.5 h-3.5 text-rose-400" />
                      <span>本命神兵</span>
                    </span>
                    {equippedWeapon && (
                      <span className="text-[10px] text-amber-400 bg-amber-950/40 border border-amber-800/40 px-1.5 py-0.2 rounded">
                        {equippedWeapon.grade}
                      </span>
                    )}
                  </div>

                  {equippedWeapon ? (
                    <div>
                      <div className="font-serif font-bold text-sm text-[#e2b755]">
                        {equippedWeapon.name}
                      </div>
                      <div className="text-xs text-[#8c98ac] mt-1 space-y-0.5">
                        <div>攻擊力: <b className="text-rose-400 font-mono">+{equippedWeapon.atkBonus}</b></div>
                        {equippedWeapon.critBonus > 0 && <div>暴擊率: <b className="text-amber-400 font-mono">+{equippedWeapon.critBonus}%</b></div>}
                        {equippedWeapon.specialEffect && (
                          <div className="text-[11px] text-purple-300 mt-1">{equippedWeapon.specialEffect}</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-[#525d72] py-4 text-center italic">
                      未祭煉裝備武器
                    </div>
                  )}
                </div>

                {equippedWeapon && (
                  <button
                    onClick={() => onUnequipSlot('weapon')}
                    className="mt-3 w-full py-1 text-xs text-[#8896ad] hover:text-rose-300 bg-[#191e2b] border border-[#2c3447] rounded transition cursor-pointer"
                  >
                    卸下飛劍
                  </button>
                )}
              </div>

              {/* Armor */}
              <div className="bg-[#11141c] border border-[#262c3b] p-3 rounded-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#738096] flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                      <span>護體法衣</span>
                    </span>
                    {equippedArmor && (
                      <span className="text-[10px] text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-1.5 py-0.2 rounded">
                        {equippedArmor.grade}
                      </span>
                    )}
                  </div>

                  {equippedArmor ? (
                    <div>
                      <div className="font-serif font-bold text-sm text-cyan-300">
                        {equippedArmor.name}
                      </div>
                      <div className="text-xs text-[#8c98ac] mt-1 space-y-0.5">
                        <div>防禦力: <b className="text-cyan-400 font-mono">+{equippedArmor.defBonus}</b></div>
                        <div>氣血上限: <b className="text-emerald-400 font-mono">+{equippedArmor.hpBonus}</b></div>
                        {equippedArmor.specialEffect && (
                          <div className="text-[11px] text-purple-300 mt-1">{equippedArmor.specialEffect}</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-[#525d72] py-4 text-center italic">
                      未穿戴護體法衣
                    </div>
                  )}
                </div>

                {equippedArmor && (
                  <button
                    onClick={() => onUnequipSlot('armor')}
                    className="mt-3 w-full py-1 text-xs text-[#8896ad] hover:text-rose-300 bg-[#191e2b] border border-[#2c3447] rounded transition cursor-pointer"
                  >
                    卸下法衣
                  </button>
                )}
              </div>

              {/* Artifact */}
              <div className="bg-[#11141c] border border-[#262c3b] p-3 rounded-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#738096] flex items-center gap-1">
                      <Gem className="w-3.5 h-3.5 text-purple-400" />
                      <span>鎮魔至寶</span>
                    </span>
                    {equippedArtifact && (
                      <span className="text-[10px] text-purple-300 bg-purple-950/40 border border-purple-800/40 px-1.5 py-0.2 rounded">
                        {equippedArtifact.grade}
                      </span>
                    )}
                  </div>

                  {equippedArtifact ? (
                    <div>
                      <div className="font-serif font-bold text-sm text-purple-300">
                        {equippedArtifact.name}
                      </div>
                      <div className="text-xs text-[#8c98ac] mt-1 space-y-0.5">
                        <div>全抗增幅: <b className="text-purple-300 font-mono">防+{equippedArtifact.defBonus} 攻+{equippedArtifact.atkBonus}</b></div>
                        {equippedArtifact.specialEffect && (
                          <div className="text-[11px] text-amber-300 mt-1">{equippedArtifact.specialEffect}</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-[#525d72] py-4 text-center italic">
                      未佩戴鎮魔至寶
                    </div>
                  )}
                </div>

                {equippedArtifact && (
                  <button
                    onClick={() => onUnequipSlot('artifact')}
                    className="mt-3 w-full py-1 text-xs text-[#8896ad] hover:text-rose-300 bg-[#191e2b] border border-[#2c3447] rounded transition cursor-pointer"
                  >
                    卸下至寶
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bag available gears */}
          <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md space-y-3">
            <h4 className="text-sm font-serif font-bold text-[#c9d3e3] flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>儲物袋中已鍛成的法寶神兵</span>
            </h4>

            {unequippedGear.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#626e82]">
                儲物袋中暫無空閒法寶，請移步【九幽煉器閣】收集材料鍛造神兵！
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {unequippedGear.map(eq => (
                  <div
                    key={eq.id}
                    className="bg-[#12151d] border border-[#262c3b] p-3 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-bold text-sm text-[#e2b755]">
                          {eq.name}
                        </span>
                        <span className="text-[10px] text-[#788599] border border-[#282f3f] px-1 py-0.2 rounded">
                          {eq.slot === 'weapon' ? '神兵' : eq.slot === 'armor' ? '法袍' : '至寶'}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#7e8ba0] mt-0.5">
                        攻+{eq.atkBonus} · 防+{eq.defBonus} · 血+{eq.hpBonus}
                      </div>
                    </div>

                    <button
                      onClick={() => onEquipItem(eq.id)}
                      className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 rounded text-xs font-medium transition cursor-pointer active:scale-[0.98]"
                    >
                      祭煉穿戴
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
