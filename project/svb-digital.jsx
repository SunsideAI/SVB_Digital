// ============================================================================
// SVB Digital — Demo-Landingpage für Sachverständigenbüros
// Variante: Hell · Weiß / Blau
// ============================================================================

const { useState, useEffect, useRef } = React;

const SVB_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryHue": 220,
  "primarySaturation": 0.16,
  "displayFont": "Inter Tight",
  "bodyFont": "Inter",
  "showChatBubble": true,
  "heroVariant": "split",
  "panelTone": "ice"
}/*EDITMODE-END*/;

// Resolve palette from tweakable hue/sat
function buildPalette(t) {
  const h = t.primaryHue;
  const s = t.primarySaturation;
  const tone = t.panelTone;

  // Soft neutrals (warm/cool variants based on panelTone)
  const bgWhite = tone === "ice" ? "#F4F7FB" : tone === "paper" ? "#F7F6F2" : "#F2F4F8";
  const cardBg  = "#FFFFFF";
  const subtle  = tone === "ice" ? "#EAF0F7" : tone === "paper" ? "#EFEDE6" : "#E8ECF2";

  return {
    primary:       `oklch(0.46 ${s} ${h})`,         // main blue
    primaryDeep:   `oklch(0.32 ${s} ${h})`,         // text-on-light-blue / heading
    primarySoft:   `oklch(0.95 ${Math.min(s, 0.04)} ${h})`,
    primaryGhost:  `oklch(0.46 ${s} ${h} / 0.10)`,
    primaryRing:   `oklch(0.46 ${s} ${h} / 0.22)`,
    primaryShadow: `oklch(0.46 ${s} ${h} / 0.28)`,

    bg:            bgWhite,
    surface:       cardBg,
    surfaceAlt:    subtle,
    border:        "#DDE3EC",
    borderStrong:  "#C4CCD8",

    ink:           "#0B1220",
    inkSoft:       "#2B3445",
    inkMuted:      "#5C6577",

    success:       "oklch(0.65 0.14 150)",
    error:         "oklch(0.62 0.18 25)",
  };
}

