import React, { useEffect, useState, useRef } from 'react';
import { 
  ChartBarIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  BoltIcon,
  GlobeAltIcon,
  CpuChipIcon,
  RocketLaunchIcon,
  CheckIcon,
  CommandLineIcon,
  HeartIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onStartScrape: () => void;
  leadCount?: number;
  industryCount?: number;
}

// Animated counter hook
function useAnimatedCounter(target: number, duration: number = 1200) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number>();

  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    startTime.current = null;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(eased * target));
      if (progress < 1) rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, [target, duration]);

  return count;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onStartScrape, leadCount = 0, industryCount = 0 }) => {
  const animatedLeadCount = useAnimatedCounter(leadCount);
  const animatedIndustryCount = useAnimatedCounter(industryCount);

  const features = [
    {
      icon: ChartBarIcon,
      title: 'Analytics Dashboard',
      description: 'Real-time analytics with scoring metrics, status breakdowns, and industry distribution charts.',
      action: () => onNavigate('dashboard'),
      color: 'from-blue-500 to-blue-600',
      glowColor: 'rgba(59,130,246,0.15)'
    },
    {
      icon: UserGroupIcon,
      title: 'Lead Management',
      description: 'Comprehensive lead tracking with sorting, filtering, and advanced search across all fields.',
      action: () => onNavigate('leads'),
      color: 'from-indigo-500 to-indigo-600',
      glowColor: 'rgba(99,102,241,0.15)'
    },
    {
      icon: MagnifyingGlassIcon,
      title: 'Smart Scraping',
      description: 'AI-powered lead discovery pulling verified data on real companies and executives.',
      action: onStartScrape,
      color: 'from-cyan-500 to-teal-500',
      glowColor: 'rgba(6,182,212,0.15)'
    },
    {
      icon: SparklesIcon,
      title: 'Data Enrichment',
      description: 'Fill every missing field — email, phone, LinkedIn, revenue — with real verified data.',
      action: () => onNavigate('enrichment'),
      color: 'from-amber-500 to-orange-500',
      glowColor: 'rgba(245,158,11,0.15)'
    },
    {
      icon: LightBulbIcon,
      title: 'AI Insights',
      description: 'Deep lead analysis with conversion predictions, risk assessment, and competitor intelligence.',
      action: () => onNavigate('ai-insights'),
      color: 'from-purple-500 to-violet-500',
      glowColor: 'rgba(168,85,247,0.15)'
    },
    {
      icon: ArrowTrendingUpIcon,
      title: 'Market Analysis',
      description: 'Industry trends, market sizing, growth rates, and strategic recommendations powered by AI.',
      action: () => onNavigate('market-analysis'),
      color: 'from-emerald-500 to-green-500',
      glowColor: 'rgba(16,185,129,0.15)'
    }
  ];

  const capabilities = [
    { icon: BoltIcon, label: 'Real-time Processing' },
    { icon: GlobeAltIcon, label: 'Global Coverage' },
    { icon: CpuChipIcon, label: 'AI-Powered' },
    { icon: RocketLaunchIcon, label: 'Fast Enrichment' },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* === Animated Background Layer === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.4) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        {/* Morphing gradient blobs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-500/[0.06] blur-3xl animate-float-slow morph-blob" />
        <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-indigo-500/[0.05] blur-3xl animate-float-medium morph-blob" style={{ animationDelay: '-4s' }} />
        <div className="absolute -bottom-20 left-1/4 w-[450px] h-[450px] bg-slate-400/[0.04] blur-3xl animate-float-reverse morph-blob" style={{ animationDelay: '-8s' }} />
        <div className="absolute top-2/3 right-1/4 w-[300px] h-[300px] bg-cyan-500/[0.04] blur-3xl animate-float-slow morph-blob" style={{ animationDelay: '-12s' }} />

        {/* Rotating decorative ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] animate-rotate-slow opacity-[0.03]">
          <div className="absolute inset-0 rounded-full border border-slate-400/40" />
          <div className="absolute inset-8 rounded-full border border-blue-400/30 border-dashed" />
          <div className="absolute inset-16 rounded-full border border-indigo-400/20" />
        </div>

        {/* Animated subtle lines */}
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-slate-500/10 to-transparent animate-pulse-slow" />
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/[0.06] to-transparent animate-pulse-slow" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-indigo-500/[0.06] to-transparent animate-pulse-slow" style={{ animationDelay: '-6s' }} />

        {/* Floating particles - more variety */}
        <div className="absolute top-1/4 left-[15%] w-1 h-1 rounded-full bg-slate-400/30 animate-particle-1" />
        <div className="absolute top-1/2 left-[45%] w-1.5 h-1.5 rounded-full bg-blue-400/20 animate-particle-2" />
        <div className="absolute top-3/4 left-[70%] w-1 h-1 rounded-full bg-indigo-400/25 animate-particle-3" />
        <div className="absolute top-[20%] left-[80%] w-1 h-1 rounded-full bg-cyan-400/20 animate-particle-1" style={{ animationDelay: '-5s' }} />
        <div className="absolute top-[60%] left-[25%] w-1.5 h-1.5 rounded-full bg-slate-300/15 animate-particle-2" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-[10%] left-[55%] w-0.5 h-0.5 rounded-full bg-blue-300/25 animate-particle-3" style={{ animationDelay: '-7s' }} />
        <div className="absolute top-[85%] left-[40%] w-1 h-1 rounded-full bg-indigo-300/20 animate-particle-1" style={{ animationDelay: '-10s' }} />
        <div className="absolute top-[45%] left-[90%] w-0.5 h-0.5 rounded-full bg-cyan-300/30 animate-particle-2" style={{ animationDelay: '-9s' }} />
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/[0.07] via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
          <div className="text-center">
            {/* Animated Logo */}
            <div className="flex justify-center mb-8 animate-blur-in" style={{ animationDelay: '0ms', animationFillMode: 'backwards' }}>
              <div className="relative group">
                {/* Glow ring */}
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-blue-500/20 blur-xl animate-glow-pulse opacity-60" />
                {/* Rotating border accent */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/30 via-indigo-500/20 to-slate-500/30 animate-gradient-x opacity-50" style={{ backgroundSize: '200% 200%' }} />
                <div className="relative w-20 h-20 bg-gradient-to-br from-slate-700 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-900/30 border border-slate-500/20">
                  <span className="text-white font-bold text-2xl tracking-tight">LC</span>
                </div>
              </div>
            </div>

            {/* Title with gradient animation */}
            <h1 className="animate-slide-up-spring" style={{ animationDelay: '150ms', animationFillMode: 'backwards' }}>
              <span className="block text-4xl md:text-6xl font-bold text-slate-100 mb-2 tracking-tight">
                LegacyCompass
              </span>
              <span className="block text-xl md:text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 animate-gradient-text mt-2" style={{ backgroundSize: '200% auto' }}>
                Lead Intelligence Platform
              </span>
            </h1>

            <p className="text-base text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-blur-in mt-6" style={{ animationDelay: '350ms', animationFillMode: 'backwards' }}>
              AI-powered lead management with real-time enrichment, market analysis, and intelligent scoring — built for modern sales teams.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}>
              <button
                onClick={() => onNavigate('dashboard')}
                className="group relative inline-flex items-center px-7 py-3.5 text-sm font-semibold text-white rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Shimmer on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
                <span className="relative flex items-center">
                  View Dashboard
                  <ArrowRightIcon className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </button>
              <button
                onClick={onStartScrape}
                className="group relative inline-flex items-center px-7 py-3.5 text-sm font-semibold text-slate-200 rounded-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-600/50 hover:border-blue-500/40 overflow-hidden shimmer-hover"
              >
                <div className="absolute inset-0 bg-slate-800/60 group-hover:bg-slate-700/60 transition-colors duration-300" />
                <span className="relative flex items-center">
                  Start Scraping
                  <MagnifyingGlassIcon className="ml-2 h-4 w-4 transform group-hover:rotate-12 transition-transform duration-200" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Capabilities Ticker */}
      <div className="relative max-w-3xl mx-auto px-4 mb-12">
        <div className="flex items-center justify-center gap-6 md:gap-10 animate-fade-in-up" style={{ animationDelay: '650ms', animationFillMode: 'backwards' }}>
          {capabilities.map((cap, i) => (
            <div key={i} className="flex items-center gap-2 text-slate-500 floating-badge" style={{ animationDelay: `${i * 200}ms` }}>
              <cap.icon className="h-4 w-4 text-blue-400/60" />
              <span className="text-xs font-medium tracking-wide whitespace-nowrap">{cap.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glow-card bg-[#1A1F27] rounded-xl p-6 border border-slate-700/50 text-center animate-bounce-in shimmer-hover" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
              <div className="text-3xl font-bold text-slate-100 mb-1 animate-counter">{animatedLeadCount.toLocaleString()}</div>
              <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">Active Leads</div>
            </div>
            <div className="glow-card bg-[#1A1F27] rounded-xl p-6 border border-slate-700/50 text-center animate-bounce-in shimmer-hover" style={{ animationDelay: '350ms', animationFillMode: 'backwards' }}>
              <div className="text-3xl font-bold text-slate-100 mb-1 animate-counter">{animatedIndustryCount}</div>
              <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">Industries</div>
            </div>
            <div className="glow-card bg-[#1A1F27] rounded-xl p-6 border border-slate-700/50 text-center animate-bounce-in shimmer-hover" style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}>
              <div className="flex items-center justify-center space-x-2 mb-1">
                <ShieldCheckIcon className="h-6 w-6 text-teal-400" />
                <span className="text-3xl font-bold text-slate-100">Verified</span>
              </div>
              <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">Real-time Data</div>
            </div>
            <div className="glow-card bg-[#1A1F27] rounded-xl p-6 border border-slate-700/50 text-center animate-bounce-in shimmer-hover" style={{ animationDelay: '650ms', animationFillMode: 'backwards' }}>
              <div className="flex items-center justify-center space-x-2 mb-1">
                <SparklesIcon className="h-6 w-6 text-blue-400" />
                <span className="text-3xl font-bold text-slate-100">AI</span>
              </div>
              <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">Enrichment</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-14 animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-5 tracking-wide">
            <SparklesIcon className="h-3.5 w-3.5" />
            PLATFORM FEATURES
          </div>
          <h2 className="text-3xl font-bold text-slate-100 mb-3 tracking-tight">
            Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">win more deals</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Discover, qualify, and convert leads with AI-powered intelligence at every step.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <button
              key={index}
              onClick={feature.action}
              className="icon-bounce group relative bg-[#1A1F27] rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/80 transition-all duration-400 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/30 animate-slide-up-spring text-left glow-card shimmer-hover"
              style={{ animationDelay: `${600 + index * 100}ms`, animationFillMode: 'backwards' }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${feature.glowColor}, transparent 40%)` }}
              />
              
              <div className="relative">
                {/* Icon with bounce */}
                <div className={`icon-target inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                
                <h3 className="text-base font-semibold text-slate-100 mb-2 group-hover:text-white transition-colors duration-200">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4 group-hover:text-slate-300 transition-colors duration-200">{feature.description}</p>
                
                <span className="inline-flex items-center text-blue-400 group-hover:text-blue-300 font-medium transition-all text-xs animated-underline">
                  Get Started
                  <ArrowRightIcon className="ml-1.5 h-3.5 w-3.5 transform group-hover:translate-x-1.5 transition-transform duration-200" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-5 tracking-wide">
            <HeartIcon className="h-3.5 w-3.5" />
            ABOUT US
          </div>
          <h2 className="text-3xl font-bold text-slate-100 mb-3 tracking-tight">
            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">modern sales teams</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            LegacyCompass is an AI-powered B2B lead intelligence platform designed to help sales teams discover, qualify, and convert high-value prospects faster than ever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mission */}
          <div className="glow-card bg-[#1A1F27] rounded-xl p-8 border border-slate-700/50 text-center shimmer-hover">
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 mb-5 shadow-lg">
              <RocketLaunchIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-3">Our Mission</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              To democratize sales intelligence by making enterprise-grade lead enrichment and market analysis accessible to every team — powered by cutting-edge AI.
            </p>
          </div>

          {/* Technology */}
          <div className="glow-card bg-[#1A1F27] rounded-xl p-8 border border-slate-700/50 text-center shimmer-hover">
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 mb-5 shadow-lg">
              <CommandLineIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-3">Our Technology</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Built on advanced LLMs with real-time data pipelines, LegacyCompass delivers verified company data, AI-driven scoring, and actionable market insights in seconds.
            </p>
          </div>

          {/* Vision */}
          <div className="glow-card bg-[#1A1F27] rounded-xl p-8 border border-slate-700/50 text-center shimmer-hover">
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 mb-5 shadow-lg">
              <EyeIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-3">Our Vision</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              A world where every sales professional has an AI copilot — identifying the right leads, at the right time, with the right message, across 110+ countries.
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5 tracking-wide">
            <SparklesIcon className="h-3.5 w-3.5" />
            PRICING
          </div>
          <h2 className="text-3xl font-bold text-slate-100 mb-3 tracking-tight">
            Choose the plan that <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">fits your needs</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Start free and scale as your sales pipeline grows. No credit card required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <div className="glow-card bg-[#1A1F27] rounded-xl p-8 border border-slate-700/50 flex flex-col shimmer-hover">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-1">Starter</h3>
              <p className="text-slate-500 text-xs">Perfect for getting started</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-100">$0</span>
              <span className="text-slate-500 text-sm ml-1">/month</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {['Up to 50 leads', 'Basic lead scraping', 'AI lead scoring', 'Dashboard analytics', 'Email generation'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckIcon className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-slate-200 border border-slate-600/50 hover:border-blue-500/40 hover:bg-slate-700/50 transition-all duration-300"
            >
              Get Started Free
            </button>
          </div>

          {/* Pro Plan - Highlighted */}
          <div className="relative glow-card bg-[#1A1F27] rounded-xl p-8 border-2 border-blue-500/40 flex flex-col shimmer-hover">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold shadow-lg">MOST POPULAR</span>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-1">Professional</h3>
              <p className="text-slate-500 text-xs">For growing sales teams</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-100">$49</span>
              <span className="text-slate-500 text-sm ml-1">/month</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {['Unlimited leads', 'Batch scraping (50+)', 'AI enrichment & scoring', 'Market AI analysis', 'AI email generation', 'Priority data refresh', 'Advanced search filters'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckIcon className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg hover:shadow-blue-900/30"
            >
              Start Pro Trial
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="glow-card bg-[#1A1F27] rounded-xl p-8 border border-slate-700/50 flex flex-col shimmer-hover">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-1">Enterprise</h3>
              <p className="text-slate-500 text-xs">For large organizations</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-100">$199</span>
              <span className="text-slate-500 text-sm ml-1">/month</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {['Everything in Pro', 'Custom AI models', 'API access', 'Team collaboration', 'Dedicated support', 'Custom integrations', 'SLA guarantee', 'Onboarding & training'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckIcon className="h-4 w-4 text-purple-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-slate-200 border border-slate-600/50 hover:border-purple-500/40 hover:bg-slate-700/50 transition-all duration-300"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 animate-fade-in-up" style={{ animationDelay: '1200ms', animationFillMode: 'backwards' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-blue-600/10 animate-gradient-x" style={{ backgroundSize: '200% 200%' }} />
          <div className="absolute inset-0 bg-[#1A1F27]/80" />
          <div className="relative px-8 py-10 text-center">
            <h3 className="text-xl font-bold text-slate-100 mb-3">Ready to supercharge your pipeline?</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-lg mx-auto">Start scraping real companies and let AI enrich every lead with verified data.</p>
            <button
              onClick={onStartScrape}
              className="group inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-900/30"
            >
              <RocketLaunchIcon className="mr-2 h-4 w-4 group-hover:animate-bounce" />
              Get Started Now
              <ArrowRightIcon className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};