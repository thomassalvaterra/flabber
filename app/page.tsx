'use client';

import { useEffect, useRef, useState } from 'react';

const serviceSlides = [
  { src: '/services/01-overview.png', alt: 'Tutto quello che ti serve - panoramica dei servizi Flabber Studio' },
  { src: '/services/02-comunicazione.png', alt: 'Comunicazione - dire la cosa giusta, nel momento giusto, alle persone giuste' },
  { src: '/services/03-posizionamento.png', alt: 'Posizionamento - trovare uno spazio riconoscibile nel mercato' },
  { src: '/services/04-strategia.png', alt: 'Strategia - un piano digitale costruito sugli obiettivi' },
  { src: '/services/05-contenuti.png', alt: 'Contenuti - testi, visual e video che fanno fermare lo scroll' },
  { src: '/services/06-crescita.png', alt: 'Crescita - community, visibilità e conversioni reali' },
  { src: '/services/07-cta.png', alt: 'Se hai una attività che merita di essere vista, parliamoci' },
];

const services = [
  { title: 'Comunicazione', text: 'La comunicazione non è dire tutto. È capire cosa dire, a chi dirlo e come farlo arrivare nel modo giusto. Perché ogni attività ha qualcosa da raccontare, ma non tutte riescono a farlo percepire.', glyph: 'eye' },
  { title: 'Posizionamento', text: 'In un mercato pieno di alternative, essere presenti non basta. Troviamo ciò che rende la tua attività diversa e lo trasformiamo in qualcosa di riconoscibile.', glyph: 'rings' },
  { title: 'Strategia', text: 'Ogni risultato nasce da una direzione chiara. Costruiamo strategie digitali pensate per dare coerenza alle azioni, continuità alla comunicazione e valore nel tempo.', glyph: 'wave' },
  { title: 'Contenuti', text: 'Ogni attività ha qualcosa da raccontare. Il nostro compito è trasformarlo in contenuti capaci di attirare attenzione, trasmettere valore e rendere riconoscibile ciò che fai.', glyph: 'eye' },
  { title: 'Crescita', text: 'La crescita non si misura soltanto nei numeri. Si vede nelle richieste che arrivano, nelle opportunità che si creano e nel modo in cui le persone iniziano a percepire la tua attività.', glyph: 'rings' },
];

const competencies = ['Gestione social', 'Branding', 'Shooting', 'Video', 'Advertising', 'Siti web', 'Consulenze', 'Progetti speciali'];

