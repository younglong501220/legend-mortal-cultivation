import { MapData, SkillItem, InventoryItem, DanRecipe, EquipmentItem, ForgeRecipe, AdventureEvent } from '../types/game';

export const REALMS = [
  "練氣", "築基", "金丹", "元嬰", "出竅", 
  "分神", "合體", "洞虛", "大乘", "洞真", 
  "散仙", "遊仙", "地仙", "天仙", "金仙", "大羅金仙"
];

export const REALM_TITLES = [
  "凡胎初醒", "築就道基", "凝結金丹", "元嬰出竅", "神遊天地",
  "元神分化", "身心合一", "洞悉虛無", "乘風大化", "洞明真如",
  "渡劫散仙", "縹緲遊仙", "厚德地仙", "受封天仙", "不朽金仙", "大羅無量"
];

export const BODY_REALMS = [
  "凡胎", "凝血", "煉骨", "易筋", "鍛腑", 
  "洗髓", "千山金身", "神力", "神念", "混沌仙體"
];

export const BODY_DESC = [
  "凡胎之軀，不堪一擊",
  "氣血充盈，經脈微熱",
  "骨若沉鐵，刀劍難傷",
  "筋似勁弦，行動如風",
  "內腑如鼎，百毒不侵",
  "髓生金光，脫胎換骨",
  "千山難撼，萬法不侵",
  "舉手投足，撼天動地",
  "肉身有靈，通天徹地",
  "混沌如一，萬劫難滅"
];

export const ALCHEMY_TITLES = [
  "未入流", "一品丹徒", "二品丹士", "三品丹師", "四品丹宗", "五品丹聖"
];

export const FORGE_TITLES = [
  "未入流", "一品器徒", "二品器士", "三品器師", "四品器宗", "五品神匠"
];

// 宗門品階稱謂與晉升配置
export const SECT_TITLES = [
  "未立宗門",
  "一品修真草堂",
  "二品靈山名門",
  "三品仙道玄門",
  "四品九天聖地",
  "五品萬古神宗"
];

export const SECT_BENEFITS = [
  { level: 0, cost: 0, maxDisciples: 0, maxFields: 0, qiBonusPct: 0, rateBonus: 0, desc: "凡身無派" },
  { level: 1, cost: 150, maxDisciples: 5, maxFields: 3, qiBonusPct: 15, rateBonus: 8, desc: "初闢草堂：弟子上限5人，藥田3畝，聚靈陣蓄氣+15%，修為+8/跳" },
  { level: 2, cost: 500, maxDisciples: 10, maxFields: 6, qiBonusPct: 35, rateBonus: 20, desc: "靈山名門：弟子上限10人，藥田6畝，聚靈陣蓄氣+35%，修為+20/跳" },
  { level: 3, cost: 1400, maxDisciples: 18, maxFields: 10, qiBonusPct: 65, rateBonus: 45, desc: "仙道玄門：弟子上限18人，藥田10畝，聚靈陣蓄氣+65%，修為+45/跳" },
  { level: 4, cost: 3500, maxDisciples: 28, maxFields: 16, qiBonusPct: 110, rateBonus: 80, desc: "九天聖地：弟子上限28人，藥田16畝，聚靈陣蓄氣+110%，修為+80/跳" },
  { level: 5, cost: 9000, maxDisciples: 40, maxFields: 24, qiBonusPct: 180, rateBonus: 150, desc: "萬古神宗：弟子上限40人，藥田24畝，聚靈陣蓄氣+180%，修為+150/跳" }
];

export const DISCIPLE_RECRUITS = [
  { name: "清風", talent: "herb" as const, talentName: "採藥靈童", realm: "練氣二層", efficiency: 1 },
  { name: "明月", talent: "herb" as const, talentName: "採藥仙姝", realm: "練氣三層", efficiency: 1 },
  { name: "鐵柱", talent: "forge" as const, talentName: "鑄金力士", realm: "練氣四層", efficiency: 1 },
  { name: "玄通", talent: "qi" as const, talentName: "聚靈陣童", realm: "練氣五層", efficiency: 2 },
  { name: "青玄", talent: "battle" as const, talentName: "執劍護法", realm: "築基一層", efficiency: 3 },
  { name: "靈萱", talent: "herb" as const, talentName: "草木靈體", realm: "築基二層", efficiency: 2 },
  { name: "重光", talent: "forge" as const, talentName: "百煉天工", realm: "築基三層", efficiency: 2 },
  { name: "白眉", talent: "qi" as const, talentName: "參玄真人", realm: "築基五層", efficiency: 4 }
];

// 仙盟爭霸預設每週戰績走勢 (過去一週 7 天統計基準)
export const DEFAULT_HEGEMONY_WEEKLY_HISTORY: import('../types/game').HegemonyDayStat[] = [
  { dayLabel: "週一", battles: 3, wins: 2, losses: 1, winRate: 67, contributionEarned: 360, cumulativeContribution: 360 },
  { dayLabel: "週二", battles: 4, wins: 3, losses: 1, winRate: 75, contributionEarned: 540, cumulativeContribution: 900 },
  { dayLabel: "週三", battles: 3, wins: 3, losses: 0, winRate: 100, contributionEarned: 600, cumulativeContribution: 1500 },
  { dayLabel: "週四", battles: 5, wins: 4, losses: 1, winRate: 80, contributionEarned: 760, cumulativeContribution: 2260 },
  { dayLabel: "週五", battles: 4, wins: 3, losses: 1, winRate: 75, contributionEarned: 580, cumulativeContribution: 2840 },
  { dayLabel: "週六", battles: 6, wins: 5, losses: 1, winRate: 83, contributionEarned: 950, cumulativeContribution: 3790 },
  { dayLabel: "今日", battles: 2, wins: 2, losses: 0, winRate: 100, contributionEarned: 380, cumulativeContribution: 4170 }
];

