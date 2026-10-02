import React, { useRef, useEffect, useState } from 'react';
import { LogEntry } from '../types/game';
import { Terminal, Trash2, ArrowDownCircle } from 'lucide-react';

interface MudTerminalProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

export const MudTerminal: React.FC<MudTerminalProps> = ({ logs, onClearLogs }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<string>('all');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);

  useEffect(() => {
    if (autoScroll && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'break' && log.type === 'break') return true;
    if (filter === 'battle' && log.type === 'battle') return true;
    if (filter === 'gain' && log.type === 'gain') return true;
    if (filter === 'craft' && log.type === 'craft') return true;
    if (filter === 'demon' && log.type === 'demon') return true;
    return false;
  });

  const getTagColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'break':
        return 'text-amber-400 font-semibold';
      case 'battle':
        return 'text-rose-400 font-semibold';
      case 'gain':
        return 'text-emerald-400';
      case 'craft':
        return 'text-amber-300 font-semibold';
      case 'sect':
        return 'text-yellow-400 font-semibold';
      case 'companion':
        return 'text-pink-400 font-semibold';
      case 'demon':
        return 'text-purple-400 font-semibold';
      case 'event':
        return 'text-cyan-400';
      case 'world':
      default:
        return 'text-[#88c0d0]';
    }
  };

  const getTagName = (type: LogEntry['type']) => {
    switch (type) {
      case 'break':
        return '[破境]';
      case 'battle':
        return '[戰鬥]';
      case 'gain':
        return '[獲益]';
      case 'craft':
        return '[百藝]';
      case 'sect':
        return '[宗門]';
      case 'companion':
        return '[道侶]';
      case 'demon':
        return '[心魔]';
      case 'event':
        return '[奇遇]';
      case 'world':
      default:
        return '[天道]';
    }
  };

  return (
    <div className="bg-[#090b0e] border-t border-[#252b38] flex flex-col h-44 sm:h-48 text-xs font-mono select-text">
      {/* Terminal Bar */}
      <div className="bg-[#10131a] border-b border-[#1f2430] px-3 py-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#5e81ac]" />
          <span className="text-[#7c889f] font-sans font-medium text-[11px]">仙途行紀 (MUD歷練文字流)</span>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-1.5 py-0.5 rounded text-[11px] transition ${
              filter === 'all' ? 'bg-[#2e3440] text-amber-300' : 'text-[#65738c] hover:text-[#9aa7be]'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFilter('break')}
            className={`px-1.5 py-0.5 rounded text-[11px] transition ${
              filter === 'break' ? 'bg-[#2e3440] text-amber-300' : 'text-[#65738c] hover:text-[#9aa7be]'
            }`}
          >
            突破
          </button>
          <button
            onClick={() => setFilter('battle')}
            className={`px-1.5 py-0.5 rounded text-[11px] transition ${
              filter === 'battle' ? 'bg-[#2e3440] text-rose-300' : 'text-[#65738c] hover:text-[#9aa7be]'
            }`}
          >
            戰鬥
          </button>
          <button
            onClick={() => setFilter('gain')}
            className={`px-1.5 py-0.5 rounded text-[11px] transition ${
              filter === 'gain' ? 'bg-[#2e3440] text-emerald-300' : 'text-[#65738c] hover:text-[#9aa7be]'
            }`}
          >
            收穫
          </button>
          <button
            onClick={() => setFilter('craft')}
            className={`px-1.5 py-0.5 rounded text-[11px] transition ${
              filter === 'craft' ? 'bg-[#2e3440] text-amber-200' : 'text-[#65738c] hover:text-[#9aa7be]'
            }`}
          >
            百藝
          </button>

          <div className="w-[1px] h-3 bg-[#242b38] mx-1" />

          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`p-1 rounded transition ${autoScroll ? 'text-cyan-400' : 'text-[#555f72]'}`}
            title={autoScroll ? "已鎖定滾動至底部" : "點擊鎖定滾動至最新"}
          >
            <ArrowDownCircle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClearLogs}
            className="p-1 text-[#65738c] hover:text-rose-400 rounded transition"
            title="清空卷宗"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Window */}
      <div
        ref={terminalRef}
        onScroll={() => {
          if (!terminalRef.current) return;
          const { scrollTop, scrollHeight, clientHeight } = terminalRef.current;
          const isAtBottom = scrollHeight - scrollTop - clientHeight < 20;
          if (autoScroll !== isAtBottom) {
            setAutoScroll(isAtBottom);
          }
        }}
        className="flex-1 overflow-y-auto p-2.5 space-y-1 leading-relaxed text-[#c0c8d6]"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-[#4c566a] italic">天道浩渺，暫無此類記錄...</div>
        ) : (
          filteredLogs.map(log => (
            <div key={log.id} className="flex items-start gap-1.5 hover:bg-[#131620]/60 px-1 py-0.5 rounded">
              <span className="text-[#434c5e] text-[10px] tabular-nums shrink-0 mt-0.5">[{log.time}]</span>
              <span className={`shrink-0 text-[11px] ${getTagColor(log.type)}`}>
                {getTagName(log.type)}
              </span>
              <span className={`break-words flex-1 ${log.type === 'break' ? 'text-[#e5c07b] font-medium' : log.type === 'demon' ? 'text-purple-300' : ''}`}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
