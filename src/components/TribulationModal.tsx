import React, { useEffect, useState } from 'react';
import { Zap, ShieldAlert, Sparkles, CheckCircle, Skull } from 'lucide-react';

interface TribulationModalProps {
  isOpen: boolean;
  isAscension: boolean;
  realmName: string;
  isSuccess: boolean;
  onClose: () => void;
}

export const TribulationModal: React.FC<TribulationModalProps> = ({
  isOpen,
  isAscension,
  realmName,
  isSuccess,
  onClose
}) => {
  const [phase, setPhase] = useState<'gathering' | 'striking' | 'result'>('gathering');
  const [strikes, setStrikes] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setPhase('gathering');
      setStrikes(0);
      return;
    }

    // Sequence:
    // 0~1000ms: gathering
    // 1000~2500ms: striking
    // 2500ms+: result
    const timer1 = setTimeout(() => {
      setPhase('striking');
    }, 1000);

    const interval = setInterval(() => {
      setStrikes(prev => (prev < 9 ? prev + 1 : prev));
    }, 200);

    const timer2 = setTimeout(() => {
      clearInterval(interval);
      setPhase('result');
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(interval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-md bg-[#12151c] border-2 border-[#394254] rounded-xl p-6 shadow-2xl text-center overflow-hidden">
        {/* Thunder flash background */}
        {phase === 'striking' && (
          <div className="absolute inset-0 bg-blue-500/15 animate-ping pointer-events-none" />
        )}

        <div className="relative z-10 space-y-4">
          {phase === 'gathering' && (
            <div className="space-y-3 py-6 animate-pulse">
              <Zap className="w-12 h-12 text-amber-400 mx-auto" />
              <h3 className="text-lg font-serif font-bold text-amber-300">
                {isAscension ? '【南天九重天劫】劫雲密布！' : `【${realmName} 大圓滿劫數】`}
              </h3>
              <p className="text-xs text-[#8c98ad]">
                九霄雷雲匯聚，天威浩瀚，紫電撕裂蒼穹，即將降下天罰淬體！
              </p>
            </div>
          )}

          {phase === 'striking' && (
            <div className="space-y-3 py-6">
              <div className="w-16 h-16 rounded-full bg-cyan-950/80 border-2 border-cyan-400/80 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                <Zap className="w-8 h-8 text-cyan-300 animate-bounce" />
              </div>
              <h3 className="text-lg font-serif font-bold text-cyan-300">
                天雷灌頂！第 {strikes} / 9 道雷劫！
              </h3>
              <div className="w-full bg-[#1e2430] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-400 h-full transition-all duration-150"
                  style={{ width: `${(strikes / 9) * 100}%` }}
                />
              </div>
            </div>
          )}

          {phase === 'result' && (
            <div className="space-y-4 py-2">
              {isSuccess ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-amber-950/80 border-2 border-amber-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(251,191,36,0.6)]">
                    <CheckCircle className="w-10 h-10 text-amber-300" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-amber-300">
                    {isAscension ? '【叩開南天門·飛升得道】' : '【天劫度過 · 晉階功成】'}
                  </h3>
                  <p className="text-xs text-[#9aa7bb] leading-relaxed">
                    {isAscension
                      ? '劫雲散去，接引神光沐浴周身！道友已自肉體凡胎脫胎換骨，名列仙班，登臨三十三天闕！'
                      : `九道天雷化為純淨真元反哺氣海，道友正式踏入【${realmName}】，壽元大增，戰力暴漲！`}
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-rose-950/80 border-2 border-rose-500 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(244,63,94,0.6)]">
                    <Skull className="w-9 h-9 text-rose-400" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-rose-400">
                    【劫雷反噬 · 破境受阻】
                  </h3>
                  <p className="text-xs text-[#9aa7bb] leading-relaxed">
                    天雷剛猛無匹，道友經脈震盪，真元逆流受阻！紫府生出心魔，需閉關調息重整道心後方可再次叩關。
                  </p>
                </>
              )}

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded font-serif font-bold text-sm bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 transition cursor-pointer active:scale-[0.98]"
              >
                收攝心神 · 穩固道境
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
