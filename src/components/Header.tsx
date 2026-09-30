import React from 'react';
import {
  Sparkles,
  RefreshCw,
  Download,
  Layers,
  ShieldCheck,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

interface HeaderProps {
  currentSeed: string;
  totalKeywords: number;
  totalPillars: number;
  isAiLoading: boolean;
  onOpenOpportunitySettings: () => void;
  onResetDemo: () => void;
  onQuickExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSeed,
  totalKeywords,
  totalPillars,
  isAiLoading,
  onOpenOpportunitySettings,
  onResetDemo,
  onQuickExport,
}) => {
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-sm font-bold text-lg">
            SK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 tracking-tight text-base">
                SEO KEYMAP AI
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                B2B Industrial v2.6
              </span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Chuyên nghiên cứu từ khóa & Topical Authority ngành máy móc
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block" />

        {/* Current Seed Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
          <span className="text-slate-400">Seed Keyword:</span>
          <span className="font-bold text-slate-900 flex items-center gap-1">
            <Search className="w-3.5 h-3.5 text-indigo-500" />
            "{currentSeed}"
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Metric indicators */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{totalKeywords} từ khóa</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>{totalPillars} Pillars</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Quy tắc: Không bịa số Volume/KD</span>
          </div>
        </div>

        <button
          onClick={onOpenOpportunitySettings}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 text-xs font-medium flex items-center gap-1.5"
          title="Tùy chỉnh trọng số Opportunity Score"
        >
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <span className="hidden sm:inline">Trọng số Opportunity</span>
        </button>

        <button
          onClick={onResetDemo}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 text-xs font-medium flex items-center gap-1.5"
          title="Tải lại dữ liệu mẫu Băng tải B2B"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
          <span className="hidden sm:inline">Dữ liệu mẫu</span>
        </button>

        <a
          href="/api/download-standalone-html"
          download="b2b-seo-standalone.html"
          className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all text-xs font-bold flex items-center gap-1.5 shadow-xs"
          title="Tải tệp mã nguồn HTML duy nhất (chứa đầy đủ HTML, CSS và JS) để đưa lên bất kỳ web server nào"
        >
          <Download className="w-3.5 h-3.5 text-blue-200" />
          <span className="hidden sm:inline">Tải file HTML</span>
          <span className="sm:hidden">HTML</span>
        </a>

        <button
          onClick={onQuickExport}
          className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Xuất dữ liệu</span>
        </button>

        {isAiLoading && (
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-medium animate-pulse">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-600" />
            <span>AI đang phân tích...</span>
          </div>
        )}
      </div>
    </header>
  );
};
