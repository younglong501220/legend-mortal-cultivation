import React, { useState } from 'react';
import { PlayerState, InventoryItem } from '../../types/game';
import { INVENTORY_ITEMS, EQUIPMENT_LIST } from '../../utils/constants';
import { Package, Sparkles, Flame, Hammer, Gem, Pill, Leaf, Shield, Swords } from 'lucide-react';

interface InventoryTabProps {
  player: PlayerState;
  onUseItem: (itemId: string) => void;
  onNavigateToCraft: () => void;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  player,
  onUseItem,
  onNavigateToCraft
}) => {
  const [filterType, setFilterType] = useState<'all' | 'pill' | 'herb' | 'material' | 'equip'>('all');

  const allInventoryItems = INVENTORY_ITEMS.filter(item => (player.inventory[item.id] || 0) > 0);
  const bagEquipments = EQUIPMENT_LIST.filter(eq => (player.inventory[eq.id] || 0) > 0);

  const filteredItems = allInventoryItems.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div className="space-y-4">
      {/* 儲物袋頂部資訊 */}
      <div className="bg-[#171b24] border border-[#2b3242] rounded-lg p-4 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#252b39] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-amber-500 rounded-full" />
            <h2 className="text-base font-serif font-bold text-amber-300 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-amber-400" />
              <span>修真儲物袋 · 隨身乾坤</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={onNavigateToCraft}
              className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 rounded font-serif transition flex items-center gap-1 cursor-pointer"
            >
              <Flame className="w-3 h-3 text-amber-400" />
              <span>前往開爐煉丹 / 鍛造法寶</span>
            </button>
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap gap-1 mb-4 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded transition cursor-pointer ${
              filterType === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-[#7e8aa0] hover:text-[#c4cedd] bg-[#12151d] border border-[#242936]'
            }`}
          >
            全部乾坤
          </button>
          <button
            onClick={() => setFilterType('pill')}
            className={`px-3 py-1 rounded transition cursor-pointer ${
              filterType === 'pill'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'text-[#7e8aa0] hover:text-[#c4cedd] bg-[#12151d] border border-[#242936]'
            }`}
          >
            靈丹寶藥
          </button>
          <button
            onClick={() => setFilterType('herb')}
            className={`px-3 py-1 rounded transition cursor-pointer ${
              filterType === 'herb'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                : 'text-[#7e8aa0] hover:text-[#c4cedd] bg-[#12151d] border border-[#242936]'
            }`}
          >
            靈草仙芝
          </button>
          <button
            onClick={() => setFilterType('material')}
            className={`px-3 py-1 rounded transition cursor-pointer ${
              filterType === 'material'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-[#7e8aa0] hover:text-[#c4cedd] bg-[#12151d] border border-[#242936]'
            }`}
          >
            煉器材料
          </button>
          <button
            onClick={() => setFilterType('equip')}
            className={`px-3 py-1 rounded transition cursor-pointer ${
              filterType === 'equip'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold'
                : 'text-[#7e8aa0] hover:text-[#c4cedd] bg-[#12151d] border border-[#242936]'
            }`}
          >
            法寶器胚 ({bagEquipments.length})
          </button>
        </div>

        {/* Items List */}
        {filteredItems.length === 0 && filterType !== 'equip' && (
          <div className="text-center py-8 text-xs text-[#606d82]">
            乾坤袋中此類物品暫告罄竭。可前往【人間歷練】或【洞府靈圃】採擷採集！
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filterType !== 'equip' &&
            filteredItems.map(item => {
              const count = player.inventory[item.id] || 0;
              const isUsable = item.type === 'pill' || item.type === 'herb' || item.id === 'spirit_drop';

              return (
                <div
                  key={item.id}
                  className="bg-[#12151d] border border-[#242936] hover:border-[#384155] p-3 rounded-lg transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {item.type === 'pill' ? (
                          <Pill className="w-3.5 h-3.5 text-amber-400" />
                        ) : item.type === 'herb' ? (
                          <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Gem className="w-3.5 h-3.5 text-cyan-400" />
                        )}
                        <span className="font-serif font-bold text-sm text-[#e2b755]">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-[#d8dee9] bg-[#1a1f29] border border-[#272e3d] px-2 py-0.5 rounded">
                        x{count}
                      </span>
                    </div>

                    <p className="text-xs text-[#7e8a9d] leading-relaxed mb-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#1d232f] flex items-center justify-between text-xs">
                    <span className="text-[#59667a] text-[11px]">
                      {item.type === 'pill' ? '丹藥靈效' : item.type === 'herb' ? '煉丹靈材' : '煉器精金'}
                    </span>

                    {isUsable ? (
                      <button
                        onClick={() => onUseItem(item.id)}
                        className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 rounded font-medium transition cursor-pointer active:scale-[0.98]"
                      >
                        立即服用/使用
                      </button>
                    ) : (
                      <button
                        onClick={onNavigateToCraft}
                        className="px-3 py-1 bg-[#1c2230] hover:bg-[#273043] border border-[#343e54] text-[#a0afc7] rounded font-medium transition cursor-pointer"
                      >
                        煉丹煉器
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

          {/* If filtering equip or all, also show crafted bag equipments */}
          {(filterType === 'equip' || filterType === 'all') &&
            bagEquipments.map(eq => (
              <div
                key={eq.id}
                className="bg-[#141824] border border-[#2f384c] p-3 rounded-lg transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-serif font-bold text-sm text-[#e2b755]">
                      {eq.name}
                    </span>
                    <span className="text-[10px] text-amber-400 bg-amber-950/40 border border-amber-800/40 px-1.5 py-0.2 rounded">
                      {eq.grade}
                    </span>
                  </div>

                  <p className="text-xs text-[#8c98ad] leading-relaxed mb-3">
                    {eq.description}
                  </p>

                  <div className="text-[11px] text-[#717e94] font-mono space-y-0.5 mb-2">
                    <div>攻+{eq.atkBonus} · 防+{eq.defBonus} · 血+{eq.hpBonus}</div>
                    {eq.specialEffect && <div className="text-purple-300">{eq.specialEffect}</div>}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1d232f] flex justify-end">
                  <button
                    onClick={onNavigateToCraft}
                    className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-300 rounded text-xs transition cursor-pointer"
                  >
                    前往祭煉穿戴
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
