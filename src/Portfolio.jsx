import { useState, useEffect } from "react";
import projectStock from "./assets/SAE.png";
import projectVTC from "./assets/KOOGWE.png";
import projectShowcase from "./assets/sitevitrine.png";
import logoReact from "./assets/logo-react.svg";
import logoTS from "./assets/logo-ts.svg";
import logoPostgres from "./assets/logo-postgres.svg";
import logoFlutter from "./assets/logo-flutter.svg";
import logoFigma from "./assets/logo-figma.svg";
import logoAppInventor from "./assets/logo-appinventor.svg";
import logoNestJS from "./assets/logo-nestjs.svg";
import "./Portfolio.css";

// ============================================================
// 🎨 COULEURS & THÈME — Modifie ici les couleurs principales
// ============================================================
const THEME = {
  dark: "#042C53",       // Fond hero & contact
  darker: "#02192E",     // Fond footer
  mid: "#0C447C",        // Variante sombre
  primary: "#185FA5",    // Bleu principal
  accent: "#378ADD",     // Bleu clair (boutons, liens)
  light: "#85B7EB",      // Texte clair sur fond foncé
  pale: "#B5D4F4",       // Très clair
  pillBg: "#E6F1FB",     // Fond badge bleu
};

// ============================================================
// 👤 INFORMATIONS PERSONNELLES — Modifie ici tes données perso
// ============================================================
const PERSONAL_INFO = {
  firstName: "KPEMOUA",        // ← Ton prénom
  lastName: "David",          // ← Ton nom / pseudo
  initials: "MK",           // ← Initiales affichées dans l'avatar
  title: "Développeur web &\nmobile", // ← Titre héro
  tagline: "Développeur web et mobile",                 // ← Badge du héro
  bio1: "Fort de 4 ans d'expérience, je conçois des applications web et mobiles performantes avec ReactJS, Flutter et NestJS.",
  bio2: "Je crée des solutions métiers robustes, avec une approche claire et axée sur l'expérience utilisateur.",
  email: "mambizahkpemoua@gmail.com",           // ← Ton email
  linkedIn: "https://linkedin.com/in/kpemoua",  // ← Ton lien LinkedIn
  github: "https://github.com/Mamfurie",         // ← Ton lien GitHub
  twitter: "https://twitter.com/kpemoua",       // ← Ton lien Twitter/X
  cvLink: "#",                              // ← Lien vers ton CV PDF
  year: "2026",                             // ← Année du copyright
};

// ============================================================
// 📊 STATISTIQUES — Modifie les chiffres clés
// ============================================================
const STATS = [
  { value: "3+",    label: "Projets livrés" },
  { value: "4 ans",  label: "Expérience" },
  { value: "3",      label: "Clients satisfaits" },
  { value: "4.8/5",  label: "Note moyenne" },
];

// ============================================================
// 🛠️ SERVICES (section "À propos") — Modifie tes spécialités
// ============================================================
const SERVICES = [
  {
    emoji: "📱",
    title: "Développement mobile",
    subtitle: "React Native · Flutter · iOS · Android",
    bg: "#E6F1FB",
    color: "#185FA5",
  },
  {
    emoji: "⚙️",
    title: "APIs & back-end",
    subtitle: "Node.js · Express · MongoDB · Firebase",
    bg: "#EAF3DE",
    color: "#3B6D11",
  },
  {
    emoji: "🎨",
    title: "UI/UX & design",
    subtitle: "Figma · Prototypage · Design system",
    bg: "#E1F5EE",
    color: "#0F6E56",
  },
];