// 紅塵道侶初始檔案
export const INITIAL_COMPANIONS: Record<string, import('../types/game').Companion> = {
  cp_nangong: {
    id: 'cp_nangong',
    name: "南宮婉",
    title: "青元劍仙 · 縹緲仙子",
    element: "金 / 水雙相 · 冰魄劍胎",
    unlocked: true, // starter companion or encountered
    favor: 120,
    rateBonus: 18,
    battleSkillName: "青元霜刃連攜斬",
    battleSkillDesc: "召喚青元霜雪劍陣，對妖獸造成道友攻擊力 120% 的連攜天罡穿透傷害！",
    battleSkillEffect: 'damage',
    battleSkillValue: 120,
    bio: "青元劍宗絕頂天驕，清冷如月，冰心玉骨，對凡人求仙之堅忍尤為動容。",
    voiceLine: "「仙道茫茫，有君同行，風雪何懼。」",
    lastDualCultivateTime: 0,
    routeRecommendation: "【劍道攻伐破障流】：極致輸出與破甲穿透。雙修大幅加速修為吞吐，適合人間歷練橫掃高階妖獸與仙盟爭霸首選！",
    affixes: [
      { levelReq: 0, levelName: "泛泛之交", title: "【冰心劍引】", effect: "雙修基礎修為每跳 +18，基礎攻擊力永久 +25" },
      { levelReq: 200, levelName: "莫逆之交", title: "【青元劍意】", effect: "歷練交鋒暴擊率額外 +5%，雙修時心魔滋生率 -30%" },
      { levelReq: 500, levelName: "心有靈犀", title: "【九天霜魄】", effect: "大境界天劫突破成功率 +6%，同行出戰攻擊力 +15%" },
      { levelReq: 800, levelName: "生死相許", title: "【玄牝合道誓約】", effect: "每日雙修修為收益翻倍！連攜神通穿透傷害暴增至 180%" }
    ]
  },
  cp_ziling: {
    id: 'cp_ziling',
    name: "紫菱",
    title: "妙手懸壺 · 百草小醫仙",
    element: "木相乙木 · 長生甘露",
    unlocked: false,
    favor: 0,
    rateBonus: 14,
    battleSkillName: "回春甘露仙雨",
    battleSkillDesc: "拂動碧波仙杖，戰鬥中為道友瞬間恢復 220 點氣血，並斬除 15 點心魔！",
    battleSkillEffect: 'heal',
    battleSkillValue: 220,
    bio: "生於靈藥世家，心懷慈悲，走遍九州禁地尋覓奇花異草，靈動溫柔。",
    voiceLine: "「道友莫要逞強，受了傷且由我來醫治。」",
    lastDualCultivateTime: 0,
    routeRecommendation: "【穩健護體修心流】：極致心魔壓制與氣血回春。推薦在心魔深種或衝擊元嬰、分神大劫時優先雙修洗滌紫府識海！",
    affixes: [
      { levelReq: 0, levelName: "泛泛之交", title: "【百草清露】", effect: "雙修修為每跳 +14，洞府採藥每次產量 +1 株" },
      { levelReq: 200, levelName: "莫逆之交", title: "【甘霖潤脈】", effect: "每次雙修固定斬除 35 點心魔，洞府聚靈陣效率 +15%" },
      { levelReq: 500, levelName: "心有靈犀", title: "【乙木靈胎】", effect: "修士氣血上限額外 +800，煉丹成丹率永久提升 +10%" },
      { levelReq: 800, levelName: "生死相許", title: "【枯木逢春誓約】", effect: "戰鬥中若遭受致命打擊觸發【回春重生】保命一次！" }
    ]
  },
  cp_yanruyan: {
    id: 'cp_yanruyan',
    name: "燕如嫣",
    title: "天魔宗聖女 · 魅影魔姬",
    element: "火 / 暗相 · 天魔幽煞",
    unlocked: false,
    favor: 0,
    rateBonus: 24,
    battleSkillName: "幽冥噬血絕滅刺",
    battleSkillDesc: "滔天魔煞破陣，削弱妖魔 30% 防禦並令道友本次交鋒必定引發致命暴擊！",
    battleSkillEffect: 'crit',
    battleSkillValue: 30,
    bio: "魔門第一奇女子，殺伐果決卻外冷內熱，因一次生死奇遇而對你暗生情愫。",
    voiceLine: "「敢動我認可的人，便是天王老子也要折劍斷命。」",
    lastDualCultivateTime: 0,
    routeRecommendation: "【極致煞氣狂暴流】：最高額每跳修為增益（+24/跳），戰鬥引爆致命暴擊，適合追求極限修為衝階與獵殺高級 Boss！",
    affixes: [
      { levelReq: 0, levelName: "泛泛之交", title: "【天魔玄煞】", effect: "雙修修為每跳 +24，戰鬥致命暴擊傷害 +25%" },
      { levelReq: 200, levelName: "莫逆之交", title: "【噬血魔元】", effect: "歷練戰勝妖魔時靈石掉落 +40%，攻擊力額外 +40" },
      { levelReq: 500, levelName: "心有靈犀", title: "【九幽魔體】", effect: "突破大境界成功率 +8%，仙盟爭霸戰力增幅 +20%" },
      { levelReq: 800, levelName: "生死相許", title: "【修羅同心誓約】", effect: "雙修引動幽冥真火淬骨，攻擊力永久 +150，暴擊率 +10%" }
    ]
  },
  cp_yinyue: {
    id: 'cp_yinyue',
    name: "銀月",
    title: "九尾天狐王族 · 靈狐仙姬",
    element: "幻 / 空相 · 上古天狐",
    unlocked: false,
    favor: 0,
    rateBonus: 20,
    battleSkillName: "天狐惑心靈甲",
    battleSkillDesc: "展開天狐靈幕，使妖獸攻擊無效化並提升道友 15% 閃避率！",
    battleSkillEffect: 'shield',
    battleSkillValue: 15,
    bio: "上古天狐遺脈，幻術通玄，本體受封印化作人形，常駐修士識海相伴相依。",
    voiceLine: "「嘻嘻，主人，今日雙修可莫要分心哦。」",
    lastDualCultivateTime: 0,
    routeRecommendation: "【逍遙避劫全能流】：全真攻防兼備與高機動閃避，化解天劫反噬與戰鬥負傷，無死角的全能修真道侶伴侶！",
    affixes: [
      { levelReq: 0, levelName: "泛泛之交", title: "【天狐幻魅】", effect: "雙修修為每跳 +20，戰鬥閃避率永久 +5%" },
      { levelReq: 200, levelName: "莫逆之交", title: "【靈狐望月】", effect: "歷練負傷時不滋生心魔，神遊出竅速度提升 +20%" },
      { levelReq: 500, levelName: "心有靈犀", title: "【九尾天威】", effect: "全防禦屬性 +80，仙盟共有靈礦分紅獲益 +30%" },
      { levelReq: 800, levelName: "生死相許", title: "【天狐同壽誓約】", effect: "天道雷劫受創免除 35% 損害，雙修每次額外贈予 50 靈氣" }
    ]
  }
};

// 仙盟品階稱謂與升級配置
export const ALLIANCE_TITLES = [
  "未入仙盟",
  "一階凡品仙盟",
  "二階名門仙盟",
  "三階巨擘仙盟",
  "四階太虛天盟",
  "五階萬古神盟"
];

// 可選擇加入的修真巨擘仙盟名錄
export const DEFAULT_ALLIANCES = [
  {
    name: "縹緲仙盟",
    desc: "青元正道巨擎，底蘊綿長，盟友同修天地玄氣，溫養靈脈。",
    specialty: "修為增幅 · 靈脈溫養",
    members: 42
  },
  {
    name: "萬劍宗盟",
    desc: "萬千劍修薈萃之地，殺伐果斷，每週爭霸百戰不殆，鋒芒畢露。",
    specialty: "爭霸狂威 · 殺伐破甲",
    members: 48
  },
  {
    name: "太虛天盟",
    desc: "統御九州古老靈脈，共用天地靈礦，仙晶玄鐵儲備天下第一。",
    specialty: "靈礦分紅 · 資源鼎盛",
    members: 39
  },
  {
    name: "廣寒仙宮",
    desc: "清冷出塵，道心若雪，全盟心魔不生，突破瓶頸如履平地。",
    specialty: "道心澄澈 · 破劫護體",
    members: 36
  }
];

