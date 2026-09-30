import React, { useState, useMemo } from 'react';
import {
  Network,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileEdit,
  ExternalLink,
} from 'lucide-react';
import { KeywordItem } from '../types/seo';

interface TopicClusterViewProps {
  keywords: KeywordItem[];
  onSelectKeywordForOutline?: (keyword: KeywordItem) => void;
}

export const TopicClusterView: React.FC<TopicClusterViewProps> = ({
  keywords,
  onSelectKeywordForOutline,
}) => {
  const [selectedPillar, setSelectedPillar] = useState<string>('ALL');

  // Group keywords by Parent Topic & Topic
  const clusters = useMemo(() => {
    const map = new Map<string, KeywordItem[]>();
    keywords.forEach((k) => {
      const groupKey = `${k.parentTopic}:::${k.topic}`;
      if (!map.has(groupKey)) {
        map.set(groupKey, []);
      }
      map.get(groupKey)!.push(k);
    });

    return Array.from(map.entries()).map(([key, items]) => {
      const [parentTopic, topic] = key.split(':::');
      const primary = items.find((i) => i.isPrimary) || items[0];
      const secondaries = items.filter((i) => i.id !== primary.id);
      const avgSerp = Math.round(
        items.reduce((acc, curr) => acc + curr.serpSimilarity, 0) / items.length
      );
      const pillar = primary.pillar;

      let clusteringRecommendation = '';
      let badgeClass = '';
      if (avgSerp >= 85) {
        clusteringRecommendation = 'Khả năng rất cao SEO chung 1 bài viết (85-100%)';
        badgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      } else if (avgSerp >= 65) {
        clusteringRecommendation = 'Có thể SEO chung, chú ý kiểm tra độ tương đồng Intent (65-84%)';
        badgeClass = 'bg-blue-50 text-blue-800 border-blue-200';
      } else if (avgSerp >= 40) {
        clusteringRecommendation = 'Cân nhắc tách bài viết phụ (40-64%)';
        badgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
      } else {
        clusteringRecommendation = 'Nên tách thành Topic riêng biệt (<40%)';
        badgeClass = 'bg-rose-50 text-rose-800 border-rose-200';
      }

      return {
        parentTopic,
        topic,
        pillar,
        primary,
        secondaries,
        items,
        avgSerp,
        clusteringRecommendation,
        badgeClass,
      };
    });
  }, [keywords]);

  const pillarsList = useMemo(() => {
    return Array.from(new Set(clusters.map((c) => c.pillar).filter(Boolean)));
  }, [clusters]);

  const filteredClusters = useMemo(() => {
    if (selectedPillar === 'ALL') return clusters;
    return clusters.filter((c) => c.pillar === selectedPillar);
  }, [clusters, selectedPillar]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 mb-1.5">
            <Network className="w-3.5 h-3.5 text-blue-600" />
            Topic & Intent Clustering Engine
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Gom Nhóm Từ Khóa Thành Topic Cluster
          </h1>
          <p className="text-xs text-slate-500">
            Nguyên tắc tối thượng: <strong>Không xem mỗi keyword là 1 bài viết!</strong> Các từ khóa
            có cùng Search Intent được gom lại 1 Topic duy nhất để tối đa hóa sức mạnh trang và tránh
            tự triệt tiêu thứ hạng.
          </p>
        </div>

        {/* Filter by Pillar */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Lọc Pillar:</span>
          <select
            value={selectedPillar}
            onChange={(e) => setSelectedPillar(e.target.value)}
            className="py-1.5 px-3 text-xs rounded-lg border border-slate-200 text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          >
            <option value="ALL">Tất cả Pillars ({clusters.length} Clusters)</option>
            {pillarsList.map((p, idx) => (
              <option key={idx} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cluster Rule Card */}
      <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300">
            Thang điểm SERP Similarity:{' '}
            <span className="text-emerald-400 font-bold">85-100 (SEO chung)</span> •{' '}
            <span className="text-blue-400 font-bold">65-84 (Khả thi)</span> •{' '}
            <span className="text-amber-400 font-bold">40-64 (Cân nhắc)</span> •{' '}
            <span className="text-rose-400 font-bold">&lt;40 (Tách bài)</span>
          </span>
        </div>
        <div className="text-slate-400 text-[11px] font-mono">
          Nguồn: AI Semantic & SERP Similarity Model
        </div>
      </div>

      {/* Grid of Clusters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredClusters.map((cluster, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-400 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Top metadata */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm inline-block mb-1">
                    {cluster.pillar}
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">{cluster.topic}</h3>
                  <div className="text-xs text-slate-500 font-medium">
                    Parent Topic:{' '}
                    <span className="text-slate-800 font-semibold">{cluster.parentTopic}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-slate-900">SERP Sim.</div>
                  <div className="text-base font-black text-indigo-600 font-mono">
                    {cluster.avgSerp}%
                  </div>
                </div>
              </div>

              {/* Clustering logic badge */}
              <div
                className={`p-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 ${cluster.badgeClass}`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{cluster.clusteringRecommendation}</span>
              </div>

              {/* Primary Keyword Box */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center justify-between">
                  <span>Primary Keyword (Đại diện bài viết)</span>
                  <span className="text-blue-600 font-semibold">
                    {cluster.primary.intent}
                  </span>
                </div>
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>{cluster.primary.keyword}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  URL đề xuất: <code className="text-blue-700">{cluster.primary.suggestedUrl}</code>
                </div>
              </div>

              {/* Secondary Keywords List */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-600">
                  Secondary Keywords ({cluster.secondaries.length} từ SEO chung):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cluster.secondaries.map((sec, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-md border border-slate-200 font-medium transition-colors"
                    >
                      {sec.keyword}
                    </span>
                  ))}
                  {cluster.secondaries.length === 0 && (
                    <span className="text-xs text-slate-400 italic">
                      Chưa có từ phụ (chỉ có từ khóa chính)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom action button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Ưu tiên:{' '}
                <span className="font-bold text-slate-800">{cluster.primary.priority}</span> • Funnel:{' '}
                <span className="font-bold text-indigo-700">{cluster.primary.funnelStage}</span>
              </span>
              {onSelectKeywordForOutline && (
                <button
                  onClick={() => onSelectKeywordForOutline(cluster.primary)}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <FileEdit className="w-3.5 h-3.5" />
                  <span>Dựng Outline</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
