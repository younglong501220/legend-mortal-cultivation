export type TabType = 'xiulian' | 'dongfu' | 'sect' | 'alliance' | 'companion' | 'gongfa' | 'craft' | 'lilian' | 'xianjie' | 'bag';

export interface RootsData {
  jin: number;   // 金靈根: 增攻擊
  mu: number;    // 木靈根: 增氣血
  shui: number;  // 水靈根: 增防禦
  huo: number;   // 火靈根: 增暴擊
  tu: number;    // 土靈根: 增減傷
}

export type ItemType = 'pill' | 'herb' | 'material' | 'treasure';

export interface InventoryItem {
  id: string;
  name: string;
  count: number;
  type: ItemType;
  description: string;
  effectType: 'exp' | 'breakRate' | 'clearDemon' | 'stone' | 'qi' | 'permAtk' | 'permDef' | 'permHp';
  effectValue: number;
  price: number;
}

export interface SkillItem {
  id: string;
  name: string;
  cost: number;
  type: 'rate' | 'atk' | 'def' | 'hp';
  val: number;
  desc: string;
  source: string;
}

export interface MapData {
  id: number;
  name: string;
  steps: number;
  minAtk: number;
  enemyName: string;
  bossName: string;
  stoneReward: number;
  expReward: number;
  reqRealmIdx: number;
  description: string;
}

export interface LogEntry {
  id: string;
  time: string;
  type: 'world' | 'break' | 'battle' | 'gain' | 'demon' | 'event' | 'craft' | 'sect' | 'companion' | 'alliance';
  message: string;
}

// 煉丹配方
export interface DanRecipe {
  id: string;
  name: string;
  grade: number; // 1~5 品
  desc: string;
  materials: { itemId: string; count: number }[];
  stoneCost: number;
  qiCost: number;
  produceItemId: string;
  successRate: number;
  masteryGain: number;
  reqAlchemyLevel: number;
}

// 裝備槽位
export type EquipSlot = 'weapon' | 'armor' | 'artifact';

// 裝備法寶定義
export interface EquipmentItem {
  id: string;
  name: string;
  slot: EquipSlot;
  grade: '凡器' | '寶器' | '靈器' | '仙器' | '道器';
  atkBonus: number;
  defBonus: number;
  hpBonus: number;
  critBonus: number;
  dodgeBonus: number;
  specialEffect?: string;
  description: string;
}

// 煉器圖譜
export interface ForgeRecipe {
  id: string;
  name: string;
  targetEquipId: string;
  desc: string;
  materials: { itemId: string; count: number }[];
  stoneCost: number;
  qiCost: number;
  successRate: number;
  masteryGain: number;
  reqForgeLevel: number;
}

// 奇遇事件抉擇
export interface AdventureChoice {
  text: string;
  actionId: string;
  costDesc?: string;
}

export interface AdventureEvent {
  id: string;
  title: string;
  description: string;
  type: 'master' | 'relic' | 'spring' | 'enemy' | 'merchant' | 'dying' | 'companion';
  choices: AdventureChoice[];
}

// 宗門弟子
export interface Disciple {
  id: string;
  name: string;
  talent: 'herb' | 'forge' | 'battle' | 'qi';
  talentName: string;
  realm: string;
  efficiency: number; // 每週期採集額外產出量
  assignedField: number | null; // null: 駐守大殿, 0~N: 派駐藥田
}

// 宗門系統數據
export interface SectData {
  level: number; // 1: 一品草堂, 2: 二品修真門派, 3: 三品仙道玄門, 4: 四品長生聖地, 5: 五品太古仙宗
  name: string;
  exp: number;
  disciples: Disciple[];
  maxDisciples: number;
  herbFields: number; // 已開闢藥田畝數
  maxFields: number;
  autoGatherAccumulated: {
    herb: number;
    ore: number;
    stone: number;
  };
  lastGatherTime: number;
}

// 道侶專屬詞條與解鎖條件
export interface CompanionAffix {
  levelReq: number; // 0, 200, 500, 800
  levelName: string; // '泛泛之交', '莫逆之交', '心有靈犀', '生死相許'
  title: string;
  effect: string;
}

