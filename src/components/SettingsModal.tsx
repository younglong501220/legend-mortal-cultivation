import React, { useState } from 'react';
import { PlayerState } from '../types/game';
import { exportSaveCode, importSaveCode, clearSave } from '../utils/storage';
import { X, Copy, Check, Download, Upload, AlertOctagon, User, BookOpen } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  player: PlayerState;
  onClose: () => void;
  onUpdatePlayer: (newPlayer: PlayerState) => void;
  onResetGame: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  player,
  onClose,
  onUpdatePlayer,
  onResetGame
}) => {
  const [saveCode, setSaveCode] = useState<string>('');
  const [importCode, setImportCode] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [nameInput, setNameInput] = useState<string>(player.name || '韓立');

  if (!isOpen) return null;

  const handleExport = () => {
    const code = exportSaveCode(player);
    setSaveCode(code);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    if (!importCode.trim()) return;
    const imported = importSaveCode(importCode);
    if (imported) {
      onUpdatePlayer(imported);
      setErrorMsg('');
      alert('天道符文引導成功，進度已恢復！');
      onClose();
    } else {
      setErrorMsg('存檔符文無效或損毀，無法載入！');
    }
  };

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    onUpdatePlayer({ ...player, name: nameInput.trim() });
    alert('道號已更名！');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg bg-[#141720] border border-[#2e3546] rounded-xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#252b39] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-amber-400 rounded-full" />
            <h3 className="text-base font-serif font-bold text-amber-300">天道天盤 · 存檔與修真設定</h3>
          </div>
          <button onClick={onClose} className="text-[#6d798e] hover:text-[#d8dee9] p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Change Cultivator Name */}
        <div className="space-y-2 bg-[#101219] p-3 rounded-lg border border-[#212634]">
          <div className="text-xs font-serif font-bold text-[#d8dee9] flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>修士道號更易</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              maxLength={8}
              placeholder="請輸入道號"
              className="flex-1 bg-[#161a24] border border-[#2e3648] rounded px-3 py-1.5 text-xs text-[#d8dee9] focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={handleSaveName}
              className="px-3 py-1.5 bg-[#252c3c] hover:bg-[#31394c] border border-[#3b455b] text-amber-300 rounded text-xs transition"
            >
              更定道號
            </button>
          </div>
        </div>

        {/* Save Code Export */}
        <div className="space-y-2 bg-[#101219] p-3 rounded-lg border border-[#212634]">
          <div className="text-xs font-serif font-bold text-[#d8dee9] flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>導出本機存檔 (生成傳承玉簡)</span>
          </div>
          <p className="text-[11px] text-[#717e93]">
            本遊戲支援本機瀏覽器 localStorage 自動無感保存。您亦可導出字串代碼至記事本備份。
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="w-full py-2 px-3 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 rounded text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '存檔代碼已複製到剪貼板！' : '點擊生成並複製傳承玉簡代碼'}</span>
            </button>
          </div>
        </div>

        {/* Save Code Import */}
        <div className="space-y-2 bg-[#101219] p-3 rounded-lg border border-[#212634]">
          <div className="text-xs font-serif font-bold text-[#d8dee9] flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>導入傳承玉簡</span>
          </div>
          <textarea
            value={importCode}
            onChange={e => setImportCode(e.target.value)}
            placeholder="請在此粘貼備份的傳承玉簡代碼..."
            className="w-full h-16 bg-[#161a24] border border-[#2e3648] rounded p-2 text-[11px] font-mono text-[#a0abbf] focus:outline-none focus:border-emerald-400"
          />
          {errorMsg && <div className="text-xs text-rose-400">{errorMsg}</div>}
          <button
            onClick={handleImport}
            className="w-full py-1.5 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 rounded text-xs font-medium transition cursor-pointer"
          >
            導入恢復進度
          </button>
        </div>

        {/* Reset / Rebirth */}
        <div className="pt-2 border-t border-[#252b39] flex items-center justify-between">
          <div className="text-[11px] text-[#717d91]">
            兵解轉世：徹底重置所有修為進度
          </div>
          <button
            onClick={() => {
              if (confirm('天道無情！確定要兵解轉世、徹底清空本機存檔重新開始嗎？')) {
                onResetGame();
                onClose();
              }
            }}
            className="py-1 px-3 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 text-rose-300 rounded text-xs transition cursor-pointer"
          >
            兵解轉世 (重置存檔)
          </button>
        </div>
      </div>
    </div>
  );
};
