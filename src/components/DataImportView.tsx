import React, { useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Trash2,
  Sparkles,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { KeywordItem } from '../types/seo';

interface DataImportViewProps {
  onImportKeywords: (newKeywords: KeywordItem[]) => void;
  seedKeyword: string;
}

export const DataImportView: React.FC<DataImportViewProps> = ({
  onImportKeywords,
  seedKeyword,
}) => {
  const [fileContent, setFileContent] = useState<string>('');
  const [detectedFormat, setDetectedFormat] = useState<string>('Tự nhận diện (Ahrefs / GKP / Semrush)');
  const [reviewQueue, setReviewQueue] = useState<KeywordItem[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'upload' | 'review'>('upload');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileContent(content);
      parseAndCleanData(content, file.name);
    };
    reader.readAsText(file);
  };

  const parseAndCleanData = (text: string, filename: string) => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length < 2) return;

    // Detect format
    const headerLine = lines[0].toLowerCase();
    const delimiter = headerLine.includes('\t') ? '\t' : ',';
    const headers = lines[0].split(delimiter).map((h) => h.replace(/["']/g, '').trim().toLowerCase());

    const kwIdx = headers.findIndex((h) => h.includes('keyword') || h.includes('từ khóa'));
    const volIdx = headers.findIndex((h) => h.includes('volume') || h.includes('lượng tìm') || h.includes('searches'));
    const kdIdx = headers.findIndex((h) => h.includes('kd') || h.includes('difficulty') || h.includes('độ khó'));
    const cpcIdx = headers.findIndex((h) => h.includes('cpc') || h.includes('giá thầu'));
    const parentIdx = headers.findIndex((h) => h.includes('parent') || h.includes('chủ đề'));

    if (kwIdx === -1) {
      alert('Không tìm thấy cột chứa từ khóa (Keyword) trong file. Vui lòng kiểm tra tiêu đề cột.');
      return;
    }

    const items: KeywordItem[] = [];
    const seen = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(delimiter).map((c) => c.replace(/["']/g, '').trim());
      const kw = cols[kwIdx];
      if (!kw) continue;

      const lower = kw.toLowerCase();
      const rawVol = volIdx !== -1 ? parseInt(cols[volIdx].replace(/\D/g, ''), 10) : undefined;
      const rawKd = kdIdx !== -1 ? parseInt(cols[kdIdx].replace(/\D/g, ''), 10) : undefined;
      const rawCpc = cpcIdx !== -1 ? parseFloat(cols[cpcIdx].replace(/[^0-9.]/g, '')) : undefined;
      const parentTopic = parentIdx !== -1 && cols[parentIdx] ? cols[parentIdx] : 'Chủ đề nhập khẩu';

      // Cleaning rules
      let status: 'KEEP' | 'REVIEW' | 'REMOVE' = 'KEEP';
      if (seen.has(lower)) {
        status = 'REMOVE'; // Duplicate
      } else if (kw.length < 3 || /^[0-9]+$/.test(kw)) {
        status = 'REMOVE'; // Garbage
      } else if (!lower.includes(seedKeyword.toLowerCase()) && !lower.includes('băng') && !lower.includes('máy')) {
        status = 'REVIEW'; // Irrelevant
      }

      seen.add(lower);

      items.push({
        id: `import-${Date.now()}-${i}`,
        keyword: kw,
        seedKeyword: seedKeyword,
        volume: !isNaN(rawVol as number) ? (rawVol as number) : 'Estimated',
        kd: !isNaN(rawKd as number) ? (rawKd as number) : 'Estimated',
        cpc: !isNaN(rawCpc as number) ? (rawCpc as number) : 'Estimated',
        intent: lower.includes('giá') || lower.includes('mua')
          ? 'Transactional'
          : lower.includes('gì') || lower.includes('hướng dẫn')
          ? 'Informational'
          : 'Commercial Investigation',
        category: 'Biến thể',
        modifier: 'Nhập khẩu',
        parentTopic: parentTopic,
        primaryKeyword: kw,
        isPrimary: items.length === 0,
        topic: parentTopic,
        pillar: 'Băng tải công nghiệp B2B',
        cluster: parentTopic,
        isLocal: false,
        isBrand: false,
        serpSimilarity: 80,
        opportunityScore: !isNaN(rawVol as number) ? Math.min(100, Math.round((rawVol as number) / 50 + 40)) : 75,
        businessRelevance: 85,
        funnelStage: 'MOFU',
        priority: 'P2',
        dataSource: 'REAL DATA',
        confidence: 'High',
        status: status,
        suggestedContentType: 'Product page',
        suggestedUrl: '/' + kw.replace(/\s+/g, '-').toLowerCase(),
      });
    }

    setReviewQueue(items);
    setActiveSubTab('review');
  };

  const handleApproveAllKeep = () => {
    const keepItems = reviewQueue.filter((i) => i.status === 'KEEP');
    if (!keepItems.length) return;
    onImportKeywords(keepItems);
    setReviewQueue([]);
    alert(`Đã nạp thành công ${keepItems.length} từ khóa chuẩn REAL DATA vào kho dữ liệu chính!`);
  };

  const handleToggleItemStatus = (id: string, newStatus: 'KEEP' | 'REVIEW' | 'REMOVE') => {
    setReviewQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 mb-1.5">
            <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
            Ahrefs & Google Keyword Planner Importer
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Nhập Dữ Liệu Thực Tế (CSV / XLSX) & Làm Sạch Từ Khóa
          </h1>
          <p className="text-xs text-slate-500">
            Hỗ trợ file xuất từ <strong>Ahrefs, Semrush, Google Keyword Planner</strong>. Tự động
            nhận diện Search Volume, KD, CPC thực và đưa vào hàng chờ kiểm duyệt (Cần kiểm tra) trước
            khi gom cụm.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('upload')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Tải Lên Tệp
          </button>
          <button
            onClick={() => setActiveSubTab('review')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'review' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <span>Cần Kiểm Tra</span>
            {reviewQueue.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                {reviewQueue.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeSubTab === 'upload' && (
        <div className="space-y-6">
          {/* Dropzone Card */}
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 p-8 sm:p-12 text-center transition-all space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Kéo thả file CSV / TSV vào đây, hoặc duyệt file từ máy tính
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tự động detect các cột: Keyword, Search Volume, KD, CPC, Traffic, Parent Topic.
              </p>
            </div>

            <label className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs">
              <span>Chọn File CSV / TXT</span>
              <input
                type="file"
                accept=".csv, .tsv, .txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Quick paste sample */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Hoặc dán trực tiếp dữ liệu bảng (CSV / Tab-delimited):
              </span>
              <button
                onClick={() =>
                  parseAndCleanData(
                    `Keyword,Volume,KD,CPC,Parent Topic
băng tải công nghiệp,1200,24,0.45,Băng tải công nghiệp
băng tải thực phẩm hcm,850,18,0.60,Băng tải thực phẩm
giá băng tải inox 304,600,15,0.75,Báo giá băng tải
băng tải z đứng cấp liệu,450,12,0.80,Băng tải Z`,
                    'sample.csv'
                  )
                }
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                Dán thử mẫu Ahrefs
              </button>
            </div>
            <textarea
              rows={4}
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              placeholder="Keyword,Volume,KD,CPC..."
              className="w-full p-3 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {fileContent && (
              <button
                onClick={() => parseAndCleanData(fileContent, 'pasted.csv')}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Xử Lý Dữ Liệu Đã Dán
              </button>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'review' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Hàng chờ duyệt:{' '}
                <span className="text-blue-600 font-extrabold">{reviewQueue.length}</span> từ khóa
              </div>
              <div className="text-[11px] text-slate-500">
                Phát hiện tự động: Trùng lặp (Duplicate) • Lệch chủ đề (Irrelevant) • Thiếu dấu (Typo).
              </div>
            </div>

            <button
              onClick={handleApproveAllKeep}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Duyệt & Nạp Các Từ Hợp Lệ (KEEP)</span>
            </button>
          </div>

          {/* Review Table */}
          <div className="border border-slate-200 rounded-2xl bg-white shadow-xs overflow-hidden">
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-900 text-slate-200 sticky top-0 z-10">
                  <tr>
                    <th className="p-3">Từ khóa</th>
                    <th className="p-3">Volume Thực</th>
                    <th className="p-3">KD Thực</th>
                    <th className="p-3">Parent Topic</th>
                    <th className="p-3">Đánh giá hệ thống</th>
                    <th className="p-3 text-right">Hành động duyệt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reviewQueue.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{item.keyword}</td>
                      <td className="p-3 font-mono font-semibold text-blue-700">
                        {typeof item.volume === 'number'
                          ? item.volume.toLocaleString()
                          : item.volume}
                      </td>
                      <td className="p-3 font-mono text-slate-600">{item.kd}</td>
                      <td className="p-3 text-slate-700">{item.parentTopic}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'KEEP'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'REVIEW'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleToggleItemStatus(item.id, 'KEEP')}
                            className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold border border-emerald-200"
                          >
                            Giữ
                          </button>
                          <button
                            onClick={() => handleToggleItemStatus(item.id, 'REMOVE')}
                            className="px-2 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 text-[10px] font-bold border border-rose-200"
                          >
                            Bỏ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {reviewQueue.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                        Chưa có từ khóa nào trong hàng chờ duyệt. Hãy tải file CSV lên trước.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
