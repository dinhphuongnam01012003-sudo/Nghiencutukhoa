import React, { useState } from 'react';
import { KeyRound, Layers, Target, ShieldAlert, Sparkles, Filter, Download } from 'lucide-react';
import { TopicKeyItem } from '../types/seo';
import { exportToCSV } from '../utils/exportUtils';

interface TopicKeyViewProps {
  topicKeys: TopicKeyItem[];
  seedKeyword: string;
}

export const TopicKeyView: React.FC<TopicKeyViewProps> = ({ topicKeys, seedKeyword }) => {
  const [funnelFilter, setFunnelFilter] = useState<string>('ALL');

  const filteredTopics = topicKeys.filter((t) => {
    return funnelFilter === 'ALL' || t.funnelStage === funnelFilter;
  });

  const handleExport = () => {
    exportToCSV(filteredTopics, `Topic_Key_${seedKeyword}`);
  };

  return (
    <div className="p-6 space-y-6 max-w-full animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 mb-1.5">
            <KeyRound className="w-3.5 h-3.5 text-blue-600" />
            Semantic Entities & Funnel Alignment
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Topic Key: Phân Khúc Phễu & Thực Thể Ngữ Nghĩa B2B
          </h1>
          <p className="text-xs text-slate-500">
            Khớp nối trực tiếp: Nỗi đau xưởng (Problem) ➔ Giải pháp kỹ thuật (Solution) ➔ Thực thể
            vật liệu ➔ Phễu TOFU/MOFU/BOFU.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={funnelFilter}
            onChange={(e) => setFunnelFilter(e.target.value)}
            className="py-2 px-3 text-xs rounded-lg border border-slate-200 text-slate-800 bg-white font-medium focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">Tất cả giai đoạn phễu</option>
            <option value="TOFU">TOFU - Nhận thức kỹ thuật</option>
            <option value="MOFU">MOFU - Cân nhắc & So sánh</option>
            <option value="BOFU">BOFU - Báo giá & Chốt xưởng</option>
          </select>

          <button
            onClick={handleExport}
            className="px-3.5 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất CSV</span>
          </button>
        </div>
      </div>

      {/* Cards Table */}
      <div className="space-y-4">
        {filteredTopics.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-blue-400 transition-all space-y-4"
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      item.funnelStage === 'BOFU'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : item.funnelStage === 'MOFU'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {item.funnelStage}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-bold text-slate-600">
                    Parent Topic: <span className="text-slate-900">{item.parentTopic}</span>
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1">{item.topic}</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-semibold">
                  Ưu tiên {item.priority}
                </span>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold">
                  {item.intent}
                </span>
              </div>
            </div>

            {/* 3-Column Content Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
              {/* Col 1: Keywords & Entities */}
              <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <div className="font-bold text-slate-500 uppercase text-[10px]">
                    Primary Keyword
                  </div>
                  <div className="font-extrabold text-blue-700 text-sm mt-0.5">
                    {item.primaryKeyword}
                  </div>
                </div>

                <div>
                  <div className="font-bold text-slate-500 uppercase text-[10px]">
                    Secondary Keywords
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.secondaryKeywords.map((sec, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 bg-white text-slate-700 border border-slate-200 rounded text-[11px]"
                      >
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-bold text-slate-500 uppercase text-[10px]">
                    Semantic Entities (Thực thể)
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.semanticEntities.map((ent, eIdx) => (
                      <span
                        key={eIdx}
                        className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[11px] font-medium"
                      >
                        {ent}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Col 2: Problem & Solution (Pain Point Match) */}
              <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <div className="font-bold text-rose-600 uppercase text-[10px] flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    <span>Nỗi đau nhà máy (Problem / Pain Point)</span>
                  </div>
                  <div className="text-slate-800 mt-1 leading-relaxed">{item.problem}</div>
                </div>

                <div>
                  <div className="font-bold text-emerald-600 uppercase text-[10px] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Giải pháp kỹ thuật (Solution)</span>
                  </div>
                  <div className="text-slate-800 mt-1 leading-relaxed">{item.solution}</div>
                </div>
              </div>

              {/* Col 3: Application, Industry, Local */}
              <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <div className="font-bold text-slate-500 uppercase text-[10px]">
                    Ứng dụng trong dây chuyền (Application)
                  </div>
                  <div className="text-slate-800 mt-0.5 leading-relaxed">{item.application}</div>
                </div>

                <div>
                  <div className="font-bold text-slate-500 uppercase text-[10px]">
                    Ngành công nghiệp
                  </div>
                  <div className="text-slate-800 mt-0.5 font-medium">{item.industry}</div>
                </div>

                <div>
                  <div className="font-bold text-slate-500 uppercase text-[10px]">
                    Khu vực địa phương
                  </div>
                  <div className="text-slate-800 mt-0.5 font-medium">{item.local}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
