'use client'

import { useState } from 'react'
import { 
  Palette, 
  Type, 
  Image, 
  Layout, 
  Eye,
  Sun,
  Moon,
  Copy,
  Check,
  Zap,
  Lock,
  Search,
  Share2,
  Grid3X3
} from 'lucide-react'
import * as Tabs from '@radix-ui/react-tabs'

// Brand colors from tokens
const brandColors = {
  black: { hex: '#363b42', oklch: 'oklch(0.3503 0.014 256.77)', name: 'Brand Black' },
  white: { hex: '#f0fbff', oklch: 'oklch(0.994 0.0084 197.02)', name: 'Brand White' },
  blue: { hex: '#27abec', oklch: 'oklch(0.7031 0.1426 236.68)', name: 'Brand Blue' },
}

const bootstrapColors = {
  light: { hex: '#d7e9f2', name: 'Light' },
  dark: { hex: '#363b42', name: 'Dark' },
  primary: { hex: '#27abec', name: 'Primary' },
  secondary: { hex: '#1b67a1', name: 'Secondary' },
  info: { hex: '#f0d15e', name: 'Info' },
  success: { hex: '#13c16a', name: 'Success' },
  warning: { hex: '#eed210', name: 'Warning' },
  danger: { hex: '#fe1b20', name: 'Danger' },
}

const neutralScale = [
  { value: '0', hex: '#ffffff', oklch: 'oklch(100% 0 0)', name: 'Neutral 0' },
  { value: '50', hex: '#f0fbff', oklch: 'oklch(0.994 0.0084 197.02)', name: 'Neutral 50' },
  { value: '100', hex: '#d7e9f2', oklch: 'oklch(92% 0.012 230)', name: 'Neutral 100' },
  { value: '200', hex: '#c5d9e5', oklch: 'oklch(88% 0.012 230)', name: 'Neutral 200' },
  { value: '300', hex: '#9bb5c7', oklch: 'oklch(75% 0.015 230)', name: 'Neutral 300' },
  { value: '400', hex: '#6d8a9f', oklch: 'oklch(60% 0.018 230)', name: 'Neutral 400' },
  { value: '500', hex: '#4a6275', oklch: 'oklch(45% 0.02 230)', name: 'Neutral 500' },
  { value: '600', hex: '#363b42', oklch: 'oklch(0.3503 0.014 256.77)', name: 'Neutral 600' },
  { value: '700', hex: '#2c3138', oklch: 'oklch(30% 0.015 256)', name: 'Neutral 700' },
  { value: '800', hex: '#23272d', oklch: 'oklch(22% 0.012 256)', name: 'Neutral 800' },
  { value: '900', hex: '#1a1d21', oklch: 'oklch(16% 0.01 256)', name: 'Neutral 900' },
  { value: '950', hex: '#141719', oklch: 'oklch(12% 0.008 256)', name: 'Neutral 950' },
  { value: '1000', hex: '#0a0b0c', oklch: 'oklch(6% 0.005 256)', name: 'Neutral 1000' },
]

