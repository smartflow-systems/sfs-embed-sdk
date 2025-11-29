/**
 * SFS Embed SDK - Type Definitions
 * Drop-in widgets for customer websites
 */

export interface SFSEmbedConfig {
  workspace: string;
  apiKey?: string;
  domain?: string;
  widgets?: WidgetConfig[];
  theme?: ThemeConfig;
  position?: WidgetPosition;
}

export interface WidgetConfig {
  type: WidgetType;
  enabled: boolean;
  config?: Record<string, any>;
}

export type WidgetType = 'form' | 'chat' | 'calculator' | 'changelog';

export interface ThemeConfig {
  primaryColor?: string;
  position?: WidgetPosition;
  borderRadius?: string;
  fontFamily?: string;
}

export interface WidgetPosition {
  bottom?: string;
  right?: string;
  left?: string;
  top?: string;
}

export interface FormWidgetConfig {
  formId: string;
  title?: string;
  description?: string;
  fields?: FormField[];
  submitUrl?: string;
  onSubmit?: (data: Record<string, any>) => void;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  options?: string[];
}

export interface ChatWidgetConfig {
  workspaceId: string;
  wsUrl?: string;
  offlineMessage?: string;
  position?: WidgetPosition;
}

export interface CalculatorWidgetConfig {
  calculatorId: string;
  title: string;
  formula: string;
  inputs: CalculatorInput[];
  ctaText?: string;
  ctaUrl?: string;
}

export interface CalculatorInput {
  name: string;
  label: string;
  type: 'number' | 'slider';
  min?: number;
  max?: number;
  step?: number;
  default?: number;
  prefix?: string;
  suffix?: string;
}

export interface ChangelogWidgetConfig {
  workspaceId: string;
  apiUrl?: string;
  badge?: boolean;
  maxItems?: number;
}

export interface ChangelogEntry {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'feature' | 'improvement' | 'bugfix';
  read?: boolean;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface SecurityConfig {
  allowedDomains?: string[];
  corsEnabled?: boolean;
  rateLimit?: RateLimitConfig;
}
