import React from 'react';
import {
  PieChart,
  CheckCircle2,
  AlertCircle,
  Plus,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { PillarClusterItem, ContentMapItem } from '../types/seo';

interface TopicalCoverageViewProps {
  seedKeyword: string;
  pillars: PillarClusterItem[];
  contentMap: ContentMapItem[];
  onAddMissingTopic: (topicName: string, pillar: string) => void;
}

export const TopicalCoverageView: React.FC<TopicalCoverageViewProps> = ({
  seedKeyword,
  pillars,
  contentMap,
  onAddMissingTopic,
}) => {
  const uniquePillars = Array.from(new Set(pillars.map((p) => p.pillar)));
  const totalClusters = pillars.length;

  const existingTitles = new Set(
    contentMap.map((c) => c.cluster.toLowerCase()).concat(contentMap.map((c) => c.topic.toLowerCase()))
  );

  // Suggested missing topics in industrial manufacturing
  const missingSuggestions = [
    {
      topic: 'Băng tải con lăn tải trọng nặng 500kg - 2 tấn',
      pillar: 'Băng tải công nghiệp B2B',
      reason: 'Thiếu bài về logistics hàng pallet và thùng phuy',
    },
    {
      topic: 'Hệ thống cân định lượng nhiều đầu kết hợp băng tải Z',
      pillar: 'Băng tải nâng liệu & Cấp liệu',
      reason: 'Đóng bao bánh kẹo hạt điều chính xác cao',
    },
    {
      topic: 'Băng tải phòng sạch GMP cho xưởng đóng vỉ thuốc',
      pillar: 'Băng tải thực phẩm',
      reason: 'Phân khúc dược phẩm có tỷ suất lợi nhuận cao',
    },
    {
      topic: 'Lắp đặt băng tải nhà máy tại KCN VSIP Bình Dương',
      pillar: 'Băng tải theo khu vực địa phương',
      reason: 'Địa bàn tập trung nhiều nhà máy FDI lớn',
    },
  ];

  const coveredCount = pillars.filter((p) =>
    existingTitles.has(p.cluster.toLowerCase())
  ).length;

  const coveragePercent = Math.min(
    100,
    Math.round(((coveredCount + contentMap.length) / (totalClusters + missingSuggestions.length)) * 100)
  );

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 mb-1.5">
            <PieChart className="w-3.5 h-3.5 text-blue-600" />
            Topical Authority & Semantic Coverage
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Thước Đo Độ Phủ Chủ Đề (Topical Coverage %)
          </h1>
          <p className="text-xs text-slate-500">
            Google đánh giá thứ hạng trang theo <strong>Topical Authority</strong>. Để đạt vị thế số
            1 trong ngành chế tạo máy, website cần bao phủ đủ tất cả các nhánh chủ đề liên quan.
          </p>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-400">
            CHỈ SỐ THẨM QUYỀN CHỦ ĐỀ HIỆN TẠI
          </div>
          <div className="text-3xl sm:text-4xl font-black">
            {coveragePercent}% <span className="text-base font-normal text-slate-300">Độ phủ</span>
          </div>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Hệ thống đã nhận diện {uniquePillars.length} Pillars lớn và {totalClusters} cụm Cluster
            cốt lõi. Bạn đã lên kế hoạch cho {contentMap.length} nội dung chính. Cần bổ sung thêm{' '}
            {missingSuggestions.length} bài viết để đạt mức bao phủ 100%.
          </p>
        </div>

        {/* Circular Progress Gauge representation */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center bg-white/5 rounded-full border-4 border-blue-500/40">
          <div className="text-center font-black text-2xl text-blue-300">
            {coveragePercent}%
          </div>
        </div>
      </div>

      {/* Pillars Coverage Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {uniquePillars.map((pName, idx) => {
          const pClusters = pillars.filter((p) => p.pillar === pName);
          const pContents = contentMap.filter((c) => c.pillar === pName);
          const pPercent = Math.min(
            100,
            Math.round((pContents.length / (pClusters.length || 1)) * 100)
          );

          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Pillar {idx + 1}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-sm mt-1">{pName}</h3>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {pPercent}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${pPercent}%` }}
                />
              </div>

              {/* Cluster pills */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                {pClusters.map((cl, cIdx) => (
                  <span
                    key={cIdx}
                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>{cl.cluster}</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Missing Topics Suggestions with Quick Add */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>Chủ Đề Còn Thiếu Cần Viết Để Thống Lĩnh Topical Authority</span>
          </h2>
          <span className="text-xs text-slate-500">Bấm [+] để nạp vào Content Map</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {missingSuggestions.map((m, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/30 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <span className="text-[10px] font-bold text-indigo-700 uppercase">
                  {m.pillar}
                </span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{m.topic}</div>
                <div className="text-slate-500 text-[11px] mt-0.5">{m.reason}</div>
              </div>

              <button
                onClick={() => onAddMissingTopic(m.topic, m.pillar)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shrink-0 flex items-center gap-1 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
