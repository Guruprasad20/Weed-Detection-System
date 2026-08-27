import { useState } from "react";
import { Mail, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Reveal from "@/components/Reveal";

const ContactSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("contact", {
        body: { name, email, message },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success("Message sent! We'll get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send message";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <Reveal>
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">Get In Touch</p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">Talk to Our Team</h2>
            <p className="mt-4 text-muted-foreground">
              Questions about deployment, enterprise plans, or research collaborations? Send us a message.
            </p>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <form onSubmit={submit} className="bg-card rounded-xl p-8 shadow-card-custom space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Name</Label>
                <Input id="contact-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={200} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={320} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea id="contact-message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required maxLength={5000} />
            </div>
            <div className="flex items-center justify-between pt-2">
              <a href="mailto:hello@weedvision.ai" className="text-sm text-muted-foreground inline-flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" /> hello@weedvision.ai
              </a>
              <Button type="submit" disabled={loading} size="lg" className="font-heading font-semibold">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

export default ContactSection;
