import { useState } from "react";
import { Glass, PageHeader } from "@/components/Glass";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, FileText } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { toast } from "sonner";

const daily = Array.from({ length: 7 }, (_, i) => ({ d: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i], detections: 18 + Math.round(Math.random() * 25), sprayed: 6 + Math.round(Math.random() * 12) }));
const weekly = Array.from({ length: 8 }, (_, i) => ({ d: `W${i + 1}`, detections: 120 + Math.round(Math.random() * 80) }));
const monthly = ["Jan","Feb","Mar","Apr","May","Jun"].map((m) => ({ d: m, detections: 400 + Math.round(Math.random() * 300) }));

const recent = [
  { d: "2026-05-09 09:14", field: "A-12", species: "Crabgrass", conf: 96, action: "Sprayed" },
  { d: "2026-05-09 08:42", field: "B-04", species: "Pigweed", conf: 92, action: "Manual" },
  { d: "2026-05-08 16:21", field: "A-08", species: "Dandelion", conf: 88, action: "Sprayed" },
  { d: "2026-05-08 11:03", field: "C-15", species: "Foxtail", conf: 81, action: "Pending" },
  { d: "2026-05-07 14:55", field: "B-09", species: "Bindweed", conf: 90, action: "Sprayed" },
];

const Reports = () => {
  const [period, setPeriod] = useState("daily");
  const data = period === "daily" ? daily : period === "weekly" ? weekly : monthly;

  const exportCSV = () => {
    const csv = ["Datetime,Field,Species,Confidence,Action", ...recent.map((r) => `${r.d},${r.field},${r.species},${r.conf}%,${r.action}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "weedvision-report.csv"; a.click();
    toast.success("Report downloaded");
  };

  return (
    <>
      <PageHeader title="Reports" subtitle="Daily · weekly · monthly summaries"
        right={<Button onClick={exportCSV}><Download className="w-4 h-4 mr-2" /> Export CSV</Button>} />

      <Tabs value={period} onValueChange={setPeriod}>
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        <TabsContent value={period} className="mt-4">
          <Card className="bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle>{period[0].toUpperCase() + period.slice(1)} Detections</CardTitle>
              <CardDescription>Detections vs sprayed actions</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer>
                {period === "daily" ? (
                  <BarChart data={daily}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="d" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Bar dataKey="detections" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="sprayed" fill="hsl(var(--secondary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="d" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Line type="monotone" dataKey="detections" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-4 bg-card/60 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Recent Detections</CardTitle>
          <CardDescription>Last 5 events across monitored fields</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground border-b">
                <tr><th className="py-2 px-2">Datetime</th><th className="py-2 px-2">Field</th><th className="py-2 px-2">Species</th><th className="py-2 px-2">Conf.</th><th className="py-2 px-2">Action</th></tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.d} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-2 px-2 font-mono text-xs">{r.d}</td>
                    <td className="py-2 px-2">{r.field}</td>
                    <td className="py-2 px-2">{r.species}</td>
                    <td className="py-2 px-2 font-semibold text-primary">{r.conf}%</td>
                    <td className="py-2 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${r.action === "Sprayed" ? "bg-primary/15 text-primary" : r.action === "Pending" ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"}`}>{r.action}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Reports;
