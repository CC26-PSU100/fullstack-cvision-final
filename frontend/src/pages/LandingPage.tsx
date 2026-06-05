import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BarChart3, 
  Zap, 
  ArrowRight, 
  CheckCircle2,
  Mail,
  Shield,
  Users,
  Search,
  Layout,
  FileSearch,
  Sparkles
} from "lucide-react";

const GithubIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const FEATURES = [
  {
    icon: <FileSearch className="w-6 h-6" />,
    title: "AI Resume Parsing",
    description: "Ekstraksi data otomatis dari dokumen CV Anda secara akurat menggunakan teknologi NLP."
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: "Job Matching Engine",
    description: "CVision mencocokkan kompetensi Anda dengan kriteria spesifik lowongan pekerjaan secara objektif."
  },
  {
    icon: <Layout className="w-6 h-6" />,
    title: "Career Roadmap",
    description: "Rekomendasi langkah karir selanjutnya berdasarkan analisis gap kompetensi dari CVision."
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Data Privacy",
    description: "Keamanan data dokumen Anda terlindungi dengan enkripsi standar industri di dalam sistem CVision."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Talent Insights",
    description: "Analisis tren pasar kerja terkini untuk membantu Anda menyesuaikan keahlian yang dibutuhkan."
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Resume Optimizer",
    description: "Saran perbaikan struktur dan kata kunci dari CVision agar CV Anda lebih ramah sistem ATS."
  }
];

