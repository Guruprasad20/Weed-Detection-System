import { PageHeader } from "@/components/Glass";
import ContactSection from "@/components/ContactSection";

const ContactPage = () => (
  <>
    <PageHeader title="Contact" subtitle="Reach out to the WeedVision AI team" />
    <div className="-mx-4 md:-mx-6">
      <ContactSection />
    </div>
  </>
);

export default ContactPage;
