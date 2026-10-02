import { PlayerState } from '../types/game';
import { INITIAL_COMPANIONS, DEFAULT_HEGEMONY_WEEKLY_HISTORY } from './constants';

const SAVE_KEY = 'xiuzhen_mud_save_v1';

export const INITIAL_PLAYER: PlayerState = {
  version: 3,
  name: "韓立",
  
  realmIdx: 0,
  realmSubLevel: 1,
  exp: 0,

  bodyIdx: 0,
  bodySubLevel: 1,

  hpMax: 120,
  hpCurrent: 120,
  atk: 14,
  def: 6,
  critRate: 5,
  dodgeRate: 3,

  stone: 180,
  qi: 0,
  qiMax: 100,
  spiritArrayLv: 1,
  herb: 8,

  mindDemon: 0,

  roots: {
    jin: 1,
    mu: 1,
    shui: 1,
    huo: 1,
    tu: 1
  },

  learnedSkills: [],
  inventory: {
    'pill_zhuji': 1,
    'pill_qingxin': 1,
    'herb_lingcao': 6,
    'monster_dan': 3,
    'mat_hantie': 4,
    'herb_chiyang': 1
  },

  alchemyLevel: 1,
  alchemyExp: 0,
  forgeLevel: 1,
  forgeExp: 0,

  equipped: {
    weapon: null,
    armor: null,
    artifact: null
  },

  sect: {
    level: 1,
    name: "太玄青雲草堂",
    exp: 0,
    disciples: [
      { id: 'disc_init_1', name: "清風", talent: "herb", talentName: "採藥靈童", realm: "練氣二層", efficiency: 1, assignedField: 0 }
    ],
    maxDisciples: 5,
    herbFields: 1,
    maxFields: 3,
    autoGatherAccumulated: { herb: 0, ore: 0, stone: 0 },
    lastGatherTime: Date.now()
  },

  companions: INITIAL_COMPANIONS,
  activeCompanionId: 'cp_nangong',

  alliance: {
    joined: false,
    name: "太虛天盟",
    level: 1,
    role: "長老",
    membersCount: 39,
    maxMembers: 50,
    contribution: 150,
    mineVeinLevel: 1,
    mineReserves: {
      stones: 250,
      ores: 3,
      rareJades: 1
    },
    lastMineClaimTime: 0,
    sutras: {
      'sutra_taixu_rate': 1
    },
    hegemonyScore: 0,
    lastHegemonyBattleTime: 0,
    hegemonyWeeklyHistory: DEFAULT_HEGEMONY_WEEKLY_HISTORY
  },

  currentMapId: null,
  adventureStep: 0,
  isAutoRoaming: false,
  activeEvent: null,

  ascended: false,
  heavenClaimedDays: 0,
  lastHeavenClaimTime: 0,

  totalMeditationCount: 0,
  totalBreakthroughSuccess: 0,
  totalBreakthroughFail: 0,
  demonsSlainCount: 0,
  totalPillsCrafted: 0,
  totalArtifactsForged: 0,
  totalDualCultivations: 0,
  totalHegemonyBattles: 0,
  lastOnlineTime: Date.now()
};

export interface OfflineGainResult {
  elapsedSeconds: number;
  expGained: number;
  qiGained: number;
  herbGained: number;
}

