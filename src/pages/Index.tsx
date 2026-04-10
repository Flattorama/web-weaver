import { useState, useEffect, useRef } from "react";

// ─── PALETTE ────────────────────────────────────────────────────────────────
const C = {
  bg:         "#0D4A47",
  bgAlt:      "#111410",
  bgDark:     "#091A18",
  gold:       "#C9973A",
  goldLight:  "#E8C97A",
  goldBright: "#F0D68A",
  cream:      "#F5EDD6",
  creamMuted: "#C8B99A",
  border:     "rgba(201,151,58,0.25)",
  borderGold: "rgba(201,151,58,0.5)",
};

const fonts = {
  display: "'Playfair Display', Georgia, serif",
  heading: "'Josefin Sans', sans-serif",
  body: "'Lora', Georgia, serif",
};

const sectionPadding: React.CSSProperties = {
  padding: "100px 24px",
  maxWidth: "960px",
  margin: "0 auto",
};

const labelStyle: React.CSSProperties = {
  fontFamily: fonts.heading,
  fontSize: "12px",
  letterSpacing: "4px",
  textTransform: "uppercase",
  color: C.gold,
  marginBottom: "16px",
};

const h2Style: React.CSSProperties = {
  fontFamily: fonts.display,
  fontSize: "clamp(32px, 5vw, 48px)",
  color: C.cream,
  lineHeight: 1.2,
  marginBottom: "24px",
  fontWeight: 700,
};

const bodyStyle: React.CSSProperties = {
  fontFamily: fonts.body,
  fontSize: "17px",
  lineHeight: 1.8,
  color: C.creamMuted,
};

// ─── ART DECO SVG ELEMENTS ─────────────────────────────────────────────────

const DecoCorner = ({ style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <svg width="60" height="60" viewBox="0 0 60 60" style={style}>
    <path d="M0 0 L60 0 L60 8 L8 8 L8 60 L0 60 Z" fill={C.gold} opacity="0.6" />
    <path d="M0 0 L50 0 L50 3 L3 3 L3 50 L0 50 Z" fill={C.gold} opacity="0.3" />
  </svg>
);

const DecoSunburst = ({ width = 200 }: { width?: number }) => (
  <svg width={width} height="40" viewBox="0 0 200 40" style={{ display: "block", margin: "0 auto" }}>
    <line x1="0" y1="20" x2="70" y2="20" stroke={C.gold} strokeWidth="1" opacity="0.5" />
    <line x1="130" y1="20" x2="200" y2="20" stroke={C.gold} strokeWidth="1" opacity="0.5" />
    {[...Array(7)].map((_, i) => (
      <line
        key={i}
        x1="100"
        y1="20"
        x2={100 + Math.cos((i * Math.PI) / 6 - Math.PI / 2) * 18}
        y2={20 + Math.sin((i * Math.PI) / 6 - Math.PI / 2) * 18}
        stroke={C.gold}
        strokeWidth="1.5"
        opacity="0.6"
      />
    ))}
    <circle cx="100" cy="20" r="3" fill={C.gold} opacity="0.8" />
  </svg>
);

const DecoDivider = () => (
  <div style={{ padding: "40px 0", textAlign: "center" }}>
    <svg width="300" height="24" viewBox="0 0 300 24" style={{ display: "block", margin: "0 auto" }}>
      <line x1="0" y1="12" x2="120" y2="12" stroke={C.gold} strokeWidth="1" opacity="0.4" />
      <line x1="180" y1="12" x2="300" y2="12" stroke={C.gold} strokeWidth="1" opacity="0.4" />
      <polygon points="150,2 158,12 150,22 142,12" fill="none" stroke={C.gold} strokeWidth="1.5" opacity="0.6" />
      <polygon points="150,6 154,12 150,18 146,12" fill={C.gold} opacity="0.4" />
    </svg>
  </div>
);

const DecoBorderFrame = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ position: "relative", border: `1px solid ${C.border}`, padding: "48px 32px", ...style }}>
    <DecoCorner style={{ position: "absolute", top: -1, left: -1 }} />
    <DecoCorner style={{ position: "absolute", top: -1, right: -1, transform: "scaleX(-1)" }} />
    <DecoCorner style={{ position: "absolute", bottom: -1, left: -1, transform: "scaleY(-1)" }} />
    <DecoCorner style={{ position: "absolute", bottom: -1, right: -1, transform: "scale(-1)" }} />
    {children}
  </div>
);

