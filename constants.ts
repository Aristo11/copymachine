
import { FXConfig, Asset } from './types';

export const DEFAULT_CONFIG: FXConfig = {
  enableGlow: true,
  glowColor: '#00ffcc',
  glowIntensity: 15,
  
  enableBreathing: true,
  breathingSpeed: 3,
  breathingDepth: 0.03,
  
  enableLightning: false,
  lightningIntensity: 0,
  lightningFrequency: 0.02,
  lightningSpeed: 10,
  
  enableSheen: true,
  sheenColor: '#ffffff',
  sheenOpacity: 0.5,
  sheenSpeed: 2.5,
  
  masking: {
    enabled: false,
    prompt: '',
    region: { x: 25, y: 25, width: 50, height: 50 },
    feather: 10
  },
  
  opacity: 1,
};

export const MAX_IMAGE_SIZE_PX = 1024;

export const SAMPLE_ASSETS: Asset[] = [];