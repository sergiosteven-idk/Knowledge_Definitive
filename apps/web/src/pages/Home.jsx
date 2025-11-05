import { useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/home.css';

const Home = () => {
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const impactRef = useRef(null);

  const scrollToSection = useCallback((ref) => {
    if (!ref?.current) return;
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (typeof ref.current.focus === 'function') {
      try {
        ref.current.focus({ preventScroll: true });
      } catch {
        ref.current.focus();
      }
    }
  }, []);

  const talkbackIntro = useCallback(() => {
    if (!('speechSynthesis' in window)) {
      window.alert('Tu navegador no soporta lectura en voz alta.');
      return;
    }

    const welcomeMessage = `Bienvenido a Knowledge Definitive, una plataforma educativa gratuita e inclusiva.
    Ajusta el tamaño de fuente, el contraste y explora con TalkBack para descubrir nuestros recursos accesibles.`;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(welcomeMessage);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  }, []);

  return (
    <div className="home-container" lang="es">
      <section className="hero" id="main-content" tabIndex={-1} aria-labelledby="hero-title">
        <h1 id="hero-title">
          Bienvenido a <span className="highlight">Knowledge Definitive</span>
        </h1>
        <p>
          Una plataforma educativa <strong>100% gratuita</strong> e <strong>inclusiva</strong> que ofrece cursos, podcasts y
          videos con subtítulos y lenguaje de señas. Diseñada para llegar a quienes más lo necesitan.
        </p>

        <div className="hero-buttons" role="navigation" aria-label="Navegación interna de la página">
          <button type="button" onClick={() => scrollToSection(aboutRef)} aria-label="Saber qué es Knowledge">
            ¿Qué es?
          </button>
          <button type="button" onClick={() => scrollToSection(featuresRef)} aria-label="Ver características">
            Características
          </button>
          <button type="button" onClick={() => scrollToSection(impactRef)} aria-label="Ver impacto">
            Impacto
          </button>
          <button type="button" className="talkback-btn" onClick={talkbackIntro} aria-label="Reproducir introducción">
            🔊 Activar TalkBack
          </button>
          <button
            type="button"
            onClick={() => window.alert('Pronto sumaremos intérpretes y contenido completo en Lengua de Señas.')}
            aria-label="Mensaje sobre Lengua de Señas"
          >
            👐 Ver en LS
          </button>
        </div>
      </section>

      <section ref={aboutRef} className="section" tabIndex={-1} aria-labelledby="section-about-title">
        <h2 id="section-about-title">¿Qué es Knowledge Definitive?</h2>
        <p>
          Knowledge Definitive es una plataforma web y móvil que prioriza la accesibilidad. Integra soporte para lectores de
          pantalla, navegación por teclado, subtítulos, transcripciones y múltiples opciones de personalización visual y
          cognitiva.
        </p>
      </section>

      <section ref={featuresRef} className="section alt" tabIndex={-1} aria-labelledby="section-features-title">
        <h2 id="section-features-title">Características principales</h2>
        <ul>
          <li>
            <strong>Accesibilidad completa:</strong> controles A11y, manejo de foco, atajos de teclado y experiencia optimizada
            para lectores de pantalla.
          </li>
          <li>
            <strong>Multimodalidad:</strong> audio, texto, video con intérprete en LS, subtítulos y materiales descargables.
          </li>
          <li>
            <strong>Personalización:</strong> ajustes de tamaño, contraste, espaciado, modo simplificado y lectura en voz alta.
          </li>
          <li>
            <strong>Sostenibilidad comunitaria:</strong> eventos, alianzas y donaciones transparentes orientadas al impacto
            social.
          </li>
        </ul>
      </section>

      <section ref={impactRef} className="section" tabIndex={-1} aria-labelledby="section-impact-title">
        <h2 id="section-impact-title">Impacto</h2>
        <p>
          Trabajamos junto a comunidades vulnerables para transformar su acceso a la educación con contenidos culturales,
          accesibles y colaborativos.
        </p>
        <div className="stats" role="list" aria-label="Indicadores de impacto">
          {[{ label: 'Personas certificadas', value: '1,200+' }, { label: 'Cursos inclusivos', value: '85' }, { label: 'Mentores activos', value: '150' }].map((item) => (
            <article key={item.label} className="stat-card" role="listitem">
              <p className="stat-value">{item.value}</p>
              <p className="stat-label">{item.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section cta-section" tabIndex={-1} aria-labelledby="section-cta-title">
        <h2 id="section-cta-title">¿Listo para comenzar?</h2>
        <p>
          Regístrate gratuitamente, explora nuestros cursos y activa las herramientas de accesibilidad para vivir una
          experiencia adaptada a tus necesidades y objetivos.
        </p>
        <div className="cta-links">
          <Link to="/signup" className="primary">
            Crear cuenta
          </Link>
          <Link to="/cursos" className="secondary">
            Explorar cursos
          </Link>
          <Link to="/contacto" className="secondary">
            Solicitar asesoría
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