// 共享仙盟心法配置
export const ALLIANCE_SUTRAS_CONFIG = [
  {
    id: 'sutra_taixu_rate',
    name: "太虛同源心法",
    maxLevel: 5,
    desc: "盟友氣息同調共鳴，全體成員每跳修為顯著提升",
    costBase: 120,
    costMult: 1.5,
    effectType: 'rate' as const,
    valPerLevel: 15, // +15 exp/tick per level
    displayEffect: (lv: number) => `每跳修為 +${lv * 15}`
  },
  {
    id: 'sutra_taiyi_defense',
    name: "乾坤同氣化神訣",
    maxLevel: 5,
    desc: "聚眾仙護體純陽罡氣，永久提升全盟成員氣血與防禦",
    costBase: 150,
    costMult: 1.5,
    effectType: 'hpDef' as const,
    valPerLevel: 20, // +20 def, +250 hp per level
    displayEffect: (lv: number) => `防禦 +${lv * 20} · 氣血 +${lv * 250}`
  },
  {
    id: 'sutra_wandao_battle',
    name: "萬道歸一戰陣典",
    maxLevel: 5,
    desc: "合全盟仙道陣意，激發滔天殺伐，提升攻擊力與暴擊率",
    costBase: 180,
    costMult: 1.6,
    effectType: 'atkCrit' as const,
    valPerLevel: 25, // +25 atk, +2% crit per level
    displayEffect: (lv: number) => `攻擊力 +${lv * 25} · 暴擊 +${lv * 2}%`
  },
  {
    id: 'sutra_dingshen_break',
    name: "天地同壽定心經",
    maxLevel: 5,
    desc: "仙盟天道庇佑，鎮壓紫府雜念，大幅提高天劫突破成功率",
    costBase: 220,
    costMult: 1.6,
    effectType: 'breakRate' as const,
    valPerLevel: 4, // +4% breakthrough rate per level
    displayEffect: (lv: number) => `破境成功率 +${lv * 4}%`
  }
];

// 每週仙盟爭霸戰場
export const HEGEMONY_BATTLEFIELDS = [
  {
    id: 'battle_kunlun',
    name: "崑崙神山靈池",
    level: 1,
    guardianName: "崑崙狂暴石尊",
    guardianHp: 800,
    guardianAtk: 45,
    dominancePct: 82,
    rewardContribution: 180,
    rewardStones: 220,
    desc: "崑崙靈脈初階仙池，常年靈霧繚繞，爭奪佔領可為仙盟奠定雄厚基礎。"
  },
  {
    id: 'battle_penglai',
    name: "蓬萊仙境天門",
    level: 2,
    guardianName: "蓬萊劍仙殘魂",
    guardianHp: 2200,
    guardianAtk: 120,
    dominancePct: 64,
    rewardContribution: 400,
    rewardStones: 500,
    desc: "海外蓬萊三島之樞紐天關，劍意縱橫，乃中流仙盟寸步不讓之核心重地。"
  },
  {
    id: 'battle_buzhou',
    name: "不周神山天脊",
    level: 3,
    guardianName: "九幽噬天魔龍",
    guardianHp: 6500,
    guardianAtk: 320,
    dominancePct: 35,
    rewardContribution: 950,
    rewardStones: 1200,
    desc: "昔日太古天柱之遺址，鎮守著造化天脈，唯有霸主仙盟方有資格染指！"
  }
];

export const HEAVENS_33 = [
  { name: "第一天·太皇黃曾天", level: 1, salary: 50, reqLevel: "散仙一層" },
  { name: "第二天·太明玉完天", level: 2, salary: 80, reqLevel: "散仙五層" },
  { name: "第三天·清明何童天", level: 3, salary: 120, reqLevel: "散仙十層" },
  { name: "第四天·玄胎平育天", level: 4, salary: 180, reqLevel: "遊仙一層" },
  { name: "第五天·元明文舉天", level: 5, salary: 250, reqLevel: "遊仙五層" },
  { name: "第六天·七曜摩夷天", level: 6, salary: 340, reqLevel: "遊仙十層" },
  { name: "第七天·虛無越衡天", level: 7, salary: 450, reqLevel: "地仙一層" },
  { name: "第八天·太極濛翳天", level: 8, salary: 580, reqLevel: "地仙五層" },
  { name: "第九天·赤明和陽天", level: 9, salary: 740, reqLevel: "地仙十層" },
  { name: "第十天·玄明恭華天", level: 10, salary: 920, reqLevel: "天仙一層" },
  { name: "第十一天·耀明宗飄天", level: 11, salary: 1150, reqLevel: "天仙五層" },
  { name: "第十二天·竺落皇笳天", level: 12, salary: 1400, reqLevel: "天仙十層" },
  { name: "第十三天·虛明堂曜天", level: 13, salary: 1700, reqLevel: "金仙一層" },
  { name: "第十四天·觀明端靖天", level: 14, salary: 2100, reqLevel: "金仙五層" },
  { name: "第十五天·玄明恭慶天", level: 15, salary: 2600, reqLevel: "金仙十層" },
  { name: "第十六天·太煥極瑤天", level: 16, salary: 3200, reqLevel: "大羅金仙一層" },
  { name: "第十七天·元載孔昇天", level: 17, salary: 4000, reqLevel: "大羅金仙三層" },
  { name: "第十八天·太安皇崖天", level: 18, salary: 5000, reqLevel: "大羅金仙五層" },
  { name: "第十九天·顯定極風天", level: 19, salary: 6200, reqLevel: "大羅金仙七層" },
  { name: "第二十天·始黃孝芒天", level: 20, salary: 7600, reqLevel: "大羅金仙九層" },
  { name: "第二十一天·太翁重光天", level: 21, salary: 9200, reqLevel: "大羅圓滿" },
  { name: "第二十二天·無思江由天", level: 22, salary: 11000, reqLevel: "大羅圓滿" },
  { name: "第二十三天·上揲阮樂天", level: 23, salary: 13500, reqLevel: "大羅圓滿" },
  { name: "第二十四天·無極曇誓天", level: 24, salary: 16500, reqLevel: "大羅圓滿" },
  { name: "第二十五天·皓庭霄度天", level: 25, salary: 20000, reqLevel: "大羅圓滿" },
  { name: "第二十六天·淵通元洞天", level: 26, salary: 24500, reqLevel: "大羅圓滿" },
  { name: "第二十七天·翰寵妙成天", level: 27, salary: 30000, reqLevel: "大羅圓滿" },
  { name: "第二十八天·秀樂禁上天", level: 28, salary: 37000, reqLevel: "大羅圓滿" },
  { name: "第二十九天·無上常融天", level: 29, salary: 46000, reqLevel: "大羅圓滿" },
  { name: "第三十天·玉隆騰勝天", level: 30, salary: 57000, reqLevel: "大羅圓滿" },
  { name: "第三十一天·龍變梵度天", level: 31, salary: 70000, reqLevel: "大羅圓滿" },
  { name: "第三十二天·平育賈奕天", level: 32, salary: 86000, reqLevel: "大羅圓滿" },
  { name: "第三十三天·大羅天 (大道盡頭)", level: 33, salary: 120000, reqLevel: "登峰造極" }
];