function SVBDigital() {
  const [tweaks, setTweak] = useTweaks(SVB_DEFAULTS);
  const C = buildPalette(tweaks);

  const FONT = {
    display: `'${tweaks.displayFont}', 'Inter', system-ui, -apple-system, 'Helvetica Neue', sans-serif`,
    body: `'${tweaks.bodyFont}', system-ui, -apple-system, 'Helvetica Neue', sans-serif`,
  };

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", address: "",
    gutachtenart: "", anlass: "", message: "", dsgvo: false,
  });
  const [formStatus, setFormStatus] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
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
  const handleChange = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const navSolid = scrollY > 80;

  return (
    <div style={{
      background: C.bg,
      color: C.ink,
      fontFamily: FONT.body,
      minHeight: "100vh",
      overflowX: "hidden",
    }}>
      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: navSolid ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0)",
        backdropFilter: navSolid ? "saturate(160%) blur(14px)" : "none",
        borderBottom: navSolid ? `1px solid ${C.border}` : "1px solid transparent",
        transition: "all 0.3s ease",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between", height: 72,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Mark C={C} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{
                fontFamily: FONT.display, fontSize: 20, fontWeight: 600,
                letterSpacing: "-0.02em", color: C.ink,
              }}>
                SVB <span style={{ color: C.primary }}>Digital</span>
              </span>
              <span style={{
                fontSize: 11, color: C.inkMuted, marginTop: 4,
                letterSpacing: "0", fontWeight: 400,
              }}>by sunside ai</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {["Leistungen", "Ablauf", "Erreichbarkeit", "Kontakt"].map((item, i) => (
              <a key={i} href={`#${item.toLowerCase()}`} style={{
                color: C.inkSoft, textDecoration: "none", fontSize: 14, fontWeight: 500,
                letterSpacing: "0.01em", transition: "color 0.2s",
              }}
              onMouseEnter={e => e.target.style.color = C.primary}
              onMouseLeave={e => e.target.style.color = C.inkSoft}>{item}</a>
            ))}
            <a href="tel:+4940123456789" style={{
              background: C.primary, color: "#fff",
              padding: "10px 18px", borderRadius: 10,
              textDecoration: "none", fontSize: 13, fontWeight: 600,
              boxShadow: `0 6px 18px ${C.primaryShadow}`,
            }}>+49 40 123 456 789</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden",
        background: `linear-gradient(180deg, ${C.primarySoft} 0%, ${C.bg} 70%)`,
      }}>
        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.45, pointerEvents: "none",
          backgroundImage:
            `linear-gradient(${C.border} 1px, transparent 1px),
             linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at 60% 30%, #000 30%, transparent 75%)",
        }} />
        {/* Soft glow */}
        <div style={{
          position: "absolute", top: "10%", right: "-12%", width: 640, height: 640,
          borderRadius: "50%", background: C.primaryGhost, filter: "blur(120px)",
        }} />

        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px",
          position: "relative", zIndex: 1,
          display: "grid",
          gridTemplateColumns: tweaks.heroVariant === "split" ? "1.1fr 0.9fr" : "1fr",
          gap: 56, alignItems: "center",
        }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#fff", border: `1px solid ${C.border}`,
              borderRadius: 100, padding: "6px 14px", marginBottom: 28,
              boxShadow: `0 1px 0 ${C.border}`,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.success }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: C.inkSoft, letterSpacing: "0.08em" }}>
                JETZT ERREICHBAR — AUCH AUSSERHALB DER BÜROZEITEN
              </span>
            </div>

            <h1 style={{
              fontFamily: FONT.display,
              fontSize: "clamp(40px, 5.2vw, 64px)",
              fontWeight: 600, lineHeight: 1.05,
              letterSpacing: "-0.035em",
              margin: "0 0 22px", color: C.ink,
            }}>
              Ihr Gutachten.{" "}
              <span style={{ color: C.primary }}>Präzise.</span>
              <br />
              <span style={{ color: C.primary }}>Zuverlässig.</span>{" "}
              Unabhängig.
            </h1>

            <p style={{
              fontSize: 18, lineHeight: 1.65,
              color: C.inkSoft, maxWidth: 560, margin: "0 0 36px",
            }}>
              Verkehrswertgutachten, Beleihungswertgutachten und Schadensgutachten —
              zertifiziert, gerichtsfest und termingerecht. Seit über 20 Jahren Ihr Partner
              für Immobilienbewertung.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <PrimaryBtn C={C} href="#kontakt">Kostenlose Erstberatung</PrimaryBtn>
              <GhostBtn C={C} href="tel:+4940123456789">Jetzt anrufen →</GhostBtn>
            </div>

            <div style={{ display: "flex", gap: 40, marginTop: 56, flexWrap: "wrap" }}>
              {[
                { num: "20+",     label: "Jahre Erfahrung" },
                { num: "2.500+",  label: "Gutachten erstellt" },
                { num: "100 %",   label: "Gerichtsfest" },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{
                    fontFamily: FONT.display, fontSize: 30, fontWeight: 600,
                    color: C.primaryDeep, letterSpacing: "-0.01em",
                  }}>{item.num}</div>
                  <div style={{ fontSize: 13, color: C.inkMuted, marginTop: 2 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {tweaks.heroVariant === "split" && <HeroFigure C={C} FONT={FONT} />}
        </div>
      </section>

      {/* LEISTUNGEN */}
      <Section id="leistungen" C={C} eyebrow="Leistungen" title="Unsere Gutachtenleistungen" FONT={FONT}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}>
          {[
            { icon: "◈", title: "Verkehrswertgutachten",
              desc: "Ermittlung des Marktwerts Ihrer Immobilie nach § 194 BauGB — gerichtsfest und anerkannt.",
              details: "Erbschaft · Scheidung · Kauf/Verkauf",
              pattern: "chart" },
            { icon: "◇", title: "Beleihungswertgutachten",
              desc: "Wertermittlung zur Absicherung von Finanzierungen gemäß BelWertV.",
              details: "Banken · Sparkassen · Versicherungen",
              pattern: "vault" },
            { icon: "△", title: "Schadensgutachten",
              desc: "Dokumentation und Bewertung von Baumängeln, Feuchtigkeitsschäden und Bauschäden.",
              details: "Versicherung · Gericht · Privat",
              pattern: "plan" },
            { icon: "○", title: "Beratung & Kurzgutachten",
              desc: "Erste Einschätzung und Marktpreisindikation für Ihre schnelle Entscheidungsgrundlage.",
              details: "Orientierung · Kaufentscheidung",
              pattern: "compass" },
          ].map((s, i) => (
            <ServiceCard key={i} C={C} FONT={FONT} item={s} />
          ))}
        </div>
      </Section>

      {/* ABLAUF */}
      <Section id="ablauf" C={C} eyebrow="Ablauf" title="In 5 Schritten zum Gutachten"
        FONT={FONT} background={C.surfaceAlt}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 0, position: "relative",
        }}>
          {[
            { nr: "01", title: "Anfrage",     desc: "Sie kontaktieren uns per Formular, Telefon oder Chat." },
            { nr: "02", title: "Angebot",     desc: "Sie erhalten ein transparentes Honorarangebot." },
            { nr: "03", title: "Besichtigung",desc: "Unser Sachverständiger besichtigt die Immobilie vor Ort." },
            { nr: "04", title: "Erstellung",  desc: "Das Gutachten wird erstellt und qualitätsgeprüft." },
            { nr: "05", title: "Übergabe",    desc: "Sie erhalten das fertige Gutachten — digital und gedruckt." },
          ].map((step, i, arr) => (
            <div key={i} style={{ textAlign: "center", padding: "24px 16px", position: "relative" }}>
              <div style={{
                fontFamily: FONT.display, fontSize: 38, fontWeight: 600,
                color: C.primary, marginBottom: 8, lineHeight: 1,
              }}>{step.nr}</div>
              <div style={{
                width: 28, height: 1, background: C.border, margin: "0 auto 14px",
              }} />
              <h4 style={{
                fontFamily: FONT.display, fontSize: 18, fontWeight: 600,
                color: C.ink, margin: "0 0 6px",
              }}>{step.title}</h4>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: C.inkMuted, margin: 0 }}>
                {step.desc}
              </p>
              {i < arr.length - 1 && (
                <div style={{
                  position: "absolute", top: 26, right: -8,
                  color: C.borderStrong, fontSize: 18,
                }}>→</div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ERREICHBARKEIT */}
      <Section id="erreichbarkeit" C={C} eyebrow="Erreichbarkeit"
        title="Drei Wege zu uns — rund um die Uhr"
        subtitle="Ob per Formular, Chat oder Telefon — wir sind für Sie da. Auch außerhalb der Geschäftszeiten."
        FONT={FONT}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { icon: "✉", title: "Kontaktformular",
              desc: "Beschreiben Sie Ihr Anliegen und wir melden uns innerhalb von 24 Stunden.",
              badge: "Sofortige Bestätigung", action: "Zum Formular ↓", href: "#kontakt" },
            { icon: "◐", title: "KI-Assistent",
              desc: "Unser digitaler Berater beantwortet Ihre Fragen sofort — zu Gutachtenarten, Kosten und Ablauf.",
              badge: "24/7 verfügbar", action: "Chat starten", href: "#" },
            { icon: "☏", title: "Telefonassistent",
              desc: "Rufen Sie an und unser KI-Telefonassistent nimmt Ihr Anliegen auf — kompetent und freundlich.",
              badge: "Sofort erreichbar", action: "+49 40 123 456 789", href: "tel:+4940123456789" },
          ].map((ch, i) => (
            <ChannelCard key={i} C={C} FONT={FONT} item={ch} />
          ))}
        </div>
      </Section>

      {/* KONTAKT */}
      <Section id="kontakt" C={C} eyebrow="Kontakt" title="Kostenlose Erstberatung anfragen"
        FONT={FONT} background={C.surfaceAlt} narrow>
        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: "40px 36px",
          boxShadow: `0 24px 60px -32px ${C.primaryShadow}`,
        }}>
          {formStatus === "success" ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{
                width: 56, height: 56, margin: "0 auto 16px",
                borderRadius: "50%",
                background: C.primary, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28,
              }}>✓</div>
              <h3 style={{
                fontFamily: FONT.display, fontSize: 24, color: C.ink,
                margin: "0 0 6px",
              }}>Anfrage erhalten!</h3>
              <p style={{ color: C.inkMuted, fontSize: 15, margin: 0 }}>
                Wir melden uns innerhalb von 24 Stunden bei Ihnen.
              </p>
            </div>
          ) : (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <InputField C={C} FONT={FONT} label="Name *" value={formData.name}
                  onChange={v => handleChange("name", v)} placeholder="Ihr vollständiger Name" />
                <InputField C={C} FONT={FONT} label="Telefon *" value={formData.phone}
                  onChange={v => handleChange("phone", v)} placeholder="+49 40 ..." type="tel" />
                <InputField C={C} FONT={FONT} label="E-Mail" value={formData.email}
                  onChange={v => handleChange("email", v)} placeholder="ihre@email.de" type="email" />
                <InputField C={C} FONT={FONT} label="Objektadresse" value={formData.address}
                  onChange={v => handleChange("address", v)} placeholder="Straße, PLZ Ort" />
                <SelectField C={C} FONT={FONT} label="Gutachtenart" value={formData.gutachtenart}
                  onChange={v => handleChange("gutachtenart", v)}
                  options={["Verkehrswertgutachten", "Beleihungswertgutachten", "Schadensgutachten", "Kurzgutachten / Beratung", "Sonstiges"]} />
                <SelectField C={C} FONT={FONT} label="Anlass" value={formData.anlass}
                  onChange={v => handleChange("anlass", v)}
                  options={["Erbschaft / Erbauseinandersetzung", "Scheidung / Vermögensauseinandersetzung", "Kauf / Verkauf", "Finanzierung / Beleihung", "Gerichtsverfahren", "Steuerliche Bewertung", "Sonstiges"]} />
              </div>

              <div style={{ marginTop: 16 }}>
                <label style={{
                  fontSize: 13, fontWeight: 500, color: C.inkSoft,
                  display: "block", marginBottom: 6,
                }}>Ihre Nachricht</label>
                <textarea
                  value={formData.message}
                  onChange={e => handleChange("message", e.target.value)}
                  placeholder="Beschreiben Sie Ihr Anliegen..."
                  rows={4}
                  style={{
                    width: "100%", background: "#fff",
                    border: `1px solid ${C.border}`,
                    borderRadius: 10, padding: "12px 14px",
                    color: C.ink, fontSize: 14, fontFamily: FONT.body,
                    resize: "vertical", outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = `0 0 0 3px ${C.primaryRing}`; }}
                  onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
                />
              </div>

              <label style={{
                display: "flex", alignItems: "flex-start", gap: 10, marginTop: 20,
                fontSize: 12, color: C.inkMuted, cursor: "pointer", lineHeight: 1.55,
              }}>
                <input
                  type="checkbox" checked={formData.dsgvo}
                  onChange={e => handleChange("dsgvo", e.target.checked)}
                  style={{ marginTop: 2, accentColor: C.primary }}
                />
                Ich bin mit der Verarbeitung meiner Daten gemäß der Datenschutzerklärung
                einverstanden. Meine Daten werden ausschließlich zur Bearbeitung meiner
                Anfrage verwendet.
              </label>

              {formStatus === "error" && (
                <div style={{ marginTop: 12, fontSize: 13, color: C.error }}>
                  Bitte füllen Sie alle Pflichtfelder (*) aus und bestätigen Sie die Datenschutzerklärung.
                </div>
              )}

              <button onClick={handleSubmit} style={{
                width: "100%", marginTop: 24, padding: "16px",
                background: C.primary,
                color: "#fff", border: "none", borderRadius: 12,
                fontSize: 15, fontWeight: 600, fontFamily: FONT.body,
                cursor: "pointer", letterSpacing: "0.01em",
                boxShadow: `0 10px 28px ${C.primaryShadow}`,
                transition: "transform 0.2s, box-shadow 0.2s, background 0.2s",
              }}
              onMouseEnter={e => {
                e.target.style.transform = "translateY(-1px)";
                e.target.style.background = C.primaryDeep;
              }}
              onMouseLeave={e => {
                e.target.style.transform = "translateY(0)";
                e.target.style.background = C.primary;
              }}>Anfrage absenden</button>
            </div>
          )}
        </div>
      </Section>

      {/* FOOTER */}
      <footer style={{
        padding: "40px 24px", borderTop: `1px solid ${C.border}`,
        background: C.surface,
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 24,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <Mark C={C} small />
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                <span style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 600 }}>
                  SVB <span style={{ color: C.primary }}>Digital</span>
                </span>
                <span style={{
                  fontSize: 10.5, color: C.inkMuted, marginTop: 3,
                  letterSpacing: "0", fontWeight: 400,
                }}>by sunside ai</span>
              </div>
            </div>
            <p style={{ fontSize: 12, color: C.inkMuted, margin: 0 }}>
              Demo-Umgebung · Keine echten Daten
            </p>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Impressum", "Datenschutz", "AGB"].map((item, i) => (
              <a key={i} href="#" style={{
                color: C.inkMuted, textDecoration: "none", fontSize: 13,
              }}>{item}</a>
            ))}
          </div>
          <p style={{ fontSize: 12, color: C.inkMuted, margin: 0 }}>Powered by Sunside AI</p>
        </div>
      </footer>

      {/* CHAT BUBBLE */}
      {tweaks.showChatBubble && (
        <button title="Chat starten" style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 200,
          width: 60, height: 60, borderRadius: "50%",
          background: C.primary, color: "#fff", border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: `0 12px 32px ${C.primaryShadow}`,
          fontSize: 26, transition: "transform 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
          ◐
        </button>
      )}

      {/* TWEAKS */}
      <TweaksPanel title="Tweaks">
        <TweakSection title="Markenfarbe">
          <TweakSlider label="Hue (Blau-Ton)" min={195} max={245} step={1}
            value={tweaks.primaryHue}
            onChange={v => setTweak("primaryHue", v)} />
          <TweakSlider label="Sättigung" min={0.06} max={0.22} step={0.01}
            value={tweaks.primarySaturation}
            onChange={v => setTweak("primarySaturation", v)} />
        </TweakSection>
        <TweakSection title="Hintergrundton">
          <TweakRadio value={tweaks.panelTone}
            onChange={v => setTweak("panelTone", v)}
            options={[
              { value: "ice",    label: "Eis" },
              { value: "neutral",label: "Neutral" },
              { value: "paper",  label: "Papier" },
            ]} />
        </TweakSection>
        <TweakSection title="Typografie">
          <TweakSelect label="Display-Schrift" value={tweaks.displayFont}
            onChange={v => setTweak("displayFont", v)}
            options={[
              { value: "Inter Tight",      label: "Inter Tight" },
              { value: "Inter",            label: "Inter" },
              { value: "IBM Plex Sans",    label: "IBM Plex Sans" },
              { value: "Manrope",          label: "Manrope" },
            ]} />
          <TweakSelect label="Body-Schrift" value={tweaks.bodyFont}
            onChange={v => setTweak("bodyFont", v)}
            options={[
              { value: "Inter",         label: "Inter" },
              { value: "Inter Tight",   label: "Inter Tight" },
              { value: "IBM Plex Sans", label: "IBM Plex Sans" },
              { value: "Manrope",       label: "Manrope" },
            ]} />
        </TweakSection>
        <TweakSection title="Layout">
          <TweakRadio label="Hero-Variante" value={tweaks.heroVariant}
            onChange={v => setTweak("heroVariant", v)}
            options={[
              { value: "split",    label: "Split (Bild)" },
              { value: "centered", label: "Zentriert" },
            ]} />
          <TweakToggle label="Chat-Bubble anzeigen" value={tweaks.showChatBubble}
            onChange={v => setTweak("showChatBubble", v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================
function Mark({ C, small }) {
  const size = small ? 28 : 36;
  return (
    <div style={{
      width: size, height: size, borderRadius: small ? 7 : 9,
      background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDeep})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700,
      fontSize: small ? 14 : 17,
      letterSpacing: "-0.04em",
      boxShadow: `0 6px 16px ${C.primaryShadow}`,
    }}>S</div>
  );
}

function PrimaryBtn({ C, href, children }) {
  return (
    <a href={href} style={{
      background: C.primary, color: "#fff",
      padding: "15px 28px", borderRadius: 12,
      textDecoration: "none", fontSize: 15, fontWeight: 600,
      letterSpacing: "0.01em",
      boxShadow: `0 10px 28px ${C.primaryShadow}`,
      transition: "transform 0.2s, box-shadow 0.2s, background 0.2s",
    }}
    onMouseEnter={e => {
      e.target.style.transform = "translateY(-2px)";
      e.target.style.background = C.primaryDeep;
    }}
    onMouseLeave={e => {
      e.target.style.transform = "translateY(0)";
      e.target.style.background = C.primary;
    }}>{children}</a>
  );
}

function GhostBtn({ C, href, children }) {
  return (
    <a href={href} style={{
      border: `1px solid ${C.borderStrong}`, color: C.ink,
      padding: "15px 28px", borderRadius: 12, textDecoration: "none",
      fontSize: 15, fontWeight: 500, background: "#fff",
      transition: "border-color 0.2s, color 0.2s",
    }}
    onMouseEnter={e => { e.target.style.borderColor = C.primary; e.target.style.color = C.primary; }}
    onMouseLeave={e => { e.target.style.borderColor = C.borderStrong; e.target.style.color = C.ink; }}>
      {children}
    </a>
  );
}

function Section({ id, C, eyebrow, title, subtitle, FONT, background, narrow, children }) {
  return (
    <section id={id} style={{
      padding: "100px 24px",
      background: background || "transparent",
    }}>
      <div style={{ maxWidth: narrow ? 720 : 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, color: C.primary,
            letterSpacing: "0.16em", textTransform: "uppercase",
          }}>{eyebrow}</span>
          <h2 style={{
            fontFamily: FONT.display,
            fontSize: "clamp(28px, 3.2vw, 40px)",
            fontWeight: 600, marginTop: 12, marginBottom: 0,
            color: C.ink, letterSpacing: "-0.03em",
          }}>{title}</h2>
          {subtitle && (
            <p style={{
              fontSize: 16, color: C.inkMuted,
              marginTop: 14, maxWidth: 580,
              marginLeft: "auto", marginRight: "auto",
            }}>{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

function ServicePattern({ kind, C }) {
  const stroke = C.primary;
  const soft = C.primarySoft;
  const ghost = C.primaryGhost;
  const bg = "#FFFFFF";

  const wrap = (children) => (
    <div style={{
      height: 130,
      borderBottom: `1px solid ${C.border}`,
      background: `linear-gradient(180deg, ${soft} 0%, ${bg} 100%)`,
      position: "relative", overflow: "hidden",
    }}>
      <svg viewBox="0 0 320 130" width="100%" height="100%"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg">
        {/* fine grid */}
        <defs>
          <pattern id={`grid-${kind}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={C.border} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="320" height="130" fill={`url(#grid-${kind})`} opacity="0.6" />
        {children}
      </svg>
    </div>
  );

  if (kind === "chart") {
    // Verkehrswert — bar+line chart
    const bars = [40, 58, 52, 70, 64, 82, 76, 92];
    return wrap(
      <g>
        {bars.map((h, i) => (
          <rect key={i} x={28 + i * 32} y={110 - h} width="14" height={h}
            fill={ghost} stroke={stroke} strokeWidth="1" rx="2" />
        ))}
        <polyline
          points={bars.map((h, i) => `${28 + i * 32 + 7},${110 - h - 6}`).join(" ")}
          fill="none" stroke={stroke} strokeWidth="1.5" />
        {bars.map((h, i) => (
          <circle key={i} cx={28 + i * 32 + 7} cy={110 - h - 6} r="2.5" fill={stroke} />
        ))}
      </g>
    );
  }

  if (kind === "vault") {
    // Beleihungswert — coin stacks + curve
    return wrap(
      <g>
        <path d="M 0 95 Q 80 60 160 80 T 320 60" fill="none" stroke={stroke} strokeWidth="1.5" />
        {[60, 110, 170, 230].map((x, i) => {
          const stackH = [3, 5, 4, 6][i];
          return (
            <g key={i}>
              {Array.from({ length: stackH }).map((_, j) => (
                <ellipse key={j} cx={x} cy={108 - j * 9} rx="22" ry="5"
                  fill={j === stackH - 1 ? soft : "#fff"}
                  stroke={stroke} strokeWidth="1" />
              ))}
            </g>
          );
        })}
      </g>
    );
  }

  if (kind === "plan") {
    // Schadensgutachten — floor plan with crack
    return wrap(
      <g transform="translate(40 18)">
        <rect x="0" y="0" width="240" height="94" fill="#fff" stroke={stroke} strokeWidth="1.5" rx="2" />
        <line x1="100" y1="0" x2="100" y2="94" stroke={stroke} strokeWidth="1" />
        <line x1="100" y1="46" x2="240" y2="46" stroke={stroke} strokeWidth="1" />
        <line x1="160" y1="46" x2="160" y2="94" stroke={stroke} strokeWidth="1" />
        {/* doors */}
        <path d="M 100 30 A 16 16 0 0 1 116 46" fill="none" stroke={stroke} strokeWidth="0.8" />
        <path d="M 160 60 A 14 14 0 0 1 174 74" fill="none" stroke={stroke} strokeWidth="0.8" />
        {/* crack overlay */}
        <polyline points="40,0 50,18 38,30 56,52 44,70 60,94"
          fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
        <circle cx="50" cy="18" r="3" fill={stroke} opacity="0.25" />
        <circle cx="56" cy="52" r="4" fill={stroke} opacity="0.2" />
      </g>
    );
  }

  if (kind === "compass") {
    // Beratung — compass / radial
    return wrap(
      <g transform="translate(160 65)">
        {[58, 44, 30].map((r, i) => (
          <circle key={i} cx="0" cy="0" r={r}
            fill="none" stroke={stroke} strokeWidth="1"
            opacity={0.3 + i * 0.2} />
        ))}
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line key={deg}
              x1={Math.cos(rad) * 30} y1={Math.sin(rad) * 30}
              x2={Math.cos(rad) * 58} y2={Math.sin(rad) * 58}
              stroke={stroke} strokeWidth="1" opacity="0.4" />
          );
        })}
        {/* needle */}
        <polygon points="0,-50 6,0 0,50 -6,0" fill={stroke} />
        <circle cx="0" cy="0" r="4" fill="#fff" stroke={stroke} strokeWidth="1.5" />
        <text x="0" y="-62" textAnchor="middle" fontSize="9"
          fill={stroke} fontWeight="600" letterSpacing="2">N</text>
      </g>
    );
  }

  return wrap(null);
}

