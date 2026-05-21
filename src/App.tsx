import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { MiniGame } from './MiniGame'
import './App.css'

const site = {
  name: 'Edsil B. Trinidad',
  role: 'Full Stack Developer',
  about:
    'I am a passionate Full Stack Developer with experience in both front-end and back-end development, dedicated to building efficient and user-friendly applications, and committed to continuous learning and delivering high-quality solutions.',
  portraitSrc: '/edsil-profile.png',
  phone: '09056563951',
  phoneTel: '+639056563951',
  email: 'edsiltrinidad15@gmail.com',
  social: [
    { label: 'GitHub', href: 'https://github.com/Edsiltrinidad' },
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/edseyl.19Trinidad/',
    },
  ],
  education: {
    degree: 'Bachelor of Science in Information Technology',
    school: 'Davao del Norte State College',
    period: 'June 2022 — June 2026',
  },
  experience: [
    {
      title: 'Programmer / Development',
      organization: 'Holy Child College of Panabo',
      date: 'February 2026',
      location: 'Davao — Panabo',
      highlights: [
        'Worked as a full stack developer, developing and maintaining web applications and performed tasks aligned with NC II in ICT standards.',
      ],
    },
  ],
  skills: {
    soft: ['Decision-Making', 'Communication Skill', 'Adaptability'],
    technical: [
      {
        category: 'Frontend development',
        items: ['Vue.js', 'Quasar', 'JavaScript', 'Tailwind CSS', 'Next.js'],
      },
      {
        category: 'Backend development',
        items: ['PHP', 'Laravel', 'Python'],
      },
      {
        category: 'Database & tools',
        items: ['MySQL', 'PostgreSQL', 'MSSQL', 'Git'],
      },
    ],
  },
  certificates: [
    {
      title: 'Certificate of Completion — Capstone project',
      issuer: 'National Irrigation Administration',
      date: 'Mar 30, 2026',
      detail:
        'IrrigTrack: asset management with predictive analytics — presentation, deployment & implementation.',
      image: '/certs/nia-irrigtrack-capstone.png',
    },
    {
      title: 'Graphic Design seminar — Day 2',
      issuer: 'Davao del Norte State College · Institute of Computing',
      date: 'Nov 5, 2025',
      detail:
        'Advanced Seminar Series (BSIT 4th Year): “The Power of Color in Graphic Design”.',
      image: '/certs/dnsc-graphic-design-day-2-a.png',
    },
    {
      title: 'Graphic Design seminar — Day 2',
      issuer: 'Davao del Norte State College · Institute of Computing',
      date: 'Nov 5, 2025',
      detail: 'Certificate of completion (second issue).',
      image: '/certs/dnsc-graphic-design-day-2-b.png',
    },
    {
      title: 'Certificate of Participation',
      issuer: 'Davao del Norte State College',
      date: 'Sep 15, 2025',
      detail:
        'Test interpretation, 3K session (Kwentuhan, Kumustahan, Kahalagahan), and internship etiquette — via MS Teams.',
      image: '/certs/dnsc-seminar-day-1.png',
    },
    {
      title: 'Introduction to Packet Tracer',
      issuer: 'Cisco Networking Academy',
      date: 'Jan 29, 2024',
      detail: 'Networking lab foundations with Cisco Packet Tracer.',
      image: '/certs/cisco-packet-tracer.png',
    },
  ],
  projects: [
    {
      title: 'IrrigTrack',
      period: 'Capstone · 2026',
      description:
        'IRRIGTRACK: An asset management system using predictive analytics for the National Irrigation Administration — inventory tracking, analytics dashboards, QR workflows, reporting, and supply management in one cohesive ops toolkit.',
      tags: ['Vue.js', 'Laravel', 'PostgreSQL', 'Python'],
      links: [
        { label: 'Demo', href: '#' },
        { label: 'Repository', href: '#' },
      ],
      gallery: [
        {
          src: '/projects/irrigtrack-dashboard.png',
          alt: 'IrrigTrack dashboard with metrics, inventory condition overview, and navigation sidebar.',
          caption: 'Dashboard — KPIs & inventory overview',
        },
        {
          src: '/projects/irrigtrack-login.png',
          alt: 'IrrigTrack login screen with NIA branding and split-layout authentication.',
          caption: 'Login — branded gate & facility context',
        },
      ],
    },
  ],
}

