'use client';

import { useEffect, useRef, useState } from 'react';

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

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <div className="progress" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#top"><span className="brand-mark" />FLABBER</a>
        <nav aria-label="Navigazione principale"><a href="#manifesto">Manifesto</a><a href="#servizi">Servizi</a><a href="#progetti">Progetti</a></nav>
        <a className="talk" href="#contatti">Parliamone <span>↗</span></a>
        <button className="menu-button" aria-label="Apri il menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><i /><i /></button>
      </header>
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <a href="#manifesto" onClick={closeMenu}>Manifesto</a><a href="#servizi" onClick={closeMenu}>Servizi</a><a href="#progetti" onClick={closeMenu}>Progetti</a><a href="#contatti" onClick={closeMenu}>Contatti</a>
      </div>
      <section className="hero" id="top">
        <canvas ref={canvasRef} aria-label="Forma tridimensionale astratta animata" />
        <div className="vignette" />
        <p className="eyebrow">Independent digital studio · Italy</p>
        <h1><span>WE MAKE</span><span>IDEAS <em>MOVE</em></span></h1>
        <p className="intro">Strategia, identità e tecnologia<br />per brand impossibili da ignorare.</p>
        <a className="scroll" href="#manifesto"><small>SCROLL</small><b>↓</b></a>
      </section>
      <section className="teaser" id="manifesto">
        <p><span>01</span> Manifesto</p>
        <h2 className="reveal">Le idee migliori<br />non stanno <em>ferme.</em></h2>
        <div className="manifesto-copy reveal"><p>Flabber trasforma intuizioni audaci in esperienze digitali vive. Uniamo pensiero strategico, design e codice per costruire identità che si fanno ricordare.</p><small>Non inseguiamo l’effetto.<br />Progettiamo il ricordo.</small></div>
      </section>

      <section className="services section" id="servizi">
        <div className="label reveal"><span>02</span>Cosa facciamo</div>
        <div className="services-title reveal"><h2>Pensiero forte.<br /><em>Esecuzione fluida.</em></h2><p>Dalla prima domanda all’ultimo pixel, costruiamo sistemi coerenti, scalabili e decisamente umani.</p></div>
        <div className="service-list">
          <article className="service reveal"><b>01</b><h3>Brand strategy<br />& identity</h3><p>Posizionamento, voce, identità visiva e linee guida per brand con qualcosa di vero da dire.</p><i className="glyph eye" /></article>
          <article className="service reveal"><b>02</b><h3>Web design<br />& development</h3><p>Siti editoriali, e-commerce ed esperienze digitali veloci, inclusive e progettate per convertire.</p><i className="glyph rings" /></article>
          <article className="service reveal"><b>03</b><h3>Motion<br />& 3D worlds</h3><p>Animazione, art direction e spazi tridimensionali interattivi per aggiungere profondità al racconto.</p><i className="glyph wave" /></article>
        </div>
      </section>

      <section className="work" id="progetti">
        <div className="work-head section"><div className="label reveal"><span>03</span>Selected work</div><h2 className="reveal">Ogni progetto<br />ha il suo <em>ritmo.</em></h2></div>
        <article className="project roto">
          <div className="project-meta"><span>Brand system · Digital</span><span>2026</span></div><h3>ROTO</h3>
          <div className="roto-art" aria-hidden="true"><i /><i /><b>R</b></div>
          <p>Energia circolare per una piattaforma che rimette in moto le comunità.</p>
        </article>
        <article className="project nova">
          <div className="project-meta"><span>Experience · E-commerce</span><span>2026</span></div><h3>SUPER<br />NOVA</h3>
          <div className="nova-art" aria-hidden="true"><i /><b /></div>
          <p>Una nuova orbita digitale per un marchio di prodotti fuori categoria.</p>
        </article>
        <article className="project oltre">
          <div className="project-meta"><span>Strategy · Editorial</span><span>2025</span></div><h3>OLTRE</h3>
          <div className="oltre-art" aria-hidden="true"><i>ANDIAMO<br /><em>OLTRE</em></i><i>SENZA<br />PAURA</i><i>INSIEME<br />ORA</i></div>
          <p>Un’identità editoriale aperta, inclusiva e sempre in trasformazione.</p>
        </article>
      </section>

      <section className="numbers section">
        <div className="label reveal"><span>04</span>In numeri</div>
        <div className="number-grid"><article className="reveal"><strong>42</strong><sup>+</sup><p>brand messi<br />in movimento</p></article><article className="reveal"><strong>11</strong><sup>y</sup><p>di esperienza<br />condivisa</p></article><article className="reveal"><strong>6</strong><sup>×</sup><p>discipline in<br />un solo studio</p></article></div>
      </section>

      <section className="process section">
        <div className="label reveal"><span>05</span>Come lavoriamo</div>
        <div className="process-grid"><h2 className="reveal">Curiosi per<br />metodo. <em>Precisi</em><br />per natura.</h2><div className="steps"><article className="reveal"><b>01</b><div><h3>Ascoltiamo</h3><p>Entriamo nel contesto, facciamo domande scomode e troviamo ciò che conta davvero.</p></div></article><article className="reveal"><b>02</b><div><h3>Diamo forma</h3><p>Trasformiamo gli insight in un sistema visivo e narrativo riconoscibile.</p></div></article><article className="reveal"><b>03</b><div><h3>Facciamo muovere</h3><p>Portiamo tutto nel mondo con tecnologia, motion e cura maniacale del dettaglio.</p></div></article></div></div>
      </section>

      <section className="contact" id="contatti">
        <div className="contact-orb" aria-hidden="true"><i /><b /></div><div className="label reveal"><span>06</span>Start something</div>
        <h2 className="reveal">Hai un’idea<br />che vuole <em>muoversi?</em></h2><a className="mail reveal" href="mailto:hello@flabber.it">hello@flabber.it <span>↗</span></a>
        <footer><a className="brand" href="#top"><span className="brand-mark" />FLABBER</a><p>Creative studio · Italy<br />© 2026 Flabber</p><div><a href="#">Instagram</a><a href="#">LinkedIn</a></div></footer>
      </section>
    </main>
  );
}
