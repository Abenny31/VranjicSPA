import { useEffect, useRef, useState } from 'react';
import './App.css';

const sections = [
  {
    img: '',
    title: 'Vranjic',
    detail: 'Dobro došli u Vranjic',
    content:
      'Vranjic je malo slikovito mjesto smješteno uz more, poznato po svojoj ljepoti, tradiciji i gostoljubivosti. Ovdje ćete pronaći mir, prekrasne zalaske sunca i toplinu lokalne zajednice.',
  },
  {
    img: '',
    title: 'Udruga don Frane Bulića',
    detail: 'Kulturna udruga',
    content:
      'Udruga don Frane Bulića njeguje kulturnu i povijesnu baštinu Vranjica kroz razne manifestacije, radionice i projekte. Povezuje mještane i čuva identitet mjesta.',
  },
  {
    img: '',
    title: 'Malo misto - Vranjic',
    detail: 'Povijest',
    content:
      'Vranjic, često nazivan "malo misto", ima bogatu povijest koja seže još u antička vremena. Kroz stoljeća je bio dom ribara, brodograditelja i umjetnika.',
  },
  {
    img: '',
    title: 'Sv. Martin',
    detail: 'Zaštitnik mista',
    content:
      'Sveti Martin je zaštitnik Vranjica. Crkva sv. Martina središnje je mjesto okupljanja i duhovnosti, a blagdan sv. Martina posebno se slavi među mještanima.',
  },
  {
    img: '',
    title: 'Život u Vranjicu',
    detail: 'Čari maloga mista',
    content:
      'Život u Vranjicu ispunjen je druženjima, feštama i zajedništvom. Mjesto nudi autentičan dalmatinski doživljaj, daleko od gradske vreve.',
  },
];

function App() {
  const [showNav, setShowNav] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const lastScroll = useRef(window.scrollY);
  const navRef = useRef<HTMLDivElement>(null);

  // 0) ENSURE MENU STARTS CLOSED ON INITIAL RENDER
  useEffect(() => {
    setMobileNavOpen(false);
    return () => setMobileNavOpen(false);
  }, []);

  // 1) CLOSE MENU WHEN CLICKING OUTSIDE, ONLY IF IT'S OPEN
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileNavOpen && // only run this if the menu is actually open
        navRef.current &&
        !navRef.current.contains(event.target as Node)
      ) {
        setMobileNavOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileNavOpen]);

  // 2) NAVBAR SHOW/HIDE ON SCROLL (unchanged)
  useEffect(() => {
    let ticking = false;
    let stopTimeout: ReturnType<typeof setTimeout> | null = null;

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

      if (stopTimeout) clearTimeout(stopTimeout);
      stopTimeout = setTimeout(() => {
        setShowNav(true);
      }, 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (stopTimeout) clearTimeout(stopTimeout);
    };
  }, []);

  // 3) SCROLL TO SECTION, THEN CLOSE THE MENU (ONLY ONCE!)
  const scrollToSection = (idx: number) => {
    // Close the menu immediately
    setMobileNavOpen(false);

    // Wait 200ms for the CSS transition to finish, then scroll
    setTimeout(() => {
      const el = document.getElementById(`section-${idx}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  // 4) CLOSE MOBILE MENU WHEN WINDOW IS RESIZED ABOVE MOBILE BREAKPOINT
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileNavOpen) {
        setMobileNavOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileNavOpen]);

  return (
    <>
      <nav
        className={`main-navbar${showNav ? ' visible' : ' hidden'}`}
        ref={navRef}
      >
        <div className="nav-container">
          <div className="nav-inner">
            <span className="brand">Vranjic</span>

            {/* Hamburger button visible only on mobile */}
            <button
              className="hamburger"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileNavOpen}
              onClick={(e) => {
                e.stopPropagation();
                setMobileNavOpen(prev => !prev);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                  setMobileNavOpen(prev => !prev);
                }
              }}
            >
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
            </button>

            <div
              className={`nav-links ${mobileNavOpen ? 'open' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              {sections.map((section, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(i);
                  }}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay - shows only on mobile when menu is open */}
      <div
        className={`mobile-nav-overlay ${mobileNavOpen ? 'open' : ''}`}
        onClick={() => setMobileNavOpen(false)}
      />

      <div className="landing-root">
        {sections.map((section, i) => (
          <SectionFade
            key={i}
            id={`section-${i}`}
            reverse={i % 2 === 1}
            title={section.title}
            detail={section.detail}
            content={section.content}
            img={
              section.img ||
              'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
            }
          />
        ))}
      </div>
    </>
  );
}

function SectionFade({
  id,
  reverse,
  title,
  detail,
  content,
  img,
}: {
  id: string;
  reverse?: boolean;
  title: string;
  detail: string;
  content: string;
  img?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      id={id}
      ref={ref}
      className={`section ${reverse ? 'row-reverse' : 'row'} fade-section${
        visible ? ' visible' : ''
      }`}
    >
      {img && (
        <div className="img-col">
          <img src={img} alt={title} className="vranjic-img" />
        </div>
      )}
      <div className="text-col">
        <h2>{title}</h2>
        <h3 style={{ color: '#1976d2', fontWeight: 500, marginBottom: 8 }}>
          {detail}
        </h3>
        <p>{content}</p>
      </div>
    </div>
  );
}

export default App;