const CONTRIBUTORS = [
  { name: "Arjuna Hizbul", role: "AI Engineer", id: "CACC009D6Y0512", initials: "AH" },
  { name: "Farrell Rabbani", role: "AI Engineer", id: "CACC009D6Y2543", initials: "FR" },
  { name: "Daniel Julian", role: "Full-Stack Developer", id: "CFCC009D6Y0652", initials: "DJ" },
  { name: "Kadek Agus", role: "Full-Stack Developer", id: "CFCC009D6Y1545", initials: "KA" },
  { name: "Revata Octathio", role: "Data Scientist", id: "CDCC009D6Y1013", initials: "RO" },
  { name: "Syahrani.R", role: "Data Scientist", id: "CDCC304D6X1444", initials: "SR" }
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 scroll-smooth snap-y snap-mandatory overflow-y-auto h-screen relative">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-[0.05] invert" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/[0.02] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-white/[0.03] blur-[150px] rounded-full" />
      </div>

      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-7xl bg-black/60 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
        <div className="px-6 md:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span className="material-symbols-outlined text-white text-xl md:text-2xl">
                description
              </span>
              <span className="text-base md:text-xl font-bold tracking-tight text-white">
                CVision
              </span>
            </div>
            
            <div className="hidden lg:flex items-center gap-8 text-xs font-medium uppercase tracking-widest text-zinc-400">
              <a href="#features" className="hover:text-white transition-colors">Fitur</a>
              <a href="#about" className="hover:text-white transition-colors">Analisis</a>
              <a href="#team" className="hover:text-white transition-colors">Tim</a>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button 
                className="font-medium text-[10px] md:text-xs uppercase tracking-widest text-zinc-400 hover:text-white px-2 md:px-4 py-2 transition-colors cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Masuk
              </button>
              <Button 
                className="bg-white text-black font-semibold px-4 md:px-6 py-1.5 md:py-2 rounded-full hover:bg-zinc-200 transition-all text-[9px] md:text-xs uppercase tracking-wider h-auto"
                onClick={() => navigate("/register")}
              >
                Mulai Gratis
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative min-h-[100svh] flex items-center justify-center pt-40 md:pt-48 pb-12 snap-start bg-black">
        <div className="max-w-7xl mx-auto px-5 md:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-12 items-center">
          <div className="text-center lg:text-left space-y-8 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 lg:slide-in-from-left-4 duration-1000">
            <div className="inline-flex items-center gap-2 md:gap-3 px-3 py-1.5 rounded-sm bg-white/5 border border-white/10 text-[9px] md:text-xs font-medium tracking-wide uppercase text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
              Capstone CC26-PSU100 • CVision AI
            </div>
            
            <h1 className="text-4xl md:text-7xl font-semibold tracking-tight leading-[1.1] md:leading-[1.05] text-balance text-white">
              Optimalkan <br className="hidden sm:block" />
              Profil Profesional <br />
              <span className="text-zinc-600 italic underline decoration-zinc-800 underline-offset-8">Bersama CVision</span>
            </h1>
            
            <p className="max-w-lg mx-auto lg:mx-0 text-sm md:text-xl text-zinc-400 leading-relaxed font-normal">
              CVision menggunakan AI untuk menganalisis dokumen CV dan mencocokkannya dengan lowongan pekerjaan guna mempercepat proses rekrutmen Anda.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-3 pt-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-white text-black font-semibold px-10 py-4 rounded-full text-sm md:text-base hover:bg-zinc-200 transition-all group h-auto"
                onClick={() => navigate("/register")}
              >
                Coba CVision Sekarang
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <button 
                className="w-full sm:w-auto border border-white/10 bg-white/5 backdrop-blur-sm font-semibold px-10 py-4 rounded-full text-sm md:text-base hover:bg-white/10 transition-all cursor-pointer text-white h-auto"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Lihat Fitur Utama
              </button>
            </div>
          </div>

          <div className="hidden lg:block relative animate-in fade-in slide-in-from-right-4 duration-1000 delay-200">
            <div className="relative z-10 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10 border border-white/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10 border border-white/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/10 border border-white/20" />
                  </div>
                  <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">CVision_Analysis_v1</div>
                </div>
                <div className="aspect-square rounded-xl bg-black/40 border border-white/5 flex flex-col p-6 gap-6">
                  <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                    <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-semibold text-white">CV</div>
                    <div className="space-y-2">
                      <div className="h-3.5 w-32 bg-foreground/10 rounded-full" />
                      <div className="h-2 w-48 bg-foreground/5 rounded-full" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="h-2 w-full bg-white/5 rounded-full" />
                    <div className="h-2 w-full bg-white/5 rounded-full" />
                    <div className="h-2 w-3/4 bg-white/5 rounded-full" />
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="h-24 rounded-xl bg-white/5 border border-white/10 p-4 flex flex-col justify-between">
                        <div className="text-[10px] font-medium uppercase text-zinc-500 tracking-[0.2em]">Accuracy</div>
                        <div className="text-3xl font-semibold text-white">80%+</div>
                      </div>
                      <div className="h-24 rounded-xl bg-white/5 border border-white/10 p-4 flex flex-col justify-between">
                        <div className="text-[10px] font-medium uppercase text-zinc-500 tracking-[0.2em]">Extraction</div>
                        <div className="text-3xl font-semibold text-white">Fast</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/[0.03] blur-[100px] -z-10 rounded-full" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-white/[0.03] blur-[100px] -z-10 rounded-full" />
          </div>
        </div>
      </section>

      <section id="features" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-900 to-black border-y border-white/5 snap-start pt-40 pb-24 md:pt-48 md:pb-32">
        <div className="max-w-7xl mx-auto px-5 md:px-8 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 md:mb-16 gap-6 text-center md:text-left">
            <div className="max-w-xl space-y-4">
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white">Fitur CVision</h2>
              <p className="text-sm md:text-xl text-zinc-400 font-normal">
                Sistem terintegrasi untuk pengelolaan karir yang lebih efisien.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="px-5 py-2.5 rounded-sm border border-white/10 bg-white/5 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">
                Core Modules
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, idx) => (
              <Card key={idx} className="bg-zinc-900/40 border-white/5 hover:border-white/20 hover:bg-zinc-900/60 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                   <div className="text-6xl md:text-8xl font-bold text-white">0{idx + 1}</div>
                </div>
                <CardContent className="p-8 md:p-10 relative z-10">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-6 md:mb-8 group-hover:bg-white group-hover:text-black transition-all">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 tracking-tight text-white">{feature.title}</h3>
                  <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="min-h-screen flex items-center justify-center overflow-hidden snap-start pt-40 pb-24 md:pt-48 md:pb-32 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-4 md:space-y-6 pt-8 md:pt-12">
                   <div className="aspect-square rounded-2xl bg-white/5 border border-white/10 p-6 md:p-8 flex flex-col justify-end gap-3 group hover:border-white/20 transition-all relative overflow-hidden">
                      <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-zinc-500" />
                      </div>
                      <div className="text-3xl md:text-5xl font-semibold tracking-tighter text-white">80%+</div>
                      <div className="text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Accuracy Rate</div>
                      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                   <div className="aspect-square rounded-2xl bg-zinc-900/40 border border-white/10 p-6 md:p-8 flex flex-col justify-end gap-3 group hover:border-white/30 transition-all relative overflow-hidden shadow-sm">
                      <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                      </div>
                      <div className="text-3xl md:text-5xl font-semibold tracking-tighter text-white">Secure</div>
                      <div className="text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Data Encryption</div>
                   </div>
                </div>
                <div className="space-y-4 md:space-y-6">
                   <div className="aspect-square rounded-2xl bg-zinc-900/40 border border-white/10 p-6 md:p-8 flex flex-col justify-end gap-3 group hover:border-white/30 transition-all relative overflow-hidden shadow-sm">
                      <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                      </div>
                      <div className="text-3xl md:text-5xl font-semibold tracking-tighter text-white">Fast</div>
                      <div className="text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Processing Time</div>
                   </div>
                   <div className="aspect-square rounded-2xl bg-white/5 border border-white/10 p-6 md:p-8 flex flex-col justify-end gap-3 group hover:border-white/20 transition-all relative overflow-hidden">
                      <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-zinc-500" />
                      </div>
                      <div className="text-3xl md:text-5xl font-semibold tracking-tighter text-white">Analytic</div>
                      <div className="text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Skill Mapping</div>
                   </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-8 md:space-y-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-white/5 border border-white/10 text-[10px] font-medium text-zinc-500 uppercase tracking-[0.2em]">
                Analisis CVision
              </div>
              <h2 className="text-4xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-white">Analisis Karir Berbasis Data</h2>
              <p className="text-lg md:text-xl text-zinc-400 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                CVision menyediakan solusi untuk mempermudah pengelolaan profil profesional secara digital, akurat, dan terstruktur.
              </p>
              
              <div className="grid grid-cols-2 gap-4 md:gap-5 pt-4 max-w-lg mx-auto lg:mx-0 text-left">
                {[
                  { title: "Smart Parsing", desc: "Automasi data CV." },
                  { title: "Job Matching", desc: "Skoring relevansi." },
                  { title: "ATS Check", desc: "Optimasi dokumen." },
                  { title: "Data Secure", desc: "Privasi terjamin." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 md:gap-4 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all group bg-zinc-900/40">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:text-black transition-all">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs md:text-sm uppercase tracking-tight text-white">{item.title}</div>
                      <div className="text-[10px] md:text-xs text-zinc-500 font-normal">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="team" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-900 to-black border-t border-white/5 snap-start pt-40 pb-24 md:pt-48 md:pb-32">
        <div className="max-w-7xl mx-auto px-5 md:px-8 w-full">
          <div className="text-center space-y-4 mb-16 md:mb-24">
            <h2 className="text-4xl md:text-7xl font-semibold tracking-tight text-white">CVision Team</h2>
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 shadow-sm">
               <span className="text-[10px] md:text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">Capstone CC26-PSU100</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONTRIBUTORS.map((person, idx) => (
              <div key={idx} className="group relative p-6 md:p-8 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-white/20 transition-all duration-300">
                <div className="flex items-start justify-between mb-6 md:mb-8">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl md:text-3xl font-semibold text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                    {person.initials}
                  </div>
                  <div className="text-[9px] md:text-[10px] font-medium text-white/20 uppercase tracking-[0.2em] hidden sm:block">{person.id}</div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-base md:text-2xl font-semibold tracking-tight truncate text-white">{person.name}</h4>
                  <p className="text-[10px] md:text-sm font-medium text-zinc-500 uppercase tracking-[0.2em]">{person.role}</p>
                </div>
                <div className="pt-6 md:pt-10 border-t border-white/5 flex gap-4">
                   <a href="https://github.com/CC26-PSU100" target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">
                     <GithubIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                   </a>
                   <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer text-white"><Mail className="w-4 h-4 md:w-5 md:h-5" /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="min-h-[60vh] flex items-center justify-center snap-start pt-40 pb-24 md:pt-48 md:pb-32 relative overflow-hidden bg-gradient-to-b from-zinc-900 to-black">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-[0.03] invert" />
        
        <div className="max-w-4xl mx-auto px-6 md:px-8 w-full relative z-10 text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-8xl font-semibold tracking-tight leading-[1.1] text-white">
              Siap Mengoptimalkan <br /> Karir Anda?
            </h2>
            <p className="text-base md:text-xl text-zinc-400 font-normal max-w-2xl mx-auto leading-relaxed">
              Gunakan teknologi AI dari CVision untuk menganalisis potensi Anda dan menemukan peluang karir yang paling relevan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-white text-black font-semibold px-10 py-4 rounded-full text-sm md:text-base shadow-lg hover:bg-zinc-200 transition-all group h-auto"
              onClick={() => navigate("/register")}
            >
              Mulai Gunakan CVision
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <button 
              className="w-full sm:w-auto border border-white/10 bg-white/5 backdrop-blur-sm font-semibold px-10 py-4 rounded-full text-sm md:text-base hover:bg-white/10 transition-all cursor-pointer text-white h-auto"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Kembali ke Atas
            </button>
          </div>

          <div className="pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Analisis CV", value: "Akurat" },
              { label: "Sistem AI", value: "Smart" },
              { label: "Keamanan", value: "Tinggi" },
              { label: "Akses", value: "Gratis" }
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="text-xs font-medium uppercase tracking-widest text-zinc-600">{stat.label}</div>
                <div className="text-lg font-semibold text-white">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/[0.02] rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/[0.02] rounded-full blur-[120px]" />
      </section>

      <footer className="py-12 md:py-16 border-t border-white/5 bg-black snap-end">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 md:gap-12">
            <div className="space-y-4 md:space-y-6 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="material-symbols-outlined text-white text-xl md:text-2xl">
                  description
                </span>
                <span className="text-xl md:text-2xl font-semibold tracking-tight text-white">CVision</span>
              </div>
              <p className="max-w-xs text-xs md:text-base text-zinc-500 font-normal leading-relaxed">
                Platform analisis karir berbasis AI. <br className="hidden md:block" />
                Capstone Project CC26-PSU100.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-6 md:gap-8">
              <div className="flex gap-6 md:gap-8 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                <a href="https://github.com/CC26-PSU100" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Repository</a>
                <a href="https://github.com/CC26-PSU100#readme" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Documentation</a>
              </div>
              <p className="text-[10px] md:text-xs font-medium text-zinc-600 uppercase tracking-[0.3em] text-center md:text-right">
                &copy; 2026 Tim Capstone CC26-PSU100.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
