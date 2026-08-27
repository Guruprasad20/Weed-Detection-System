import { useRef, useState } from "react";
import { Glass, PageHeader } from "@/components/Glass";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Upload, MapPin, Loader2, Wind, Battery, Satellite } from "lucide-react";
import { toast } from "sonner";

const DroneMonitoring = () => {
  const ref = useRef<HTMLInputElement>(null);
  const [img, setImg] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);

  const onFile = (f: File) => {
    const r = new FileReader();
    r.onload = () => {
      setImg(r.result as string);
      setScanning(true); setDone(false);
      setTimeout(() => { setScanning(false); setDone(true); toast.success("Aerial scan complete · 14 weed clusters located"); }, 1800);
    };
    r.readAsDataURL(f);
  };

  // synthetic GPS pins
  const pins = Array.from({ length: 12 }, () => ({
    x: 8 + Math.random() * 84, y: 8 + Math.random() * 84, d: Math.random(),
  }));

  return (
    <>
      <PageHeader title="Drone Monitoring" subtitle="Aerial scanning · GPS mapping · weed density estimation" />

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Plane className="w-5 h-5 text-primary" /> Aerial View</CardTitle>
            <CardDescription>{done ? "Scan complete — overlay shows weed density" : scanning ? "Scanning farm…" : "Upload a drone image"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video rounded-lg overflow-hidden border bg-gradient-to-br from-primary/10 to-secondary/10">
              {img ? (
                <>
                  <img src={img} alt="Drone view" className="w-full h-full object-cover" />
                  {scanning && (
                    <>
                      <div className="absolute inset-0 bg-primary/10" />
                      <div className="absolute left-0 right-0 h-1 bg-primary shadow-lg shadow-primary/50"
                        style={{ animation: "scan 1.8s linear infinite", top: "0%" }} />
                      <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    </>
                  )}
                  {done && pins.map((p, i) => (
                    <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 animate-fade-in"
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full animate-ping"
                          style={{ background: p.d > 0.66 ? "hsl(0 70% 60%/50%)" : p.d > 0.33 ? "hsl(35 80% 55%/50%)" : "hsl(145 60% 45%/50%)", width: 18, height: 18 }} />
                        <MapPin className="w-5 h-5 relative" style={{ color: p.d > 0.66 ? "hsl(0 70% 50%)" : p.d > 0.33 ? "hsl(35 80% 45%)" : "hsl(145 60% 35%)" }} />
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                  <Plane className="w-12 h-12 mb-2" />
                  <p className="text-sm">No drone image uploaded</p>
                </div>
              )}
            </div>
            <input ref={ref} hidden type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
            <div className="flex gap-2 mt-4">
              <Button onClick={() => ref.current?.click()}><Upload className="w-4 h-4 mr-2" /> Upload Drone Image</Button>
              <Button variant="outline" onClick={() => toast.info("Initiating autonomous sweep…")}><Satellite className="w-4 h-4 mr-2" /> Auto Sweep</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Glass className="p-5">
            <h3 className="font-heading font-semibold mb-3">Drone Telemetry</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="flex items-center gap-2 text-muted-foreground"><Battery className="w-4 h-4" />Battery</span><span className="font-semibold">76%</span></div>
              <div className="flex justify-between"><span className="flex items-center gap-2 text-muted-foreground"><Wind className="w-4 h-4" />Wind</span><span className="font-semibold">8 km/h</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Altitude</span><span className="font-semibold">42 m</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">GPS</span><span className="font-mono text-xs">12.97°N · 77.59°E</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Coverage</span><span className="font-semibold">3.8 / 4.2 acres</span></div>
            </div>
          </Glass>

          <Glass className="p-5">
            <h3 className="font-heading font-semibold mb-3">Density Legend</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" style={{ color: "hsl(145 60% 35%)" }} /> Low density (0–33%)</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" style={{ color: "hsl(35 80% 45%)" }} /> Medium (33–66%)</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" style={{ color: "hsl(0 70% 50%)" }} /> High (66–100%)</div>
            </div>
          </Glass>
        </div>
      </div>

      <style>{`@keyframes scan { 0% { top: 0% } 50% { top: 100% } 100% { top: 0% } }`}</style>
    </>
  );
};

export default DroneMonitoring;
