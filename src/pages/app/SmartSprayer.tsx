import { useEffect, useState } from "react";
import { Glass, PageHeader } from "@/components/Glass";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Droplets, Power, Wifi, Cpu, Gauge, Zap, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const SmartSprayer = () => {
  const [on, setOn] = useState(false);
  const [tank, setTank] = useState(72);
  const [pressure, setPressure] = useState(45);
  const [rate, setRate] = useState([1.2]);
  const [connected] = useState(true);

  useEffect(() => {
    if (!on) return;
    const t = setInterval(() => {
      setTank((v) => Math.max(0, +(v - rate[0] * 0.1).toFixed(1)));
      setPressure(40 + Math.round(Math.random() * 15));
    }, 1000);
    return () => clearInterval(t);
  }, [on, rate]);

  const toggle = () => {
    if (!on && tank < 5) return toast.error("Tank empty — refill required");
    setOn(!on);
    toast.success(`Sprayer ${!on ? "STARTED" : "STOPPED"}`);
  };

  return (
    <>
      <PageHeader title="IoT Smart Sprayer" subtitle="ESP32-controlled precision sprayer · MQTT live link" />

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2"><Droplets className="w-5 h-5 text-primary" /> Sprayer Control</span>
              <span className={`flex items-center gap-1 text-xs font-semibold ${connected ? "text-primary" : "text-destructive"}`}>
                <Wifi className="w-3 h-3" /> {connected ? "ESP32 Online" : "Offline"}
              </span>
            </CardTitle>
            <CardDescription>Status: <strong className={on ? "text-primary" : "text-muted-foreground"}>{on ? "SPRAYING" : "IDLE"}</strong></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-56 rounded-xl border border-border bg-gradient-to-b from-accent/40 to-background flex items-center justify-center overflow-hidden">
              <div className={`relative w-32 h-32 rounded-full border-4 ${on ? "border-primary animate-pulse" : "border-muted"}`}>
                <div className="absolute inset-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Droplets className={`w-12 h-12 ${on ? "text-primary" : "text-muted-foreground"}`} />
                </div>
              </div>
              {on && (
                <>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i}
                      className="absolute w-1.5 h-1.5 rounded-full bg-primary/70 animate-fade-in"
                      style={{
                        left: `${50 + (i - 2) * 6}%`, top: "60%",
                        animation: `fade-in 1.2s ease-out ${i * 0.15}s infinite`,
                      }}
                    />
                  ))}
                </>
              )}
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card/40">
                <div>
                  <div className="text-sm font-semibold flex items-center gap-2"><Power className="w-4 h-4" /> Pump</div>
                  <div className="text-xs text-muted-foreground">Master switch</div>
                </div>
                <Switch checked={on} onCheckedChange={toggle} />
              </div>
              <Button size="lg" variant={on ? "destructive" : "default"} onClick={toggle} className="h-auto py-4">
                <Power className="w-5 h-5 mr-2" /> {on ? "Stop Spray" : "Start Spray"}
              </Button>
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold text-muted-foreground">Flow rate: {rate[0].toFixed(1)} L/min</label>
              <Slider value={rate} onValueChange={setRate} min={0.2} max={3} step={0.1} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Glass className="p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground"><Droplets className="w-4 h-4" /> Tank Level</span>
              <span className="font-semibold">{tank}%</span>
            </div>
            <div className="relative h-32 mt-3 rounded-lg border bg-muted/30 overflow-hidden">
              <div className="absolute bottom-0 inset-x-0 transition-all bg-gradient-to-t from-primary to-primary/50"
                style={{ height: `${tank}%` }}>
                <div className="h-1 bg-white/30 animate-pulse" />
              </div>
            </div>
            {tank < 20 && <p className="text-xs text-destructive flex items-center gap-1 mt-2"><AlertTriangle className="w-3 h-3" /> Low tank — refill soon</p>}
          </Glass>

          <Glass className="p-5 space-y-3">
            <div className="flex justify-between text-sm"><span className="flex items-center gap-2 text-muted-foreground"><Gauge className="w-4 h-4" />Pressure</span><span className="font-semibold">{pressure} PSI</span></div>
            <div className="flex justify-between text-sm"><span className="flex items-center gap-2 text-muted-foreground"><Cpu className="w-4 h-4" />Controller</span><span className="font-semibold">ESP32-WROOM</span></div>
            <div className="flex justify-between text-sm"><span className="flex items-center gap-2 text-muted-foreground"><Zap className="w-4 h-4" />Battery</span><span className="font-semibold">87%</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Firmware</span><span className="font-semibold">v2.4.1</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">MQTT topic</span><code className="text-xs">farm/sprayer/01</code></div>
          </Glass>
        </div>
      </div>
    </>
  );
};

export default SmartSprayer;
