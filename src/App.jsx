import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Intro from './components/Intro.jsx';
import Section from './components/Section.jsx';
import Quilt from './components/Quilt.jsx';
import Gifting from './components/Gifting.jsx';
import CallToAction from './components/CallToAction.jsx';
import Footer from './components/Footer.jsx';
import { StitchDivider } from './components/Icons.jsx';
import { catalog } from './data/catalog.js';

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <StitchDivider />
      <Intro />
      {catalog.map((section) => (
        <Section key={section.id} section={section} />
      ))}
      <Quilt />
      <Gifting />
      <CallToAction />
      <Footer />
    </>
  );
}