function ServiceCard({ C, FONT, item }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: C.surface,
        border: `1px solid ${hover ? C.primary : C.border}`,
        borderRadius: 16, padding: 0, overflow: "hidden",
        transition: "border-color 0.25s, transform 0.2s, box-shadow 0.25s",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hover
          ? `0 24px 60px -28px ${C.primaryShadow}`
          : `0 1px 0 ${C.border}`,
        display: "flex", flexDirection: "column",
      }}>
      {item.pattern && (
        <ServicePattern kind={item.pattern} C={C} />
      )}
      <div style={{ padding: "26px 26px 28px" }}>
        <div style={{
          fontSize: 22, color: C.primary, marginBottom: 14,
          width: 44, height: 44,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: C.primaryGhost, borderRadius: 10,
        }}>{item.icon}</div>
        <h3 style={{
          fontFamily: FONT.display, fontSize: 19, fontWeight: 600,
          margin: "0 0 10px", color: C.ink, letterSpacing: "-0.01em",
        }}>{item.title}</h3>
        <p style={{
          fontSize: 14, lineHeight: 1.65, color: C.inkMuted, margin: "0 0 14px",
        }}>{item.desc}</p>
        <span style={{
          fontSize: 12, color: C.primary, fontWeight: 600,
          letterSpacing: "0.02em",
        }}>{item.details}</span>
      </div>
    </div>
  );
}

