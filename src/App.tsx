/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PlayerState, TabType, LogEntry, DanRecipe, ForgeRecipe, EquipSlot, Disciple, HegemonyBattlefield } from './types/game';
import {
  REALMS,
  REALM_TITLES,
  BODY_REALMS,
  MAPS,
  SKILLS_DATA,
  INVENTORY_ITEMS,
  DAN_RECIPES,
  FORGE_RECIPES,
  EQUIPMENT_LIST,
  ADVENTURE_RANDOM_EVENTS,
  ALCHEMY_TITLES,
  FORGE_TITLES,
  SECT_TITLES,
  SECT_BENEFITS,
  DISCIPLE_RECRUITS,
  ALLIANCE_TITLES,
  ALLIANCE_SUTRAS_CONFIG,
  HEGEMONY_BATTLEFIELDS,
  DEFAULT_HEGEMONY_WEEKLY_HISTORY
} from './utils/constants';
import { sound } from './utils/audio';
import { loadSave, saveState, clearSave, INITIAL_PLAYER, OfflineGainResult } from './utils/storage';
import { HeaderStats } from './components/HeaderStats';
import { MudTerminal } from './components/MudTerminal';
import { CultivationTab } from './components/tabs/CultivationTab';
import { CaveAbodeTab } from './components/tabs/CaveAbodeTab';
import { SectGongfaTab } from './components/tabs/SectGongfaTab';
import { SectTab } from './components/tabs/SectTab';
import { CompanionTab } from './components/tabs/CompanionTab';
import { AllianceTab } from './components/tabs/AllianceTab';
import { CraftTab } from './components/tabs/CraftTab';
import { AdventureTab } from './components/tabs/AdventureTab';
import { HeavensTab } from './components/tabs/HeavensTab';
import { InventoryTab } from './components/tabs/InventoryTab';
import { TribulationModal } from './components/TribulationModal';
import { SettingsModal } from './components/SettingsModal';
import { OfflineModal } from './components/OfflineModal';
import bannerImg from './assets/images/xianxia_misty_mountains_1790936735718.jpg';

