import { Upload, Cpu, BarChart3, CheckCircle } from "lucide-react";

const steps = [
  { icon: Upload, title: "Upload Image", desc: "Take or upload a photo of the weed from your field or garden." },
  { icon: Cpu, title: "ML Processing", desc: "Our CNN model analyzes texture, shape, and color features." },
  { icon: BarChart3, title: "Classification", desc: "The model classifies the weed species with confidence scores." },
  { icon: CheckCircle, title: "Get Results", desc: "Receive identification, risk level, and recommended treatment." },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Process</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">How It Works</h2>
          <p className="mt-4 text-muted-foreground">Our machine learning pipeline processes images in real-time for accurate weed identification.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="relative group">
              <div className="bg-card rounded-xl p-8 shadow-card-custom hover:shadow-elevated-custom transition-shadow duration-300 text-center h-full">
                <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mx-auto mb-5">
                  <s.icon className="w-7 h-7 text-accent-foreground" />
                </div>
                <span className="text-xs font-bold text-primary/50 font-heading">STEP {i + 1}</span>
                <h3 className="font-heading text-lg font-semibold text-foreground mt-1 mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