// 道侶系統
export interface Companion {
  id: string;
  name: string;
  title: string;
  unlocked: boolean;
  favor: number; // 0 ~ 1000
  rateBonus: number; // 雙修每跳修為加成
  battleSkillName: string;
  battleSkillDesc: string;
  battleSkillEffect: 'damage' | 'heal' | 'crit' | 'shield';
  battleSkillValue: number;
  bio: string;
  voiceLine: string;
  lastDualCultivateTime: number;
  element?: string;
  routeRecommendation?: string;
  affixes?: CompanionAffix[];
}

// 仙盟心法
export interface AllianceSutra {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  desc: string;
  costContribution: number;
  effectType: 'rate' | 'hpDef' | 'atkCrit' | 'breakRate';
  effectValue: number;
}

// 仙盟爭霸戰場
export interface HegemonyBattlefield {
  id: string;
  name: string;
  level: number;
  guardianName: string;
  guardianHp: number;
  guardianAtk: number;
  dominancePct?: number;
  rewardContribution: number;
  rewardStones: number;
  desc: string;
}

// 仙盟爭霸每日戰績統計
export interface HegemonyDayStat {
  dayLabel: string; // '週一', '週二', '週三', '週四', '週五', '週六', '今日'
  battles: number;
  wins: number;
  losses: number;
  winRate: number; // 0 ~ 100%
  contributionEarned: number;
  cumulativeContribution: number;
}

// 仙盟系統數據
export interface AllianceData {
  joined: boolean;
  name: string;
  level: number; // 1: 一階仙盟, 2: 二階名盟, 3: 三階巨擘, 4: 四階天盟, 5: 五階古盟
  role: '盟主' | '副盟主' | '長老' | '精英' | '成員';
  membersCount: number;
  maxMembers: number;
  contribution: number; // 仙盟貢獻值
  mineVeinLevel: number; // 靈礦靈脈等級
  mineReserves: {
    stones: number;
    ores: number;
    rareJades: number;
  };
  lastMineClaimTime: number;
  sutras: Record<string, number>; // sutraId -> level
  hegemonyScore: number;
  lastHegemonyBattleTime: number;
  hegemonyWeeklyHistory?: HegemonyDayStat[];
}

export interface PlayerState {
  version: number;
  name: string;
  
  // 境界
  realmIdx: number;        // 0 to 15 (練氣 to 大羅金仙)
  realmSubLevel: number;   // 1 to 10 層
  exp: number;

  // 肉身
  bodyIdx: number;         // 0 to 9 (凡胎 to 混沌仙體)
  bodySubLevel: number;    // 1 to 5 階

  // 戰鬥屬性 (基礎值，裝備會額外加成)
  hpMax: number;
  hpCurrent: number;
  atk: number;
  def: number;
  critRate: number;        // 5% default
  dodgeRate: number;       // 3% default

  // 靈石、靈氣、靈草
  stone: number;
  qi: number;
  qiMax: number;
  spiritArrayLv: number;
  herb: number;            // 基礎靈草

  // 心魔
  mindDemon: number;       // 0 ~ 100

  // 五行靈根
  roots: RootsData;

  // 功法與背包
  learnedSkills: string[];
  inventory: Record<string, number>;

  // 煉丹造詣
  alchemyLevel: number;    // 1: 一品丹徒, 2: 二品丹士, 3: 三品丹師, 4: 四品丹宗, 5: 五品丹聖
  alchemyExp: number;
  
  // 煉器造詣
  forgeLevel: number;      // 1: 一品器徒, 2: 二品器士, 3: 三品器師, 4: 四品器宗, 5: 五品神匠
  forgeExp: number;

  // 已穿戴法寶裝備
  equipped: {
    weapon: string | null;
    armor: string | null;
    artifact: string | null;
  };

  // 宗門體系
  sect: SectData;

  // 道侶體系
  companions: Record<string, Companion>;
  activeCompanionId: string | null;

  // 仙盟體系
  alliance: AllianceData;

  // 歷練狀態
  currentMapId: number | null;
  adventureStep: number;
  isAutoRoaming: boolean;
  activeEvent: AdventureEvent | null; // 當前懸浮互動奇遇事件

  // 飛升與三十三天
  ascended: boolean;
  heavenClaimedDays: number;
  lastHeavenClaimTime: number;

  // 統計
  totalMeditationCount: number;
  totalBreakthroughSuccess: number;
  totalBreakthroughFail: number;
  demonsSlainCount: number;
  totalPillsCrafted: number;
  totalArtifactsForged: number;
  totalDualCultivations: number;
  totalHegemonyBattles: number;
  lastOnlineTime: number;
}
