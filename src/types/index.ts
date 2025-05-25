import type { LucideIcon } from 'lucide-react';

export interface Section {
  id: string;
  title: string;
  content: string;
  commands?: string[];
}

export interface PremiumSection {
  id: string;
  title: string;
}

export interface Tool {
  id: string;
  title: string;
  path: string;
  description: string;
  icon: LucideIcon;
  content: {
    title: string;
    description: string;
    premiumFeatures?: string[];
  };
  sections?: Section[];
  premiumSections?: PremiumSection[];
}

export interface Certification {
  id: string;
  title: string;
  path: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  isPremium: boolean;
}

export interface LifecyclePhase {
  id: string;
  title: string;
  path: string;
  description: string;
  icon: LucideIcon;
  sections: Section[];
}

export interface Technique {
  id: string;
  title: string;
  path: string;
  description: string;
  icon: LucideIcon;
  sections: Section[];
}

export interface PortInfo {
  port: number;
  service: string;
  description: string;
  defaultState: 'open' | 'closed' | 'filtered';
  common: boolean;
  protocol: 'tcp' | 'udp' | 'both';
  commands?: string[];
}

export interface TargetParams {
  ip: string;
  port: string;
  service: string;
}