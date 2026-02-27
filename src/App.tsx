/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Banana, 
  Sparkles, 
  Image as ImageIcon, 
  Users, 
  Send, 
  Download, 
  RefreshCw, 
  Heart, 
  MessageSquare,
  Plus,
  Zap
} from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

interface GalleryItem {
  id: string;
  url: string;
  title: string;
  author: string;
  likes: number;
}

// --- Mock Data ---
const MOCK_GALLERY: GalleryItem[] = [
  { id: '1', url: 'https://picsum.photos/seed/nano1/800/1200', title: 'Cyber Banana Sculpture', author: 'NanoArtist', likes: 124 },
  { id: '2', url: 'https://picsum.photos/seed/nano2/800/800', title: 'Surreal Jungle', author: 'Dreamer', likes: 89 },
  { id: '3', url: 'https://picsum.photos/seed/nano3/800/1000', title: 'Tech Texture 01', author: 'Circuit', likes: 256 },
  { id: '4', url: 'https://picsum.photos/seed/nano4/1000/800', title: 'Neon Cityscape', author: 'VibeMaster', likes: 412 },
  { id: '5', url: 'https://picsum.photos/seed/nano5/800/1200', title: 'Banana Core', author: 'OrganicAI', likes: 67 },
  { id: '6', url: 'https://picsum.photos/seed/nano6/800/800', title: 'Future Fruit', author: 'NanoArtist', likes: 153 },
];

// --- Components ---

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-2">
      <div className="bg-neon-yellow p-1.5 rounded-lg">
        <Banana className="text-ink w-6 h-6" />
      </div>
      <span className="font-display text-2xl tracking-tighter uppercase">Nano Banana</span>
    </div>
    <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
      <a href="#hero" className="hover:text-neon-yellow transition-colors">홈</a>
      <a href="#gallery" className="hover:text-neon-yellow transition-colors">갤러리</a>
      <a href="#studio" className="hover:text-neon-yellow transition-colors">스튜디오</a>
      <a href="#community" className="hover:text-neon-yellow transition-colors">커뮤니티</a>
    </div>
    <button className="bg-white text-ink px-4 py-2 rounded-full text-xs font-bold uppercase tracking-tighter hover:bg-neon-yellow transition-colors">
      시작하기
    </button>
  </nav>
);

const Marquee = () => (
  <div className="bg-neon-yellow py-3 overflow-hidden border-y-2 border-ink">
    <div className="flex whitespace-nowrap animate-marquee">
      {[...Array(10)].map((_, i) => (
        <span key={i} className="text-ink font-display text-2xl uppercase mx-8 flex items-center gap-4">
          나노 바나나 크리에이티브 <Zap className="w-5 h-5 fill-ink" /> 고해상도 AI <Sparkles className="w-5 h-5 fill-ink" /> 
        </span>
      ))}
    </div>
  </div>
);

