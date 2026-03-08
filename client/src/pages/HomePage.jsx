import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

/* ===== Animated Counter Hook ===== */
const useCountUp = (target, duration = 2000, startOnView = true) => {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(!startOnView);
    const ref = useRef(null);

    useEffect(() => {
        if (!startOnView) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStarted(true); },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [startOnView]);

    useEffect(() => {
        if (!started) return;
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [started, target, duration]);

    return [count, ref];
};

/* ===== Scroll Reveal Hook ===== */
const useScrollReveal = () => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.15 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return [ref, visible];
};

/* ===== SVG Icons ===== */
const Icons = {
    arrow: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
    ),
    emergency: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
            <path d="M12 14v-4M10 12h4" />
        </svg>
    ),
    register: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" /><line x1="16" y1="11" x2="22" y2="11" />
        </svg>
    ),
    request: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <line x1="12" y1="8" x2="12" y2="12" /><line x1="10" y1="10" x2="14" y2="10" />
        </svg>
    ),
    match: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" /><line x1="11" y1="8" x2="11" y2="14" />
        </svg>
    ),
    connect: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    ),
    donors: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    lives: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    ),
    bloodType: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
    ),
    support: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    time: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    noSub: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
    ),
    verified: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
        </svg>
    ),
    hospital: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
        </svg>
    ),
    privacy: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    ),
};

/* ===== Stat Card ===== */
const StatCard = ({ icon, target, suffix = '', label }) => {
    const [count, ref] = useCountUp(target, 2200);
    return (
        <div className="stat-card" ref={ref}>
            <span className="stat-icon">{icon}</span>
            <span className="stat-value">{count.toLocaleString()}{suffix}</span>
            <span className="stat-label">{label}</span>
        </div>
    );
};

