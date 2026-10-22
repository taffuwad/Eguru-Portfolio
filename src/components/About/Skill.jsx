import { useEffect, useRef } from "react";
import Matter from "matter-js";
import "./Skill.css";

/* ------------------------------------------------------------------ */
/*  SKILL DATA                                                        */
/* ------------------------------------------------------------------ */

const SKILLS = [
  // Frontend
  { id: "html5",      name: "HTML5",             category: "frontend" },
  { id: "css3",       name: "CSS3",              category: "frontend" },
  { id: "tailwind",   name: "Tailwind CSS",      category: "frontend" },
  { id: "javascript", name: "JavaScript",        category: "frontend" },
  { id: "react",      name: "React.js",          category: "frontend" },
  // Backend
  { id: "node",       name: "Node.js",           category: "backend"  },
  { id: "express",    name: "Express.js",        category: "backend"  },
  { id: "mongodb",    name: "MongoDB",           category: "backend"  },
  // Animation & interaction
  { id: "gsap",       name: "GSAP",              category: "motion"   },
  { id: "locomotive", name: "Locomotive Scroll", category: "motion"   },
  { id: "lenis",      name: "Lenis",             category: "motion"   },
  { id: "matterjs",   name: "Matter.js",         category: "motion"   },

    //ai tecnolagy
  { id: "Prompt Enginnering",   name: "Prompt Enginnering",         category: "ai"   },
  { id: "Context Enginnering",  name: "Context Enginnering",        category: "ai"   },
  { id: "Ai Automation",        name: "Ai Automation",              category: "Automation"   },
  { id: "Ai Agent",             name: "Ai Agent",                   category: "Automation"   },
  { id: "Claude",               name: "Claude",                     category: "AI" },
  { id: "Claude Code",          name: "Claude Code",                category: "AI" },
  { id: "CodeX",                name: "CodeX",                      category: "AI" },
  { id: "Gemini",               name: "gemini",                     category: "AI" },
  { id: "GitHub-Co-pilot",      name: "GitHub-Co-pilot",            category: "AI" },

  { id: "Grok",                 name: "Grok",                       category: "AI" },
  { id: "DeepSeek",             name: "DeepSeek",                   category: "AI" },
  { id: "Kimi k3",              name: "Kimi k3",                    category: "AI" },
  { id: "Flow AI",              name: "flow AI",                    category: "AI" },
  { id: "Neno Banana",          name: "Neno Banana",                category: "AI" },
  { id: "Chat GPT",             name: "Chat GPT",                   category: "AI" },

  //Tools------------------
  { id: "VS Code",          name: "VS Code",             category: "Tool" },
  { id: "Curser",           name: "Curser",              category: "Tool" },
  { id: "Antigrevity",      name: "Antigrevity",         category: "Tool" },
  { id: "Git",              name: "git",                 category: "Tool" },
  { id: "Git-Hub",          name: "Git-Hub",             category: "Tool" },

];

const {
  Engine, World, Bodies, Body, Composite, Events,
  Mouse, MouseConstraint, Runner,
} = Matter;

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

