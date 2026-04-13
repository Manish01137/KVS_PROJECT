import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

const GOLD = '#c4964a';
const GOLD2 = '#e8b86d';

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [count, setCount] = useState({ players: 0, years: 0, coaches: 0, students: 0 });

  const slides = [
    {
      title: 'राजस्थान का गौरव',
      subtitle: 'PRIDE OF RAJASTHAN',
      desc: 'Where Jodhpur\'s warriors train to become national champions',
      img: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1600&q=80',
    },
    {
      title: 'कबड्डी की शान',
      subtitle: 'THE ART OF KABADDI',
      desc: 'Ancient sport. Modern training. National glory.',
      img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80',
    },
    {
      title: 'चैंपियन बनो',
      subtitle: 'BECOME A CHAMPION',
      desc: 'NIS-certified coaching with world-class facilities in the Blue City',
      img: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=1600&q=80',
    },
  ];

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Count up animation
  useEffect(() => {
    const targets = { players: 20, years: 2, coaches: 2, students: 150 };
    const duration = 2000;
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCount({
        players:  Math.round(targets.players  * progress),
        years:    Math.round(targets.years    * progress),
        coaches:  Math.round(targets.coaches  * progress),
        students: Math.round(targets.students * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ background: '#080808', color: '#fff', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Tiro+Devanagari+Hindi&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar />

      {/* HERO */}
      <section style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
        {slides.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${s.img})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: slide === i ? 1 : 0,
            transition: 'opacity 1.2s ease',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.55) 60%, rgba(8,8,8,0.3) 100%)' }} />
          </div>
        ))}

        {/* Rajasthan pattern overlay */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'repeating-linear-gradient(45deg, #c4964a 0, #c4964a 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 48px', maxWidth: 900 }}>
          {/* Hindi title */}
          <div style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontFamily: "'Tiro Devanagari Hindi', serif", color: GOLD, marginBottom: 8, opacity: 0.9, letterSpacing: 2 }}>
            {slides[slide].title}
          </div>
          <h1 style={{ fontSize: 'clamp(52px, 9vw, 110px)', fontFamily: "'Bebas Neue', sans-serif", lineHeight: 0.88, letterSpacing: 5, margin: '0 0 16px', color: '#fff' }}>
            {slides[slide].subtitle}
          </h1>
          <div style={{ width: 80, height: 3, background: `linear-gradient(90deg, ${GOLD}, ${GOLD2})`, marginBottom: 20, borderRadius: 2 }} />
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.65)', maxWidth: 480, lineHeight: 1.7, marginBottom: 40, fontWeight: 300 }}>
            {slides[slide].desc}
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link to="/login" style={{
              background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`,
              color: '#080808', padding: '15px 40px', textDecoration: 'none',
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3, borderRadius: 3,
            }}>ENROLL NOW →</Link>
            <Link to="/about" style={{
              border: `1px solid rgba(196,150,74,0.5)`, color: '#fff',
              padding: '15px 40px', textDecoration: 'none',
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3, borderRadius: 3,
            }}>OUR STORY</Link>
          </div>
        </div>

        {/* Slide dots */}
        <div style={{ position: 'absolute', bottom: 120, left: 48, zIndex: 2, display: 'flex', gap: 8 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} style={{
              width: i === slide ? 36 : 8, height: 8, borderRadius: 4,
              border: 'none', cursor: 'pointer', transition: 'all 0.3s',
              background: i === slide ? GOLD : 'rgba(255,255,255,0.25)',
            }} />
          ))}
        </div>

        {/* Stats bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2,
          background: `linear-gradient(90deg, ${GOLD}, #b8833a)`,
          padding: '18px 48px', display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
        }}>
          {[
            { num: `${count.players}+`, label: 'National Players' },
            { num: `${count.years}+`, label: 'Years of Excellence' },
            { num: `${count.coaches}`, label: 'Expert Coaches' },
            { num: `${count.students}+`, label: 'Students Trained' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2, color: '#080808' }}>{s.num}</div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 2, color: 'rgba(8,8,8,0.7)', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WELCOME STRIP */}
      <section style={{ background: '#0d0d0d', padding: '72px 48px', textAlign: 'center', borderBottom: `1px solid rgba(196,150,74,0.1)` }}>
        <div style={{ fontSize: 12, color: GOLD, letterSpacing: 5, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase' }}>Welcome to KVS Academy</div>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 60px)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 4, marginBottom: 16, maxWidth: 800, margin: '0 auto 16px' }}>
          जोधपुर की धरती से उठे सितारे
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', maxWidth: 680, margin: '0 auto', lineHeight: 1.9, fontWeight: 300 }}>
          From the majestic Blue City of Jodhpur, KVS Kabaddi Academy carries the warrior spirit of Rajasthan. We train players who not only excel on the mat but carry the pride of Marwar with every raid and tackle.
        </p>
        <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 48, flexWrap: 'wrap' }}>
          {[
            { icon: '🏆', title: 'Rajasthan State Level', desc: 'Multiple players representing state' },
            { icon: '🎯', title: 'NIS Certified Coaching', desc: 'Scientifically structured training' },
            { icon: '🏠', title: 'Hostel Facility', desc: 'Live, eat and train together' },
            { icon: '🏋️', title: 'Modern Gym', desc: 'Newly opened strength facility' },
          ].map(f => (
            <div key={f.title} style={{ textAlign: 'center', maxWidth: 180 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, color: GOLD }}>{f.title}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 300, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* QUICK PROGRAMS */}
      <section style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ fontSize: 11, color: GOLD, letterSpacing: 5, fontWeight: 600, marginBottom: 10 }}>OUR PROGRAMS</div>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 4 }}>CHOOSE YOUR PATH</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {[
            { icon: '🏃', title: 'Kabaddi Training', price: '₹1,000/mo', desc: 'Daily sessions with expert coaches. Learn raids, tackles, strategy and stamina building from the ground up.', link: '/pricing' },
            { icon: '🏠', title: 'Hostel + Training', price: '₹5,500/mo', desc: 'Complete immersion — stay, eat healthy meals, train twice daily. The choice of serious players aiming for state and national level.', link: '/pricing', featured: true },
            { icon: '🏋️', title: 'Gym Only', price: '₹800/mo', desc: 'Modern equipment, open 6AM–9PM. Cardio, strength, functional training. Open to all members.', link: '/gym' },
            { icon: '⚡', title: 'Combo Plan', price: '₹1,600/mo', desc: 'Kabaddi training + full gym access. Save ₹200 every month with this powerful combination.', link: '/pricing' },
          ].map(p => (
            <div key={p.title} style={{
              background: p.featured ? `linear-gradient(145deg, ${GOLD}22, ${GOLD}08)` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${p.featured ? GOLD : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 10, padding: 28, position: 'relative',
              transform: p.featured ? 'scale(1.02)' : 'none',
            }}>
              {p.featured && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: GOLD, color: '#080808', fontSize: 9, fontWeight: 700, letterSpacing: 3, padding: '4px 16px', borderRadius: 20 }}>MOST POPULAR</div>}
              <div style={{ fontSize: 28, marginBottom: 12 }}>{p.icon}</div>
              <div style={{ fontSize: 18, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2, marginBottom: 4, color: p.featured ? GOLD : '#fff' }}>{p.title}</div>
              <div style={{ fontSize: 24, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2, marginBottom: 14, color: '#fff' }}>{p.price}</div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 20, fontWeight: 300 }}>{p.desc}</p>
              <Link to={p.link} style={{ fontSize: 11, color: GOLD, textDecoration: 'none', letterSpacing: 2, fontWeight: 600 }}>LEARN MORE →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* RAJASTHAN HERITAGE BAND */}
      <section style={{ background: `linear-gradient(135deg, #0d0a06, #1a1208)`, padding: '80px 48px', borderTop: `1px solid rgba(196,150,74,0.1)`, borderBottom: `1px solid rgba(196,150,74,0.1)` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: GOLD, letterSpacing: 5, fontWeight: 600, marginBottom: 12 }}>RAJASTHAN'S KABADDI LEGACY</div>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 58px)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 3, lineHeight: 0.9, marginBottom: 20 }}>
              THE WARRIOR<br /><span style={{ color: GOLD }}>SPIRIT OF MARWAR</span>
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.9, marginBottom: 16, fontWeight: 300 }}>
              Kabaddi flows through the veins of Rajasthan. From the village akhadas of Marwar to national arenas, the warriors of this land have always carried an unmatched spirit — fearless, fierce, and full of pride.
            </p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.9, marginBottom: 28, fontWeight: 300 }}>
              KVS Academy channels this ancient warrior tradition into modern competitive kabaddi. Our training grounds in Jodhpur are where the legacy continues — one raid at a time.
            </p>
            <div style={{ display: 'flex', gap: 32 }}>
              {[['मारवाड़', 'Marwar Tradition'], ['जोधपुर', 'Blue City Pride'], ['राजस्थान', 'State Champions']].map(([hindi, eng]) => (
                <div key={eng}>
                  <div style={{ fontSize: 18, fontFamily: "'Tiro Devanagari Hindi', serif", color: GOLD, marginBottom: 2 }}>{hindi}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, fontWeight: 500 }}>{eng}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&q=80',
              'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
              'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
              'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&q=80',
            ].map((img, i) => (
              <div key={i} style={{ borderRadius: 6, overflow: 'hidden', height: 160, border: `1px solid rgba(196,150,74,0.15)` }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 48px', textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ fontSize: 11, color: GOLD, letterSpacing: 5, fontWeight: 600, marginBottom: 12 }}>READY TO START?</div>
        <h2 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 4, marginBottom: 16 }}>
          YOUR KABADDI JOURNEY STARTS HERE
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: 36, fontWeight: 300 }}>
          Limited seats available. Join KVS Academy today and train alongside Rajasthan's finest kabaddi talent.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/login" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, color: '#080808', padding: '16px 44px', textDecoration: 'none', fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3, borderRadius: 3 }}>ENROLL NOW</Link>
          <Link to="/contact" style={{ border: `1px solid ${GOLD}55`, color: GOLD, padding: '16px 44px', textDecoration: 'none', fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3, borderRadius: 3 }}>ENQUIRE</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