export const MAPS: MapData[] = [
  {
    id: 1,
    name: "無名斷崖",
    steps: 8,
    minAtk: 12,
    enemyName: "赤煉火狐",
    bossName: "斷崖血蟒",
    stoneReward: 30,
    expReward: 45,
    reqRealmIdx: 0,
    description: "凡間險隘，常有鍊氣散修在此尋覓吐納初機與採擷靈草。"
  },
  {
    id: 2,
    name: "幽冥黑林",
    steps: 12,
    minAtk: 40,
    enemyName: "鐵甲屍魈",
    bossName: "黑林鬼王",
    stoneReward: 80,
    expReward: 140,
    reqRealmIdx: 1,
    description: "終年陰風獵獵，屍氣森森，產出寒鐵石與初階妖丹。"
  },
  {
    id: 3,
    name: "百獸荒澤",
    steps: 16,
    minAtk: 100,
    enemyName: "獨角裂天兕",
    bossName: "九翼虺龍",
    stoneReward: 200,
    expReward: 380,
    reqRealmIdx: 2,
    description: "廣袤無邊的水澤泥潭，上古兇獸遺種橫行，盛產赤陽靈花與赤銅晶。"
  },
  {
    id: 4,
    name: "墜仙深淵",
    steps: 20,
    minAtk: 280,
    enemyName: "深淵魔魁",
    bossName: "墮落劍仙殘魂",
    stoneReward: 500,
    expReward: 1000,
    reqRealmIdx: 3,
    description: "傳聞上古大能隕落所裂地塹，罡風撕裂神識，蘊藏烏金玄鐵與高階妖丹。"
  },
  {
    id: 5,
    name: "九霄雷池",
    steps: 25,
    minAtk: 700,
    enemyName: "紫霄雷獸",
    bossName: "天劫雷皇分神",
    stoneReward: 1200,
    expReward: 3000,
    reqRealmIdx: 4,
    description: "劫雲萬丈雷光閃爍，淬煉神兵材料九天精金與萬年玄冰雪蓮。"
  },
  {
    id: 6,
    name: "幽都冥界",
    steps: 30,
    minAtk: 1600,
    enemyName: "輪迴無常",
    bossName: "黃泉判官",
    stoneReward: 3000,
    expReward: 8000,
    reqRealmIdx: 6,
    description: "黃泉彼岸，生魂絕跡，唯通曉陰陽大能方敢步入，產出混沌溫玉。"
  }
];

export const SKILLS_DATA: SkillItem[] = [
  { 
    id: 'sk1', 
    name: "太玄吐納心經", 
    cost: 50, 
    type: "rate", 
    val: 5, 
    desc: "每跳額外獲得 +5 修為，氣沉丹田，綿綿若存", 
    source: "藏經閣一層" 
  },
  { 
    id: 'sk2', 
    name: "九轉金剛伏魔訣", 
    cost: 160, 
    type: "atk", 
    val: 20, 
    desc: "永久提升 +20 點攻擊，佛道合流，力劈山河", 
    source: "藏經閣一層" 
  },
  { 
    id: 'sk3', 
    name: "混元護體玄罡", 
    cost: 320, 
    type: "def", 
    val: 18, 
    desc: "永久提升 +18 點防禦與 +150 氣血上限", 
    source: "藏經閣二層" 
  },
  { 
    id: 'sk4', 
    name: "歸一引魂古卷", 
    cost: 850, 
    type: "rate", 
    val: 25, 
    desc: "每跳額外獲得 +25 修為，引天地孤魂入玄牝", 
    source: "藏經閣二層" 
  },
  { 
    id: 'sk5', 
    name: "大洞真經斬煞篇", 
    cost: 2200, 
    type: "atk", 
    val: 75, 
    desc: "永久提升 +75 點攻擊，劍芒所指，萬煞皆散", 
    source: "真傳閣" 
  },
  { 
    id: 'sk6', 
    name: "紫府化神固本術", 
    cost: 4500, 
    type: "hp", 
    val: 600, 
    desc: "永久提升 +600 氣血上限與 +35 防禦", 
    source: "真傳閣" 
  },
  { 
    id: 'sk7', 
    name: "太乙青蓮劍典", 
    cost: 9000, 
    type: "atk", 
    val: 180, 
    desc: "永久提升 +180 攻擊與 +30 每跳修為，青蓮一出萬古枯", 
    source: "掌門傳承" 
  },
  { 
    id: 'sk8', 
    name: "八九玄功殘卷", 
    cost: 20000, 
    type: "def", 
    val: 120, 
    desc: "肉身成聖至高法門，永久提升 +120 防禦與 +1500 氣血", 
    source: "上古秘藏" 
  }
];

export const ROOT_NAMES: Record<string, { label: string; desc: string; color: string }> = {
  jin: { label: "金靈根", desc: "破甲伐木，每次升級增 +8 攻擊", color: "text-amber-300" },
  mu: { label: "木靈根", desc: "生生不息，每次升級增 +60 氣血", color: "text-emerald-400" },
  shui: { label: "水靈根", desc: "上善若水，每次升級增 +6 防禦", color: "text-cyan-400" },
  huo: { label: "火靈根", desc: "焚天熾烈，提升靈氣轉化與 +5 攻擊", color: "text-rose-400" },
  tu: { label: "土靈根", desc: "厚德載物，每次升級增 +40 氣血與 +4 防禦", color: "text-yellow-600" }
};

