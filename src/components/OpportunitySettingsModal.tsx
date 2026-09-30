import React, { useState } from 'react';
import { X, SlidersHorizontal, Sparkles, Check, RotateCcw } from 'lucide-react';

interface OpportunitySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyWeights: (weights: {
    demandWeight: number;
    commercialWeight: number;
    relevanceWeight: number;
    competitionWeight: number;
  }) => void;
}

export const OpportunitySettingsModal: React.FC<OpportunitySettingsModalProps> = ({
  isOpen,
  onClose,
  onApplyWeights,
}) => {
  const [demand, setDemand] = useState(30);
  const [commercial, setCommercial] = useState(30);
  const [relevance, setRelevance] = useState(30);
  const [competition, setCompetition] = useState(10);

  if (!isOpen) return null;

  const handleReset = () => {
    setDemand(30);
    setCommercial(30);
    setRelevance(30);
    setCompetition(10);
  };

  const handleSave = () => {
    onApplyWeights({
      demandWeight: demand / 100,
      commercialWeight: commercial / 100,
      relevanceWeight: relevance / 100,
      competitionWeight: competition / 100,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-600" />
            <h2 className="font-extrabold text-slate-900 text-base">
              Tùy Chỉnh Trọng Số Opportunity Score
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Công thức tính Opportunity Score cho B2B: <br />
          <code className="text-blue-700 font-bold">
            Opportunity = (Demand × w1) + (Commercial Value × w2) + (Business Relevance × w3) -
            (Competition × w4)
          </code>
        </p>

        {/* Sliders */}
        <div className="space-y-4 text-xs font-semibold text-slate-700">
          <div>
            <div className="flex justify-between mb-1">
              <span>Nhu Cầu Tìm Kiếm (Demand):</span>
              <span className="text-blue-600 font-bold">{demand}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={demand}
              onChange={(e) => setDemand(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Giá Trị Thương Mại (Commercial Value / Intent):</span>
              <span className="text-amber-600 font-bold">{commercial}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={commercial}
              onChange={(e) => setCommercial(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg cursor-pointer accent-amber-600"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Độ Liên Quan Ngành B2B (Business Relevance):</span>
              <span className="text-emerald-600 font-bold">{relevance}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={relevance}
              onChange={(e) => setRelevance(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg cursor-pointer accent-emerald-600"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Mức Độ Cạnh Tranh (Competition / KD phạt):</span>
              <span className="text-rose-600 font-bold">{competition}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={competition}
              onChange={(e) => setCompetition(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg cursor-pointer accent-rose-600"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mặc định</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
            >
              Áp Dụng Cho Kho Từ Khóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
