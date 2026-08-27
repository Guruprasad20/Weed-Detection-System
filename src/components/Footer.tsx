import { Leaf } from "lucide-react";

const Footer = () => (
  <footer className="bg-forest py-12">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-primary-foreground font-heading font-bold text-lg">
          <Leaf className="w-5 h-5" />
          WeedVision AI
        </div>
        <div className="flex gap-6 text-sm text-primary-foreground/60">
          <a href="#home" className="hover:text-primary-foreground transition-colors">Home</a>
          <a href="#how-it-works" className="hover:text-primary-foreground transition-colors">How It Works</a>
          <a href="#classification" className="hover:text-primary-foreground transition-colors">Classification</a>
          <a href="#upload" className="hover:text-primary-foreground transition-colors">Upload</a>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/40">
        © 2026 WeedVision AI — Machine Learning for Precision Agriculture
      </div>
    </div>
  </footer>
);

export default Footer;
