import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.register(formData);

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success(`Akun berhasil dibuat! Selamat datang, ${response.data.user.name}!`);
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (error: any) {
      toast.error(error.message || "Pendaftaran gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 relative bg-card overflow-hidden items-center justify-center p-12 border-r border-border">
        <div className="absolute top-0 left-0 w-full h-full opacity-40">
           <div className="absolute top-[-10%] right-[-10%] w-full h-full bg-gradient-to-bl from-white/10 to-transparent rounded-lg blur-3xl" />
           <div className="absolute bottom-[-10%] left-[-10%] w-full h-full bg-gradient-to-tr from-white/5 to-transparent rounded-lg blur-3xl" />
        </div>

        <div className="relative z-10 max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
           <span className="material-symbols-outlined text-[64px] text-foreground">
             description
           </span>
           <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight text-foreground leading-[1.1]">
                Buka <span className="text-foreground/40 italic">peluang baru</span> <br/> dalam karier Anda.
              </h2>
              <p className="text-base text-muted-foreground font-medium leading-relaxed">
                Daftar sekarang untuk mendapatkan wawasan berbasis AI yang membantu Anda menonjol di pasar kerja atau mempercepat pencarian bakat.
              </p>
           </div>

           <div className="pt-8 space-y-4">
              <div className="flex items-center gap-3">
                 <span className="material-symbols-outlined text-foreground text-[20px] leading-none">check</span>
                 <p className="text-sm font-bold text-foreground/80">Wawasan skor kecocokan AI</p>
              </div>
              <div className="flex items-center gap-3">
                 <span className="material-symbols-outlined text-foreground text-[20px] leading-none">check</span>
                 <p className="text-sm font-bold text-foreground/80">Analisis keahlian mendalam</p>
              </div>
           </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-700">
        <div className="w-full max-w-[420px] space-y-10">
          <div className="lg:hidden flex flex-col items-center text-center space-y-4 mb-8">
            <span className="material-symbols-outlined text-4xl text-foreground">
              description
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Mulai sekarang</h1>
            <p className="text-sm text-muted-foreground font-medium">Buat akun Anda untuk melanjutkan.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2.5">
              <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground ml-1">Nama lengkap</Label>
              <Input
                id="name"
                placeholder="Jane Doe"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-sm bg-muted/20 border-border h-14 focus:ring-white/10 font-medium px-5"
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground ml-1">Alamat email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@contoh.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-sm bg-muted/20 border-border h-14 focus:ring-white/10 font-medium px-5"
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground ml-1">Buat kata sandi</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="rounded-sm bg-muted/20 border-border h-14 focus:ring-white/10 font-medium px-5"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4.5 rounded-sm bg-foreground text-background text-sm font-bold shadow-md hover:opacity-90 transition-opacity duration-200 mt-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? "Membuat akun..." : "Daftar"}
            </button>
          </form>

          <p className="text-center text-sm font-medium text-muted-foreground pt-4">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-foreground font-bold hover:underline transition-all cursor-pointer">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
