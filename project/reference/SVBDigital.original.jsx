import { useState, useEffect, useRef } from "react";

// ============================================================================
// SVB Digital — Demo-Landingpage für Sachverständigenbüros
// ============================================================================

const COLORS = {
  dark: "#0A0E17",
  darkSoft: "#111827",
  card: "#1A2035",
  cardHover: "#1E2640",
  accent: "#C8A255",
  accentLight: "#D4B36A",
  accentGlow: "rgba(200,162,85,0.15)",
  text: "#E8E6E1",
  textMuted: "#8B8E96",
  border: "#2A2F3D",
  white: "#FAFAF8",
  success: "#4ADE80",
  error: "#F87171",
};

const FONT = {
  display: "'Playfair Display', Georgia, serif",
  body: "'DM Sans', 'Helvetica Neue', sans-serif",
};

export default function SVBDigital() {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", address: "",
    gutachtenart: "", anlass: "", message: "", dsgvo: false,
  });
  const [formStatus, setFormStatus] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.dsgvo) {
      setFormStatus("error");
      return;
    }
    setFormStatus("success");
    setTimeout(() => setFormStatus(null), 5000);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const navOpacity = Math.min(scrollY / 200, 1);

  return (
    <div style={{ background: COLORS.dark, color: COLORS.text, fontFamily: FONT.body, minHeight: "100vh", overflowX: "hidden" }}>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: `rgba(10,14,23,${navOpacity * 0.95})`,
        backdropFilter: navOpacity > 0.1 ? "blur(20px)" : "none",
        borderBottom: navOpacity > 0.3 ? `1px solid ${COLORS.border}` : "1px solid transparent",
        transition: "all 0.3s ease",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: FONT.display, fontWeight: 700, fontSize: 18, color: COLORS.dark,
            }}>S</div>
            <span style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>
              SVB <span style={{ color: COLORS.accent }}>Digital</span>
            </span>
          </div>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {["Leistungen", "Ablauf", "Kontakt"].map((item, i) => (
              <a key={i} href={`#${item.toLowerCase()}`} style={{
                color: COLORS.textMuted, textDecoration: "none", fontSize: 14, fontWeight: 500,
                letterSpacing: "0.02em", transition: "color 0.2s",
              }}
              onMouseEnter={e => e.target.style.color = COLORS.accent}
              onMouseLeave={e => e.target.style.color = COLORS.textMuted}
              >{item}</a>
            ))}
            <a href="tel:+4940123456789" style={{
              background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
              color: COLORS.dark, padding: "10px 20px", borderRadius: 8,
              textDecoration: "none", fontSize: 13, fontWeight: 600, letterSpacing: "0.02em",
            }}>+49 40 123 456 789</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} style={{
        minHeight: "100vh", display: "flex", alignItems: "center", position: "relative",
        overflow: "hidden",
      }}>
        {/* Background grid pattern */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: `linear-gradient(${COLORS.accent} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.accent} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
        {/* Accent glow */}
        <div style={{
          position: "absolute", top: "20%", right: "-10%", width: 600, height: 600,
          borderRadius: "50%", background: COLORS.accentGlow, filter: "blur(120px)",
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 720 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: COLORS.accentGlow, border: `1px solid rgba(200,162,85,0.2)`,
              borderRadius: 100, padding: "6px 16px", marginBottom: 32,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.success }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: COLORS.accent, letterSpacing: "0.04em" }}>
                JETZT ERREICHBAR — AUCH AUSSERHALB DER BÜROZEITEN
              </span>
            </div>

            <h1 style={{
              fontFamily: FONT.display, fontSize: "clamp(40px, 5.5vw, 72px)",
              fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.03em",
              marginBottom: 24, color: COLORS.white,
            }}>
              Ihr Gutachten.{" "}
              <span style={{ color: COLORS.accent }}>Präzise.</span>
              <br />
              <span style={{ color: COLORS.accent }}>Zuverlässig.</span>
              {" "}Unabhängig.
            </h1>

            <p style={{
              fontSize: 18, lineHeight: 1.7, color: COLORS.textMuted, maxWidth: 560, marginBottom: 40,
            }}>
              Verkehrswertgutachten, Beleihungswertgutachten und Schadensgutachten — 
              zertifiziert, gerichtsfest und termingerecht. Seit über 20 Jahren Ihr Partner für Immobilienbewertung.
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a href="#kontakt" style={{
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
                color: COLORS.dark, padding: "16px 32px", borderRadius: 12,
                textDecoration: "none", fontSize: 15, fontWeight: 600, letterSpacing: "0.01em",
                boxShadow: `0 8px 32px rgba(200,162,85,0.25)`,
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 40px rgba(200,162,85,0.35)"; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 32px rgba(200,162,85,0.25)"; }}
              >Kostenlose Erstberatung</a>
              <a href="tel:+4940123456789" style={{
                border: `1px solid ${COLORS.border}`, color: COLORS.text,
                padding: "16px 32px", borderRadius: 12, textDecoration: "none",
                fontSize: 15, fontWeight: 500, background: "rgba(255,255,255,0.03)",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={e => e.target.style.borderColor = COLORS.accent}
              onMouseLeave={e => e.target.style.borderColor = COLORS.border}
              >Jetzt anrufen →</a>
            </div>

            {/* Trust indicators */}
            <div style={{ display: "flex", gap: 40, marginTop: 56, flexWrap: "wrap" }}>
              {[
                { num: "20+", label: "Jahre Erfahrung" },
                { num: "2.500+", label: "Gutachten erstellt" },
                { num: "100%", label: "Gerichtsfest" },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ fontFamily: FONT.display, fontSize: 28, fontWeight: 600, color: COLORS.accent }}>{item.num}</div>
                  <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LEISTUNGEN */}
      <section id="leistungen" style={{ padding: "100px 24px", position: "relative" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Leistungen
            </span>
            <h2 style={{
              fontFamily: FONT.display, fontSize: "clamp(28px, 3.5vw, 42px)",
              fontWeight: 600, marginTop: 12, color: COLORS.white, letterSpacing: "-0.02em",
            }}>Unsere Gutachtenleistungen</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              {
                icon: "◈", title: "Verkehrswertgutachten",
                desc: "Ermittlung des Marktwerts Ihrer Immobilie nach § 194 BauGB — gerichtsfest und anerkannt.",
                details: "Erbschaft · Scheidung · Kauf/Verkauf",
              },
              {
                icon: "◇", title: "Beleihungswertgutachten",
                desc: "Wertermittlung zur Absicherung von Finanzierungen gemäß BelWertV.",
                details: "Banken · Sparkassen · Versicherungen",
              },
              {
                icon: "△", title: "Schadensgutachten",
                desc: "Dokumentation und Bewertung von Baumängeln, Feuchtigkeitsschäden und Bauschäden.",
                details: "Versicherung · Gericht · Privat",
              },
              {
                icon: "○", title: "Beratung & Kurzgutachten",
                desc: "Erste Einschätzung und Marktpreisindikation für Ihre schnelle Entscheidungsgrundlage.",
                details: "Orientierung · Kaufentscheidung",
              },
            ].map((s, i) => (
              <div key={i} style={{
                background: COLORS.card, border: `1px solid ${COLORS.border}`,
                borderRadius: 16, padding: "32px 28px",
                transition: "border-color 0.3s, transform 0.2s",
                cursor: "default",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accent; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{
                  fontSize: 28, color: COLORS.accent, marginBottom: 20,
                  width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center",
                  background: COLORS.accentGlow, borderRadius: 12,
                }}>{s.icon}</div>
                <h3 style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 600, marginBottom: 12, color: COLORS.white }}>{s.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: COLORS.textMuted, marginBottom: 16 }}>{s.desc}</p>
                <span style={{ fontSize: 12, color: COLORS.accent, fontWeight: 500, letterSpacing: "0.02em" }}>{s.details}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABLAUF */}
      <section id="ablauf" style={{ padding: "100px 24px", background: COLORS.darkSoft }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>Ablauf</span>
            <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 600, marginTop: 12, color: COLORS.white, letterSpacing: "-0.02em" }}>
              In 5 Schritten zum Gutachten
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 0 }}>
            {[
              { nr: "01", title: "Anfrage", desc: "Sie kontaktieren uns per Formular, Telefon oder Chat." },
              { nr: "02", title: "Angebot", desc: "Sie erhalten ein transparentes Honorarangebot." },
              { nr: "03", title: "Besichtigung", desc: "Unser Sachverständiger besichtigt die Immobilie vor Ort." },
              { nr: "04", title: "Erstellung", desc: "Das Gutachten wird erstellt und qualitätsgeprüft." },
              { nr: "05", title: "Übergabe", desc: "Sie erhalten das fertige Gutachten — digital und gedruckt." },
            ].map((step, i) => (
              <div key={i} style={{ textAlign: "center", padding: "24px 16px", position: "relative" }}>
                <div style={{
                  fontFamily: FONT.display, fontSize: 36, fontWeight: 700,
                  color: COLORS.accent, opacity: 0.3, marginBottom: 12,
                }}>{step.nr}</div>
                <h4 style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 600, color: COLORS.white, marginBottom: 8 }}>{step.title}</h4>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: COLORS.textMuted }}>{step.desc}</p>
                {i < 4 && <div style={{ position: "absolute", top: 42, right: -8, color: COLORS.border, fontSize: 18 }}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ERREICHBARKEIT — 3 Kanäle */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>Erreichbarkeit</span>
            <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 600, marginTop: 12, color: COLORS.white, letterSpacing: "-0.02em" }}>
              Drei Wege zu uns — rund um die Uhr
            </h2>
            <p style={{ fontSize: 16, color: COLORS.textMuted, marginTop: 12, maxWidth: 560, margin: "12px auto 0" }}>
              Ob per Formular, Chat oder Telefon — wir sind für Sie da. Auch außerhalb der Geschäftszeiten.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              {
                icon: "✉", title: "Kontaktformular",
                desc: "Beschreiben Sie Ihr Anliegen und wir melden uns innerhalb von 24 Stunden.",
                badge: "Sofortige Bestätigung",
                action: "Zum Formular ↓",
                href: "#kontakt",
              },
              {
                icon: "💬", title: "KI-Assistent",
                desc: "Unser digitaler Berater beantwortet Ihre Fragen sofort — zu Gutachtenarten, Kosten und Ablauf.",
                badge: "24/7 verfügbar",
                action: "Chat starten",
                href: "#",
              },
              {
                icon: "📞", title: "Telefonassistent",
                desc: "Rufen Sie an und unser KI-Telefonassistent nimmt Ihr Anliegen auf — kompetent und freundlich.",
                badge: "Sofort erreichbar",
                action: "+49 40 123 456 789",
                href: "tel:+4940123456789",
              },
            ].map((ch, i) => (
              <a key={i} href={ch.href} style={{
                background: COLORS.card, border: `1px solid ${COLORS.border}`,
                borderRadius: 16, padding: "32px 28px", textDecoration: "none",
                transition: "border-color 0.3s, transform 0.2s", display: "block",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accent; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>{ch.icon}</div>
                <div style={{
                  display: "inline-block", fontSize: 10, fontWeight: 600, color: COLORS.accent,
                  background: COLORS.accentGlow, padding: "4px 10px", borderRadius: 100,
                  letterSpacing: "0.04em", marginBottom: 16,
                }}>{ch.badge}</div>
                <h3 style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 600, color: COLORS.white, marginBottom: 10 }}>{ch.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: COLORS.textMuted, marginBottom: 20 }}>{ch.desc}</p>
                <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.accent }}>{ch.action}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* KONTAKTFORMULAR */}
      <section id="kontakt" style={{ padding: "100px 24px", background: COLORS.darkSoft }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>Kontakt</span>
            <h2 style={{ fontFamily: FONT.display, fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 600, marginTop: 12, color: COLORS.white, letterSpacing: "-0.02em" }}>
              Kostenlose Erstberatung anfragen
            </h2>
          </div>

          <div style={{
            background: COLORS.card, border: `1px solid ${COLORS.border}`,
            borderRadius: 20, padding: "40px 36px",
          }}>
            {formStatus === "success" ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
                <h3 style={{ fontFamily: FONT.display, fontSize: 24, color: COLORS.white, marginBottom: 8 }}>Anfrage erhalten!</h3>
                <p style={{ color: COLORS.textMuted, fontSize: 15 }}>Wir melden uns innerhalb von 24 Stunden bei Ihnen.</p>
              </div>
            ) : (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <InputField label="Name *" value={formData.name} onChange={v => handleChange("name", v)} placeholder="Ihr vollständiger Name" />
                  <InputField label="Telefon *" value={formData.phone} onChange={v => handleChange("phone", v)} placeholder="+49 40 ..." type="tel" />
                  <InputField label="E-Mail" value={formData.email} onChange={v => handleChange("email", v)} placeholder="ihre@email.de" type="email" />
                  <InputField label="Objektadresse" value={formData.address} onChange={v => handleChange("address", v)} placeholder="Straße, PLZ Ort" />
                  <SelectField label="Gutachtenart" value={formData.gutachtenart} onChange={v => handleChange("gutachtenart", v)}
                    options={["Verkehrswertgutachten", "Beleihungswertgutachten", "Schadensgutachten", "Kurzgutachten / Beratung", "Sonstiges"]} />
                  <SelectField label="Anlass" value={formData.anlass} onChange={v => handleChange("anlass", v)}
                    options={["Erbschaft / Erbauseinandersetzung", "Scheidung / Vermögensauseinandersetzung", "Kauf / Verkauf", "Finanzierung / Beleihung", "Gerichtsverfahren", "Steuerliche Bewertung", "Sonstiges"]} />
                </div>
                <div style={{ marginTop: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Ihre Nachricht</label>
                  <textarea
                    value={formData.message} onChange={e => handleChange("message", e.target.value)}
                    placeholder="Beschreiben Sie Ihr Anliegen..."
                    rows={4}
                    style={{
                      width: "100%", background: COLORS.darkSoft, border: `1px solid ${COLORS.border}`,
                      borderRadius: 10, padding: "12px 14px", color: COLORS.text, fontSize: 14,
                      fontFamily: FONT.body, resize: "vertical", outline: "none", boxSizing: "border-box",
                    }}
                    onFocus={e => e.target.style.borderColor = COLORS.accent}
                    onBlur={e => e.target.style.borderColor = COLORS.border}
                  />
                </div>

                <label style={{
                  display: "flex", alignItems: "flex-start", gap: 10, marginTop: 20,
                  fontSize: 12, color: COLORS.textMuted, cursor: "pointer", lineHeight: 1.5,
                }}>
                  <input type="checkbox" checked={formData.dsgvo} onChange={e => handleChange("dsgvo", e.target.checked)}
                    style={{ marginTop: 2, accentColor: COLORS.accent }} />
                  Ich bin mit der Verarbeitung meiner Daten gemäß der Datenschutzerklärung einverstanden. Meine Daten werden ausschließlich zur Bearbeitung meiner Anfrage verwendet.
                </label>

                {formStatus === "error" && (
                  <div style={{ marginTop: 12, fontSize: 13, color: COLORS.error }}>
                    Bitte füllen Sie alle Pflichtfelder (*) aus und bestätigen Sie die Datenschutzerklärung.
                  </div>
                )}

                <button onClick={handleSubmit} style={{
                  width: "100%", marginTop: 24, padding: "16px",
                  background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
                  color: COLORS.dark, border: "none", borderRadius: 12,
                  fontSize: 15, fontWeight: 600, fontFamily: FONT.body,
                  cursor: "pointer", letterSpacing: "0.01em",
                  boxShadow: `0 8px 32px rgba(200,162,85,0.25)`,
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 40px rgba(200,162,85,0.35)"; }}
                onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 32px rgba(200,162,85,0.25)"; }}
                >Anfrage absenden</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "48px 24px", borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: FONT.display, fontWeight: 700, fontSize: 14, color: COLORS.dark,
              }}>S</div>
              <span style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 600 }}>
                SVB <span style={{ color: COLORS.accent }}>Digital</span>
              </span>
            </div>
            <p style={{ fontSize: 12, color: COLORS.textMuted }}>Demo-Umgebung · Keine echten Daten</p>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Impressum", "Datenschutz", "AGB"].map((item, i) => (
              <a key={i} href="#" style={{ color: COLORS.textMuted, textDecoration: "none", fontSize: 13 }}>{item}</a>
            ))}
          </div>
          <p style={{ fontSize: 12, color: COLORS.textMuted }}>Powered by Sunside AI</p>
        </div>
      </footer>

      {/* CHATBOT BUBBLE */}
      <div style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 200,
        width: 60, height: 60, borderRadius: "50%",
        background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", boxShadow: `0 8px 32px rgba(200,162,85,0.3)`,
        transition: "transform 0.2s",
        fontSize: 24,
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      title="Chat starten"
      >💬</div>

    </div>
  );
}

// ============================================================================
// FORM COMPONENTS
// ============================================================================
function InputField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 500, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", background: COLORS.darkSoft, border: `1px solid ${COLORS.border}`,
          borderRadius: 10, padding: "12px 14px", color: COLORS.text, fontSize: 14,
          fontFamily: FONT.body, outline: "none", boxSizing: "border-box",
          transition: "border-color 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = COLORS.accent}
        onBlur={e => e.target.style.borderColor = COLORS.border}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 500, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>{label}</label>
      <select
        value={value} onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", background: COLORS.darkSoft, border: `1px solid ${COLORS.border}`,
          borderRadius: 10, padding: "12px 14px", color: value ? COLORS.text : COLORS.textMuted,
          fontSize: 14, fontFamily: FONT.body, outline: "none", boxSizing: "border-box",
          appearance: "none", cursor: "pointer", transition: "border-color 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = COLORS.accent}
        onBlur={e => e.target.style.borderColor = COLORS.border}
      >
        <option value="" style={{ color: COLORS.textMuted }}>Bitte wählen</option>
        {options.map((opt, i) => (
          <option key={i} value={opt} style={{ color: COLORS.text, background: COLORS.card }}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