// 儲物袋物品全集 (丹藥、藥材、煉器精金、法寶材料)
export const INVENTORY_ITEMS: InventoryItem[] = [
  // 丹藥類
  {
    id: 'pill_zhuji',
    name: "築基丹",
    count: 0,
    type: "pill",
    description: "突破至築基期必備靈丹，使下次突破成功率提升 15%",
    effectType: "breakRate",
    effectValue: 15,
    price: 80
  },
  {
    id: 'pill_pozhange',
    name: "金丹破障丹",
    count: 0,
    type: "pill",
    description: "洗滌經脈雜質，使下次境界突破機率額外提升 20%",
    effectType: "breakRate",
    effectValue: 20,
    price: 250
  },
  {
    id: 'pill_ningying',
    name: "凝嬰聚頂丹",
    count: 0,
    type: "pill",
    description: "碎丹成嬰之極品丹藥，使下次破境機率大幅提升 25%",
    effectType: "breakRate",
    effectValue: 25,
    price: 600
  },
  {
    id: 'pill_qingxin',
    name: "清心玉露丹",
    count: 0,
    type: "pill",
    description: "道門清心聖藥，服用可滌蕩識海，瞬間斬除 40 點心魔",
    effectType: "clearDemon",
    effectValue: 40,
    price: 100
  },
  {
    id: 'pill_dinghun',
    name: "太清定魂丹",
    count: 0,
    type: "pill",
    description: "九品名丹，服之神識固若金湯，瞬間肅清 70 點心魔",
    effectType: "clearDemon",
    effectValue: 70,
    price: 450
  },
  {
    id: 'pill_xisui',
    name: "洗髓伐毛丹",
    count: 0,
    type: "pill",
    description: "強化肉身仙骨，服用後【永久提升】15點防禦與120點氣血",
    effectType: "permDef",
    effectValue: 15,
    price: 350
  },
  {
    id: 'pill_cuihun',
    name: "淬魂真武丹",
    count: 0,
    type: "pill",
    description: "凝練真武殺伐之氣，服用後【永久提升】22點攻擊力",
    effectType: "permAtk",
    effectValue: 22,
    price: 400
  },
  {
    id: 'pill_changsheng',
    name: "長生太華丹",
    count: 0,
    type: "pill",
    description: "上古延壽仙丹，服用後【永久提升】350點命元氣血上限",
    effectType: "permHp",
    effectValue: 350,
    price: 500
  },
  {
    id: 'pill_zaohua',
    name: "乾坤造化丹",
    count: 0,
    type: "pill",
    description: "奪天地之造化，服用後瞬間暴增 600 點修為",
    effectType: "exp",
    effectValue: 600,
    price: 300
  },
  // 靈草與天材地寶
  {
    id: 'herb_lingcao',
    name: "九葉雪芝",
    count: 0,
    type: "herb",
    description: "採自洞府靈圃或凡間禁地，煉製基礎丹藥的核心藥引，服之得150修為",
    effectType: "exp",
    effectValue: 150,
    price: 40
  },
  {
    id: 'herb_chiyang',
    name: "赤陽靈花",
    count: 0,
    type: "herb",
    description: "生長於火熱荒澤之奇花，蘊含熾烈陽和之氣，為煉製真武丹與破障丹必備",
    effectType: "exp",
    effectValue: 250,
    price: 80
  },
  {
    id: 'herb_xuelian',
    name: "玄冰雪蓮",
    count: 0,
    type: "herb",
    description: "極寒絕頂萬年生長之仙葩，滌盪心魔與延年益壽之聖品",
    effectType: "clearDemon",
    effectValue: 30,
    price: 150
  },
  {
    id: 'monster_dan',
    name: "伴生妖丹",
    count: 0,
    type: "material",
    description: "擊敗九州禁地妖獸所得之結晶，乃煉丹引火化煞與煉器聚靈不可或缺之物",
    effectType: "exp",
    effectValue: 80,
    price: 60
  },
  // 煉器精金玄鐵
  {
    id: 'mat_hantie',
    name: "萬載寒鐵石",
    count: 0,
    type: "material",
    description: "深埋九幽寒潭的堅固礦石，質地森冷，乃鍛造初階法寶與飛劍之基石",
    effectType: "stone",
    effectValue: 30,
    price: 50
  },
  {
    id: 'mat_chitong',
    name: "赤銅精晶",
    count: 0,
    type: "material",
    description: "自地脈熔漿中採集的赤銅精髓，導靈性極佳，適合鍛造靈甲與護心鏡",
    effectType: "stone",
    effectValue: 80,
    price: 120
  },
  {
    id: 'mat_wujin',
    name: "烏金玄鐵",
    count: 0,
    type: "material",
    description: "堅不可摧的天外玄金，重逾萬鈞，寶器級神兵利刃核心材料",
    effectType: "stone",
    effectValue: 200,
    price: 260
  },
  {
    id: 'mat_wenyu',
    name: "萬年溫玉",
    count: 0,
    type: "material",
    description: "吸收天地靈脈溫養萬年的古玉，具安定神魂與抗劫消煞之妙效",
    effectType: "stone",
    effectValue: 350,
    price: 450
  },
  {
    id: 'spirit_drop',
    name: "乾坤聚靈髓",
    count: 0,
    type: "treasure",
    description: "天地靈氣凝結之精華，灌入聚靈池可直接充盈 300 點靈氣",
    effectType: "qi",
    effectValue: 300,
    price: 150
  }
];

// 丹方大全 (煉丹房)
export const DAN_RECIPES: DanRecipe[] = [
  {
    id: 'rec_zhuji',
    name: "築基丹方",
    grade: 1,
    desc: "煉製一粒築基丹，破境成功率+15%",
    materials: [
      { itemId: 'herb_lingcao', count: 3 },
      { itemId: 'monster_dan', count: 1 }
    ],
    stoneCost: 50,
    qiCost: 40,
    produceItemId: 'pill_zhuji',
    successRate: 90,
    masteryGain: 15,
    reqAlchemyLevel: 1
  },
  {
    id: 'rec_qingxin',
    name: "清心玉露丹方",
    grade: 1,
    desc: "煉製一粒清心玉露丹，洗滌心魔-40",
    materials: [
      { itemId: 'herb_lingcao', count: 4 },
      { itemId: 'monster_dan', count: 1 }
    ],
    stoneCost: 70,
    qiCost: 50,
    produceItemId: 'pill_qingxin',
    successRate: 85,
    masteryGain: 20,
    reqAlchemyLevel: 1
  },
  {
    id: 'rec_pozhang',
    name: "金丹破障丹方",
    grade: 2,
    desc: "煉製一粒破障丹，突破成功率+20%",
    materials: [
      { itemId: 'herb_lingcao', count: 5 },
      { itemId: 'herb_chiyang', count: 2 },
      { itemId: 'monster_dan', count: 2 }
    ],
    stoneCost: 150,
    qiCost: 100,
    produceItemId: 'pill_pozhange',
    successRate: 80,
    masteryGain: 35,
    reqAlchemyLevel: 2
  },
  {
    id: 'rec_xisui',
    name: "洗髓伐毛丹方",
    grade: 2,
    desc: "煉製洗髓丹，永久提升防禦+15，氣血+120",
    materials: [
      { itemId: 'herb_lingcao', count: 6 },
      { itemId: 'monster_dan', count: 3 }
    ],
    stoneCost: 180,
    qiCost: 120,
    produceItemId: 'pill_xisui',
    successRate: 75,
    masteryGain: 40,
    reqAlchemyLevel: 2
  },
  {
    id: 'rec_cuihun',
    name: "淬魂真武丹方",
    grade: 3,
    desc: "煉製真武丹，永久提升攻擊+22",
    materials: [
      { itemId: 'herb_chiyang', count: 4 },
      { itemId: 'monster_dan', count: 4 }
    ],
    stoneCost: 260,
    qiCost: 180,
    produceItemId: 'pill_cuihun',
    successRate: 70,
    masteryGain: 60,
    reqAlchemyLevel: 3
  },
  {
    id: 'rec_changsheng',
    name: "長生太華丹方",
    grade: 3,
    desc: "煉製太華仙丹，永久提升氣血+350",
    materials: [
      { itemId: 'herb_xuelian', count: 2 },
      { itemId: 'herb_lingcao', count: 8 },
      { itemId: 'monster_dan', count: 3 }
    ],
    stoneCost: 320,
    qiCost: 220,
    produceItemId: 'pill_changsheng',
    successRate: 65,
    masteryGain: 75,
    reqAlchemyLevel: 3
  },
  {
    id: 'rec_ningying',
    name: "凝嬰聚頂丹方",
    grade: 4,
    desc: "煉製凝嬰丹，碎丹成嬰機率+25%",
    materials: [
      { itemId: 'herb_xuelian', count: 3 },
      { itemId: 'herb_chiyang', count: 5 },
      { itemId: 'monster_dan', count: 6 }
    ],
    stoneCost: 500,
    qiCost: 350,
    produceItemId: 'pill_ningying',
    successRate: 60,
    masteryGain: 110,
    reqAlchemyLevel: 4
  },
  {
    id: 'rec_dinghun',
    name: "太清定魂丹方",
    grade: 4,
    desc: "道家至清靈丹，瞬間肅清 70 點心魔",
    materials: [
      { itemId: 'herb_xuelian', count: 4 },
      { itemId: 'monster_dan', count: 5 }
    ],
    stoneCost: 450,
    qiCost: 300,
    produceItemId: 'pill_dinghun',
    successRate: 65,
    masteryGain: 100,
    reqAlchemyLevel: 4
  }
];