// ============================================================
// 💼 PROJETS — Ajoute / modifie tes projets ici
// Champs disponibles :
//   name        → Nom affiché sur la vignette
//   title       → Titre de la carte
//   description → Courte description du projet
//   status      → "Livré" | "En cours" | "Pause"
//   tags        → Liste de technologies (tableau de strings)
//   bgColor     → Couleur de fond de la vignette
//   nameColor   → Couleur du texte de la vignette
//   link        → URL du projet (optionnel)
// ============================================================
const PROJECTS = [
  {
    name: "SAE",
    title: "Plateforme de gestion de stock",
    description: "Gestion de stock pour une boutique de vêtements avec ReactJS et Node.js.",
    status: "Livré",
    tags: ["ReactJS", "Node.js", "PostgreSQL"],
    bgColor: "#0C447C",
    nameColor: "#E6F1FB",
    link: "#",
    image: projectStock,
  },
  {
    name: "KOOGWE",
    title: "Application de transport VTC",
    description: "Application de transport VTC développée avec Flutter, NestJS et Neon PostgreSQL.",
    status: "Livré",
    tags: ["Flutter", "NestJS", "PostgreSQL"],
    bgColor: "#185FA5",
    nameColor: "#E6F1FB",
    link: "#",
    image: projectVTC,
  },
  {
    name: "VitrinePro",
    title: "Site vitrine + dashboard",
    description: "Site vitrine pour entreprise avec back-office ReactTS, NestJS et Neon PostgreSQL.",
    status: "Livré",
    tags: ["ReactTS", "NestJS", "PostgreSQL"],
    bgColor: "#378ADD",
    nameColor: "#FFFFFF",
    link: "#",
    image: projectShowcase,
  },
  // ← Pour ajouter un projet, copie l'objet ci-dessus et colle-le ici
];

// ============================================================
// 🧠 COMPÉTENCES — Modifie tes niveaux de maîtrise (0 à 100)
// ============================================================
const SKILLS = [
  { name: "ReactJS / TS", logo: logoReact, detail: "Applications web modernes" },
  { name: "PostgreSQL", logo: logoPostgres, detail: "Bases de données relationnelles" },
  { name: "Flutter", logo: logoFlutter, detail: "Applications mobiles multiplateformes" },
  { name: "Figma", logo: logoFigma, detail: "Design UI/UX" },
  { name: "App Inventor", logo: logoAppInventor, detail: "Prototypage rapide" },
  { name: "NestJS", logo: logoNestJS, detail: "API backend modulaires" },
];

// ============================================================
// 📅 EXPÉRIENCE & FORMATION — Modifie ton parcours ici
// ============================================================
const EXPERIENCE = [
  {
    title: "Freelance développeur web & mobile",
    period: "Décembre 2025 – aujourd'hui",
    description: "Développement de solutions web et mobiles avec ReactJS, Flutter, NestJS et PostgreSQL.",
    isLast: false,
  },
  {
    title: "Formation en développement mobile — DCLIC",
    period: "Janvier 2026 – Mars 2026",
    description: "Formation intensive en développement mobile et architecture d'applications.",
    isLast: true,
  },
  // ← Pour ajouter une entrée, copie un objet et colle-le ici
];

// ============================================================
// 🏷️ CONFIGURATION DES BADGES (couleurs par technologie)
// Ajoute ici de nouvelles technos si besoin
// ============================================================
const TAG_COLORS = {
  "React Native": { bg: "#E6F1FB", color: "#0C447C" },
  React:          { bg: "#E6F1FB", color: "#0C447C" },
  Firebase:       { bg: "#FAEEDA", color: "#633806" },
  Stripe:         { bg: "#E1F5EE", color: "#085041" },
  Flutter:        { bg: "#E1F5EE", color: "#085041" },
  "Node.js":      { bg: "#EAF3DE", color: "#27500A" },
  MongoDB:        { bg: "#E6F1FB", color: "#0C447C" },
  AWS:            { bg: "#FAEEDA", color: "#633806" },
  // ← Ajoute tes propres technos ici : "NomTechno": { bg: "#...", color: "#..." }
};

// ============================================================
// 🔤 NAVIGATION — Modifie les items de la barre de navigation
// ============================================================
const NAV_ITEMS = ["Accueil", "À propos", "Projets", "Compétences", "Contact"];

// ────────────────────────────────────────────────────────────
// COMPOSANTS UTILITAIRES (pas besoin de modifier)
// ────────────────────────────────────────────────────────────

const Tag = ({ label }) => {
  const style = TAG_COLORS[label] || { bg: "#E6F1FB", color: "#0C447C" };
  return (
    <span style={{
      display: "inline-block",
      fontSize: 11,
      fontWeight: 500,
      padding: "3px 10px",
      borderRadius: 20,
      background: style.bg,
      color: style.color,
    }}>{label}</span>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    "Livré":    { bg: "#EAF3DE", color: "#27500A" },
    "En cours": { bg: "#FAEEDA", color: "#633806" },
    "Pause":    { bg: "#F3E6FB", color: "#5A0C7C" },
  };
  const s = map[status] || map["Livré"];
  return (
    <span style={{
      fontSize: 10,
      fontWeight: 500,
      padding: "2px 8px",
      borderRadius: 20,
      background: s.bg,
      color: s.color,
    }}>{status}</span>
  );
};

