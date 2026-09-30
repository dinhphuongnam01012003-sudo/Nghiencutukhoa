import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Building2,
  Globe2,
  MapPin,
  Tag,
  Users,
  CheckCircle2,
  ArrowRight,
  Flame,
  Layers,
  Cpu,
  Upload,
} from 'lucide-react';
import { ResearchFormData } from '../types/seo';

interface KeywordExplorerViewProps {
  formData: ResearchFormData;
  setFormData: React.Dispatch<React.SetStateAction<ResearchFormData>>;
  onRunResearch: () => Promise<void>;
  isLoading: boolean;
  onExploreDemo: () => void;
}

const AI_STEPS = [
  'STEP 1: Understand Seed Keyword (Phân tích cốt lõi hạt giống B2B)',
  'STEP 2: Generate Keyword Universe (Đa chiều: Biến thể, Thuộc tính, Ngành, Local)',
  'STEP 3: Build Keyword Matrix (Xây dựng ma trận 9 cột B2B)',
  'STEP 4: Normalize & Clean (Chuẩn hóa ký tự, lọc trùng, kiểm tra ngữ nghĩa)',
  'STEP 5: Classify Search Intent (Phân loại Informational, Commercial, Transactional, Local)',
  'STEP 6: Semantic Cluster (Gom nhóm từ khóa theo thực thể và SERP similarity)',
  'STEP 7: Determine Parent Topic (Xác định chủ đề mẹ bao quát nhất)',
  'STEP 8: Determine Primary / Secondary Keywords (Định vị từ khóa chính & bổ trợ)',
  'STEP 9: Build Topic Map (Thiết lập cấu trúc phân nhánh Top-down)',
  'STEP 10: Build Pillar / Cluster (Xác định Hub Pillars và các Clusters vệ tinh)',
  'STEP 11: Generate Content Map (Định dạng loại bài viết, Tiêu đề đề xuất & URL)',
  'STEP 12: Detect Cannibalization (Quét rủi ro xung đột từ khóa cùng intent)',
  'STEP 13: Generate Internal Link Map (Tạo lộ trình neo liên kết tự động)',
  'STEP 14: Allow Outline Creation (Sẵn sàng tạo dàn ý chi tiết B2B)',
];