export function loadSave(): { state: PlayerState; offline: OfflineGainResult | null } {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      return { state: { ...INITIAL_PLAYER, lastOnlineTime: Date.now() }, offline: null };
    }

    const parsed: PlayerState = JSON.parse(raw);
    const now = Date.now();
    const elapsedMs = Math.max(0, now - (parsed.lastOnlineTime || now));
    const elapsedSeconds = Math.floor(elapsedMs / 1000);

    // Limit offline accumulation to 12 hours (43200 seconds)
    const cappedSeconds = Math.min(43200, elapsedSeconds);

    let offline: OfflineGainResult | null = null;
    if (cappedSeconds >= 30) {
      // Calculate offline gains
      const ticks = Math.floor(cappedSeconds / 2);
      
      // Calculate rate
      let rate = 5 + (parsed.realmIdx * 4) + (parsed.spiritArrayLv * 2);
      if (parsed.mindDemon >= 80) {
        rate = 0; // Demon locked
      }
      
      const expGained = rate * ticks;
      const qiPerSec = parsed.spiritArrayLv * 1.5;
      const potentialQi = Math.floor(qiPerSec * cappedSeconds);
      const qiGained = Math.min(parsed.qiMax - parsed.qi, potentialQi);
      const herbGained = Math.floor(cappedSeconds / 600); // 1 herb every 10 min

      parsed.exp += expGained;
      parsed.qi = Math.min(parsed.qiMax, parsed.qi + qiGained);
      parsed.herb = (parsed.herb || 0) + herbGained;

      offline = {
        elapsedSeconds: cappedSeconds,
        expGained,
        qiGained,
        herbGained
      };
    }

    parsed.lastOnlineTime = now;
    const mergedState: PlayerState = {
      ...INITIAL_PLAYER,
      ...parsed,
      sect: {
        ...INITIAL_PLAYER.sect,
        ...(parsed.sect || {}),
        autoGatherAccumulated: {
          ...INITIAL_PLAYER.sect.autoGatherAccumulated,
          ...(parsed.sect?.autoGatherAccumulated || {})
        },
        disciples: parsed.sect?.disciples || INITIAL_PLAYER.sect.disciples
      },
      alliance: {
        ...INITIAL_PLAYER.alliance,
        ...(parsed.alliance || {}),
        mineReserves: {
          ...INITIAL_PLAYER.alliance.mineReserves,
          ...(parsed.alliance?.mineReserves || {})
        },
        sutras: {
          ...INITIAL_PLAYER.alliance.sutras,
          ...(parsed.alliance?.sutras || {})
        },
        hegemonyWeeklyHistory: parsed.alliance?.hegemonyWeeklyHistory || DEFAULT_HEGEMONY_WEEKLY_HISTORY
      },
      companions: {
        ...INITIAL_PLAYER.companions,
        ...Object.fromEntries(
          Object.entries(parsed.companions || {}).map(([id, c]) => [
            id,
            {
              ...INITIAL_COMPANIONS[id],
              ...c,
              affixes: INITIAL_COMPANIONS[id]?.affixes || c.affixes,
              routeRecommendation: INITIAL_COMPANIONS[id]?.routeRecommendation || c.routeRecommendation,
              element: INITIAL_COMPANIONS[id]?.element || c.element
            }
          ])
        )
      },
      equipped: {
        ...INITIAL_PLAYER.equipped,
        ...(parsed.equipped || {})
      },
      roots: {
        ...INITIAL_PLAYER.roots,
        ...(parsed.roots || {})
      },
      inventory: {
        ...INITIAL_PLAYER.inventory,
        ...(parsed.inventory || {})
      }
    };
    return { state: mergedState, offline };
  } catch (e) {
    console.error('Failed to load save from localStorage', e);
    return { state: { ...INITIAL_PLAYER, lastOnlineTime: Date.now() }, offline: null };
  }
}

export function saveState(state: PlayerState): void {
  try {
    const toSave: PlayerState = {
      ...state,
      lastOnlineTime: Date.now()
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error('Failed to save state to localStorage', e);
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (e) {
    console.error('Failed to clear save', e);
  }
}

export function exportSaveCode(state: PlayerState): string {
  const json = JSON.stringify(state);
  return btoa(encodeURIComponent(json));
}

export function importSaveCode(code: string): PlayerState | null {
  try {
    const json = decodeURIComponent(atob(code.trim()));
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed.realmIdx === 'number') {
      return { ...INITIAL_PLAYER, ...parsed, lastOnlineTime: Date.now() };
    }
  } catch (e) {
    console.error('Invalid save code', e);
  }
  return null;
}
