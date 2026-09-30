import React from 'react';
import { Columns, ArrowRight, Link2, ExternalLink, Download } from 'lucide-react';
import { PillarClusterItem } from '../types/seo';
import { exportToCSV } from '../utils/exportUtils';

interface PillarClusterViewProps {
  pillars: PillarClusterItem[];
  seedKeyword: string;
}

export const PillarClusterView: React.FC<PillarClusterViewProps> = ({ pillars, seedKeyword }) => {
  const handleExport = () => {
    exportToCSV(pillars, `Pillar_Cluster_Map_${seedKeyword}`);
  };

  return (
    <div className="p-6 space-y-6 max-w-full animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 mb-1.5">
            <Columns className="w-3.5 h-3.5 text-blue-600" />
            Hub & Spoke Architecture
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Ma Trận Kiến Trúc Pillar – Cluster
          </h1>
          <p className="text-xs text-slate-500">
            Quy tắc liên kết 2 chiều: Mọi bài Cluster Page bắt buộc phải trỏ liên kết về Pillar Page,
            và Pillar Page liên kết xuống các Cluster con tương ứng.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-3.5 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Xuất Bảng Pillar Cluster</span>
        </button>
      </div>

      {/* Table */}
      <div className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900 text-slate-200 select-none">
              <tr>
                <th className="p-3.5 font-bold">Pillar Page (Hub)</th>
                <th className="p-3.5 font-bold">Cluster Page (Vệ tinh)</th>
                <th className="p-3.5 font-bold">Primary Keyword</th>
                <th className="p-3.5 font-bold">Intent</th>
                <th className="p-3.5 font-bold">Content Type</th>
                <th className="p-3.5 font-bold">Suggested URL</th>
                <th className="p-3.5 font-bold">Internal Link To</th>
                <th className="p-3.5 font-bold">Internal Link From</th>
                <th className="p-3.5 font-bold text-center">Relevance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {pillars.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-extrabold text-indigo-900 whitespace-nowrap">
                    {item.pillar}
                  </td>
                  <td className="p-3.5 font-semibold text-slate-800 whitespace-nowrap">
                    {item.cluster}
                  </td>
                  <td className="p-3.5 font-bold text-blue-700 whitespace-nowrap">
                    {item.primaryKeyword}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                      {item.intent}
                    </span>
                  </td>
                  <td className="p-3.5 font-medium text-slate-600 whitespace-nowrap">
                    {item.contentType}
                  </td>
                  <td className="p-3.5 whitespace-nowrap font-mono text-[11px] text-slate-700">
                    <code>{item.suggestedUrl}</code>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {item.internalLinkTo.map((lnk, lIdx) => (
                        <span
                          key={lIdx}
                          className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200"
                        >
                          <ArrowRight className="w-2.5 h-2.5" />
                          {lnk}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {item.internalLinkFrom.map((lnk, lIdx) => (
                        <span
                          key={lIdx}
                          className="inline-flex items-center gap-1 font-mono text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200"
                        >
                          <Link2 className="w-2.5 h-2.5" />
                          {lnk}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5 text-center font-mono font-bold text-slate-800 whitespace-nowrap">
                    {item.businessRelevance}/100
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