export default function App() {
  const [player, setPlayer] = useState<PlayerState>(() => loadSave().state);
  const [offlineGains, setOfflineGains] = useState<OfflineGainResult | null>(() => loadSave().offline);
  const [activeTab, setActiveTab] = useState<TabType>('xiulian');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [tribulationInfo, setTribulationInfo] = useState<{
    isOpen: boolean;
    isAscension: boolean;
    realmName: string;
    isSuccess: boolean;
  }>({
    isOpen: false,
    isAscension: false,
    realmName: '',
    isSuccess: false
  });

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init_1',
      time: new Date().toTimeString().split(' ')[0],
      type: 'world',
      message: '乾坤未定，你只是一介凡夫俗子，偶得太古吐納篇，始踏長生仙途...'
    }
  ]);

  const tickCounter = useRef<number>(0);

  // Helper to add MUD log
  const addLog = useCallback((message: string, type: LogEntry['type'] = 'world') => {
    const time = new Date().toTimeString().split(' ')[0];
    const newEntry: LogEntry = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      time,
      type,
      message
    };
    setLogs(prev => {
      const next = [...prev, newEntry];
      return next.length > 250 ? next.slice(next.length - 250) : next;
    });
  }, []);

  // Rates calculation with Sect, Companion, and Alliance bonuses
  const getExpPerTick = useCallback((): number => {
    if (player.mindDemon >= 80) return 0;
    let base = 5 + (player.realmIdx * 4) + (player.spiritArrayLv * 2);

    // Sect passive rate bonus
    const sectBenefit = SECT_BENEFITS[player.sect?.level || 1];
    if (sectBenefit) {
      base += sectBenefit.rateBonus;
    }

    // Active Companion rate bonus
    if (player.activeCompanionId && player.companions?.[player.activeCompanionId]) {
      const comp = player.companions[player.activeCompanionId];
      if (comp.unlocked) {
        base += comp.rateBonus;
      }
    }

    // Alliance Sutra bonus (太虛同源心法)
    const sutraRateLv = player.alliance?.sutras?.['sutra_taixu_rate'] || 0;
    if (sutraRateLv > 0) {
      base += sutraRateLv * 15;
    }

    // Skills bonus
    SKILLS_DATA.forEach(sk => {
      if (player.learnedSkills.includes(sk.id)) {
        if (sk.type === 'rate') base += sk.val;
        if (sk.id === 'sk7') base += 30;
      }
    });

    return base;
  }, [player.mindDemon, player.realmIdx, player.spiritArrayLv, player.sect?.level, player.activeCompanionId, player.companions, player.learnedSkills, player.alliance?.sutras]);

  const getQiPerSec = useCallback((): number => {
    let rate = player.spiritArrayLv * 3;

    // Sect Qi accumulation multiplier bonus
    const sectBenefit = SECT_BENEFITS[player.sect?.level || 1];
    if (sectBenefit) {
      rate = Math.round(rate * (1 + sectBenefit.qiBonusPct / 100));
    }

    // Check equipped artifact bonus (太乙聚靈神珠 +20% 聚靈效率)
    if (player.equipped?.artifact === 'eq_juling_bead') {
      rate = Math.round(rate * 1.2);
    }

    return rate;
  }, [player.spiritArrayLv, player.sect?.level, player.equipped?.artifact]);

  const getRealmExpNeeded = useCallback((): number => {
    return Math.floor(60 * Math.pow(1.5, player.realmIdx) * Math.pow(1.22, player.realmSubLevel - 1));
  }, [player.realmIdx, player.realmSubLevel]);

  const getBodyExpNeeded = useCallback((): number => {
    return Math.floor(80 * Math.pow(1.65, player.bodyIdx) * (1 + player.bodySubLevel * 0.3));
  }, [player.bodyIdx, player.bodySubLevel]);

  const getSuccessRate = useCallback((): number => {
    let rate = Math.max(25, 100 - (player.realmIdx * 5) - (player.realmSubLevel * 2) - Math.floor(player.mindDemon / 3));
    if (player.realmSubLevel === 10) rate -= 15;

    // Alliance Sutra: 天地同壽定心經 (+4% breakthrough rate per level)
    const sutraBreakLv = player.alliance?.sutras?.['sutra_dingshen_break'] || 0;
    if (sutraBreakLv > 0) {
      rate += sutraBreakLv * 4;
    }

    return rate;
  }, [player.realmIdx, player.realmSubLevel, player.mindDemon, player.alliance?.sutras]);

  // Main Ticking Loop (Every 1.5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayer(prev => {
        let newExp = prev.exp;
        let newQi = prev.qi;
        let newDemon = prev.mindDemon;

        // 1. Gain EXP
        if (newDemon < 80) {
          const expGain = getExpPerTick();
          newExp += expGain;
        }

        // 2. Gain Qi
        let qiGain = Math.round(getQiPerSec() * 1.2);
        newQi = Math.min(prev.qiMax, newQi + qiGain);

        // 3. Demon fluctuation
        const demonGrowthChance = prev.equipped?.artifact === 'eq_qingxin_jade' ? 0.08 : 0.15;
        if (Math.random() < demonGrowthChance && newDemon < 100) {
          newDemon = Math.min(100, newDemon + 1);
        }

        // 4. Sect disciples automated field gathering accumulation (every 3 ticks = 4.5s)
        const nextSect = { ...prev.sect };
        if (tickCounter.current % 3 === 0 && nextSect.disciples) {
          let gatheredHerbs = 0;
          let gatheredOres = 0;
          let gatheredStones = 0;

          nextSect.disciples.forEach(d => {
            if (d.assignedField !== null) {
              if (d.talent === 'herb') {
                gatheredHerbs += 1 * d.efficiency;
              } else if (d.talent === 'forge') {
                gatheredOres += 1 * d.efficiency;
              } else if (d.talent === 'qi') {
                newQi = Math.min(prev.qiMax, newQi + d.efficiency * 2);
              } else if (d.talent === 'battle') {
                gatheredStones += 2 * d.efficiency;
              } else {
                gatheredHerbs += 1;
              }
            }
          });

          nextSect.autoGatherAccumulated = {
            herb: (nextSect.autoGatherAccumulated?.herb || 0) + gatheredHerbs,
            ore: (nextSect.autoGatherAccumulated?.ore || 0) + gatheredOres,
            stone: (nextSect.autoGatherAccumulated?.stone || 0) + gatheredStones
          };
        }

        // 5. Alliance mine reserve accrual (every 6 ticks = 9s if in alliance)
        let nextAlliance = prev.alliance;
        if (prev.alliance?.joined && tickCounter.current % 6 === 0) {
          const veinLv = prev.alliance.mineVeinLevel || 1;
          nextAlliance = {
            ...prev.alliance,
            mineReserves: {
              stones: (prev.alliance.mineReserves?.stones || 0) + veinLv * 4,
              ores: (prev.alliance.mineReserves?.ores || 0) + (Math.random() < 0.4 ? 1 : 0),
              rareJades: (prev.alliance.mineReserves?.rareJades || 0) + (Math.random() < 0.15 ? 1 : 0)
            }
          };
        }

        tickCounter.current += 1;
        const nextState: PlayerState = {
          ...prev,
          exp: newExp,
          qi: newQi,
          mindDemon: newDemon,
          sect: nextSect,
          alliance: nextAlliance
        };

        // Auto-save every 10 ticks (15s)
        if (tickCounter.current % 10 === 0) {
          saveState(nextState);
        }

        return nextState;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [getExpPerTick, getQiPerSec]);

  // Auto-Roam step interval (every 2.2 seconds when enabled and no active modal event)
  useEffect(() => {
    if (!player.isAutoRoaming || !player.currentMapId || player.activeEvent) return;

    const roamTimer = setInterval(() => {
      handleTakeStep();
    }, 2200);

    return () => clearInterval(roamTimer);
  }, [player.isAutoRoaming, player.currentMapId, player.adventureStep, player.activeEvent]);

  // Handle Manual Meditation
  const handleMeditateInstant = () => {
    sound.playMeditate();
    setPlayer(prev => ({ ...prev, exp: prev.exp + 15, totalMeditationCount: prev.totalMeditationCount + 1 }));
    addLog('手結道印，吐納吸得天地一縷精純玄氣，得 +15 點修為。', 'gain');
  };

  // Handle Breakthrough
  const handleAttemptBreakthrough = (usePillId?: string) => {
    const reqExp = getRealmExpNeeded();
    if (player.exp < reqExp) {
      addLog('修為尚顯不足，氣海乾涸難以叩關！', 'battle');
      return;
    }

    let successRate = getSuccessRate();
    const isMajor = player.realmSubLevel === 10;
    const nextRealmIndex = isMajor ? player.realmIdx + 1 : player.realmIdx;
    const targetRealmName = isMajor ? REALMS[nextRealmIndex] : `${REALMS[player.realmIdx]} ${player.realmSubLevel + 1}層`;

    // Deduct pill if used
    let pillUsedName = '';
    if (usePillId && (player.inventory[usePillId] || 0) > 0) {
      if (usePillId === 'pill_zhuji') {
        successRate = Math.min(100, successRate + 15);
        pillUsedName = '築基丹 (+15%)';
      } else if (usePillId === 'pill_pozhange') {
        successRate = Math.min(100, successRate + 20);
        pillUsedName = '金丹破障丹 (+20%)';
      } else if (usePillId === 'pill_ningying') {
        successRate = Math.min(100, successRate + 25);
        pillUsedName = '凝嬰聚頂丹 (+25%)';
      }
    }

    const roll = Math.random() * 100;
    const isSuccess = roll <= successRate;

    setPlayer(prev => {
      const nextInv = { ...prev.inventory };
      if (usePillId && nextInv[usePillId]) {
        nextInv[usePillId] -= 1;
      }

      if (isSuccess) {
        if (isMajor) {
          return {
            ...prev,
            exp: prev.exp - reqExp,
            realmIdx: prev.realmIdx + 1,
            realmSubLevel: 1,
            hpMax: prev.hpMax + 50 + prev.realmIdx * 25,
            hpCurrent: prev.hpMax + 50 + prev.realmIdx * 25,
            atk: prev.atk + 10 + prev.realmIdx * 4,
            def: prev.def + 6 + prev.realmIdx * 3,
            totalBreakthroughSuccess: prev.totalBreakthroughSuccess + 1,
            inventory: nextInv
          };
        } else {
          return {
            ...prev,
            exp: prev.exp - reqExp,
            realmSubLevel: prev.realmSubLevel + 1,
            hpMax: prev.hpMax + 30 + prev.realmIdx * 15,
            hpCurrent: prev.hpMax + 30 + prev.realmIdx * 15,
            atk: prev.atk + 6 + prev.realmIdx * 2,
            def: prev.def + 4 + prev.realmIdx * 2,
            totalBreakthroughSuccess: prev.totalBreakthroughSuccess + 1,
            inventory: nextInv
          };
        }
      } else {
        const demonGain = Math.floor(Math.random() * 10) + 10;
        return {
          ...prev,
          exp: prev.exp - reqExp,
          mindDemon: Math.min(100, prev.mindDemon + demonGain),
          totalBreakthroughFail: prev.totalBreakthroughFail + 1,
          inventory: nextInv
        };
      }
    });

    if (pillUsedName) {
      addLog(`服下【${pillUsedName}】，氣海真元沸騰，突破成功率顯著提升！`, 'gain');
    }

    if (isMajor) {
      if (isSuccess) {
        sound.playBreakthroughSuccess();
      } else {
        sound.playThunder();
      }
      setTribulationInfo({
        isOpen: true,
        isAscension: false,
        realmName: targetRealmName,
        isSuccess
      });
      if (isSuccess) {
        addLog(`【天劫度過】天降甘露祥雲！道友渡過大圓滿劫數，正式登入【${targetRealmName}】！`, 'break');
      } else {
        addLog(`【劫雷反噬】破境受阻！經脈震盪逆流，天雷反噬，紫府心魔激增！`, 'battle');
      }
    } else {
      if (isSuccess) {
        sound.playBreakthroughSuccess();
        addLog(`靈氣周天運轉順暢，道基穩固，晉升至【${targetRealmName}】。`, 'break');
      } else {
        sound.playThunder();
        addLog(`破境受阻，真元逆沖經脈，心魔滋生！`, 'battle');
      }
    }
  };

  // Quenched Body
  const handleQuenchedBody = () => {
    const cost = getBodyExpNeeded();
    if (player.exp < cost) {
      addLog('修為不足，無法強行淬體伐髓！', 'battle');
      return;
    }

    sound.playPurify();
    setPlayer(prev => {
      let nextSubLevel = prev.bodySubLevel + 1;
      let nextIdx = prev.bodyIdx;

      if (nextSubLevel > 5) {
        nextSubLevel = 1;
        nextIdx = Math.min(BODY_REALMS.length - 1, prev.bodyIdx + 1);
        addLog(`【肉身成聖】骨骼晶瑩脫胎換骨，進階為【${BODY_REALMS[nextIdx]}】！`, 'break');
      } else {
        addLog(`氣血翻湧，肉身淬鍊進步至【${BODY_REALMS[nextIdx]} ${nextSubLevel}階】！`, 'gain');
      }

      return {
        ...prev,
        exp: prev.exp - cost,
        bodyIdx: nextIdx,
        bodySubLevel: nextSubLevel,
        hpMax: prev.hpMax + 60 + nextIdx * 35,
        hpCurrent: prev.hpMax + 60 + nextIdx * 35,
        def: prev.def + 8 + nextIdx * 4
      };
    });
  };

  // Slay Mind Demon
  const handleSlayMindDemon = () => {
    if (player.mindDemon <= 0) {
      addLog('靈臺空明無瑕，道心清澈，無心魔可斬。', 'world');
      return;
    }
    sound.playPurify();
    setPlayer(prev => ({
      ...prev,
      mindDemon: Math.max(0, prev.mindDemon - 25),
      demonsSlainCount: prev.demonsSlainCount + 1
    }));
    addLog('盤膝定坐，神遊太虛，念頭通達斬落 25 點心魔雜念。', 'demon');
  };

  // Upgrade Spirit Array
  const handleUpgradeSpiritArray = () => {
    const cost = Math.floor(100 * Math.pow(1.6, player.spiritArrayLv - 1));
    if (player.stone < cost) {
      addLog('靈石儲備短缺，無法銘刻高階聚靈陣法圖紋！', 'battle');
      return;
    }
    sound.playLoot();
    setPlayer(prev => ({
      ...prev,
      stone: prev.stone - cost,
      spiritArrayLv: prev.spiritArrayLv + 1,
      qiMax: prev.qiMax + 120
    }));
    addLog(`聚靈大陣大放青金光華，晉階至【${player.spiritArrayLv + 1} 階】！靈氣儲量與產能大增。`, 'break');
  };

  // Upgrade Root
  const handleUpgradeRoot = (key: keyof PlayerState['roots']) => {
    const cost = player.roots[key] * 70;
    if (player.qi < cost) {
      addLog('聚靈池內靈氣不足，無法洗滌靈根！', 'battle');
      return;
    }
    sound.playPurify();
    setPlayer(prev => {
      const nextRoots = { ...prev.roots, [key]: prev.roots[key] + 1 };
      let newAtk = prev.atk;
      let newHp = prev.hpMax;
      let newDef = prev.def;
      let newCrit = prev.critRate;

      if (key === 'jin') newAtk += 8;
      if (key === 'mu') newHp += 60;
      if (key === 'shui') newDef += 6;
      if (key === 'huo') { newCrit += 1; newAtk += 5; }
      if (key === 'tu') { newHp += 40; newDef += 4; }

      return {
        ...prev,
        qi: prev.qi - cost,
        roots: nextRoots,
        atk: newAtk,
        hpMax: newHp,
        hpCurrent: newHp,
        def: newDef,
        critRate: newCrit
      };
    });
    addLog(`靈氣洗鍊完成，五行【${key.toUpperCase()}靈根】晉升！修士根基暴漲。`, 'gain');
  };

  // Harvest Herbs
  const handleHarvestHerbs = () => {
    sound.playLoot();
    setPlayer(prev => ({
      ...prev,
      herb: (prev.herb || 0) + 3,
      inventory: {
        ...prev.inventory,
        'herb_lingcao': (prev.inventory['herb_lingcao'] || 0) + 3
      }
    }));
    addLog('漫步靈田，汲取朝露，收穫了 3 株新鮮九葉雪芝入袋！', 'gain');
  };

  // Learn Skill
  const handleLearnSkill = (skillId: string) => {
    const sk = SKILLS_DATA.find(s => s.id === skillId);
    if (!sk || player.learnedSkills.includes(skillId)) return;
    if (player.stone < sk.cost) {
      addLog('囊中羞澀，缺少足夠靈石參透古卷心法！', 'battle');
      return;
    }
    sound.playBreakthroughSuccess();
    setPlayer(prev => {
      let newAtk = prev.atk;
      let newDef = prev.def;
      let newHp = prev.hpMax;

      if (sk.type === 'atk') newAtk += sk.val;
      if (sk.type === 'def') {
        newDef += sk.val;
        if (sk.id === 'sk3') newHp += 150;
        if (sk.id === 'sk8') newHp += 1500;
      }
      if (sk.type === 'hp') {
        newHp += sk.val;
        if (sk.id === 'sk6') newDef += 35;
      }
      if (sk.id === 'sk7') {
        newAtk += 180;
      }

      return {
        ...prev,
        stone: prev.stone - sk.cost,
        learnedSkills: [...prev.learnedSkills, sk.id],
        atk: newAtk,
        def: newDef,
        hpMax: newHp,
        hpCurrent: newHp
      };
    });
    addLog(`【玄法洞悉】你已徹夜參悟【${sk.name}】，仙道實力暴漲！`, 'break');
  };

  // ================= 宗門建設系統 =================
  const handleUpgradeSect = () => {
    const nextBenefit = SECT_BENEFITS[player.sect.level + 1];
    if (!nextBenefit || player.stone < nextBenefit.cost) {
      addLog('靈石不足，無法擴建宗門山門！', 'battle');
      return;
    }
    sound.playBreakthroughSuccess();
    setPlayer(prev => ({
      ...prev,
      stone: prev.stone - nextBenefit.cost,
      sect: {
        ...prev.sect,
        level: prev.sect.level + 1,
        maxDisciples: nextBenefit.maxDisciples,
        maxFields: nextBenefit.maxFields
      }
    }));
    addLog(`【宗門晉階】四方氣運匯聚，山門晉升至【${SECT_TITLES[player.sect.level + 1]}】！靈脈蓄氣與修為效率暴漲！`, 'sect');
  };

  const handleRecruitDisciple = () => {
    if (player.stone < 80 || player.sect.disciples.length >= player.sect.maxDisciples) {
      addLog('靈石不足或宗門弟子名額已滿！請升級宗門以招收更多門人。', 'battle');
      return;
    }
    const template = DISCIPLE_RECRUITS[Math.floor(Math.random() * DISCIPLE_RECRUITS.length)];
    const newDisc: Disciple = {
      id: `disc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: template.name,
      talent: template.talent,
      talentName: template.talentName,
      realm: template.realm,
      efficiency: template.efficiency,
      assignedField: null
    };

    // Auto-assign to first empty field if available
    const occupiedFields = new Set(player.sect.disciples.map(d => d.assignedField).filter(f => f !== null));
    for (let f = 0; f < player.sect.herbFields; f++) {
      if (!occupiedFields.has(f)) {
        newDisc.assignedField = f;
        break;
      }
    }

    sound.playLoot();
    setPlayer(prev => ({
      ...prev,
      stone: prev.stone - 80,
      sect: {
        ...prev.sect,
        disciples: [...prev.sect.disciples, newDisc]
      }
    }));

    addLog(`【開山收徒】新弟子【${newDisc.name}】（${newDisc.realm} · ${newDisc.talentName}）叩拜山門，拜入座下！${newDisc.assignedField !== null ? `已自動派駐至第 ${newDisc.assignedField + 1} 畝藥田。` : ''}`, 'sect');
  };

  const handleOpenNewField = () => {
    const cost = (player.sect.herbFields + 1) * 120;
    if (player.sect.herbFields >= player.sect.maxFields || player.stone < cost) {
      addLog('靈石不足或當前宗門品階已達藥田畝數上限！', 'battle');
      return;
    }
    sound.playPurify();
    setPlayer(prev => ({
      ...prev,
      stone: prev.stone - cost,
      sect: {
        ...prev.sect,
        herbFields: prev.sect.herbFields + 1
      }
    }));
    addLog(`【開闢靈圃】消耗 ${cost} 靈石開闢了第 ${player.sect.herbFields + 1} 畝靈泉藥田！可指派弟子入駐採集。`, 'sect');
  };

  const handleAssignDisciple = (discipleId: string, fieldIndex: number | null) => {
    setPlayer(prev => {
      const nextDisciples = prev.sect.disciples.map(d => {
        if (d.id === discipleId) {
          return { ...d, assignedField: fieldIndex };
        }
        // If fieldIndex was assigned to another disciple, unassign them
        if (fieldIndex !== null && d.assignedField === fieldIndex) {
          return { ...d, assignedField: null };
        }
        return d;
      });
      return {
        ...prev,
        sect: {
          ...prev.sect,
          disciples: nextDisciples
        }
      };
    });
    const d = player.sect.disciples.find(disc => disc.id === discipleId);
    if (fieldIndex !== null) {
      addLog(`【弟子調配】已指派【${d?.name || '弟子'}】駐守第 ${fieldIndex + 1} 畝藥田自動掛機採集！`, 'sect');
    } else {
      addLog(`【弟子調配】已召回【${d?.name || '弟子'}】於宗門大殿待命。`, 'sect');
    }
  };

  const handleCollectSectGains = () => {
    const gains = player.sect.autoGatherAccumulated;
    if (!gains || (gains.herb === 0 && gains.ore === 0 && gains.stone === 0)) {
      addLog('藥田中暫無掛機產出可收取。', 'world');
      return;
    }
    sound.playLoot();
    setPlayer(prev => {
      const nextInv = { ...prev.inventory };
      if (gains.herb > 0) nextInv['herb_lingcao'] = (nextInv['herb_lingcao'] || 0) + gains.herb;
      if (gains.ore > 0) nextInv['mat_hantie'] = (nextInv['mat_hantie'] || 0) + gains.ore;

      return {
        ...prev,
        stone: prev.stone + gains.stone,
        herb: (prev.herb || 0) + gains.herb,
        inventory: nextInv,
        sect: {
          ...prev.sect,
          autoGatherAccumulated: { herb: 0, ore: 0, stone: 0 }
        }
      };
    });
    addLog(`【靈圃收成】自宗門藥田收取了弟子掛機成果：九葉雪芝 +${gains.herb} 株、寒鐵石 +${gains.ore} 塊、靈石 +${gains.stone}！`, 'gain');
  };

  // ================= 紅塵道侶系統 =================
  const handleDualCultivate = (companionId: string) => {
    const comp = player.companions[companionId];
    if (!comp || !comp.unlocked) return;

    const cooldownElapsed = Date.now() - comp.lastDualCultivateTime;
    if (cooldownElapsed < 60 * 1000 && comp.lastDualCultivateTime > 0) {
      addLog('雙修耗損心神，經脈溫熱，尚需調息片刻。', 'world');
      return;
    }

    sound.playDualCultivate();
    const expGain = 750 + comp.rateBonus * 25 + comp.favor * 2;
    const demonPurge = 25;

    setPlayer(prev => {
      const updatedComp = {
        ...comp,
        favor: Math.min(1000, comp.favor + 25),
        lastDualCultivateTime: Date.now()
      };
      return {
        ...prev,
        exp: prev.exp + expGain,
        mindDemon: Math.max(0, prev.mindDemon - demonPurge),
        totalDualCultivations: (prev.totalDualCultivations || 0) + 1,
        companions: {
          ...prev.companions,
          [companionId]: updatedComp
        }
      };
    });

    addLog(`【紅塵雙修】與【${comp.name}】於洞府靈泉合席入定，真陽與元陰交融！獲得 +${expGain} 修為，斬除 ${demonPurge} 點心魔，情意好感 +25！`, 'companion');
  };

  const handleGiftCompanion = (companionId: string, giftType: 'stone' | 'herb' | 'pill') => {
    const comp = player.companions[companionId];
    if (!comp || !comp.unlocked) return;

    if (giftType === 'herb') {
      if ((player.herb || 0) < 2) {
        addLog('靈草儲量不足 2 株，無法贈予道侶！', 'battle');
        return;
      }
      sound.playPurify();
      setPlayer(prev => ({
        ...prev,
        herb: prev.herb - 2,
        companions: {
          ...prev.companions,
          [companionId]: {
            ...comp,
            favor: Math.min(1000, comp.favor + 30)
          }
        }
      }));
      addLog(`【贈禮修好】贈送 2 株九葉雪芝予【${comp.name}】。佳人笑靨如花，好感度 +30！`, 'companion');
    }
  };

  const handleSetActiveCompanion = (companionId: string) => {
    const comp = player.companions[companionId];
    if (!comp || !comp.unlocked) return;
    sound.playEquip();
    setPlayer(prev => ({
      ...prev,
      activeCompanionId: companionId
    }));
    addLog(`【道侶同行】已指定【${comp.name}】（${comp.title}）結伴同行出戰，歷練時將釋放連攜神通【${comp.battleSkillName}】！`, 'companion');
  };

  // ================= 仙盟系統 =================
  const handleJoinAlliance = (allianceName: string) => {
    sound.playBreakthroughSuccess();
    setPlayer(prev => ({
      ...prev,
      alliance: {
        ...prev.alliance,
        joined: true,
        name: allianceName,
        role: '成員',
        contribution: (prev.alliance?.contribution || 0) + 50
      }
    }));
    addLog(`【叩問盟約】你已正式加入九州仙盟【${allianceName}】！共用地下靈脈與仙盟心法，同道齊心問道長生！`, 'alliance');
  };

  const handleCreateAlliance = (name: string) => {
    if (player.stone < 300) {
      addLog('靈石不足 300，難以奠定仙盟基石！', 'battle');
      return;
    }
    sound.playBreakthroughSuccess();
    setPlayer(prev => ({
      ...prev,
      stone: prev.stone - 300,
      alliance: {
        ...prev.alliance,
        joined: true,
        name,
        level: 1,
        role: '盟主',
        contribution: 200,
        membersCount: 1,
        maxMembers: 50,
        mineVeinLevel: 1,
        mineReserves: { stones: 120, ores: 2, rareJades: 1 },
        lastMineClaimTime: 0,
        sutras: { 'sutra_taixu_rate': 1 },
        hegemonyScore: 0,
        lastHegemonyBattleTime: 0
      }
    }));
    addLog(`【開闢仙盟】道友立下宏願，消耗 300 靈石於九州名山創立【${name}】！自封盟主，廣開山門納四方散修！`, 'alliance');
  };

  const handleLeaveAlliance = () => {
    sound.playThunder();
    setPlayer(prev => ({
      ...prev,
      alliance: {
        ...prev.alliance,
        joined: false,
        role: '成員'
      }
    }));
    addLog(`【脫離仙盟】你已繳回仙盟令牌，脫離【${player.alliance?.name || '仙盟'}】重歸逍遙散修。`, 'world');
  };

  const handleCheckInAlliance = () => {
    sound.playLoot();
    setPlayer(prev => ({
      ...prev,
      alliance: {
        ...prev.alliance,
        contribution: (prev.alliance?.contribution || 0) + 50
      }
    }));
    addLog('【仙盟簽到】於仙盟總舵大殿焚香敬告歷代祖師，獲贈 50 點仙盟貢獻！', 'alliance');
  };

  const handleInfuseMineVein = () => {
    if (player.qi < 120) {
      addLog('聚靈池靈氣不足 120 點，難以引動地脈共振！', 'battle');
      return;
    }
    sound.playPurify();
    setPlayer(prev => ({
      ...prev,
      qi: prev.qi - 120,
      alliance: {
        ...prev.alliance,
        contribution: (prev.alliance?.contribution || 0) + 40,
        mineReserves: {
          ...prev.alliance.mineReserves,
          stones: (prev.alliance.mineReserves?.stones || 0) + 80
        }
      }
    }));
    addLog('【靈氣淬脈】引氣海純陽靈氣淬鍊仙盟地下靈脈，靈脈蓄氣大漲，獲得 +40 仙盟貢獻！', 'alliance');
  };

  const handleClaimMineDividend = () => {
    const reserves = player.alliance?.mineReserves;
    if (!reserves || (reserves.stones <= 0 && reserves.ores <= 0 && reserves.rareJades <= 0)) {
      addLog('共有靈脈中暫無富餘礦藏可供分配。', 'world');
      return;
    }
    sound.playLoot();
    const stones = reserves.stones || 0;
    const ores = reserves.ores || 0;
    const rareJades = reserves.rareJades || 0;

    setPlayer(prev => {
      const nextInv = { ...prev.inventory };
      if (ores > 0) nextInv['mat_hantie'] = (nextInv['mat_hantie'] || 0) + ores;
      if (rareJades > 0) nextInv['mat_wenyu'] = (nextInv['mat_wenyu'] || 0) + rareJades;

      return {
        ...prev,
        stone: prev.stone + stones,
        inventory: nextInv,
        alliance: {
          ...prev.alliance,
          lastMineClaimTime: Date.now(),
          mineReserves: { stones: 0, ores: 0, rareJades: 0 }
        }
      };
    });
    addLog(`【靈礦分紅】自仙盟共有地下靈脈領取今日配額：獲得 +${stones} 靈石、萬載寒鐵 +${ores} 塊、萬年溫玉 +${rareJades} 塊！`, 'gain');
  };

  const handleFightHegemony = (battlefield: HegemonyBattlefield) => {
    let effectiveAtk = player.atk;
    let effectiveDef = player.def;

    if (player.equipped?.weapon) {
      const w = EQUIPMENT_LIST.find(e => e.id === player.equipped.weapon);
      if (w) effectiveAtk += w.atkBonus;
    }
    if (player.equipped?.armor) {
      const a = EQUIPMENT_LIST.find(e => e.id === player.equipped.armor);
      if (a) effectiveDef += a.defBonus;
    }
    if (player.equipped?.artifact) {
      const art = EQUIPMENT_LIST.find(e => e.id === player.equipped.artifact);
      if (art) {
        effectiveAtk += art.atkBonus;
        effectiveDef += art.defBonus;
      }
    }

    // Alliance Sutra: 萬道歸一戰陣典 (ATK bonus)
    const wandaoLv = player.alliance?.sutras?.['sutra_wandao_battle'] || 0;
    effectiveAtk += wandaoLv * 25;

    // Alliance Sutra: 乾坤同氣化神訣 (DEF bonus)
    const taiyiLv = player.alliance?.sutras?.['sutra_taiyi_defense'] || 0;
    effectiveDef += taiyiLv * 20;

    // Active companion synergy trigger
    const comp = player.activeCompanionId ? player.companions[player.activeCompanionId] : null;
    let compMsg = '';
    if (comp && comp.unlocked) {
      sound.playCompanionSkill();
      if (comp.id === 'cp_nangong') {
        effectiveAtk = Math.round(effectiveAtk * 1.5);
        compMsg = `【道侶連攜】南宮婉聯袂祭出【青元霜刃連攜斬】，青芒如瀑，攻擊力狂增 50%！`;
      } else if (comp.id === 'cp_yanruyan') {
        effectiveAtk = Math.round(effectiveAtk * 1.6);
        compMsg = `【道侶連攜】燕如嫣煞氣貫霄【幽冥噬血絕滅刺】，削弱神煞魔甲，引發致命暴擊！`;
      } else if (comp.id === 'cp_ziling') {
        effectiveDef = Math.round(effectiveDef * 1.4);
        compMsg = `【道侶連攜】紫菱拂動【回春甘露仙雨】，靈盾護體，防禦力暴增 40%！`;
      } else if (comp.id === 'cp_yinyue') {
        effectiveAtk = Math.round(effectiveAtk * 1.3);
        effectiveDef = Math.round(effectiveDef * 1.3);
        compMsg = `【道侶連攜】銀月展開【天狐惑心靈甲】，攻防一體，全真威能澎湃！`;
      }
    }

    if (compMsg) addLog(compMsg, 'companion');

    sound.playSwordStrike();
    addLog(`【爭霸交鋒】率領仙盟戰旗殺入【${battlefield.name}】！正面迎戰守護神煞【${battlefield.guardianName}】...`, 'alliance');

    const totalPower = effectiveAtk * 10 + effectiveDef * 6;
    const reqPower = battlefield.guardianHp + battlefield.guardianAtk * 8;
    const isWin = totalPower >= reqPower;

    // Helper to calculate new weekly history record for 今日
    const getUpdatedHistory = (win: boolean, contribGain: number) => {
      const hist = player.alliance?.hegemonyWeeklyHistory && player.alliance.hegemonyWeeklyHistory.length > 0
        ? [...player.alliance.hegemonyWeeklyHistory]
        : [...DEFAULT_HEGEMONY_WEEKLY_HISTORY];
      
      const todayIdx = hist.findIndex(h => h.dayLabel === '今日');
      if (todayIdx >= 0) {
        const today = hist[todayIdx];
        const newBattles = today.battles + 1;
        const newWins = today.wins + (win ? 1 : 0);
        const newLosses = today.losses + (win ? 0 : 1);
        const newRate = Math.round((newWins / newBattles) * 100);
        const newContrib = today.contributionEarned + contribGain;
        const prevCumulative = todayIdx > 0 ? hist[todayIdx - 1].cumulativeContribution : 0;
        hist[todayIdx] = {
          ...today,
          battles: newBattles,
          wins: newWins,
          losses: newLosses,
          winRate: newRate,
          contributionEarned: newContrib,
          cumulativeContribution: prevCumulative + newContrib
        };
      }
      return hist;
    };

    if (isWin) {
      sound.playBreakthroughSuccess();
      setPlayer(prev => ({
        ...prev,
        stone: prev.stone + battlefield.rewardStones,
        totalHegemonyBattles: (prev.totalHegemonyBattles || 0) + 1,
        alliance: {
          ...prev.alliance,
          contribution: (prev.alliance?.contribution || 0) + battlefield.rewardContribution,
          hegemonyScore: (prev.alliance?.hegemonyScore || 0) + battlefield.level * 100,
          lastHegemonyBattleTime: Date.now(),
          hegemonyWeeklyHistory: getUpdatedHistory(true, battlefield.rewardContribution)
        }
      }));
      addLog(`【爭霸大捷】道法通天！道友斬落【${battlefield.guardianName}】，為仙盟插上戰旗佔領靈脈！掠得 +${battlefield.rewardStones} 靈石與 +${battlefield.rewardContribution} 仙盟貢獻，仙盟爭霸戰功 +${battlefield.level * 100}！`, 'break');
    } else {
      sound.playThunder();
      setPlayer(prev => ({
        ...prev,
        mindDemon: Math.min(100, prev.mindDemon + 8),
        hpCurrent: Math.max(20, Math.floor(prev.hpMax * 0.4)),
        totalHegemonyBattles: (prev.totalHegemonyBattles || 0) + 1,
        alliance: {
          ...prev.alliance,
          lastHegemonyBattleTime: Date.now(),
          hegemonyWeeklyHistory: getUpdatedHistory(false, 0)
        }
      }));
      addLog(`【爭霸受挫】守護神煞【${battlefield.guardianName}】威能滔天（戰力不足），道友負傷遁退，心魔滋生 8 點！可研習仙盟心法或鍛造法寶後再來戰！`, 'battle');
    }
  };

  const handleUpgradeSutra = (sutraId: string) => {
    const sutra = ALLIANCE_SUTRAS_CONFIG.find(s => s.id === sutraId);
    if (!sutra) return;
    const currentLv = player.alliance?.sutras?.[sutraId] || 0;
    if (currentLv >= sutra.maxLevel) return;

    const cost = Math.floor(sutra.costBase * Math.pow(sutra.costMult, currentLv));
    if ((player.alliance?.contribution || 0) < cost) {
      addLog('仙盟貢獻點不足，難以參悟更深層仙盟心法！可每日簽到或爭霸累積貢獻。', 'battle');
      return;
    }

    sound.playBreakthroughSuccess();
    setPlayer(prev => ({
      ...prev,
      alliance: {
        ...prev.alliance,
        contribution: prev.alliance.contribution - cost,
        sutras: {
          ...prev.alliance.sutras,
          [sutraId]: currentLv + 1
        }
      }
    }));
    addLog(`【心法精進】消耗 ${cost} 點仙盟貢獻，共享心法【${sutra.name}】突破至 Lv.${currentLv + 1}！全盟同獲天道加成！`, 'alliance');
  };

  // ================= 煉丹房系統 =================
  const handleCraftDan = (recipe: DanRecipe) => {
    if (player.alchemyLevel < recipe.reqAlchemyLevel) {
      addLog(`丹道造詣不足，需達到【${ALCHEMY_TITLES[recipe.reqAlchemyLevel]}】方可開爐！`, 'battle');
      return;
    }
    if (player.stone < recipe.stoneCost || player.qi < recipe.qiCost) {
      addLog('靈石或靈氣儲備不足，難以引動地火起鼎！', 'battle');
      return;
    }

    for (const m of recipe.materials) {
      const currentCount = player.inventory[m.itemId] || (m.itemId === 'herb_lingcao' ? player.herb : 0);
      if (currentCount < m.count) {
        addLog('缺少關鍵靈藥配伍，無法開爐煉丹！', 'battle');
        return;
      }
    }

    const nextInv = { ...player.inventory };
    let newHerb = player.herb;

    recipe.materials.forEach(m => {
      if (m.itemId === 'herb_lingcao') {
        newHerb = Math.max(0, newHerb - m.count);
      }
      nextInv[m.itemId] = Math.max(0, (nextInv[m.itemId] || 0) - m.count);
    });

    const successChance = Math.min(100, recipe.successRate + player.alchemyLevel * 3);
    const roll = Math.random() * 100;
    const isSuccess = roll <= successChance;

    if (isSuccess) {
      const isDouble = Math.random() < 0.18;
      const countProduced = isDouble ? 2 : 1;
      nextInv[recipe.produceItemId] = (nextInv[recipe.produceItemId] || 0) + countProduced;

      sound.playAlchemySuccess();
      const producedItem = INVENTORY_ITEMS.find(i => i.id === recipe.produceItemId);

      const newExp = player.alchemyExp + recipe.masteryGain;
      const reqNextExp = player.alchemyLevel * 120;
      let newLevel = player.alchemyLevel;
      let expRemainder = newExp;

      if (newExp >= reqNextExp && newLevel < 5) {
        newLevel += 1;
        expRemainder = newExp - reqNextExp;
        addLog(`【丹道精進】丹韻大成！你的丹道造詣突破至【${ALCHEMY_TITLES[newLevel]}】！`, 'break');
      }

      setPlayer(prev => ({
        ...prev,
        stone: prev.stone - recipe.stoneCost,
        qi: prev.qi - recipe.qiCost,
        herb: newHerb,
        inventory: nextInv,
        alchemyExp: expRemainder,
        alchemyLevel: newLevel,
        totalPillsCrafted: (prev.totalPillsCrafted || 0) + countProduced
      }));

      addLog(
        `【開爐成丹】地火靈鼎霞光萬道，成功煉得 ${countProduced} 枚【${producedItem?.name || '極品靈丹'}】！${isDouble ? '（祥瑞降臨，一爐雙丹！）' : ''}`,
        'craft'
      );
    } else {
      sound.playThunder();
      setPlayer(prev => ({
        ...prev,
        stone: prev.stone - recipe.stoneCost,
        qi: prev.qi - recipe.qiCost,
        herb: newHerb,
        inventory: nextInv,
        alchemyExp: prev.alchemyExp + Math.floor(recipe.masteryGain / 3)
      }));
      addLog(`【地火失控】爐溫未控引發爆鼎，藥材化為焦炭！吸取教訓獲得少量丹道經驗。`, 'battle');
    }
  };

  // ================= 煉器閣系統 =================
  const handleForgeEquipment = (recipe: ForgeRecipe) => {
    if (player.forgeLevel < recipe.reqForgeLevel) {
      addLog(`器道造詣不足，需達到【${FORGE_TITLES[recipe.reqForgeLevel]}】方可開爐鍛造！`, 'battle');
      return;
    }
    if (player.stone < recipe.stoneCost || player.qi < recipe.qiCost) {
      addLog('靈石或靈氣儲備不足，無法催動熔爐真火！', 'battle');
      return;
    }

    for (const m of recipe.materials) {
      const currentCount = player.inventory[m.itemId] || (m.itemId === 'herb_lingcao' ? player.herb : 0);
      if (currentCount < m.count) {
        addLog('缺少關鍵靈材精金，無法鍛造神兵！', 'battle');
        return;
      }
    }

    const nextInv = { ...player.inventory };
    let newHerb = player.herb;

    recipe.materials.forEach(m => {
      if (m.itemId === 'herb_lingcao') {
        newHerb = Math.max(0, newHerb - m.count);
      }
      nextInv[m.itemId] = Math.max(0, (nextInv[m.itemId] || 0) - m.count);
    });

    const successChance = Math.min(100, recipe.successRate + player.forgeLevel * 3);
    const roll = Math.random() * 100;
    const isSuccess = roll <= successChance;

    if (isSuccess) {
      nextInv[recipe.targetEquipId] = (nextInv[recipe.targetEquipId] || 0) + 1;
      sound.playForgeHammer();
      const targetEquip = EQUIPMENT_LIST.find(e => e.id === recipe.targetEquipId);

      const newExp = player.forgeExp + recipe.masteryGain;
      const reqNextExp = player.forgeLevel * 120;
      let newLevel = player.forgeLevel;
      let expRemainder = newExp;

      if (newExp >= reqNextExp && newLevel < 5) {
        newLevel += 1;
        expRemainder = newExp - reqNextExp;
        addLog(`【器道大進】千錘百煉！你的煉器造詣突破至【${FORGE_TITLES[newLevel]}】！`, 'break');
      }

      setPlayer(prev => ({
        ...prev,
        stone: prev.stone - recipe.stoneCost,
        qi: prev.qi - recipe.qiCost,
        herb: newHerb,
        inventory: nextInv,
        forgeExp: expRemainder,
        forgeLevel: newLevel,
        totalArtifactsForged: (prev.totalArtifactsForged || 0) + 1
      }));

      addLog(`【神兵出世】三昧真火千錘百煉，成功鑄就【${targetEquip?.name || '至寶神兵'}】入儲物袋！`, 'craft');
    } else {
      sound.playThunder();
      setPlayer(prev => ({
        ...prev,
        stone: prev.stone - recipe.stoneCost,
        qi: prev.qi - recipe.qiCost,
        herb: newHerb,
        inventory: nextInv,
        forgeExp: prev.forgeExp + Math.floor(recipe.masteryGain / 3)
      }));
      addLog(`【鍛打受挫】火候不足，法寶器胚受熱不均碎裂！吸取教訓獲得少量器道經驗。`, 'battle');
    }
  };

  // Equip Item
  const handleEquipItem = (equipId: string) => {
    const item = EQUIPMENT_LIST.find(e => e.id === equipId);
    if (!item || (player.inventory[equipId] || 0) <= 0) return;

    sound.playEquip();
    setPlayer(prev => {
      const nextInv = { ...prev.inventory };
      const currentEquippedId = prev.equipped[item.slot];

      if (currentEquippedId) {
        nextInv[currentEquippedId] = (nextInv[currentEquippedId] || 0) + 1;
      }

      nextInv[equipId] = Math.max(0, (nextInv[equipId] || 0) - 1);

      return {
        ...prev,
        equipped: {
          ...prev.equipped,
          [item.slot]: equipId
        },
        inventory: nextInv
      };
    });

    addLog(`【祭煉法寶】你已成功祭煉佩戴【${item.name}】（${item.grade}）！全真威能護體！`, 'gain');
  };

  // Unequip Item
  const handleUnequipSlot = (slot: EquipSlot) => {
    const currentEquipId = player.equipped[slot];
    if (!currentEquipId) return;

    const item = EQUIPMENT_LIST.find(e => e.id === currentEquipId);
    sound.playEquip();
    setPlayer(prev => ({
      ...prev,
      equipped: {
        ...prev.equipped,
        [slot]: null
      },
      inventory: {
        ...prev.inventory,
        [currentEquipId]: (prev.inventory[currentEquipId] || 0) + 1
      }
    }));

    addLog(`【法寶歸鞘】已將【${item?.name || '法寶'}】收歸隨身儲物袋中。`, 'world');
  };

  // Adventure: Start
  const handleStartAdventure = (mapId: number) => {
    const map = MAPS.find(m => m.id === mapId);
    if (!map) return;
    setPlayer(prev => ({
      ...prev,
      currentMapId: mapId,
      adventureStep: 0,
      isAutoRoaming: false,
      activeEvent: null
    }));
    addLog(`腳踩飛劍，你飄然降臨於【${map.name}】前沿禁制外圍...`, 'event');
  };

  // Adventure: Cancel
  const handleCancelAdventure = () => {
    setPlayer(prev => ({
      ...prev,
      currentMapId: null,
      adventureStep: 0,
      isAutoRoaming: false,
      activeEvent: null
    }));
    addLog('遁光一閃，你已回防自家洞府靜室。', 'event');
  };

  // Adventure: Toggle Auto Roam
  const handleToggleAutoRoam = () => {
    setPlayer(prev => {
      const nextRoaming = !prev.isAutoRoaming;
      if (nextRoaming) {
        addLog('祭出出竅神識，修士進入【神遊太虛】自動探索狀態...', 'event');
      } else {
        addLog('收攝神念，暫停自動神遊探索。', 'event');
      }
      return { ...prev, isAutoRoaming: nextRoaming };
    });
  };

  // Adventure: Take Step
  const handleTakeStep = () => {
    if (!player.currentMapId || player.activeEvent) return;
    const map = MAPS.find(m => m.id === player.currentMapId);
    if (!map) return;

    const nextStep = player.adventureStep + 1;
    const isFinalStep = nextStep >= map.steps;

    // Check random encounter event (22% chance if not final step)
    if (!isFinalStep && Math.random() < 0.22) {
      const randomEvent = ADVENTURE_RANDOM_EVENTS[Math.floor(Math.random() * ADVENTURE_RANDOM_EVENTS.length)];
      sound.playEncounter();
      setPlayer(prev => ({
        ...prev,
        adventureStep: nextStep,
        isAutoRoaming: false,
        activeEvent: randomEvent
      }));
      addLog(`第 ${nextStep} 步【奇遇觸發】：${randomEvent.title}！道友停下腳步凝神觀瞧...`, 'event');
      return;
    }

    const events = ['monster', 'treasure', 'grass', 'empty'];
    const ev = isFinalStep ? 'boss' : events[Math.floor(Math.random() * events.length)];

    let stoneGained = 0;
    let expGained = 0;
    let demonChange = 0;
    const itemDrops: Record<string, number> = {};

    let effectiveAtk = player.atk;
    if (player.equipped?.weapon) {
      const w = EQUIPMENT_LIST.find(e => e.id === player.equipped.weapon);
      if (w) effectiveAtk += w.atkBonus;
    }

    // Companion Combat Synergy Skill triggers!
    let companionSynergyDesc = '';
    const comp = player.activeCompanionId ? player.companions[player.activeCompanionId] : null;
    if (comp && comp.unlocked && (ev === 'monster' || ev === 'boss')) {
      sound.playCompanionSkill();
      if (comp.id === 'cp_nangong') {
        effectiveAtk += Math.round(effectiveAtk * (comp.battleSkillValue / 100));
        companionSynergyDesc = `【道侶連攜】南宮婉祭出【青元霜刃連攜斬】，青芒如瀑，攻擊力狂增 120%！`;
      } else if (comp.id === 'cp_ziling') {
        player.hpCurrent = Math.min(player.hpMax, player.hpCurrent + comp.battleSkillValue);
        demonChange = Math.max(0, demonChange - 15);
        companionSynergyDesc = `【道侶連攜】紫菱拂動【回春甘露仙雨】，氣血恢復 +220，並滌蕩 15 點心魔！`;
      } else if (comp.id === 'cp_yanruyan') {
        effectiveAtk = Math.round(effectiveAtk * 1.45);
        companionSynergyDesc = `【道侶連攜】燕如嫣煞氣貫霄【幽冥噬血絕滅刺】，削弱敵甲，必中致命暴擊！`;
      } else if (comp.id === 'cp_yinyue') {
        companionSynergyDesc = `【道侶連攜】銀月展開【天狐惑心靈甲】，迷惑妖獸心智，化解反噬！`;
      }
    }

    if (ev === 'boss') {
      sound.playSwordStrike();
      if (companionSynergyDesc) addLog(companionSynergyDesc, 'companion');
      addLog(`第 ${nextStep} 步【禁地核心】：遭遇禁地霸主【${map.bossName}】！劍氣縱橫三千丈！`, 'battle');
      if (effectiveAtk >= map.minAtk) {
        stoneGained = map.stoneReward * 2;
        expGained = map.expReward * 2;
        itemDrops['monster_dan'] = 2;
        itemDrops['mat_chitong'] = 2;
        itemDrops['herb_chiyang'] = 1;
        sound.playBreakthroughSuccess();
        addLog(`【斬殺霸主】道友施展通天劍訣斬落【${map.bossName}】！收穫 ${stoneGained} 靈石與稀有妖丹精金，歷練圓滿！`, 'break');
      } else {
        demonChange = comp?.id === 'cp_yinyue' ? 0 : 8;
        sound.playThunder();
        addLog(`霸主兇威滔天！道友戰力微遜負傷退走，心魔激盪增長 ${demonChange} 點！平安遁回洞府。`, 'battle');
      }
    } else if (ev === 'monster') {
      sound.playSwordStrike();
      if (companionSynergyDesc) addLog(companionSynergyDesc, 'companion');
      addLog(`第 ${nextStep} 步：遭遇盤踞禁地的【${map.enemyName}】！祭出本命靈光交鋒...`, 'battle');
      if (effectiveAtk >= map.minAtk * 0.8) {
        stoneGained = Math.floor(map.stoneReward / map.steps * 1.5) + 6;
        itemDrops['monster_dan'] = 1;
        if (Math.random() < 0.45) itemDrops['mat_hantie'] = 1;
        if (Math.random() < 0.25) itemDrops['herb_chiyang'] = 1;
        sound.playLoot();
        addLog(`劍影紛飛，妖獸授首！斬獲伴生妖丹與 +${stoneGained} 靈石！`, 'gain');
      } else {
        demonChange = comp?.id === 'cp_yinyue' ? 0 : 4;
        sound.playThunder();
        addLog(`妖氣磅礴！你略處下風負傷遁走，心魔增長 ${demonChange} 點！`, 'battle');
      }
    } else if (ev === 'treasure') {
      stoneGained = Math.floor(map.stoneReward / map.steps * 2) + 15;
      if (Math.random() < 0.5) itemDrops['mat_hantie'] = 1;
      if (Math.random() < 0.3) itemDrops['pill_zhuji'] = 1;
      sound.playLoot();
      addLog(`第 ${nextStep} 步：於古修士遺骸前拾得遺落儲物袋，得 +${stoneGained} 靈石與上古礦石！`, 'gain');
    } else if (ev === 'grass') {
      expGained = map.expReward;
      itemDrops['herb_lingcao'] = 1;
      if (Math.random() < 0.3) itemDrops['herb_chiyang'] = 1;
      sound.playPurify();
      addLog(`第 ${nextStep} 步：偶採得一株九葉雪芝，服食轉化 +${expGained} 修為並存儲入袋！`, 'gain');
    } else {
      addLog(`第 ${nextStep} 步：雲煙浩渺，四周唯有松濤陣陣，心神空靈穿行。`, 'world');
    }

    setPlayer(prev => {
      const nextInv = { ...prev.inventory };
      for (const [k, v] of Object.entries(itemDrops)) {
        nextInv[k] = (nextInv[k] || 0) + v;
      }

      if (isFinalStep) {
        return {
          ...prev,
          stone: prev.stone + stoneGained,
          exp: prev.exp + expGained,
          herb: (prev.herb || 0) + (itemDrops['herb_lingcao'] || 0),
          mindDemon: Math.min(100, prev.mindDemon + demonChange),
          currentMapId: null,
          adventureStep: 0,
          isAutoRoaming: false,
          activeEvent: null,
          inventory: nextInv
        };
      } else {
        return {
          ...prev,
          stone: prev.stone + stoneGained,
          exp: prev.exp + expGained,
          herb: (prev.herb || 0) + (itemDrops['herb_lingcao'] || 0),
          mindDemon: Math.min(100, prev.mindDemon + demonChange),
          adventureStep: nextStep,
          inventory: nextInv
        };
      }
    });
  };

  // Resolve Random Adventure Choice
  const handleResolveEventChoice = (eventId: string, actionId: string) => {
    sound.playPurify();

    setPlayer(prev => {
      const nextInv = { ...prev.inventory };
      const nextComps = { ...prev.companions };
      let newStone = prev.stone;
      let newExp = prev.exp;
      let newDemon = prev.mindDemon;
      let newQi = prev.qi;
      let newAtk = prev.atk;
      let newHp = prev.hpMax;

      if (actionId === 'master_advice') {
        if (newStone >= 50) {
          newStone -= 50;
          newExp += 1200;
          nextInv['pill_zaohua'] = (nextInv['pill_zaohua'] || 0) + 1;
          addLog('【得道指點】高人拈鬚微笑，微啟朱唇傳授大道真言！頓悟獲得 +1200 修為與一枚【乾坤造化丹】！', 'break');
        } else {
          addLog('囊中羞澀無靈石敬奉，老者搖頭隱入薄霧中。', 'world');
        }
      } else if (actionId === 'master_sword') {
        newAtk += 15;
        addLog('【劍意共鳴】於老叟身畔默察劍意，忽感無形劍氣透體而過，攻擊力永久 +15！', 'gain');
      } else if (actionId === 'master_leave') {
        addLog('你恭敬朝前輩躬身一禮，飄然遠去，道心安詳平靜。', 'world');
      } else if (actionId === 'relic_force') {
        if (prev.atk >= 50) {
          newStone += 350;
          nextInv['mat_hantie'] = (nextInv['mat_hantie'] || 0) + 2;
          nextInv['monster_dan'] = (nextInv['monster_dan'] || 0) + 2;
          addLog('【巨力碎石】飛劍長嘯破開石門禁制！搜得 350 靈石、寒鐵石 2 塊與妖丹 2 枚！', 'gain');
        } else {
          newDemon = Math.min(100, newDemon + 6);
          addLog('石室禁制反震！道友修為尚淺未能破門，反被禁制煞氣侵染，心魔 +6！', 'battle');
        }
      } else if (actionId === 'relic_qi') {
        if (newQi >= 80) {
          newQi -= 80;
          nextInv['mat_wujin'] = (nextInv['mat_wujin'] || 0) + 2;
          nextInv['pill_pozhange'] = (nextInv['pill_pozhange'] || 0) + 1;
          addLog('【巧破靈陣】以純陽真氣梳理陣紋，安然開門！獲取烏金玄鐵 2 塊與【金丹破障丹】1 枚！', 'gain');
        } else {
          addLog('靈池真元不足 80 點，難以推演破陣樞紐。', 'world');
        }
      } else if (actionId === 'relic_bypass') {
        addLog('行事謹慎為仙家第一要義，你繞過古陣密室從容前行。', 'world');
      } else if (actionId === 'spring_bathe') {
        newDemon = 0;
        newExp += 500;
        newHp += 80;
        addLog('【靈泉濯垢】浸泡入千年洗髓靈泉，周身污濁盡去！心魔完全清空歸零，氣血 +80，修為 +500！', 'gain');
      } else if (actionId === 'spring_bottle') {
        nextInv['spirit_drop'] = (nextInv['spirit_drop'] || 0) + 1;
        addLog('取出青玉葫蘆灌滿靈泉，獲得 1 枚【乾坤聚靈髓】！', 'gain');
      } else if (actionId === 'bandit_fight') {
        newStone += 160;
        nextInv['mat_hantie'] = (nextInv['mat_hantie'] || 0) + 2;
        nextInv['monster_dan'] = (nextInv['monster_dan'] || 0) + 1;
        sound.playSwordStrike();
        addLog('【伏魔斬惡】飛劍縱橫如匹練，將三名魔修斬於馬下！繳獲 160 靈石與玄金煉器材料！', 'break');
      } else if (actionId === 'bandit_flee') {
        addLog('施展血光遁術飄出數十里，安全避開魔修糾纏。', 'world');
      } else if (actionId === 'dying_save') {
        if ((nextInv['pill_qingxin'] || 0) > 0) {
          nextInv['pill_qingxin'] -= 1;
          nextInv['mat_wujin'] = (nextInv['mat_wujin'] || 0) + 3;
          nextInv['mat_wenyu'] = (nextInv['mat_wenyu'] || 0) + 1;
          addLog('【濟世善果】名門真傳弟子服丹醒轉，泣謝救命之恩，贈予傳家【烏金玄鐵 3 塊、萬年溫玉 1 塊】報答！', 'gain');
        } else {
          addLog('儲物袋中並無【清心玉露丹】，只得扼腕嘆息無法搭救。', 'world');
        }
      } else if (actionId === 'dying_loot') {
        newStone += 220;
        newDemon = Math.min(100, newDemon + 18);
        nextInv['mat_hantie'] = (nextInv['mat_hantie'] || 0) + 2;
        addLog('【掠奪生靈】趁其瀕死搜刮其儲物袋，奪得 220 靈石與寒鐵，但違背道心，紫府心魔激增 18 點！', 'demon');
      } else if (actionId === 'dying_ignore') {
        addLog('天道輪迴生死有命，你合十默然離去。', 'world');
      } else if (actionId === 'companion_ziling_accept') {
        if (nextComps.cp_ziling) {
          nextComps.cp_ziling = { ...nextComps.cp_ziling, unlocked: true, favor: 60 };
        }
        addLog('【紅塵結緣】你與百草小醫仙【紫菱】互換靈符，結為仙道紅塵知己！可在【紅塵道侶】閣雙修同行！', 'companion');
      } else if (actionId === 'companion_ziling_decline') {
        addLog('你婉言謝絕少女之請，飄然而去。', 'world');
      } else if (actionId === 'companion_yanruyan_accept') {
        if (newQi >= 50) {
          newQi -= 50;
          if (nextComps.cp_yanruyan) {
            nextComps.cp_yanruyan = { ...nextComps.cp_yanruyan, unlocked: true, favor: 60 };
          }
          addLog('【魔道締約】你運轉純陽真元為天魔聖女【燕如嫣】驅除魔煞！魔姬神色動容，誓與你結伴同行！', 'companion');
        } else {
          addLog('真元靈氣不足 50 點，無力替魔姬化煞。', 'world');
        }
      } else if (actionId === 'companion_yanruyan_decline') {
        addLog('魔道詭詐，你戒備抽身遠遁。', 'world');
      } else if (actionId === 'companion_yinyue_accept') {
        if (nextComps.cp_yinyue) {
          nextComps.cp_yinyue = { ...nextComps.cp_yinyue, unlocked: true, favor: 80 };
        }
        addLog('【天狐伴身】天狐仙姬【銀月】化作一縷銀光入住你的識海，嬌笑著承諾與恩公永結同心！', 'companion');
      } else if (actionId === 'companion_yinyue_decline') {
        addLog('人妖殊途，你謝絕白狐化身，合十別過。', 'world');
      }

      return {
        ...prev,
        stone: newStone,
        exp: newExp,
        mindDemon: newDemon,
        qi: newQi,
        atk: newAtk,
        hpMax: newHp,
        hpCurrent: newHp,
        inventory: nextInv,
        companions: nextComps,
        activeEvent: null
      };
    });
  };

  // Try Ascend to 33 Heavens
  const handleTryAscend = () => {
    if (player.realmIdx < 10) return;
    sound.playBreakthroughSuccess();
    setTribulationInfo({
      isOpen: true,
      isAscension: true,
      realmName: '三十三天仙界',
      isSuccess: true
    });
    setPlayer(prev => ({
      ...prev,
      ascended: true,
      stone: prev.stone + 1000,
      hpMax: prev.hpMax + 1000,
      hpCurrent: prev.hpMax + 1000,
      atk: prev.atk + 150,
      def: prev.def + 100
    }));
    addLog('==================================================', 'break');
    addLog('【天地同慶】劫雲散去，九天玄女撫琴，南天門訇然而開！', 'break');
    addLog('恭喜道友擺脫肉體凡胎，登臨浩渺仙界三十三天，成就仙道神話！', 'break');
    addLog('==================================================', 'break');
  };

  // Claim Heaven Salary
  const handleClaimHeavenSalary = () => {
    sound.playLoot();
    setPlayer(prev => ({
      ...prev,
      stone: prev.stone + 500,
      lastHeavenClaimTime: Date.now(),
      heavenClaimedDays: prev.heavenClaimedDays + 1
    }));
    addLog('【仙宮封賞】領取今日天界天俸：獲得 +500 靈石！', 'gain');
  };

  // Use Item
  const handleUseItem = (itemId: string) => {
    const item = INVENTORY_ITEMS.find(i => i.id === itemId);
    if (!item || (player.inventory[itemId] || 0) <= 0) return;

    sound.playPurify();
    setPlayer(prev => {
      const nextInv = { ...prev.inventory, [itemId]: prev.inventory[itemId] - 1 };
      let newExp = prev.exp;
      let newDemon = prev.mindDemon;
      let newQi = prev.qi;
      let newAtk = prev.atk;
      let newDef = prev.def;
      let newHp = prev.hpMax;

      if (item.effectType === 'exp') {
        newExp += item.effectValue;
        addLog(`服用【${item.name}】，磅礴靈力化開，直接吸收 +${item.effectValue} 點修為！`, 'gain');
      } else if (item.effectType === 'clearDemon') {
        newDemon = Math.max(0, newDemon - item.effectValue);
        addLog(`服用【${item.name}】，靈臺玉露洗滌識海，瞬間斬除 ${item.effectValue} 點心魔！`, 'demon');
      } else if (item.effectType === 'qi') {
        newQi = Math.min(prev.qiMax, newQi + item.effectValue);
        addLog(`灌入【${item.name}】，聚靈池靈光暴漲，充盈 +${item.effectValue} 靈氣！`, 'gain');
      } else if (item.effectType === 'permDef') {
        newDef += item.effectValue;
        newHp += 120;
        addLog(`服用【${item.name}】，仙骨生輝！【永久提升】防禦 +${item.effectValue}，氣血上限 +120！`, 'break');
      } else if (item.effectType === 'permAtk') {
        newAtk += item.effectValue;
        addLog(`服用【${item.name}】，真武煞氣凝練！【永久提升】攻擊力 +${item.effectValue}！`, 'break');
      } else if (item.effectType === 'permHp') {
        newHp += item.effectValue;
        addLog(`服用【${item.name}】，壽元悠長！【永久提升】氣血上限 +${item.effectValue}！`, 'break');
      }

      return {
        ...prev,
        exp: newExp,
        mindDemon: newDemon,
        qi: newQi,
        atk: newAtk,
        def: newDef,
        hpMax: newHp,
        hpCurrent: newHp,
        inventory: nextInv
      };
    });
  };

  const handleManualSave = () => {
    saveState(player);
    sound.playLoot();
    addLog('【天道烙印】當前修行身家與道境進度已完整銘刻保存！', 'world');
  };

  const handleResetGame = () => {
    clearSave();
    setPlayer({ ...INITIAL_PLAYER, lastOnlineTime: Date.now() });
    setLogs([
      {
        id: `${Date.now()}`,
        time: new Date().toTimeString().split(' ')[0],
        type: 'world',
        message: '【轉世重生】道友兵解重修，天地輪迴再啟，重新踏入凡人求仙之途...'
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] text-[#d8dee9] flex flex-col font-sans select-none antialiased">
      {/* Decorative misty mountain backdrop */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20 bg-cover bg-center mix-blend-screen"
        style={{ backgroundImage: `url(${bannerImg})` }}
      />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex-1 flex flex-col bg-[#141720]/95 border-x border-[#232938] shadow-2xl min-h-screen">
        {/* 最頂部製作銘文橫幅 */}
        <div className="w-full bg-gradient-to-r from-[#1a1410] via-[#2a1e16] to-[#1a1410] border-b border-amber-500/40 py-2 px-3 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-serif text-xs sm:text-sm font-bold tracking-widest text-[#f8e5b9] drop-shadow-md">
              吳永隆製作，2026。音聲禪院，南無無量音聲王國
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          </div>
        </div>

        {/* Top Header Stats */}
        <HeaderStats
          player={player}
          expPerTick={getExpPerTick()}
          qiPerSec={getQiPerSec()}
          onOpenSettings={() => setShowSettings(true)}
          onManualSave={handleManualSave}
          isMuted={isMuted}
          onToggleMute={() => {
            const nextMuted = !isMuted;
            setIsMuted(nextMuted);
            sound.setMuted(nextMuted);
          }}
        />

        {/* Navigation Tabs */}
        <nav className="flex bg-[#0f1118] border-b border-[#252b39] overflow-x-auto text-xs sm:text-sm font-serif">
          <button
            onClick={() => setActiveTab('xiulian')}
            className={`flex-1 py-3 px-2 sm:px-3 text-center whitespace-nowrap transition cursor-pointer border-b-2 ${
              activeTab === 'xiulian'
                ? 'border-amber-400 text-amber-300 bg-amber-950/20 font-bold'
                : 'border-transparent text-[#7e8ba0] hover:text-[#c4cedd]'
            }`}
          >
            修真本體
          </button>
          <button
            onClick={() => setActiveTab('dongfu')}
            className={`flex-1 py-3 px-2 sm:px-3 text-center whitespace-nowrap transition cursor-pointer border-b-2 ${
              activeTab === 'dongfu'
                ? 'border-amber-400 text-amber-300 bg-amber-950/20 font-bold'
                : 'border-transparent text-[#7e8ba0] hover:text-[#c4cedd]'
            }`}
          >
            洞府聚靈
          </button>
          <button
            onClick={() => setActiveTab('sect')}
            className={`flex-1 py-3 px-2 sm:px-3 text-center whitespace-nowrap transition cursor-pointer border-b-2 ${
              activeTab === 'sect'
                ? 'border-amber-400 text-amber-300 bg-amber-950/20 font-bold'
                : 'border-transparent text-[#7e8ba0] hover:text-[#c4cedd]'
            }`}
          >
            宗門建設
          </button>
          <button
            onClick={() => setActiveTab('companion')}
            className={`flex-1 py-3 px-2 sm:px-3 text-center whitespace-nowrap transition cursor-pointer border-b-2 ${
              activeTab === 'companion'
                ? 'border-rose-400 text-rose-300 bg-rose-950/20 font-bold'
                : 'border-transparent text-[#7e8ba0] hover:text-[#c4cedd]'
            }`}
          >
            紅塵道侶
          </button>
          <button
            onClick={() => setActiveTab('alliance')}
            className={`flex-1 py-3 px-2 sm:px-3 text-center whitespace-nowrap transition cursor-pointer border-b-2 ${
              activeTab === 'alliance'
                ? 'border-indigo-400 text-indigo-300 bg-indigo-950/20 font-bold'
                : 'border-transparent text-[#7e8ba0] hover:text-[#c4cedd]'
            }`}
          >
            諸天仙盟
          </button>
          <button
            onClick={() => setActiveTab('craft')}
            className={`flex-1 py-3 px-2 sm:px-3 text-center whitespace-nowrap transition cursor-pointer border-b-2 ${
              activeTab === 'craft'
                ? 'border-amber-400 text-amber-300 bg-amber-950/20 font-bold'
                : 'border-transparent text-[#7e8ba0] hover:text-[#c4cedd]'
            }`}
          >
            丹器百藝
          </button>
          <button
            onClick={() => setActiveTab('gongfa')}
            className={`flex-1 py-3 px-2 sm:px-3 text-center whitespace-nowrap transition cursor-pointer border-b-2 ${
              activeTab === 'gongfa'
                ? 'border-amber-400 text-amber-300 bg-amber-950/20 font-bold'
                : 'border-transparent text-[#7e8ba0] hover:text-[#c4cedd]'
            }`}
          >
            藏經閣
          </button>
          <button
            onClick={() => setActiveTab('lilian')}
            className={`flex-1 py-3 px-2 sm:px-3 text-center whitespace-nowrap transition cursor-pointer border-b-2 ${
              activeTab === 'lilian'
                ? 'border-amber-400 text-amber-300 bg-amber-950/20 font-bold'
                : 'border-transparent text-[#7e8ba0] hover:text-[#c4cedd]'
            }`}
          >
            人間歷練
          </button>
          <button
            onClick={() => setActiveTab('xianjie')}
            className={`flex-1 py-3 px-2 sm:px-3 text-center whitespace-nowrap transition cursor-pointer border-b-2 ${
              activeTab === 'xianjie'
                ? 'border-amber-400 text-amber-300 bg-amber-950/20 font-bold'
                : 'border-transparent text-[#7e8ba0] hover:text-[#c4cedd]'
            }`}
          >
            三十三天
          </button>
          <button
            onClick={() => setActiveTab('bag')}
            className={`flex-1 py-3 px-2 sm:px-3 text-center whitespace-nowrap transition cursor-pointer border-b-2 ${
              activeTab === 'bag'
                ? 'border-amber-400 text-amber-300 bg-amber-950/20 font-bold'
                : 'border-transparent text-[#7e8ba0] hover:text-[#c4cedd]'
            }`}
          >
            儲物袋
          </button>
        </nav>

        {/* Tab Content Window */}
        <main className="flex-1 p-3 sm:p-4 overflow-y-auto">
          {activeTab === 'xiulian' && (
            <CultivationTab
              player={player}
              reqExp={getRealmExpNeeded()}
              bodyCost={getBodyExpNeeded()}
              successRate={getSuccessRate()}
              expPerTick={getExpPerTick()}
              onAttemptBreakthrough={handleAttemptBreakthrough}
              onMeditateInstant={handleMeditateInstant}
              onQuenchedBody={handleQuenchedBody}
              onSlayMindDemon={handleSlayMindDemon}
              onUseItem={handleUseItem}
            />
          )}

          {activeTab === 'dongfu' && (
            <CaveAbodeTab
              player={player}
              qiPerSec={getQiPerSec()}
              arrayUpgradeCost={Math.floor(100 * Math.pow(1.6, player.spiritArrayLv - 1))}
              onUpgradeSpiritArray={handleUpgradeSpiritArray}
              onUpgradeRoot={handleUpgradeRoot}
              onHarvestHerbs={handleHarvestHerbs}
            />
          )}

          {activeTab === 'sect' && (
            <SectTab
              player={player}
              onUpgradeSect={handleUpgradeSect}
              onRecruitDisciple={handleRecruitDisciple}
              onOpenNewField={handleOpenNewField}
              onAssignDisciple={handleAssignDisciple}
              onCollectSectGains={handleCollectSectGains}
            />
          )}

          {activeTab === 'companion' && (
            <CompanionTab
              player={player}
              onDualCultivate={handleDualCultivate}
              onGiftCompanion={handleGiftCompanion}
              onSetActiveCompanion={handleSetActiveCompanion}
            />
          )}

          {activeTab === 'alliance' && (
            <AllianceTab
              player={player}
              onJoinAlliance={handleJoinAlliance}
              onCreateAlliance={handleCreateAlliance}
              onLeaveAlliance={handleLeaveAlliance}
              onCheckInAlliance={handleCheckInAlliance}
              onInfuseMineVein={handleInfuseMineVein}
              onClaimMineDividend={handleClaimMineDividend}
              onFightHegemony={handleFightHegemony}
              onUpgradeSutra={handleUpgradeSutra}
            />
          )}

          {activeTab === 'gongfa' && (
            <SectGongfaTab
              player={player}
              onLearnSkill={handleLearnSkill}
            />
          )}

          {activeTab === 'craft' && (
            <CraftTab
              player={player}
              onCraftDan={handleCraftDan}
              onForgeEquipment={handleForgeEquipment}
              onEquipItem={handleEquipItem}
              onUnequipSlot={handleUnequipSlot}
            />
          )}

          {activeTab === 'lilian' && (
            <AdventureTab
              player={player}
              onStartAdventure={handleStartAdventure}
              onTakeStep={handleTakeStep}
              onToggleAutoRoam={handleToggleAutoRoam}
              onCancelAdventure={handleCancelAdventure}
              onResolveEventChoice={handleResolveEventChoice}
            />
          )}

          {activeTab === 'xianjie' && (
            <HeavensTab
              player={player}
              onTryAscend={handleTryAscend}
              onClaimHeavenSalary={handleClaimHeavenSalary}
            />
          )}

          {activeTab === 'bag' && (
            <InventoryTab
              player={player}
              onUseItem={handleUseItem}
              onNavigateToCraft={() => setActiveTab('craft')}
            />
          )}
        </main>

        {/* Bottom MUD Rolling Console Terminal */}
        <MudTerminal
          logs={logs}
          onClearLogs={() => setLogs([])}
        />
      </div>

      {/* Tribulation Lightning Modal */}
      <TribulationModal
        isOpen={tribulationInfo.isOpen}
        isAscension={tribulationInfo.isAscension}
        realmName={tribulationInfo.realmName}
        isSuccess={tribulationInfo.isSuccess}
        onClose={() => setTribulationInfo(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Settings / Save Modal */}
      <SettingsModal
        isOpen={showSettings}
        player={player}
        onClose={() => setShowSettings(false)}
        onUpdatePlayer={newP => setPlayer(newP)}
        onResetGame={handleResetGame}
      />

      {/* Offline Gains Modal */}
      <OfflineModal
        offlineGains={offlineGains}
        onClose={() => setOfflineGains(null)}
      />
    </div>
  );
}