// 法寶裝備庫 (Equipment)
export const EQUIPMENT_LIST: EquipmentItem[] = [
  // 武器 (飛劍/法刃)
  {
    id: 'eq_hantie_sword',
    name: "寒鐵青鋒劍",
    slot: 'weapon',
    grade: '凡器',
    atkBonus: 28,
    defBonus: 0,
    hpBonus: 0,
    critBonus: 2,
    dodgeBonus: 0,
    description: "以萬載寒鐵初火淬鍊的利刃，劍氣冷冽如霜。"
  },
  {
    id: 'eq_chiyang_blade',
    name: "赤陽斬妖劍",
    slot: 'weapon',
    grade: '寶器',
    atkBonus: 65,
    defBonus: 8,
    hpBonus: 100,
    critBonus: 5,
    dodgeBonus: 0,
    description: "融合赤陽靈火與赤銅精晶鑄成，一劍斬出赤浪翻湧。"
  },
  {
    id: 'eq_qingzhu_sword',
    name: "青竹蜂雲劍",
    slot: 'weapon',
    grade: '靈器',
    atkBonus: 160,
    defBonus: 20,
    hpBonus: 300,
    critBonus: 8,
    dodgeBonus: 3,
    specialEffect: "青蓮劍陣：攻擊時有機會引發劍氣共振",
    description: "致敬太古劍仙韓立成名至寶，金雷竹所化，避邪神雷環繞。"
  },
  {
    id: 'eq_zhuxian_blade',
    name: "太初誅仙殘刃",
    slot: 'weapon',
    grade: '仙器',
    atkBonus: 380,
    defBonus: 50,
    hpBonus: 800,
    critBonus: 15,
    dodgeBonus: 5,
    specialEffect: "誅仙戮神：暴擊率額外激增，無視對手部分護體真氣",
    description: "上古誅仙劍意凝結之殘刃，煞氣騰騰，出鞘天地色變。"
  },

  // 防具 (道袍/寶甲)
  {
    id: 'eq_tancan_robe',
    name: "天蠶流光法衣",
    slot: 'armor',
    grade: '凡器',
    atkBonus: 0,
    defBonus: 22,
    hpBonus: 150,
    critBonus: 0,
    dodgeBonus: 2,
    description: "天蠶雪絲細細紡織，能滑開尋常刀箭與妖氣侵蝕。"
  },
  {
    id: 'eq_wujin_armor',
    name: "烏金玄光鎖子甲",
    slot: 'armor',
    grade: '寶器',
    atkBonus: 10,
    defBonus: 55,
    hpBonus: 400,
    critBonus: 0,
    dodgeBonus: 3,
    description: "烏金玄鐵密織百鍛，厚重沉凝，萬斤重擊亦難透。"
  },
  {
    id: 'eq_xuanwu_armor',
    name: "玄武鎮海靈神鎧",
    slot: 'armor',
    grade: '靈器',
    atkBonus: 25,
    defBonus: 135,
    hpBonus: 1100,
    critBonus: 0,
    dodgeBonus: 5,
    specialEffect: "玄武靈罡：大幅削減受到妖獸與天劫之反噬",
    description: "蘊含一縷上古玄武神獸精魄，護體真罡若千尋重水。"
  },
  {
    id: 'eq_zijin_robe',
    name: "九霄紫金太虛仙袍",
    slot: 'armor',
    grade: '仙器',
    atkBonus: 60,
    defBonus: 310,
    hpBonus: 2600,
    critBonus: 0,
    dodgeBonus: 10,
    specialEffect: "太虛護體：減免天劫受創，諸邪辟易",
    description: "仙界三十三天九天玄女採天際紫霞織造之無上仙衣。"
  },

  // 飾品 / 法寶
  {
    id: 'eq_qingxin_jade',
    name: "清音辟邪玉佩",
    slot: 'artifact',
    grade: '凡器',
    atkBonus: 6,
    defBonus: 10,
    hpBonus: 80,
    critBonus: 1,
    dodgeBonus: 2,
    specialEffect: "佩戴時心魔自然增長速度減半",
    description: "翠玉雕琢，隱隱散發清涼道韻，安撫修士紫府識海。"
  },
  {
    id: 'eq_juling_bead',
    name: "太乙聚靈神珠",
    slot: 'artifact',
    grade: '寶器',
    atkBonus: 15,
    defBonus: 20,
    hpBonus: 220,
    critBonus: 3,
    dodgeBonus: 2,
    specialEffect: "洞府聚靈陣蓄氣速度額外 +20%",
    description: "地心靈髓歷經萬載孕育的靈珠，無時不刻都在汲取天地靈氣。"
  },
  {
    id: 'eq_haotian_mirror',
    name: "昊天照妖寶鏡",
    slot: 'artifact',
    grade: '靈器',
    atkBonus: 70,
    defBonus: 45,
    hpBonus: 500,
    critBonus: 6,
    dodgeBonus: 4,
    specialEffect: "照徹幽冥：歷練時對妖獸傷害額外增幅 25%",
    description: "昊天金精打磨的法鏡，鏡光一照，妖魔原形畢露威能大減。"
  },
  {
    id: 'eq_qiankun_ring',
    name: "混元金剛乾坤圈",
    slot: 'artifact',
    grade: '仙器',
    atkBonus: 150,
    defBonus: 120,
    hpBonus: 1400,
    critBonus: 10,
    dodgeBonus: 8,
    specialEffect: "乾坤挪移：擊殺妖魔時掉落靈石與仙草額外 +50%",
    description: "太乙真仙隨身降魔至寶，祭起如金光霹靂，破山分海。"
  }
];

