
export interface SmartMask {
  enabled: boolean;
  prompt: string;
  region: { x: number; y: number; width: number; height: number }; // percentages 0-100
  feather: number; // blur radius for mask edges
}

export interface FXConfig {
  enableGlow: boolean;
  glowColor: string;
  glowIntensity: number; // 0 to 50 (blur radius)
  
  enableBreathing: boolean;
  breathingSpeed: number; // 0 to 10 (seconds, 0 is off)
  breathingDepth: number; // 0 to 1 (scale variance)
  
  enableLightning: boolean;
  lightningIntensity: number; // 0 to 100 (displacement scale)
  lightningFrequency: number; // 0.01 to 0.5 (baseFrequency)
  lightningSpeed: number; // 0 to 50 (animation speed)
  
  enableSheen: boolean;
  sheenColor: string;
  sheenOpacity: number; // 0 to 1
  sheenSpeed: number; // 0 to 10 (seconds)
  
  masking: SmartMask;

  opacity: number; // 0 to 1
}

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export interface GeminiSuggestion {
  reasoning: string;
  config: Partial<FXConfig>;
}

export interface Asset {
  id: string;
  src: string;
  name: string;
  type: 'upload' | 'sample';
}