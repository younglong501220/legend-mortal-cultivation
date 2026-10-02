import React, { useState } from 'react';
import { PlayerState, HegemonyDayStat } from '../../types/game';
import { DEFAULT_HEGEMONY_WEEKLY_HISTORY } from '../../utils/constants';
import {
  TrendingUp,
  Award,
  Swords,
  Coins,
  ShieldAlert,
  Percent,
  Sparkles,
  BarChart3,
  Calendar,
  ChevronRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';

interface HegemonyStatsViewProps {
  player: PlayerState;
  onGoToBattle?: () => void;
}

// Custom Tooltip for recharts
const CustomHegemonyTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data: any = payload[0].payload;
    const winRateImpact = data.winRateImpact ?? Math.round(data.winRate * 4);
    const totalStacked = (data.cumulativeContribution || 0) + (data.contributionEarned || 0) + winRateImpact;

    return (
      <div className="bg-[#12151d] border border-amber-500/40 p-3 rounded-lg shadow-2xl text-xs space-y-1.5 font-sans min-w-[210px]">
        <div className="font-serif font-bold text-amber-300 border-b border-[#252c3c] pb-1.5 flex items-center justify-between">
          <span>{label} 爭霸回顧</span>
          <span className="text-[10px] text-cyan-400 font-mono">
            {data.wins} 勝 / {data.losses} 負
          </span>
        </div>
        <div className="flex justify-between items-center text-[#98a4b8]">
          <span>出征勝率：</span>
          <span className={`font-bold font-mono ${data.winRate >= 70 ? 'text-emerald-400' : data.winRate >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
            {data.winRate}% (勝率轉化指數: +{winRateImpact})
          </span>
        </div>
        <div className="flex justify-between items-center text-[#98a4b8]">
          <span>當日所掠貢獻：</span>
          <span className="text-cyan-300 font-mono font-semibold">+{data.contributionEarned} 點</span>
        </div>
        <div className="flex justify-between items-center text-[#98a4b8]">
          <span>往昔累計貢獻：</span>
          <span className="text-amber-400 font-mono font-bold">{data.cumulativeContribution} 點</span>
        </div>
        <div className="flex justify-between items-center text-amber-200 border-t border-[#222938] pt-1 text-[11px]">
          <span>堆疊綜合戰績值：</span>
          <span className="font-mono font-bold text-amber-300">{totalStacked} 點</span>
        </div>
      </div>
    );
  }
  return null;
};

export const HegemonyStatsView: React.FC<HegemonyStatsViewProps> = ({ player, onGoToBattle }) => {
  const [chartMode, setChartMode] = useState<'stacked' | 'composed' | 'winrate' | 'contribution'>('stacked');

  const history: HegemonyDayStat[] =
    player.alliance?.hegemonyWeeklyHistory && player.alliance.hegemonyWeeklyHistory.length > 0
      ? player.alliance.hegemonyWeeklyHistory
      : DEFAULT_HEGEMONY_WEEKLY_HISTORY;

  // Enrich with stacked values for the stacked area visualization
  const stackedChartData = history.map(d => ({
    ...d,
    winRateImpact: Math.round(d.winRate * 4) // Scaled impact points (e.g. 100% = 400 pts)
  }));

  // Aggregate totals over past 7 days
  const totalBattles = history.reduce((acc, curr) => acc + curr.battles, 0);
  const totalWins = history.reduce((acc, curr) => acc + curr.wins, 0);
  const overallWinRate = totalBattles > 0 ? Math.round((totalWins / totalBattles) * 100) : 0;
  const totalContribution = history.reduce((acc, curr) => acc + curr.contributionEarned, 0);
  const currentCumulative = history.length > 0 ? history[history.length - 1].cumulativeContribution : 0;

  return (
    <div className="space-y-4">
      {/* 標題與簡介 */}
      <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252b39] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-amber-400 rounded-full" />
            <h3 className="text-sm sm:text-base font-serif font-bold text-amber-300 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>仙盟爭霸戰績 · 過去一週勝率與貢獻趨勢</span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8a96ab] flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>近 7 日戰事回溯</span>
            </span>
            {onGoToBattle && (
              <button
                onClick={onGoToBattle}
                className="px-2.5 py-1 bg-gradient-to-r from-rose-900 to-rose-700 hover:from-rose-800 hover:to-rose-600 border border-rose-500/40 text-rose-100 rounded text-xs font-serif font-semibold cursor-pointer active:scale-95 transition"
              >
                出征爭霸
              </button>
            )}
          </div>
        </div>

        {/* 核心戰績統計卡片 (KPI Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="bg-[#11141c] border border-[#242b3b] p-3 rounded-lg flex flex-col justify-between">
            <span className="text-[#727e93] flex items-center gap-1">
              <Swords className="w-3.5 h-3.5 text-rose-400" /> 7日出征場次
            </span>
            <div className="text-lg font-bold font-mono text-rose-200 mt-1">
              {totalBattles} <span className="text-xs text-[#6e7a8f] font-normal">戰</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono mt-0.5">
              共計大捷 {totalWins} 場
            </span>
          </div>

          <div className="bg-[#11141c] border border-[#242b3b] p-3 rounded-lg flex flex-col justify-between">
            <span className="text-[#727e93] flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-amber-400" /> 綜合勝率趨勢
            </span>
            <div className="text-lg font-bold font-mono text-amber-300 mt-1">
              {overallWinRate}%
            </div>
            <span className="text-[11px] text-[#788599] font-mono mt-0.5">
              {overallWinRate >= 80 ? '登峰造極 · 所向披靡' : overallWinRate >= 60 ? '穩佔上風 · 越戰越勇' : '神煞兇頑 · 尚需磨礪'}
            </span>
          </div>

          <div className="bg-[#11141c] border border-[#242b3b] p-3 rounded-lg flex flex-col justify-between">
            <span className="text-[#727e93] flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-cyan-400" /> 本週掠得貢獻
            </span>
            <div className="text-lg font-bold font-mono text-cyan-300 mt-1">
              +{totalContribution} <span className="text-xs text-[#6e7a8f] font-normal">點</span>
            </div>
            <span className="text-[11px] text-cyan-500 font-mono mt-0.5">
              全盟爭先 · 榮耀入簿
            </span>
          </div>

          <div className="bg-[#11141c] border border-[#242b3b] p-3 rounded-lg flex flex-col justify-between">
            <span className="text-[#727e93] flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-purple-400" /> 累計戰功總額
            </span>
            <div className="text-lg font-bold font-mono text-purple-300 mt-1">
              {player.alliance?.hegemonyScore || 0} <span className="text-xs text-[#6e7a8f] font-normal">分</span>
            </div>
            <span className="text-[11px] text-purple-400 font-mono mt-0.5">
              累計總貢獻 {currentCumulative} 點
            </span>
          </div>
        </div>

        {/* 圖表類型切換 */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap bg-[#0f1218] border border-[#242b3b] p-0.5 rounded-lg text-xs gap-1">
            <button
              onClick={() => setChartMode('stacked')}
              className={`px-3 py-1 rounded transition cursor-pointer ${
                chartMode === 'stacked'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40 shadow-sm'
                  : 'text-[#7e8aa0] hover:text-[#c4cedd]'
              }`}
            >
              勝率與貢獻堆疊區域圖 (推薦)
            </button>
            <button
              onClick={() => setChartMode('composed')}
              className={`px-3 py-1 rounded transition cursor-pointer ${
                chartMode === 'composed'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40 shadow-sm'
                  : 'text-[#7e8aa0] hover:text-[#c4cedd]'
              }`}
            >
              勝率與累計貢獻雙軌圖
            </button>
            <button
              onClick={() => setChartMode('winrate')}
              className={`px-3 py-1 rounded transition cursor-pointer ${
                chartMode === 'winrate'
                  ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/40 shadow-sm'
                  : 'text-[#7e8aa0] hover:text-[#c4cedd]'
              }`}
            >
              勝率走勢面積圖 (%)
            </button>
            <button
              onClick={() => setChartMode('contribution')}
              className={`px-3 py-1 rounded transition cursor-pointer ${
                chartMode === 'contribution'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm'
                  : 'text-[#7e8aa0] hover:text-[#c4cedd]'
              }`}
            >
              每日與累計貢獻柱狀圖
            </button>
          </div>

          <span className="text-[11px] text-[#6b778c] hidden sm:inline">
            懸停或點擊節點查看逐日詳情
          </span>
        </div>

        {/* Recharts 圖表容器 */}
        <div className="bg-[#10131b] border border-[#222736] p-3 sm:p-4 rounded-xl">
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartMode === 'stacked' ? (
                <AreaChart data={stackedChartData} margin={{ top: 15, right: 20, bottom: 5, left: -5 }}>
                  <defs>
                    <linearGradient id="stackGradCumul" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d97706" stopOpacity={0.85} />
                      <stop offset="100%" stopColor="#b45309" stopOpacity={0.35} />
                    </linearGradient>
                    <linearGradient id="stackGradDaily" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.85} />
                      <stop offset="100%" stopColor="#0891b2" stopOpacity={0.35} />
                    </linearGradient>
                    <linearGradient id="stackGradWin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.85} />
                      <stop offset="100%" stopColor="#e11d48" stopOpacity={0.35} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#232938" vertical={false} />
                  <XAxis dataKey="dayLabel" stroke="#5a677d" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} unit="點" />
                  <Tooltip content={<CustomHegemonyTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
                  <Area
                    type="monotone"
                    dataKey="cumulativeContribution"
                    stackId="1"
                    name="累計總貢獻底蘊"
                    stroke="#d97706"
                    strokeWidth={2}
                    fill="url(#stackGradCumul)"
                  />
                  <Area
                    type="monotone"
                    dataKey="contributionEarned"
                    stackId="1"
                    name="當日爭霸掠獲貢獻"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fill="url(#stackGradDaily)"
                  />
                  <Area
                    type="monotone"
                    dataKey="winRateImpact"
                    stackId="1"
                    name="勝率轉化戰力指數"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fill="url(#stackGradWin)"
                  />
                </AreaChart>
              ) : chartMode === 'composed' ? (
                <ComposedChart data={history} margin={{ top: 15, right: 20, bottom: 5, left: -10 }}>
                  <defs>
                    <linearGradient id="contribBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#0891b2" stopOpacity={0.25} />
                    </linearGradient>
                    <linearGradient id="cumulLineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d97706" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#d97706" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#232938" vertical={false} />
                  <XAxis
                    dataKey="dayLabel"
                    stroke="#5a677d"
                    fontSize={11}
                    tickLine={false}
                  />
                  {/* Left Y Axis: Contribution points */}
                  <YAxis
                    yAxisId="left"
                    stroke="#0891b2"
                    fontSize={10}
                    domain={[0, 'auto']}
                    tickLine={false}
                    unit="點"
                  />
                  {/* Right Y Axis: Win rate % */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#f59e0b"
                    fontSize={10}
                    domain={[0, 100]}
                    tickLine={false}
                    unit="%"
                  />
                  <Tooltip content={<CustomHegemonyTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    iconType="circle"
                  />
                  <ReferenceLine
                    yAxisId="right"
                    y={50}
                    stroke="#475569"
                    strokeDasharray="4 4"
                    label={{ value: '50% 基準', fill: '#64748b', fontSize: 10, position: 'right' }}
                  />
                  {/* Daily contribution bar */}
                  <Bar
                    yAxisId="left"
                    dataKey="contributionEarned"
                    name="當日掠得貢獻"
                    fill="url(#contribBarGrad)"
                    radius={[4, 4, 0, 0]}
                    barSize={18}
                  />
                  {/* Cumulative contribution area */}
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="cumulativeContribution"
                    name="累計總貢獻"
                    fill="url(#cumulLineGrad)"
                    stroke="#d97706"
                    strokeWidth={2}
                  />
                  {/* Win rate line */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="winRate"
                    name="爭霸勝率 (%)"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ fill: '#f59e0b', r: 4, strokeWidth: 2, stroke: '#141720' }}
                    activeDot={{ r: 6, fill: '#fbbf24' }}
                  />
                </ComposedChart>
              ) : chartMode === 'winrate' ? (
                <ComposedChart data={history} margin={{ top: 15, right: 20, bottom: 5, left: -10 }}>
                  <defs>
                    <linearGradient id="winRateArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#232938" vertical={false} />
                  <XAxis dataKey="dayLabel" stroke="#5a677d" fontSize={11} tickLine={false} />
                  <YAxis stroke="#f43f5e" fontSize={10} domain={[0, 100]} tickLine={false} unit="%" />
                  <Tooltip content={<CustomHegemonyTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <ReferenceLine y={50} stroke="#475569" strokeDasharray="4 4" label={{ value: '50% 均衡線', fill: '#64748b', fontSize: 10 }} />
                  <ReferenceLine y={80} stroke="#10b981" strokeDasharray="4 4" label={{ value: '80% 凌雲線', fill: '#10b981', fontSize: 10 }} />
                  <Area
                    type="monotone"
                    dataKey="winRate"
                    name="爭霸出征勝率 (%)"
                    fill="url(#winRateArea)"
                    stroke="#f43f5e"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="winRate"
                    stroke="#fb7185"
                    strokeWidth={2}
                    dot={{ fill: '#fb7185', r: 4 }}
                  />
                </ComposedChart>
              ) : (
                <ComposedChart data={history} margin={{ top: 15, right: 20, bottom: 5, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#232938" vertical={false} />
                  <XAxis dataKey="dayLabel" stroke="#5a677d" fontSize={11} tickLine={false} />
                  <YAxis stroke="#06b6d4" fontSize={10} domain={[0, 'auto']} tickLine={false} unit="點" />
                  <Tooltip content={<CustomHegemonyTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar
                    dataKey="contributionEarned"
                    name="當日爭霸所掠貢獻"
                    fill="#06b6d4"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulativeContribution"
                    name="過去一週貢獻累計走勢"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ fill: '#10b981', r: 3 }}
                  />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* 逐日爭霸明細清單 (Detailed breakdown table) */}
        <div className="bg-[#11141c] border border-[#212735] p-3 rounded-lg">
          <div className="text-xs font-serif font-bold text-[#c2cee0] mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>近 7 日逐日交鋒戰績回顧</span>
            </span>
            <span className="text-[10px] text-[#6a768b]">即時隨每次爭霸出征動態同步</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-xs font-mono">
            {history.map((h, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border text-center transition ${
                  h.dayLabel === '今日'
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                    : 'bg-[#141822] border-[#222a3a] text-[#8e9cb0]'
                }`}
              >
                <div className="text-[11px] font-sans font-semibold mb-1 text-[#a5b3c7]">
                  {h.dayLabel}
                </div>
                <div className="text-xs font-bold text-emerald-400">
                  {h.wins}勝 / {h.losses}負
                </div>
                <div className={`text-[11px] font-bold mt-0.5 ${h.winRate >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {h.winRate}% 勝率
                </div>
                <div className="text-[10px] text-cyan-300 mt-1 border-t border-[#202736] pt-1">
                  +{h.contributionEarned} 貢獻
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 兵法戰略建言 */}
        <div className="bg-[#11151f] border border-amber-500/20 p-3 rounded-lg text-xs space-y-1">
          <div className="font-serif font-bold text-amber-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>仙盟爭霸戰略備忘錄</span>
          </div>
          <p className="text-[11px] text-[#8694a8] leading-relaxed">
            道友勝率已達 <b className="text-amber-300 font-mono">{overallWinRate}%</b>。出征爭霸前，建議攜帶合體連攜道侶（如南宮婉增傷或燕如嫣致命暴擊），並研習仙盟心法【萬道歸一戰陣典】與【乾坤同氣化神訣】，可大幅化解神煞魔甲，確保奪下高階天脈天池！
          </p>
        </div>
      </div>
    </div>
  );
};
