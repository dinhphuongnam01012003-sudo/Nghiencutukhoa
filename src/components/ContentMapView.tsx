import React, { useState } from 'react';
import {
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle,
  FileEdit,
  ArrowRight,
  GitMerge,
  Filter,
  Download,
  ExternalLink,
} from 'lucide-react';
import { ContentMapItem } from '../types/seo';
import { exportToCSV } from '../utils/exportUtils';

interface ContentMapViewProps {
  contentMap: ContentMapItem[];
  setContentMap: React.Dispatch<React.SetStateAction<ContentMapItem[]>>;
  seedKeyword: string;
  onGenerateOutline: (contentItem: ContentMapItem) => void;
}

export const ContentMapView: React.FC<ContentMapViewProps> = ({
  contentMap,
  setContentMap,
  seedKeyword,
  onGenerateOutline,
}) => {
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredContents = contentMap.filter((c) => {
    const matchRisk = filterRisk === 'ALL' || c.cannibalizationRisk === filterRisk;
    const matchStatus = filterStatus === 'ALL' || c.status === filterStatus;
    return matchRisk && matchStatus;
  });

  const handleUpdateStatus = (contentId: string, status: any) => {
    setContentMap((prev) =>
      prev.map((item) => (item.contentId === contentId ? { ...item, status } : item))
    );
  };

  const handleMergeContent = (contentId: string) => {
    // Find the item
    const item = contentMap.find((c) => c.contentId === contentId);
    if (!item) return;

    const confirmMerge = window.confirm(
      `Bạn có chắc chắn muốn gộp bài [${item.suggestedTitle}] vào bài chính tương ứng để giải quyết xung đột từ khóa (Cannibalization)?`
    );

    if (confirmMerge) {
      setContentMap((prev) =>
        prev.map((c) =>
          c.contentId === contentId
            ? {
                ...c,
                status: 'Cần xem xét',
                cannibalizationRisk: 'Low',
                suggestedTitle: `[ĐÃ GỘP VÀO BÀI CHÍNH] ${c.suggestedTitle}`,
              }
            : c
        )
      );
    }
  };

  const handleExport = () => {
    exportToCSV(filteredContents, `Content_Map_${seedKeyword}`);
  };

  return (
    <div className="p-6 space-y-6 max-w-full animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 mb-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
            Content Roadmap & Cannibalization Prevention
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Content Map: Bản Đồ Nội Dung & Kiểm Soát Ăn Thịt Từ Khóa
          </h1>
          <p className="text-xs text-slate-500">
            Mỗi bài viết đại diện cho 1 Search Intent duy nhất. Hệ thống tự động quét và gắn cảnh
            báo <strong>CANNIBALIZATION RISK</strong> khi có từ khóa trùng intent.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="py-2 px-3 text-xs rounded-lg border border-slate-200 text-slate-800 bg-white font-medium focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">Mọi mức độ Cannibalization</option>
            <option value="High">Nguy cơ Cao (High Risk)</option>
            <option value="Medium">Nguy cơ Trung bình (Medium)</option>
            <option value="Low">Nguy cơ Thấp (Low)</option>
            <option value="None">Không có xung đột (None)</option>
          </select>

          <button
            onClick={handleExport}
            className="px-3.5 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Content Map</span>
          </button>
        </div>
      </div>

      {/* Cards Table */}
      <div className="space-y-4">
        {filteredContents.map((c) => {
          const isHighRisk = c.cannibalizationRisk === 'High';
          return (
            <div
              key={c.contentId}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all space-y-4 ${
                isHighRisk
                  ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/20'
                  : 'border-slate-200 hover:border-blue-400'
              }`}
            >
              {/* Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {c.contentId}
                    </span>
                    <span className="text-xs font-bold text-slate-600">{c.pillar}</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-xs font-semibold text-slate-500">{c.cluster}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {c.contentType}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {c.suggestedTitle}
                  </h3>
                  <div className="text-xs text-slate-500 font-mono">
                    URL: <code className="text-blue-700">{c.suggestedUrl}</code>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={c.status}
                    onChange={(e) => handleUpdateStatus(c.contentId, e.target.value)}
                    className="py-1 px-2 text-xs rounded border border-slate-200 bg-white font-semibold text-slate-700"
                  >
                    <option value="Chưa viết">Chưa viết</option>
                    <option value="Đang viết">Đang viết</option>
                    <option value="Đã xuất bản">Đã xuất bản</option>
                    <option value="Cần xem xét">Cần xem xét</option>
                  </select>

                  <button
                    onClick={() => onGenerateOutline(c)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    <span>Tạo Outline</span>
                  </button>
                </div>
              </div>

              {/* Cannibalization Warning Alert Box */}
              {c.cannibalizationRisk !== 'None' && (
                <div
                  className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    isHighRisk
                      ? 'bg-rose-50 text-rose-900 border-rose-200'
                      : 'bg-amber-50 text-amber-900 border-amber-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isHighRisk ? 'text-rose-600' : 'text-amber-600'
                      }`}
                    />
                    <div>
                      <span className="font-extrabold uppercase">
                        Cannibalization Risk: {c.cannibalizationRisk}
                      </span>
                      <p className="mt-0.5 text-xs opacity-90 leading-relaxed">
                        {c.cannibalizationNotes ||
                          'Phát hiện từ khóa có Search Intent tương tự bài khác trong hệ thống.'}
                      </p>
                    </div>
                  </div>

                  {isHighRisk && (
                    <button
                      onClick={() => handleMergeContent(c.contentId)}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs shrink-0 flex items-center gap-1.5 transition-colors"
                    >
                      <GitMerge className="w-3.5 h-3.5" />
                      <span>Gộp Bài Vào Topic Gốc</span>
                    </button>
                  )}
                </div>
              )}

              {/* Keywords and Link Routing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px]">
                    Từ khóa mục tiêu:
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {c.primaryKeyword} (Primary)
                    </span>
                  </div>
                  {c.secondaryKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {c.secondaryKeywords.map((sec, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px]"
                        >
                          {sec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px]">
                    Liên kết nội bộ (Internal Links):
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1 font-mono text-[10px]">
                    {c.internalLinksTo.map((lnk, lIdx) => (
                      <span
                        key={lIdx}
                        className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded"
                      >
                        Trỏ tới ➔ {lnk}
                      </span>
                    ))}
                    {c.internalLinksFrom.map((lnk, lIdx) => (
                      <span
                        key={lIdx}
                        className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded"
                      >
                        Nhận từ 🡠 {lnk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