function ColorSwatch({ color, name, showOklch = false }: { 
  color: string
  name: string
  showOklch?: boolean
}) {
  const [copied, setCopied] = useState(false)
  
  const copyColor = async () => {
    await navigator.clipboard.writeText(color)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  
  const isLight = color.startsWith('#f') || color.startsWith('#e') || color.startsWith('#d') || color.startsWith('#c') || color === '#ffffff'
  
  return (
    <div 
      className="color-swatch group relative"
      onClick={copyColor}
    >
      <div 
        className="w-full aspect-square rounded-lg border-3 border-vault-border-strong flex items-end justify-start p-2"
        style={{ backgroundColor: color }}
      >
        <span className={`text-xs font-mono font-medium ${isLight ? 'text-brand-black' : 'text-brand-white'}`}>
          {color}
        </span>
      </div>
      <p className="mt-2 text-sm font-medium text-vault-text-primary">{name}</p>
      {copied && (
        <div className="absolute top-2 right-2 bg-brand-blue text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <Check size={12} /> Copied
        </div>
      )}
    </div>
  )
}

function LogoPreview() {
  const [bgMode, setBgMode] = useState<'dark' | 'light' | 'checkerboard'>('dark')
  
  const bgClass = bgMode === 'dark' 
    ? 'preview-bg-dark' 
    : bgMode === 'light' 
      ? 'preview-bg-light' 
      : 'preview-bg-checkerboard'
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Logo Variants</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setBgMode('dark')}
            className={`p-2 rounded border-2 ${bgMode === 'dark' ? 'border-brand-blue bg-vault-surface-tertiary' : 'border-vault-border-default'}`}
          >
            <Moon size={20} />
          </button>
          <button
            onClick={() => setBgMode('light')}
            className={`p-2 rounded border-2 ${bgMode === 'light' ? 'border-brand-blue bg-vault-surface-tertiary' : 'border-vault-border-default'}`}
          >
            <Sun size={20} />
          </button>
          <button
            onClick={() => setBgMode('checkerboard')}
            className={`p-2 rounded border-2 ${bgMode === 'checkerboard' ? 'border-brand-blue bg-vault-surface-tertiary' : 'border-vault-border-default'}`}
          >
            <Grid3X3 size={20} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Logo */}
        <div className="card-brutalist">
          <h3 className="text-lg font-semibold mb-4">Primary Wordmark</h3>
          <div className={`${bgClass} rounded-lg p-8 flex items-center justify-center min-h-[200px] border-2 border-vault-border-default`}>
            {bgMode === 'light' ? (
              <img 
                src="/logos/vaultica-logo.svg" 
                alt="Vaultica Logo" 
                className="max-w-full max-h-32 object-contain"
              />
            ) : (
              <img 
                src="/logos/vaultica-logo-white.svg" 
                alt="Vaultica Logo White" 
                className="max-w-full max-h-32 object-contain"
              />
            )}
          </div>
          <p className="mt-3 text-sm text-vault-text-secondary">
            {bgMode === 'light' ? 'vaultica-logo.svg' : 'vaultica-logo-white.svg'}
          </p>
        </div>
        
        {/* Icon Only */}
        <div className="card-brutalist">
          <h3 className="text-lg font-semibold mb-4">Icon Mark</h3>
          <div className={`${bgClass} rounded-lg p-8 flex items-center justify-center min-h-[200px] border-2 border-vault-border-default`}>
            <img 
              src="/logos/vaultica-white-icon.svg" 
              alt="Vaultica Icon" 
              className="max-w-full max-h-24 object-contain"
            />
          </div>
          <p className="mt-3 text-sm text-vault-text-secondary">vaultica-white-icon.svg</p>
        </div>
        
        {/* Favicon */}
        <div className="card-brutalist">
          <h3 className="text-lg font-semibold mb-4">Favicon</h3>
          <div className={`${bgClass} rounded-lg p-8 flex items-center justify-center gap-8 min-h-[200px] border-2 border-vault-border-default`}>
            <div className="text-center">
              <img 
                src="/logos/favicon.ico" 
                alt="Favicon 16x16" 
                className="w-4 h-4 mx-auto"
              />
              <span className="text-xs text-vault-text-secondary mt-2 block">16px</span>
            </div>
            <div className="text-center">
              <img 
                src="/logos/favicon.ico" 
                alt="Favicon 32x32" 
                className="w-8 h-8 mx-auto"
              />
              <span className="text-xs text-vault-text-secondary mt-2 block">32px</span>
            </div>
            <div className="text-center">
              <img 
                src="/logos/favicon.ico" 
                alt="Favicon 64x64" 
                className="w-16 h-16 mx-auto"
              />
              <span className="text-xs text-vault-text-secondary mt-2 block">64px</span>
            </div>
          </div>
          <p className="mt-3 text-sm text-vault-text-secondary">favicon.ico</p>
        </div>
        
        {/* Logo Clearspace */}
        <div className="card-brutalist">
          <h3 className="text-lg font-semibold mb-4">Clearspace Guide</h3>
          <div className={`${bgClass} rounded-lg p-8 flex items-center justify-center min-h-[200px] border-2 border-vault-border-default relative`}>
            <div className="border-2 border-dashed border-brand-blue/50 p-8 rounded">
              {bgMode === 'light' ? (
                <img 
                  src="/logos/vaultica-logo.svg" 
                  alt="Vaultica Logo" 
                  className="max-w-full max-h-20 object-contain"
                />
              ) : (
                <img 
                  src="/logos/vaultica-logo-white.svg" 
                  alt="Vaultica Logo White" 
                  className="max-w-full max-h-20 object-contain"
                />
              )}
            </div>
          </div>
          <p className="mt-3 text-sm text-vault-text-secondary">Minimum clearspace = height of lock icon</p>
        </div>
      </div>
    </div>
  )
}

