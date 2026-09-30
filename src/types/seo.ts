export type SearchIntent =
  | 'Informational'
  | 'Commercial Investigation'
  | 'Transactional'
  | 'Navigational'
  | 'Local Commercial';

export type FunnelStage = 'TOFU' | 'MOFU' | 'BOFU';
export type PriorityLevel = 'P1' | 'P2' | 'P3';
export type DataSource = 'REAL DATA' | 'AI ESTIMATE' | 'USER DATA';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low';
export type CleaningStatus = 'KEEP' | 'REVIEW' | 'REMOVE';
export type CannibalizationLevel = 'None' | 'Low' | 'Medium' | 'High';

export interface SemanticEntity {
  name: string;
  category:
    | 'Người / Đối tượng'
    | 'Sản phẩm / Dịch vụ'
    | 'Địa điểm'
    | 'Khái niệm'
    | 'Công cụ'
    | 'Thuộc tính'
    | 'Thành phần'
    | 'Phương pháp'
    | 'Thương hiệu'
    | 'Chủ đề phụ'
    | string;
  description: string;
  relevance: number; // 0 - 100
  importance: 'Core' | 'Supporting' | 'Contextual';
}

export interface SemanticRelationship {
  sourceEntity: string;
  relationType:
    | 'A là gì (Định nghĩa)'
    | 'A gồm thành phần nào (Cấu tạo)'
    | 'A hoạt động như thế nào (Cơ chế)'
    | 'A liên quan đến B ra sao (Liên kết dây chuyền)'
    | 'A khác B ở điểm nào (So sánh đối chuẩn)'
    | 'Khi nào nên sử dụng A (Trường hợp ứng dụng)'
    | 'Ưu điểm và hạn chế của A (Đánh giá chuyên sâu)';
  targetEntity?: string;
  statement: string;
}

export interface SemanticAnalysisReport {
  primaryTopic: string;
  primaryKeyword: string;
  searchIntent: SearchIntent;
  targetAudience: string;
  coreSubject: string;
  mainEntities: SemanticEntity[];
  relatedEntities: SemanticEntity[];
  semanticRelationships: SemanticRelationship[];
  naturalRelatedTerms: {
    term: string;
    usageContext: string;
    importance: string;
  }[];
  mainSubtopics: {
    title: string;
    entitiesCovered: string[];
    purpose: string;
  }[];
  relatedQuestions: {
    question: string;
    entityFocus: string;
    briefAnswer: string;
  }[];
  contentGaps: string[];
  suggestedContentStructure: {
    heading: string;
    entitiesIncluded: string[];
    objective: string;
  }[];
}

export interface SemanticLsiItem {
  id: string;
  keyword: string;
  intent: SearchIntent;
  relevance: number;
  context: string;
  funnelStage: FunnelStage;
  coOccurrence: string[];
  type: 'Entity' | 'LSI Co-occurrence' | 'Synonyms' | 'Specification' | 'Integration';
}

export interface KeywordItem {
  id: string;
  keyword: string;
  seedKeyword: string;
  volume: number | 'N/A' | 'Estimated';
  kd: number | 'N/A' | 'Estimated';
  cpc: number | 'N/A' | 'Estimated';
  intent: SearchIntent;
  category: 'Biến thể' | 'Semantic' | 'Đặc điểm' | 'Pain Point' | 'Giải pháp' | 'Thiết bị tích hợp' | 'Ngành' | 'Local' | 'Brand';
  modifier: string;
  parentTopic: string;
  primaryKeyword: string;
  isPrimary: boolean;
  topic: string;
  pillar: string;
  cluster: string;
  isLocal: boolean;
  isBrand: boolean;
  serpSimilarity: number; // 0 - 100
  opportunityScore: number; // 0 - 100
  businessRelevance: number; // 0 - 100
  funnelStage: FunnelStage;
  priority: PriorityLevel;
  dataSource: DataSource;
  confidence: ConfidenceLevel;
  status: CleaningStatus;
  suggestedContentType: string;
  suggestedUrl: string;
}

export interface KeywordMatrixData {
  productVariants: string[];
  semanticKeywords: string[];
  specifications: string[];
  painPoints: string[];
  solutions: string[];
  integratedEquipment: string[];
  industries: string[];
  locations: string[];
  brands: string[];
}

export interface PillarClusterItem {
  id: string;
  pillar: string;
  cluster: string;
  primaryKeyword: string;
  intent: SearchIntent;
  contentType: string;
  suggestedUrl: string;
  internalLinkTo: string[];
  internalLinkFrom: string[];
  businessRelevance: number;
  priority: PriorityLevel;
}

export interface TopicKeyItem {
  topic: string;
  parentTopic: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  intent: SearchIntent;
  semanticEntities: string[];
  problem: string;
  solution: string;
  application: string;
  industry: string;
  local: string;
  funnelStage: FunnelStage;
  priority: PriorityLevel;
}

export interface ContentMapItem {
  contentId: string;
  pillar: string;
  cluster: string;
  topic: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  intent: SearchIntent;
  contentType: string;
  suggestedTitle: string;
  suggestedUrl: string;
  priority: PriorityLevel;
  funnelStage: FunnelStage;
  internalLinksTo: string[];
  internalLinksFrom: string[];
  status: 'Chưa viết' | 'Đang viết' | 'Đã xuất bản' | 'Cần xem xét';
  cannibalizationRisk: CannibalizationLevel;
  cannibalizationNotes?: string;
}

export interface OutlineHeading {
  level: 'H2' | 'H3';
  title: string;
  targetKeywords?: string[];
  intentTarget?: string;
  keyPoints?: string[];
  subheadings?: {
    level: 'H3';
    title: string;
    keyPoints?: string[];
  }[];
}

export interface SeoOutline {
  seoTitle: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  h1: string;
  sapo: string;
  headings: OutlineHeading[];
  technicalSpecsTable?: { parameter: string; recommended: string; note: string }[];
  faq: { question: string; answer: string }[];
  callToAction: {
    primary: string;
    secondary: string;
    placement: string;
  };
  primaryKeyword: string;
  secondaryKeywords: string[];
  semanticEntities: string[];
  internalLinks: {
    anchorText: string;
    targetUrl: string;
    targetPageName?: string;
    reason: string;
  }[];
  sourcesAndStandards: string[];
}

export interface InternalLinkItem {
  id: string;
  sourceUrl: string;
  sourceTitle: string;
  targetUrl: string;
  targetTitle: string;
  anchorText: string;
  reason: string;
  type: 'Pillar-Cluster' | 'Cluster-Pillar' | 'Related-Cluster' | 'Transactional-Bridge';
}

export interface CompetitorGapData {
  summary: string;
  missingTopics: {
    topic: string;
    pillar: string;
    searchIntent: SearchIntent;
    priority: PriorityLevel;
    competitorEdge: string;
    recommendedAction: string;
  }[];
  keywordGaps: {
    keyword: string;
    intent: SearchIntent;
    estimatedDifficulty: string;
    relevance: number;
    suggestedTitle: string;
  }[];
  structureRecommendations: string[];
}

export interface ResearchFormData {
  seedKeyword: string;
  website: string;
  productService: string;
  productDescription?: string;
  technicalDocText?: string;
  targetMarket: string;
  language: string;
  location: string;
  brand: string;
  competitors: string;
}
