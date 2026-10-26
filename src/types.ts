export interface Project {
  id: string;
  title: string;
  category: 'completed' | 'ongoing';
  sector: 'commercial' | 'industrial' | 'educational' | 'infrastructure';
  image: string;
  location?: string;
  tonnage?: string;
  description?: string;
}

export interface SampleDrawing {
  id: string;
  title: string;
  category: 'shop' | 'ab' | 'structural' | 'misc';
  categoryLabel: string;
  image: string;
  full: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

export interface JobOpening {
  id: string;
  title: string;
  location: string;
  department: string;
  description: string;
  requirements: string[];
}

export type BlogBlock =
  | { type: 'h2' | 'h3' | 'p'; text: string }
  | { type: 'ul' | 'ol'; items: string[] }
  | { type: 'quote'; text: string; cite?: string };

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: BlogBlock[];
  category: string;
  sourceUrl: string;
}

export interface QuoteCalculation {
  projectName: string;
  serviceType: string;
  tonnage: number;
  drawingType: string;
  estimatedHours: number;
  estimatedCost: number;
}