function Skill() {
  const sectionRef    = useRef(null);
  const playgroundRef = useRef(null);
  const chipRefs      = useRef({});   // id -> HTMLElement
  const bodiesRef     = useRef({});   // id -> Matter.Body
  const wallsRef      = useRef([]);
  const engineRef     = useRef(null);
  const runnerRef     = useRef(null);
  const mouseRef      = useRef(null);
  const rafRef        = useRef(null);
  const cleanupRef    = useRef(null);

  /* ------------------------------ */
  /*  Physics initialization        */
  /* ------------------------------ */
  const initializePhysics = (container) => {
    if (engineRef.current) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (!width || !height) return;

    const engine = Engine.create({
      gravity: { x: 0, y: 0.65, scale: 0.001 },
      enableSleeping: false,
    });
    engine.positionIterations = 8;
    engine.velocityIterations = 6;

    const runner = Runner.create();
    Runner.run(runner, engine);

    engineRef.current = engine;
    runnerRef.current = runner;

    /* --- static boundaries --- */
    const wallOpts = { isStatic: true, friction: 0.35, restitution: 0.25 };
    const T = 120; // wall thickness
    const walls = [
      Bodies.rectangle(width / 2, -T / 2, width + T * 4, T, wallOpts),           // top (ceiling)
      Bodies.rectangle(-T / 2, height / 2, T, height * 4, wallOpts),             // left
      Bodies.rectangle(width + T / 2, height / 2, T, height * 4, wallOpts),      // right
      Bodies.rectangle(width / 2, height + T / 2, width + T * 4, T, wallOpts),   // floor
    ];
    Composite.add(engine.world, walls);
    wallsRef.current = walls;

    /* --- skill bodies --- */
    const entries = Object.entries(chipRefs.current);
    const cols = Math.max(2, Math.floor(width / 170));
    const colGap = width / cols;

    entries.forEach(([id, el], i) => {
      const w = el.offsetWidth || 110;
      const h = el.offsetHeight || 38;
      const col = i % cols;
      const row = Math.floor(i / cols);

      // Spawn inside the container at the top so they tumble down onto the floor
      const x = colGap * col + colGap / 2 + (Math.random() - 0.5) * 30;
      const y = 35 + row * (h + 16) + Math.random() * 20;

      const body = Bodies.rectangle(x, y, w, h, {
        chamfer: { radius: Math.min(w, h) / 2 },
        friction: 0.3,
        frictionAir: 0.018,
        restitution: 0.35,
        density: 0.001,
        label: id,
      });

      Body.setAngle(body, (Math.random() - 0.5) * 0.4);
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);

      body.plugin = { w, h };
      bodiesRef.current[id] = body;
      Composite.add(engine.world, body);
    });

    /* --- pointer interaction --- */
    const mouse = Mouse.create(container);
    // Remove mousewheel listeners so the page can scroll naturally
    container.removeEventListener("mousewheel", mouse.mousewheel);
    container.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        damping: 0.08,
        render: { visible: false },
      },
    });
    Composite.add(engine.world, mouseConstraint);
    mouseRef.current = mouseConstraint;

    /* --- drag state styling --- */
    const onStartDrag = (evt) => {
      if (evt.body && evt.body.label) {
        chipRefs.current[evt.body.label]?.classList.add("chip--drag");
      }
    };
    const onEndDrag = (evt) => {
      if (evt.body && evt.body.label) {
        chipRefs.current[evt.body.label]?.classList.remove("chip--drag");
      }
    };
    Events.on(mouseConstraint, "startdrag", onStartDrag);
    Events.on(mouseConstraint, "enddrag",   onEndDrag);

    /* --- collision polish --- */
    const onCollisionStart = (evt) => {
      for (const p of evt.pairs) {
        chipRefs.current[p.bodyA.label]?.classList.add("chip--hit");
        chipRefs.current[p.bodyB.label]?.classList.add("chip--hit");
      }
    };
    const onCollisionEnd = (evt) => {
      for (const p of evt.pairs) {
        chipRefs.current[p.bodyA.label]?.classList.remove("chip--hit");
        chipRefs.current[p.bodyB.label]?.classList.remove("chip--hit");
      }
    };
    Events.on(engine, "collisionStart", onCollisionStart);
    Events.on(engine, "collisionEnd",   onCollisionEnd);

    /* --- per-frame DOM sync --- */
    const sync = () => {
      for (const id in bodiesRef.current) {
        const body = bodiesRef.current[id];
        const el = chipRefs.current[id];
        if (!el || !body.plugin) continue;
        const { w, h } = body.plugin;
        const { x, y } = body.position;
        el.style.transform = `translate3d(${x - w / 2}px, ${y - h / 2}px, 0) rotate(${body.angle}rad)`;
      }
      rafRef.current = requestAnimationFrame(sync);
    };
    rafRef.current = requestAnimationFrame(sync);

    container.classList.add("skill-playground--ready");

    /* --- cleanup function --- */
    cleanupRef.current = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;

      Events.off(mouseConstraint, "startdrag", onStartDrag);
      Events.off(mouseConstraint, "enddrag",   onEndDrag);
      Events.off(engine, "collisionStart",     onCollisionStart);
      Events.off(engine, "collisionEnd",       onCollisionEnd);

      container.classList.remove("skill-playground--ready");

      for (const id in chipRefs.current) {
        const el = chipRefs.current[id];
        if (el) {
          el.classList.remove("chip--drag", "chip--hit");
          el.style.transform = "";
        }
      }

      Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  };

  /* ------------------------------ */
  /*  Resize handling               */
  /* ------------------------------ */
  const handleResize = () => {
    const container = playgroundRef.current;
    const engine = engineRef.current;
    if (!container || !engine) return;

    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;

    const [top, left, right, floor] = wallsRef.current;
    if (!floor) return;

    const T = 120;
    Body.setPosition(top,   { x: width / 2, y: -T / 2 });
    Body.setPosition(left,  { x: -T / 2, y: height / 2 });
    Body.setPosition(right, { x: width + T / 2, y: height / 2 });
    Body.setPosition(floor, { x: width / 2, y: height + T / 2 });

    Body.setVertices(top,   Bodies.rectangle(width / 2, -T / 2, width + T * 4, T).vertices);
    Body.setVertices(floor, Bodies.rectangle(width / 2, height + T / 2, width + T * 4, T).vertices);
    Body.setVertices(left,  Bodies.rectangle(-T / 2, height / 2, T, height * 4).vertices);
    Body.setVertices(right, Bodies.rectangle(width + T / 2, height / 2, T, height * 4).vertices);

    /* keep chips inside new bounds */
    for (const id in bodiesRef.current) {
      const b = bodiesRef.current[id];
      if (b.position.x < 30 || b.position.x > width - 30 || b.position.y > height - 20) {
        Body.setPosition(b, {
          x: Math.min(width - 60, Math.max(60, b.position.x)),
          y: Math.min(height - 40, Math.max(40, b.position.y)),
        });
        Body.setVelocity(b, { x: 0, y: 0 });
      }
    }
  };

  /* ------------------------------ */
  /*  Reduced-motion fallback       */
  /* ------------------------------ */
  const applyStaticFallback = () => {
    playgroundRef.current?.classList.add("playground--static");
  };

  /* ------------------------------ */
  /*  Lifecycle                     */
  /* ------------------------------ */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      applyStaticFallback();
      return;
    }

    const container = playgroundRef.current;
    const section = sectionRef.current;
    if (!container || !section) return;

    let initialized = false;
    const start = () => {
      if (initialized) return;
      initialized = true;
      initializePhysics(container);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          start();
          if (runnerRef.current) runnerRef.current.enabled = true;
        } else {
          // Pause simulation while off-screen to preserve resources
          if (runnerRef.current) runnerRef.current.enabled = false;
        }
      },
      { threshold: 0.05, rootMargin: "150px" }
    );
    observer.observe(section);

    const ro = new ResizeObserver(() => {
      if (engineRef.current) {
        handleResize();
      } else if (container.getBoundingClientRect().width > 0) {
        start();
      }
    });
    ro.observe(container);

    const onVis = () => {
      if (runnerRef.current) runnerRef.current.enabled = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      observer.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);

      cleanupRef.current?.();
      cleanupRef.current = null;
      bodiesRef.current = {};
      wallsRef.current  = [];
      engineRef.current = null;
      runnerRef.current = null;
      mouseRef.current  = null;

      container.classList.remove("playground--static", "skill-playground--ready");
    };
  }, []);

  /* ------------------------------ */
  /*  Render                        */
  /* ------------------------------ */
  return (
    <section
      ref={sectionRef}
      className="skill-section relative isolate w-full"
      aria-labelledby="skills-heading"
    >
      {/* header */}
      <div className="skill-header">
        <h2 id="skills-heading" className="skill-title ">Tools of My Craft.</h2>
        <p className="skill-desc">
          A collection of technologies, tools, and creative techniques I use
          to turn ideas into interactive digital experiences.
        </p>
      </div>

      {/* physics playground (container) */}
      <div
        ref={playgroundRef}
        className="skill-playground"
        role="region"
        aria-label="Interactive skills playground"
      >
        {SKILLS.map((skill) => (
          <div
            key={skill.id}
            ref={(el) => { if (el) chipRefs.current[skill.id] = el; }}
            className="chip"
            data-category={skill.category}
            data-skill-id={skill.id}
          >
            <span className="chip__dot" aria-hidden="true" />
            <span className="chip__label">{skill.name}</span>
          </div>
        ))}

        <p className="skill-hint" aria-hidden="true">
          <span className="skill-hint__desktop">DRAG THE TOOLS</span>
          <span className="skill-hint__mobile">TOUCH, DRAG &amp; EXPLORE</span>
        </p>
      </div>

      {/* screen-reader list */}
      <ul className="sr-only">
        {SKILLS.map((s) => <li key={`sr-${s.id}`}>{s.name}</li>)}
      </ul>
    </section>
  );
}

export default Skill;
