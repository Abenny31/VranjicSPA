import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const sections = [
  {
    img: '',
    title: 'Vranjic',
    detail: 'Dobro došli u Vranjic',
    content: 'Vranjic je malo slikovito mjesto smješteno uz more, poznato po svojoj ljepoti, tradiciji i gostoljubivosti. Ovdje ćete pronaći mir, prekrasne zalaske sunca i toplinu lokalne zajednice.'
  },
  {
    img: '',
    title: 'Udruga don Frane Bulića',
    detail: 'Kulturna udruga',
    content: 'Udruga don Frane Bulića njeguje kulturnu i povijesnu baštinu Vranjica kroz razne manifestacije, radionice i projekte. Povezuje mještane i čuva identitet mjesta.'
  },
  {
    img: '',
    title: 'Malo misto - Vranjic',
    detail: 'Povijest',
    content: 'Vranjic, često nazivan "malo misto", ima bogatu povijest koja seže još u antička vremena. Kroz stoljeća je bio dom ribara, brodograditelja i umjetnika.'
  },
  {
    img: '',
    title: 'Sv. Martin',
    detail: 'Zaštitnik mista',
    content: 'Sveti Martin je zaštitnik Vranjica. Crkva sv. Martina središnje je mjesto okupljanja i duhovnosti, a blagdan sv. Martina posebno se slavi među mještanima.'
  },
  {
    img: '',
    title: 'Život u Vranjicu',
    detail: 'Čari maloga mista',
    content: 'Život u Vranjicu ispunjen je druženjima, feštama i zajedništvom. Mjesto nudi autentičan dalmatinski doživljaj, daleko od gradske vreve.'
  }
];


function App() {
  const [showNav, setShowNav] = useState(true);
  const lastScroll = useRef(window.scrollY);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          if (currentScroll <= 0) {
            setShowNav(true);
          } else if (currentScroll > lastScroll.current) {
            setShowNav(false); // scrolling down
          } else {
            setShowNav(true); // scrolling up
          }
          lastScroll.current = currentScroll;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (idx: number) => {
    const el = document.getElementById(`section-${idx}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={`main-navbar${showNav ? ' visible' : ' hidden'}`}>
        <div className="nav-container">
          <div className="nav-inner">
            <span className="brand">Vranjic</span>
            <div className="nav-links">
              {sections.map((section, i) => (
                <button key={i} onClick={() => scrollToSection(i)}>
                  {section.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <div className="landing-root">
        {sections.map((section, i) => (
          <SectionFade
            key={i}
            id={`section-${i}`}
            reverse={i % 2 === 1}
            title={section.title}
            detail={section.detail}
            content={section.content}
            img={section.img || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'}
          />
        ))}
      </div>
    </>
  );
}


// Animated section component
function SectionFade({ id, reverse, title, detail, content, img }: {
  id: string,
  reverse?: boolean,
  title: string,
  detail: string,
  content: string,
  img?: string
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  return (
    <div
      id={id}
      ref={ref}
      className={`section ${reverse ? 'row-reverse' : 'row'} fade-section${visible ? ' visible' : ''}`}
    >
      {img && (
        <div className="img-col">
          <img src={img} alt={title} className="vranjic-img" />
        </div>
      )}
      <div className="text-col">
        <h2>{title}</h2>
        <h3 style={{ color: '#1976d2', fontWeight: 500, marginBottom: 8 }}>{detail}</h3>
        <p>{content}</p>
      </div>
    </div>
  );
}

export default App;
