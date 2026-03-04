import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import Features from "@/components/Features";
import Workflow from "@/components/Workflow";
import Demo from "@/components/Demo";
import Impact from "@/components/Impact";
import Vision from "@/components/Vision";
import Footer from "@/components/Footer";
import Background from "@/components/Background";

export default function Home() {
  return (
    <>
      <Background />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Problem />
        <Solution />
        <Features />
        <Workflow />
        <Demo />
        <Impact />
        <Vision />
      </main>
      <Footer />
    </>
  );
}
