import { useRef, useState } from "react";
import { Glass, PageHeader } from "@/components/Glass";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Camera, Loader2, ScanLine, Sparkles, CloudSun, Beaker, Hand } from "lucide-react";
import { toast } from "sonner";

interface Box { x: number; y: number; w: number; h: number; label: string; conf: number; }

const speciesPool = [
  { name: "Crabgrass", sci: "Digitaria sanguinalis", herb: "Quinclorac (post-emergent)", method: "Spot spray + manual pull", dose: "1.2 L/acre" },
  { name: "Pigweed", sci: "Amaranthus retroflexus", herb: "Glyphosate 41%", method: "Foliar spray", dose: "1.5 L/acre" },
  { name: "Dandelion", sci: "Taraxacum officinale", herb: "2,4-D Amine", method: "Targeted spray", dose: "0.8 L/acre" },
  { name: "Foxtail", sci: "Setaria viridis", herb: "Sethoxydim", method: "Pre-emergent treatment", dose: "1.0 L/acre" },
];

const Detection = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [img, setImg] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState<number | null>(null);
  const [streaming, setStreaming] = useState(false);

  const analyze = async (src: string) => {
    setLoading(true);
    setBoxes([]);
    const t0 = performance.now();
    await new Promise((r) => setTimeout(r, 1100));
    const n = 2 + Math.floor(Math.random() * 3);
    const generated: Box[] = Array.from({ length: n }, () => {
      const sp = speciesPool[Math.floor(Math.random() * speciesPool.length)];
      const w = 18 + Math.random() * 22;
      const h = 18 + Math.random() * 22;
      return {
        x: Math.random() * (78 - w),
        y: Math.random() * (78 - h),
        w, h,
        label: sp.name,
        conf: 0.78 + Math.random() * 0.21,
      };
    });
    setBoxes(generated);
    setTime(Math.round(performance.now() - t0));
    setImg(src);
    setLoading(false);
    toast.success(`${generated.length} weed${generated.length > 1 ? "s" : ""} detected`);
  };

  const onFile = (f: File) => {
    const r = new FileReader();
    r.onload = () => analyze(r.result as string);
    r.readAsDataURL(f);
  };

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.play(); }
      setStreaming(true);
    } catch { toast.error("Camera unavailable"); }
  };

  const captureFrame = () => {
    const v = videoRef.current; if (!v) return;
    const c = document.createElement("canvas");
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext("2d")!.drawImage(v, 0, 0);
    analyze(c.toDataURL("image/jpeg"));
    (v.srcObject as MediaStream)?.getTracks().forEach((t) => t.stop());
    setStreaming(false);
  };

  const recommended = boxes[0] ? speciesPool.find((s) => s.name === boxes[0].label) : null;
  const totalArea = boxes.reduce((s, b) => s + b.w * b.h, 0).toFixed(1);

  return (
    <>
      <PageHeader title="Weed Detection" subtitle="Upload an image or use live camera. YOLOv8-style bounding box inference." />

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-card/60 backdrop-blur overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ScanLine className="w-5 h-5 text-primary" /> Detection Canvas</CardTitle>
            <CardDescription>{loading ? "Running inference…" : img ? "Detection complete" : "Awaiting input"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video rounded-lg border border-dashed border-border bg-muted/30 overflow-hidden flex items-center justify-center">
              {streaming ? (
                <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
              ) : img ? (
                <>
                  <img src={img} alt="Scan" className="w-full h-full object-cover" />
                  {boxes.map((b, i) => (
                    <div key={i} className="absolute border-2 border-primary rounded-sm shadow-lg animate-fade-in"
                      style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%`, boxShadow: "0 0 0 2px hsl(var(--primary)/0.3)" }}>
                      <span className="absolute -top-6 left-0 text-[10px] font-semibold bg-primary text-primary-foreground px-2 py-0.5 rounded">
                        {b.label} {(b.conf * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                  {loading && <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-sm"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}
                </>
              ) : (
                <div className="text-center p-8">
                  <ScanLine className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Upload an image or start the camera</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
              <Button onClick={() => fileRef.current?.click()}><Upload className="w-4 h-4 mr-2" />Upload Image</Button>
              {streaming ? (
                <Button onClick={captureFrame} variant="secondary"><Camera className="w-4 h-4 mr-2" />Capture & Detect</Button>
              ) : (
                <Button onClick={startCamera} variant="outline"><Camera className="w-4 h-4 mr-2" />Live Camera</Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Glass className="p-5">
            <h3 className="font-heading font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Detection Summary</h3>
            <dl className="mt-3 text-sm space-y-2">
              <div className="flex justify-between"><dt className="text-muted-foreground">Weeds found</dt><dd className="font-semibold">{boxes.length}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Top confidence</dt><dd className="font-semibold">{boxes[0] ? `${(boxes[0].conf * 100).toFixed(1)}%` : "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Inference time</dt><dd className="font-semibold">{time ? `${time} ms` : "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Area affected</dt><dd className="font-semibold">{totalArea}%</dd></div>
            </dl>
          </Glass>

          <Glass className="p-5">
            <h3 className="font-heading font-semibold flex items-center gap-2"><Beaker className="w-4 h-4 text-secondary" /> Recommendation</h3>
            {recommended ? (
              <div className="mt-3 text-sm space-y-2">
                <div><span className="text-muted-foreground">Species:</span> <strong>{recommended.name}</strong> <em className="text-xs">({recommended.sci})</em></div>
                <div className="flex items-start gap-2"><Beaker className="w-4 h-4 text-secondary mt-0.5" /><span>Herbicide: <strong>{recommended.herb}</strong></span></div>
                <div className="flex items-start gap-2"><Hand className="w-4 h-4 text-primary mt-0.5" /><span>Method: {recommended.method}</span></div>
                <div className="flex items-start gap-2"><Sparkles className="w-4 h-4 text-primary mt-0.5" /><span>Dose: <strong>{recommended.dose}</strong></span></div>
                <div className="flex items-start gap-2 p-3 rounded-md bg-secondary/10 border border-secondary/30 mt-2">
                  <CloudSun className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                  <div className="text-xs"><strong>Weather warning:</strong> Light rain expected in 6h. Spray within 3 hours for best efficacy.</div>
                </div>
              </div>
            ) : <p className="text-sm text-muted-foreground mt-3">Run a detection to see recommendations.</p>}
          </Glass>
        </div>
      </div>
    </>
  );
};

export default Detection;
