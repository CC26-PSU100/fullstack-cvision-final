import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { api } from "@/services/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.login(formData.email, formData.password);

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success(`Welcome back, ${response.data.user.name}!`);
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background">

      <div className="hidden lg:flex lg:w-1/2 relative bg-card overflow-hidden items-center justify-center p-12 border-r border-white/5">

        <div className="absolute top-0 left-0 w-full h-full opacity-40">
           <div className="absolute top-[-10%] left-[-10%] w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl" />
           <div className="absolute bottom-[-10%] right-[-10%] w-full h-full bg-gradient-to-tl from-white/5 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
           <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center shadow-2xl">
              <span className="material-symbols-outlined text-background text-3xl font-black">auto_awesome</span>
           </div>
           <div className="space-y-4">
              <h2 className="text-5xl font-bold tracking-tighter text-foreground leading-[1.1]">
                Optimalkan <br/> Karier Anda <span className="text-foreground/40 italic">Bersama Kami.</span>
              </h2>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                Gunakan CVision untuk analisis mendalam CV Anda atau temukan kandidat terbaik dengan teknologi AI tercanggih.
              </p>
           </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-700">
        <div className="w-full max-w-[420px] space-y-10">

          <div className="lg:hidden flex flex-col items-center text-center space-y-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
              <span className="material-symbols-outlined text-foreground text-3xl">auto_awesome</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Selamat datang kembali</h1>
            <p className="text-base text-muted-foreground font-medium">Masuk untuk melanjutkan ke akun Anda.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Alamat Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@contoh.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-2xl bg-muted/20 border-border/40 h-14 focus:ring-white/10 font-medium px-5"
              />
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Kata Sandi</Label>
                <Link to="#" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">Lupa Kata Sandi?</Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="rounded-2xl bg-muted/20 border-border/40 h-14 focus:ring-white/10 font-medium px-5"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4.5 rounded-2xl bg-foreground text-background text-sm font-black shadow-2xl transition-all duration-300 active:opacity-90 uppercase tracking-[0.2em] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Masuk..." : "Masuk"}
            </button>
          </form>

          <p className="text-center text-sm font-medium text-muted-foreground pt-4">
            Belum punya akun?{" "}
            <Link to="/register" className="text-foreground font-black hover:underline transition-all">Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
