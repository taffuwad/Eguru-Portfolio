import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Contact.css";

gsap.registerPlugin(ScrollTrigger);

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY = "436a60b3-c4fa-4ce0-b984-15bedd77e7c3";

const TOP_TITLE = "LET'S WORK";

/* ------------------------------------------------------------------ */
/*  Wheel + hamster — replaces the “O” in “TO GATHER”                  */
/* ------------------------------------------------------------------ */
function WheelHamster({ innerRef }) {
  return (
    <span className="title-o wheel-and-hamster" aria-hidden="true" ref={innerRef}>
      <span className="wheel" />
      <span className="hamster">
        <span className="hamster__body">
          <span className="hamster__head">
            <span className="hamster__ear" />
            <span className="hamster__eye" />
            <span className="hamster__nose" />
          </span>
          <span className="hamster__limb hamster__limb--fr" />
          <span className="hamster__limb hamster__limb--fl" />
          <span className="hamster__limb hamster__limb--br" />
          <span className="hamster__limb hamster__limb--bl" />
          <span className="hamster__tail" />
        </span>
      </span>
      <span className="spoke" />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact                                                            */
/* ------------------------------------------------------------------ */
export default function Contact({ scrollInstance = null }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const line2Ref = useRef(null);
  const imgRef = useRef(null);
  const wheelRef = useRef(null);
  const formRef = useRef(null);
  const submitRef = useRef(null);
  const statusRef = useRef(null);

  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ text: "", error: false });

  /* ---------------------------------------------------------------- */
  /*  1 · Locomotive Scroll → ScrollTrigger bridge                     */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const scrollEl = document.querySelector("[data-scroll-container]");
    if (!scrollInstance || !scrollEl) return;

    const loco = scrollInstance;

    loco.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(scrollEl, {
      scrollTop(value) {
        if (arguments.length) {
          loco.scrollTo(value, { duration: 0, disableLerp: true });
        }
        return loco?.scroll?.instance?.scroll?.y ?? window.scrollY;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: scrollEl.style.transform ? "transform" : "fixed",
    });

    const onRefresh = () => loco.update();
    ScrollTrigger.addEventListener("refresh", onRefresh);
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      loco.off?.("scroll", ScrollTrigger.update);
    };
  }, [scrollInstance]);

  /* ---------------------------------------------------------------- */
  /*  2 · GSAP reveal / scroll animations                              */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const scrollEl = document.querySelector("[data-scroll-container]");
    const scroller = scrollInstance && scrollEl ? scrollEl : undefined;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section);

      /* --- “LET'S WORK” — masked character stagger --------------- */
      const chars = q(".contact-char");
      gsap.set(chars, { yPercent: 120, opacity: 0 });

      const intro = gsap.timeline({
        defaults: { ease: "power4.out" },
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          once: true,
          scroller,
        },
      });

      intro.to(chars, {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.03,
      });

      /* --- “T(🎡) GATHER” ---------------------------------------- */
      if (line2Ref.current) {
        intro.from(
          line2Ref.current,
          { yPercent: 45, opacity: 0, duration: 1 },
          "-=0.65"
        );
      }

      /* --- the wheel + hamster ----------------------------------- */
      if (wheelRef.current) {
        intro.from(
          wheelRef.current,
          {
            scale: 0,
            rotate: -180,
            opacity: 0,
            duration: 1.15,
            ease: "back.out(1.6)",
          },
          "-=0.95"
        );
      }

      /* --- the little image -------------------------------------- */
      if (imgRef.current) {
        intro.from(
          imgRef.current,
          { scale: 0.6, opacity: 0, duration: 0.85, ease: "power3.out" },
          "-=0.8"
        );
      }

      /* --- form rows --------------------------------------------- */
      q(".con-bottom .sec").forEach((row, i) => {
        gsap.from(row, {
          y: 55,
          opacity: 0,
          duration: 0.85,
          delay: i * 0.04,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 92%",
            scroller,
          },
        });
      });

      /* --- submit button ----------------------------------------- */
      if (submitRef.current) {
        gsap.from(submitRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: submitRef.current,
            start: "top 96%",
            scroller,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [scrollInstance]);

  /* ---------------------------------------------------------------- */
  /*  3 · Button hover micro-interaction (GSAP)                        */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const btn = submitRef.current;
    if (!btn) return;

    const enter = () =>
      gsap.to(btn, { scale: 1.05, y: -3, duration: 0.35, ease: "power3.out" });
    const leave = () =>
      gsap.to(btn, { scale: 1, y: 0, duration: 0.35, ease: "power3.out" });
    const down = () =>
      gsap.to(btn, { scale: 0.96, y: 1, duration: 0.15, ease: "power2.out" });
    const up = () =>
      gsap.to(btn, { scale: 1.05, y: -3, duration: 0.25, ease: "power3.out" });

    btn.addEventListener("mouseenter", enter);
    btn.addEventListener("mouseleave", leave);
    btn.addEventListener("mousedown", down);
    btn.addEventListener("mouseup", up);

    return () => {
      btn.removeEventListener("mouseenter", enter);
      btn.removeEventListener("mouseleave", leave);
      btn.removeEventListener("mousedown", down);
      btn.removeEventListener("mouseup", up);
    };
  }, []);

  /* ---------------------------------------------------------------- */
  /*  4 · Status message animation                                     */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    if (!status.text || !statusRef.current) return;
    gsap.fromTo(
      statusRef.current,
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" }
    );
  }, [status]);

  /* ---------------------------------------------------------------- */
  /*  5 · Submit                                                       */
  /* ---------------------------------------------------------------- */
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();

    const form = formRef.current;
    if (!form) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setSending(true);
    setStatus({ text: "", error: false });

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Web3Forms submission failed.");
      }

      form.reset();
      setStatus({ text: "MESSAGE SENT — THANK YOU.", error: false });
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setStatus({
        text: "Something went wrong. Please try again.",
        error: true,
      });
    } finally {
      setSending(false);
    }
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <section
      className="contact"
      id="contact"
      ref={sectionRef}
      data-scroll-section
    >
      {/* ------------------------- TOP ------------------------- */}
      <div className="con-top">
        <h1 className="text" ref={titleRef} aria-label={TOP_TITLE}>
          {TOP_TITLE.split("").map((char, i) => (
            <span className="contact-char" key={`${char}-${i}`} aria-hidden="true">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        <div className="box">

          <h1 aria-label="TO GATHER" ref={line2Ref}>
            <span aria-hidden="true">T</span>
            <WheelHamster innerRef={wheelRef} />
            <span aria-hidden="true">{"\u00A0"}GATHER</span>
          </h1>
        </div>
      </div>

      {/* ------------------------ BOTTOM ----------------------- */}
      <div className="con-bottom">
        <form
          id="contact-form"
          ref={formRef}
          action={WEB3FORMS_ENDPOINT}
          method="POST"
          onSubmit={handleSubmit}
          noValidate
        >
          <input
            type="hidden"
            name="access_key"
            value={WEB3FORMS_ACCESS_KEY}
          />
          <input
            type="hidden"
            name="subject"
            value="New portfolio contact form submission"
          />

          <div className="sec">
            <span>NAME</span>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="FUWAD TALUKDER"
              autoComplete="name"
              required
            />
          </div>

          <div className="sec">
            <span>email</span>
            <input
              type="email"
              id="mail"
              className="email"
              name="email"
              placeholder="fuwadtalukderdev@gmail.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="sec">
            <span>Number</span>
            <input
              type="tel"
              id="number"
              name="number"
              placeholder="XXX XXXXX XXXXX"
              autoComplete="tel"
            />
          </div>

          <div className="sec">
            <span>Message</span>
            <textarea
              name="message"
              className="massage"
              id="massage"
              placeholder="GIVE US A SHORT PROJECT BRIEF, DEADLINE, BUDGET, ETC."
              required
            />
          </div>

          <button
            type="submit"
            className="send"
            ref={submitRef}
            disabled={sending}
          >
            {sending ? "SENDING..." : "SEND"}
          </button>

          {status.text && (
            <p
              ref={statusRef}
              className="contact-form-status"
              role="status"
              aria-live="polite"
              style={{ color: status.error ? "#a12424" : "#222" }}
            >
              {status.text}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}