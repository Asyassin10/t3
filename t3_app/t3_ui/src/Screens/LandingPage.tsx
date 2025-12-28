import { About } from "@/shadcnuicomponents/About";
import { Cta } from "@/shadcnuicomponents/Cta";
import { FAQ } from "@/shadcnuicomponents/FAQ";
import { Features } from "@/shadcnuicomponents/Features";
import { Footer } from "@/shadcnuicomponents/Footer";
import { Hero } from "@/shadcnuicomponents/Hero";
import { HowItWorks } from "@/shadcnuicomponents/HowItWorks";
import { Navbar } from "@/shadcnuicomponents/Navbar";
import { Newsletter } from "@/shadcnuicomponents/Newsletter";
import { Pricing } from "@/shadcnuicomponents/Pricing";
import { ScrollToTop } from "@/shadcnuicomponents/ScrollToTop";
import { Services } from "@/shadcnuicomponents/Services";
import { Sponsors } from "@/shadcnuicomponents/Sponsors";
import { Team } from "@/shadcnuicomponents/Team";
import { Testimonials } from "@/shadcnuicomponents/Testimonials";

function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Sponsors />
      <About />
      <HowItWorks />
      <Features />
      <Services />
      <Cta />
      <Testimonials />
      <Team />
      <Pricing />
      <Newsletter />
      <FAQ />
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default LandingPage;