function ChannelCard({ C, FONT, item }) {
  const [hover, setHover] = useState(false);
  return (
    <a href={item.href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: C.surface,
        border: `1px solid ${hover ? C.primary : C.border}`,
        borderRadius: 16, padding: "32px 28px",
        textDecoration: "none", display: "block",
        transition: "border-color 0.25s, transform 0.2s, box-shadow 0.25s",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hover
          ? `0 24px 60px -28px ${C.primaryShadow}`
          : `0 1px 0 ${C.border}`,
      }}>
      <div style={{
        fontSize: 26, color: C.primary, marginBottom: 16,
        width: 52, height: 52,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: C.primaryGhost, borderRadius: 14,
      }}>{item.icon}</div>
      <div style={{
        display: "inline-block", fontSize: 10, fontWeight: 700,
        color: C.primaryDeep, background: C.primarySoft,
        padding: "4px 10px", borderRadius: 100,
        letterSpacing: "0.06em", marginBottom: 14, textTransform: "uppercase",
      }}>{item.badge}</div>
      <h3 style={{
        fontFamily: FONT.display, fontSize: 22, fontWeight: 600,
        color: C.ink, margin: "0 0 10px",
      }}>{item.title}</h3>
      <p style={{
        fontSize: 14, lineHeight: 1.7, color: C.inkMuted,
        margin: "0 0 18px",
      }}>{item.desc}</p>
      <span style={{ fontSize: 14, fontWeight: 600, color: C.primary }}>
        {item.action} →
      </span>
    </a>
  );
}

