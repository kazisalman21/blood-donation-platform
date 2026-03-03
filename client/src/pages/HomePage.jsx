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

/* ===== Blood Drop Particle ===== */
const BloodParticles = () => {
    const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 15,
        duration: 10 + Math.random() * 15,
        size: 4 + Math.random() * 12,
        opacity: 0.1 + Math.random() * 0.3,
    }));

    return (
        <div className="blood-particles">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="blood-particle"
                    style={{
                        left: `${p.left}%`,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                        width: `${p.size}px`,
                        height: `${p.size * 1.3}px`,
                        opacity: p.opacity,
                    }}
                />
            ))}
        </div>
    );
};

/* ===== Stat Card ===== */
const StatCard = ({ icon, target, suffix = '', label }) => {
    const [count, ref] = useCountUp(target, 2200);
    return (
        <div className="hero-stat-card" ref={ref}>
            <span className="hero-stat-icon">{icon}</span>
            <span className="hero-stat-value">{count}{suffix}</span>
            <span className="hero-stat-label">{label}</span>
        </div>
    );
};

/* ===== Main Component ===== */
const HomePage = () => {
    const [howRef, howVisible] = useScrollReveal();
    const [whyRef, whyVisible] = useScrollReveal();
    const [compatRef, compatVisible] = useScrollReveal();
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
            {/* ===== HERO ===== */}
            <section className="hero">
                <BloodParticles />
                <div className="hero-glow" />
                <div className="hero-glow hero-glow-2" />
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-pulse" />
                        🩸 Saving Lives Through Technology
                    </div>
                    <h1 className="hero-title">
                        Every Drop of Blood<br />
                        <span className="gradient-text">Saves a Life</span>
                    </h1>
                    <p className="hero-subtitle">
                        Connect with nearby blood donors during emergencies. Our intelligent
                        matching system ensures the right blood type reaches the right patient — fast, secure, and life-saving.
                    </p>
                    <div className="hero-actions">
                        <Link to="/register" className="btn-hero-primary">
                            <span>Become a Donor</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </Link>
                        <Link to="/request/new" className="btn-hero-secondary">
                            <span>🚨 Request Blood</span>
                        </Link>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="hero-stats-row">
                    <StatCard icon="🩸" target={8} label="Blood Types Supported" />
                    <StatCard icon="⚡" target={24} suffix="/7" label="Emergency Matching" />
                    <StatCard icon="🔒" target={100} suffix="%" label="Privacy Protected" />
                    <StatCard icon="🏥" target={56} suffix=" days" label="Smart Cooldown System" />
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className={`section how-section ${howVisible ? 'visible' : ''}`} ref={howRef}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">🔄 Process</span>
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-desc">Four simple steps to save a life</p>
                    </div>
                    <div className="steps-grid">
                        {[
                            { step: '01', icon: '📝', title: 'Register', desc: 'Sign up with your blood type, location, and medical info to join the donor network.', color: '#3b82f6' },
                            { step: '02', icon: '🚨', title: 'Request', desc: 'Post an emergency blood request with hospital details, urgency level, and units needed.', color: '#ef4444' },
                            { step: '03', icon: '🧬', title: 'Match', desc: 'Our algorithm finds compatible, eligible donors near the patient using blood type rules.', color: '#a855f7' },
                            { step: '04', icon: '🤝', title: 'Connect', desc: 'Both parties consent before contact info is shared — privacy and safety guaranteed.', color: '#22c55e' },
                        ].map((item, i) => (
                            <div className="step-card" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
                                <div className="step-number" style={{ color: item.color }}>{item.step}</div>
                                <div className="step-icon">{item.icon}</div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                                <div className="step-glow" style={{ background: item.color }} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== WHY DONATE ===== */}
            <section className={`section why-section ${whyVisible ? 'visible' : ''}`} ref={whyRef}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">❤️ Impact</span>
                        <h2 className="section-title">Why Donate Blood?</h2>
                        <p className="section-desc">Your donation makes a difference beyond measure</p>
                    </div>
                    <div className="impact-grid">
                        <div className="impact-card impact-card-large">
                            <div className="impact-number">1</div>
                            <h3>One Donation, Three Lives</h3>
                            <p>Each blood donation can be separated into red cells, platelets, and plasma — potentially saving up to 3 lives with a single donation.</p>
                        </div>
                        <div className="impact-card">
                            <div className="impact-icon">⏱️</div>
                            <h3>Every 2 Seconds</h3>
                            <p>Someone in the world needs blood. Emergencies, surgeries, and chronic conditions all require blood transfusions.</p>
                        </div>
                        <div className="impact-card">
                            <div className="impact-icon">🔬</div>
                            <h3>No Substitute</h3>
                            <p>Blood cannot be manufactured — it can only come from generous volunteer donors like you.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== BLOOD COMPATIBILITY ===== */}
            <section className={`section compat-section ${compatVisible ? 'visible' : ''}`} ref={compatRef}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">🧬 Science</span>
                        <h2 className="section-title">Blood Type Compatibility</h2>
                        <p className="section-desc">Understanding which blood types can help each other</p>
                    </div>
                    <div className="compat-grid">
                        {compatibilityData.map((blood, i) => (
                            <div className="compat-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="compat-type" style={{ color: blood.color, borderColor: `${blood.color}40` }}>
                                    {blood.type}
                                </div>
                                <div className="compat-info">
                                    <div className="compat-row">
                                        <span className="compat-label">Can give to</span>
                                        <span className="compat-value">{blood.canGive}</span>
                                    </div>
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

            {/* ===== CTA ===== */}
            <section className={`section cta-section ${ctaVisible ? 'visible' : ''}`} ref={ctaRef}>
                <div className="cta-glow" />
                <div className="container cta-content">
                    <h2>Ready to <span className="gradient-text">Save a Life</span>?</h2>
                    <p>Join our community of blood donors and help those in emergency need. Registration takes less than 2 minutes.</p>
                    <div className="cta-actions">
                        <Link to="/register" className="btn-hero-primary">
                            <span>Register Now — It's Free</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
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
