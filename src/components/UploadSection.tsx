import { useState, useRef } from "react";
import { Upload, ImageIcon, Loader2, Leaf, AlertTriangle, CheckCircle2, Sparkles, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Reveal from "@/components/Reveal";

interface Candidate {
  common_name: string;
  scientific_name: string;
  confidence: number;
  risk: "Low" | "Medium" | "High";
  description: string;
  treatment: string;
}
interface Result {
  is_weed: boolean;
  summary: string;
  candidates: Candidate[];
}

const UploadSection = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setResult(null);
      setSaved(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleFile(file);
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("classify-weed", {
        body: { image: preview },
      });
      if (error) throw error;
      if (data?.error) {
        if (String(data.error).toLowerCase().includes("rate")) toast.error("Rate limit reached. Try again in a moment.");
        else if (String(data.error).toLowerCase().includes("credit")) toast.error("AI credits exhausted. Add funds in workspace settings.");
        else toast.error(data.error);
        return;
      }
      setResult(data as Result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Classification failed";
      toast.error(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  const riskIcon = (r: string) =>
    r === "High" ? <AlertTriangle className="w-4 h-4 text-destructive" /> :
    r === "Medium" ? <Leaf className="w-4 h-4 text-secondary" /> :
    <CheckCircle2 className="w-4 h-4 text-primary" />;

  return (
    <section id="upload" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Try It</p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">Upload & Detect</h2>
            <p className="mt-4 text-muted-foreground">Upload an image of a weed and our AI vision model will classify it instantly.</p>
          </div>
        </Reveal>

        <div className="max-w-2xl mx-auto">
          <Reveal delay={100}>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-primary/30 rounded-xl bg-card p-12 text-center cursor-pointer hover:border-primary/60 transition-colors group"
            >
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              {preview ? (
                <img src={preview} alt="Uploaded weed" className="max-h-72 mx-auto rounded-lg object-contain" />
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto group-hover:animate-pulse-glow">
                    <ImageIcon className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-foreground">Drop your image here</p>
                    <p className="text-sm text-muted-foreground mt-1">or click to browse — PNG, JPG up to 10MB</p>
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          {preview && !result && (
            <div className="mt-6 text-center">
              <Button onClick={handleAnalyze} disabled={analyzing} size="lg" className="font-heading font-semibold px-10">
                {analyzing ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                {analyzing ? "Analyzing with AI..." : "Classify Weed"}
              </Button>
            </div>
          )}

          {result && (
            <div className="mt-8 bg-card rounded-xl p-6 shadow-card-custom animate-scale-in space-y-6">
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> Classification Results
                </h3>
                <p className="text-sm text-muted-foreground mt-2">{result.summary}</p>
              </div>

              <div className="space-y-4">
                {result.candidates.map((c, i) => (
                  <div key={i} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      {riskIcon(c.risk)}
                      <div className="flex-1">
                        <div className="font-heading font-semibold text-foreground">{c.common_name}</div>
                        <div className="text-xs italic text-muted-foreground">{c.scientific_name}</div>
                      </div>
                      <span className="text-sm font-semibold text-primary">{Math.round(c.confidence)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${c.confidence}%` }} />
                    </div>
                    <p className="text-sm text-muted-foreground">{c.description}</p>
                    <div className="text-xs bg-accent/40 text-accent-foreground rounded-md px-3 py-2">
                      <span className="font-semibold">Treatment:</span> {c.treatment}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {user ? (
                  <Button
                    variant="default"
                    disabled={saving || saved}
                    onClick={async () => {
                      if (!result || !preview) return;
                      setSaving(true);
                      const top = result.candidates?.[0];
                      const { error } = await supabase.from("classifications").insert({
                        user_id: user.id,
                        image_preview: preview,
                        top_common_name: top?.common_name || "Unknown",
                        top_scientific_name: top?.scientific_name || null,
                        top_confidence: top?.confidence ?? null,
                        risk: top?.risk || null,
                        is_weed: result.is_weed,
                        summary: result.summary,
                        result_json: result as never,
                      });
                      setSaving(false);
                      if (error) { toast.error(error.message); return; }
                      setSaved(true);
                      toast.success("Saved to your history");
                    }}
                    className="flex-1"
                  >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {saved ? "Saved ✓" : "Save to History"}
                  </Button>
                ) : (
                  <Button variant="default" asChild className="flex-1">
                    <Link to="/auth"><Save className="w-4 h-4 mr-2" /> Sign in to save</Link>
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => { setPreview(null); setResult(null); setSaved(false); }}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" /> Classify Another
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
