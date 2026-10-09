import Hero from '../components/Hero';
import Specials from '../components/Specials';
import Testimonials from '../components/Testimonials';
import About from '../components/About';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function HomePage() {
  useDocumentTitle('Home');

  return (
    <>
      <Hero />
      <Specials />
      <Testimonials />
      <About />
    </>
  );
}
