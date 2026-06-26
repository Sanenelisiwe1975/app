import IconSprite from "@/components/IconSprite";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WhoWeServe from "@/components/WhoWeServe";
import About from "@/components/About";
import Solution from "@/components/Solution";
import Features from "@/components/Features";
import Impact from "@/components/Impact";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import ScrollEffects from "@/components/ScrollEffects";

export default function Home() {
  return (
    <>
      <IconSprite />
      <Header />
      <main>
        <Hero />
        <WhoWeServe />
        <About />
        <Solution />
        <Features />
        <Impact />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <ScrollEffects />
    </>
  );
}