// ────────────────────────────────────────────────────────────
// SECTIONS DU PORTFOLIO
// ────────────────────────────────────────────────────────────

// ── Header ──────────────────────────────────────────────────
function Header({ activeSection, onNav }) {
  return (
    <header style={{
      background: "#fff",
      borderBottom: "0.5px solid #e5e7eb",
      padding: "0 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 60,
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* ── Logo (modifie PERSONAL_INFO.firstName / lastName) ── */}
      <span style={{ fontSize: 16, fontWeight: 600, color: "#111" }}>
        {PERSONAL_INFO.firstName}
        <span style={{ color: THEME.accent }}>{PERSONAL_INFO.lastName}</span>
      </span>

      {/* ── Navigation ── */}
      <nav style={{ display: "flex", gap: 28 }}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item}
            onClick={() => onNav(item)}
            style={{
              fontSize: 13,
              color: activeSection === item ? THEME.primary : "#6b7280",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: activeSection === item ? 600 : 400,
              transition: "color 0.2s",
            }}
          >{item}</button>
        ))}
      </nav>

      {/* ── Bouton CTA ── */}
      <button
        onClick={() => onNav("Contact")}
        style={{
          fontSize: 12,
          padding: "8px 20px",
          borderRadius: 6,
          background: THEME.primary,
          border: "none",
          color: "#E6F1FB",
          cursor: "pointer",
          fontWeight: 500,
        }}
      >Me contacter</button>
    </header>
  );
}

