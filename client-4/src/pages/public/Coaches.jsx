import { Link } from 'react-router-dom';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

const GOLD = '#c4964a';
const GOLD2 = '#e8b86d';

export default function Coaches() {
  const coaches = [
    {
      name: 'Surendra Singh Bhati',
      role: 'Head Coach',
      hindi: 'सुरेन्द्र सिंह भाटी',
      exp: '2+ Years Coaching Experience',
      from: 'Jodhpur, Rajasthan',
      spec: ['Offensive Raiding Strategies', 'Player Positioning', 'Match Psychology', 'Youth Development'],
      bio: 'Coach Surendra Singh Bhati is the driving force behind KVS Academy. Born and raised in Jodhpur, he brings the warrior spirit of Rajasthan to every training session. His expertise in offensive kabaddi strategies has helped produce raiders who dominate at the district and state level.',
      bio2: 'Coach Bhati believes kabaddi is 40% physical and 60% mental. His training methodology focuses on building fearless, smart players who can read a game and adapt — the hallmark of a true Rajasthani kabaddi warrior.',
      achievements: ['Trained 10+ state-level raiders', 'Developed 5 national-level players', 'Multiple district championship teams', 'Mentored junior national camp players'],
      img: '/images/coaches/surendra-singh-bhati.jpg',
    },
    {
      name: 'Naman Choudhary',
      role: 'NIS Certified Coach',
      hindi: 'नमन चौधरी',
      exp: 'NIS Certified Sports Coach',
      from: 'Rajasthan',
      spec: ['Fitness & Conditioning', 'Agility Training', 'Defensive Techniques', 'Sports Science'],
      bio: 'Naman Choudhary holds a prestigious NIS (National Institute of Sports) certification — one of the highest coaching qualifications in India. His scientific approach to fitness and conditioning has transformed the physical capabilities of our players.',
      bio2: 'Coach Naman specializes in building the stamina, agility, and defensive strength that separates good players from great ones. His training sessions are intense, scientific, and deeply effective — modeled on NIS best practices adapted for Rajasthan\'s competitive kabaddi landscape.',
      achievements: ['NIS Certified — Government of India', 'Specialist in sports conditioning', 'Produced national-level defenders', 'Fitness transformation expert'],
      img: '/images/coaches/naman-choudhary.jpg',
    },
  ];

  return (
    <div style={{ background: '#080808', color: '#fff', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Tiro+Devanagari+Hindi&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar />

      {/* HERO */}
      <section style={{ height: '55vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)' }}>
        <div style={{ padding: '0 48px', marginTop: 72 }}>
          <div style={{ fontSize: 11, color: GOLD, letterSpacing: 5, fontWeight: 600, marginBottom: 10 }}>MEET THE EXPERTS</div>
          <h1 style={{ fontSize: 'clamp(52px, 8vw, 96px)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 5, lineHeight: 0.88, marginBottom: 16 }}>OUR COACHES</h1>
          <div style={{ fontSize: 'clamp(16px, 2vw, 24px)', fontFamily: "'Tiro Devanagari Hindi', serif", color: GOLD }}>गुरु बिना ज्ञान नहीं — Without a guru, there is no knowledge</div>
        </div>
      </section>

      {/* COACHES */}
      {coaches.map((coach, idx) => (
        <section key={coach.name} style={{ padding: '88px 48px', maxWidth: 1200, margin: '0 auto', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: idx % 2 === 0 ? '1fr 1.3fr' : '1.3fr 1fr', gap: 72, alignItems: 'start' }}>

            {idx % 2 === 0 && (
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: -12, left: -12, width: '100%', height: '100%', border: `1px solid ${GOLD}33`, borderRadius: 8 }} />
                <img src={coach.img} alt={coach.name} style={{ width: '100%', borderRadius: 8, display: 'block', position: 'relative', zIndex: 1, aspectRatio: '4/5', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 20, right: -20, background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, borderRadius: 6, padding: '12px 18px', zIndex: 2, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#080808', letterSpacing: 2 }}>{coach.role.toUpperCase()}</div>
                </div>
              </div>
            )}

            <div>
              <div style={{ fontSize: 20, fontFamily: "'Tiro Devanagari Hindi', serif", color: GOLD, marginBottom: 6 }}>{coach.hindi}</div>
              <h2 style={{ fontSize: 'clamp(36px, 4vw, 54px)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 3, lineHeight: 0.9, marginBottom: 8 }}>{coach.name}</h2>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
                <span style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}44`, color: GOLD, fontSize: 11, padding: '4px 14px', borderRadius: 20, fontWeight: 600, letterSpacing: 1 }}>{coach.role}</span>
                <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: 11, padding: '4px 14px', borderRadius: 20, fontWeight: 500 }}>{coach.exp}</span>
                <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: 11, padding: '4px 14px', borderRadius: 20, fontWeight: 500 }}>📍 {coach.from}</span>
              </div>

              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.9, marginBottom: 14, fontWeight: 300 }}>{coach.bio}</p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.9, marginBottom: 28, fontWeight: 300 }}>{coach.bio2}</p>

              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 11, color: GOLD, letterSpacing: 3, fontWeight: 600, marginBottom: 12 }}>SPECIALIZATIONS</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {coach.spec.map(s => (
                    <span key={s} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: 12, padding: '6px 14px', borderRadius: 4, fontWeight: 400 }}>{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, color: GOLD, letterSpacing: 3, fontWeight: 600, marginBottom: 12 }}>KEY ACHIEVEMENTS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {coach.achievements.map(a => (
                    <div key={a} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}>
                      <span style={{ color: GOLD, marginTop: 2, flexShrink: 0 }}>▸</span>{a}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {idx % 2 !== 0 && (
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: -12, right: -12, width: '100%', height: '100%', border: `1px solid ${GOLD}33`, borderRadius: 8 }} />
                <img src={coach.img} alt={coach.name} style={{ width: '100%', borderRadius: 8, display: 'block', position: 'relative', zIndex: 1, aspectRatio: '4/5', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 20, left: -20, background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, borderRadius: 6, padding: '12px 18px', zIndex: 2, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#080808', letterSpacing: 2 }}>{coach.role.toUpperCase()}</div>
                </div>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* TRAINING METHODOLOGY */}
      <section style={{ background: '#0d0d0d', padding: '80px 48px', borderTop: `1px solid rgba(196,150,74,0.1)` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, color: GOLD, letterSpacing: 5, fontWeight: 600, marginBottom: 10 }}>HOW WE TRAIN</div>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 4 }}>TRAINING METHODOLOGY</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', maxWidth: 600, margin: '16px auto 0', fontWeight: 300, lineHeight: 1.8 }}>Our coaches combine traditional Rajasthani kabaddi wisdom with modern sports science</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { time: '5:30 AM', label: 'Morning Session', desc: 'Yoga, stretching and warm-up drills. Building the mental discipline of a champion starts before sunrise.' },
              { time: '7:00 AM', label: 'Technical Training', desc: 'Raid techniques, defensive formations, team strategy. Breakdown of every aspect of kabaddi game.' },
              { time: '4:00 PM', label: 'Evening Practice', desc: 'Match simulations, scrimmages and position-specific training. Practice under real match pressure.' },
              { time: '6:00 PM', label: 'Gym & Conditioning', desc: 'Strength, agility and endurance training in our modern gym facility. Science-backed conditioning.' },
            ].map(t => (
              <div key={t.time} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 24 }}>
                <div style={{ fontSize: 28, fontFamily: "'Bebas Neue', sans-serif", color: GOLD, letterSpacing: 2, marginBottom: 4 }}>{t.time}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>{t.label}</div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, fontWeight: 300 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 4, marginBottom: 12 }}>TRAIN UNDER THE BEST</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', maxWidth: 500, margin: '0 auto 32px', fontWeight: 300 }}>Limited spots available for the next batch. Register today.</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/login" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, color: '#080808', padding: '15px 44px', textDecoration: 'none', fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3, borderRadius: 3 }}>ENROLL NOW →</Link>
          <Link to="/contact" style={{ border: `1px solid ${GOLD}55`, color: GOLD, padding: '15px 44px', textDecoration: 'none', fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3, borderRadius: 3 }}>CONTACT US</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
