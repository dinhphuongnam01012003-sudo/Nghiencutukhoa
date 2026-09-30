import React, { useState } from 'react';
import {
  FileEdit,
  Sparkles,
  Copy,
  Download,
  Check,
  Layers,
  HelpCircle,
  Link2,
  RefreshCw,
  Plus,
  Trash2,
  ListPlus,
  PenTool,
  Wand2,
  BookOpen,
  ArrowRight,
  Sliders,
  AlignLeft,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { SeoOutline, KeywordItem } from '../types/seo';
import { copyToClipboard, downloadFile } from '../utils/exportUtils';

interface CustomH2Item {
  id: string;
  title: string;
  subheadings: string[];
}

interface OutlineBuilderViewProps {
  outline: SeoOutline;
  setOutline: React.Dispatch<React.SetStateAction<SeoOutline>>;
  onGenerateAiOutline: (
    keyword: string,
    customHeadings?: Array<{ title: string; subheadings?: string[] }>,
    customOutlineText?: string
  ) => Promise<void>;
  isGenerating: boolean;
  availableKeywords?: KeywordItem[];
  seedKeyword?: string;
}

export const OutlineBuilderView: React.FC<OutlineBuilderViewProps> = ({
  outline,
  setOutline,
  onGenerateAiOutline,
  isGenerating,
  availableKeywords = [],
  seedKeyword = '',
}) => {
  const [activeMode, setActiveMode] = useState<'keyword' | 'custom_headings'>('keyword');
  const [copiedMd, setCopiedMd] = useState(false);
  const [customKeyword, setCustomKeyword] = useState(outline.primaryKeyword || seedKeyword || '');
  
  // Custom Headings State
  const [customHeadings, setCustomHeadings] = useState<CustomH2Item[]>([
    {
      id: 'h2-1',
      title: `1. Tổng quan cấu tạo và nguyên lý hoạt động của ${outline.primaryKeyword || seedKeyword || 'máy móc'}`,
      subheadings: [],
    },
    {
      id: 'h2-2',
      title: '2. Tiêu chuẩn kỹ thuật cơ khí & lựa chọn vật liệu Inox',
      subheadings: [],
    },
    {
      id: 'h2-3',
      title: '3. Phân loại các model phổ biến và ứng dụng cho nhà xưởng',
      subheadings: [],
    },
    {
      id: 'h2-4',
      title: '4. Bảng báo giá gia công theo yêu cầu và chi phí lắp đặt',
      subheadings: [],
    },
    {
      id: 'h2-5',
      title: '5. Tiêu chí chọn xưởng chế tạo uy tín và chế độ bảo hành 24/7',
      subheadings: [],
    },
  ]);

  const [inputStyle, setInputStyle] = useState<'visual' | 'text'>('visual');
  const [rawText, setRawText] = useState('');
  const [newH3Input, setNewH3Input] = useState<{ [h2Id: string]: string }>({});

  const metaTitleCharCount = outline.metaTitle?.length || 0;
  const metaDescCharCount = outline.metaDescription?.length || 0;

  // Sync custom headings to raw text
  const syncHeadingsToText = (items: CustomH2Item[]) => {
    let text = '';
    items.forEach((item) => {
      text += `## ${item.title}\n`;
      item.subheadings.forEach((sub) => {
        text += `### ${sub}\n`;
      });
      text += '\n';
    });
    setRawText(text.trim());
  };

  // Parse raw text into structured headings
  const parseTextToHeadings = (text: string) => {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const parsed: CustomH2Item[] = [];
    let currentH2: CustomH2Item | null = null;

    lines.forEach((line) => {
      if (line.startsWith('## ') || (!line.startsWith('### ') && !currentH2)) {
        const title = line.replace(/^##+\s*/, '').replace(/^\d+[\.\)]\s*/, '').trim();
        if (title) {
          currentH2 = {
            id: `h2-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            title,
            subheadings: [],
          };
          parsed.push(currentH2);
        }
      } else if (line.startsWith('### ') && currentH2) {
        const subTitle = line.replace(/^###+\s*/, '').trim();
        if (subTitle) {
          currentH2.subheadings.push(subTitle);
        }
      } else if (currentH2) {
        // Plain line treated as H3 or sub-point if starts with - or *
        const subTitle = line.replace(/^[-*]\s*/, '').trim();
        if (subTitle) {
          currentH2.subheadings.push(subTitle);
        }
      }
    });

    if (parsed.length > 0) {
      setCustomHeadings(parsed);
    }
  };

  // Handle adding H2
  const handleAddH2 = () => {
    const newH2: CustomH2Item = {
      id: `h2-${Date.now()}`,
      title: `${customHeadings.length + 1}. Tiêu đề mục H2 mới`,
      subheadings: [],
    };
    const updated = [...customHeadings, newH2];
    setCustomHeadings(updated);
    syncHeadingsToText(updated);
  };

  // Handle removing H2
  const handleRemoveH2 = (id: string) => {
    const updated = customHeadings.filter((h) => h.id !== id);
    setCustomHeadings(updated);
    syncHeadingsToText(updated);
  };

  // Handle update H2 title
  const handleUpdateH2Title = (id: string, newTitle: string) => {
    const updated = customHeadings.map((h) => (h.id === id ? { ...h, title: newTitle } : h));
    setCustomHeadings(updated);
    syncHeadingsToText(updated);
  };

  // Handle adding H3 to an H2
  const handleAddH3 = (h2Id: string) => {
    const text = (newH3Input[h2Id] || '').trim();
    if (!text) return;
    const updated = customHeadings.map((h) => {
      if (h.id === h2Id) {
        return {
          ...h,
          subheadings: [...h.subheadings, text],
        };
      }
      return h;
    });
    setCustomHeadings(updated);
    syncHeadingsToText(updated);
    setNewH3Input((prev) => ({ ...prev, [h2Id]: '' }));
  };

  // Handle removing H3
  const handleRemoveH3 = (h2Id: string, subIdx: number) => {
    const updated = customHeadings.map((h) => {
      if (h.id === h2Id) {
        return {
          ...h,
          subheadings: h.subheadings.filter((_, idx) => idx !== subIdx),
        };
      }
      return h;
    });
    setCustomHeadings(updated);
    syncHeadingsToText(updated);
  };

  // Load Presets
  const loadPreset = (type: 'only_h2' | 'with_h3' | 'comparison') => {
    const kw = customKeyword || outline.primaryKeyword || seedKeyword || 'băng tải inox';
    if (type === 'only_h2') {
      const items: CustomH2Item[] = [
        { id: 'p1', title: `1. Tổng quan & nguyên lý hoạt động của ${kw}`, subheadings: [] },
        { id: 'p2', title: `2. Cấu tạo cơ khí & thông số kỹ thuật tiêu chuẩn`, subheadings: [] },
        { id: 'p3', title: `3. Phân loại các model ${kw} phổ biến cho nhà máy`, subheadings: [] },
        { id: 'p4', title: `4. Bảng báo giá gia công theo yêu cầu tại xưởng`, subheadings: [] },
        { id: 'p5', title: `5. Kinh nghiệm nghiệm thu và địa chỉ xưởng cơ khí uy tín`, subheadings: [] },
      ];
      setCustomHeadings(items);
      syncHeadingsToText(items);
    } else if (type === 'with_h3') {
      const items: CustomH2Item[] = [
        {
          id: 'p1',
          title: `1. Đánh giá chi tiết ưu điểm của ${kw} trong sản xuất`,
          subheadings: ['Cắt giảm 70% nhân công luân chuyển', 'Chống hao hụt và móp méo sản phẩm'],
        },
        {
          id: 'p2',
          title: `2. Cấu tạo chuyên sâu & Vật liệu Inox 304 chuẩn vi sinh`,
          subheadings: ['Khung sườn chấn CNC và hệ thống belt tải', 'Cụm động cơ giảm tốc & biến tần điều khiển tốc độ'],
        },
        {
          id: 'p3',
          title: `3. Báo giá và chi phí đầu tư tại xưởng sản xuất`,
          subheadings: ['Bảng giá tham khảo theo kích thước', 'Quy trình đặt hàng và bàn giao chạy thử'],
        },
      ];
      setCustomHeadings(items);
      syncHeadingsToText(items);
    } else if (type === 'comparison') {
      const items: CustomH2Item[] = [
        { id: 'p1', title: `1. So sánh phương pháp thủ công và ứng dụng ${kw}`, subheadings: [] },
        { id: 'p2', title: `2. Phân tích bài toán hoàn vốn (ROI) cho chủ xưởng`, subheadings: [] },
        { id: 'p3', title: `3. Tiêu chuẩn kiểm tra an toàn và bảo dưỡng định kỳ`, subheadings: [] },
        { id: 'p4', title: `4. Khuyến nghị dòng máy tối ưu theo quy mô nhà xưởng`, subheadings: [] },
      ];
      setCustomHeadings(items);
      syncHeadingsToText(items);
    }
  };

  // Count total H3 entered
  const totalCustomH3 = customHeadings.reduce((sum, h) => sum + h.subheadings.length, 0);

  // Trigger Generation based on Active Mode
  const handleTriggerGenerate = async () => {
    if (activeMode === 'keyword') {
      await onGenerateAiOutline(customKeyword);
    } else {
      // Custom Headings Mode
      const headingsPayload = customHeadings.map((h) => ({
        title: h.title,
        subheadings: h.subheadings,
      }));
      await onGenerateAiOutline(customKeyword, headingsPayload, rawText);
    }
  };

  const buildMarkdown = () => {
    let md = `# ${outline.h1}\n\n`;
    md += `**SEO Title:** ${outline.seoTitle}\n`;
    md += `**Meta Title (${metaTitleCharCount} chars):** ${outline.metaTitle}\n`;
    md += `**Meta Description (${metaDescCharCount} chars):** ${outline.metaDescription}\n`;
    md += `**Slug:** /${outline.slug}\n\n`;
    md += `## Sapo\n${outline.sapo}\n\n`;

    outline.headings?.forEach((h) => {
      md += `## ${h.title}\n`;
      if (h.intentTarget) md += `*Mục tiêu Intent: ${h.intentTarget}*\n`;
      h.keyPoints?.forEach((kp) => {
        md += `- ${kp}\n`;
      });
      h.subheadings?.forEach((sub) => {
        md += `\n### ${sub.title}\n`;
        sub.keyPoints?.forEach((skp) => {
          md += `  - ${skp}\n`;
        });
      });
      md += `\n`;
    });

    if (outline.technicalSpecsTable?.length) {
      md += `## Bảng Thông Số Kỹ Thuật Khuyến Nghị\n\n`;
      md += `| Thông số | Khuyến nghị tiêu chuẩn | Lưu ý thực tế |\n`;
      md += `| --- | --- | --- |\n`;
      outline.technicalSpecsTable.forEach((t) => {
        md += `| ${t.parameter} | ${t.recommended} | ${t.note} |\n`;
      });
      md += `\n`;
    }

    if (outline.faq?.length) {
      md += `## Câu Hỏi Thường Gặp (FAQ Schema)\n\n`;
      outline.faq.forEach((f) => {
        md += `**Q: ${f.question}**\n\n`;
        md += `A: ${f.answer}\n\n`;
      });
    }

    if (outline.callToAction) {
      md += `## Kêu Gọi Hành Động B2B (CTA)\n`;
      md += `- **Primary:** ${outline.callToAction.primary}\n`;
      md += `- **Secondary:** ${outline.callToAction.secondary}\n`;
      md += `- **Vị trí:** ${outline.callToAction.placement}\n\n`;
    }

    if (outline.internalLinks?.length) {
      md += `## Gợi Ý Internal Links\n`;
      outline.internalLinks.forEach((l) => {
        md += `- Anchor: [${l.anchorText}](${l.targetUrl}) - Lý do: ${l.reason}\n`;
      });
      md += `\n`;
    }

    if (outline.sourcesAndStandards?.length) {
      md += `## Tiêu Chuẩn Kỹ Thuật & Tài Liệu Tham Khảo\n`;
      outline.sourcesAndStandards.forEach((s) => {
        md += `- ${s}\n`;
      });
    }

    return md;
  };

  const handleCopyMarkdown = async () => {
    const md = buildMarkdown();
    const ok = await copyToClipboard(md);
    if (ok) {
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    }
  };

  const handleDownloadMarkdown = () => {
    const md = buildMarkdown();
    downloadFile(md, `SEO_Outline_${outline.slug || 'b2b'}`, 'text/markdown;charset=utf-8;');
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 mb-1.5">
            <FileEdit className="w-3.5 h-3.5 text-blue-600" />
            B2B Technical Outline Generator
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Trình Tạo Dàn Ý SEO Chuyên Sâu (Outline Builder)
          </h1>
          <p className="text-xs text-slate-500">
            Hỗ trợ 2 chế độ luân phiên: Tạo tự động từ từ khóa HOẶC Tự nhập khung H2/H3 để AI tự sáng tạo nội dung chi tiết bên dưới.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            {copiedMd ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedMd ? 'Đã chép MD' : 'Sao chép Markdown'}</span>
          </button>
          <button
            onClick={handleDownloadMarkdown}
            className="px-3.5 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Tải file .md</span>
          </button>
        </div>
      </div>

      {/* DUAL MODE CONTROLLER (LUÂN PHIÊN 2 CHỨC NĂNG) */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 space-y-5">
        {/* Mode Selector Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700 w-fit">
            <button
              onClick={() => setActiveMode('keyword')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeMode === 'keyword'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>1. Nhập Từ Khóa Tạo Outline</span>
            </button>
            <button
              onClick={() => {
                setActiveMode('custom_headings');
                syncHeadingsToText(customHeadings);
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeMode === 'custom_headings'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 text-indigo-300" />
              <span>2. Tự Nhập Khung H2/H3 (AI Sáng Tạo Chi Tiết)</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Gemini AI Technical SEO Engine</span>
          </div>
        </div>

        {/* MODE 1: KEYWORD TO OUTLINE */}
        {activeMode === 'keyword' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-blue-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Chế độ 1: Tự động phân tích & tạo toàn bộ Outline từ Từ khóa</span>
                </h3>
                <p className="text-xs text-slate-400">
                  AI sẽ tự động nghiên cứu Intent, phân chia cấu trúc H2, H3, bảng thông số kỹ thuật và FAQ Schema.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <input
                type="text"
                value={customKeyword}
                onChange={(e) => setCustomKeyword(e.target.value)}
                placeholder="Nhập từ khóa cần lên dàn ý (VD: phễu cấp liệu inox, băng tải z đứng, máy chiết rót...)"
                className="flex-1 w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder:text-slate-500 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleTriggerGenerate}
                disabled={isGenerating || !customKeyword.trim()}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 shadow-md"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI đang phân tích & lên dàn ý...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>TẠO OUTLINE B2B TỰ ĐỘNG</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Keyword Chips */}
            {availableKeywords.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] font-semibold text-slate-400">Gợi ý từ khóa đã nghiên cứu:</span>
                {availableKeywords.slice(0, 6).map((k, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCustomKeyword(k.keyword)}
                    className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 transition-colors"
                  >
                    {k.keyword}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODE 2: CUSTOM H2/H3 INPUT & SMART SUB-CONTENT GENERATION */}
        {activeMode === 'custom_headings' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Explanatory Guide Box */}
            <div className="p-3.5 bg-indigo-950/70 rounded-xl border border-indigo-500/40 text-xs text-indigo-100 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-indigo-200">
                  ⚡ Tính năng tự nhập H2, H3 & AI sáng tạo nội dung nhỏ bên dưới:
                </div>
                <p className="text-[11px] text-indigo-200/90 leading-relaxed">
                  Bạn có thể nhập danh sách các thẻ H2 và (tùy chọn) thẻ H3. <strong>ĐẶC BIỆT:</strong> Nếu bạn <strong>chỉ nhập các thẻ H2</strong> mà để trống H3, khi bấm <strong>"TẠO OUTLINE TỪ H2 ĐÃ NHẬP"</strong>, AI sẽ tự động phân tích và <strong>sáng tạo toàn bộ các thẻ H3 logic</strong>, cùng các điểm thảo luận kỹ thuật (bullet points), bảng thông số cơ khí và FAQ Schema chi tiết bên dưới mỗi H2!
                </p>
              </div>
            </div>

            {/* Keyword Context Input & Format Switcher */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                <span className="text-xs font-bold text-slate-300 shrink-0">Từ khóa trọng tâm:</span>
                <input
                  type="text"
                  value={customKeyword}
                  onChange={(e) => setCustomKeyword(e.target.value)}
                  placeholder="Từ khóa trọng tâm cho dàn ý..."
                  className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs w-full max-w-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
              </div>

              {/* Input Style Toggle & Presets */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-[11px]">
                  <button
                    onClick={() => {
                      setInputStyle('visual');
                      parseTextToHeadings(rawText);
                    }}
                    className={`px-2.5 py-1 rounded font-medium ${
                      inputStyle === 'visual' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Dạng danh sách
                  </button>
                  <button
                    onClick={() => {
                      setInputStyle('text');
                      syncHeadingsToText(customHeadings);
                    }}
                    className={`px-2.5 py-1 rounded font-medium ${
                      inputStyle === 'text' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Soạn văn bản / Markdown
                  </button>
                </div>

                {/* Preset Templates */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => loadPreset('only_h2')}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-[11px] font-semibold border border-amber-500/30 transition-colors"
                    title="Nạp mẫu chỉ có 5 thẻ H2 để thử AI tự tạo toàn bộ H3"
                  >
                    Mẫu Chỉ Nhập H2
                  </button>
                  <button
                    onClick={() => loadPreset('with_h3')}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded text-[11px] font-semibold border border-blue-500/30 transition-colors"
                  >
                    Mẫu H2 + H3
                  </button>
                </div>
              </div>
            </div>

            {/* VISUAL LIST INPUT */}
            {inputStyle === 'visual' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">
                    Danh sách các thẻ H2 ({customHeadings.length}) - Tổng H3 đã nhập: ({totalCustomH3})
                  </span>
                  {totalCustomH3 === 0 && (
                    <span className="text-amber-400 text-[11px] font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Chỉ có H2: AI sẽ tự động sáng tạo toàn bộ H3 và chi tiết nhỏ bên dưới!
                    </span>
                  )}
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {customHeadings.map((h2, idx) => (
                    <div
                      key={h2.id}
                      className="p-3.5 bg-slate-800/90 rounded-xl border border-slate-700 hover:border-indigo-500/60 transition-all space-y-2.5"
                    >
                      {/* H2 Title Input & Delete */}
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-indigo-600 text-white rounded text-[10px] font-mono font-bold shrink-0">
                          H2 #{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={h2.title}
                          onChange={(e) => handleUpdateH2Title(h2.id, e.target.value)}
                          placeholder={`Nhập tiêu đề thẻ H2 số ${idx + 1}...`}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-400"
                        />
                        <button
                          onClick={() => handleRemoveH2(h2.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Xóa thẻ H2 này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Subheadings H3 List */}
                      <div className="pl-6 space-y-1.5">
                        {h2.subheadings.map((sub, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 bg-slate-700 text-indigo-200 rounded text-[9px] font-mono">
                              H3
                            </span>
                            <span className="text-xs text-slate-200 flex-1">{sub}</span>
                            <button
                              onClick={() => handleRemoveH3(h2.id, sIdx)}
                              className="text-slate-500 hover:text-rose-400 text-xs px-1"
                            >
                              ×
                            </button>
                          </div>
                        ))}

                        {/* Add H3 input */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            value={newH3Input[h2.id] || ''}
                            onChange={(e) =>
                              setNewH3Input((prev) => ({ ...prev, [h2.id]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddH3(h2.id);
                              }
                            }}
                            placeholder="Thêm thẻ H3 con (hoặc để trống để AI tự sáng tạo)..."
                            className="flex-1 px-2.5 py-1 rounded bg-slate-900/60 border border-slate-700 text-slate-200 placeholder:text-slate-500 text-[11px] focus:outline-none focus:border-indigo-400"
                          />
                          <button
                            onClick={() => handleAddH3(h2.id)}
                            className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-[11px] font-medium transition-colors"
                          >
                            + Thêm H3
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleAddH2}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg text-xs font-semibold border border-indigo-500/30 flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm Thẻ H2</span>
                  </button>
                  <span className="text-[11px] text-slate-400 italic">
                    Mẹo: Có thể chỉ cần nhập các thẻ H2 chính, AI sẽ tự động sinh H3 logic và chi tiết kỹ thuật.
                  </span>
                </div>
              </div>
            )}

            {/* RAW TEXT / MARKDOWN INPUT */}
            {inputStyle === 'text' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Nhập hoặc dán dàn ý (## cho H2, ### cho H3 hoặc danh sách số):</span>
                  <span className="text-[11px] text-indigo-300">Tự động đồng bộ sang cấu trúc AI</span>
                </div>
                <textarea
                  value={rawText}
                  onChange={(e) => {
                    setRawText(e.target.value);
                    parseTextToHeadings(e.target.value);
                  }}
                  rows={8}
                  placeholder={`## 1. Giới thiệu tổng quan và nguyên lý hoạt động\n## 2. Tiêu chuẩn kỹ thuật cơ khí & vật liệu Inox 304\n### 2.1 Cụm khung sườn và kết cấu chịu tải\n### 2.2 Động cơ giảm tốc và hệ thống biến tần\n## 3. Báo giá gia công xưởng và chi phí lắp đặt\n## 4. Địa chỉ xưởng chế tạo uy tín`}
                  className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {/* ACTION BUTTON */}
            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs text-indigo-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  Sẵn sàng phát triển: <strong>{customHeadings.length}</strong> H2 và{' '}
                  <strong>{totalCustomH3}</strong> H3
                </span>
              </div>

              <button
                onClick={handleTriggerGenerate}
                disabled={isGenerating || customHeadings.length === 0}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI đang phân tích H2 & sáng tạo nội dung con...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>TẠO OUTLINE TỪ DÀN Ý H2/H3 NÀY</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* OUTLINE RESULT DISPLAY */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Meta tags card */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              SERP SNIPPET PREVIEW (GOOGLE SEARCH)
            </span>
            <div className="text-[11px] font-mono text-slate-500 space-x-3">
              <span>
                Title:{' '}
                <strong className={metaTitleCharCount > 60 ? 'text-rose-600' : 'text-emerald-700'}>
                  {metaTitleCharCount}/60
                </strong>
              </span>
              <span>
                Meta Desc:{' '}
                <strong className={metaDescCharCount > 160 ? 'text-rose-600' : 'text-emerald-700'}>
                  {metaDescCharCount}/160
                </strong>
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-600 flex items-center gap-1 font-mono">
              <span>https://chinhattu.com.vn</span>
              <span className="text-slate-400">›</span>
              <span className="text-slate-900 font-semibold">{outline.slug}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-blue-700 hover:underline cursor-pointer leading-snug">
              {outline.metaTitle}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">{outline.metaDescription}</p>
          </div>
        </div>

        {/* Target Keywords Badges */}
        <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 space-y-2">
          <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Primary & Secondary Keywords:</span>
            <span className="text-blue-600 font-semibold text-[11px]">
              Được phân bổ tự nhiên trong các Heading
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="px-2.5 py-1 bg-blue-600 text-white rounded-md text-xs font-bold">
              {outline.primaryKeyword} (Primary)
            </span>
            {outline.secondaryKeywords?.map((sec, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-white text-slate-700 rounded-md text-xs border border-slate-200"
              >
                {sec}
              </span>
            ))}
          </div>

          {/* Semantic Entities */}
          {outline.semanticEntities?.length > 0 && (
            <div className="pt-2 border-t border-blue-100 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-indigo-700 uppercase">
                Thực thể kỹ thuật:
              </span>
              {outline.semanticEntities.map((ent, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-indigo-50 text-indigo-800 text-[10px] rounded font-semibold border border-indigo-200"
                >
                  {ent}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* H1 and Sapo */}
        <div className="space-y-3 border-b border-slate-200 pb-5">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              HEADING 1 (H1)
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-0.5">{outline.h1}</h1>
          </div>

          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              SAPO (MỞ BÀI ĐÁNH TRÚNG PAIN POINT)
            </span>
            <p className="text-xs sm:text-sm text-slate-700 italic bg-slate-50 p-4 rounded-xl border border-slate-200/80 leading-relaxed mt-1">
              "{outline.sapo}"
            </p>
          </div>
        </div>

        {/* Headings Structure */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-slate-900 tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>CẤU TRÚC THÂN BÀI (H2 & H3 SECTIONS ĐÃ ĐƯỢC AI PHÁT TRIỂN CHI TIẾT)</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {outline.headings?.length || 0} phần H2 chính
            </span>
          </div>

          <div className="space-y-4">
            {outline.headings?.map((h2, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 transition-all space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] bg-slate-900 text-white rounded font-mono">
                      H2
                    </span>
                    <span>{h2.title}</span>
                  </div>
                  {h2.intentTarget && (
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shrink-0">
                      {h2.intentTarget}
                    </span>
                  )}
                </div>

                {/* Key points */}
                {(h2.keyPoints?.length ?? 0) > 0 && (
                  <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-600">
                    {h2.keyPoints!.map((kp, kIdx) => (
                      <li key={kIdx} className="leading-relaxed">
                        {kp}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Subheadings H3 */}
                {h2.subheadings?.map((h3, subIdx) => (
                  <div
                    key={subIdx}
                    className="ml-4 p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2"
                  >
                    <div className="font-bold text-slate-800 text-xs flex items-center gap-2">
                      <span className="px-1.5 py-0.2 text-[9px] bg-indigo-600 text-white rounded font-mono">
                        H3
                      </span>
                      <span>{h3.title}</span>
                    </div>
                    {(h3.keyPoints?.length ?? 0) > 0 && (
                      <ul className="space-y-1 pl-4 list-disc text-[11px] text-slate-600">
                        {h3.keyPoints!.map((skp, skpIdx) => (
                          <li key={skpIdx} className="leading-relaxed">
                            {skp}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Technical Specs Table */}
        {(outline.technicalSpecsTable?.length ?? 0) > 0 && (
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <span className="text-xs font-extrabold uppercase text-slate-900 tracking-wider">
              BẢNG THÔNG SỐ KỸ THUẬT TIÊU CHUẨN (SPEC TABLE B2B)
            </span>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Thông Số Cơ Khí</th>
                    <th className="p-2.5">Khuyến Nghị Tiêu Chuẩn</th>
                    <th className="p-2.5">Lưu Ý Thực Tế</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {outline.technicalSpecsTable!.map((spec, sIdx) => (
                    <tr key={sIdx} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">{spec.parameter}</td>
                      <td className="p-2.5 text-blue-700 font-medium">{spec.recommended}</td>
                      <td className="p-2.5 text-slate-600">{spec.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FAQ Schema */}
        {outline.faq?.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <span className="text-xs font-extrabold uppercase text-slate-900 tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>CÂU HỎI THƯỜNG GẶP (FAQ SCHEMA)</span>
            </span>
            <div className="space-y-2">
              {outline.faq.map((f, fIdx) => (
                <div
                  key={fIdx}
                  className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-200 space-y-1"
                >
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="text-amber-600 font-mono">Q:</span>
                    <span>{f.question}</span>
                  </div>
                  <div className="text-slate-700 text-xs leading-relaxed pl-4">{f.answer}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA B2B */}
        {outline.callToAction && (
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 space-y-2">
            <div className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider">
              KÊU GỌI HÀNH ĐỘNG B2B (CALL TO ACTION)
            </div>
            <div className="font-bold text-slate-900 text-xs">
              Primary: <span className="text-emerald-700">{outline.callToAction.primary}</span>
            </div>
            <div className="text-slate-600 text-xs">
              Secondary: <span>{outline.callToAction.secondary}</span>
            </div>
            <div className="text-[11px] text-slate-400 italic">
              Vị trí đặt: {outline.callToAction.placement}
            </div>
          </div>
        )}

        {/* Internal Link Suggestions */}
        {outline.internalLinks?.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <span className="text-xs font-extrabold uppercase text-slate-900 tracking-wider flex items-center gap-2">
              <Link2 className="w-4 h-4 text-blue-600" />
              <span>GỢI Ý LIÊN KẾT NỘI BỘ (INTERNAL LINKS)</span>
            </span>
            <div className="space-y-2">
              {outline.internalLinks.map((link, lIdx) => (
                <div
                  key={lIdx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="text-slate-400">Anchor text: </span>
                    <strong className="text-blue-700 underline font-semibold">
                      "{link.anchorText}"
                    </strong>
                    <span className="text-slate-400"> ➔ Trỏ đến: </span>
                    <code className="text-slate-900 font-mono text-[11px]">{link.targetUrl}</code>
                  </div>
                  <span className="text-[11px] text-slate-500 italic bg-white px-2 py-0.5 rounded border border-slate-200">
                    {link.reason}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
