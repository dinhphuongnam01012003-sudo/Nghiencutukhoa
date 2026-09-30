import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { KeywordItem, SearchIntent, PriorityLevel, CleaningStatus } from '../types/seo';
import { exportToCSV } from '../utils/exportUtils';

interface KeywordListViewProps {
  keywords: KeywordItem[];
  setKeywords: React.Dispatch<React.SetStateAction<KeywordItem[]>>;
  onOpenOpportunitySettings: () => void;
  seedKeyword: string;
}

export const KeywordListView: React.FC<KeywordListViewProps> = ({
  keywords,
  setKeywords,
  onOpenOpportunitySettings,
  seedKeyword,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [intentFilter, setIntentFilter] = useState<string>('ALL');
  const [pillarFilter, setPillarFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Sorting
  const [sortField, setSortField] = useState<keyof KeywordItem>('opportunityScore');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Pagination
  const [page, setPage] = useState<number>(1);
  const pageSize = 15;

  const pillarsList = useMemo(() => {
    return Array.from(new Set(keywords.map((k) => k.pillar).filter(Boolean)));
  }, [keywords]);

  const filteredKeywords = useMemo(() => {
    return keywords.filter((k) => {
      const matchSearch =
        k.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.parentTopic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.cluster.toLowerCase().includes(searchTerm.toLowerCase());

      const matchIntent = intentFilter === 'ALL' || k.intent === intentFilter;
      const matchPillar = pillarFilter === 'ALL' || k.pillar === pillarFilter;
      const matchPriority = priorityFilter === 'ALL' || k.priority === priorityFilter;
      const matchStatus = statusFilter === 'ALL' || k.status === statusFilter;
      const matchSource = sourceFilter === 'ALL' || k.dataSource === sourceFilter;

      return matchSearch && matchIntent && matchPillar && matchPriority && matchStatus && matchSource;
    });
  }, [keywords, searchTerm, intentFilter, pillarFilter, priorityFilter, statusFilter, sourceFilter]);

  const sortedKeywords = useMemo(() => {
    return [...filteredKeywords].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle numbers vs strings
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredKeywords, sortField, sortAsc]);

  const totalPages = Math.ceil(sortedKeywords.length / pageSize) || 1;
  const paginatedKeywords = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedKeywords.slice(start, start + pageSize);
  }, [sortedKeywords, page, pageSize]);

  const handleSort = (field: keyof KeywordItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default desc for scores
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedKeywords.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedKeywords.map((k) => k.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const updated = new Set(selectedIds);
    if (updated.has(id)) updated.delete(id);
    else updated.add(id);
    setSelectedIds(updated);
  };

  // Bulk actions
  const handleBulkStatus = (status: CleaningStatus) => {
    if (!selectedIds.size) return;
    setKeywords((prev) =>
      prev.map((k) => (selectedIds.has(k.id) ? { ...k, status } : k))
    );
    setSelectedIds(new Set());
  };

  const handleBulkDelete = () => {
    if (!selectedIds.size) return;
    setKeywords((prev) => prev.filter((k) => !selectedIds.has(k.id)));
    setSelectedIds(new Set());
  };

  const handleExportFiltered = () => {
    exportToCSV(sortedKeywords, `Keywords_${seedKeyword}_Filtered`);
  };

  const getIntentBadge = (intent: SearchIntent) => {
    switch (intent) {
      case 'Commercial Investigation':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Transactional':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Informational':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Local Commercial':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'Navigational':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  const getPriorityBadge = (p: PriorityLevel) => {
    switch (p) {
      case 'P1':
        return 'bg-rose-100 text-rose-800 font-extrabold';
      case 'P2':
        return 'bg-amber-100 text-amber-800 font-semibold';
      case 'P3':
        return 'bg-slate-100 text-slate-700 font-medium';
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-full animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 mb-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Ahrefs-Style Keyword Explorer Table
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Danh Sách Phân Tích Từ Khóa Chuyên Sâu
          </h1>
          <p className="text-xs text-slate-500">
            Tổng cộng: <span className="font-bold text-slate-900">{filteredKeywords.length}</span> từ
            khóa phù hợp bộ lọc. Hiển thị rõ nguồn dữ liệu (AI ESTIMATE vs REAL DATA).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenOpportunitySettings}
            className="px-3 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs"
          >
            Chỉnh Trọng Số Opportunity
          </button>
          <button
            onClick={handleExportFiltered}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Xuất CSV ({sortedKeywords.length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Search box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm theo từ khóa, topic, cluster..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Intent filter */}
          <div>
            <select
              value={intentFilter}
              onChange={(e) => {
                setIntentFilter(e.target.value);
                setPage(1);
              }}
              className="w-full py-2 px-2.5 text-xs rounded-lg border border-slate-200 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">Tất cả Intent</option>
              <option value="Commercial Investigation">Commercial Investigation</option>
              <option value="Transactional">Transactional (Báo giá)</option>
              <option value="Informational">Informational</option>
              <option value="Local Commercial">Local Commercial</option>
              <option value="Navigational">Navigational</option>
            </select>
          </div>

          {/* Pillar filter */}
          <div>
            <select
              value={pillarFilter}
              onChange={(e) => {
                setPillarFilter(e.target.value);
                setPage(1);
              }}
              className="w-full py-2 px-2.5 text-xs rounded-lg border border-slate-200 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">Tất cả Pillar</option>
              {pillarsList.map((p, idx) => (
                <option key={idx} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Priority filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
              className="w-full py-2 px-2.5 text-xs rounded-lg border border-slate-200 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">Mọi ưu tiên (P1, P2, P3)</option>
              <option value="P1">P1 - Trọng tâm</option>
              <option value="P2">P2 - Hỗ trợ</option>
              <option value="P3">P3 - Long-tail</option>
            </select>
          </div>

          {/* Data source filter */}
          <div>
            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value);
                setPage(1);
              }}
              className="w-full py-2 px-2.5 text-xs rounded-lg border border-slate-200 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">Nguồn: Tất cả</option>
              <option value="AI ESTIMATE">AI ESTIMATE</option>
              <option value="REAL DATA">REAL DATA</option>
              <option value="USER DATA">USER DATA</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Bar (Visible when items selected) */}
        {selectedIds.size > 0 && (
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg">
            <span className="font-semibold text-slate-700">
              Đã chọn <span className="text-blue-600">{selectedIds.size}</span> từ khóa
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkStatus('KEEP')}
                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded font-semibold transition-colors flex items-center gap-1"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Giữ (KEEP)</span>
              </button>
              <button
                onClick={() => handleBulkStatus('REVIEW')}
                className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded font-semibold transition-colors flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Cần xem xét</span>
              </button>
              <button
                onClick={() => handleBulkStatus('REMOVE')}
                className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded font-semibold transition-colors flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Loại bỏ (REMOVE)</span>
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-2.5 py-1 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded font-semibold transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Header Table */}
      <div className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] relative">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900 text-slate-200 sticky top-0 z-20 select-none shadow-sm">
              <tr>
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedKeywords.length > 0 &&
                      selectedIds.size === paginatedKeywords.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th
                  onClick={() => handleSort('keyword')}
                  className="p-3 cursor-pointer hover:bg-slate-800 transition-colors font-bold whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Keyword</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('intent')}
                  className="p-3 cursor-pointer hover:bg-slate-800 transition-colors font-bold whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Intent</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3 font-bold whitespace-nowrap">Volume</th>
                <th className="p-3 font-bold whitespace-nowrap">KD</th>
                <th
                  onClick={() => handleSort('parentTopic')}
                  className="p-3 cursor-pointer hover:bg-slate-800 transition-colors font-bold whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Parent Topic</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3 font-bold whitespace-nowrap">Vai trò</th>
                <th
                  onClick={() => handleSort('pillar')}
                  className="p-3 cursor-pointer hover:bg-slate-800 transition-colors font-bold whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Pillar</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3 font-bold whitespace-nowrap">Cluster</th>
                <th
                  onClick={() => handleSort('serpSimilarity')}
                  className="p-3 cursor-pointer hover:bg-slate-800 transition-colors font-bold whitespace-nowrap"
                  title="SERP Similarity Score (0-100)"
                >
                  <div className="flex items-center gap-1.5">
                    <span>SERP Sim.</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('opportunityScore')}
                  className="p-3 cursor-pointer hover:bg-slate-800 transition-colors font-bold whitespace-nowrap"
                  title="Opportunity Score (0-100)"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Opportunity</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('businessRelevance')}
                  className="p-3 cursor-pointer hover:bg-slate-800 transition-colors font-bold whitespace-nowrap"
                  title="Business Relevance (0-100)"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Relevance</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3 font-bold whitespace-nowrap">Priority</th>
                <th className="p-3 font-bold whitespace-nowrap">Nguồn</th>
                <th className="p-3 font-bold whitespace-nowrap">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedKeywords.map((k) => {
                const isSelected = selectedIds.has(k.id);
                return (
                  <tr
                    key={k.id}
                    className={`hover:bg-blue-50/40 transition-colors ${
                      isSelected ? 'bg-blue-50/70' : ''
                    }`}
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(k.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{k.keyword}</span>
                        {k.isLocal && (
                          <span className="px-1.5 py-0.2 text-[9px] bg-cyan-100 text-cyan-800 rounded font-semibold">
                            Local
                          </span>
                        )}
                        {k.isBrand && (
                          <span className="px-1.5 py-0.2 text-[9px] bg-purple-100 text-purple-800 rounded font-semibold">
                            Brand
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getIntentBadge(
                          k.intent
                        )}`}
                      >
                        {k.intent}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {typeof k.volume === 'number' ? k.volume.toLocaleString() : k.volume}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {typeof k.kd === 'number' ? k.kd : k.kd}
                    </td>
                    <td className="p-3 text-slate-700 font-medium whitespace-nowrap">
                      {k.parentTopic}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {k.isPrimary ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          Primary
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                          Secondary
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-600 font-medium whitespace-nowrap">
                      {k.pillar}
                    </td>
                    <td className="p-3 text-slate-600 whitespace-nowrap">{k.cluster}</td>
                    <td className="p-3 whitespace-nowrap font-mono">
                      <div className="flex items-center gap-1">
                        <span
                          className={`font-bold ${
                            k.serpSimilarity >= 85
                              ? 'text-emerald-600'
                              : k.serpSimilarity >= 65
                              ? 'text-blue-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {k.serpSimilarity}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-bold font-mono text-indigo-700">
                        <span>{k.opportunityScore}</span>
                        <div className="w-10 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full"
                            style={{ width: `${k.opportunityScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap font-mono font-semibold text-slate-700">
                      {k.businessRelevance}/100
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${getPriorityBadge(k.priority)}`}>
                        {k.priority}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`px-1.5 py-0.5 text-[9px] font-bold rounded-sm ${
                          k.dataSource === 'REAL DATA'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {k.dataSource}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          k.status === 'KEEP'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : k.status === 'REVIEW'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {k.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {paginatedKeywords.length === 0 && (
                <tr>
                  <td colSpan={15} className="p-8 text-center text-slate-400 italic">
                    Không tìm thấy từ khóa nào phù hợp bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            Trang <span className="font-bold text-slate-900">{page}</span> / {totalPages} (Tổng{' '}
            {sortedKeywords.length} từ khóa)
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
