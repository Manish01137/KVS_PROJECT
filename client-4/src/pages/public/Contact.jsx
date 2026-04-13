import { useState } from 'react';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

const GOLD = '#c4964a';
const GOLD2 = '#e8b86d';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', interest: '', message: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const whatsappMsg = encodeURIComponent(
    `नमस्ते! मेरा नाम ${form.name || '[Name]'} है। मुझे KVS Academy में ${form.interest || '[program]'} के बारे में जानकारी चाहिए।\n\nPhone: ${form.phone || '[Phone]'}\n\n${form.message || ''}`
  );

  return (
    <div style={{ background: '#080808', color: '#fff', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Tiro+Devanagari+Hindi&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar />

      {/* HERO */}
      <section style={{ paddingTop: 140, paddingBottom: 60, paddingLeft: 48, paddingRight: 48 }}>
        <div style={{ maxWidth: 700 }}>
          <div style={{ fontSize: 11, color: GOLD, letterSpacing: 5, fontWeight: 600, marginBottom: 10 }}>GET IN TOUCH</div>
          <h1 style={{ fontSize: 'clamp(52px, 8vw, 96px)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 5, lineHeight: 0.88, marginBottom: 16 }}>CONTACT US</h1>
          <div style={{ fontSize: 22, fontFamily: "'Tiro Devanagari Hindi', serif", color: GOLD, marginBottom: 16 }}>संपर्क करें — हम यहाँ हैं</div>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontWeight: 300 }}>
            Whether you're a player, parent, or sponsor — reach out to us. We respond to every message personally. The doors of KVS Academy are always open.
          </p>
        </div>
      </section>

      {/* CONTACT INFO + FORM */}
      <section style={{ padding: '0 48px 88px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 64 }}>

          {/* Left — Info */}
          <div>
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 11, color: GOLD, letterSpacing: 4, fontWeight: 600, marginBottom: 20 }}>DIRECT CONTACT</div>
              {[
                { icon: '📞', label: 'Call Us', value: '+91 8302344092', href: 'tel:+918302344092', sub: 'Mon–Sat, 7AM–8PM' },
                { icon: '💬', label: 'WhatsApp', value: 'Chat with us instantly', href: 'https://wa.me/918302344092', sub: 'Fastest response' },
                { icon: '📸', label: 'Instagram', value: '@kvs__academy', href: 'https://instagram.com/kvs__academy', sub: 'Follow our journey' },
                { icon: '▶️', label: 'YouTube', value: 'KVS Academy', href: 'https://youtube.com/@kvs__academy', sub: 'Training videos & highlights' },
                { icon: '📧', label: 'Email', value: 'info@kvsacademy.org', href: 'mailto:info@kvsacademy.org', sub: 'For formal enquiries' },
              ].map(c => (
                <a key={c.label} href={c.href} target="_blank" rel="noreferrer" style={{ display: 'flex', gap: 14, padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', textDecoration: 'none', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <div style={{ width: 44, height: 44, background: `${GOLD}18`, border: `1px solid ${GOLD}33`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontSize: 11, color: GOLD, letterSpacing: 2, fontWeight: 600, marginBottom: 2 }}>{c.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>{c.value}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 300 }}>{c.sub}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Location */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 24 }}>
              <div style={{ fontSize: 11, color: GOLD, letterSpacing: 3, fontWeight: 600, marginBottom: 12 }}>📍 FIND US</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>KVS Kabaddi Academy</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontWeight: 300 }}>
                Siriyade Gaon<br />
                Near Jodhpur, Rajasthan<br />
                PIN – 342015<br />
                India 🇮🇳
              </div>
              <div style={{ marginTop: 16, fontSize: 13, color: GOLD, fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                जोधपुर, राजस्थान
              </div>
              <a href="https://maps.google.com/?q=Siriyade+Gaon+Jodhpur+Rajasthan" target="_blank" rel="noreferrer"
                style={{ display: 'inline-block', marginTop: 14, fontSize: 12, color: GOLD, textDecoration: 'none', letterSpacing: 2, fontWeight: 600 }}>
                OPEN IN MAPS →
              </a>
            </div>
          </div>

          {/* Right — Enquiry Form */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 40 }}>
            <div style={{ fontSize: 11, color: GOLD, letterSpacing: 4, fontWeight: 600, marginBottom: 8 }}>ENQUIRY FORM</div>
            <h3 style={{ fontSize: 32, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 3, marginBottom: 24 }}>SEND US A MESSAGE</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, fontWeight: 600, display: 'block', marginBottom: 8 }}>YOUR NAME *</label>
                <input placeholder="Ramesh Kumar" value={form.name} onChange={e => set('name', e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'Inter' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, fontWeight: 600, display: 'block', marginBottom: 8 }}>PHONE *</label>
                <input placeholder="+91 98765 43210" value={form.phone} onChange={e => set('phone', e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'Inter' }} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, fontWeight: 600, display: 'block', marginBottom: 8 }}>EMAIL</label>
              <input placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'Inter' }} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, fontWeight: 600, display: 'block', marginBottom: 8 }}>I AM INTERESTED IN *</label>
              <select value={form.interest} onChange={e => set('interest', e.target.value)}
                style={{ width: '100%', background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '12px 14px', color: form.interest ? '#fff' : 'rgba(255,255,255,0.35)', fontSize: 14, outline: 'none', fontFamily: 'Inter' }}>
                <option value="">Select a program...</option>
                <option value="Kabaddi Training (₹1,000/mo)">🏃 Kabaddi Training — ₹1,000/mo</option>
                <option value="Hostel + Training (₹5,500/mo)">🏠 Hostel + Training — ₹5,500/mo</option>
                <option value="Gym Membership (₹800/mo)">🏋️ Gym Membership — ₹800/mo</option>
                <option value="Kabaddi + Gym Combo (₹1,600/mo)">⚡ Combo Plan — ₹1,600/mo</option>
                <option value="General Enquiry">📩 General Enquiry</option>
              </select>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, fontWeight: 600, display: 'block', marginBottom: 8 }}>YOUR MESSAGE</label>
              <textarea placeholder="Tell us about yourself — age, current level, location, any specific questions..." value={form.message} onChange={e => set('message', e.target.value)} rows={4}
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'Inter', resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href={`https://wa.me/918302344092?text=${whatsappMsg}`} target="_blank" rel="noreferrer" style={{ display: 'block', background: '#25d366', color: '#fff', padding: '14px', borderRadius: 6, textAlign: 'center', textDecoration: 'none', fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, letterSpacing: 3 }}>
                💬 SEND VIA WHATSAPP
              </a>
              <a href={`mailto:info@kvsacademy.org?subject=Enquiry from ${form.name}&body=${form.message}`} style={{ display: 'block', background: 'transparent', border: `1px solid ${GOLD}55`, color: GOLD, padding: '13px', borderRadius: 6, textAlign: 'center', textDecoration: 'none', fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3 }}>
                📧 SEND VIA EMAIL
              </a>
            </div>

            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 14, textAlign: 'center', fontWeight: 300 }}>
              We typically respond within a few hours on WhatsApp
            </p>
          </div>
        </div>
      </section>

      {/* VISIT US */}
      <section style={{ background: `linear-gradient(135deg, #0d0a06, #1a1208)`, padding: '80px 48px', borderTop: `1px solid rgba(196,150,74,0.1)`, textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: GOLD, letterSpacing: 5, fontWeight: 600, marginBottom: 10 }}>COME VISIT US</div>
        <h2 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 4, marginBottom: 16 }}>OPEN FOR TRIALS</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto 32px', fontWeight: 300, lineHeight: 1.8 }}>
          Come visit the academy any day between 7 AM and 9 AM to watch a live training session and meet Coach Surendra personally. No appointment needed.
        </p>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { icon: '🕐', label: 'Visit Hours', val: '7:00 AM – 9:00 AM' },
            { icon: '📅', label: 'Any Day', val: 'Mon – Sat' },
            { icon: '📍', label: 'Location', val: 'Siriyade Gaon, Jodhpur' },
          ].map(i => (
            <div key={i.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '20px 28px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{i.icon}</div>
              <div style={{ fontSize: 11, color: GOLD, letterSpacing: 2, fontWeight: 600, marginBottom: 4 }}>{i.label}</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{i.val}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
