import React, { useState, useMemo } from 'react';
import {
  GitFork,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronRight,
  ChevronDown,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Compass,
  Layers,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Download,
} from 'lucide-react';
import { KeywordItem, PillarClusterItem, SearchIntent } from '../types/seo';
import { exportToJSON, exportToCSV } from '../utils/exportUtils';

interface KeymapViewProps {
  seedKeyword: string;
  setSeedKeyword: (seed: string) => void;
  pillars: PillarClusterItem[];
  setPillars: React.Dispatch<React.SetStateAction<PillarClusterItem[]>>;
  keywords: KeywordItem[];
  setKeywords: React.Dispatch<React.SetStateAction<KeywordItem[]>>;
}

interface SelectedNodeState {
  id: string;
  title: string;
  type: 'MAIN' | 'PILLAR' | 'CLUSTER' | 'KEYWORD';
  parentPillar?: string;
  parentCluster?: string;
  intent?: SearchIntent;
  volume?: any;
  contentType?: string;
  url?: string;
  relevance?: number;
  funnel?: string;
  priority?: string;
}

export const KeymapView: React.FC<KeymapViewProps> = ({
  seedKeyword,
  setSeedKeyword,
  pillars,
  setPillars,
  keywords,
  setKeywords,
}) => {
  const [viewMode, setViewMode] = useState<'mindmap' | 'tree'>('mindmap');
  const [zoom, setZoom] = useState<number>(1);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());

  // Editing / Node creation modal & inspector state
  const [selectedNode, setSelectedNode] = useState<SelectedNodeState | null>(null);
  const [isEditingNode, setIsEditingNode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editIntent, setEditIntent] = useState<SearchIntent>('Commercial Investigation');
  const [editContentType, setEditContentType] = useState('Product page');

  // Quick Add Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addNodeType, setAddNodeType] = useState<'PILLAR' | 'CLUSTER' | 'KEYWORD'>('PILLAR');
  const [addNodeTargetPillar, setAddNodeTargetPillar] = useState<string>('');
  const [addNodeTargetCluster, setAddNodeTargetCluster] = useState<string>('');
  const [newNodeName, setNewNodeName] = useState('');

  const uniquePillars = useMemo(() => {
    return Array.from(new Set(pillars.map((p) => p.pillar)));
  }, [pillars]);

  // Construct Mindmap Tree Data
  const treeData = useMemo(() => {
    return {
      id: 'root-node',
      title: seedKeyword.toUpperCase(),
      type: 'MAIN' as const,
      children: uniquePillars.map((pillarName, pIdx) => {
        const pillarClusters = pillars.filter((p) => p.pillar === pillarName);
        return {
          id: `pillar-${pIdx}-${pillarName}`,
          title: pillarName,
          type: 'PILLAR' as const,
          children: pillarClusters.map((cluster, cIdx) => {
            const clusterKeywords = keywords.filter(
              (k) =>
                k.pillar === pillarName &&
                (k.cluster === cluster.cluster || k.topic.includes(cluster.cluster))
            );
            return {
              id: `cluster-${cluster.id || `${pIdx}-${cIdx}`}`,
              title: cluster.cluster,
              type: 'CLUSTER' as const,
              data: cluster,
              pillarName: pillarName,
              children: clusterKeywords.map((kw) => ({
                id: kw.id,
                title: kw.keyword,
                type: 'KEYWORD' as const,
                pillarName: pillarName,
                clusterName: cluster.cluster,
                data: kw,
              })),
            };
          }),
        };
      }),
    };
  }, [seedKeyword, pillars, keywords, uniquePillars]);

  const toggleCollapse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = new Set(collapsedNodes);
    if (updated.has(id)) updated.delete(id);
    else updated.add(id);
    setCollapsedNodes(updated);
  };

  const handleNodeClick = (node: any) => {
    if (node.type === 'MAIN') {
      setSelectedNode({
        id: 'root-node',
        title: seedKeyword,
        type: 'MAIN',
        contentType: 'Core Business Topic',
        url: '/',
        relevance: 100,
      });
      setEditTitle(seedKeyword);
    } else if (node.type === 'PILLAR') {
      setSelectedNode({
        id: node.id,
        title: node.title,
        type: 'PILLAR',
        contentType: 'Pillar Hub Page',
        url: `/${encodeURIComponent(node.title.replace(/\s+/g, '-').toLowerCase())}`,
        relevance: 98,
        priority: 'P1',
      });
      setEditTitle(node.title);
      setEditUrl(`/${encodeURIComponent(node.title.replace(/\s+/g, '-').toLowerCase())}`);
    } else if (node.type === 'CLUSTER') {
      const clusterItem: PillarClusterItem = node.data;
      setSelectedNode({
        id: clusterItem.id,
        title: clusterItem.cluster,
        type: 'CLUSTER',
        parentPillar: clusterItem.pillar,
        intent: clusterItem.intent,
        contentType: clusterItem.contentType,
        url: clusterItem.suggestedUrl,
        relevance: clusterItem.businessRelevance,
        priority: clusterItem.priority,
      });
      setEditTitle(clusterItem.cluster);
      setEditUrl(clusterItem.suggestedUrl);
      setEditIntent(clusterItem.intent);
      setEditContentType(clusterItem.contentType);
    } else if (node.type === 'KEYWORD') {
      const kw: KeywordItem = node.data;
      setSelectedNode({
        id: kw.id,
        title: kw.keyword,
        type: 'KEYWORD',
        parentPillar: node.pillarName,
        parentCluster: node.clusterName,
        intent: kw.intent,
        volume: kw.volume,
        contentType: kw.suggestedContentType,
        url: kw.suggestedUrl,
        relevance: kw.businessRelevance,
        funnel: kw.funnelStage,
        priority: kw.priority,
      });
      setEditTitle(kw.keyword);
      setEditUrl(kw.suggestedUrl);
      setEditIntent(kw.intent);
      setEditContentType(kw.suggestedContentType);
    }
    setIsEditingNode(false);
  };

  // SAVE EDITED NODE
  const handleSaveNodeChanges = () => {
    if (!selectedNode || !editTitle.trim()) return;

    if (selectedNode.type === 'MAIN') {
      setSeedKeyword(editTitle.trim());
      setSelectedNode({ ...selectedNode, title: editTitle.trim() });
    } else if (selectedNode.type === 'PILLAR') {
      const oldTitle = selectedNode.title;
      const newTitle = editTitle.trim();
      setPillars((prev) =>
        prev.map((p) => (p.pillar === oldTitle ? { ...p, pillar: newTitle } : p))
      );
      setKeywords((prev) =>
        prev.map((k) => (k.pillar === oldTitle ? { ...k, pillar: newTitle } : k))
      );
      setSelectedNode({ ...selectedNode, title: newTitle });
    } else if (selectedNode.type === 'CLUSTER') {
      const newClusterName = editTitle.trim();
      setPillars((prev) =>
        prev.map((p) =>
          p.id === selectedNode.id
            ? {
                ...p,
                cluster: newClusterName,
                intent: editIntent,
                contentType: editContentType,
                suggestedUrl: editUrl,
              }
            : p
        )
      );
      setSelectedNode({
        ...selectedNode,
        title: newClusterName,
        intent: editIntent,
        contentType: editContentType,
        url: editUrl,
      });
    } else if (selectedNode.type === 'KEYWORD') {
      const newKw = editTitle.trim();
      setKeywords((prev) =>
        prev.map((k) =>
          k.id === selectedNode.id
            ? {
                ...k,
                keyword: newKw,
                intent: editIntent,
                suggestedContentType: editContentType,
                suggestedUrl: editUrl,
              }
            : k
        )
      );
      setSelectedNode({
        ...selectedNode,
        title: newKw,
        intent: editIntent,
        contentType: editContentType,
        url: editUrl,
      });
    }

    setIsEditingNode(false);
  };

  // DELETE NODE
  const handleDeleteNode = () => {
    if (!selectedNode) return;
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa nút "${selectedNode.title}" khỏi Keymap?`
    );
    if (!confirmDelete) return;

    if (selectedNode.type === 'PILLAR') {
      setPillars((prev) => prev.filter((p) => p.pillar !== selectedNode.title));
      setKeywords((prev) => prev.filter((k) => k.pillar !== selectedNode.title));
    } else if (selectedNode.type === 'CLUSTER') {
      setPillars((prev) => prev.filter((p) => p.id !== selectedNode.id));
      setKeywords((prev) => prev.filter((k) => k.cluster !== selectedNode.title));
    } else if (selectedNode.type === 'KEYWORD') {
      setKeywords((prev) => prev.filter((k) => k.id !== selectedNode.id));
    }

    setSelectedNode(null);
  };

  // CREATE NEW NODE
  const handleCreateNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim()) return;

    const name = newNodeName.trim();
    if (addNodeType === 'PILLAR') {
      const newClusterItem: PillarClusterItem = {
        id: `pc-${Date.now()}`,
        pillar: name,
        cluster: `Cụm giải pháp ${name}`,
        primaryKeyword: name.toLowerCase(),
        intent: 'Commercial Investigation',
        contentType: 'Product page',
        suggestedUrl: `/${encodeURIComponent(name.replace(/\s+/g, '-').toLowerCase())}`,
        internalLinkTo: ['/'],
        internalLinkFrom: ['/'],
        businessRelevance: 95,
        priority: 'P1',
      };
      setPillars([...pillars, newClusterItem]);
    } else if (addNodeType === 'CLUSTER') {
      const pillarToUse = addNodeTargetPillar || uniquePillars[0] || 'Băng tải công nghiệp B2B';
      const newClusterItem: PillarClusterItem = {
        id: `pc-${Date.now()}`,
        pillar: pillarToUse,
        cluster: name,
        primaryKeyword: name.toLowerCase(),
        intent: 'Commercial Investigation',
        contentType: 'Product page',
        suggestedUrl: `/${encodeURIComponent(name.replace(/\s+/g, '-').toLowerCase())}`,
        internalLinkTo: ['/'],
        internalLinkFrom: ['/'],
        businessRelevance: 92,
        priority: 'P1',
      };
      setPillars([...pillars, newClusterItem]);
    } else if (addNodeType === 'KEYWORD') {
      const pillarToUse = addNodeTargetPillar || uniquePillars[0] || 'Băng tải công nghiệp B2B';
      const clusterToUse = addNodeTargetCluster || 'Cụm giải pháp chung';
      const newKwItem: KeywordItem = {
        id: `kw-${Date.now()}`,
        keyword: name,
        seedKeyword: seedKeyword,
        volume: 'Estimated',
        kd: 'Estimated',
        cpc: 'Estimated',
        intent: 'Commercial Investigation',
        category: 'Biến thể',
        modifier: 'Tùy chỉnh',
        parentTopic: clusterToUse,
        primaryKeyword: name,
        isPrimary: false,
        topic: clusterToUse,
        pillar: pillarToUse,
        cluster: clusterToUse,
        isLocal: false,
        isBrand: false,
        serpSimilarity: 85,
        opportunityScore: 88,
        businessRelevance: 90,
        funnelStage: 'MOFU',
        priority: 'P2',
        dataSource: 'USER DATA',
        confidence: 'High',
        status: 'KEEP',
        suggestedContentType: 'Product page',
        suggestedUrl: `/${encodeURIComponent(name.replace(/\s+/g, '-').toLowerCase())}`,
      };
      setKeywords([...keywords, newKwItem]);
    }

    setNewNodeName('');
    setIsAddModalOpen(false);
  };

  const openAddChildModal = (type: 'CLUSTER' | 'KEYWORD', parentPillarName: string, parentClusterName?: string) => {
    setAddNodeType(type);
    setAddNodeTargetPillar(parentPillarName);
    if (parentClusterName) setAddNodeTargetCluster(parentClusterName);
    setIsAddModalOpen(true);
  };

  return (
    <div className="p-6 space-y-4 max-w-full animate-fadeIn flex flex-col h-[calc(100vh-5rem)]">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200 mb-1">
            <GitFork className="w-3.5 h-3.5 text-blue-600" />
            Interactive Mind Map & Custom Node Builder
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Sơ Đồ Keymap: Tự Chỉnh, Tự Tạo & Phân Cấp Cụm
          </h1>
          <p className="text-xs text-slate-500">
            Cho phép thêm Pillar, thêm Cluster, thêm Keyword trực tiếp, sửa tên, chỉnh URL hoặc xóa
            node theo ý muốn.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Add Node Button */}
          <button
            onClick={() => {
              setAddNodeType('PILLAR');
              setAddNodeTargetPillar(uniquePillars[0] || '');
              setIsAddModalOpen(true);
            }}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tạo Node Mới</span>
          </button>

          {/* Export Keymap */}
          <button
            onClick={() => {
              exportToJSON(treeData, `Keymap_Topical_Structure_${seedKeyword}`);
            }}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Xuất cấu trúc Keymap dạng JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Xuất Keymap</span>
          </button>

          {/* View mode toggle */}
          <div className="bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode('mindmap')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'mindmap'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mind Map
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewMode === 'tree'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tree View
            </button>
          </div>

          {/* Zoom Controls */}
          {viewMode === 'mindmap' && (
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-xs">
              <button
                onClick={() => setZoom((z) => Math.min(1.6, z + 0.1))}
                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"
                title="Phóng to"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"
                title="Đặt lại zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Canvas Container */}
      <div className="flex-1 border border-slate-200 rounded-2xl bg-slate-950/5 relative overflow-hidden flex">
        {/* VIEW 1: Interactive Mind Map with Node Actions */}
        {viewMode === 'mindmap' && (
          <div className="flex-1 overflow-auto p-12 select-none relative cursor-grab active:cursor-grabbing">
            <div
              className="min-w-[1300px] flex items-center transition-transform duration-200 origin-top-left"
              style={{ transform: `scale(${zoom})` }}
            >
              {/* Root node */}
              <div className="flex items-center">
                <div
                  onClick={() => handleNodeClick(treeData)}
                  className="group px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl shadow-xl border-2 border-white/20 font-black text-lg tracking-wider cursor-pointer hover:scale-105 transition-all text-center flex flex-col items-center gap-1 min-w-[210px] relative"
                >
                  <Compass className="w-5 h-5 text-blue-300" />
                  <span>{treeData.title}</span>
                  <span className="text-[10px] font-normal text-blue-200">
                    Main Topic (Key Head)
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddNodeType('PILLAR');
                      setIsAddModalOpen(true);
                    }}
                    title="Thêm Pillar mới dưới Main Topic"
                    className="opacity-0 group-hover:opacity-100 absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-md transition-opacity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-12 h-0.5 bg-blue-300" />

                {/* Pillars column */}
                <div className="flex flex-col gap-8">
                  {treeData.children.map((pillar) => {
                    const isPillarCollapsed = collapsedNodes.has(pillar.id);
                    return (
                      <div key={pillar.id} className="flex items-center relative">
                        <div
                          onClick={() => handleNodeClick(pillar)}
                          className="px-4 py-3 bg-white text-slate-900 rounded-xl shadow-md border-2 border-indigo-200 hover:border-indigo-500 font-bold text-sm cursor-pointer hover:shadow-lg transition-all min-w-[230px] flex items-center justify-between group relative"
                        >
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-indigo-600 font-extrabold flex items-center gap-1">
                              <span>PILLAR PAGE</span>
                            </div>
                            <div className="text-slate-900">{pillar.title}</div>
                          </div>

                          <div className="flex items-center gap-1">
                            {/* Button to add Cluster under this Pillar */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openAddChildModal('CLUSTER', pillar.title);
                              }}
                              title="Thêm Cluster dưới Pillar này"
                              className="opacity-0 group-hover:opacity-100 p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-opacity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={(e) => toggleCollapse(pillar.id, e)}
                              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                              {isPillarCollapsed ? (
                                <ChevronRight className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Clusters column */}
                        {!isPillarCollapsed && (
                          <>
                            <div className="w-8 h-0.5 bg-indigo-200" />
                            <div className="flex flex-col gap-4">
                              {pillar.children.map((cluster) => {
                                const isClusterCollapsed = collapsedNodes.has(cluster.id);
                                return (
                                  <div
                                    key={cluster.id}
                                    className="flex items-center relative"
                                  >
                                    <div
                                      onClick={() => handleNodeClick(cluster)}
                                      className="px-3.5 py-2.5 bg-slate-50 text-slate-800 rounded-lg shadow-xs border border-slate-300 hover:border-blue-400 font-semibold text-xs cursor-pointer hover:bg-white transition-all min-w-[210px] flex items-center justify-between group"
                                    >
                                      <div>
                                        <div className="text-[8px] uppercase tracking-wider text-blue-600 font-bold">
                                          CLUSTER
                                        </div>
                                        <div className="line-clamp-1">{cluster.title}</div>
                                      </div>

                                      <div className="flex items-center gap-1">
                                        {/* Button to add Keyword under this Cluster */}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openAddChildModal('KEYWORD', pillar.title, cluster.title);
                                          }}
                                          title="Thêm Keyword dưới Cluster này"
                                          className="opacity-0 group-hover:opacity-100 p-0.5 text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>

                                        <button
                                          onClick={(e) => toggleCollapse(cluster.id, e)}
                                          className="p-0.5 text-slate-400 hover:text-slate-600"
                                        >
                                          {isClusterCollapsed ? (
                                            <ChevronRight className="w-3.5 h-3.5" />
                                          ) : (
                                            <ChevronDown className="w-3.5 h-3.5" />
                                          )}
                                        </button>
                                      </div>
                                    </div>

                                    {/* Keywords sub-branches */}
                                    {!isClusterCollapsed && cluster.children.length > 0 && (
                                      <>
                                        <div className="w-6 h-0.5 bg-slate-200" />
                                        <div className="flex flex-col gap-1.5">
                                          {cluster.children.map((kw) => (
                                            <div
                                              key={kw.id}
                                              onClick={() => handleNodeClick(kw)}
                                              className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-700 rounded text-[11px] font-medium cursor-pointer shadow-2xs whitespace-nowrap transition-all"
                                            >
                                              {kw.title}
                                            </div>
                                          ))}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Tree View with inline Edit/Add actions */}
        {viewMode === 'tree' && (
          <div className="flex-1 p-8 overflow-y-auto bg-white">
            <div className="font-mono text-sm space-y-3 max-w-3xl">
              <div
                onClick={() => handleNodeClick(treeData)}
                className="font-black text-slate-900 cursor-pointer flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span>{treeData.title} (Main Topic Head)</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAddNodeType('PILLAR');
                    setIsAddModalOpen(true);
                  }}
                  className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded font-sans font-semibold"
                >
                  + Thêm Pillar
                </button>
              </div>

              <div className="pl-6 border-l-2 border-slate-200 space-y-4">
                {treeData.children.map((pillar) => (
                  <div key={pillar.id} className="space-y-2">
                    <div
                      onClick={() => handleNodeClick(pillar)}
                      className="font-bold text-indigo-900 cursor-pointer flex items-center justify-between p-2 bg-indigo-50/60 rounded border border-indigo-100 hover:bg-indigo-100 transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{pillar.title} (Pillar)</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openAddChildModal('CLUSTER', pillar.title);
                        }}
                        className="px-2 py-0.5 text-[11px] bg-indigo-600 text-white rounded font-sans font-medium"
                      >
                        + Thêm Cluster
                      </button>
                    </div>

                    <div className="pl-6 border-l-2 border-indigo-200 space-y-2">
                      {pillar.children.map((cluster) => (
                        <div key={cluster.id} className="space-y-1">
                          <div
                            onClick={() => handleNodeClick(cluster)}
                            className="font-semibold text-slate-800 cursor-pointer hover:text-blue-600 flex items-center justify-between gap-1 text-xs p-1.5 rounded hover:bg-slate-50"
                          >
                            <div className="flex items-center gap-1">
                              <span className="text-slate-400">├──</span>
                              <span>{cluster.title} (Cluster)</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openAddChildModal('KEYWORD', pillar.title, cluster.title);
                              }}
                              className="px-1.5 py-0.5 text-[10px] bg-slate-200 hover:bg-blue-600 hover:text-white rounded font-sans font-medium text-slate-700"
                            >
                              + Thêm Keyword
                            </button>
                          </div>

                          <div className="pl-6 border-l border-slate-200 space-y-1">
                            {cluster.children.map((kw) => (
                              <div
                                key={kw.id}
                                onClick={() => handleNodeClick(kw)}
                                className="text-slate-600 hover:text-blue-700 cursor-pointer text-xs flex items-center gap-1 p-1 hover:bg-slate-50 rounded"
                              >
                                <span className="text-slate-300">└──</span>
                                <span>{kw.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Slide-over Node Inspector & Editor */}
        {selectedNode && (
          <div className="w-84 bg-white border-l border-slate-200 p-5 shadow-2xl overflow-y-auto flex flex-col justify-between animate-slideIn z-20">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800">
                  {selectedNode.type} NODE
                </span>
                <div className="flex items-center gap-1">
                  {!isEditingNode && (
                    <button
                      onClick={() => setIsEditingNode(true)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Chỉnh sửa node này"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  {selectedNode.type !== 'MAIN' && (
                    <button
                      onClick={handleDeleteNode}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                      title="Xóa node này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Edit Mode or View Mode */}
              {isEditingNode ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Tên Node:</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700">URL Đề Xuất:</label>
                    <input
                      type="text"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 mt-1"
                    />
                  </div>

                  {selectedNode.type !== 'MAIN' && (
                    <>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700">Search Intent:</label>
                        <select
                          value={editIntent}
                          onChange={(e) => setEditIntent(e.target.value as SearchIntent)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 mt-1 bg-white"
                        >
                          <option value="Commercial Investigation">Commercial Investigation</option>
                          <option value="Transactional">Transactional</option>
                          <option value="Informational">Informational</option>
                          <option value="Local Commercial">Local Commercial</option>
                          <option value="Navigational">Navigational</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700">Content Type:</label>
                        <select
                          value={editContentType}
                          onChange={(e) => setEditContentType(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-300 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 mt-1 bg-white"
                        >
                          <option value="Pillar page">Pillar page</option>
                          <option value="Product page">Product page</option>
                          <option value="Guide">Guide</option>
                          <option value="Category page">Category page</option>
                          <option value="Local landing page">Local landing page</option>
                          <option value="Landing page">Landing page</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={handleSaveNodeChanges}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center justify-center gap-1"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Lưu Thay Đổi</span>
                    </button>
                    <button
                      onClick={() => setIsEditingNode(false)}
                      className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-200"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <div className="text-[11px] text-slate-400 font-medium">Tiêu đề Node</div>
                    <h3 className="text-base font-black text-slate-900 mt-0.5 leading-snug">
                      {selectedNode.title}
                    </h3>
                  </div>

                  {selectedNode.intent && (
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">Search Intent</div>
                      <div className="font-bold text-blue-700 text-xs mt-0.5">
                        {selectedNode.intent}
                      </div>
                    </div>
                  )}

                  {selectedNode.parentPillar && (
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">Thuộc Pillar</div>
                      <div className="font-semibold text-slate-800 text-xs mt-0.5">
                        {selectedNode.parentPillar}
                      </div>
                    </div>
                  )}

                  {selectedNode.parentCluster && (
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">Thuộc Cluster</div>
                      <div className="font-semibold text-slate-800 text-xs mt-0.5">
                        {selectedNode.parentCluster}
                      </div>
                    </div>
                  )}

                  {selectedNode.contentType && (
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">Định Dạng Content</div>
                      <div className="font-semibold text-indigo-700 text-xs mt-0.5">
                        {selectedNode.contentType}
                      </div>
                    </div>
                  )}

                  {selectedNode.url && (
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">URL Đề Xuất</div>
                      <code className="text-[11px] text-slate-800 font-mono block mt-0.5 break-all">
                        {selectedNode.url}
                      </code>
                    </div>
                  )}

                  {selectedNode.relevance !== undefined && (
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">Business Relevance</div>
                      <div className="font-mono font-bold text-emerald-700 text-xs mt-0.5">
                        {selectedNode.relevance} / 100
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[10px]">Tự chỉnh trực tiếp trên Keymap</span>
              {!isEditingNode && (
                <button
                  onClick={() => setIsEditingNode(true)}
                  className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Chỉnh sửa</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* QUICK ADD NODE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">
                + Thêm Node Vào Keymap
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNode} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Cấp bậc Node:</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setAddNodeType('PILLAR')}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      addNodeType === 'PILLAR'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Pillar
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddNodeType('CLUSTER')}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      addNodeType === 'CLUSTER'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Cluster
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddNodeType('KEYWORD')}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      addNodeType === 'KEYWORD'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Keyword
                  </button>
                </div>
              </div>

              {addNodeType !== 'PILLAR' && (
                <div>
                  <label className="text-xs font-bold text-slate-700">Thuộc Pillar:</label>
                  <select
                    value={addNodeTargetPillar}
                    onChange={(e) => setAddNodeTargetPillar(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 mt-1 bg-white font-medium"
                  >
                    {uniquePillars.map((p, idx) => (
                      <option key={idx} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {addNodeType === 'KEYWORD' && (
                <div>
                  <label className="text-xs font-bold text-slate-700">Thuộc Cluster:</label>
                  <select
                    value={addNodeTargetCluster}
                    onChange={(e) => setAddNodeTargetCluster(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 mt-1 bg-white font-medium"
                  >
                    {pillars
                      .filter((p) => !addNodeTargetPillar || p.pillar === addNodeTargetPillar)
                      .map((p, idx) => (
                        <option key={idx} value={p.cluster}>
                          {p.cluster}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700">
                  Tên {addNodeType === 'PILLAR' ? 'Pillar' : addNodeType === 'CLUSTER' ? 'Cluster' : 'Từ khóa'}:
                </label>
                <input
                  type="text"
                  required
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value)}
                  placeholder="Nhập tên node cần tạo..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 mt-1 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Thêm Vào Keymap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
