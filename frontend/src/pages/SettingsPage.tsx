import { Header } from "@/components/layout/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

export default function SettingsPage() {
   const navigate = useNavigate();
   const [user, setUser] = useState<any>(null);
   const [formData, setFormData] = useState({
      name: "",
      email: "",
      username: "",
      phone: "",
      bio: "",
   });

   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
   const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

   useEffect(() => {
      const userJson = localStorage.getItem("user");
      if (userJson) {
         const userData = JSON.parse(userJson);
         setUser(userData);
         setFormData({
            name: userData.name || "",
            email: userData.email || "",
            username: userData.username || userData.email?.split("@")[0] || "",
            phone: userData.phone || "+1 (555) 000-0000",
            bio:
               userData.bio ||
               "Passionate full stack developer and tech enthusiast. I love building minimal and high-impact user interfaces.",
         });
      }
   }, []);

   const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
   ) => {
      const { id, value } = e.target;
      setFormData((prev) => ({ ...prev, [id]: value }));
   };

   const handleSave = () => {
      const updatedUser = { ...user, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success("Profil berhasil diperbarui!");
   };

   const handleLogout = () => {
      setIsLogoutModalOpen(false);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      toast.success("Berhasil keluar");
      navigate("/login");
   };

   const handleDeleteAccount = () => {
      setIsDeleteAccountModalOpen(false);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      toast.success("Akun berhasil dihapus secara permanen");
      navigate("/login");
   };

   const initials = formData.name
      ? formData.name
           .split(" ")
           .map((n: any) => n[0])
           .join("")
           .toUpperCase()
           .slice(0, 2)
      : "??";

   return (
      <div className="min-h-full flex flex-col selection:bg-primary/20">
         <Header title="Pengaturan" />

         <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
            <div className="max-w-4xl mx-auto space-y-8">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                     <h2 className="text-3xl font-bold tracking-tight text-foreground">
                        Pengaturan akun
                     </h2>
                     <p className="text-sm text-muted-foreground">
                        Kelola informasi pribadi dan status akun Anda.
                     </p>
                  </div>
                  <button
                     onClick={() => setIsLogoutModalOpen(true)}
                     className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-sm bg-red-950/30 border border-red-500/20 text-red-500 text-sm font-semibold hover:bg-red-950/70 hover:text-red-400 transition-colors duration-200 cursor-pointer"
                  >
                     <span className="material-symbols-outlined text-lg">
                        logout
                     </span>
                     Keluar
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <nav className="space-y-1">
                     <button className="w-full flex items-center gap-3 px-4 py-3 rounded-sm bg-primary/10 text-primary text-sm font-semibold text-left cursor-pointer">
                        <span className="material-symbols-outlined text-xl">
                           person
                        </span>
                        Profil
                     </button>
                  </nav>

                  <div className="md:col-span-2 space-y-6">
                     <Card className="rounded-lg border border-border shadow-md overflow-hidden bg-card">
                        <CardContent className="p-0">
                           <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />

                           <div className="px-6 pb-6">
                              <div className="relative -mt-12 mb-6 flex flex-col sm:flex-row sm:items-end gap-4">
                                 <div className="relative">
                                    <Avatar
                                       className="h-24 w-24 ring-4 ring-background shadow-xl rounded-sm"
                                       size="lg"
                                    >
                                       <AvatarImage src="" className="rounded-sm" />
                                       <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold rounded-sm">
                                          {initials}
                                       </AvatarFallback>
                                    </Avatar>
                                 </div>

                                 <div className="mb-2">
                                    <h3 className="text-xl font-bold text-foreground">
                                       {formData.name || "Nama pengguna"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                       {formData.email}
                                    </p>
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                 <div className="space-y-2">
                                    <Label htmlFor="name" className="text-xs font-semibold text-muted-foreground">Nama lengkap</Label>
                                    <Input
                                       id="name"
                                       value={formData.name}
                                       onChange={handleInputChange}
                                       className="rounded-sm"
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="username" className="text-xs font-semibold text-muted-foreground">Username</Label>
                                    <Input
                                       id="username"
                                       value={formData.username}
                                       onChange={handleInputChange}
                                       className="rounded-sm"
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">Alamat email</Label>
                                    <Input
                                       id="email"
                                       type="email"
                                       value={formData.email}
                                       onChange={handleInputChange}
                                       className="rounded-sm"
                                       disabled
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-xs font-semibold text-muted-foreground">Nomor telepon</Label>
                                    <Input
                                       id="phone"
                                       value={formData.phone}
                                       onChange={handleInputChange}
                                       className="rounded-sm"
                                    />
                                 </div>
                                 <div className="sm:col-span-2 space-y-2">
                                    <Label htmlFor="bio" className="text-xs font-semibold text-muted-foreground">Bio</Label>
                                    <textarea
                                       id="bio"
                                       value={formData.bio}
                                       onChange={handleInputChange}
                                       rows={4}
                                       className="w-full rounded-sm bg-background border border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
                                    />
                                 </div>
                              </div>

                              <div className="flex justify-end mt-8">
                                 <button
                                    onClick={handleSave}
                                    className="px-8 py-2.5 rounded-sm bg-primary text-primary-foreground font-bold shadow-md hover:opacity-90 transition-opacity duration-200 cursor-pointer border border-border"
                                  >
                                    Simpan profil
                                 </button>
                              </div>
                           </div>
                        </CardContent>
                     </Card>

                     <Card className="rounded-lg border border-border shadow-md bg-card">
                        <div className="px-6 py-4 border-b border-border">
                           <h3 className="text-lg font-bold">Keamanan akun</h3>
                        </div>
                        <CardContent className="p-6">
                           <button
                              onClick={() =>
                                 toast.info(
                                    "Tautan reset kata sandi telah dikirim ke email Anda.",
                                 )
                              }
                              className="w-full flex items-center justify-between p-4 rounded-sm bg-muted/30 border border-border hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
                           >
                              <div className="flex items-center gap-3">
                                 <span className="material-symbols-outlined text-primary text-xl">
                                    lock
                                 </span>
                                 <div className="text-left">
                                    <p className="text-sm font-bold">
                                       Ubah kata sandi
                                    </p>
                                 </div>
                              </div>
                              <span className="material-symbols-outlined text-muted-foreground text-xl">
                                 chevron_right
                              </span>
                           </button>
                        </CardContent>
                     </Card>

                     <Card className="rounded-lg border border-destructive/20 bg-destructive/5 overflow-hidden">
                        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                           <div className="space-y-1">
                              <h4 className="font-bold text-destructive text-sm">
                                 Zona bahaya
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                 Hapus akun dan seluruh data Anda secara permanen.
                              </p>
                           </div>
                           <button
                              onClick={() => setIsDeleteAccountModalOpen(true)}
                              className="px-4 py-2 rounded-sm bg-red-950/30 border border-red-500/20 text-red-500 text-xs font-bold hover:bg-red-950/70 hover:text-red-400 transition-colors duration-200 cursor-pointer"
                           >
                              Hapus akun
                           </button>
                        </CardContent>
                     </Card>
                  </div>
               </div>
            </div>
         </main>

         <ConfirmationModal
            isOpen={isLogoutModalOpen}
            title="Konfirmasi keluar"
            message="Apakah Anda yakin ingin keluar dari akun Anda?"
            confirmText="Keluar"
            cancelText="Batal"
            onConfirm={handleLogout}
            onCancel={() => setIsLogoutModalOpen(false)}
         />

         <ConfirmationModal
            isOpen={isDeleteAccountModalOpen}
            title="Konfirmasi hapus akun"
            message="Apakah Anda yakin ingin menghapus akun Anda secara permanen? Semua data penguraian CV Anda akan hilang selamanya dan tindakan ini tidak dapat dibatalkan."
            confirmText="Hapus akun"
            cancelText="Batal"
            onConfirm={handleDeleteAccount}
            onCancel={() => setIsDeleteAccountModalOpen(false)}
         />
      </div>
   );
}