// 煉器圖譜大全 (煉器閣)
export const FORGE_RECIPES: ForgeRecipe[] = [
  {
    id: 'for_hantie_sword',
    name: "鑄造【寒鐵青鋒劍】",
    targetEquipId: 'eq_hantie_sword',
    desc: "凡品飛劍：攻擊+28，暴擊+2%",
    materials: [
      { itemId: 'mat_hantie', count: 3 },
      { itemId: 'monster_dan', count: 1 }
    ],
    stoneCost: 80,
    qiCost: 60,
    successRate: 90,
    masteryGain: 15,
    reqForgeLevel: 1
  },
  {
    id: 'for_tancan_robe',
    name: "編織【天蠶流光法衣】",
    targetEquipId: 'eq_tancan_robe',
    desc: "凡品法衣：防禦+22，氣血+150，閃避+2%",
    materials: [
      { itemId: 'herb_lingcao', count: 4 },
      { itemId: 'mat_hantie', count: 2 }
    ],
    stoneCost: 90,
    qiCost: 70,
    successRate: 90,
    masteryGain: 15,
    reqForgeLevel: 1
  },
  {
    id: 'for_qingxin_jade',
    name: "雕琢【清音辟邪玉佩】",
    targetEquipId: 'eq_qingxin_jade',
    desc: "辟邪法寶：防禦+10，心魔滋生減半",
    materials: [
      { itemId: 'mat_hantie', count: 3 },
      { itemId: 'herb_lingcao', count: 5 }
    ],
    stoneCost: 110,
    qiCost: 80,
    successRate: 85,
    masteryGain: 20,
    reqForgeLevel: 1
  },
  {
    id: 'for_chiyang_blade',
    name: "鍛造【赤陽斬妖劍】",
    targetEquipId: 'eq_chiyang_blade',
    desc: "寶器飛劍：攻擊+65，氣血+100，暴擊+5%",
    materials: [
      { itemId: 'mat_chitong', count: 3 },
      { itemId: 'herb_chiyang', count: 3 },
      { itemId: 'monster_dan', count: 2 }
    ],
    stoneCost: 220,
    qiCost: 150,
    successRate: 80,
    masteryGain: 35,
    reqForgeLevel: 2
  },
  {
    id: 'for_wujin_armor',
    name: "熔鑄【烏金玄光鎖子甲】",
    targetEquipId: 'eq_wujin_armor',
    desc: "寶器重甲：防禦+55，氣血+400，攻擊+10",
    materials: [
      { itemId: 'mat_wujin', count: 2 },
      { itemId: 'mat_chitong', count: 2 },
      { itemId: 'monster_dan', count: 3 }
    ],
    stoneCost: 260,
    qiCost: 180,
    successRate: 75,
    masteryGain: 40,
    reqForgeLevel: 2
  },
  {
    id: 'for_juling_bead',
    name: "淬合【太乙聚靈神珠】",
    targetEquipId: 'eq_juling_bead',
    desc: "聚靈法寶：防禦+20，聚靈陣產能+20%",
    materials: [
      { itemId: 'mat_chitong', count: 3 },
      { itemId: 'spirit_drop', count: 2 },
      { itemId: 'monster_dan', count: 3 }
    ],
    stoneCost: 320,
    qiCost: 220,
    successRate: 75,
    masteryGain: 45,
    reqForgeLevel: 2
  },
  {
    id: 'for_qingzhu_sword',
    name: "祭煉【青竹蜂雲劍】",
    targetEquipId: 'eq_qingzhu_sword',
    desc: "靈器神劍：攻擊+160，防禦+20，氣血+300，暴擊+8%",
    materials: [
      { itemId: 'mat_wujin', count: 4 },
      { itemId: 'mat_wenyu', count: 2 },
      { itemId: 'monster_dan', count: 5 }
    ],
    stoneCost: 550,
    qiCost: 380,
    successRate: 70,
    masteryGain: 75,
    reqForgeLevel: 3
  },
  {
    id: 'for_xuanwu_armor',
    name: "鍛造【玄武鎮海靈神鎧】",
    targetEquipId: 'eq_xuanwu_armor',
    desc: "靈器寶鎧：防禦+135，氣血+1100，抵禦天雷劫",
    materials: [
      { itemId: 'mat_wujin', count: 4 },
      { itemId: 'herb_xuelian', count: 3 },
      { itemId: 'monster_dan', count: 6 }
    ],
    stoneCost: 650,
    qiCost: 450,
    successRate: 65,
    masteryGain: 85,
    reqForgeLevel: 3
  },
  {
    id: 'for_haotian_mirror',
    name: "鑄就【昊天照妖寶鏡】",
    targetEquipId: 'eq_haotian_mirror',
    desc: "靈器寶鏡：攻擊+70，對妖獸傷害+25%",
    materials: [
      { itemId: 'mat_wenyu', count: 3 },
      { itemId: 'mat_wujin', count: 3 },
      { itemId: 'monster_dan', count: 5 }
    ],
    stoneCost: 700,
    qiCost: 500,
    successRate: 65,
    masteryGain: 90,
    reqForgeLevel: 3
  },
  {
    id: 'for_zhuxian_blade',
    name: "解禁【太初誅仙殘刃】",
    targetEquipId: 'eq_zhuxian_blade',
    desc: "仙器兇兵：攻擊+380，暴擊+15%，誅仙戮神",
    materials: [
      { itemId: 'mat_wenyu', count: 5 },
      { itemId: 'mat_wujin', count: 8 },
      { itemId: 'monster_dan', count: 10 }
    ],
    stoneCost: 1500,
    qiCost: 1000,
    successRate: 55,
    masteryGain: 150,
    reqForgeLevel: 4
  },
  {
    id: 'for_zijin_robe',
    name: "編織【九霄紫金太虛仙袍】",
    targetEquipId: 'eq_zijin_robe',
    desc: "仙器仙衣：防禦+310，氣血+2600，閃避+10%",
    materials: [
      { itemId: 'mat_wenyu', count: 6 },
      { itemId: 'herb_xuelian', count: 5 },
      { itemId: 'monster_dan', count: 8 }
    ],
    stoneCost: 1600,
    qiCost: 1100,
    successRate: 55,
    masteryGain: 160,
    reqForgeLevel: 4
  },
  {
    id: 'for_qiankun_ring',
    name: "重鑄【混元金剛乾坤圈】",
    targetEquipId: 'eq_qiankun_ring',
    desc: "仙器至寶：攻擊+150，防禦+120，歷練獲益+50%",
    materials: [
      { itemId: 'mat_wenyu', count: 8 },
      { itemId: 'mat_wujin', count: 6 },
      { itemId: 'monster_dan', count: 12 }
    ],
    stoneCost: 2000,
    qiCost: 1400,
    successRate: 50,
    masteryGain: 200,
    reqForgeLevel: 5
  }
];