function ColorPalette() {
  return (
    <div className="space-y-12">
      {/* Brand Colors */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Brand Colors</h2>
        <div className="grid grid-cols-3 gap-6">
          {Object.entries(brandColors).map(([key, color]) => (
            <ColorSwatch key={key} color={color.hex} name={color.name} />
          ))}
        </div>
      </section>
      
      {/* Bootstrap Theme */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Bootstrap Theme Colors</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {Object.entries(bootstrapColors).map(([key, color]) => (
            <ColorSwatch key={key} color={color.hex} name={color.name} />
          ))}
        </div>
      </section>
      
      {/* Neutral Scale */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Neutral Scale</h2>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
          {neutralScale.map((color) => (
            <div key={color.value} className="text-center">
              <div 
                className="w-full aspect-square rounded border-2 border-vault-border-default cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundColor: color.hex }}
                title={`${color.name}\n${color.hex}\n${color.oklch}`}
              />
              <span className="text-xs text-vault-text-secondary mt-1 block">{color.value}</span>
            </div>
          ))}
        </div>
      </section>
      
      {/* Semantic Colors Demo */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Status Colors</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-lg p-4 border-2" style={{ backgroundColor: 'oklch(32% 0.08 155)', borderColor: 'oklch(50% 0.14 155)' }}>
            <span className="text-sm font-medium" style={{ color: '#13c16a' }}>Success</span>
          </div>
          <div className="rounded-lg p-4 border-2" style={{ backgroundColor: 'oklch(40% 0.10 95)', borderColor: 'oklch(65% 0.15 95)' }}>
            <span className="text-sm font-medium" style={{ color: '#eed210' }}>Warning</span>
          </div>
          <div className="rounded-lg p-4 border-2" style={{ backgroundColor: 'oklch(40% 0.08 85)', borderColor: 'oklch(65% 0.12 85)' }}>
            <span className="text-sm font-medium" style={{ color: '#f0d15e' }}>Info</span>
          </div>
          <div className="rounded-lg p-4 border-2" style={{ backgroundColor: 'oklch(30% 0.10 25)', borderColor: 'oklch(45% 0.18 25)' }}>
            <span className="text-sm font-medium" style={{ color: '#fe1b20' }}>Danger</span>
          </div>
        </div>
      </section>
    </div>
  )
}

function Typography() {
  return (
    <div className="space-y-12">
      {/* Type Scale */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Typography Scale</h2>
        <div className="card-brutalist space-y-6">
          <div>
            <span className="text-xs text-vault-text-secondary font-mono">Display / 4.5rem / 800</span>
            <p className="text-7xl font-extrabold tracking-tight text-vault-text-primary">Blink Vault</p>
          </div>
          <div>
            <span className="text-xs text-vault-text-secondary font-mono">H1 / 3rem / 700</span>
            <p className="text-5xl font-bold tracking-tight text-vault-text-primary">See it. Blink it. Find it.</p>
          </div>
          <div>
            <span className="text-xs text-vault-text-secondary font-mono">H2 / 2.25rem / 600</span>
            <p className="text-4xl font-semibold text-vault-text-primary">Your Visual Collection</p>
          </div>
          <div>
            <span className="text-xs text-vault-text-secondary font-mono">H3 / 1.5rem / 600</span>
            <p className="text-2xl font-semibold text-vault-text-primary">Instant Search</p>
          </div>
          <div>
            <span className="text-xs text-vault-text-secondary font-mono">Body / 1rem / 400</span>
            <p className="text-base text-vault-text-primary">Blink Vault makes your collection searchable. Instantly. By what you remember. No more scrolling through thousands of files.</p>
          </div>
          <div>
            <span className="text-xs text-vault-text-secondary font-mono">Small / 0.875rem / 400</span>
            <p className="text-sm text-vault-text-secondary">Saved 2 minutes ago · 3.2 MB · PNG</p>
          </div>
          <div>
            <span className="text-xs text-vault-text-secondary font-mono">Code / JetBrains Mono / 400</span>
            <p className="font-mono text-sm text-vault-text-primary">--vault-accent: oklch(0.7031 0.1426 236.68);</p>
          </div>
        </div>
      </section>
      
      {/* Font Stacks */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Font Families</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="card-brutalist">
            <h3 className="text-lg font-semibold mb-4">Inter (Primary)</h3>
            <p className="text-vault-text-secondary mb-4">Headlines, body text, UI elements</p>
            <div className="space-y-2">
              <p className="font-normal">Regular (400) – The quick brown fox</p>
              <p className="font-medium">Medium (500) – The quick brown fox</p>
              <p className="font-semibold">Semibold (600) – The quick brown fox</p>
              <p className="font-bold">Bold (700) – The quick brown fox</p>
              <p className="font-extrabold">Extrabold (800) – The quick brown fox</p>
            </div>
          </div>
          <div className="card-brutalist">
            <h3 className="text-lg font-semibold mb-4 font-mono">JetBrains Mono (Code)</h3>
            <p className="text-vault-text-secondary mb-4">Code blocks, technical content</p>
            <div className="space-y-2 font-mono">
              <p className="font-normal">Regular (400) – function blinkIt() {`{}`}</p>
              <p className="font-medium">Medium (500) – const vault = new Vault()</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function MockWebsite() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Mock Website Preview</h2>
      <p className="text-vault-text-secondary">Review how the brand looks in a real website context</p>
      
      {/* Mock Header */}
      <div className="card-brutalist overflow-hidden p-0">
        <header className="bg-vault-surface-secondary border-b-3 border-vault-border-strong px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/logos/vaultica-white-icon.svg" 
                alt="Vaultica" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-vault-text-primary">Blink Vault</span>
            </div>
            <nav className="flex items-center gap-6">
              <a href="#" className="text-vault-text-secondary hover:text-vault-text-primary transition-colors">Features</a>
              <a href="#" className="text-vault-text-secondary hover:text-vault-text-primary transition-colors">Pricing</a>
              <a href="#" className="text-vault-text-secondary hover:text-vault-text-primary transition-colors">Docs</a>
              <button className="btn-primary text-sm py-2 px-4">Get Started</button>
            </nav>
          </div>
        </header>
        
        {/* Hero Section */}
        <section className="px-6 py-16 text-center bg-vault-surface-primary">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            See it. <span className="text-brand-blue">Blink it.</span> Find it.
          </h1>
          <p className="text-xl text-vault-text-secondary max-w-2xl mx-auto mb-8">
            The intelligent visual collection tool for people who save inspiration but have no time to organize.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button className="btn-primary flex items-center gap-2">
              <Zap size={20} /> Start Blinking
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <Eye size={20} /> Watch Demo
            </button>
          </div>
        </section>
        
        {/* Features Grid */}
        <section className="px-6 py-12 bg-vault-surface-secondary border-t-3 border-vault-border-strong">
          <div className="grid grid-cols-3 gap-6">
            <div className="card-brutalist">
              <div className="w-12 h-12 rounded-lg bg-brand-blue/20 flex items-center justify-center mb-4">
                <Zap className="text-brand-blue" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Blink It. Zero Effort</h3>
              <p className="text-vault-text-secondary text-sm">One-tap save from anywhere. Blinked to your Vault. ⚡</p>
            </div>
            <div className="card-brutalist">
              <div className="w-12 h-12 rounded-lg bg-brand-blue/20 flex items-center justify-center mb-4">
                <Search className="text-brand-blue" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Find by Memory</h3>
              <p className="text-vault-text-secondary text-sm">Search by what you remember. Natural language, instant results.</p>
            </div>
            <div className="card-brutalist">
              <div className="w-12 h-12 rounded-lg bg-brand-blue/20 flex items-center justify-center mb-4">
                <Lock className="text-brand-blue" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Locked by Vaultica</h3>
              <p className="text-vault-text-secondary text-sm">Your Vault is private. End-to-end encrypted. Always.</p>
            </div>
          </div>
        </section>
        
        {/* Search Bar Demo */}
        <section className="px-6 py-12 bg-vault-surface-primary border-t-3 border-vault-border-strong">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-vault-text-tertiary" size={20} />
              <input 
                type="text" 
                placeholder="Search your Blinks... try 'blue gradient website header'" 
                className="input-brutalist pl-12"
              />
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="px-6 py-8 bg-vault-surface-secondary border-t-3 border-vault-border-strong">
          <div className="flex items-center justify-between text-sm text-vault-text-secondary">
            <div className="flex items-center gap-2">
              <img 
                src="/logos/vaultica-white-icon.svg" 
                alt="Vaultica" 
                className="h-5 w-5 opacity-60"
              />
              <span>© 2026 Vaultica. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-vault-text-primary">Privacy</a>
              <a href="#" className="hover:text-vault-text-primary">Terms</a>
              <a href="#" className="hover:text-vault-text-primary">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

function ComponentShowcase() {
  return (
    <div className="space-y-12">
      <h2 className="text-2xl font-bold">Component Patterns</h2>
      
      {/* Buttons */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Buttons</h3>
        <div className="card-brutalist flex flex-wrap gap-4">
          <button className="btn-primary">Primary Button</button>
          <button className="btn-secondary">Secondary Button</button>
          <button className="btn-primary flex items-center gap-2">
            <Zap size={18} /> With Icon
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Share2 size={18} /> Share Link
          </button>
        </div>
      </section>
      
      {/* Inputs */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Inputs</h3>
        <div className="card-brutalist space-y-4 max-w-md">
          <input type="text" placeholder="Default input..." className="input-brutalist" />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vault-text-tertiary" size={18} />
            <input type="text" placeholder="Search Blinks..." className="input-brutalist pl-10" />
          </div>
        </div>
      </section>
      
      {/* Cards */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Cards</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="card-brutalist">
            <h4 className="font-semibold mb-2">Standard Card</h4>
            <p className="text-vault-text-secondary text-sm">Heavy 3px borders with strong contrast.</p>
          </div>
          <div className="card-brutalist hover:border-brand-blue transition-colors cursor-pointer">
            <h4 className="font-semibold mb-2">Interactive Card</h4>
            <p className="text-vault-text-secondary text-sm">Hover to see accent border.</p>
          </div>
          <div className="bg-vault-surface-tertiary border-3 border-vault-border-default p-6">
            <h4 className="font-semibold mb-2">Elevated Card</h4>
            <p className="text-vault-text-secondary text-sm">Tertiary surface for elevation.</p>
          </div>
        </div>
      </section>
      
      {/* Badges */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Badges</h3>
        <div className="card-brutalist flex flex-wrap gap-3">
          <span className="px-3 py-1 rounded text-sm font-medium" style={{ backgroundColor: 'oklch(30% 0.015 256)', color: '#d7e9f2' }}>Default</span>
          <span className="px-3 py-1 rounded text-sm font-medium bg-brand-blue/20 text-brand-blue">Accent</span>
          <span className="px-3 py-1 rounded text-sm font-medium" style={{ backgroundColor: 'oklch(32% 0.08 155)', color: '#13c16a' }}>Success</span>
          <span className="px-3 py-1 rounded text-sm font-medium" style={{ backgroundColor: 'oklch(40% 0.10 95)', color: '#eed210' }}>Warning</span>
          <span className="px-3 py-1 rounded text-sm font-medium" style={{ backgroundColor: 'oklch(30% 0.10 25)', color: '#fe1b20' }}>Danger</span>
        </div>
      </section>
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src="/logos/vaultica-white-icon.svg" 
              alt="Vaultica" 
              className="h-12 w-12"
            />
            <div>
              <h1 className="text-3xl font-bold text-vault-text-primary">Vaultica Keystone</h1>
              <p className="text-vault-text-secondary">Design System Preview Tool</p>
            </div>
          </div>
          <p className="text-vault-text-secondary max-w-2xl">
            Human review dashboard for logos, colors, typography, and component patterns. 
            Click on colors to copy their values. Toggle backgrounds for logo preview.
          </p>
        </header>
        
        {/* Tabs Navigation */}
        <Tabs.Root defaultValue="logo" className="space-y-8">
          <Tabs.List className="flex gap-2 border-b-3 border-vault-border-default pb-4">
            <Tabs.Trigger 
              value="logo"
              className="flex items-center gap-2 px-4 py-2 rounded-t font-medium text-vault-text-secondary data-[state=active]:text-brand-blue data-[state=active]:bg-vault-surface-secondary data-[state=active]:border-3 data-[state=active]:border-b-0 data-[state=active]:border-vault-border-strong transition-colors"
            >
              <Image size={18} /> Logos
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="colors"
              className="flex items-center gap-2 px-4 py-2 rounded-t font-medium text-vault-text-secondary data-[state=active]:text-brand-blue data-[state=active]:bg-vault-surface-secondary data-[state=active]:border-3 data-[state=active]:border-b-0 data-[state=active]:border-vault-border-strong transition-colors"
            >
              <Palette size={18} /> Colors
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="typography"
              className="flex items-center gap-2 px-4 py-2 rounded-t font-medium text-vault-text-secondary data-[state=active]:text-brand-blue data-[state=active]:bg-vault-surface-secondary data-[state=active]:border-3 data-[state=active]:border-b-0 data-[state=active]:border-vault-border-strong transition-colors"
            >
              <Type size={18} /> Typography
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="components"
              className="flex items-center gap-2 px-4 py-2 rounded-t font-medium text-vault-text-secondary data-[state=active]:text-brand-blue data-[state=active]:bg-vault-surface-secondary data-[state=active]:border-3 data-[state=active]:border-b-0 data-[state=active]:border-vault-border-strong transition-colors"
            >
              <Layout size={18} /> Components
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="website"
              className="flex items-center gap-2 px-4 py-2 rounded-t font-medium text-vault-text-secondary data-[state=active]:text-brand-blue data-[state=active]:bg-vault-surface-secondary data-[state=active]:border-3 data-[state=active]:border-b-0 data-[state=active]:border-vault-border-strong transition-colors"
            >
              <Eye size={18} /> Mock Website
            </Tabs.Trigger>
          </Tabs.List>
          
          <Tabs.Content value="logo">
            <LogoPreview />
          </Tabs.Content>
          
          <Tabs.Content value="colors">
            <ColorPalette />
          </Tabs.Content>
          
          <Tabs.Content value="typography">
            <Typography />
          </Tabs.Content>
          
          <Tabs.Content value="components">
            <ComponentShowcase />
          </Tabs.Content>
          
          <Tabs.Content value="website">
            <MockWebsite />
          </Tabs.Content>
        </Tabs.Root>
        
        {/* Review Footer */}
        <footer className="mt-16 pt-8 border-t-3 border-vault-border-default">
          <div className="flex items-center justify-between text-sm text-vault-text-secondary">
            <span>Vaultica Keystone v1.0.0 · Design System SSoT</span>
            <span>Last updated: 2026-01-16</span>
          </div>
        </footer>
      </div>
    </main>
  )
}
