import React from 'react';
import {
  LayoutDashboard,
  Search,
  Grid3X3,
  TableProperties,
  Network,
  KeyRound,
  GitFork,
  Columns,
  FileSpreadsheet,
  FileEdit,
  TrendingDown,
  PieChart,
  Link2,
  UploadCloud,
  FileDown,
  AlertTriangle,
  Cpu,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'explorer'
  | 'semanticlsi'
  | 'matrix'
  | 'keywords'
  | 'cluster'
  | 'topickey'
  | 'keymap'
  | 'pillar'
  | 'contentmap'
  | 'outline'
  | 'competitor'
  | 'coverage'
  | 'internallink'
  | 'import'
  | 'export';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  counts: {
    totalKeywords: number;
    totalClusters: number;
    totalContents: number;
    cannibalizationRisks: number;
    reviewCount: number;
  };
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  count?: number;
  alert?: string;
  highlight?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, counts }) => {
  const navSections: NavSection[] = [
    {
      title: 'TỔNG QUAN & KHÁM PHÁ',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'explorer', label: 'Keyword Explorer', icon: Search, badge: 'AI Engine' },
        { id: 'semanticlsi', label: 'Key Semantic / LSI', icon: Cpu, badge: 'Đặc tả', highlight: true },
        { id: 'matrix', label: 'Keyword Matrix (9D)', icon: Grid3X3, count: 9 },
      ],
    },
    {
      title: 'NGHIÊN CỨU & PHÂN CỤM',
      items: [
        { id: 'keywords', label: 'Keyword List', icon: TableProperties, count: counts.totalKeywords },
        { id: 'cluster', label: 'Topic Cluster', icon: Network, count: counts.totalClusters },
        { id: 'topickey', label: 'Topic Key (Phễu & Thực thể)', icon: KeyRound },
        { id: 'keymap', label: 'Keymap (Mind Map / Tree)', icon: GitFork, highlight: true },
      ],
    },
    {
      title: 'CHIẾN LƯỢC NỘI DUNG B2B',
      items: [
        { id: 'pillar', label: 'Pillar – Cluster', icon: Columns },
        {
          id: 'contentmap',
          label: 'Content Map & Cannibalization',
          icon: FileSpreadsheet,
          count: counts.totalContents,
          alert: counts.cannibalizationRisks > 0 ? `${counts.cannibalizationRisks} Risk` : undefined,
        },
        { id: 'outline', label: 'Outline Generator', icon: FileEdit, badge: 'Chi tiết' },
        { id: 'internallink', label: 'Internal Link Map', icon: Link2 },
      ],
    },
    {
      title: 'THẨM ĐỊNH & PHỦ TOPIC',
      items: [
        { id: 'coverage', label: 'Topical Coverage (%)', icon: PieChart },
        { id: 'competitor', label: 'Competitor Gap', icon: TrendingDown },
        {
          id: 'import',
          label: 'Data Import & Clean',
          icon: UploadCloud,
          badge: counts.reviewCount > 0 ? `${counts.reviewCount} chờ duyệt` : undefined,
        },
        { id: 'export', label: 'Xuất Dữ Liệu', icon: FileDown },
      ],
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-slate-900 text-slate-300 flex flex-col h-[calc(100vh-4rem)] select-none shrink-0 overflow-y-auto">
      <div className="p-4 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as ActiveTab)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive
                            ? 'text-white'
                            : item.highlight
                            ? 'text-indigo-400'
                            : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      {item.alert && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded-sm bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          {item.alert}
                        </span>
                      )}
                      {item.badge && !item.alert && (
                        <span
                          className={`px-1.5 py-0.5 text-[9px] font-semibold rounded-sm ${
                            isActive
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.count !== undefined && !item.alert && !item.badge && (
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-bold rounded-sm ${
                            isActive
                              ? 'bg-blue-700 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto p-4 border-t border-slate-800 bg-slate-950/50 text-[11px] text-slate-400">
        <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          B2B Machinery Mode
        </div>
        <div className="leading-relaxed text-slate-400">
          Tối ưu cho Máy móc, Thiết bị sản xuất, Dây chuyền thực phẩm & Chế tạo máy B2B.
        </div>
      </div>
    </aside>
  );
};
