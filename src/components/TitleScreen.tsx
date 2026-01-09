import React, { useState, useEffect } from 'react';
import { Ghost } from 'lucide-react';

interface TitleScreenProps {
  onComplete: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'enter' | 'float' | 'exit'>('enter');

  useEffect(() => {
    // アニメーションのフェーズ管理
    const enterTimer = setTimeout(() => setStage('float'), 100);
    
    // 2.5秒後に退出開始
    const exitTimer = setTimeout(() => {
      setStage('exit');
    }, 2500);

    // 退出アニメーション終了後に完了通知
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`
        fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50
        transition-opacity duration-700
        ${stage === 'exit' ? 'opacity-0' : 'opacity-100'}
      `}
    >
      <div className="relative">
        {/* 背景の装飾円 */}
        <div className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50
          transition-all duration-1000 transform
          ${stage === 'enter' ? 'scale-0' : 'scale-150'}
        `} />

        {/* メインのゴースト */}
        <div className={`
          relative z-10 flex flex-col items-center
          transition-all duration-1000 transform
          ${stage === 'enter' ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}
        `}>
          <div className="animate-bounce-slow">
            <Ghost 
              size={80} 
              className="text-purple-600 drop-shadow-lg" 
              strokeWidth={1.5}
            />
          </div>
          
          <h1 className="mt-8 text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 tracking-tighter">
            GhostXO
          </h1>
          
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div 
                  key={i}
                  className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Loading
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
