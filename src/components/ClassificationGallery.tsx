import { Badge } from "@/components/ui/badge";
import dandelion from "@/assets/weed-dandelion.jpg";
import crabgrass from "@/assets/weed-crabgrass.jpg";
import chickweed from "@/assets/weed-chickweed.jpg";
import purslane from "@/assets/weed-purslane.jpg";
import thistle from "@/assets/weed-thistle.jpg";
import bindweed from "@/assets/weed-bindweed.jpg";

const weeds = [
  { name: "Dandelion", scientific: "Taraxacum officinale", risk: "Medium", img: dandelion, desc: "Common perennial weed with yellow flowers and deep taproots." },
  { name: "Crabgrass", scientific: "Digitaria sanguinalis", risk: "High", img: crabgrass, desc: "Aggressive annual grass that spreads rapidly in warm seasons." },
  { name: "Chickweed", scientific: "Stellaria media", risk: "Low", img: chickweed, desc: "Low-growing annual with small white flowers, common in cool weather." },
  { name: "Purslane", scientific: "Portulaca oleracea", risk: "Low", img: purslane, desc: "Succulent annual that thrives in hot, dry conditions." },
  { name: "Thistle", scientific: "Cirsium arvense", risk: "High", img: thistle, desc: "Perennial with spiny leaves and deep root systems, very invasive." },
  { name: "Bindweed", scientific: "Convolvulus arvensis", risk: "High", img: bindweed, desc: "Twining perennial vine, extremely difficult to eradicate." },
];

const riskColor = (r: string) =>
  r === "High" ? "bg-destructive text-destructive-foreground" :
  r === "Medium" ? "bg-secondary text-secondary-foreground" :
  "bg-accent text-accent-foreground";

const ClassificationGallery = () => {
  return (
    <section id="classification" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Database</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">Weed Classification</h2>
          <p className="mt-4 text-muted-foreground">Our model can identify and classify the following weed species with high accuracy.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {weeds.map((w) => (
            <div key={w.name} className="bg-card rounded-xl overflow-hidden shadow-card-custom hover:shadow-elevated-custom transition-all duration-300 group hover:-translate-y-1">
              <div className="aspect-square overflow-hidden">
                <img src={w.img} alt={w.name} loading="lazy" width={640} height={640} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading text-lg font-semibold text-foreground">{w.name}</h3>
                  <Badge className={riskColor(w.risk)}>{w.risk} Risk</Badge>
                </div>
                <p className="text-xs text-primary italic mb-2">{w.scientific}</p>
                <p className="text-sm text-muted-foreground">{w.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClassificationGallery;
