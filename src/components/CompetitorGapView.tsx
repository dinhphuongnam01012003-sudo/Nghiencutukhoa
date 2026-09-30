import React, { useState } from 'react';
import {
  TrendingDown,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Search,
  CheckCircle,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { CompetitorGapData } from '../types/seo';

interface CompetitorGapViewProps {
  competitorGap: CompetitorGapData;
  seedKeyword: string;
  onRunGapAnalysis: (domains: string[]) => Promise<void>;
  isLoading: boolean;
}

export const CompetitorGapView: React.FC<CompetitorGapViewProps> = ({
  competitorGap,
  seedKeyword,
  onRunGapAnalysis,
  isLoading,
}) => {
  const [domainInput, setDomainInput] = useState(
    'intechvietnam.com, bangtaivietthong.com, cokhitrungkien.vn'
  );

  const handleAnalyze = () => {
    const domains = domainInput
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);
    if (!domains.length) return;
    onRunGapAnalysis(domains);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 mb-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-blue-600" />
            Competitive Intelligence & Gap Discovery
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Phân Tích Đối Thủ & Khoảng Trống Nội Dung (Content Gap)
          </h1>
          <p className="text-xs text-slate-500">
            Khám phá các chủ đề (Topic Gap) và từ khóa (Keyword Gap) mà đối thủ đang xếp hạng cao
            nhưng website của bạn chưa khai thác.
          </p>
        </div>
      </div>

      {/* Input box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <label className="text-xs font-bold text-slate-700 block">
          Tên miền đối thủ cạnh tranh (Cách nhau bởi dấu phẩy):
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            placeholder="domain1.com, domain2.vn..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
          <button
            onClick={handleAnalyze}
            disabled={isLoading || !domainInput.trim()}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang quét đối thủ...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>PHÂN TÍCH GAP</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary card */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md border border-slate-800 space-y-2">
        <div className="text-[10px] font-extrabold uppercase text-blue-400 tracking-wider">
          TỔNG QUAN CHIẾN LƯỢC TỪ ĐỐI THỦ
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{competitorGap.summary}</p>
      </div>

      {/* Missing Topics (Topic Gap) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>TOPIC GAP (Chủ Đề Đối Thủ Đang Ăn Top Ta Chưa Có)</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {competitorGap.missingTopics.length} chủ đề khuyết
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {competitorGap.missingTopics.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 transition-all space-y-2.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {item.pillar}
                </span>
                <span className="font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                  {item.priority}
                </span>
              </div>

              <div className="font-bold text-slate-900 text-sm">{item.topic}</div>

              <div>
                <span className="text-slate-400 font-medium">Lý do đối thủ top: </span>
                <span className="text-slate-700">{item.competitorEdge}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 text-blue-700 font-semibold flex items-center gap-1">
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                <span>{item.recommendedAction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keyword Gaps */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>KEYWORD GAP (Từ Khóa Cơ Hội Vượt Thứ Hạng)</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Từ khóa đối thủ ranking</th>
                <th className="p-3">Intent</th>
                <th className="p-3">Độ khó ước tính</th>
                <th className="p-3">Độ liên quan ngành</th>
                <th className="p-3">Tiêu đề đề xuất để vượt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {competitorGap.keywordGaps.map((kw, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{kw.keyword}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                      {kw.intent}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 font-medium">{kw.estimatedDifficulty}</td>
                  <td className="p-3 font-mono font-bold text-emerald-700">{kw.relevance}%</td>
                  <td className="p-3 font-semibold text-blue-700">{kw.suggestedTitle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic structure recommendations */}
      <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 space-y-3">
        <h3 className="font-extrabold text-slate-900 text-sm">
          Khuyến Nghị Cấu Trúc Đột Phá B2B
        </h3>
        <ul className="space-y-2 text-xs text-slate-700 pl-4 list-disc">
          {competitorGap.structureRecommendations.map((rec, idx) => (
            <li key={idx} className="leading-relaxed">
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
