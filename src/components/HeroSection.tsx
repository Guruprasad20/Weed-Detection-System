import { ArrowDown, Scan, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-field.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Agricultural field aerial view" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground animate-fade-up">
            <Zap className="w-4 h-4" />
            Powered by Machine Learning
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold text-primary-foreground leading-tight animate-fade-up" style={{ animationDelay: "0.15s" }}>
            Detect & Classify <br />
            <span className="text-sunshine">Weeds Instantly</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl mx-auto animate-fade-up" style={{ animationDelay: "0.3s" }}>
            AI-powered weed detection for precision agriculture. Upload an image and get instant classification results using deep learning models.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.45s" }}>
            <Button asChild size="lg" className="bg-sunshine text-soil hover:bg-sunshine/90 font-heading font-semibold text-base px-8">
              <a href="#upload">
                <Scan className="w-5 h-5 mr-2" />
                Upload Image
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-heading font-semibold text-base px-8">
              <a href="#how-it-works">Learn More</a>
            </Button>
          </div>
        </div>

        <a href="#how-it-works" className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary-foreground/60 animate-bounce">
          <ArrowDown className="w-6 h-6" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
