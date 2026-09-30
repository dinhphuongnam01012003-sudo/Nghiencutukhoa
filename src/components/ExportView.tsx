import React, { useState } from 'react';
import {
  FileDown,
  FileSpreadsheet,
  FileCode,
  Copy,
  Check,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  KeywordItem,
  PillarClusterItem,
  ContentMapItem,
  InternalLinkItem,
  KeywordMatrixData,
  SeoOutline,
} from '../types/seo';
import {
  exportToCSV,
  exportToExcelTSV,
  exportToJSON,
  copyToClipboard,
} from '../utils/exportUtils';

interface ExportViewProps {
  seedKeyword: string;
  keywords: KeywordItem[];
  pillars: PillarClusterItem[];
  contentMap: ContentMapItem[];
  internalLinks: InternalLinkItem[];
  matrix: KeywordMatrixData;
  outline: SeoOutline;
}

export const ExportView: React.FC<ExportViewProps> = ({
  seedKeyword,
  keywords,
  pillars,
  contentMap,
  internalLinks,
  matrix,
  outline,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopyGoogleSheets = async (data: any[], typeName: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const tsv = [
      headers.join('\t'),
      ...data.map((row) =>
        headers
          .map((h) => {
            const val = row[h];
            if (Array.isArray(val)) return val.join(', ');
            return String(val ?? '').replace(/\t/g, ' ');
          })
          .join('\t')
      ),
    ].join('\n');

    const ok = await copyToClipboard(tsv);
    if (ok) {
      setCopiedType(typeName);
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  const exportDatasets = [
    {
      title: 'Bảng Từ Khóa Tổng Hợp (Keyword List)',
      desc: `${keywords.length} từ khóa đầy đủ Intent, Parent Topic, SERP Similarity, Opportunity Score`,
      data: keywords,
      filename: `Keywords_${seedKeyword}`,
    },
    {
      title: 'Kiến Trúc Pillar – Cluster Map',
      desc: `${pillars.length} cụm Hub & Spoke và liên kết nội bộ 2 chiều`,
      data: pillars,
      filename: `Pillar_Cluster_${seedKeyword}`,
    },
    {
      title: 'Bản Đồ Kế Hoạch Nội Dung (Content Map)',
      desc: `${contentMap.length} bài viết đề xuất kèm chỉ số rủi ro Cannibalization`,
      data: contentMap,
      filename: `Content_Map_${seedKeyword}`,
    },
    {
      title: 'Sơ Đồ Liên Kết Nội Bộ (Internal Link Map)',
      desc: `${internalLinks.length} cặp liên kết điều hướng anchor text ngữ cảnh`,
      data: internalLinks,
      filename: `Internal_Links_${seedKeyword}`,
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 mb-1.5">
          <FileDown className="w-3.5 h-3.5 text-blue-600" />
          Multi-format Export Center
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Xuất Toàn Bộ Dữ Liệu Nghiên Cứu SEO
        </h1>
        <p className="text-xs text-slate-500">
          Được tối ưu chuẩn mã hóa <strong>UTF-8 BOM</strong>, đảm bảo mở trên Microsoft Excel hoặc
          Google Sheets tiếng Việt không bị lỗi font hay mất dấu ký tự.
        </p>
      </div>

      {/* Single-file HTML Standalone Export */}
      <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl border border-blue-700/50 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
            <FileCode className="w-3.5 h-3.5 text-blue-300" />
            <span>Mã Nguồn Gộp Thành 1 File Duy Nhất</span>
          </div>
          <h3 className="font-extrabold text-base text-white">
            Tải Mã Nguồn Tool Này Dạng 1 File HTML Duy Nhất
          </h3>
          <p className="text-xs text-blue-200/80 max-w-xl leading-relaxed">
            Bao gồm toàn bộ HTML, CSS (Tailwind) và React JS trong <strong>1 tệp .html duy nhất</strong>. Bạn có thể tải về mở trực tiếp bằng trình duyệt trên máy tính hoặc tải lên bất kỳ hosting, VPS, cPanel, Netlify, GitHub Pages nào để chạy mà không cần cài đặt Node.js hay server!
          </p>
        </div>

        <a
          href="/api/download-standalone-html"
          download="b2b-seo-standalone.html"
          className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0 flex items-center gap-2 border border-blue-400/30"
        >
          <FileDown className="w-4 h-4 text-blue-200" />
          <span>Tải File .HTML Duy Nhất</span>
        </a>
      </div>

      {/* Dataset Cards */}
      <div className="space-y-4">
        {exportDatasets.map((ds, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">{ds.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{ds.desc}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() =>
                  handleCopyGoogleSheets(ds.data, ds.filename)
                }
                className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-bold border border-emerald-200 transition-colors flex items-center gap-1.5"
                title="Sao chép dạng bảng dán trực tiếp vào Google Sheets"
              >
                {copiedType === ds.filename ? (
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedType === ds.filename ? 'Đã sao chép' : 'Dán Sheets'}</span>
              </button>

              <button
                onClick={() => exportToCSV(ds.data, ds.filename)}
                className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                <span>CSV</span>
              </button>

              <button
                onClick={() => exportToExcelTSV(ds.data, ds.filename)}
                className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Excel</span>
              </button>

              <button
                onClick={() => exportToJSON(ds.data, ds.filename)}
                className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <FileCode className="w-3.5 h-3.5 text-purple-600" />
                <span>JSON</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick All-in-one JSON export */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-extrabold text-sm text-blue-300">
            XUẤT TOÀN BỘ PROJECT (BACKUP DỰ ÁN)
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Gói trọn gói toàn bộ Ma trận 9D, Danh sách từ khóa, Kiến trúc Pillar-Cluster, Content
            Map, Outline bài viết và Sơ đồ Internal Links thành 1 tệp JSON duy nhất.
          </p>
        </div>

        <button
          onClick={() => {
            const projectBackup = {
              seedKeyword,
              exportedAt: new Date().toISOString(),
              matrix,
              keywords,
              pillars,
              contentMap,
              internalLinks,
              outline,
            };
            exportToJSON(projectBackup, `SEO_KEYMAP_AI_Project_${seedKeyword}`);
          }}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0 flex items-center gap-2"
        >
          <FileDown className="w-4 h-4" />
          <span>Tải File Backup Dự Án (.JSON)</span>
        </button>
      </div>
    </div>
  );
};