/* ===== Main Component ===== */
const HomePage = () => {
    const [statsRef, statsVisible] = useScrollReveal();
    const [howRef, howVisible] = useScrollReveal();
    const [whyRef, whyVisible] = useScrollReveal();
    const [compatRef, compatVisible] = useScrollReveal();
    const [trustRef, trustVisible] = useScrollReveal();
    const [ctaRef, ctaVisible] = useScrollReveal();

    const compatibilityData = [
        { type: 'O−', canGive: 'Everyone', canReceive: 'O−', color: '#22c55e' },
        { type: 'O+', canGive: 'O+, A+, B+, AB+', canReceive: 'O+, O−', color: '#22c55e' },
        { type: 'A−', canGive: 'A−, A+, AB−, AB+', canReceive: 'A−, O−', color: '#3b82f6' },
        { type: 'A+', canGive: 'A+, AB+', canReceive: 'A+, A−, O+, O−', color: '#3b82f6' },
        { type: 'B−', canGive: 'B−, B+, AB−, AB+', canReceive: 'B−, O−', color: '#a855f7' },
        { type: 'B+', canGive: 'B+, AB+', canReceive: 'B+, B−, O+, O−', color: '#a855f7' },
        { type: 'AB−', canGive: 'AB−, AB+', canReceive: 'AB−, A−, B−, O−', color: '#f59e0b' },
        { type: 'AB+', canGive: 'AB+ only', canReceive: 'Everyone', color: '#f59e0b' },
    ];

    return (
        <div className="home-page">
            {/* ===== HERO (Dark) ===== */}
            <section className="hero section-dark">
                <div className="hero-glow" />
                <div className="hero-glow hero-glow-2" />
                <div className="hero-inner container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <span className="badge-pulse" />
                            Saving Lives Through Technology
                        </div>
                        <h1 className="hero-title">
                            Donate Blood,<br />
                            <span className="gradient-text">Save Lives</span>
                        </h1>
                        <p className="hero-subtitle">
                            Connect with nearby blood donors during emergencies. Our intelligent
                            matching system ensures the right blood type reaches the right patient — fast, secure, and life-saving.
                        </p>
                        <div className="hero-actions">
                            <Link to="/register" className="btn-hero-primary">
                                <span>Become a Donor</span>
                                {Icons.arrow}
                            </Link>
                            <Link to="/request/new" className="btn-hero-secondary">
                                {Icons.emergency}
                                <span>Request Blood</span>
                            </Link>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="hero-visual-glow" />
                        <img
                            src="/hero-illustration.png"
                            alt="Blood donation illustration"
                            className="hero-illustration"
                        />
                    </div>
                </div>
            </section>

            {/* ===== STATS (White) ===== */}
            <section className={`section stats-section ${statsVisible ? 'visible' : ''}`} ref={statsRef}>
                <div className="container">
                    <div className="stats-grid">
                        <StatCard icon={Icons.donors} target={500} suffix="+" label="Active Donors" />
                        <StatCard icon={Icons.lives} target={1200} suffix="+" label="Lives Impacted" />
                        <StatCard icon={Icons.bloodType} target={8} label="Blood Types Supported" />
                        <StatCard icon={Icons.support} target={24} suffix="/7" label="Emergency Support" />
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS (Rose) ===== */}
            <section className={`section how-section ${howVisible ? 'visible' : ''}`} ref={howRef}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">How It Works</span>
                        <h2 className="section-title">Four Simple Steps to Save a Life</h2>
                        <p className="section-desc">From registration to connecting donors with patients in need — here's how our platform works.</p>
                    </div>
                    <div className="steps-grid">
                        {[
                            { step: '01', icon: Icons.register, title: 'Register', desc: 'Sign up with your blood type, location, and medical info to join the donor network.', color: '#3b82f6' },
                            { step: '02', icon: Icons.request, title: 'Request', desc: 'Post an emergency blood request with hospital details, urgency level, and units needed.', color: '#ef4444' },
                            { step: '03', icon: Icons.match, title: 'Match', desc: 'Our algorithm finds compatible, eligible donors near the patient using blood type rules.', color: '#a855f7' },
                            { step: '04', icon: Icons.connect, title: 'Connect', desc: 'Both parties consent before contact info is shared — privacy and safety guaranteed.', color: '#22c55e' },
                        ].map((item, i) => (
                            <div className="step-card" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
                                <div className="step-top">
                                    <div className="step-icon-wrap" style={{ background: `${item.color}10`, color: item.color }}>
                                        {item.icon}
                                    </div>
                                    <span className="step-number" style={{ color: `${item.color}30` }}>{item.step}</span>
                                </div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                                <div className="step-accent" style={{ background: item.color }} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== WHY DONATE (White) ===== */}
            <section className={`section why-section ${whyVisible ? 'visible' : ''}`} ref={whyRef}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Why It Matters</span>
                        <h2 className="section-title">Why Donate Blood?</h2>
                        <p className="section-desc">Your donation makes a difference beyond measure</p>
                    </div>
                    <div className="impact-grid">
                        <div className="impact-card impact-card-featured">
                            <div className="impact-number">3</div>
                            <h3>One Donation, Three Lives</h3>
                            <p>Each blood donation can be separated into red cells, platelets, and plasma — potentially saving up to 3 lives with a single donation.</p>
                        </div>
                        <div className="impact-card">
                            <div className="impact-icon-wrap">{Icons.time}</div>
                            <h3>Every 2 Seconds</h3>
                            <p>Someone in the world needs blood. Emergencies, surgeries, and chronic conditions all require transfusions.</p>
                        </div>
                        <div className="impact-card">
                            <div className="impact-icon-wrap">{Icons.noSub}</div>
                            <h3>No Substitute</h3>
                            <p>Blood cannot be manufactured — it can only come from generous volunteer donors like you.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== BLOOD COMPATIBILITY (Rose) ===== */}
            <section className={`section compat-section ${compatVisible ? 'visible' : ''}`} ref={compatRef}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Blood Science</span>
                        <h2 className="section-title">Blood Type Compatibility</h2>
                        <p className="section-desc">Understanding which blood types can help each other</p>
                    </div>
                    <div className="compat-grid">
                        {compatibilityData.map((blood, i) => (
                            <div className="compat-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                                <div className="compat-type" style={{ color: blood.color }}>
                                    {blood.type}
                                </div>
                                <div className="compat-info">
                                    <div className="compat-row">
                                        <span className="compat-label">Can give to</span>
                                        <span className="compat-value">{blood.canGive}</span>
                                    </div>
                                    <div className="compat-divider" />
                                    <div className="compat-row">
                                        <span className="compat-label">Can receive</span>
                                        <span className="compat-value">{blood.canReceive}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== TRUST SECTION (White) ===== */}
            <section className={`section trust-section ${trustVisible ? 'visible' : ''}`} ref={trustRef}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Trust & Safety</span>
                        <h2 className="section-title">Built on Trust</h2>
                        <p className="section-desc">Your safety and privacy are our top priorities</p>
                    </div>
                    <div className="trust-grid">
                        <div className="trust-card">
                            <div className="trust-icon">{Icons.verified}</div>
                            <h3>Verified Donors</h3>
                            <p>Every donor is verified through our registration system with verified blood type and medical information.</p>
                        </div>
                        <div className="trust-card">
                            <div className="trust-icon">{Icons.hospital}</div>
                            <h3>Hospital Connected</h3>
                            <p>Blood requests are linked to specific hospitals, ensuring legitimate and trackable emergency needs.</p>
                        </div>
                        <div className="trust-card">
                            <div className="trust-icon">{Icons.privacy}</div>
                            <h3>Privacy First</h3>
                            <p>Contact information is only shared after mutual consent. Your data stays protected at every step.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CTA (Dark) ===== */}
            <section className={`section section-dark cta-section ${ctaVisible ? 'visible' : ''}`} ref={ctaRef}>
                <div className="cta-glow" />
                <div className="container cta-content">
                    <h2>Ready to <span className="gradient-text">Save a Life</span>?</h2>
                    <p>Join our community of blood donors and help those in emergency need. Registration takes less than 2 minutes.</p>
                    <div className="cta-actions">
                        <Link to="/register" className="btn-hero-primary">
                            <span>Register Now — It's Free</span>
                            {Icons.arrow}
                        </Link>
                        <Link to="/login" className="btn-hero-secondary">
                            <span>Already a donor? Login</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