function HeroFigure({ C, FONT }) {
  return (
    <div style={{ position: "relative" }}>
      {/* Stylized "report" placeholder card */}
      <div style={{
        background: "#fff",
        border: `1px solid ${C.border}`,
        borderRadius: 18,
        padding: 24,
        boxShadow: `0 36px 80px -36px ${C.primaryShadow}, 0 1px 0 ${C.border}`,
        transform: "rotate(-1.5deg)",
        position: "relative", zIndex: 2,
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 18,
        }}>
          <span style={{
            fontSize: 10, fontWeight: 700, color: C.primary,
            letterSpacing: "0.14em", textTransform: "uppercase",
          }}>Verkehrswertgutachten</span>
          <span style={{ fontSize: 11, color: C.inkMuted }}>№ 2026‑0418</span>
        </div>
        <div style={{
          fontFamily: FONT.display, fontSize: 22,
          color: C.ink, lineHeight: 1.2, marginBottom: 14,
        }}>
          Mehrfamilienhaus<br/>Hamburg‑Eppendorf
        </div>

        {/* Objektfoto */}
        <div style={{
          height: 140, borderRadius: 10, marginBottom: 16,
          border: `1px solid ${C.border}`,
          backgroundImage: `url("assets/hero-immobilie.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
          marginBottom: 16,
        }}>
          <KV C={C} k="Wohnfläche" v="412 m²" />
          <KV C={C} k="Baujahr"    v="2020" />
          <KV C={C} k="Lage"       v="Sehr gut" />
          <KV C={C} k="Zustand"    v="Modernisiert" />
        </div>

        <div style={{
          background: C.primarySoft,
          border: `1px solid ${C.primaryRing}`,
          borderRadius: 12,
          padding: "14px 16px",
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
        }}>
          <span style={{ fontSize: 12, color: C.primaryDeep, fontWeight: 600,
            letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Verkehrswert
          </span>
          <span style={{
            fontFamily: FONT.display, fontSize: 24, fontWeight: 600,
            color: C.primaryDeep, letterSpacing: "-0.01em",
          }}>2.485.000 €</span>
        </div>
      </div>

      {/* small floating signature card */}
      <div style={{
        position: "absolute", right: -12, bottom: -28, zIndex: 3,
        background: "#fff",
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        padding: "14px 16px",
        boxShadow: `0 18px 40px -20px ${C.primaryShadow}`,
        transform: "rotate(2.5deg)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: C.primaryGhost,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: C.primary, fontSize: 18, fontWeight: 700,
        }}>✓</div>
        <div>
          <div style={{
            fontFamily: FONT.display, fontSize: 13, fontWeight: 600, color: C.ink,
          }}>Gerichtsfest</div>
          <div style={{ fontSize: 11, color: C.inkMuted }}>
            Zertifiziert nach DIN EN ISO/IEC 17024
          </div>
        </div>
      </div>

      {/* soft backdrop */}
      <div style={{
        position: "absolute", inset: -30, zIndex: 1,
        background: `radial-gradient(60% 60% at 50% 40%, ${C.primaryGhost}, transparent 70%)`,
        filter: "blur(20px)",
      }} />
    </div>
  );
}

function KV({ C, k, v }) {
  return (
    <div style={{
      borderTop: `1px solid ${C.border}`,
      paddingTop: 8,
    }}>
      <div style={{
        fontSize: 10, color: C.inkMuted,
        letterSpacing: "0.08em", textTransform: "uppercase",
        marginBottom: 2, fontWeight: 600,
      }}>{k}</div>
      <div style={{ fontSize: 14, color: C.ink, fontWeight: 500 }}>{v}</div>
    </div>
  );
}

// ============================================================================
// FORM COMPONENTS
// ============================================================================
function InputField({ C, FONT, label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label style={{
        fontSize: 13, fontWeight: 500, color: C.inkSoft,
        display: "block", marginBottom: 6,
      }}>{label}</label>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", background: "#fff",
          border: `1px solid ${C.border}`,
          borderRadius: 10, padding: "12px 14px",
          color: C.ink, fontSize: 14, fontFamily: FONT.body,
          outline: "none", boxSizing: "border-box",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = `0 0 0 3px ${C.primaryRing}`; }}
        onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );
}

function SelectField({ C, FONT, label, value, onChange, options }) {
  return (
    <div>
      <label style={{
        fontSize: 13, fontWeight: 500, color: C.inkSoft,
        display: "block", marginBottom: 6,
      }}>{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", background: "#fff",
          border: `1px solid ${C.border}`,
          borderRadius: 10, padding: "12px 14px",
          color: value ? C.ink : C.inkMuted,
          fontSize: 14, fontFamily: FONT.body,
          outline: "none", boxSizing: "border-box",
          appearance: "none", cursor: "pointer",
          transition: "border-color 0.2s, box-shadow 0.2s",
          backgroundImage:
            `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='${encodeURIComponent(C.inkMuted)}' d='M6 8L0 0h12z'/></svg>")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
          paddingRight: 36,
        }}
        onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = `0 0 0 3px ${C.primaryRing}`; }}
        onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
      >
        <option value="">Bitte wählen</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<SVBDigital />);
