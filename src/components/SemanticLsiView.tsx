import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Sparkles,
  Layers,
  Network,
  HelpCircle,
  AlertCircle,
  FileText,
  Upload,
  Copy,
  Check,
  Download,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  GitFork,
  Target,
  FileEdit,
  Plus,
  Filter,
  Trash2,
  X,
} from 'lucide-react';
import { SemanticAnalysisReport, SemanticLsiItem, SearchIntent, SemanticEntity, SemanticRelationship } from '../types/seo';
import { exportToCSV, copyToClipboard, exportToJSON } from '../utils/exportUtils';

interface SemanticLsiViewProps {
  semanticReport: SemanticAnalysisReport;
  setSemanticReport: React.Dispatch<React.SetStateAction<SemanticAnalysisReport>>;
  semanticLsi: SemanticLsiItem[];
  setSemanticLsi: React.Dispatch<React.SetStateAction<SemanticLsiItem[]>>;
  onPushToKeywords: (item: SemanticLsiItem) => void;
  onRunSemanticAnalysis: (technicalText: string) => Promise<void>;
  isAnalyzing: boolean;
  seedKeyword: string;
  onNavigateToOutline?: (headingTopic: string) => void;
}

export const SemanticLsiView: React.FC<SemanticLsiViewProps> = ({
  semanticReport,
  setSemanticReport,
  semanticLsi,
  setSemanticLsi,
  onPushToKeywords,
  onRunSemanticAnalysis,
  isAnalyzing,
  seedKeyword,
  onNavigateToOutline,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'report' | 'extract' | 'terms'>('report');
  const [techInput, setTechInput] = useState('');
  const [copiedMd, setCopiedMd] = useState(false);
  const [selectedEntityCat, setSelectedEntityCat] = useState<string>('Tất cả');

  // Add Entity Modal State
  const [isAddEntityOpen, setIsAddEntityOpen] = useState(false);
  const [newEntityName, setNewEntityName] = useState('');
  const [newEntityCategory, setNewEntityCategory] = useState<string>('Sản phẩm / Dịch vụ');
  const [newEntityDesc, setNewEntityDesc] = useState('');
  const [newEntityImportance, setNewEntityImportance] = useState<'Core' | 'Supporting' | 'Contextual'>('Core');
  const [newEntityRelevance, setNewEntityRelevance] = useState<number>(95);

  // Add Relationship Modal State
  const [isAddRelOpen, setIsAddRelOpen] = useState(false);
  const [newRelSource, setNewRelSource] = useState('');
  const [newRelType, setNewRelType] = useState<string>('A là gì (Định nghĩa)');
  const [newRelTarget, setNewRelTarget] = useState('');
  const [newRelStatement, setNewRelStatement] = useState('');

  const ENTITY_CATEGORIES = [
    'Tất cả',
    'Người / Đối tượng',
    'Sản phẩm / Dịch vụ',
    'Địa điểm',
    'Khái niệm',
    'Công cụ',
    'Thuộc tính',
    'Thành phần',
    'Phương pháp',
    'Thương hiệu',
    'Chủ đề phụ',
  ];

  const filteredEntities = useMemo(() => {
    if (selectedEntityCat === 'Tất cả') return semanticReport.mainEntities;
    return semanticReport.mainEntities.filter((e) =>
      e.category.toLowerCase().includes(selectedEntityCat.toLowerCase()) ||
      selectedEntityCat.toLowerCase().includes(e.category.toLowerCase())
    );
  }, [semanticReport.mainEntities, selectedEntityCat]);

  const handleAddEntity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntityName.trim()) return;
    const newEnt: SemanticEntity = {
      name: newEntityName.trim(),
      category: newEntityCategory,
      description: newEntityDesc.trim() || 'Thực thể ngữ nghĩa bổ trợ cho chủ đề chính',
      importance: newEntityImportance,
      relevance: newEntityRelevance,
    };
    setSemanticReport((prev) => ({
      ...prev,
      mainEntities: [newEnt, ...prev.mainEntities],
    }));
    setNewEntityName('');
    setNewEntityDesc('');
    setIsAddEntityOpen(false);
  };

  const handleDeleteEntity = (name: string) => {
    setSemanticReport((prev) => ({
      ...prev,
      mainEntities: prev.mainEntities.filter((e) => e.name !== name),
    }));
  };

  const handleAddRelationship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRelSource.trim() || !newRelStatement.trim()) return;
    const newRel: SemanticRelationship = {
      sourceEntity: newRelSource.trim(),
      relationType: newRelType as any,
      targetEntity: newRelTarget.trim() || undefined,
      statement: newRelStatement.trim(),
    };
    setSemanticReport((prev) => ({
      ...prev,
      semanticRelationships: [newRel, ...prev.semanticRelationships],
    }));
    setNewRelSource('');
    setNewRelTarget('');
    setNewRelStatement('');
    setIsAddRelOpen(false);
  };

  const handleDeleteRelationship = (idx: number) => {
    setSemanticReport((prev) => ({
      ...prev,
      semanticRelationships: prev.semanticRelationships.filter((_, i) => i !== idx),
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setTechInput(content);
    };
    reader.readAsText(file);
  };

  const handleCopyReportMarkdown = async () => {
    let md = `# BÁO CÁO PHÂN TÍCH SEMANTIC SEO & ENTITY GRAPH: ${semanticReport.primaryTopic}\n\n`;
    md += `**Primary Keyword:** ${semanticReport.primaryKeyword}\n`;
    md += `**Search Intent:** ${semanticReport.searchIntent}\n`;
    md += `**Target Audience:** ${semanticReport.targetAudience}\n`;
    md += `**Core Subject:** ${semanticReport.coreSubject}\n\n`;

    md += `## 1. Main & Related Entities (Thực Thể Ngữ Nghĩa)\n`;
    semanticReport.mainEntities.forEach((ent) => {
      md += `- **[${ent.importance}] ${ent.name}** (${ent.category}): ${ent.description}\n`;
    });
    md += `\n`;

    md += `## 2. Semantic Relationships (Mối Quan Hệ Khái Niệm)\n`;
    semanticReport.semanticRelationships.forEach((rel) => {
      md += `### ${rel.sourceEntity} [${rel.relationType}]\n`;
      if (rel.targetEntity) md += `*So sánh / Liên kết với: ${rel.targetEntity}*\n`;
      md += `> ${rel.statement}\n\n`;
    });

    md += `## 3. Natural Related Terms (Thuật Ngữ Xuất Hiện Tự Nhiên)\n`;
    semanticReport.naturalRelatedTerms.forEach((t) => {
      md += `- **${t.term}**: ${t.usageContext} *(${t.importance})*\n`;
    });
    md += `\n`;

    md += `## 4. Subtopics & Topical Coverage\n`;
    semanticReport.mainSubtopics.forEach((s) => {
      md += `### ${s.title}\n`;
      md += `- Thực thể bao phủ: ${s.entitiesCovered.join(', ')}\n`;
      md += `- Mục tiêu: ${s.purpose}\n\n`;
    });

    md += `## 5. Related Questions (FAQ B2B)\n`;
    semanticReport.relatedQuestions.forEach((q) => {
      md += `**Q: ${q.question}**\n`;
      md += `*Tiêu điểm: ${q.entityFocus}*\n`;
      md += `A: ${q.briefAnswer}\n\n`;
    });

    md += `## 6. Content Gaps Cần Giải Quyết\n`;
    semanticReport.contentGaps.forEach((g) => {
      md += `- ${g}\n`;
    });
    md += `\n`;

    md += `## 7. Khung Cấu Trúc Bài Viết Entity-First\n`;
    semanticReport.suggestedContentStructure.forEach((sec) => {
      md += `### ${sec.heading}\n`;
      md += `- Thực thể tích hợp: ${sec.entitiesIncluded.join(', ')}\n`;
      md += `- Mục tiêu: ${sec.objective}\n\n`;
    });

    const ok = await copyToClipboard(md);
    if (ok) {
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200 mb-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            Entity-First Semantic Architecture
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Chuyên Gia Semantic SEO: Thực Thể & Mối Quan Hệ Khái Niệm
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
            Không xem LSI đơn giản là nhồi từ khóa phụ với mật độ cơ học. Hệ thống xây dựng hoàn chỉnh
            <strong> bản đồ thực thể (Entities), ngữ cảnh kỹ thuật, và các mối quan hệ logic (A là gì,
            cấu tạo gồm gì, hoạt động ra sao, khác biệt với B thế nào)</strong> trước khi lên outline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyReportMarkdown}
            className="px-3 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            {copiedMd ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedMd ? 'Đã sao chép MD' : 'Sao chép Báo Cáo'}</span>
          </button>
          <button
            onClick={() => exportToJSON(semanticReport, `Semantic_SEO_Report_${seedKeyword}`)}
            className="px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Báo Cáo JSON</span>
          </button>
        </div>
      </div>

      {/* Subtabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('report')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeSubTab === 'report'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>Bản Đồ Phân Tích Thực Thể (8 Điểm Cốt Lõi)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('extract')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeSubTab === 'extract'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Nạp Tài Liệu Kỹ Thuật & Phân Tích AI</span>
        </button>

        <button
          onClick={() => setActiveSubTab('terms')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeSubTab === 'terms'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Danh Mục Thuật Ngữ LSI ({semanticLsi.length})</span>
        </button>
      </div>

      {/* TAB 1: BÁO CÁO PHÂN TÍCH THỰC THỂ (8 ĐIỂM CỐT LÕI) */}
      {activeSubTab === 'report' && (
        <div className="space-y-6">
          {/* Card 1: Primary Topic & Intent */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300">
                  CHỦ ĐỀ CHÍNH & Ý ĐỊNH TÌM KIẾM CỐT LÕI
                </span>
                <h2 className="text-xl sm:text-2xl font-black mt-1 text-white">
                  {semanticReport.primaryTopic}
                </h2>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 rounded-lg text-xs font-bold">
                  {semanticReport.searchIntent}
                </span>
                <span className="px-3 py-1 bg-white/10 text-slate-200 border border-white/20 rounded-lg text-xs font-semibold">
                  Primary: {semanticReport.primaryKeyword}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">
                  Đối tượng độc giả mục tiêu (Target Audience):
                </span>
                <div className="text-slate-200 mt-1 font-medium">{semanticReport.targetAudience}</div>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">
                  Bản chất chủ thể (Core Subject):
                </span>
                <div className="text-slate-200 mt-1 leading-relaxed">{semanticReport.coreSubject}</div>
              </div>
            </div>
          </div>

          {/* Card 2: Semantic Entities (Thực thể ngữ nghĩa) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-600" />
                  <span>2. Semantic Entities ({filteredEntities.length} Thực Thể Ngữ Nghĩa Trực Tiếp)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Phân loại chuẩn: Người/đối tượng, Sản phẩm/dịch vụ, Địa điểm, Khái niệm, Công cụ, Thuộc tính, Thành phần, Phương pháp, Thương hiệu, Chủ đề phụ.
                </p>
              </div>

              <button
                onClick={() => setIsAddEntityOpen(true)}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-indigo-200 shadow-2xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Thêm Thực Thể</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1 text-[11px]">
                <Filter className="w-3 h-3" /> Lọc nhóm:
              </span>
              {ENTITY_CATEGORIES.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedEntityCat(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    selectedEntityCat === cat
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredEntities.map((ent, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-400 transition-all space-y-1.5 text-xs flex flex-col justify-between group relative"
                >
                  <button
                    onClick={() => handleDeleteEntity(ent.name)}
                    className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 rounded transition-opacity"
                    title="Xóa thực thể này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between pr-5">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        {ent.category}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        {ent.importance} • {ent.relevance}%
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-sm mt-1">{ent.name}</div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{ent.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Semantic Relationships (Mối quan hệ bản chất giữa các thực thể) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <Network className="w-4 h-4 text-blue-600" />
                  <span>3. Semantic Relationships ({semanticReport.semanticRelationships.length} Mối Quan Hệ Bản Chất)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Trả lời câu hỏi: A là gì? Gồm những gì? Hoạt động ra sao? Khác B ở điểm nào? Khi
                  nào nên dùng? Ưu nhược điểm?
                </p>
              </div>

              <button
                onClick={() => setIsAddRelOpen(true)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-blue-200 shadow-2xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Thêm Quan Hệ</span>
              </button>
            </div>

            <div className="space-y-3">
              {semanticReport.semanticRelationships.map((rel, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-400 transition-all space-y-1.5 text-xs group relative"
                >
                  <button
                    onClick={() => handleDeleteRelationship(idx)}
                    className="opacity-0 group-hover:opacity-100 absolute top-3 right-3 p-1 text-slate-400 hover:text-rose-600 rounded transition-opacity"
                    title="Xóa mối quan hệ này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center justify-between flex-wrap gap-2 pr-6">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-slate-900 text-sm">
                        {rel.sourceEntity}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                        {rel.relationType}
                      </span>
                      {rel.targetEntity && (
                        <span className="text-slate-500">
                          ➔ So sánh đối chuẩn với:{' '}
                          <strong className="text-slate-800">{rel.targetEntity}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed pl-2 border-l-2 border-blue-400 italic">
                    "{rel.statement}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Natural Related Terms & Subtopics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Natural Related Terms */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>3. Thuật Ngữ Xuất Hiện Tự Nhiên (Không Nhồi Nhét)</span>
              </h3>
              <div className="space-y-2.5">
                {semanticReport.naturalRelatedTerms.map((t, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{t.term}</span>
                      <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        {t.importance}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{t.usageContext}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Subtopics & Topical Coverage */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>4. Main Subtopics (Bao Phủ Chiều Sâu Đề Tài)</span>
              </h3>
              <div className="space-y-3">
                {semanticReport.mainSubtopics.map((sub, idx) => (
                  <div key={idx} className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100 text-xs space-y-1">
                    <div className="font-bold text-slate-900">{sub.title}</div>
                    <div className="text-[11px] text-slate-500">
                      Thực thể: <span className="text-indigo-700 font-medium">{sub.entitiesCovered.join(' • ')}</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{sub.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 5: Related Questions & Content Gaps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Related Questions FAQ */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>5. Câu Hỏi Thường Gặp Của Khách Hàng (FAQ B2B)</span>
              </h3>
              <div className="space-y-2.5">
                {semanticReport.relatedQuestions.map((q, idx) => (
                  <div key={idx} className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-200/80 text-xs space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="text-amber-700 font-mono">Q:</span>
                      <span>{q.question}</span>
                    </div>
                    <div className="text-[10px] text-indigo-700 font-semibold">
                      Tiêu điểm: {q.entityFocus}
                    </div>
                    <p className="text-slate-700 text-[11px] pl-3 border-l border-amber-300">
                      {q.briefAnswer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Gaps & Entity-First Structure */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <span>6. Khoảng Trống Nội Dung (Content Gaps) Cần Vượt Qua</span>
              </h3>
              <div className="space-y-2">
                {semanticReport.contentGaps.map((gap, idx) => (
                  <div key={idx} className="p-3 bg-rose-50/40 rounded-xl border border-rose-200 text-xs text-rose-900 leading-relaxed flex items-start gap-2">
                    <span className="font-bold text-rose-600 mt-0.5">•</span>
                    <span>{gap}</span>
                  </div>
                ))}
              </div>

              {/* Action to send to outline */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Cấu trúc gồm {semanticReport.suggestedContentStructure.length} phần Entity-First
                </span>
                {onNavigateToOutline && (
                  <button
                    onClick={() => onNavigateToOutline(semanticReport.primaryKeyword)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    <span>Dựng Outline Bài Viết</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NẠP TÀI LIỆU KỸ THUẬT & PHÂN TÍCH AI THEO 8 NGUYÊN TẮC */}
      {activeSubTab === 'extract' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div>
            <h2 className="font-black text-slate-900 text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Phân Tích Semantic SEO Từ Bản Đặc Tả Kỹ Thuật Máy Móc</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Dán thông số cơ khí thực tế hoặc tải file catalogue. AI sẽ bóc tách các thực thể, xác lập
              quan hệ bản chất giữa các chi tiết máy, và tự động tạo báo cáo Semantic SEO 8 bước hoàn chỉnh.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-600" />
                <span>Upload File Kỹ Thuật (.txt / .csv / .doc)</span>
                <input
                  type="file"
                  accept=".txt,.csv,.json,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={() =>
                  setTechInput(
                    `THÔNG SỐ BĂNG TẢI Z ĐỨNG CẤP LIỆU CHÍ NHẬT TỪ:
- Khung sườn Inox 304 chấn CNC dày 2.5mm, đánh bóng vi sinh Ra ≤ 0.8µm, mối hàn TIG chống bám vi khuẩn.
- Dây belt: Belt PU thực phẩm màu trắng đạt chứng nhận FDA 21 CFR, gờ T-cleat cao 50mm, vách tai bèo 60mm chống rơi liệu.
- Động cơ: Motor giảm tốc Wansin 1.5kW IP65 chống nước, biến tần Schneider điều tốc biến thiên 5-25m/phút.
- Chiều cao cấp liệu: Nâng từ phễu 500mm lên máy cân định lượng 14 đầu cao 3200mm.
- Năng suất: 2 tấn/giờ. Thiết kế module tháo rửa nhanh trong 15 phút, đạt chuẩn HACCP và GMP.`
                  )
                }
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                + Dán mẫu Catalogue Băng Tải Z Thực Phẩm
              </button>
            </div>

            <textarea
              rows={6}
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="Dán nội dung mô tả kỹ thuật, thông số cơ khí, vật liệu, hoặc catalogue sản phẩm vào đây..."
              className="w-full p-4 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex justify-end">
              <button
                onClick={async () => {
                  if (!techInput.trim()) return;
                  await onRunSemanticAnalysis(techInput);
                  setActiveSubTab('report');
                }}
                disabled={isAnalyzing || !techInput.trim()}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Đang phân tích 8 bước Semantic SEO...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>CHẠY PHÂN TÍCH SEMANTIC SEO (8 NGUYÊN TẮC)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DANH MỤC THUẬT NGỮ LSI CHUYÊN SÂU */}
      {activeSubTab === 'terms' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Kho Thuật Ngữ LSI & Khái Niệm Ngành ({semanticLsi.length})
            </h3>
            <span className="text-xs text-slate-400">1-click để đưa vào kho từ khóa chính</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {semanticLsi.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-white transition-all space-y-2.5 text-xs flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      {item.type}
                    </span>
                    <span className="font-mono text-emerald-700 font-bold">
                      Relevance: {item.relevance}%
                    </span>
                  </div>

                  <div className="font-bold text-slate-900 text-sm">{item.keyword}</div>
                  <p className="text-slate-600 text-[11px] leading-relaxed bg-white p-2 rounded border border-slate-100">
                    {item.context}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    Phễu: <strong className="text-slate-800">{item.funnelStage}</strong>
                  </span>
                  <button
                    onClick={() => onPushToKeywords(item)}
                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded text-[11px] font-bold transition-colors border border-indigo-200"
                  >
                    + Đưa Vào Kho Từ Khóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: THÊM THỰC THỂ MỚI */}
      {isAddEntityOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>+ Thêm Semantic Entity Mới</span>
              </h3>
              <button
                onClick={() => setIsAddEntityOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEntity} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700">Tên Thực Thể:</label>
                <input
                  type="text"
                  required
                  value={newEntityName}
                  onChange={(e) => setNewEntityName(e.target.value)}
                  placeholder="VD: Inox 304 vi sinh, Tiêu chuẩn HACCP..."
                  className="w-full mt-1 p-2.5 rounded-lg border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Phân Loại Nhóm Thực Thể:</label>
                <select
                  value={newEntityCategory}
                  onChange={(e) => setNewEntityCategory(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-lg border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {ENTITY_CATEGORIES.filter((c) => c !== 'Tất cả').map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Tầm Quan Trọng:</label>
                  <select
                    value={newEntityImportance}
                    onChange={(e) => setNewEntityImportance(e.target.value as any)}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Core">Core (Cốt lõi)</option>
                    <option value="Supporting">Supporting (Bổ trợ)</option>
                    <option value="Contextual">Contextual (Ngữ cảnh)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">Độ liên quan (%):</label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={newEntityRelevance}
                    onChange={(e) => setNewEntityRelevance(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-lg border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Mô Tả Vai Trò Ngữ Cảnh:</label>
                <textarea
                  rows={3}
                  value={newEntityDesc}
                  onChange={(e) => setNewEntityDesc(e.target.value)}
                  placeholder="Mô tả thực thể này đóng vai trò gì trong bài viết và ngành máy móc..."
                  className="w-full mt-1 p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddEntityOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Lưu Thực Thể
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: THÊM MỐI QUAN HỆ BẢN CHẤT */}
      {isAddRelOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Network className="w-4 h-4 text-blue-600" />
                <span>+ Thêm Mối Quan Hệ Khái Niệm</span>
              </h3>
              <button
                onClick={() => setIsAddRelOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRelationship} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700">Thực Thể A (Chủ thể):</label>
                <input
                  type="text"
                  required
                  value={newRelSource}
                  onChange={(e) => setNewRelSource(e.target.value)}
                  placeholder="VD: Băng tải Z đứng, Dây belt PU..."
                  className="w-full mt-1 p-2.5 rounded-lg border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Loại Mối Quan Hệ Bản Chất:</label>
                <select
                  value={newRelType}
                  onChange={(e) => setNewRelType(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-lg border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="A là gì (Định nghĩa)">A là gì? (Định nghĩa)</option>
                  <option value="A gồm thành phần nào (Cấu tạo)">A gồm thành phần nào? (Cấu tạo)</option>
                  <option value="A hoạt động như thế nào (Cơ chế)">A hoạt động như thế nào? (Cơ chế)</option>
                  <option value="A liên quan đến B ra sao (Liên kết dây chuyền)">A liên quan đến B ra sao? (Liên kết dây chuyền)</option>
                  <option value="A khác B ở điểm nào (So sánh đối chuẩn)">A khác B ở điểm nào? (So sánh đối chuẩn)</option>
                  <option value="Khi nào nên sử dụng A (Trường hợp ứng dụng)">Khi nào nên sử dụng A? (Trường hợp ứng dụng)</option>
                  <option value="Ưu điểm và hạn chế của A (Đánh giá chuyên sâu)">Ưu điểm và hạn chế của A? (Đánh giá chuyên sâu)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Thực Thể B (Nếu có so sánh hoặc liên kết):</label>
                <input
                  type="text"
                  value={newRelTarget}
                  onChange={(e) => setNewRelTarget(e.target.value)}
                  placeholder="VD: Băng tải nghiêng thông thường, Máy cân định lượng..."
                  className="w-full mt-1 p-2.5 rounded-lg border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Diễn Giải Mối Quan Hệ Logic (Giá trị thực cho SEO & Người Đọc):</label>
                <textarea
                  rows={3}
                  required
                  value={newRelStatement}
                  onChange={(e) => setNewRelStatement(e.target.value)}
                  placeholder="Giải thích câu trả lời rõ ràng, chính xác kỹ thuật..."
                  className="w-full mt-1 p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddRelOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Lưu Quan Hệ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
