import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    bio: ""
  });

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      const userData = JSON.parse(userJson);
      setUser(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        username: userData.username || userData.email?.split('@')[0] || "",
        phone: userData.phone || "+1 (555) 000-0000",
        bio: userData.bio || "Passionate full stack developer and tech enthusiast. I love building minimal and high-impact user interfaces."
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    toast.success("Profil berhasil diperbarui!");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    toast.success("Berhasil keluar");
    navigate("/login");
  };

  const initials = formData.name
    ? formData.name.split(' ').map((n: any) => n[0]).join('').toUpperCase().slice(0, 2)
    : "??";

  return (
    <div className="min-h-full flex flex-col selection:bg-primary/20">
      <Header title="Pengaturan" />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="max-w-4xl mx-auto space-y-8">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Pengaturan Akun
              </h2>
              <p className="text-muted-foreground">
                Kelola informasi pribadi dan status akun Anda.
              </p>
            </div>
            <button 
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold hover:bg-destructive/20 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              Keluar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <nav className="space-y-1">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary text-sm font-semibold text-left">
                <span className="material-symbols-outlined text-xl">person</span>
                Profil
              </button>
            </nav>

            <div className="md:col-span-2 space-y-6">
              <Card className="rounded-3xl border-border/40 shadow-sm overflow-hidden">
                <CardContent className="p-0">

                  <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />

                  <div className="px-6 pb-6">
                    <div className="relative -mt-12 mb-6 flex flex-col sm:flex-row sm:items-end gap-4">
                      <div className="relative">
                        <Avatar className="h-24 w-24 ring-4 ring-background shadow-xl" size="lg">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="mb-2">
                        <h3 className="text-xl font-bold text-foreground">{formData.name || "Nama Pengguna"}</h3>
                        <p className="text-sm text-muted-foreground">{formData.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input 
                          id="name" 
                          value={formData.name} 
                          onChange={handleInputChange}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username" 
                          value={formData.username} 
                          onChange={handleInputChange}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Alamat Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={handleInputChange}
                          className="rounded-xl"
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        <Input 
                          id="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                          id="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full rounded-xl bg-background border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-8">
                      <button 
                        onClick={handleSave}
                        className="px-8 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        Simpan Profil
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border/40 shadow-sm">
                <div className="px-6 py-4 border-b border-border/40">
                  <h3 className="text-lg font-bold">Keamanan Akun</h3>
                </div>
                <CardContent className="p-6">
                  <button 
                    onClick={() => toast.info("Tautan reset kata sandi telah dikirim ke email Anda.")}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-background border border-border/40 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">lock</span>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold">Ubah Kata Sandi</p>
                        <p className="text-xs text-muted-foreground">Terima tautan aman untuk memperbarui kata sandi Anda</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-muted-foreground">chevron_right</span>
                  </button>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-destructive/20 bg-destructive/5 overflow-hidden">
                <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-destructive text-sm uppercase tracking-wider">Zona Bahaya</h4>
                    <p className="text-sm text-muted-foreground">Hapus akun dan semua data Anda secara permanen.</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (confirm("Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.")) {
                        handleLogout();
                      }
                    }}
                    className="px-4 py-2 rounded-xl border border-destructive/30 text-destructive text-xs font-bold hover:bg-destructive/10 transition-colors"
                  >
                    Hapus Akun
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}