// ─── FILM GRAIN OVERLAY ────────────────────────────────────────────────────
const FilmGrain = () => (
  <div
    style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 9999, opacity: 0.04, mixBlendMode: "overlay",
    }}
  >
    <svg width="100%" height="100%">
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves={3} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  </div>
);

// ─── SCROLL ANIMATION HOOK ─────────────────────────────────────────────────
const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, visible] as const;
};

const RevealSection = ({ children, style = {}, delay = 0 }: { children: React.ReactNode; style?: React.CSSProperties; delay?: number }) => {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ─── NAVIGATION ─────────────────────────────────────────────────────────────
const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "The Evening", href: "#evening" },
    { label: "The Bands", href: "#bands" },
    { label: "The Venue", href: "#venue" },
    { label: "Tickets", href: "#tickets" },
    { label: "FAQ", href: "#faq" },
  ];

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: scrolled ? "12px 24px" : "20px 24px",
        background: scrolled ? "rgba(9,26,24,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        transition: "all 0.4s ease",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: fonts.heading, fontSize: "13px", letterSpacing: "3px",
          textTransform: "uppercase", color: C.gold, cursor: "pointer",
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Still Life Retreat
      </div>

      <div style={{ display: "flex", gap: "32px" }} className="nav-desktop">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
            style={{
              fontFamily: fonts.heading, fontSize: "11px", letterSpacing: "2px",
              textTransform: "uppercase", color: C.creamMuted, textDecoration: "none",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.gold)}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = C.creamMuted)}
          >
            {link.label}
          </a>
        ))}
      </div>

      <button
        className="nav-mobile-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: "none", background: "none", border: "none",
          color: C.gold, fontSize: "24px", cursor: "pointer",
        }}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {menuOpen && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(9,26,24,0.97)",
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: "32px", zIndex: 999,
          }}
        >
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: "absolute", top: "20px", right: "24px",
              background: "none", border: "none", color: C.gold,
              fontSize: "28px", cursor: "pointer",
            }}
          >
            ✕
          </button>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
              style={{
                fontFamily: fonts.heading, fontSize: "16px", letterSpacing: "4px",
                textTransform: "uppercase", color: C.cream, textDecoration: "none",
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

// ─── HERO SECTION ───────────────────────────────────────────────────────────
const Hero = () => (
  <section
    style={{
      position: "relative", minHeight: "100vh",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", textAlign: "center",
      background: `radial-gradient(ellipse at 50% 30%, ${C.bg} 0%, ${C.bgDark} 70%, ${C.bgAlt} 100%)`,
      overflow: "hidden", padding: "40px 24px",
    }}
  >
    <div
      style={{
        position: "absolute", top: "20px", left: "20px", right: "20px", bottom: "20px",
        border: `1px solid ${C.border}`, pointerEvents: "none",
      }}
    >
      <DecoCorner style={{ position: "absolute", top: -1, left: -1 }} />
      <DecoCorner style={{ position: "absolute", top: -1, right: -1, transform: "scaleX(-1)" }} />
      <DecoCorner style={{ position: "absolute", bottom: -1, left: -1, transform: "scaleY(-1)" }} />
      <DecoCorner style={{ position: "absolute", bottom: -1, right: -1, transform: "scale(-1)" }} />
    </div>

    <DecoSunburst width={160} />

    <div style={{ marginTop: "32px", marginBottom: "16px" }}>
      <span style={{ ...labelStyle, fontSize: "11px", letterSpacing: "5px" }}>
        STILL LIFE RETREAT PRESENTS
      </span>
    </div>

    <h1
      style={{
        fontFamily: fonts.display, fontSize: "clamp(36px, 8vw, 80px)",
        fontWeight: 700, color: C.cream, lineHeight: 1.1,
        marginBottom: "8px", maxWidth: "800px",
      }}
    >
      A Roaring Twenties
      <br />
      <span style={{ color: C.gold, fontStyle: "italic" }}>Night Under the Stars</span>
    </h1>

    <div style={{ margin: "24px 0" }}>
      <DecoSunburst width={120} />
    </div>

    <p
      style={{
        fontFamily: fonts.heading, fontSize: "13px", letterSpacing: "4px",
        textTransform: "uppercase", color: C.goldLight, marginBottom: "8px",
      }}
    >
      Featuring
    </p>

    <p
      style={{
        fontFamily: fonts.display, fontSize: "clamp(22px, 4vw, 36px)",
        color: C.cream, fontWeight: 600, marginBottom: "32px", lineHeight: 1.3,
      }}
    >
      Tell It To Sweeney{" "}
      <span style={{ color: C.gold, fontFamily: fonts.heading, fontSize: "16px", letterSpacing: "2px" }}>
        &amp;
      </span>{" "}
      The Honeyrunners
    </p>

    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginBottom: "40px" }}>
      <p style={{ fontFamily: fonts.display, fontSize: "clamp(20px, 3.5vw, 28px)", color: C.goldBright, fontWeight: 600 }}>
        Saturday, August 15, 2026
      </p>
      <p style={{ fontFamily: fonts.heading, fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", color: C.creamMuted }}>
        Still Life Retreat &nbsp;·&nbsp; Durham, Ontario
      </p>
      <p style={{ fontFamily: fonts.body, fontSize: "14px", color: C.creamMuted, fontStyle: "italic", marginTop: "4px" }}>
        Limited trailer space, very limited Airbnb room space. &nbsp;·&nbsp; Leave No Trace event
      </p>
    </div>

    <a
      href="#tickets"
      onClick={(e) => { e.preventDefault(); document.querySelector("#tickets")?.scrollIntoView({ behavior: "smooth" }); }}
      className="cta-button"
      style={{
        display: "inline-block", fontFamily: fonts.heading, fontSize: "13px",
        letterSpacing: "4px", textTransform: "uppercase", color: C.bgAlt,
        background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
        padding: "16px 48px", textDecoration: "none", transition: "all 0.3s ease", cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.background = `linear-gradient(135deg, ${C.goldLight}, ${C.goldBright})`;
        el.style.transform = "translateY(-2px)";
        el.style.boxShadow = "0 8px 32px rgba(201,151,58,0.3)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.background = `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      Get Your Ticket
    </a>

    <p
      style={{
        fontFamily: fonts.body, fontSize: "13px", color: C.creamMuted,
        marginTop: "48px", fontStyle: "italic", opacity: 0.6,
      }}
    >
      "The password is: you're invited."
    </p>
  </section>
);

// ─── THE EVENING SECTION ────────────────────────────────────────────────────
const Evening = () => (
  <section id="evening" style={{ background: C.bgAlt, position: "relative" }}>
    <div style={sectionPadding}>
      <RevealSection>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={labelStyle}>The Evening</p>
          <h2 style={h2Style}>
            One Night. Two Bands.
            <br />
            <span style={{ color: C.gold }}>An Event Frozen in Time.</span>
          </h2>
        </div>
      </RevealSection>

      <RevealSection delay={0.15}>
        <DecoBorderFrame>
          <div style={{ ...bodyStyle, textAlign: "center" }}>
            <p style={{ marginBottom: "24px" }}>
              On a warm August evening, the grounds of Still Life Retreat transform into a
              jazz-age affair hidden deep in Ontario's Grey County. Ninety-two acres of private
              lakefront, gardens, and meadow become the backdrop for a night of soul, swing,
              and spectacle — dressed in flapper fringe and zoot-suit flair.
            </p>
            <p style={{ marginBottom: "24px" }}>
              This is not a festival. It's an invitation. A single evening where two extraordinary
              bands — The Honeyrunners and Tell It To Sweeney — play under open sky, light
              food is served, and the dress code is the Roaring Twenties. Costumes aren't
              optional; they're the price of admission to the atmosphere.
            </p>
            <p style={{ marginBottom: "0" }}>
              Stargazing space is available. Trailer space is available for a fee. Very limited Airbnb space is available. And when the last note fades into
              the trees, you'll wish the twenties never ended.
            </p>
          </div>
        </DecoBorderFrame>
      </RevealSection>

      <DecoDivider />

      <RevealSection delay={0.2}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "32px",
            textAlign: "center",
          }}
        >
          {[
            { icon: "🎭", title: "Costume Required", desc: "Flapper dresses, zoot suits, and all the jazz-age glamour you can muster." },
            { icon: "🌲", title: "Leave No Trace", desc: "We honour the land. Pack in, pack out, and leave only footprints." },
            { icon: "🛖", title: "Very Limited Bed Spaces", desc: "Text 647-300-2442 to inquire. Please identify the event and yourself." },
            { icon: "🍽", title: "Light Passed Hors d'oeuvres", desc: "Light passed hors d'oeuvres will be served." },
          ].map((item) => (
            <div key={item.title} style={{ padding: "24px 16px" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>{item.icon}</div>
              <h3
                style={{
                  fontFamily: fonts.heading, fontSize: "12px", letterSpacing: "3px",
                  textTransform: "uppercase", color: C.gold, marginBottom: "8px",
                }}
              >
                {item.title}
              </h3>
              <p style={{ ...bodyStyle, fontSize: "15px" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </RevealSection>
    </div>
  </section>
);

// ─── THE BANDS SECTION ──────────────────────────────────────────────────────
const BandCard = ({ name, description, links, delay = 0 }: { name: string; description: string[]; links: { label: string; url: string }[]; delay?: number }) => (
  <RevealSection delay={delay}>
    <div
      style={{
        background: `linear-gradient(180deg, rgba(13,74,71,0.4) 0%, rgba(17,20,16,0.6) 100%)`,
        border: `1px solid ${C.border}`, padding: "48px 32px",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "60px", height: "3px",
          background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
        }}
      />
      <p style={{ ...labelStyle, marginBottom: "12px" }}>Featuring</p>
      <h3
        style={{
          fontFamily: fonts.display, fontSize: "clamp(26px, 4vw, 36px)",
          color: C.cream, fontWeight: 700, marginBottom: "24px", lineHeight: 1.2,
        }}
      >
        {name}
      </h3>
      <div style={{ ...bodyStyle, marginBottom: "28px", maxWidth: "480px", margin: "0 auto 28px" }}>
        {description.map((p, i) => (
          <p key={i} style={{ marginBottom: i < description.length - 1 ? "16px" : 0 }}>{p}</p>
        ))}
      </div>
      <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: fonts.heading, fontSize: "11px", letterSpacing: "2px",
              textTransform: "uppercase", color: C.gold, textDecoration: "none",
              padding: "8px 16px", border: `1px solid ${C.border}`, transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = C.gold;
              el.style.background = "rgba(201,151,58,0.1)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.borderColor = C.border;
              el.style.background = "transparent";
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  </RevealSection>
);

const BandPhotoGallery = () => (
  <RevealSection delay={0.1}>
    <div
      className="band-photo-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "4px",
        marginBottom: "48px",
        border: `1px solid ${C.border}`,
        overflow: "hidden",
      }}
    >
      {[
        { src: "/images/bands/honeyrunners-dan.jpg", alt: "Dan Dwoskin performing" },
        { src: "/images/bands/honeyrunners-keys.jpg", alt: "The Honeyrunners live" },
        { src: "/images/bands/honeyrunners-duo.jpg", alt: "The Honeyrunners on stage" },
        { src: "/images/bands/honeyrunners-band.jpg", alt: "The Honeyrunners full band" },
      ].map((img) => (
        <div key={img.src} style={{ position: "relative", paddingBottom: "100%", overflow: "hidden", background: C.bgDark }}>
          <img
            src={`${import.meta.env.BASE_URL}${img.src.replace(/^\//, "")}`}
            alt={img.alt}
            loading="lazy"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "saturate(0.7) contrast(1.1)",
              transition: "filter 0.4s ease, transform 0.6s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.filter = "saturate(1) contrast(1.05)";
              el.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.filter = "saturate(0.7) contrast(1.1)";
              el.style.transform = "scale(1)";
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
              opacity: 0.5,
            }}
          />
        </div>
      ))}
    </div>
  </RevealSection>
);

const Bands = () => (
  <section id="bands" style={{ background: C.bg, position: "relative" }}>
    <div style={sectionPadding}>
      <RevealSection>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={labelStyle}>The Bands</p>
          <h2 style={h2Style}>
            Soul With Teeth.{" "}
            <span style={{ color: C.gold }}>Movement With Momentum.</span>
          </h2>
        </div>
      </RevealSection>
      <BandPhotoGallery />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "32px" }}>
        <BandCard
          name="Tell It To Sweeney"
          delay={0.1}
          description={[
            "Energetic, genre-blending, and unapologetically original. This nine-piece ensemble fuses infectious grooves, catchy hooks, and heartfelt lyricism with a live show that moves you — body and soul.",
            "Since 2017, Tell It To Sweeney has shared stages with David Wilcox and platinum-selling artist Coleman Hell, headlined Toronto's Beaches International Jazz Festival, and lit up festivals across Ontario.",
            "With a growing fanbase and an ever-evolving sound, they continue to push creative boundaries while staying rooted in the energy and community that drives their music.",
          ]}
          links={[
            { label: "Spotify", url: "https://open.spotify.com/artist/3k3ISFCWFS2MRcp3epbs20" },
            { label: "Instagram", url: "https://www.instagram.com/tellittosweeney" },
            { label: "Facebook", url: "https://www.facebook.com/tellittosweeneyband" },
            { label: "YouTube", url: "https://www.youtube.com/@tellittosweeney" },
            { label: "TikTok", url: "https://www.tiktok.com/@tellittosweeneyband" },
          ]}
        />
        <BandCard
          name="The Honeyrunners"
          delay={0.2}
          description={[
            "A Northern take on Southern Soul — hot-blooded and rife with the poetry of human folly. The energy of this Toronto six-piece is undeniable on stage and on record.",
            "Fronted by songwriter Dan Dwoskin and anchored by Canadian-Peruvian engineer Guillermo Subauste, The Honeyrunners have shared a decade of stages with The Sadies, Bahamas, Joel Plaskett, Jim Cuddy, Terra Lightfoot, and many more. Their debut album on Gypsy Soul Records hit 150+ radio stations across four continents.",
            "They're back in studio recording a raw batch of songs guaranteed to break a few hearts on the road in 2026.",
          ]}
          links={[
            { label: "Spotify", url: "https://open.spotify.com/artist/6sJKBtpEQZmSCSTb7LAtBZ" },
            { label: "Instagram", url: "https://www.instagram.com/honeyrunners" },
            { label: "Facebook", url: "https://www.facebook.com/honeyrunners" },
            { label: "YouTube", url: "https://www.youtube.com/honeyrunners" },
            { label: "TikTok", url: "https://www.tiktok.com/@honeyrunners" },
          ]}
        />
      </div>
    </div>
  </section>
);

// ─── THE VENUE SECTION ──────────────────────────────────────────────────────
const Venue = () => (
  <section id="venue" style={{ background: C.bgAlt, position: "relative" }}>
    <div style={sectionPadding}>
      <RevealSection>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={labelStyle}>The Venue</p>
          <h2 style={h2Style}>
            Ninety-Two Acres of{" "}
            <span style={{ color: C.gold }}>Private Wilderness</span>
          </h2>
        </div>
      </RevealSection>

      <RevealSection delay={0.15}>
        <DecoBorderFrame>
          <div style={{ ...bodyStyle, textAlign: "center" }}>
            <p style={{ marginBottom: "24px" }}>
              This rustic property sits on a private lake in Durham, Ontario — surrounded by
              sprawling woodlands, gardens, and spacious meadows. A tranquil oasis that transforms into
              something entirely different when the sun goes down and the band takes the stage.
            </p>
            <p>
              On August 15th, the grounds become a Roaring Twenties speakeasy under the stars.
              String lights in the trees. A stage framed by nature. And ninety-two acres of room
              to dance, wander, and lose yourself in the evening.
            </p>
          </div>
          <div style={{ marginTop: "32px", textAlign: "center" }}>
            <p style={{ fontFamily: fonts.heading, fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", color: C.gold, marginBottom: "8px" }}>
              394591 Concession 2, Durham, West Grey, ON
            </p>
          </div>
        </DecoBorderFrame>
      </RevealSection>

      <RevealSection delay={0.25}>
        <div
          style={{
            marginTop: "48px", border: `1px solid ${C.border}`, overflow: "hidden",
            height: "360px", background: C.bgDark, display: "flex",
            alignItems: "center", justifyContent: "center",
          }}
        >
          <iframe
            title="Still Life Retreat Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5689.0!2d-80.8133!3d44.1767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s!2s394591+Concession+2,+Durham,+West+Grey,+ON!5e0!3m2!1sen!2sca!4v1"
            width="100%"
            height="360"
            style={{ border: 0, filter: "saturate(0.6) brightness(0.8) contrast(1.1)" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </RevealSection>
    </div>
  </section>
);

// ─── TICKETS SECTION ────────────────────────────────────────────────────────
const Tickets = () => (
  <section
    id="tickets"
    style={{ background: `linear-gradient(180deg, ${C.bg} 0%, ${C.bgDark} 100%)`, position: "relative" }}
  >
    <div style={sectionPadding}>
      <RevealSection>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={labelStyle}>Tickets</p>
          <h2 style={h2Style}>
            Secure Your Place{" "}
            <span style={{ color: C.gold }}>at the Table</span>
          </h2>
          <p style={{ ...bodyStyle, maxWidth: "560px", margin: "0 auto" }}>
            Bed spaces are first-come, first-served and shared. The Airbnb accommodates up to 10 guests. There are 4 trailers sleeping up to 8 total. $100/person. All accommodation is at the discretion of the property owner. All ticket holders must complete a waiver prior to the event.
          </p>
        </div>
      </RevealSection>

      <RevealSection delay={0.15}>
        <div
          style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px", maxWidth: "700px", margin: "0 auto",
          }}
        >
          {/* General Admission */}
          <div style={{ border: `1px solid ${C.border}`, padding: "40px 28px", textAlign: "center", background: "rgba(13,74,71,0.2)", position: "relative" }}>
            <p style={{ fontFamily: fonts.heading, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: C.creamMuted, marginBottom: "16px" }}>
              General Admission
            </p>
            <p style={{ fontFamily: fonts.display, fontSize: "48px", fontWeight: 700, color: C.cream, marginBottom: "8px" }}>
              $<span style={{ color: C.gold }}>75</span>
            </p>
            <p style={{ ...bodyStyle, fontSize: "14px", marginBottom: "28px" }}>
              Entry to the evening. Music, food, and atmosphere included.
            </p>
            <a
              href="#"
              style={{
                display: "inline-block", fontFamily: fonts.heading, fontSize: "12px",
                letterSpacing: "3px", textTransform: "uppercase", color: C.bgAlt,
                background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                padding: "14px 36px", textDecoration: "none", transition: "all 0.3s ease",
              }}
            >
              Purchase
            </a>
          </div>

          {/* Cabin Experience */}
          <div style={{ border: `2px solid ${C.gold}`, padding: "40px 28px", textAlign: "center", background: "rgba(201,151,58,0.06)", position: "relative" }}>
            <div
              style={{
                position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                background: C.gold, color: C.bgAlt, fontFamily: fonts.heading,
                fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", padding: "4px 16px",
              }}
            >
              Limited
            </div>
            <p style={{ fontFamily: fonts.heading, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: C.creamMuted, marginBottom: "16px" }}>
              Bed Space
            </p>
            <p style={{ fontFamily: fonts.display, fontSize: "48px", fontWeight: 700, color: C.cream, marginBottom: "8px" }}>
              $<span style={{ color: C.gold }}>100</span>
            </p>
            <p style={{ ...bodyStyle, fontSize: "14px", marginBottom: "28px" }}>
              Bed and restroom access (shared).
            </p>
            <a
              href="#"
              style={{
                display: "inline-block", fontFamily: fonts.heading, fontSize: "12px",
                letterSpacing: "3px", textTransform: "uppercase", color: C.bgAlt,
                background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
                padding: "14px 36px", textDecoration: "none", transition: "all 0.3s ease",
              }}
            >
              Purchase
            </a>
          </div>
        </div>
      </RevealSection>

      <RevealSection delay={0.25}>
        <p style={{ ...bodyStyle, fontSize: "14px", textAlign: "center", marginTop: "40px", fontStyle: "italic", opacity: 0.7 }}>
          Ticket Tailor widget or Stripe Payment Link will be embedded here.
          <br />
          Waiver signing integrated into the checkout flow.
        </p>
      </RevealSection>
    </div>
  </section>
);

// ─── RULES OF THE HOUSE ─────────────────────────────────────────────────────
const Rules = () => (
  <section style={{ background: C.bgAlt, position: "relative" }}>
    <div style={sectionPadding}>
      <RevealSection>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={labelStyle}>The Rules of the House</p>
          <h2 style={h2Style}>
            Every Good Speakeasy{" "}
            <span style={{ color: C.gold }}>Has Its Rules</span>
          </h2>
        </div>
      </RevealSection>

      <RevealSection delay={0.15}>
        <div
          style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px", maxWidth: "800px", margin: "0 auto",
          }}
        >
          {[
            { title: "Dress the Part", body: "Costumes are mandatory. Flapper dresses, zoot suits, suspenders, feather boas, finger waves — commit to the era. This is not a suggestion; it's the spirit of the evening." },
            { title: "Leave No Trace", body: "We are guests of this land. Everything you bring in, you bring out. Respect the property, the wildlife, and each other." },
            { title: "Waiver Required", body: "All attendees must sign a liability waiver before or upon arrival. The waiver will be available digitally during the ticket purchase process." },
            { title: "Light Food & Drink", body: "Light food will be served as part of the evening. Details on food and beverage service will be shared closer to the event." },
          ].map((rule) => (
            <div key={rule.title} style={{ padding: "32px 24px", border: `1px solid ${C.border}`, background: "rgba(13,74,71,0.15)" }}>
              <h3 style={{ fontFamily: fonts.heading, fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", color: C.gold, marginBottom: "12px" }}>
                {rule.title}
              </h3>
              <p style={{ ...bodyStyle, fontSize: "15px" }}>{rule.body}</p>
            </div>
          ))}
        </div>
      </RevealSection>
    </div>
  </section>
);

// ─── FAQ SECTION ────────────────────────────────────────────────────────────
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: `1px solid ${C.border}`, padding: "20px 0" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", background: "none", border: "none", textAlign: "left",
          cursor: "pointer", display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "0",
        }}
      >
        <span style={{ fontFamily: fonts.display, fontSize: "18px", color: C.cream, fontWeight: 600, paddingRight: "16px" }}>
          {question}
        </span>
        <span
          style={{
            fontFamily: fonts.heading, fontSize: "20px", color: C.gold,
            transition: "transform 0.3s ease",
            transform: open ? "rotate(45deg)" : "rotate(0)", flexShrink: 0,
          }}
        >
          +
        </span>
      </button>
      <div
        style={{
          maxHeight: open ? "300px" : "0", overflow: "hidden",
          transition: "max-height 0.4s ease, opacity 0.4s ease",
          opacity: open ? 1 : 0,
        }}
      >
        <p style={{ ...bodyStyle, fontSize: "15px", marginTop: "12px", paddingRight: "40px" }}>
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQ = () => (
  <section id="faq" style={{ background: C.bg, position: "relative" }}>
    <div style={sectionPadding}>
      <RevealSection>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={labelStyle}>FAQ</p>
          <h2 style={h2Style}>
            Questions?{" "}
            <span style={{ color: C.gold }}>We've Got Answers.</span>
          </h2>
        </div>
      </RevealSection>

      <RevealSection delay={0.1}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <FAQItem question="Do I really have to dress up?" answer="Yes. Be your sparkly self in 20's gear." />
          <FAQItem question="What about parking?" answer="Limited parking is available." />
          <FAQItem question="Can I stargaze on the property?" answer="Stargazing is allowed in the meadow area behind the Barn." />
          <FAQItem question="Is there a refund policy?" answer="No refunds for this artist-supporting event." />
          <FAQItem question="Is the venue accessible?" answer="Much of the land is fairly flat and the house is fully wheelchair accessible. Please note that the surrounding fields are not wheelchair accessible." />
          <FAQItem question="What's the waiver about?" answer='Still Life Retreat is a "Use at Own Risk" property — no lifeguards.' />
          <FAQItem question="What time does the evening start and end?" answer="Feel free to join the property on Saturday after 6:00 pm and enjoy the sun and small beach area until Sunday at 6:00 pm." />
        </div>
      </RevealSection>
    </div>
  </section>
);

// ─── FOOTER ─────────────────────────────────────────────────────────────────
const SiteFooter = () => (
  <footer
    style={{
      background: C.bgAlt, borderTop: `1px solid ${C.border}`,
      padding: "60px 24px 40px", textAlign: "center",
    }}
  >
    <DecoSunburst width={120} />

    <p style={{ fontFamily: fonts.display, fontSize: "20px", color: C.cream, fontStyle: "italic", margin: "24px 0 32px" }}>
      "The password is: see you there."
    </p>

    <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap", marginBottom: "32px" }}>
      {[
        { label: "Shannon Leroux", url: "https://www.shannonleroux.com" },
        { label: "Still Life Retreat", url: "http://www.spiritual-love-inn.com" },
      ].map((link) => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: fonts.heading, fontSize: "11px", letterSpacing: "2px",
            textTransform: "uppercase", color: C.creamMuted, textDecoration: "none",
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = C.gold)}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = C.creamMuted)}
        >
          {link.label}
        </a>
      ))}
    </div>

    <div style={{ width: "60px", height: "1px", background: C.border, margin: "0 auto 24px" }} />

    <p style={{ fontFamily: fonts.body, fontSize: "12px", color: C.creamMuted, opacity: 0.5 }}>
      © 2026 Still Life Retreat. Site by{" "}
      <a href="https://lumin8.agency" target="_blank" rel="noopener noreferrer" style={{ color: C.creamMuted, textDecoration: "none" }}>
        Lumin8
      </a>
      .
    </p>
  </footer>
);

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────
const Index = () => (
  <>
    <FilmGrain />
    <Nav />
    <Hero />
    <Evening />
    <Bands />
    <Venue />
    <Tickets />
    <Rules />
    <FAQ />
    <SiteFooter />
  </>
);

export default Index;