type Certificate = (typeof site.certificates)[number]

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    typeof document !== 'undefined' &&
    document.documentElement.getAttribute('data-theme') === 'light'
      ? 'light'
      : 'dark',
  )
  const [scrolled, setScrolled] = useState(false)
  const [certModal, setCertModal] = useState<Certificate | null>(null)
  const [gameOpen, setGameOpen] = useState(false)

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    document.documentElement.style.colorScheme = next
    localStorage.setItem('theme', next)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal-on-scroll')
    if (nodes.length === 0) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      nodes.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.07, rootMargin: '0px 0px -7% 0px' },
    )

    nodes.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!certModal) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCertModal(null)
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [certModal])

  const certModalNode =
    certModal &&
    createPortal(
      <div
        className="cert-modal-backdrop"
        role="presentation"
        onClick={() => setCertModal(null)}
      >
        <div
          className="cert-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cert-modal-title"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="cert-modal__close"
            onClick={() => setCertModal(null)}
            aria-label="Close certificate"
          >
            <span aria-hidden="true">×</span>
          </button>
          <div className="cert-modal__header">
            <p className="cert-modal__issuer">{certModal.issuer}</p>
            <h3 id="cert-modal-title" className="cert-modal__title">
              {certModal.title}
            </h3>
            <p className="cert-modal__meta">{certModal.date}</p>
          </div>
          <div className="cert-modal__viewport">
            <img
              src={certModal.image}
              alt={`Full certificate: ${certModal.title}`}
              className="cert-modal__img"
              decoding="async"
            />
          </div>
        </div>
      </div>,
      document.body,
    )

  return (
    <div className="app">
      <div className="bg-mesh" aria-hidden="true">
        <span className="bg-mesh__blob bg-mesh__blob--a" />
        <span className="bg-mesh__blob bg-mesh__blob--b" />
        <span className="bg-mesh__blob bg-mesh__blob--c" />
        <span className="bg-mesh__blob bg-mesh__blob--d" />
      </div>
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-noise" aria-hidden="true" />

      <div className="shell">
        <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
          <a className="brand" href="#top">
            <img className="brand__mark" src={site.portraitSrc} alt="" />
            <span className="brand__text">{site.name}</span>
          </a>
          <div className="site-header__actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? (
                <svg className="theme-toggle__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="1.75" />
                  <path
                    d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg className="theme-toggle__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M21 14.5a8 8 0 01-8.72-8.72 7 7 0 109.72 9.72A8 8 0 0121 14.5z"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
            <nav className="nav" aria-label="Primary">
              <a href="#about">About</a>
              <a href="#education">Education</a>
              <a href="#experience">Experience</a>
              <a href="#skills">Skills</a>
              <a href="#projects">Projects</a>
              <a href="#certificates">Certificates</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>
        </header>

        <main id="top">
          <section className="hero hero--intro" aria-labelledby="hero-heading">
            <div className="hero__grid">
              <div className="hero__main">
                <p className="hero__eyebrow">
                  <span className="hero__eyebrow-dot" aria-hidden="true" />
                  Open to opportunities
                  <span className="hero__eyebrow-spark" aria-hidden="true">
                    ✦
                  </span>
                  Portfolio &amp; builds
                </p>
                <h1 id="hero-heading" className="hero__title">
                  Hi, I&apos;m{' '}
                  <span className="hero__name">{site.name}</span>
                </h1>
                <p className="hero__role">{site.role}</p>
                <div className="hero__actions">
                  <a className="btn btn--primary" href="#projects">
                    <span>View work</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                  <a className="btn btn--ghost" href="#contact">
                    Get in touch
                  </a>
                  <button
                    type="button"
                    className="btn btn--game"
                    onClick={() => setGameOpen(true)}
                  >
                    <span aria-hidden="true">★</span> Mini challenge
                  </button>
                </div>
              </div>

              <aside className="hero__visual">
                <figure className="hero-photo">
                  <div className="hero-photo__ambient" aria-hidden="true">
                    <span className="hero-photo__blob hero-photo__blob--mint" />
                    <span className="hero-photo__blob hero-photo__blob--navy" />
                  </div>
                  <div className="hero-photo__frame">
                    <div className="hero-photo__orbit" aria-hidden="true" />
                    <div className="hero-photo__shine" aria-hidden="true" />
                    <div className="hero-photo__mat">
                      <div className="hero-photo__crop">
                        <img
                          className="hero-photo__img"
                          src={site.portraitSrc}
                          alt={`Portrait of ${site.name}`}
                          width={480}
                          height={600}
                          decoding="async"
                          fetchPriority="high"
                        />
                        <div className="hero-photo__badge">
                          <span className="hero-photo__badge-dot" aria-hidden="true" />
                          {site.role}
                        </div>
                      </div>
                    </div>
                  </div>
                  <figcaption className="hero-photo__meta">
                    <span className="hero-photo__sig">&lt;/&gt;</span>
                    <span className="hero-photo__sig-label">Build · ship · iterate</span>
                  </figcaption>
                </figure>
                <ul className="hero-chip-row">
                  <li className="hero-chip">Vue.js</li>
                  <li className="hero-chip hero-chip--accent">Laravel</li>
                  <li className="hero-chip">PostgreSQL</li>
                  <li className="hero-chip">Python</li>
                </ul>
              </aside>
            </div>
          </section>

          <div className="section-rule" aria-hidden="true" />

          <section id="about" className="section section--about reveal-on-scroll">
            <div className="section__head section__head--row">
              <div>
                <p className="section__label">About</p>
                <h2 id="about-heading" className="section__title">
                  About me
                </h2>
              </div>
              <p className="section__kicker">
                Full stack focus — front-end to back-end — with an emphasis on clarity, usability, and steady improvement.
              </p>
            </div>
            <div className="about__copy panel panel--soft about__copy--lead">
              <p>{site.about}</p>
            </div>
          </section>

          <section id="education" className="section section--education reveal-on-scroll">
            <div className="section__head section__head--row">
              <div>
                <p className="section__label">Education</p>
                <h2 id="education-heading" className="section__title">
                  Academic background
                </h2>
              </div>
              <p className="section__kicker">
                Undergraduate studies aligned with computing, systems design, and industry-facing projects like IrrigTrack.
              </p>
            </div>
            <article className="education-card panel panel--soft">
              <p className="education-card__period">{site.education.period}</p>
              <h3 className="education-card__degree">{site.education.degree}</h3>
              <p className="education-card__school">{site.education.school}</p>
            </article>
          </section>

          <section id="experience" className="section section--experience reveal-on-scroll">
            <div className="section__head section__head--row">
              <div>
                <p className="section__label">Experience</p>
                <h2 id="experience-heading" className="section__title">
                  Professional roles
                </h2>
              </div>
              <p className="section__kicker">
                Hands-on development aligned with industry competencies — including NC II in ICT standards.
              </p>
            </div>
            <ul className="experience-list">
              {site.experience.map((job) => (
                <li key={`${job.organization}-${job.date}`}>
                  <article className="experience-card panel panel--soft">
                    <h3 className="experience-card__title">{job.title}</h3>
                    <p className="experience-card__meta">
                      <span className="experience-card__org">{job.organization}</span>
                      <span className="experience-card__sep" aria-hidden="true">
                        |
                      </span>
                      <span className="experience-card__date">{job.date}</span>
                    </p>
                    <p className="experience-card__location">{job.location}</p>
                    <ul className="experience-card__bullets">
                      {job.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </article>
                </li>
              ))}
            </ul>
          </section>

          <section id="skills" className="section section--skills reveal-on-scroll">
            <div className="section__head">
              <p className="section__label">Skills</p>
              <h2 id="skills-heading" className="section__title">
                Tools &amp; focus areas
              </h2>
            </div>

            <div className="skills-layout">
              <div className="skills-block">
                <h3 className="skills-subhead">Soft skills</h3>
                <ul className="skills-bullets">
                  {site.skills.soft.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="skills-block">
                <h3 className="skills-subhead">Technical skills</h3>
                <div className="skills-tech">
                  {site.skills.technical.map((group) => (
                    <div key={group.category} className="skills-tech__row">
                      <p className="skills-tech__label">{group.category}</p>
                      <div className="skills-pills" role="list">
                        {group.items.map((item) => (
                          <span key={item} className="skill-pill" role="listitem">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section
            id="projects"
            className="section section--projects reveal-on-scroll"
            aria-labelledby="projects-heading"
          >
            <div className="section__head section__head--row">
              <div>
                <p className="section__label">Projects</p>
                <h2 id="projects-heading" className="section__title">
                  Selected work
                </h2>
              </div>
              <p className="section__kicker">
                Flagship capstone: IrrigTrack for NIA — shipped UI screens below; add demo & repo links when ready.
              </p>
            </div>
            <div className="projects">
              {site.projects.map((project, i) => (
                <article
                  key={project.title}
                  className={`project-card${i === 0 ? ' project-card--featured' : ''}`}
                >
                  <div className="project-card__accent" aria-hidden="true" />
                  <div className="project-card__body">
                    {project.gallery && project.gallery.length > 0 && (
                      <div className="project-card__gallery">
                        {project.gallery.map((shot) => (
                          <figure key={shot.src} className="project-card__figure">
                            <div className="project-card__shot">
                              <img src={shot.src} alt={shot.alt} loading="lazy" />
                            </div>
                            {shot.caption && (
                              <figcaption className="project-card__caption">{shot.caption}</figcaption>
                            )}
                          </figure>
                        ))}
                      </div>
                    )}
                    <p className="project-card__meta">{project.period}</p>
                    <h3 className="project-card__title">{project.title}</h3>
                    <p className="project-card__desc">{project.description}</p>
                    <div className="project-card__tags">
                      {project.tags.map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="project-card__links">
                      {project.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {link.label}
                          <span className="project-card__link-arrow" aria-hidden="true">
                            ↗
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section
            id="certificates"
            className="section section--certificates reveal-on-scroll"
            aria-labelledby="certificates-heading"
          >
            <div className="section__head section__head--row">
              <div>
                <p className="section__label">Recognition</p>
                <h2 id="certificates-heading" className="section__title">
                  Achievements &amp; certificates
                </h2>
              </div>
              <p className="section__kicker">
                Formal training, seminars, and institutional recognition — click a card to view the full certificate in a modal.
              </p>
            </div>
            <ul className="cert-grid">
              {site.certificates.map((cert) => (
                <li key={cert.image}>
                  <button
                    type="button"
                    className="cert-card"
                    aria-label={`View full certificate: ${cert.title}, ${cert.issuer}`}
                    onClick={() => setCertModal(cert)}
                  >
                    <div className="cert-card__preview">
                      <img
                        src={cert.image}
                        alt=""
                        className="cert-card__img"
                        loading="lazy"
                      />
                      <span className="cert-modal-hint" aria-hidden="true">
                        View larger
                      </span>
                    </div>
                    <div className="cert-card__body">
                      <p className="cert-card__issuer">{cert.issuer}</p>
                      <h3 className="cert-card__title">{cert.title}</h3>
                      <p className="cert-card__detail">{cert.detail}</p>
                      <p className="cert-card__date">{cert.date}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section id="contact" className="section reveal-on-scroll" aria-labelledby="contact-heading">
            <div className="section__head">
              <p className="section__label">Contact</p>
              <h2 id="contact-heading" className="section__title">
                Let&apos;s talk
              </h2>
            </div>
            <div className="contact-panel panel panel--glow">
              <div className="contact-panel__grid">
                <div>
                  <p>
                    Whether you&apos;re hiring, collaborating, or just want to swap notes
                    on a problem you&apos;re solving — I&apos;d love to hear from you.
                  </p>
                </div>
                <div className="contact-panel__cta">
                  <a className="contact-phone" href={`tel:${site.phoneTel}`}>
                    {site.phone}
                  </a>
                  <a className="contact-email" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                  <div className="social-row">
                    {site.social.map((s) => (
                      <a key={s.href} href={s.href} target="_blank" rel="noreferrer">
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <a href="#top">Back to top</a>
        </footer>
      </div>
      {certModalNode}
      {gameOpen && <MiniGame onClose={() => setGameOpen(false)} />}
    </div>
  )
}

export default App