export const KeywordExplorerView: React.FC<KeywordExplorerViewProps> = ({
  formData,
  setFormData,
  onRunResearch,
  isLoading,
  onExploreDemo,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.seedKeyword.trim()) return;

    // Simulate stepping through workflow during generation
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < AI_STEPS.length - 1 ? prev + 1 : prev));
    }, 600);

    try {
      await onRunResearch();
    } finally {
      clearInterval(interval);
      setCurrentStep(AI_STEPS.length - 1);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          AI Keyword Universe & Clustering Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Nghiên Cứu Từ Khóa & Phân Cụm Topical Map B2B
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          Bắt đầu từ một <strong>Seed Keyword</strong> (Từ khóa hạt giống). AI sẽ mở rộng theo 9
          chiều: Biến thể sản phẩm, Thuộc tính vật liệu, Nỗi đau nhà máy (Pain point), Giải pháp kỹ
          thuật, Thiết bị tích hợp, Ngành ứng dụng, Khu vực địa phương (Local) và Thương hiệu.
        </p>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seed Keyword Input (Highlight) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span>
                Seed Keyword / Key Head <span className="text-rose-500">*</span>
              </span>
              <span className="text-slate-400 font-normal lowercase">Ví dụ: băng tải, máy đóng gói, máy chiết rót</span>
            </label>
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.seedKeyword}
                onChange={(e) => setFormData({ ...formData, seedKeyword: e.target.value })}
                placeholder="Nhập từ khóa hạt giống (VD: băng tải, hệ thống cấp liệu...)"
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-300 text-slate-900 text-base font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-xs"
              />
            </div>
          </div>

          {/* 2-Column Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-slate-500" />
                Website Doanh Nghiệp (Tùy chọn)
              </label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://chinhattu.com.vn"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                Sản phẩm / Dịch vụ trọng tâm
              </label>
              <input
                type="text"
                value={formData.productService}
                onChange={(e) => setFormData({ ...formData, productService: e.target.value })}
                placeholder="Chế tạo băng tải inox, máy cấp liệu dạng Z, dây chuyền thực phẩm"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                Khu vực trọng điểm (Local Targeting)
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Đồng Nai, Bình Dương, TP.HCM, Long An, Biên Hòa"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                Thương hiệu (Brand)
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="Chí Nhật Từ (hoặc tên xưởng cơ khí của bạn)"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* UNIFIED TECHNICAL SPECIFICATION & FILE UPLOADER */}
            <div className="space-y-2 md:col-span-2 bg-gradient-to-br from-slate-50 to-indigo-50/40 p-4 rounded-2xl border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Mô Tả Kỹ Thuật Sản Phẩm / Bảng Thông Số Máy Móc
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-800">
                    Grounding Kỹ Thuật
                  </span>
                </div>

                {/* Upload and Sample buttons right on the header */}
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="px-3 py-1.5 bg-white hover:bg-slate-50 text-indigo-700 hover:text-indigo-800 border border-indigo-200 rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-2xs flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Upload File Kỹ Thuật (.txt / .csv / .pdf / .doc)</span>
                    <input
                      type="file"
                      accept=".txt,.csv,.json,.doc,.docx,.pdf,.md"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const text = event.target?.result as string;
                          setFormData({
                            ...formData,
                            productDescription: text,
                            technicalDocText: text,
                          });
                        };
                        reader.readAsText(file);
                      }}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      const sampleText = `THÔNG SỐ KỸ THUẬT BĂNG TẢI Z ĐỨNG CẤP LIỆU THỰC PHẨM CHÍ NHẬT TỪ:
- Khung sườn: Inox 304 chấn CNC dày 2.5mm, mối hàn xử lý vi sinh chống bám khuẩn.
- Dây belt: Belt PU màu trắng dày 2.0mm đạt chuẩn an toàn thực phẩm FDA 21 CFR.
- Gờ bèo: Gờ T-cleat cao 50mm, vách tai bèo cao 60mm co giãn chống rơi vãi liệu góc nghiêng 45-75 độ.
- Động cơ: Motor giảm tốc Wansin 1.5kW IP65 chống nước, biến tần Schneider điều chỉnh 5-25m/phút.
- Chiều cao nâng: Cấp liệu từ phễu nạp cao 500mm lên máy cân định lượng 14 đầu cao 3200mm.
- Năng suất: 2.0 - 3.5 tấn/giờ. Tiêu chuẩn HACCP/GMP vi sinh, xịt rửa CIP nhanh trong 15 phút.`;
                      setFormData({
                        ...formData,
                        productDescription: sampleText,
                        technicalDocText: sampleText,
                      });
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-semibold"
                  >
                    + Dán mẫu thông số
                  </button>
                </div>
              </div>

              {/* Status if file/content loaded */}
              {formData.technicalDocText && (
                <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 font-medium">
                  <div className="flex items-center gap-1.5 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">
                      Đã nạp dữ liệu kỹ thuật ({formData.technicalDocText.length} ký tự). Bạn có thể chỉnh sửa trực tiếp nội dung bên dưới:
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        productDescription: '',
                        technicalDocText: '',
                      })
                    }
                    className="text-rose-600 hover:underline font-bold shrink-0 ml-2 text-[11px]"
                  >
                    Xóa
                  </button>
                </div>
              )}

              {/* Main text area directly accepts typing, pasting, or file contents */}
              <div className="relative">
                <textarea
                  rows={4}
                  value={formData.productDescription || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      productDescription: e.target.value,
                      technicalDocText: e.target.value,
                    })
                  }
                  placeholder="Nhập mô tả kỹ thuật máy móc vào đây hoặc bấm nút [Upload File Kỹ Thuật] ở trên để tải file catalogue / bảng đặc tả cơ khí lên..."
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-2xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  Hỗ trợ định dạng: <code>.txt, .csv, .pdf, .docx, .md</code>. Dữ liệu này giúp AI nhận diện chính xác vật liệu, công suất, và sinh ra Semantic LSI chuẩn ngành.
                </span>
                {formData.productDescription && (
                  <span className="font-mono text-slate-400">
                    {formData.productDescription.length} ký tự
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                Đối thủ cạnh tranh chính (Cách nhau bởi dấu phẩy)
              </label>
              <input
                type="text"
                value={formData.competitors}
                onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
                placeholder="intechvietnam.com, bangtaivietthong.com, cokhitrungkien.vn"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={onExploreDemo}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 underline"
            >
              <span>Dùng dữ liệu chuẩn mẫu "Băng tải" (Có sẵn 4 Pillars & 19 Keywords)</span>
            </button>

            <button
              type="submit"
              disabled={isLoading || !formData.seedKeyword.trim()}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý 14 bước AI...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  <span>NGHIÊN CỨU TỪ KHÓA</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 14-Step AI Workflow Status Display */}
      {isLoading && (
        <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-blue-400">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>AI WORKFLOW ĐANG THỰC THI (14 STEPS):</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Bước {Math.min(currentStep + 1, AI_STEPS.length)} / {AI_STEPS.length}
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            {AI_STEPS.map((stepText, idx) => {
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 py-1 px-2 rounded-md transition-colors ${
                    isCurrent
                      ? 'bg-blue-600/30 text-blue-200 border border-blue-500/40 font-semibold'
                      : isPast
                      ? 'text-emerald-400 opacity-90'
                      : 'text-slate-600'
                  }`}
                >
                  {isPast ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span className="truncate">{stepText}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
