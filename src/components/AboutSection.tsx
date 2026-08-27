import { Brain, Database, Globe, ShieldCheck } from "lucide-react";

const features = [
  { icon: Brain, title: "Deep Learning", desc: "Convolutional Neural Networks trained on thousands of labeled weed images for high accuracy." },
  { icon: Database, title: "SQLite3 Backend", desc: "Lightweight database storing classification history, user uploads, and model metadata." },
  { icon: Globe, title: "Web Accessible", desc: "Responsive HTML/CSS/JS frontend accessible from any device — desktop, tablet, or mobile." },
  { icon: ShieldCheck, title: "Python Powered", desc: "Built with Python, TensorFlow/Keras for ML, and Flask for the backend API server." },
];

const AboutSection = () => (
  <section id="about" className="py-24">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Technology</p>
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">About the Project</h2>
        <p className="mt-4 text-muted-foreground">
          WeedVision AI combines machine learning with web technologies to help farmers and researchers identify invasive weed species quickly and accurately.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {features.map((f) => (
          <div key={f.title} className="flex gap-5 bg-card rounded-xl p-6 shadow-card-custom">
            <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
              <f.icon className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