// 豐富的隨機遊歷事件庫 (偶遇高人、仙府奇遇、古修遺蹟、正邪抉擇、天道機緣)
export const ADVENTURE_RANDOM_EVENTS: AdventureEvent[] = [
  {
    id: 'event_old_master',
    title: '【偶遇隱世高人】松風垂釣老叟',
    description: '行至深谷寒潭，只見一白髮青衫老者於孤石垂釣。其周身無半點真元波動，卻令四方山林靈鳥俯首。老者抬眼望你：「後生道友，仙路漫漫，你因何向道？」',
    type: 'master',
    choices: [
      {
        text: '恭敬叩首請益長生大道 (奉上 50 靈石)',
        actionId: 'master_advice',
        costDesc: '消耗 50 靈石'
      },
      {
        text: '靜坐一旁，閉目默察前輩周天劍意',
        actionId: 'master_sword',
        costDesc: '無消耗'
      },
      {
        text: '躬身行禮，不作叨擾從容離去',
        actionId: 'master_leave',
        costDesc: '無消耗'
      }
    ]
  },
  {
    id: 'event_ancient_relic',
    title: '【奇遇機緣】上古散仙閉關石室',
    description: '撥開千年藤蘿，絕壁陡然顯露出一尊被九幽玄陰大陣封閉的青銅古門，內有異香撲鼻、寶光隱隱若現！',
    type: 'relic',
    choices: [
      {
        text: '運轉氣海真元，強行破擊陣法禁制',
        actionId: 'relic_force',
        costDesc: '考驗修士攻擊力'
      },
      {
        text: '以聚靈之氣細細推演破陣樞紐',
        actionId: 'relic_qi',
        costDesc: '消耗 100 靈氣'
      },
      {
        text: '謹慎避開未知殺陣，繞道前行',
        actionId: 'relic_bypass',
        costDesc: '無消耗'
      }
    ]
  },
  {
    id: 'event_holy_spring',
    title: '【天地造化】千年玄冰洗髓靈泉',
    description: '岩隙汩汩流出一泓翡翠般的靈泉，熱氣升騰如薄霧。靈液之中蘊含純淨的天地甘霖，沁人心脾。',
    type: 'spring',
    choices: [
      {
        text: '褪衣躍入靈泉，洗髓伐毛、滌蕩道心',
        actionId: 'spring_bathe',
        costDesc: '心魔驟降，真元大補'
      },
      {
        text: '取出乾坤葫蘆盛裝靈泉封存',
        actionId: 'spring_bottle',
        costDesc: '獲得靈泉藥引'
      }
    ]
  },
  {
    id: 'event_bandit_cultivator',
    title: '【突遇死劫】黑風煞魔道劫修',
    description: '血煞腥風呼嘯！三名渾身魔紋的築基魔修自迷霧中縱身躍出，手持白骨魔刃獰笑：「呔！留下儲物袋與本命精血，饒你全屍！」',
    type: 'enemy',
    choices: [
      {
        text: '祭出本命飛劍，替天行道拔劍斬魔！',
        actionId: 'bandit_fight',
        costDesc: '生死交鋒，奪其行囊'
      },
      {
        text: '施展血遁神速之法，破空遠遁避敵',
        actionId: 'bandit_flee',
        costDesc: '消耗少量氣血'
      }
    ]
  },
  {
    id: 'event_dying_taoist',
    title: '【道義抉擇】垂死重傷的名門修士',
    description: '亂石堆中臥著一名奄奄一息的名門真傳弟子，腹部被妖爪撕裂，神識潰散。見你行來，他顫抖伸出血手：「道友...救我...若施援手...必有厚報...」',
    type: 'dying',
    choices: [
      {
        text: '毫不猶豫施贈一枚【清心玉露丹】救其性命',
        actionId: 'dying_save',
        costDesc: '消耗 1 枚清心丹'
      },
      {
        text: '冷眼旁觀，趁火打劫奪其身旁法寶行囊',
        actionId: 'dying_loot',
        costDesc: '獲得財富但心魔+20'
      },
      {
        text: '凡塵生死各由天命，合十默哀後轉身離去',
        actionId: 'dying_ignore',
        costDesc: '無消耗'
      }
    ]
  },
  {
    id: 'event_traveling_merchant',
    title: '【雲遊行商】天機閣千寶道人',
    description: '一隻背負青銅寶樓的巨大玄龜悠悠行過，樓上道人朝你作揖：「貧道天機閣巡遊散人，網羅天下奇珍異鐵。相逢即是有緣，道友可願兌換靈物？」',
    type: 'merchant',
    choices: [
      {
        text: '以 150 靈石換購【罕見赤陽靈花 2 株】',
        actionId: 'merchant_herb',
        costDesc: '消耗 150 靈石'
      },
      {
        text: '以 200 靈石換購【烏金玄鐵 1 塊】',
        actionId: 'merchant_iron',
        costDesc: '消耗 200 靈石'
      },
      {
        text: '揮手婉拒，各自趕路',
        actionId: 'merchant_leave',
        costDesc: '無消耗'
      }
    ]
  },
  {
    id: 'event_meet_ziling',
    title: '【紅塵奇遇】靈動小醫仙 · 紫菱受阻',
    description: '山澗幽徑傳來呼救之聲，只見一名身著粉綠長裙的清麗少女被數隻毒瘴妖蠍圍攻。你劍光如電替其解圍。少女驚魂甫定，美眸閃動，盈盈拜謝：「百草門紫菱多謝恩公仗義出手！小女子願與道友結伴修好！」',
    type: 'companion',
    choices: [
      {
        text: '欣然應允結識，互換傳音靈鶴 (結為道侶)',
        actionId: 'companion_ziling_accept',
        costDesc: '解鎖道侶【紫菱】'
      },
      {
        text: '贈其療傷靈草，淡然辭別',
        actionId: 'companion_ziling_decline',
        costDesc: '無消耗'
      }
    ]
  },
  {
    id: 'event_meet_yanruyan',
    title: '【紅塵奇遇】魅影魔姬 · 燕如嫣之諾',
    description: '古修魔窟之中，魔門聖女燕如嫣正在調息壓制反噬魔火，黑紗飄舞，妖嬈冷豔。見你踏入，她赤眸微斂：「正道修士？若非本座遭人暗算，此刻你已是劍下亡魂...不過，你若肯借我一縷純陽真氣護脈，本座欠你一個天大人情！」',
    type: 'companion',
    choices: [
      {
        text: '不懼正魔殊途，運純陽真元相助療傷 (結為道侶)',
        actionId: 'companion_yanruyan_accept',
        costDesc: '消耗 50 靈氣，解鎖道侶【燕如嫣】'
      },
      {
        text: '魔道妖女詭詐，冷哼一聲避而遠之',
        actionId: 'companion_yanruyan_decline',
        costDesc: '無消耗'
      }
    ]
  },
  {
    id: 'event_meet_yinyue',
    title: '【紅塵奇遇】雪嶺救狐 · 天狐仙姬現身',
    description: '茫茫雪嶺松風呼嘯，一隻通體晶瑩的雪白小狐狸倒臥在雪堆中。你取出真元靈露為其療傷。白狐周身驟然綻放萬道霞光，化作生有絨絨狐耳的絕美銀髮天狐仙姬，巧笑嫣然挽住你的手臂：「嘻嘻～恩公心善，銀月願常伴恩公雙修問道！」',
    type: 'companion',
    choices: [
      {
        text: '結此曠世仙緣，納入識海同行 (結為道侶)',
        actionId: 'companion_yinyue_accept',
        costDesc: '解鎖道侶【銀月】'
      },
      {
        text: '人妖有別，婉言相拒',
        actionId: 'companion_yinyue_decline',
        costDesc: '無消耗'
      }
    ]
  }
];
