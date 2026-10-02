import React from 'react';
import { OfflineGainResult } from '../utils/storage';
import { Moon, Sparkles, Sprout, ArrowRight } from 'lucide-react';

interface OfflineModalProps {
  offlineGains: OfflineGainResult | null;
  onClose: () => void;
}

export const OfflineModal: React.FC<OfflineModalProps> = ({ offlineGains, onClose }) => {
  if (!offlineGains) return null;

  const minutes = Math.floor(offlineGains.elapsedSeconds / 60);
  const hours = (offlineGains.elapsedSeconds / 3600).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-md bg-[#13161f] border border-[#2e3648] rounded-xl p-5 shadow-2xl text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-300">
          <Moon className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-lg font-serif font-bold text-amber-300">
            【神遊太虛 · 閉關修煉結算】
          </h3>
          <p className="text-xs text-[#7e8ba0] mt-1">
            道友神遊凡塵閉關約 <b className="text-[#d8dee9]">{minutes < 60 ? `${minutes} 分鐘` : `${hours} 小時`}</b>，洞府陣法日夜運轉不休，為您積蓄真元：
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 bg-[#0d0f15] border border-[#212735] p-3 rounded-lg text-xs">
          <div>
            <div className="text-[#6d798e]">滋養修為</div>
            <div className="font-mono font-bold text-cyan-300 text-sm mt-0.5">
              +{offlineGains.expGained.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[#6d798e]">靈池真元</div>
            <div className="font-mono font-bold text-amber-300 text-sm mt-0.5">
              +{offlineGains.qiGained.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[#6d798e]">採集靈草</div>
            <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">
              +{offlineGains.herbGained} 株
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded font-serif font-bold text-xs bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 transition cursor-pointer active:scale-[0.98]"
        >
          破關出定 · 繼續仙途
        </button>
      </div>
    </div>
  );
};
