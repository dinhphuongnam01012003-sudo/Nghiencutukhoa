import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Lock,
  Unlock,
  RotateCw,
  Sparkles,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { KeywordMatrixData } from '../types/seo';
import { exportToCSV, copyToClipboard } from '../utils/exportUtils';

interface KeywordMatrixViewProps {
  matrix: KeywordMatrixData;
  setMatrix: React.Dispatch<React.SetStateAction<KeywordMatrixData>>;
  seedKeyword: string;
  onAddMatrixKeyword?: (colKey: keyof KeywordMatrixData, term: string) => void;
  onDeleteMatrixKeyword?: (colKey: keyof KeywordMatrixData, term: string) => void;
  onGenerateMatrixCombinations?: () => void;
}

interface ColumnConfig {
  key: keyof KeywordMatrixData;
  title: string;
  desc: string;
  badgeColor: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    key: 'productVariants',
    title: 'BIẾN THỂ SẢN PHẨM',
    desc: 'Băng tải Z đứng, ngang, nghiêng, cong 90°...',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    key: 'semanticKeywords',
    title: 'SEMANTIC / LSI',
    desc: 'Băng tải nâng liệu, máy cấp liệu, băng chuyền...',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  {
    key: 'specifications',
    title: 'ĐẶC ĐIỂM / VẬT LIỆU',
    desc: 'PVC, PU, Inox 304, gờ bèo, chuẩn HACCP...',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    key: 'painPoints',
    title: 'PAIN POINT (NỖI ĐAU)',
    desc: 'Rơi vãi liệu, trượt liệu, khó vệ sinh, tốn công...',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  {
    key: 'solutions',
    title: 'GIẢI PHÁP KỸ THUẬT',
    desc: 'Chống nghiền nát, tiết kiệm diện tích đứng...',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
  },
  {
    key: 'integratedEquipment',
    title: 'THIẾT BỊ TÍCH HỢP',
    desc: 'Phễu rung, máy đóng gói, cân định lượng, bồn trộn...',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    key: 'industries',
    title: 'NGÀNH ỨNG DỤNG',
    desc: 'Thực phẩm, hạt điều, thủy sản, nông sản, dược...',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    key: 'locations',
    title: 'LOCAL KEYWORD',
    desc: 'Đồng Nai, Biên Hòa, TP.HCM, Bình Dương, Long An...',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  },
  {
    key: 'brands',
    title: 'THƯƠNG HIỆU (BRAND)',
    desc: 'Chí Nhật Từ, Intech, xưởng chế tạo máy...',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
  },
];

export const KeywordMatrixView: React.FC<KeywordMatrixViewProps> = ({
  matrix,
  setMatrix,
  seedKeyword,
  onAddMatrixKeyword,
  onDeleteMatrixKeyword,
  onGenerateMatrixCombinations,
}) => {
  const [lockedCols, setLockedCols] = useState<Record<string, boolean>>({});
  const [newItemText, setNewItemText] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<boolean>(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const toggleLock = (colKey: string) => {
    setLockedCols((prev) => ({ ...prev, [colKey]: !prev[colKey] }));
  };

  const handleAddItem = (colKey: keyof KeywordMatrixData) => {
    const text = (newItemText[colKey] || '').trim();
    if (!text) return;

    if (onAddMatrixKeyword) {
      onAddMatrixKeyword(colKey, text);
    } else {
      setMatrix((prev) => ({
        ...prev,
        [colKey]: [...(prev[colKey] || []), text],
      }));
    }

    setNewItemText((prev) => ({ ...prev, [colKey]: '' }));
    setSyncToast(`⚡ Đã thêm "${text}" vào Ma Trận và tự động đồng bộ sang Keyword List, Topic Cluster, Keymap & Content Map!`);
    setTimeout(() => setSyncToast(null), 4000);
  };

  const handleDeleteItem = (colKey: keyof KeywordMatrixData, index: number) => {
    if (lockedCols[colKey]) return;
    const term = matrix[colKey]?.[index];
    if (onDeleteMatrixKeyword && term) {
      onDeleteMatrixKeyword(colKey, term);
    } else {
      setMatrix((prev) => ({
        ...prev,
        [colKey]: prev[colKey].filter((_, i) => i !== index),
      }));
    }
  };

  const handleUpdateItem = (colKey: keyof KeywordMatrixData, index: number, value: string) => {
    if (lockedCols[colKey]) return;
    setMatrix((prev) => {
      const list = [...prev[colKey]];
      list[index] = value;
      return { ...prev, [colKey]: list };
    });
  };

  const handleExportMatrix = () => {
    // Determine max length among all columns
    const maxLen = Math.max(...COLUMNS.map((c) => matrix[c.key]?.length || 0));
    const rows = [];
    for (let i = 0; i < maxLen; i++) {
      const row: any = {};
      COLUMNS.forEach((c) => {
        row[c.title] = matrix[c.key]?.[i] || '';
      });
      rows.push(row);
    }
    exportToCSV(rows, `Keyword_Matrix_9D_${seedKeyword}`);
  };

  const handleCopyMatrix = async () => {
    const maxLen = Math.max(...COLUMNS.map((c) => matrix[c.key]?.length || 0));
    let tsv = COLUMNS.map((c) => c.title).join('\t') + '\n';
    for (let i = 0; i < maxLen; i++) {
      tsv += COLUMNS.map((c) => matrix[c.key]?.[i] || '').join('\t') + '\n';
    }
    const ok = await copyToClipboard(tsv);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-full animate-fadeIn">
      {/* Real-time Sync Toast Notification */}
      {syncToast && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center justify-between text-xs font-semibold animate-slideDown border border-emerald-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-200 animate-spin" />
            <span>{syncToast}</span>
          </div>
          <button
            onClick={() => setSyncToast(null)}
            className="text-emerald-200 hover:text-white ml-3 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            9-Dimensional Semantic Matrix (Đồng Bộ Đa Chiều)
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Ma Trận Từ Khóa Đa Chiều (Spreadsheet B2B)
          </h1>
          <p className="text-xs text-slate-500">
            Khóa cột, thêm sửa xóa trực tiếp. Mọi từ khóa bổ sung tại đây sẽ <strong>tự động phản chiếu và đồng bộ sang tất cả các tab khác</strong> (Keyword List, Topic Cluster, Keymap, Content Map).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onGenerateMatrixCombinations && (
            <button
              onClick={() => {
                onGenerateMatrixCombinations();
                setSyncToast(`⚡ Đã tự động sinh các từ khóa tổ hợp B2B từ Ma Trận 9D sang Keyword List, Topic Cluster và Keymap!`);
                setTimeout(() => setSyncToast(null), 4000);
              }}
              className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              title="Tổ hợp tự động Biến thể × Đặc điểm × Ngành × Local"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sinh Tổ Hợp Ma Trận 9D</span>
            </button>
          )}

          <button
            onClick={handleCopyMatrix}
            className="px-3 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Đã sao chép' : 'Sao chép TSV'}</span>
          </button>
          <button
            onClick={handleExportMatrix}
            className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Xuất CSV Ma Trận</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Container with Horizontal Scroll */}
      <div className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <div className="inline-flex min-w-full divide-x divide-slate-200">
            {COLUMNS.map((col) => {
              const items = matrix[col.key] || [];
              const isLocked = !!lockedCols[col.key];

              return (
                <div
                  key={col.key}
                  className={`w-72 shrink-0 flex flex-col transition-colors ${
                    isLocked ? 'bg-slate-50/70' : 'bg-white'
                  }`}
                >
                  {/* Column Header */}
                  <div className="p-3.5 border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur-xs z-10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-sm border ${col.badgeColor}`}
                      >
                        {col.title}
                      </span>
                      <button
                        onClick={() => toggleLock(col.key)}
                        title={isLocked ? 'Mở khóa cột' : 'Khóa cột này'}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                      >
                        {isLocked ? (
                          <Lock className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <Unlock className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-500 leading-tight line-clamp-1">
                      {col.desc}
                    </div>

                    {/* Quick Add Form in Column */}
                    {!isLocked && (
                      <div className="flex items-center gap-1 pt-1">
                        <input
                          type="text"
                          value={newItemText[col.key] || ''}
                          onChange={(e) =>
                            setNewItemText({ ...newItemText, [col.key]: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddItem(col.key);
                            }
                          }}
                          placeholder="+ Thêm mục mới..."
                          className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleAddItem(col.key)}
                          className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                          title="Thêm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Column Items */}
                  <div className="p-2 space-y-1.5 flex-1 max-h-[550px] overflow-y-auto">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className="group flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:border-slate-300 bg-white hover:bg-slate-50/50 transition-all text-xs"
                      >
                        <input
                          type="text"
                          disabled={isLocked}
                          value={item}
                          onChange={(e) => handleUpdateItem(col.key, idx, e.target.value)}
                          className="w-full bg-transparent text-slate-800 font-medium focus:outline-none disabled:text-slate-600"
                        />
                        {!isLocked && (
                          <button
                            onClick={() => handleDeleteItem(col.key, idx)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 transition-opacity shrink-0"
                            title="Xóa mục này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                    {items.length === 0 && (
                      <div className="p-4 text-center text-xs text-slate-400 italic">
                        Chưa có mục nào
                      </div>
                    )}
                  </div>

                  {/* Column Footer: Count */}
                  <div className="p-2.5 border-t border-slate-100 bg-slate-50 text-[11px] font-semibold text-slate-500 flex justify-between items-center">
                    <span>Tổng mục:</span>
                    <span className="font-bold text-slate-800">{items.length}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
