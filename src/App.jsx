import Navbar from "./components/Navbar";
import Starfield from "./components/Starfield";
import Cursor from "./components/Cursor";
import ScrollProgress from "./components/ScrollProgress";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <div className="space-bg" aria-hidden="true">
        <Starfield />
        <div className="glow glow-1" />
        <div className="glow glow-2" />
        <div className="glow glow-3" />
        {/* kilatan cahaya di akhir intro warp */}
        <div className="warp-flash" />
      </div>
      <ScrollProgress />
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