// ── Hero ─────────────────────────────────────────────────────
function Hero({ onProjectsClick }) {
  return (
    <section id="Accueil" style={{
      background: THEME.dark,
      padding: "72px 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 32,
    }}>
      <div style={{ maxWidth: 440 }}>
        {/* ── Badge disponibilité (modifie PERSONAL_INFO.tagline) ── */}
        <span style={{
          display: "inline-block",
          fontSize: 11,
          fontWeight: 500,
          padding: "3px 12px",
          borderRadius: 20,
          background: THEME.mid,
          color: THEME.light,
          marginBottom: 20,
        }}>{PERSONAL_INFO.tagline}</span>

        {/* ── Titre (modifie PERSONAL_INFO.title) ── */}
        <h1 style={{
          fontSize: 34,
          fontWeight: 600,
          color: "#E6F1FB",
          lineHeight: 1.3,
          marginBottom: 16,
          whiteSpace: "pre-line",
        }}>{PERSONAL_INFO.title}</h1>

        {/* ── Description courte (modifie PERSONAL_INFO.bio1) ── */}
        <p style={{
          fontSize: 14,
          color: THEME.light,
          lineHeight: 1.8,
          marginBottom: 28,
        }}>{PERSONAL_INFO.bio1.split(".")[0] + "."}</p>

        <div style={{ display: "flex", gap: 12 }}>
          {/* ── Bouton projets ── */}
          <button
            onClick={onProjectsClick}
            style={{
              fontSize: 13,
              padding: "10px 24px",
              borderRadius: 6,
              background: THEME.accent,
              border: "none",
              color: "#E6F1FB",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >Voir mes projets</button>

          {/* ── Bouton CV (modifie PERSONAL_INFO.cvLink) ── */}
          <a
            href={PERSONAL_INFO.cvLink}
            download
            style={{
              fontSize: 13,
              padding: "10px 24px",
              borderRadius: 6,
              background: "transparent",
              border: `0.5px solid ${THEME.accent}`,
              color: THEME.light,
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >Télécharger CV</a>
        </div>
      </div>

      {/* ── Avatar avec initiales (modifie PERSONAL_INFO.initials) ── */}
      <div style={{
        width: 140,
        height: 140,
        borderRadius: "50%",
        background: THEME.mid,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        border: `2px solid ${THEME.primary}`,
      }}>
        <span style={{ fontSize: 42, fontWeight: 600, color: THEME.pale }}>
          {PERSONAL_INFO.initials}
        </span>
      </div>
    </section>
  );
}

// ── Stats ─────────────────────────────────────────────────────
function StatsBar() {
  return (
    <section style={{
      background: "#f9fafb",
      borderTop: "0.5px solid #e5e7eb",
      borderBottom: "0.5px solid #e5e7eb",
      padding: "24px 40px",
      display: "grid",
      gridTemplateColumns: `repeat(${STATS.length}, 1fr)`,
      textAlign: "center",
    }}>
      {/* ── Modifie les valeurs dans le tableau STATS ── */}
      {STATS.map((s, i) => (
        <div key={i} style={{ borderLeft: i > 0 ? "0.5px solid #e5e7eb" : "none" }}>
          <p style={{ fontSize: 24, fontWeight: 600, color: "#111" }}>{s.value}</p>
          <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{s.label}</p>
        </div>
      ))}
    </section>
  );
}

// ── À propos ─────────────────────────────────────────────────
function About() {
  return (
    <section id="À propos" style={{
      padding: "56px 40px",
      background: "#fff",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 40,
      alignItems: "center",
    }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: THEME.primary, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
          À propos
        </p>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111", marginBottom: 16 }}>
          Passionné par le code,<br />orienté résultats
        </h2>
        {/* ── Modifie tes deux paragraphes dans PERSONAL_INFO.bio1 / bio2 ── */}
        <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.8, marginBottom: 16 }}>{PERSONAL_INFO.bio1}</p>
        <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.8 }}>{PERSONAL_INFO.bio2}</p>
      </div>

      {/* ── Cartes de services (modifie le tableau SERVICES) ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {SERVICES.map((s, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: 14,
            background: "#f9fafb",
            borderRadius: 8,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: s.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, fontSize: 18,
            }}>{s.emoji}</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>{s.title}</p>
              <p style={{ fontSize: 12, color: "#9ca3af" }}>{s.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Projets ───────────────────────────────────────────────────
function Projects() {
  const [hovered, setHovered] = useState(null);

  return (
    <section id="Projets" style={{
      padding: "56px 40px",
      background: "#f9fafb",
      borderTop: "0.5px solid #e5e7eb",
    }}>
      {/* ── En-tête de section ── */}
      <p style={{ fontSize: 11, fontWeight: 600, color: THEME.primary, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
        Réalisations
      </p>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111", marginBottom: 4 }}>Mes projets récents</h2>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 28 }}>
        Des applications conçues de A à Z, de l'idée à la mise en production.
      </p>

      {/*
        ── Grille de projets ──
        Pour ajouter un projet → va dans le tableau PROJECTS en haut du fichier
        et copie/colle un objet avec les champs suivants :
          name, title, description, status, tags, bgColor, nameColor, link
      */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: 16,
      }}>
        {PROJECTS.map((project, i) => (
          <div
            key={i}
            className="card-project"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: "#fff",
              border: "0.5px solid #e5e7eb",
              borderRadius: 12,
              padding: "1.25rem",
              transition: "all 0.3s ease",
              boxShadow: hovered === i ? "0 12px 32px rgba(0,0,0,0.15)" : "0 1px 3px rgba(0,0,0,0.05)",
              transform: hovered === i ? "translateY(-6px)" : "translateY(0)",
              cursor: project.link !== "#" ? "pointer" : "default",
            }}
            onClick={() => project.link !== "#" && window.open(project.link, "_blank")}
          >
            {project.image && (
              <img
                src={project.image}
                alt={project.name}
                style={{
                  width: "100%",
                  borderRadius: 12,
                  marginBottom: 14,
                  minHeight: 140,
                  objectFit: "cover",
                }}
              />
            )}

            <div style={{
              height: 80,
              background: project.bgColor,
              borderRadius: 8,
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: project.nameColor }}>
                {project.name}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{project.title}</p>
              <StatusBadge status={project.status} />
            </div>

            <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, marginBottom: 12 }}>
              {project.description}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {project.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Compétences ───────────────────────────────────────────────
function Skills() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="Compétences" style={{
      padding: "56px 40px",
      background: "#fff",
      borderTop: "0.5px solid #e5e7eb",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 40,
    }}>
      {/* ── Colonne compétences (modifie le tableau SKILLS) ── */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: THEME.primary, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
          Compétences
        </p>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111", marginBottom: 24 }}>Technologies maîtrisées</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {SKILLS.map((skill) => (
            <div key={skill.name} className="skill-item" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "#f8fafc", borderRadius: 14, boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)" }}>
              <img src={skill.logo} alt={skill.name} style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", padding: 6 }} />
              <div style={{ textAlign: "left" }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#111" }}>{skill.name}</p>
                <p style={{ margin: "6px 0 0", fontSize: 12, color: "#6b7280" }}>{skill.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Colonne expérience (modifie le tableau EXPERIENCE) ── */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: THEME.primary, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
          Parcours
        </p>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111", marginBottom: 24 }}>Expérience</h2>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {EXPERIENCE.map((exp, i) => (
            <div key={i} className="experience-item" style={{ display: "flex", gap: 16, paddingBottom: exp.isLast ? 0 : 20 }}>
              {/* ── Indicateur timeline ── */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div className="timeline-dot" style={{
                  width: 12, height: 12, borderRadius: "50%",
                  background: exp.isLast ? THEME.pale : THEME.primary,
                  marginTop: 3, flexShrink: 0,
                  cursor: "pointer",
                }} />
                {!exp.isLast && (
                  <div style={{ width: 2, background: "#e5e7eb", flex: 1, marginTop: 4 }} />
                )}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#111", transition: "all 0.3s ease" }}>{exp.title}</p>
                <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{exp.period}</p>
                {exp.description && (
                  <p style={{ fontSize: 12, color: "#6b7280", marginTop: 6, lineHeight: 1.6 }}>{exp.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────
function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Utiliser Web3Forms pour envoyer l'email
      // 📝 Inscris-toi sur https://web3forms.com (gratuit)
      // puis remplace la clé Access-Key ci-dessous
      const formData = new FormData(e.target);
      formData.append("access_key", "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"); // ← À REMPLACER

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => {
          setSubmitted(false);
          setShowForm(false);
        }, 3000);
      } else {
        console.error("Erreur d'envoi");
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const message = `Bonjour,\n\nNom: ${formData.name}\nEmail: ${formData.email}\nSujet: ${formData.subject}\n\nMessage: ${formData.message}`;
    const encodedMessage = encodeURIComponent(message);
    // ⚠️ REMPLACE LE NUMÉRO WHATSAPP PAR LE TIEN (format international sans +)
    const whatsappNumber = "22896558081"; // Téléphone WhatsApp Togo
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <section id="Contact" style={{
      padding: "56px 40px",
      background: THEME.dark,
      borderTop: `0.5px solid ${THEME.mid}`,
      textAlign: "center",
    }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: THEME.accent, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
        Contact
      </p>
      <h2 style={{ fontSize: 24, fontWeight: 600, color: "#E6F1FB", marginBottom: 12 }}>
        Un projet ? Travaillons ensemble.
      </h2>
      <p style={{ fontSize: 13, color: THEME.light, maxWidth: 400, margin: "0 auto 28px", lineHeight: 1.8 }}>
        Je suis disponible pour des missions en freelance ou des opportunités à temps plein. N'hésitez pas à me contacter.
      </p>

      {/* Boutons d'accueil */}
      {!showForm && (
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 32 }}>
          <button
            onClick={() => setShowForm(true)}
            style={{
              fontSize: 13,
              padding: "10px 24px",
              borderRadius: 6,
              background: THEME.accent,
              border: "none",
              color: "#E6F1FB",
              cursor: "pointer",
              fontWeight: 500,
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
          >✉️ Envoyer un message</button>

          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            style={{
              fontSize: 13,
              padding: "10px 24px",
              borderRadius: 6,
              background: "transparent",
              border: `0.5px solid ${THEME.accent}`,
              color: THEME.light,
              cursor: "pointer",
              fontWeight: 500,
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
          >📧 Email direct</a>
        </div>
      )}

      {/* Formulaire de contact */}
      {showForm && (
        <form 
          onSubmit={handleSubmit}
          style={{
            maxWidth: 500,
            margin: "0 auto",
            padding: "32px",
            background: THEME.mid,
            borderRadius: 12,
            animation: "slideInUp 0.5s ease-out",
          }}
        >
          <div style={{ marginBottom: 20 }}>
            <input
              type="text"
              name="name"
              placeholder="Votre nom"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                border: `0.5px solid ${THEME.primary}`,
                background: THEME.dark,
                color: "#E6F1FB",
                fontSize: 13,
                outline: "none",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = THEME.accent;
                e.target.style.boxShadow = `0 0 8px ${THEME.accent}33`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = THEME.primary;
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <input
              type="email"
              name="email"
              placeholder="Votre email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                border: `0.5px solid ${THEME.primary}`,
                background: THEME.dark,
                color: "#E6F1FB",
                fontSize: 13,
                outline: "none",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = THEME.accent;
                e.target.style.boxShadow = `0 0 8px ${THEME.accent}33`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = THEME.primary;
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <input
              type="text"
              name="subject"
              placeholder="Sujet"
              value={formData.subject}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                border: `0.5px solid ${THEME.primary}`,
                background: THEME.dark,
                color: "#E6F1FB",
                fontSize: 13,
                outline: "none",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = THEME.accent;
                e.target.style.boxShadow = `0 0 8px ${THEME.accent}33`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = THEME.primary;
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <textarea
              name="message"
              placeholder="Votre message..."
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                border: `0.5px solid ${THEME.primary}`,
                background: THEME.dark,
                color: "#E6F1FB",
                fontSize: 13,
                fontFamily: "inherit",
                outline: "none",
                transition: "all 0.3s ease",
                resize: "none",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = THEME.accent;
                e.target.style.boxShadow = `0 0 8px ${THEME.accent}33`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = THEME.primary;
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Message de succès */}
          {submitted && (
            <div style={{
              padding: "12px 16px",
              borderRadius: 8,
              background: "#10B981",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 16,
              animation: "slideInUp 0.3s ease-out",
            }}>
              ✅ Message envoyé avec succès !
            </div>
          )}

          {/* Boutons d'envoi */}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px 24px",
                borderRadius: 6,
                background: THEME.accent,
                border: "none",
                color: "#fff",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 600,
                fontSize: 13,
                transition: "all 0.3s ease",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Envoi..." : "📧 Envoyer"}
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                flex: 1,
                padding: "12px 24px",
                borderRadius: 6,
                background: "transparent",
                border: `0.5px solid ${THEME.accent}`,
                color: THEME.light,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
                transition: "all 0.3s ease",
              }}
            >
              ✕ Annuler
            </button>
          </div>

          {/* Option WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsApp}
            disabled={!formData.name || !formData.message}
            style={{
              width: "100%",
              marginTop: 12,
              padding: "12px 24px",
              borderRadius: 6,
              background: "#25D366",
              border: "none",
              color: "#fff",
              cursor: formData.name && formData.message ? "pointer" : "not-allowed",
              fontWeight: 600,
              fontSize: 13,
              transition: "all 0.3s ease",
              opacity: formData.name && formData.message ? 1 : 0.5,
            }}
          >
            💬 Envoyer via WhatsApp
          </button>
        </form>
      )}

      {/* Liens réseaux sociaux */}
      {!showForm && (
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 24 }}>
          {[
            { label: "LinkedIn", url: PERSONAL_INFO.linkedIn },
            { label: "GitHub",   url: PERSONAL_INFO.github },
            { label: "Twitter / X", url: PERSONAL_INFO.twitter },
          ].map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 12, color: THEME.accent, textDecoration: "underline", transition: "all 0.3s ease" }}
            >{link.label}</a>
          ))}
        </div>
      )}
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      background: THEME.darker,
      padding: "20px 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderTop: `0.5px solid ${THEME.mid}`,
    }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: THEME.pale }}>
        {PERSONAL_INFO.firstName}<span style={{ color: THEME.accent }}>{PERSONAL_INFO.lastName}</span>
      </span>
      {/* ── Modifie l'année dans PERSONAL_INFO.year ── */}
      <span style={{ fontSize: 11, color: THEME.primary }}>
        © {PERSONAL_INFO.year} {PERSONAL_INFO.firstName} {PERSONAL_INFO.lastName} — Tous droits réservés
      </span>
      <div style={{ display: "flex", gap: 20 }}>
        <a href="#" style={{ fontSize: 11, color: THEME.primary, textDecoration: "none" }}>Mentions légales</a>
        <a href="#" style={{ fontSize: 11, color: THEME.primary, textDecoration: "none" }}>Politique de confidentialité</a>
      </div>
    </footer>
  );
}

// ────────────────────────────────────────────────────────────
// 🚀 COMPOSANT PRINCIPAL — App
// ────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("Accueil");

  // Scroll vers une section quand on clique dans la nav
  const handleNav = (section) => {
    setActiveSection(section);
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#fff" }}>
      <Header activeSection={activeSection} onNav={handleNav} />
      <Hero onProjectsClick={() => handleNav("Projets")} />
      <StatsBar />
      <About />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </div>
  );
}