const projectImages = [
  { src: '/projects/project-01.webp', alt: 'Ripresa con smartphone e microfoni in una location outdoor' },
  { src: '/projects/project-02.webp', alt: 'Backstage di uno shooting in studio con il team Flabber' },
  { src: '/projects/project-03.webp', alt: 'Team Flabber al lavoro su un set fotografico' },
  { src: '/projects/project-04.webp', alt: 'Studio fotografico allestito per una produzione automotive' },
  { src: '/projects/project-05.webp', alt: 'Produzione video durante il detailing di una Ferrari' },
  { src: '/projects/project-06.webp', alt: 'Set creativo con macchina da cucire, luci e fumo scenico' },
  { src: '/projects/project-07.webp', alt: 'Ripresa video di una lavorazione industriale' },
  { src: '/projects/project-08.webp', alt: 'Shooting fotografico lifestyle in studio' },
];

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) return;

    const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
    const fragment = `
      precision highp float;
      uniform vec2 r;uniform vec2 m;uniform float t;
      mat2 R(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
      float sp(vec3 p,float s){return length(p)-s;}
      float to(vec3 p,vec2 q){vec2 d=vec2(length(p.xz)-q.x,p.y);return length(d)-q.y;}
      float sm(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
      float map(vec3 p){float z=t*.22;p.xy*=R(z+m.x*.24);p.yz*=R(-z*.7+m.y*.18);vec3 q=p;q.xz*=R(t*.28);float d=to(q,vec2(.7,.22));d=sm(d,sp(p-vec3(.5*sin(t*.31),.34*cos(t*.25),.14),.45),.3);d=sm(d,sp(p-vec3(-.46*cos(t*.22),-.32*sin(t*.3),-.1),.37),.27);return d;}
      vec3 nor(vec3 p){vec2 e=vec2(.0015,0.);return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));}
      void main(){vec2 u=(2.*gl_FragCoord.xy-r.xy)/r.y;vec3 ro=vec3(m.x*.18,m.y*.14,3.15),rd=normalize(vec3(u,-1.82));float d=0.,g=0.;vec3 p;bool h=false;for(int i=0;i<90;i++){p=ro+rd*d;float x=map(p);g+=.003/(.025+abs(x));if(x<.0015){h=true;break;}d+=x*.8;if(d>7.)break;}vec3 c=vec3(.012);c+=vec3(.14,.06,.3)*min(g*.06,.4);if(h){vec3 n=nor(p),l=normalize(vec3(-.6,.8,1.2));float di=max(dot(n,l),0.),ri=pow(1.-max(dot(n,-rd),0.),2.1),s=pow(max(dot(reflect(-l,n),-rd),0.),38.);vec3 ir=.55+.45*cos(6.283*(vec3(.02,.28,.58)+ri*.75+n.y*.12+t*.008));c=mix(vec3(.012,.01,.02),ir,ri*.9+.06)*(.12+di*.9)+ir*ri*1.25+s*1.5;}c*=1.-smoothstep(.55,1.5,length(u))*.7;c=c/(1.+c);c=pow(c,vec3(.82));gl_FragColor=vec4(c,1.);}`;

    const shader = (type: number, source: string) => {
      const item = gl.createShader(type)!;
      gl.shaderSource(item, source);
      gl.compileShader(item);
      return item;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, shader(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, 'p');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    const res = gl.getUniformLocation(program, 'r');
    const mouse = gl.getUniformLocation(program, 'm');
    const time = gl.getUniformLocation(program, 't');
    let mx = 0, my = 0, tx = 0, ty = 0, frame = 0;
    const move = (event: PointerEvent) => {
      tx = (event.clientX / innerWidth - .5) * 2;
      ty = (.5 - event.clientY / innerHeight) * 2;
    };
    const render = (now: number) => {
      const scale = Math.min(devicePixelRatio, innerWidth < 700 ? 1.1 : 1.45);
      const width = Math.floor(canvas.clientWidth * scale);
      const height = Math.floor(canvas.clientHeight * scale);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width; canvas.height = height; gl.viewport(0, 0, width, height);
      }
      mx += (tx - mx) * .035; my += (ty - my) * .035;
      gl.uniform2f(res, width, height); gl.uniform2f(mouse, mx, my); gl.uniform1f(time, now / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frame = requestAnimationFrame(render);
    };
    addEventListener('pointermove', move, { passive: true });
    frame = requestAnimationFrame(render);
    return () => { removeEventListener('pointermove', move); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const progress = document.querySelector<HTMLElement>('.progress');
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (progress) progress.style.transform = `scaleX(${max ? scrollY / max : 0})`;
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (reduced) {
      document.querySelectorAll('.reveal').forEach((node) => node.classList.add('visible'));
      return () => removeEventListener('scroll', onScroll);
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .14 });
    document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));
    return () => { observer.disconnect(); removeEventListener('scroll', onScroll); };
  }, []);

  useEffect(() => {
    const stage = document.querySelector<HTMLElement>('.service-deck-stage');
    const viewport = document.querySelector<HTMLElement>('.service-deck-viewport');
    const track = document.querySelector<HTMLElement>('.service-deck-track');
    if (!stage || !viewport || !track) return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let travel = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (reduced) {
          track.style.transform = '';
          return;
        }
        const offset = Math.min(Math.max(-stage.getBoundingClientRect().top, 0), travel);
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      });
    };

    const measure = () => {
      travel = Math.max(0, track.scrollWidth - viewport.clientWidth);
      stage.style.height = reduced ? 'auto' : `${innerHeight + travel}px`;
      update();
    };

    track.querySelectorAll('img').forEach((image) => {
      if (!image.complete) image.addEventListener('load', measure, { once: true });
    });
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', measure);
    measure();

    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', update);
      removeEventListener('resize', measure);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <div className="progress" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Flabber Studio - torna all'inizio"><span className="brand-lockup"><img src="/branding/flabber-lockup.png" alt="Flabber Studio" /></span></a>
        <nav aria-label="Navigazione principale"><a href="#top">Home</a><a href="#servizi">Servizi</a><a href="#progetti">Progetti</a><a href="#contatti">Contatti</a></nav>
        <a className="talk" href="#contatti">Parliamone <span>↗</span></a>
        <button className="menu-button" aria-label="Apri il menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><i /><i /></button>
      </header>
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <a href="#top" onClick={closeMenu}>Home</a><a href="#servizi" onClick={closeMenu}>Servizi</a><a href="#progetti" onClick={closeMenu}>Progetti</a><a href="#contatti" onClick={closeMenu}>Contatti</a>
      </div>

      <section className="hero" id="top">
        <canvas ref={canvasRef} aria-label="Forma tridimensionale astratta animata" />
        <div className="vignette" />
        <p className="eyebrow">Flabber Studio · Digital Agency</p>
        <h1><span>WE MAKE</span><span>IDEAS <em>MOVE</em></span></h1>
        <p className="intro">Non facciamo solo contenuti.<br />Costruiamo presenza.</p>
        <a className="scroll" href="#manifesto"><small>SCROLL</small><b>↓</b></a>
      </section>

      <section className="teaser" id="manifesto">
        <p><span>01</span> Manifesto</p>
        <div className="manifesto-stage">
          <h2 className="reveal">Non facciamo<br />solo <em>contenuti.</em></h2>
          <figure className="manifesto-visual reveal">
            <div className="manifesto-card"><img src="/manifesto/human-machine.jpg" alt="Una mano umana e una mano robotica si avvicinano attraverso un cerchio luminoso" /></div>
            <figcaption><span>Human × Technology</span><span>Flabber Studio</span></figcaption>
          </figure>
        </div>
        <div className="manifesto-copy reveal"><p>Costruiamo presenza.</p><small>Una presenza efficace nasce dalla costanza, dalla coerenza e dalla capacità di costruire fiducia nel tempo.</small></div>
      </section>

      <section className="services section" id="servizi">
        <div className="label reveal"><span>02</span>Cosa facciamo</div>
        <div className="services-title reveal"><h2>Tutto quello<br />che <em>ti serve.</em></h2><p>Dalla gestione dei social alla produzione di contenuti, dai siti web alla strategia digitale: coinvolgiamo le competenze necessarie per trasformare le idee in risultati concreti.</p></div>
        <div className="service-deck-stage">
          <div className="service-deck-sticky">
            <div className="deck-heading reveal"><span>La nostra direzione, in sette frame</span><span>Scorri verso il basso ↓</span></div>
            <div className="service-deck-viewport" aria-label="Presentazione dei servizi Flabber Studio">
              <div className="service-deck-track">
                {serviceSlides.map((slide, index) => (
                  <figure key={slide.src}>
                    {index === serviceSlides.length - 1 ? (
                      <div className="service-cta-slide" role="img" aria-label={slide.alt}>
                        <span className="cta-kicker">Digital Agency</span>
                        <span className="cta-ready">Pronti quando lo sei tu</span>
                        <h3><span>Se hai un&apos;attività</span><span>che merita</span><span>di essere vista,</span><em>parliamoci.</em></h3>
                        <span className="cta-signature">Flabber Studio</span>
                      </div>
                    ) : <img src={slide.src} alt={slide.alt} loading="lazy" decoding="async" />}
                    <figcaption>{String(index + 1).padStart(2, '0')} / 07</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="service-list">
          {services.map((service, index) => <article className="service reveal" key={service.title}><b>{String(index + 1).padStart(2, '0')}</b><h3>{service.title}</h3><p>{service.text}</p><i className={`glyph ${service.glyph}`} aria-hidden="true" /></article>)}
        </div>
      </section>

      <section className="competencies section">
        <div className="label reveal"><span>03</span>Le nostre competenze</div>
        <div className="competencies-head reveal"><h2>Un solo studio.<br /><em>Molte direzioni.</em></h2><p>Mettiamo attorno al progetto le persone e le competenze che servono davvero.</p></div>
        <div className="competency-grid">{competencies.map((item, index) => <div className="competency reveal" key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong><i>↗</i></div>)}</div>
      </section>

      <section className="process section" id="metodo">
        <div className="label reveal"><span>04</span>Il nostro metodo</div>
        <div className="process-grid"><div><h2 className="reveal">Una direzione.<br /><em>Azioni concrete.</em></h2><p className="method-intro reveal">Ogni progetto parte da una comprensione reale dell&apos;attività che abbiamo davanti. Perché una presenza efficace non nasce da un singolo contenuto.</p></div><div className="steps"><article className="reveal"><b>01</b><div><h3>Comprendiamo</h3><p>Analizziamo il contesto, le persone, il mercato e gli obiettivi reali.</p></div></article><article className="reveal"><b>02</b><div><h3>Definiamo</h3><p>Costruiamo una direzione chiara, coerente con ciò che rende l&apos;attività riconoscibile.</p></div></article><article className="reveal"><b>03</b><div><h3>Trasformiamo</h3><p>Portiamo la strategia nelle azioni, con costanza, coerenza e valore nel tempo.</p></div></article></div></div>
      </section>

      <section className="studio section" id="studio">
        <div className="label reveal"><span>05</span>Il team</div>
        <div className="studio-grid"><h2 className="reveal">Una rete.<br />Un obiettivo<br /><em>comune.</em></h2><div className="studio-copy reveal"><p>Flabber Studio è una rete di professionisti che collaborano per costruire progetti di comunicazione efficaci.</p><p>Strategia, contenuti, sviluppo web, produzione foto e video: ogni progetto coinvolge le competenze necessarie per raggiungere l&apos;obiettivo.</p><p>Un approccio flessibile, dinamico e costruito attorno alle reali esigenze delle attività che seguiamo.</p></div></div>
        <div className="studio-gallery reveal" aria-label="Flabber Studio dietro le quinte">
          <figure><img src="/studio/studio-workspace.webp" alt="Workspace creativo Flabber Studio" loading="lazy" decoding="async" /><figcaption><span>01</span>Direzione creativa</figcaption></figure>
          <figure><img src="/studio/studio-on-location.webp" alt="Videomaker Flabber durante una produzione in location" loading="lazy" decoding="async" /><figcaption><span>02</span>On location</figcaption></figure>
          <figure><img src="/studio/studio-event.webp" alt="Operatore Flabber durante la copertura video di un evento" loading="lazy" decoding="async" /><figcaption><span>03</span>Event coverage</figcaption></figure>
        </div>
        <div className="network-mark reveal" aria-hidden="true"><i /><i /><i /><span className="network-logo"><img src="/branding/flabber-symbol.png" alt="" /></span></div>
      </section>

      <section className="work" id="progetti">
        <div className="work-head section"><div className="label reveal"><span>06</span>Portfolio</div><h2 className="reveal">Dietro ogni progetto<br />c&apos;è una storia <em>diversa.</em></h2><p className="portfolio-intro reveal">Non lavoriamo con soluzioni preimpostate, ma costruiamo percorsi che si adattano alle persone, alle attività e agli obiettivi che seguiamo.</p></div>
        <div className="project-showcase">
          <div className="project-showcase-head reveal"><span>Selected productions · 2024—2026</span><span>Il lavoro, mentre prende forma</span></div>
          <div className="project-carousel" role="region" aria-label="Carosello continuo dei progetti Flabber Studio" tabIndex={0}>
            <div className="project-track">
              {[...projectImages, ...projectImages].map((project, index) => (
                <figure className="project-frame" key={`${project.src}-${index}`} aria-hidden={index >= projectImages.length ? true : undefined}>
                  <img src={project.src} alt={index < projectImages.length ? project.alt : ''} loading="lazy" decoding="async" />
                  <figcaption><span>{String((index % projectImages.length) + 1).padStart(2, '0')}</span><span>Flabber Studio / Production</span></figcaption>
                </figure>
              ))}
            </div>
          </div>
          <div className="project-showcase-foot section reveal"><p>Strategia, riprese, fotografia e contenuti: entriamo nei progetti per raccontarli da vicino.</p><span>Scorrimento continuo →</span></div>
        </div>
      </section>

      <section className="contact" id="contatti">
        <div className="contact-orb" aria-hidden="true"><i /><b /></div><div className="label reveal"><span>07</span>Contatti</div>
        <h2 className="reveal">Se hai un&apos;attività<br />che merita di essere <em>vista,</em><br />parliamoci.</h2><a className="mail reveal" href="mailto:info@flabber.it">info@flabber.it <span>↗</span></a>
        <footer><a className="brand footer-brand" href="#top" aria-label="Flabber Studio - torna all'inizio"><span className="brand-lockup"><img src="/branding/flabber-lockup.png" alt="Flabber Studio" /></span></a><p>Digital Agency · Italy<br />© 2026 Flabber Studio</p><a href="#top">Torna su ↑</a></footer>
      </section>
    </main>
  );
}
