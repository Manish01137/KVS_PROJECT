import { Link } from 'react-router-dom';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

const GOLD = '#c4964a';
const GOLD2 = '#e8b86d';

export default function Gym() {
  return (
    <div style={{ background: '#080808', color: '#fff', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Tiro+Devanagari+Hindi&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar />

      {/* HERO */}
      <section style={{ height: '65vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,8,8,0.93), rgba(8,8,8,0.5))' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, padding: '0 48px', marginTop: 72 }}>
          <div style={{ display: 'inline-block', background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, color: '#080808', fontSize: 11, fontWeight: 700, letterSpacing: 3, padding: '6px 18px', borderRadius: 20, marginBottom: 16 }}>🎉 NEWLY OPENED</div>
          <h1 style={{ fontSize: 'clamp(52px, 9vw, 108px)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 5, lineHeight: 0.88, marginBottom: 16 }}>
            KVS GYM<br /><span style={{ color: GOLD }}>FACILITY</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', maxWidth: 460, lineHeight: 1.7, fontWeight: 300 }}>
            Jodhpur's newest modern gym — open to kabaddi players and general members. State-of-the-art equipment. Expert guidance. Affordable plans.
          </p>
        </div>
      </section>

      {/* LAUNCH OFFER */}
      <section style={{ background: `linear-gradient(135deg, ${GOLD}22, ${GOLD}08)`, border: `1px solid ${GOLD}33`, padding: '48px', textAlign: 'center', borderLeft: 'none', borderRight: 'none' }}>
        <div style={{ fontSize: 11, color: GOLD, letterSpacing: 5, fontWeight: 600, marginBottom: 10 }}>🔥 LIMITED TIME LAUNCH OFFER</div>
        <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 4, marginBottom: 12 }}>
          FIRST MONTH AT <span style={{ color: GOLD }}>50% OFF</span>
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', maxWidth: 520, margin: '0 auto 24px', fontWeight: 300, lineHeight: 1.7 }}>
          We just opened our gym and want Jodhpur to experience it. First 50 members get their first month at half price. Regular price ₹800/month — your first month just ₹400.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, fontFamily: "'Bebas Neue', sans-serif", color: GOLD, lineHeight: 1 }}>₹400</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>FIRST MONTH</div>
          </div>
          <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.2)' }}>→</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, fontFamily: "'Bebas Neue', sans-serif", lineHeight: 1, textDecoration: 'line-through', color: 'rgba(255,255,255,0.3)' }}>₹800</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: 1 }}>REGULAR PRICE</div>
          </div>
          <Link to="/login" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, color: '#080808', padding: '15px 40px', textDecoration: 'none', fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3, borderRadius: 3, marginLeft: 16 }}>CLAIM OFFER →</Link>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 16 }}>* Offer valid for first 50 members only. Limited time.</p>
      </section>

      {/* EQUIPMENT */}
      <section style={{ padding: '88px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ fontSize: 11, color: GOLD, letterSpacing: 5, fontWeight: 600, marginBottom: 10 }}>WHAT'S INSIDE</div>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 4 }}>WORLD-CLASS EQUIPMENT</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {[
            { icon: '🏃', zone: 'Cardio Zone', items: ['Treadmills', 'Stationary bikes', 'Elliptical machines', 'Rowing machine', 'Jump rope stations'], img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80' },
            { icon: '💪', zone: 'Strength Zone', items: ['Barbells & plates', 'Dumbbells set (2–40kg)', 'Squat rack', 'Bench press', 'Pull-up bars'], img: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400&q=80' },
            { icon: '⚡', zone: 'Functional Zone', items: ['Battle ropes', 'Kettlebells', 'TRX suspension', 'Agility ladder', 'Plyometric boxes'], img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&q=80' },
          ].map(z => (
            <div key={z.zone} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ height: 180, overflow: 'hidden' }}>
                <img src={z.img} alt={z.zone} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{z.icon}</div>
                <div style={{ fontSize: 18, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2, color: GOLD, marginBottom: 14 }}>{z.zone}</div>
                {z.items.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 7, fontWeight: 300 }}>
                    <span style={{ color: GOLD, fontSize: 10 }}>▸</span>{item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TIMING & RULES */}
      <section style={{ background: '#0d0d0d', padding: '80px 48px', borderTop: `1px solid rgba(196,150,74,0.1)` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
          <div>
            <div style={{ fontSize: 11, color: GOLD, letterSpacing: 5, fontWeight: 600, marginBottom: 16 }}>GYM TIMINGS</div>
            <h3 style={{ fontSize: 36, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 3, marginBottom: 24 }}>OPEN EVERY DAY</h3>
            {[
              { day: 'Monday – Friday', time: '6:00 AM – 9:00 PM' },
              { day: 'Saturday', time: '6:00 AM – 8:00 PM' },
              { day: 'Sunday', time: '7:00 AM – 1:00 PM' },
              { day: 'National Holidays', time: '8:00 AM – 12:00 PM' },
            ].map(t => (
              <div key={t.day} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontWeight: 300 }}>{t.day}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: GOLD }}>{t.time}</span>
              </div>
            ))}
            <div style={{ marginTop: 24, background: `${GOLD}15`, border: `1px solid ${GOLD}33`, borderRadius: 8, padding: '14px 18px', fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 300, lineHeight: 1.7 }}>
              📍 Location: KVS Academy, Siriyade Gaon, Jodhpur, Rajasthan – 342015
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: GOLD, letterSpacing: 5, fontWeight: 600, marginBottom: 16 }}>GYM FEATURES</div>
            <h3 style={{ fontSize: 36, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 3, marginBottom: 24 }}>WHAT YOU GET</h3>
            {[
              '✅ Fully equipped modern facility',
              '✅ Separate section for women',
              '✅ Locker and changing room',
              '✅ Drinking water station',
              '✅ Trainer guidance available',
              '✅ AC facility in summer',
              '✅ Student portal access (track workouts)',
              '✅ Combo discount with Kabaddi plan',
              '✅ Monthly progress tracking',
              '✅ No joining fee (limited period)',
            ].map(f => (
              <div key={f} style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 10, fontWeight: 300 }}>{f}</div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section style={{ padding: '80px 48px', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: GOLD, letterSpacing: 5, fontWeight: 600, marginBottom: 10 }}>GYM PLANS</div>
        <h2 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 4, marginBottom: 40 }}>SIMPLE PRICING</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {[
            { name: 'Monthly', price: '₹800', sub: 'per month', note: 'First month ₹400 (launch offer)', featured: false },
            { name: 'Quarterly', price: '₹2,100', sub: '3 months', note: 'Save ₹300 vs monthly', featured: true },
            { name: 'Kabaddi + Gym', price: '₹1,600', sub: 'per month', note: 'Training + full gym access', featured: false },
          ].map(p => (
            <div key={p.name} style={{ background: p.featured ? `${GOLD}18` : 'rgba(255,255,255,0.03)', border: `1px solid ${p.featured ? GOLD : 'rgba(255,255,255,0.07)'}`, borderRadius: 10, padding: 28 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: p.featured ? GOLD : '#fff' }}>{p.name}</div>
              <div style={{ fontSize: 44, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2, lineHeight: 1, marginBottom: 4 }}>{p.price}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>{p.sub}</div>
              <div style={{ fontSize: 12, color: GOLD, fontWeight: 500, marginBottom: 20 }}>{p.note}</div>
              <Link to="/login" style={{ display: 'block', background: p.featured ? `linear-gradient(135deg,${GOLD},${GOLD2})` : 'transparent', border: p.featured ? 'none' : `1px solid ${GOLD}55`, color: p.featured ? '#080808' : GOLD, padding: '11px', borderRadius: 4, textDecoration: 'none', fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 2 }}>JOIN NOW</Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