export default function App() {
  const [imagePrompt, setImagePrompt] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const generateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: imagePrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          const url = `data:image/png;base64,${base64Data}`;
          const newImg: GeneratedImage = {
            id: Math.random().toString(36).substr(2, 9),
            url,
            prompt: imagePrompt,
            timestamp: Date.now()
          };
          setGeneratedImages(prev => [newImg, ...prev]);
          setSelectedImage(newImg);
          break;
        }
      }
    } catch (error) {
      console.error("이미지 생성 실패:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink selection:bg-neon-yellow selection:text-ink">
      <Navbar />
      
      {/* Hero Section */}
      <section id="hero" className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.2em] font-bold">
              <span className="w-2 h-2 rounded-full bg-neon-yellow animate-pulse" />
              Nano Banana 기반
            </div>
            <h1 className="text-7xl md:text-9xl font-display uppercase leading-[0.85] tracking-tighter">
              작은 아이디어 <br />
              <span className="text-neon-yellow">거대한 임팩트</span>
            </h1>
            <p className="text-lg text-white/60 max-w-lg leading-relaxed">
              차세대 크리에이티브 AI를 경험하세요. 나노 바나나의 힘으로 놀라운 고해상도 이미지를 생성합니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#studio" className="bg-white text-ink px-8 py-4 rounded-2xl font-bold uppercase tracking-tighter hover:bg-neon-yellow transition-all flex items-center gap-2 brutal-shadow">
                창작 시작하기 <Sparkles className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-video rounded-3xl overflow-hidden glass brutal-border group"
          >
            <img 
              src="https://picsum.photos/seed/nano-hero/1280/720" 
              alt="Hero Showcase"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent flex flex-col justify-end p-8">
              <p className="font-display text-2xl uppercase tracking-tighter">AI 크리에이티브 쇼케이스</p>
              <p className="text-white/40 text-xs uppercase tracking-widest">Nano Banana 모델로 생성된 아트워크</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Marquee />

      {/* Gallery Section */}
      <section id="gallery" className="py-24 px-6 bg-white text-ink">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex justify-between items-end">
            <div className="space-y-4">
              <h2 className="text-6xl font-display uppercase leading-none tracking-tighter">
                나노 <br /> 갤러리
              </h2>
              <p className="text-ink/60 max-w-md uppercase text-xs font-bold tracking-widest">
                텍스트 렌더링과 고정밀 텍스처의 한계를 탐구합니다.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="brutal-border p-4 brutal-shadow-yellow inline-block">
                <span className="font-mono text-xs font-bold uppercase">큐레이션 샘플 v1.0</span>
              </div>
            </div>
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {MOCK_GALLERY.map((item) => (
              <motion.div 
                key={item.id}
                whileHover={{ y: -5 }}
                className="relative group break-inside-avoid rounded-2xl overflow-hidden border-2 border-ink bg-white"
              >
                <img 
                  src={item.url} 
                  alt={item.title}
                  className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <p className="text-white font-display text-xl uppercase">{item.title}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-white/60 text-xs font-mono">@{item.author}</span>
                    <div className="flex items-center gap-1 text-white">
                      <Heart className="w-3 h-3 fill-neon-yellow text-neon-yellow" />
                      <span className="text-[10px] font-bold">{item.likes}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio Section */}
      <section id="studio" className="py-24 px-6 bg-ink relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-yellow/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_400px] gap-12">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-neon-yellow flex items-center justify-center">
                <ImageIcon className="text-ink w-6 h-6" />
              </div>
              <h2 className="text-5xl font-display uppercase tracking-tighter">크리에이티브 스튜디오</h2>
            </div>

            <div className="relative aspect-square rounded-3xl overflow-hidden glass brutal-border flex items-center justify-center bg-white/5">
              {selectedImage ? (
                <img 
                  src={selectedImage.url} 
                  alt="Generated" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center space-y-4 p-12">
                  {isGeneratingImage ? (
                    <div className="space-y-4">
                      <RefreshCw className="w-12 h-12 text-neon-yellow animate-spin mx-auto" />
                      <p className="font-display uppercase text-2xl">당신의 비전을 렌더링 중입니다...</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-24 h-24 rounded-full border-2 border-white/10 flex items-center justify-center mx-auto mb-6">
                        <Plus className="w-10 h-10 text-white/20" />
                      </div>
                      <p className="text-white/40 uppercase tracking-widest text-sm">아래에 프롬프트를 입력하여 시작하세요</p>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="relative">
                <textarea 
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="당신의 걸작을 묘사해주세요... (예: 네온 도시 속의 나노 바나나 로봇)"
                  className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-6 text-lg focus:border-neon-yellow focus:ring-0 transition-all min-h-[120px] resize-none"
                />
                <button 
                  onClick={generateImage}
                  disabled={isGeneratingImage || !imagePrompt.trim()}
                  className="absolute bottom-4 right-4 bg-neon-yellow text-ink p-4 rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {['Cyberpunk', 'Surrealism', 'Oil Painting', '3D Render', 'Minimalist'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setImagePrompt(prev => prev + (prev ? ', ' : '') + tag)}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase font-bold hover:bg-white/10 transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass rounded-3xl p-6 border-white/10 space-y-6">
              <h3 className="font-display uppercase text-xl flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-neon-yellow" /> 히스토리
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {generatedImages.length === 0 && (
                  <div className="col-span-2 py-12 text-center text-white/20 uppercase text-[10px] tracking-[0.2em] font-bold">
                    아직 이미지가 없습니다
                  </div>
                )}
                {generatedImages.map((img) => (
                  <button 
                    key={img.id}
                    onClick={() => setSelectedImage(img)}
                    className={cn(
                      "aspect-square rounded-xl overflow-hidden border-2 transition-all",
                      selectedImage?.id === img.id ? "border-neon-yellow scale-95" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img.url} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              {selectedImage && (
                <div className="space-y-2">
                  <button 
                    onClick={() => setImagePrompt(selectedImage.prompt)}
                    className="w-full bg-neon-yellow text-ink py-3 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all"
                  >
                    <RefreshCw className="w-4 h-4" /> 프롬프트 리믹스
                  </button>
                  <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all">
                    <Download className="w-4 h-4" /> 이미지 다운로드
                  </button>
                </div>
              )}
            </div>

            <div className="bg-neon-yellow rounded-3xl p-6 text-ink space-y-4 brutal-shadow">
              <h3 className="font-display uppercase text-xl">프로 팁</h3>
              <p className="text-xs font-medium leading-relaxed">
                나노 바나나는 텍스트 렌더링에 탁월합니다. "어두운 골목에 'NANO'라고 적힌 네온 사인"과 같은 프롬프트를 시도해 보세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-24 px-6 bg-white text-ink border-t-2 border-ink">
        <div className="max-w-7xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-7xl font-display uppercase tracking-tighter">유저 쇼케이스</h2>
            <p className="text-ink/60 uppercase text-sm font-bold tracking-widest">대화에 참여하고 당신의 창작물을 공유하세요.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="brutal-border p-8 space-y-6 text-left hover:brutal-shadow transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-ink/5" />
                  <div>
                    <p className="font-bold uppercase text-sm">User_{i}42</p>
                    <p className="text-[10px] font-mono text-ink/40">2시간 전</p>
                  </div>
                </div>
                <p className="text-sm italic leading-relaxed">
                  "나노 바나나의 텍스트 렌더링은 정말 놀랍습니다. 타이포그래피를 이렇게 잘 처리하는 AI는 처음 봐요!"
                </p>
                <div className="flex items-center gap-6 pt-4 border-t border-ink/10">
                  <button className="flex items-center gap-2 text-xs font-bold uppercase hover:text-neon-yellow transition-colors">
                    <Heart className="w-4 h-4" /> 24
                  </button>
                  <button className="flex items-center gap-2 text-xs font-bold uppercase hover:text-neon-yellow transition-colors">
                    <MessageSquare className="w-4 h-4" /> 8
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="bg-ink text-white px-12 py-6 rounded-2xl font-display text-2xl uppercase tracking-tighter hover:bg-neon-yellow hover:text-ink transition-all brutal-shadow">
            커뮤니티 참여하기
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Banana className="text-neon-yellow w-6 h-6" />
            <span className="font-display text-xl uppercase tracking-tighter">Nano Banana</span>
          </div>
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
            © 2026 Nano Banana Creative Studio. 모든 권리 보유.
          </p>
          <div className="flex gap-6 text-white/60 text-[10px] uppercase font-bold tracking-widest">
            <a href="#" className="hover:text-white transition-colors">이용약관</a>
            <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-white transition-colors">API</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
