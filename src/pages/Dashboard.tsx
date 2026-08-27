import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, LogOut, Loader2, Trash2, Sparkles, BarChart3, Image as ImgIcon, AlertTriangle, ShieldCheck, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

interface Row {
  id: string;
  image_preview: string | null;
  top_common_name: string;
  top_scientific_name: string | null;
  top_confidence: number | null;
  risk: string | null;
  is_weed: boolean | null;
  summary: string | null;
  created_at: string;
}

const RISK_COLORS: Record<string, string> = {
  Low: "hsl(var(--primary))",
  Medium: "hsl(var(--secondary))",
  High: "hsl(var(--destructive))",
  Unknown: "hsl(var(--muted-foreground))",
};

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const [{ data: classifications }, { data: profile }] = await Promise.all([
        supabase.from("classifications").select("id,image_preview,top_common_name,top_scientific_name,top_confidence,risk,is_weed,summary,created_at").order("created_at", { ascending: false }),
        supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle(),
      ]);
      setRows(classifications ?? []);
      setDisplayName(profile?.display_name ?? user.email?.split("@")[0] ?? "");
      setLoading(false);
    };
    load();
  }, [user]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("classifications").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setRows((r) => r.filter((x) => x.id !== id));
    toast.success("Deleted");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  // Analytics
  const total = rows.length;
  const weeds = rows.filter((r) => r.is_weed).length;
  const avgConf = total ? Math.round(rows.reduce((s, r) => s + (Number(r.top_confidence) || 0), 0) / total) : 0;
  const highRisk = rows.filter((r) => r.risk === "High").length;

  const speciesCounts = rows.reduce<Record<string, number>>((acc, r) => {
    const k = r.top_common_name || "Unknown";
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const speciesData = Object.entries(speciesCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const riskData = ["Low", "Medium", "High"].map((k) => ({
    name: k,
    value: rows.filter((r) => r.risk === k).length,
  })).filter((d) => d.value > 0);

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-card/80 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto h-16 flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-primary">
            <Leaf className="w-6 h-6" /> WeedVision AI
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">Hi, <strong className="text-foreground">{displayName}</strong></span>
            <Button variant="ghost" asChild size="sm"><Link to="/#upload">New Scan</Link></Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-10">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Your classification history and personal analytics.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Activity className="w-5 h-5" />} label="Total Scans" value={total} />
          <StatCard icon={<Sparkles className="w-5 h-5" />} label="Weeds Detected" value={weeds} />
          <StatCard icon={<ShieldCheck className="w-5 h-5" />} label="Avg Confidence" value={`${avgConf}%`} />
          <StatCard icon={<AlertTriangle className="w-5 h-5" />} label="High Risk" value={highRisk} accent="destructive" />
        </div>

        {/* Charts */}
        {total > 0 && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" /> Top Species</CardTitle>
                <CardDescription>Most frequently classified species in your history</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={speciesData}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip cursor={{ fill: "hsl(var(--muted))" }} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-secondary" /> Risk Distribution</CardTitle>
                <CardDescription>Breakdown by agricultural threat level</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={riskData} dataKey="value" nameKey="name" outerRadius={90} label>
                      {riskData.map((d) => <Cell key={d.name} fill={RISK_COLORS[d.name]} />)}
                    </Pie>
                    <Legend />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* History */}
        <div>
          <h2 className="font-heading text-2xl font-bold mb-4">Classification History</h2>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : rows.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <ImgIcon className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No classifications yet. <Link to="/#upload" className="text-primary underline">Run your first scan</Link>.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rows.map((r) => (
                <Card key={r.id} className="overflow-hidden">
                  {r.image_preview && <img src={r.image_preview} alt={r.top_common_name} className="w-full h-40 object-cover" loading="lazy" />}
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-heading font-semibold">{r.top_common_name}</div>
                        <div className="text-xs italic text-muted-foreground">{r.top_scientific_name}</div>
                      </div>
                      <span className="text-xs font-semibold text-primary whitespace-nowrap">{Math.round(Number(r.top_confidence) || 0)}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: `${RISK_COLORS[r.risk || "Unknown"]}20`, color: RISK_COLORS[r.risk || "Unknown"] }}>
                        {r.risk || "Unknown"} risk
                      </span>
                      <span className="text-muted-foreground">{format(new Date(r.created_at), "MMM d, yyyy")}</span>
                    </div>
                    {r.summary && <p className="text-xs text-muted-foreground line-clamp-2">{r.summary}</p>}
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(r.id)} className="text-destructive hover:text-destructive w-full">
                      <Trash2 className="w-3 h-3 mr-2" /> Delete
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string | number; accent?: "destructive" }) => (
  <Card>
    <CardContent className="p-4">
      <div className={`flex items-center gap-2 text-sm ${accent === "destructive" ? "text-destructive" : "text-muted-foreground"}`}>
        {icon} {label}
      </div>
      <div className="font-heading text-3xl font-bold mt-2">{value}</div>
    </CardContent>
  </Card>
);

export default Dashboard;
