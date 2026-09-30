import React, { useState } from 'react';
import {
  Link2,
  ArrowRight,
  GitFork,
  Download,
  Filter,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { InternalLinkItem } from '../types/seo';
import { exportToCSV } from '../utils/exportUtils';

interface InternalLinkMapViewProps {
  internalLinks: InternalLinkItem[];
  seedKeyword: string;
}

export const InternalLinkMapView: React.FC<InternalLinkMapViewProps> = ({
  internalLinks,
  seedKeyword,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredLinks = internalLinks.filter((l) => {
    return filterType === 'ALL' || l.type === filterType;
  });

  const handleExport = () => {
    exportToCSV(filteredLinks, `Internal_Link_Map_${seedKeyword}`);
  };

  const getBadgeType = (type: InternalLinkItem['type']) => {
    switch (type) {
      case 'Pillar-Cluster':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Cluster-Pillar':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Related-Cluster':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Transactional-Bridge':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-full animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 mb-1.5">
            <Link2 className="w-3.5 h-3.5 text-blue-600" />
            Topical Link Architecture
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Sơ Đồ Liên Kết Nội Bộ (Internal Link Map)
          </h1>
          <p className="text-xs text-slate-500">
            Nguyên tắc liên kết: <strong>Không link ngẫu nhiên!</strong> Chỉ link khi Topic
            relevance cao theo cấu trúc phân cấp Pillar ↕ Cluster hoặc liên kết thiết bị phụ trợ.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="py-2 px-3 text-xs rounded-lg border border-slate-200 text-slate-800 bg-white font-medium focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">Tất cả kiểu liên kết</option>
            <option value="Pillar-Cluster">Pillar ➔ Cluster (Xuống nhánh con)</option>
            <option value="Cluster-Pillar">Cluster ➔ Pillar (Củng cố authority)</option>
            <option value="Related-Cluster">Related Cluster (Thiết bị tích hợp)</option>
            <option value="Transactional-Bridge">BOFU Bridge (Dẫn sang Báo giá xưởng)</option>
          </select>

          <button
            onClick={handleExport}
            className="px-3.5 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Danh Sách Link</span>
          </button>
        </div>
      </div>

      {/* Visual Linking Logic Diagram Box */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md">
        <div className="text-[10px] font-extrabold uppercase text-blue-400 tracking-wider mb-2">
          HỆ THỐNG LIÊN KẾT THEO PHỄU B2B
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center w-full sm:w-1/3">
            <div className="text-blue-300 font-bold">PILLAR PAGE</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Topical Hub chính</div>
          </div>
          <div className="text-slate-400">↕ (Link 2 chiều)</div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center w-full sm:w-1/3">
            <div className="text-teal-300 font-bold">CLUSTER PAGES</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Giải pháp & Dây chuyền</div>
          </div>
          <div className="text-slate-400">➔ (Chuyển đổi)</div>
          <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30 text-center w-full sm:w-1/3 text-emerald-300">
            <div className="font-bold">BOFU / FORM BÁO GIÁ</div>
            <div className="text-[11px] text-emerald-200/80 mt-0.5">Hotline & Bản vẽ 3D</div>
          </div>
        </div>
      </div>

      {/* Internal Links Table */}
      <div className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900 text-slate-200 select-none">
              <tr>
                <th className="p-3.5 font-bold">Trang nguồn (Source Page)</th>
                <th className="p-3.5 font-bold">Trang đích (Target Page)</th>
                <th className="p-3.5 font-bold">Anchor Text Tự Nhiên</th>
                <th className="p-3.5 font-bold">Kiểu Liên Kết</th>
                <th className="p-3.5 font-bold">Lý Do Liên Kết (Topical Context)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredLinks.map((link) => (
                <tr key={link.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{link.sourceTitle}</div>
                    <code className="text-[11px] text-slate-400 font-mono">
                      {link.sourceUrl}
                    </code>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{link.targetTitle}</div>
                    <code className="text-[11px] text-blue-600 font-mono">
                      {link.targetUrl}
                    </code>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200 text-xs">
                      "{link.anchorText}"
                    </span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeType(
                        link.type
                      )}`}
                    >
                      {link.type}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600 max-w-xs leading-relaxed">
                    {link.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
