import React, { useState, useCallback, useRef } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { CanvasPreview } from './components/CanvasPreview';
import { AssetLibrary } from './components/AssetLibrary';
import { DEFAULT_CONFIG, SAMPLE_ASSETS } from './constants';
import { FXConfig, ImageDimensions, Asset } from './types';
import { Sparkles } from 'lucide-react';
import { analyzeImageForFX } from './services/geminiService';

const App: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>(SAMPLE_ASSETS);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  const [config, setConfig] = useState<FXConfig>(DEFAULT_CONFIG);
  const [dimensions, setDimensions] = useState<ImageDimensions>({ width: 800, height: 600, aspectRatio: 1.33 });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImage = useCallback((src: string) => {
    setImageSrc(src);
    const img = new Image();
    img.onload = () => {
      setDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight
      });
      setAiReasoning(null); // Reset analysis when image changes
    };
    img.src = src;
  }, []);

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAssetId(asset.id);
    loadImage(asset.src);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const newAsset: Asset = {
          id: `upload-${Date.now()}`,
          name: file.name,
          src: result,
          type: 'upload'
        };
        setAssets(prev => [newAsset, ...prev]);
        handleAssetSelect(newAsset);
      };
      reader.readAsDataURL(file);
    }
    // Reset input value to allow same file selection again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAssetDelete = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
    if (selectedAssetId === id) {
      setSelectedAssetId(null);
      setImageSrc(null);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleConfigChange = useCallback((key: keyof FXConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleAutoTune = async () => {
    if (!imageSrc) return;
    
    setIsAnalyzing(true);
    try {
      const suggestion = await analyzeImageForFX(imageSrc);
      setAiReasoning(suggestion.reasoning);
      setConfig(prev => ({
        ...prev,
        ...suggestion.config
      }));
    } catch (error) {
      console.error(error);
      alert("Could not analyze image. Please check API Key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-200 font-sans overflow-hidden selection:bg-cyan-900/50">
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept="image/*" 
        onChange={handleFileUpload} 
      />

      {/* Left Sidebar: Library */}
      <AssetLibrary 
        assets={assets}
        selectedAssetId={selectedAssetId}
        onSelect={handleAssetSelect}
        onUpload={triggerFileUpload}
        onDelete={handleAssetDelete}
      />

      {/* Main Content: Canvas */}
      <main className="flex-1 flex flex-col relative bg-zinc-950 overflow-hidden">
         {/* Subtle Logo Overlay */}
         <div className="absolute top-4 left-4 z-10 pointer-events-none opacity-50 mix-blend-plus-lighter">
            <div className="flex items-center gap-2 text-zinc-500">
              <Sparkles className="w-4 h-4" />
              <span className="font-semibold text-xs tracking-widest uppercase">Widget Animator</span>
            </div>
         </div>

        {/* AI Notification */}
        {aiReasoning && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
            <div className="bg-zinc-900/90 backdrop-blur-xl border border-cyan-500/30 text-cyan-100 px-6 py-3 rounded-full shadow-2xl text-sm flex items-center gap-3 max-w-lg text-center ring-1 ring-cyan-500/20">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
              <span className="font-medium leading-tight">{aiReasoning}</span>
            </div>
          </div>
        )}
        
        <CanvasPreview 
          imageSrc={imageSrc} 
          dimensions={dimensions} 
          config={config} 
          onUpload={triggerFileUpload}
          onFileSelect={(file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const result = e.target?.result as string;
              const newAsset: Asset = {
                id: `upload-${Date.now()}`,
                name: file.name,
                src: result,
                type: 'upload'
              };
              setAssets(prev => [newAsset, ...prev]);
              handleAssetSelect(newAsset);
            };
            reader.readAsDataURL(file);
          }}
        />
      </main>

      {/* Right Sidebar: Controls */}
      <ControlPanel 
        config={config} 
        onChange={handleConfigChange} 
        isAnalyzing={isAnalyzing}
        onAutoTune={handleAutoTune}
      />
    </div>
  );
};

export default App;