import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { KeywordExplorerView } from './components/KeywordExplorerView';
import { KeywordMatrixView } from './components/KeywordMatrixView';
import { KeywordListView } from './components/KeywordListView';
import { TopicClusterView } from './components/TopicClusterView';
import { TopicKeyView } from './components/TopicKeyView';
import { KeymapView } from './components/KeymapView';
import { PillarClusterView } from './components/PillarClusterView';
import { ContentMapView } from './components/ContentMapView';
import { OutlineBuilderView } from './components/OutlineBuilderView';
import { CompetitorGapView } from './components/CompetitorGapView';
import { TopicalCoverageView } from './components/TopicalCoverageView';
import { InternalLinkMapView } from './components/InternalLinkMapView';
import { DataImportView } from './components/DataImportView';
import { ExportView } from './components/ExportView';
import { OpportunitySettingsModal } from './components/OpportunitySettingsModal';
import { SemanticLsiView } from './components/SemanticLsiView';

import {
  DEFAULT_KEYWORDS,
  DEFAULT_KEYWORD_MATRIX,
  DEFAULT_PILLARS,
  DEFAULT_TOPIC_KEYS,
  DEFAULT_CONTENT_MAP,
  DEFAULT_INTERNAL_LINKS,
  DEFAULT_OUTLINE,
  DEFAULT_COMPETITOR_GAP,
  DEFAULT_SEMANTIC_LSI,
  DEFAULT_SEMANTIC_REPORT,
} from './data/defaultDemoData';
import {
  KeywordItem,
  KeywordMatrixData,
  PillarClusterItem,
  TopicKeyItem,
  ContentMapItem,
  InternalLinkItem,
  SeoOutline,
  CompetitorGapData,
  ResearchFormData,
  SemanticLsiItem,
  SemanticAnalysisReport,
  SearchIntent,
  FunnelStage,
} from './types/seo';
import { exportToCSV } from './utils/exportUtils';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [seedKeyword, setSeedKeyword] = useState<string>('băng tải');

  const [keywords, setKeywords] = useState<KeywordItem[]>(DEFAULT_KEYWORDS);
  const [semanticLsi, setSemanticLsi] = useState<SemanticLsiItem[]>(DEFAULT_SEMANTIC_LSI);
  const [semanticReport, setSemanticReport] = useState<SemanticAnalysisReport>(DEFAULT_SEMANTIC_REPORT);
  const [matrix, setMatrix] = useState<KeywordMatrixData>(DEFAULT_KEYWORD_MATRIX);
  const [pillars, setPillars] = useState<PillarClusterItem[]>(DEFAULT_PILLARS);
  const [topicKeys, setTopicKeys] = useState<TopicKeyItem[]>(DEFAULT_TOPIC_KEYS);
  const [contentMap, setContentMap] = useState<ContentMapItem[]>(DEFAULT_CONTENT_MAP);
  const [internalLinks, setInternalLinks] = useState<InternalLinkItem[]>(DEFAULT_INTERNAL_LINKS);
  const [outline, setOutline] = useState<SeoOutline>(DEFAULT_OUTLINE);
  const [competitorGap, setCompetitorGap] = useState<CompetitorGapData>(DEFAULT_COMPETITOR_GAP);

  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState<boolean>(false);
  const [isGapLoading, setIsGapLoading] = useState<boolean>(false);
  const [isOpportunityModalOpen, setIsOpportunityModalOpen] = useState<boolean>(false);
  const [isExtractingSpecs, setIsExtractingSpecs] = useState<boolean>(false);
  const [isSemanticAnalyzing, setIsSemanticAnalyzing] = useState<boolean>(false);

  const [formData, setFormData] = useState<ResearchFormData>({
    seedKeyword: 'băng tải',
    website: 'https://chinhattu.com.vn',
    productService: 'Băng tải thực phẩm inox 304, Băng tải Z cấp liệu, Băng tải PU',
    targetMarket: 'Vietnam',
    language: 'Vietnamese',
    location: 'Đồng Nai, Bình Dương, TP.HCM, Long An, Biên Hòa',
    brand: 'Chí Nhật Từ',
    competitors: 'intechvietnam.com, bangtaivietthong.com, cokhitrungkien.vn',
  });

  // Apply research result across ALL tabs synchronously
  const applyFullResearchResult = (data: any, seed: string) => {
    setSeedKeyword(seed);

    if (data.matrix) {
      setMatrix(data.matrix);
    }

    if (data.semanticLsi && Array.isArray(data.semanticLsi) && data.semanticLsi.length > 0) {
      setSemanticLsi(data.semanticLsi);
    }

    let flatPillars: PillarClusterItem[] = [];
    if (data.pillars && Array.isArray(data.pillars)) {
      data.pillars.forEach((p: any, pIdx: number) => {
        (p.clusters || []).forEach((c: any, cIdx: number) => {
          flatPillars.push({
            id: `pc-${pIdx}-${cIdx}-${Date.now()}`,
            pillar: p.name,
            cluster: c.name,
            primaryKeyword: c.primaryKeyword || c.name,
            intent: c.intent || 'Commercial Investigation',
            contentType: c.contentType || 'Product page',
            suggestedUrl: c.suggestedUrl || `/${encodeURIComponent(c.name.replace(/\s+/g, '-').toLowerCase())}`,
            internalLinkTo: [p.suggestedUrl || '/'],
            internalLinkFrom: ['/'],
            businessRelevance: c.businessRelevance || 90,
            priority: 'P1',
          });
        });
      });
      if (flatPillars.length > 0) setPillars(flatPillars);
    }

    if (data.keywords && Array.isArray(data.keywords) && data.keywords.length > 0) {
      const enrichedKeywords: KeywordItem[] = data.keywords.map((k: any, idx: number) => ({
        id: `ai-kw-${Date.now()}-${idx}`,
        keyword: k.keyword,
        seedKeyword: seed,
        volume: 'Estimated',
        kd: 'Estimated',
        cpc: 'Estimated',
        intent: k.intent || 'Commercial Investigation',
        category: k.category || 'Biến thể',
        modifier: k.modifier || 'Chuyên sâu',
        parentTopic: k.parentTopic || seed,
        primaryKeyword: k.primaryKeyword || k.keyword,
        isPrimary: !!k.isPrimary,
        topic: k.topic || k.parentTopic || seed,
        pillar: k.pillar || (flatPillars[0]?.pillar || `${seed.toUpperCase()} B2B`),
        cluster: k.cluster || k.topic || 'Cụm giải pháp',
        isLocal: !!k.isLocal,
        isBrand: !!k.isBrand,
        serpSimilarity: k.serpSimilarity || 85,
        opportunityScore: k.opportunityScore || 88,
        businessRelevance: k.businessRelevance || 92,
        funnelStage: k.funnelStage || 'MOFU',
        priority: k.priority || 'P1',
        dataSource: 'AI ESTIMATE',
        confidence: 'High',
        status: 'KEEP',
        suggestedContentType: k.suggestedContentType || 'Product page',
        suggestedUrl: k.suggestedUrl || `/${encodeURIComponent(k.keyword.replace(/\s+/g, '-').toLowerCase())}`,
      }));
      setKeywords(enrichedKeywords);
    }

    if (data.contentMap && Array.isArray(data.contentMap) && data.contentMap.length > 0) {
      setContentMap(data.contentMap);
    } else if (flatPillars.length > 0) {
      const generatedContent: ContentMapItem[] = flatPillars.map((p, idx) => ({
        contentId: `CNT-${String(idx + 1).padStart(2, '0')}`,
        pillar: p.pillar,
        cluster: p.cluster,
        topic: p.cluster,
        primaryKeyword: p.primaryKeyword,
        secondaryKeywords: [`${p.cluster} giá tốt`, `${seed} công nghiệp`],
        intent: p.intent,
        contentType: p.contentType,
        suggestedTitle: `${p.cluster.toUpperCase()}: Cẩm Nang Báo Giá & Thông Số Kỹ Thuật Xưởng`,
        suggestedUrl: p.suggestedUrl,
        priority: 'P1',
        funnelStage: 'BOFU',
        cannibalizationRisk: 'None',
        internalLinksTo: [p.internalLinkTo?.[0] || '/'],
        internalLinksFrom: ['/'],
        status: 'Chưa viết',
      }));
      setContentMap(generatedContent);
    }

    // Dynamic Topic Keys derived from new clusters
    if (flatPillars.length > 0) {
      const generatedTopicKeys: TopicKeyItem[] = flatPillars.map((p) => ({
        topic: p.cluster,
        parentTopic: p.pillar,
        primaryKeyword: p.primaryKeyword,
        secondaryKeywords: [`${p.cluster} B2B`, `${seed} uy tín`],
        intent: p.intent,
        semanticEntities: [seed, 'Inox 304', 'Tiêu chuẩn vi sinh', 'Động cơ biến tần'],
        problem: 'Đảm bảo tiến độ cấp liệu, giảm rung ồn, tránh kẹt liệu và hao hụt nguyên liệu',
        solution: `Ứng dụng ${p.cluster} tiêu chuẩn xưởng chế tạo máy`,
        application: 'Nhà máy thực phẩm, dược, bao bì, nông sản',
        industry: 'Chế tạo máy móc, sản xuất công nghiệp B2B',
        local: 'Đồng Nai, Bình Dương, TP.HCM, toàn quốc',
        funnelStage: 'MOFU',
        priority: 'P1',
      }));
      setTopicKeys(generatedTopicKeys);

      // Dynamic Internal Link Map
      const generatedLinks: InternalLinkItem[] = [];
      flatPillars.forEach((p, idx) => {
        generatedLinks.push({
          id: `link-p-c-${idx}`,
          sourceUrl: `/${encodeURIComponent(p.pillar.replace(/\s+/g, '-').toLowerCase())}`,
          sourceTitle: `Trụ Cột (Pillar): ${p.pillar}`,
          targetUrl: p.suggestedUrl,
          targetTitle: `Cụm Chuyên Sâu: ${p.cluster}`,
          anchorText: p.primaryKeyword,
          reason: 'Hub-and-Spoke: Điều hướng chuyên sâu từ trang Pillar mẹ xuống Cluster con',
          type: 'Pillar-Cluster',
        });
        generatedLinks.push({
          id: `link-c-p-${idx}`,
          sourceUrl: p.suggestedUrl,
          sourceTitle: `Cụm Chuyên Sâu: ${p.cluster}`,
          targetUrl: `/${encodeURIComponent(p.pillar.replace(/\s+/g, '-').toLowerCase())}`,
          targetTitle: `Trụ Cột (Pillar): ${p.pillar}`,
          anchorText: `Hệ thống ${p.pillar}`,
          reason: 'Truyền Topical Authority ngược lên trang Hub trung tâm',
          type: 'Cluster-Pillar',
        });
      });
      setInternalLinks(generatedLinks);
    }

    // Update Semantic SEO Report for new seed
    setSemanticReport((prev) => ({
      ...prev,
      primaryTopic: `Chiến Lược Topical Authority: ${seed.toUpperCase()} B2B`,
      primaryKeyword: seed,
      coreSubject: `Hệ thống giải pháp và thiết bị ${seed} chuyên dụng trong dây chuyền sản xuất công nghiệp.`,
    }));

    // Update Outline for new primary keyword
    setOutline((prev) => ({
      ...prev,
      seoTitle: `${seed.toUpperCase()}: Cẩm Nang Báo Giá & Tiêu Chuẩn Kỹ Thuật Xưởng Chế Tạo`,
      primaryKeyword: seed,
      h1: `Tổng Quan Kỹ Thuật & Báo Giá ${seed.toUpperCase()} B2B`,
    }));

    // Update Competitor Gap for new seed
    setCompetitorGap((prev) => ({
      ...prev,
      summary: `Phân tích khoảng trống chủ đề đối thủ trong ngành ${seed}`,
    }));

    setActiveTab('matrix');
  };

  // Run AI Research
  const handleRunResearch = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      applyFullResearchResult(data, formData.seedKeyword);
    } catch (err) {
      console.warn('AI research fallback to local generator:', err);
      // Local fallback in case of fetch/network disconnect
      setSeedKeyword(formData.seedKeyword);
      setActiveTab('matrix');
    } finally {
      setIsAiLoading(false);
    }
  };

  // BỔ SUNG TỪ KHÓA TỪ KEYWORD MATRIX 9D & ĐỒNG BỘ TOÀN BỘ CÁC TAB
  const handleAddMatrixKeyword = (colKey: keyof KeywordMatrixData, term: string) => {
    // 1. Update Matrix
    setMatrix((prev) => ({
      ...prev,
      [colKey]: [...(prev[colKey] || []), term],
    }));

    // 2. Classify intent, category & funnel
    let category: KeywordItem['category'] = 'Biến thể';
    let intent: SearchIntent = 'Commercial Investigation';
    let funnelStage: FunnelStage = 'MOFU';
    const pillarName = pillars[0]?.pillar || `${seedKeyword.toUpperCase()} Công Nghiệp`;
    const clusterName = `Cụm ${term}`;

    if (colKey === 'productVariants') {
      category = 'Biến thể';
      intent = 'Commercial Investigation';
      funnelStage = 'MOFU';
    } else if (colKey === 'semanticKeywords') {
      category = 'Semantic';
      intent = 'Commercial Investigation';
      funnelStage = 'MOFU';
    } else if (colKey === 'specifications') {
      category = 'Đặc điểm';
      intent = 'Commercial Investigation';
      funnelStage = 'BOFU';
    } else if (colKey === 'painPoints') {
      category = 'Pain Point';
      intent = 'Informational';
      funnelStage = 'TOFU';
    } else if (colKey === 'solutions') {
      category = 'Giải pháp';
      intent = 'Commercial Investigation';
      funnelStage = 'MOFU';
    } else if (colKey === 'integratedEquipment') {
      category = 'Thiết bị tích hợp';
      intent = 'Commercial Investigation';
      funnelStage = 'MOFU';
    } else if (colKey === 'industries') {
      category = 'Ngành';
      intent = 'Commercial Investigation';
      funnelStage = 'BOFU';
    } else if (colKey === 'locations') {
      category = 'Local';
      intent = 'Local Commercial';
      funnelStage = 'BOFU';
    } else if (colKey === 'brands') {
      category = 'Brand';
      intent = 'Navigational';
      funnelStage = 'BOFU';
    }

    const fullKw = term.toLowerCase().includes(seedKeyword.toLowerCase())
      ? term
      : colKey === 'locations'
      ? `${seedKeyword} ${term}`
      : colKey === 'painPoints'
      ? `${term} ở ${seedKeyword}`
      : colKey === 'solutions'
      ? `giải pháp ${term} cho ${seedKeyword}`
      : `${seedKeyword} ${term}`;

    const newKwItem: KeywordItem = {
      id: `kw-mat-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      keyword: fullKw,
      seedKeyword: seedKeyword,
      volume: 'Estimated',
      kd: 'Estimated',
      cpc: 'Estimated',
      intent,
      category,
      modifier: 'Ma trận 9D',
      parentTopic: clusterName,
      primaryKeyword: fullKw,
      isPrimary: false,
      topic: clusterName,
      pillar: pillarName,
      cluster: clusterName,
      isLocal: colKey === 'locations',
      isBrand: colKey === 'brands',
      serpSimilarity: 88,
      opportunityScore: 90,
      businessRelevance: 95,
      funnelStage,
      priority: 'P1',
      dataSource: 'USER DATA',
      confidence: 'High',
      status: 'KEEP',
      suggestedContentType:
        colKey === 'locations'
          ? 'Local landing page'
          : colKey === 'painPoints'
          ? 'Guide'
          : 'Product page',
      suggestedUrl: `/${encodeURIComponent(fullKw.replace(/\s+/g, '-').toLowerCase())}`,
    };

    // 3. Add to Keywords tab
    setKeywords((prev) => [newKwItem, ...prev]);

    // 4. Add cluster to Pillars tab if not existing
    setPillars((prev) => {
      const exists = prev.some((p) => p.cluster === clusterName);
      if (!exists) {
        return [
          {
            id: `pc-mat-${Date.now()}`,
            pillar: pillarName,
            cluster: clusterName,
            primaryKeyword: fullKw,
            intent,
            contentType: newKwItem.suggestedContentType,
            suggestedUrl: newKwItem.suggestedUrl,
            internalLinkTo: ['/'],
            internalLinkFrom: ['/'],
            businessRelevance: 92,
            priority: 'P1',
          },
          ...prev,
        ];
      }
      return prev;
    });

    // 5. Add to Content Map tab
    const newContent: ContentMapItem = {
      contentId: `CNT-${String(contentMap.length + 1).padStart(2, '0')}`,
      pillar: pillarName,
      cluster: clusterName,
      topic: fullKw,
      primaryKeyword: fullKw,
      secondaryKeywords: [term],
      intent,
      contentType: newKwItem.suggestedContentType,
      suggestedTitle: `${fullKw.toUpperCase()}: Cẩm Nang Kỹ Thuật & Báo Giá Xưởng`,
      suggestedUrl: newKwItem.suggestedUrl,
      priority: 'P1',
      funnelStage,
      internalLinksTo: ['/'],
      internalLinksFrom: ['/'],
      status: 'Chưa viết',
      cannibalizationRisk: 'None',
    };
    setContentMap((prev) => [newContent, ...prev]);

    // 6. Add to Topic Key tab
    const newTopicKey: TopicKeyItem = {
      topic: clusterName,
      parentTopic: pillarName,
      primaryKeyword: fullKw,
      secondaryKeywords: [term],
      intent,
      semanticEntities: [seedKeyword, term, 'Tiêu chuẩn B2B'],
      problem: `Nhu cầu tìm hiểu và xử lý bài toán ${term}`,
      solution: `Giải pháp ứng dụng ${fullKw} đồng bộ`,
      application: 'Nhà máy, phân xưởng sản xuất công nghiệp',
      industry: 'Chế tạo máy, thực phẩm, công nghiệp B2B',
      local: colKey === 'locations' ? term : 'Toàn quốc',
      funnelStage,
      priority: 'P1',
    };
    setTopicKeys((prev) => [newTopicKey, ...prev]);
  };

  // Xóa từ khóa từ ma trận & đồng bộ
  const handleDeleteMatrixKeyword = (colKey: keyof KeywordMatrixData, term: string) => {
    setMatrix((prev) => ({
      ...prev,
      [colKey]: (prev[colKey] || []).filter((t) => t !== term),
    }));
    setKeywords((prev) => prev.filter((k) => !k.keyword.includes(term)));
  };

  // Tự động sinh từ khóa tổ hợp từ Ma Trận (Variant × Spec, Variant × Location, Variant × Industry)
  const handleGenerateMatrixCombinations = () => {
    const variants = (matrix.productVariants || []).slice(0, 3);
    const specs = (matrix.specifications || []).slice(0, 2);
    const locs = (matrix.locations || []).slice(0, 2);
    const inds = (matrix.industries || []).slice(0, 2);

    const newKws: string[] = [];

    variants.forEach((v) => {
      specs.forEach((s) => {
        newKws.push(`${v} ${s.replace(seedKeyword, '').trim()}`);
      });
      locs.forEach((l) => {
        newKws.push(`${v} ${l.replace(seedKeyword, '').trim()}`);
      });
      inds.forEach((i) => {
        newKws.push(`${v} cho ${i}`);
      });
    });

    const uniqueNew = Array.from(new Set(newKws));
    uniqueNew.forEach((kw) => {
      handleAddMatrixKeyword('productVariants', kw);
    });
  };

  // Generate Outline for a keyword or custom H2/H3 headings
  const handleGenerateAiOutline = async (
    targetKeyword: string,
    customHeadings?: any[],
    customOutlineText?: string
  ) => {
    setIsGeneratingOutline(true);
    try {
      const isCustomMode = Boolean((customHeadings && customHeadings.length > 0) || customOutlineText?.trim());
      const res = await fetch('/api/outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: targetKeyword,
          primaryKeyword: targetKeyword,
          secondaryKeywords: keywords
            .filter((k) => k.keyword !== targetKeyword && k.parentTopic.includes(targetKeyword))
            .map((k) => k.keyword)
            .slice(0, 4),
          intent: 'Commercial Investigation',
          contentType: 'Guide / Product Page',
          pillar: pillars[0]?.pillar || 'Thiết bị công nghiệp',
          cluster: targetKeyword,
          mode: isCustomMode ? 'custom_headings' : 'keyword',
          customHeadings: customHeadings || [],
          customOutlineText: customOutlineText || '',
        }),
      });

      if (!res.ok) throw new Error('Failed to generate outline from server');
      const data = await res.json();
      setOutline(data);
      setActiveTab('outline');
    } catch (err) {
      console.warn('Outline fallback:', err);
      setActiveTab('outline');
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  // Competitor Gap Analysis
  const handleRunGapAnalysis = async (domains: string[]) => {
    setIsGapLoading(true);
    try {
      const res = await fetch('/api/competitor-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seedKeyword,
          competitorDomains: domains,
          currentTopics: Array.from(new Set(keywords.map((k) => k.topic))),
        }),
      });

      if (!res.ok) throw new Error('Competitor gap API failed');
      const data = await res.json();
      setCompetitorGap(data);
    } catch (err) {
      console.warn('Competitor gap fallback:', err);
    } finally {
      setIsGapLoading(false);
    }
  };

  // Add Missing Topic to Content Map
  const handleAddMissingTopic = (topicName: string, pillar: string) => {
    const newContentItem: ContentMapItem = {
      contentId: `CNT-${String(contentMap.length + 1).padStart(2, '0')}`,
      pillar,
      cluster: topicName,
      topic: topicName,
      primaryKeyword: topicName.toLowerCase(),
      secondaryKeywords: [],
      intent: 'Commercial Investigation',
      contentType: 'Product page',
      suggestedTitle: `${topicName}: Phân Loại Kỹ Thuật & Báo Giá Xưởng`,
      suggestedUrl: `/${encodeURIComponent(topicName.replace(/\s+/g, '-').toLowerCase())}`,
      priority: 'P1',
      funnelStage: 'BOFU',
      internalLinksTo: ['/'],
      internalLinksFrom: ['/'],
      status: 'Chưa viết',
      cannibalizationRisk: 'None',
    };

    setContentMap((prev) => [newContentItem, ...prev]);
    alert(`Đã thêm chủ đề "${topicName}" vào Content Map thành công!`);
    setActiveTab('contentmap');
  };

  // Run 8-Pillar Entity-First Semantic Analysis
  const handleRunSemanticAnalysis = async (technicalText: string) => {
    setIsSemanticAnalyzing(true);
    try {
      const res = await fetch('/api/semantic-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seedKeyword,
          technicalText: technicalText || formData.technicalDocText || formData.productDescription,
          productDescription: formData.productDescription,
        }),
      });

      if (!res.ok) throw new Error('API semantic analysis failed');
      const data = await res.json();
      if (data && data.primaryTopic) {
        setSemanticReport(data);
      }
    } catch (err) {
      console.warn('Semantic analysis error:', err);
      alert('Không thể hoàn tất phân tích Semantic AI lúc này.');
    } finally {
      setIsSemanticAnalyzing(false);
    }
  };

  // Extract Technical Specs & LSI from uploaded document or text description
  const handleExtractFromDoc = async (text: string) => {
    setIsExtractingSpecs(true);
    try {
      const res = await fetch('/api/extract-specs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ technicalText: text, seedKeyword }),
      });

      if (!res.ok) throw new Error('API parse specs failed');
      const data = await res.json();

      if (data.semanticLsiKeywords && Array.isArray(data.semanticLsiKeywords)) {
        const enrichedLsi: SemanticLsiItem[] = data.semanticLsiKeywords.map((item: any, idx: number) => ({
          id: `doc-lsi-${Date.now()}-${idx}`,
          keyword: item.keyword,
          intent: item.intent || 'Commercial Investigation',
          relevance: item.relevance || 95,
          context: item.context || 'Trích xuất từ tài liệu kỹ thuật sản phẩm',
          funnelStage: item.funnelStage || 'MOFU',
          coOccurrence: item.coOccurrence || [seedKeyword],
          type: item.type || 'Specification',
        }));
        setSemanticLsi((prev) => [...enrichedLsi, ...prev]);
      }

      if (data.suggestedPillars && Array.isArray(data.suggestedPillars)) {
        const newPillars: PillarClusterItem[] = [];
        data.suggestedPillars.forEach((sp: any, spIdx: number) => {
          (sp.clusters || []).forEach((cl: string, cIdx: number) => {
            newPillars.push({
              id: `doc-pc-${Date.now()}-${spIdx}-${cIdx}`,
              pillar: sp.name,
              cluster: cl,
              primaryKeyword: cl.toLowerCase(),
              intent: 'Commercial Investigation',
              contentType: 'Product page',
              suggestedUrl: `/${encodeURIComponent(cl.replace(/\s+/g, '-').toLowerCase())}`,
              internalLinkTo: ['/'],
              internalLinkFrom: ['/'],
              businessRelevance: 95,
              priority: 'P1',
            });
          });
        });
        if (newPillars.length > 0) {
          setPillars((prev) => [...prev, ...newPillars]);
        }
      }

      if (data.painPoints && Array.isArray(data.painPoints)) {
        setMatrix((prev) => ({
          ...prev,
          painPoints: Array.from(new Set([...prev.painPoints, ...data.painPoints])),
        }));
      }

      if (data.solutions && Array.isArray(data.solutions)) {
        setMatrix((prev) => ({
          ...prev,
          solutions: Array.from(new Set([...prev.solutions, ...data.solutions])),
        }));
      }

      alert('Đã trích xuất thành công LSI và thông số kỹ thuật từ tài liệu vào hệ thống!');
    } catch (err) {
      console.warn('Extract error:', err);
      alert('Không thể trích xuất tự động qua AI. Vui lòng thử lại sau.');
    } finally {
      setIsExtractingSpecs(false);
    }
  };

  // Push LSI keyword into main Keyword database
  const handlePushLsiToKeywords = (item: SemanticLsiItem) => {
    const existing = keywords.find((k) => k.keyword.toLowerCase() === item.keyword.toLowerCase());
    if (existing) {
      alert(`Từ khóa "${item.keyword}" đã có trong kho từ khóa.`);
      return;
    }

    const newKw: KeywordItem = {
      id: `kw-lsi-${Date.now()}`,
      keyword: item.keyword,
      seedKeyword: seedKeyword,
      volume: 'Estimated',
      kd: 'Estimated',
      cpc: 'Estimated',
      intent: item.intent,
      category: 'Semantic',
      modifier: 'LSI',
      parentTopic: item.keyword,
      primaryKeyword: item.keyword,
      isPrimary: false,
      topic: item.keyword,
      pillar: 'Băng tải thực phẩm',
      cluster: item.keyword,
      isLocal: false,
      isBrand: false,
      serpSimilarity: item.relevance,
      opportunityScore: item.relevance,
      businessRelevance: item.relevance,
      funnelStage: item.funnelStage,
      priority: 'P2',
      dataSource: 'USER DATA',
      confidence: 'High',
      status: 'KEEP',
      suggestedContentType: 'Guide',
      suggestedUrl: `/${encodeURIComponent(item.keyword.replace(/\s+/g, '-').toLowerCase())}`,
    };

    setKeywords((prev) => [newKw, ...prev]);
    setMatrix((prev) => ({
      ...prev,
      semanticKeywords: Array.from(new Set([...prev.semanticKeywords, item.keyword])),
    }));
    alert(`Đã đưa từ khóa "${item.keyword}" vào Kho Từ Khóa thành công!`);
  };

  // Reset to default "băng tải" demo
  const handleResetDemo = () => {
    setSeedKeyword('băng tải');
    setKeywords(DEFAULT_KEYWORDS);
    setSemanticLsi(DEFAULT_SEMANTIC_LSI);
    setMatrix(DEFAULT_KEYWORD_MATRIX);
    setPillars(DEFAULT_PILLARS);
    setTopicKeys(DEFAULT_TOPIC_KEYS);
    setContentMap(DEFAULT_CONTENT_MAP);
    setInternalLinks(DEFAULT_INTERNAL_LINKS);
    setOutline(DEFAULT_OUTLINE);
    setCompetitorGap(DEFAULT_COMPETITOR_GAP);
    setActiveTab('dashboard');
  };

  // Apply custom weights to recalculate opportunity score
  const handleApplyOpportunityWeights = (weights: {
    demandWeight: number;
    commercialWeight: number;
    relevanceWeight: number;
    competitionWeight: number;
  }) => {
    setKeywords((prev) =>
      prev.map((k) => {
        const demandScore = typeof k.volume === 'number' ? Math.min(100, k.volume / 20) : 75;
        const commScore =
          k.intent === 'Transactional'
            ? 100
            : k.intent === 'Commercial Investigation'
            ? 85
            : 60;
        const relScore = k.businessRelevance;
        const compScore = typeof k.kd === 'number' ? k.kd : 30;

        const newOpp = Math.round(
          demandScore * weights.demandWeight +
            commScore * weights.commercialWeight +
            relScore * weights.relevanceWeight -
            compScore * weights.competitionWeight
        );

        return {
          ...k,
          opportunityScore: Math.max(10, Math.min(100, newOpp)),
        };
      })
    );
  };

  // Counts for sidebar badges
  const sidebarCounts = {
    totalKeywords: keywords.length,
    totalClusters: pillars.length,
    totalContents: contentMap.length,
    cannibalizationRisks: contentMap.filter((c) => c.cannibalizationRisk === 'High').length,
    reviewCount: keywords.filter((k) => k.status === 'REVIEW').length,
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-800">
      {/* Top Header */}
      <Header
        currentSeed={seedKeyword}
        totalKeywords={keywords.length}
        totalPillars={Array.from(new Set(pillars.map((p) => p.pillar))).length}
        isAiLoading={isAiLoading}
        onOpenOpportunitySettings={() => setIsOpportunityModalOpen(true)}
        onResetDemo={handleResetDemo}
        onQuickExport={() => exportToCSV(keywords, `Keywords_${seedKeyword}`)}
      />

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={sidebarCounts}
        />

        {/* View Container */}
        <main className="flex-1 overflow-y-auto bg-slate-100/60">
          {activeTab === 'dashboard' && (
            <DashboardView
              keywords={keywords}
              pillars={pillars}
              contentMap={contentMap}
              seedKeyword={seedKeyword}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'explorer' && (
            <KeywordExplorerView
              formData={formData}
              setFormData={setFormData}
              onRunResearch={handleRunResearch}
              isLoading={isAiLoading}
              onExploreDemo={handleResetDemo}
            />
          )}

          {activeTab === 'semanticlsi' && (
            <SemanticLsiView
              semanticReport={semanticReport}
              setSemanticReport={setSemanticReport}
              semanticLsi={semanticLsi}
              setSemanticLsi={setSemanticLsi}
              onPushToKeywords={handlePushLsiToKeywords}
              onRunSemanticAnalysis={handleRunSemanticAnalysis}
              isAnalyzing={isSemanticAnalyzing}
              seedKeyword={seedKeyword}
              onNavigateToOutline={(headingTopic) => handleGenerateAiOutline(headingTopic)}
            />
          )}

          {activeTab === 'matrix' && (
            <KeywordMatrixView
              matrix={matrix}
              setMatrix={setMatrix}
              seedKeyword={seedKeyword}
              onAddMatrixKeyword={handleAddMatrixKeyword}
              onDeleteMatrixKeyword={handleDeleteMatrixKeyword}
              onGenerateMatrixCombinations={handleGenerateMatrixCombinations}
            />
          )}

          {activeTab === 'keywords' && (
            <KeywordListView
              keywords={keywords}
              setKeywords={setKeywords}
              onOpenOpportunitySettings={() => setIsOpportunityModalOpen(true)}
              seedKeyword={seedKeyword}
            />
          )}

          {activeTab === 'cluster' && (
            <TopicClusterView
              keywords={keywords}
              onSelectKeywordForOutline={(k) => handleGenerateAiOutline(k.keyword)}
            />
          )}

          {activeTab === 'topickey' && (
            <TopicKeyView topicKeys={topicKeys} seedKeyword={seedKeyword} />
          )}

          {activeTab === 'keymap' && (
            <KeymapView
              seedKeyword={seedKeyword}
              setSeedKeyword={setSeedKeyword}
              pillars={pillars}
              setPillars={setPillars}
              keywords={keywords}
              setKeywords={setKeywords}
            />
          )}

          {activeTab === 'pillar' && (
            <PillarClusterView pillars={pillars} seedKeyword={seedKeyword} />
          )}

          {activeTab === 'contentmap' && (
            <ContentMapView
              contentMap={contentMap}
              setContentMap={setContentMap}
              seedKeyword={seedKeyword}
              onGenerateOutline={(c) => handleGenerateAiOutline(c.primaryKeyword)}
            />
          )}

          {activeTab === 'outline' && (
            <OutlineBuilderView
              outline={outline}
              setOutline={setOutline}
              onGenerateAiOutline={handleGenerateAiOutline}
              isGenerating={isGeneratingOutline}
              availableKeywords={keywords}
              seedKeyword={seedKeyword}
            />
          )}

          {activeTab === 'competitor' && (
            <CompetitorGapView
              competitorGap={competitorGap}
              seedKeyword={seedKeyword}
              onRunGapAnalysis={handleRunGapAnalysis}
              isLoading={isGapLoading}
            />
          )}

          {activeTab === 'coverage' && (
            <TopicalCoverageView
              seedKeyword={seedKeyword}
              pillars={pillars}
              contentMap={contentMap}
              onAddMissingTopic={handleAddMissingTopic}
            />
          )}

          {activeTab === 'internallink' && (
            <InternalLinkMapView
              internalLinks={internalLinks}
              seedKeyword={seedKeyword}
            />
          )}

          {activeTab === 'import' && (
            <DataImportView
              onImportKeywords={(newKws) => {
                setKeywords((prev) => [...newKws, ...prev]);
                setActiveTab('keywords');
              }}
              seedKeyword={seedKeyword}
            />
          )}

          {activeTab === 'export' && (
            <ExportView
              seedKeyword={seedKeyword}
              keywords={keywords}
              pillars={pillars}
              contentMap={contentMap}
              internalLinks={internalLinks}
              matrix={matrix}
              outline={outline}
            />
          )}
        </main>
      </div>

      {/* Opportunity Weights Modal */}
      <OpportunitySettingsModal
        isOpen={isOpportunityModalOpen}
        onClose={() => setIsOpportunityModalOpen(false)}
        onApplyWeights={handleApplyOpportunityWeights}
      />
    </div>
  );
}
