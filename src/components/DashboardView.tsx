import React from 'react';
import {
  KeyRound,
  Layers,
  FileSpreadsheet,
  AlertTriangle,
  Compass,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  PieChart,
  BarChart3,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { KeywordItem, PillarClusterItem, ContentMapItem } from '../types/seo';
import { ActiveTab } from './Sidebar';

interface DashboardViewProps {
  keywords: KeywordItem[];
  pillars: PillarClusterItem[];
  contentMap: ContentMapItem[];
  seedKeyword: string;
  onNavigate: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  keywords,
  pillars,
  contentMap,
  seedKeyword,
  onNavigate,
}) => {
  // Compute metrics
  const totalKeywords = keywords.length;
  const uniqueTopics = Array.from(new Set(keywords.map((k) => k.topic))).length;
  const uniquePillars = Array.from(new Set(pillars.map((p) => p.pillar))).length;
  const totalClusters = pillars.length;

  const countIntent = {
    Informational: keywords.filter((k) => k.intent === 'Informational').length,
    Commercial: keywords.filter(
      (k) => k.intent === 'Commercial Investigation' || k.intent === 'Navigational'
    ).length,
    Transactional: keywords.filter((k) => k.intent === 'Transactional').length,
    Local: keywords.filter((k) => k.intent === 'Local Commercial' || k.isLocal).length,
  };

  const countFunnel = {
    TOFU: keywords.filter((k) => k.funnelStage === 'TOFU').length,
    MOFU: keywords.filter((k) => k.funnelStage === 'MOFU').length,
    BOFU: keywords.filter((k) => k.funnelStage === 'BOFU').length,
  };

  const totalContents = contentMap.length;
  const publishedCount = contentMap.filter((c) => c.status === 'Đã xuất bản').length;
  const inProgressCount = contentMap.filter((c) => c.status === 'Đang viết').length;
  const cannibalizationHigh = contentMap.filter((c) => c.cannibalizationRisk === 'High').length;
  const cannibalizationMed = contentMap.filter((c) => c.cannibalizationRisk === 'Medium').length;

  // Real vs AI estimate
  const realDataCount = keywords.filter((k) => k.dataSource === 'REAL DATA').length;
  const aiEstimateCount = keywords.filter((k) => k.dataSource === 'AI ESTIMATE').length;

  // Top Pillar groupings
  const pillarGroupings = Array.from(new Set(pillars.map((p) => p.pillar))).map((pName) => {
    const pClusters = pillars.filter((p) => p.pillar === pName);
    const pKeywords = keywords.filter((k) => k.pillar === pName);
    return {
      name: pName,
      clusterCount: pClusters.length,
      keywordCount: pKeywords.length,
    };
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30 mb-2">
              <Compass className="w-3.5 h-3.5" />
              Topical Authority Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Chiến Lược Từ Khóa B2B: "{seedKeyword}"
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Mô hình Topic Cluster phân cấp chuyên sâu cho ngành chế tạo máy móc, thiết bị sản xuất
              và dây chuyền công nghiệp. Tự động hóa liên kết Hub & Spoke không bị phân mảnh intent.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('keymap')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <span>Xem Sơ Đồ Keymap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('outline')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
            >
              <span>Tạo Outline SEO</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Tổng Keyword</span>
            <KeyRound className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalKeywords}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="font-semibold text-emerald-600">{aiEstimateCount}</span> AI +{' '}
            <span className="font-semibold text-blue-600">{realDataCount}</span> Real
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Parent Topics</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{uniqueTopics}</div>
          <div className="text-[11px] text-slate-500 mt-1">Đại diện cho các nhóm intent</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Pillars Lớn</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{uniquePillars}</div>
          <div className="text-[11px] text-slate-500 mt-1">Cột trụ thương hiệu</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Topic Clusters</span>
            <BarChart3 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalClusters}</div>
          <div className="text-[11px] text-slate-500 mt-1">Cụm bài bổ trợ Hub</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Kế hoạch bài viết</span>
            <FileSpreadsheet className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalContents}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            <span className="text-emerald-600 font-semibold">{publishedCount} đã xuất bản</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-rose-400 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Cannibalization</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">
            {cannibalizationHigh + cannibalizationMed}
          </div>
          <div className="text-[11px] text-rose-500 mt-1 font-medium">
            {cannibalizationHigh > 0 ? `${cannibalizationHigh} nguy cơ cao!` : 'Cần kiểm tra intent'}
          </div>
        </div>
      </div>

      {/* Cannibalization Warning Alert if any */}
      {cannibalizationHigh > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-rose-900 text-sm">
                Cảnh báo rủi ro ăn thịt từ khóa (Keyword Cannibalization Risk)
              </div>
              <div className="text-xs text-rose-700 mt-0.5 leading-relaxed">
                Phát hiện {cannibalizationHigh} bài viết có cùng Search Intent và SERP Similarity &gt;
                85% (ví dụ giữa Băng tải Z đứng và Băng tải Z nghiêng). Hệ thống khuyến nghị gộp nội
                dung thay vì tách làm 2 bài để tránh tự triệt tiêu thứ hạng.
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('contentmap')}
            className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 shrink-0 transition-colors"
          >
            Xem & Gộp bài
          </button>
        </div>
      )}

      {/* 2-Column Grid: Distribution & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Intent Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Phân Phối Search Intent</h2>
              <p className="text-xs text-slate-500">Mỗi keyword gắn chặt với 1 intent chủ đạo</p>
            </div>
            <button
              onClick={() => onNavigate('keywords')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Chi tiết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-800">Commercial Investigation (Tìm hiểu so sánh B2B)</span>
                <span className="text-slate-700">{countIntent.Commercial} kw ({Math.round((countIntent.Commercial / (totalKeywords || 1)) * 100)}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${(countIntent.Commercial / (totalKeywords || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-800">Transactional / Báo giá (Chốt đơn xưởng)</span>
                <span className="text-slate-700">{countIntent.Transactional} kw ({Math.round((countIntent.Transactional / (totalKeywords || 1)) * 100)}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(countIntent.Transactional / (totalKeywords || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-blue-800">Informational (Kỹ thuật, Tiêu chuẩn, Hướng dẫn)</span>
                <span className="text-slate-700">{countIntent.Informational} kw ({Math.round((countIntent.Informational / (totalKeywords || 1)) * 100)}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${(countIntent.Informational / (totalKeywords || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-purple-800">Local Commercial (Khu công nghiệp / Tỉnh thành)</span>
                <span className="text-slate-700">{countIntent.Local} kw ({Math.round((countIntent.Local / (totalKeywords || 1)) * 100)}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${(countIntent.Local / (totalKeywords || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Marketing Funnel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Phễu Chuyển Đổi B2B (Funnel)</h2>
              <p className="text-xs text-slate-500">Từ nhận biết kỹ thuật đến quyết định đặt hàng</p>
            </div>
            <button
              onClick={() => onNavigate('topickey')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Topic Key</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-md uppercase">
                  TOFU
                </span>
                <span className="ml-2 font-bold text-xs text-slate-900">
                  Nhận thức & Tiêu chuẩn
                </span>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Tiêu chuẩn HACCP, cách tính công suất động cơ, xử lý nguyên liệu dập nát...
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-blue-700">{countFunnel.TOFU}</div>
                <div className="text-[10px] text-slate-400">từ khóa</div>
              </div>
            </div>

            <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-600 text-white rounded-md uppercase">
                  MOFU
                </span>
                <span className="ml-2 font-bold text-xs text-slate-900">
                  Cân nhắc & So sánh Giải pháp
                </span>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Băng tải PU vs PVC, băng tải Z đứng cấp liệu phễu rung, băng tải cong 90 độ...
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-amber-700">{countFunnel.MOFU}</div>
                <div className="text-[10px] text-slate-400">từ khóa</div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded-md uppercase">
                  BOFU
                </span>
                <span className="ml-2 font-bold text-xs text-slate-900">
                  Chốt đơn B2B & Báo giá Xưởng
                </span>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Báo giá băng tải thực phẩm, nhà sản xuất Đồng Nai, thiết kế băng tải theo yêu cầu...
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-emerald-700">{countFunnel.BOFU}</div>
                <div className="text-[10px] text-slate-400">từ khóa</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pillars Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Cấu Trúc Pillars Hiện Tại</h2>
            <p className="text-xs text-slate-500">
              4 trụ cột nội dung đảm bảo bao phủ toàn bộ Topical Authority ngành chế tạo máy
            </p>
          </div>
          <button
            onClick={() => onNavigate('pillar')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Quản lý Hub & Spoke</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {pillarGroupings.map((p, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-white transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm">
                  Pillar {idx + 1}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {p.clusterCount} Clusters
                </span>
              </div>
              <div className="font-bold text-slate-900 text-sm line-clamp-1">{p.name}</div>
              <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                <span>Số từ khóa hỗ trợ:</span>
                <span className="font-bold text-slate-900">{p.keywordCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Source Rules Reminder */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
          <div>
            <span className="font-bold text-slate-900">Quy tắc chuẩn mực dữ liệu: </span>
            Các số liệu Volume, KD, CPC tuyệt đối không bịa số. Các từ do AI tổng hợp được gắn mác
            rõ ràng là <span className="font-semibold text-amber-700">AI ESTIMATE</span>; khi tải
            tệp từ Ahrefs/Google Keyword Planner lên hệ thống sẽ hiển thị mác{' '}
            <span className="font-semibold text-blue-700">REAL DATA</span>.
          </div>
        </div>
        <button
          onClick={() => onNavigate('import')}
          className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold shrink-0"
        >
          Tải lên CSV thực tế
        </button>
      </div>
    </div>
  );
};
