import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#050505', borderTop: '1px solid rgba(196,150,74,0.15)', fontFamily: 'Inter, sans-serif' }}>
      {/* Main footer */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 48px 40px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48 }}>

        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#c4964a,#e8b86d)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#080808', fontFamily: 'serif' }}>K</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 3, color: '#fff', fontFamily: "'Bebas Neue', sans-serif" }}>KVS ACADEMY</div>
              <div style={{ fontSize: 9, color: '#c4964a', letterSpacing: 3 }}>JODHPUR • RAJASTHAN</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, maxWidth: 280, fontWeight: 300 }}>
            Rajasthan's premier kabaddi academy producing national-level champions since our founding in Jodhpur. Train under NIS-certified coaches and live the sport.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            {[
              { label: 'Instagram', href: 'https://instagram.com/kvs__academy', icon: '📸' },
              { label: 'YouTube', href: 'https://youtube.com/@kvs__academy', icon: '▶️' },
              { label: 'WhatsApp', href: 'https://wa.me/918302344092', icon: '💬' },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{
                width: 38, height: 38, border: '1px solid rgba(196,150,74,0.3)',
                borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, textDecoration: 'none', transition: 'border-color 0.2s',
              }}
              title={s.label}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#c4964a'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(196,150,74,0.3)'}
              >{s.icon}</a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <div style={{ fontSize: 11, color: '#c4964a', letterSpacing: 3, fontWeight: 600, marginBottom: 20, textTransform: 'uppercase' }}>Academy</div>
          {[
            { to: '/', label: 'Home' },
            { to: '/about', label: 'About Us' },
            { to: '/coaches', label: 'Our Coaches' },
            { to: '/gym', label: 'Gym Facility' },
            { to: '/pricing', label: 'Pricing Plans' },
            { to: '/contact', label: 'Contact' },
          ].map(l => (
            <Link key={l.to} to={l.to} style={{ display: 'block', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: 13, marginBottom: 10, fontWeight: 300, transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#c4964a'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}
            >{l.label}</Link>
          ))}
        </div>

        {/* Programs */}
        <div>
          <div style={{ fontSize: 11, color: '#c4964a', letterSpacing: 3, fontWeight: 600, marginBottom: 20, textTransform: 'uppercase' }}>Programs</div>
          {['Kabaddi Training', 'Hostel + Training', 'Gym Membership', 'Kabaddi + Gym Combo', 'Junior Program', 'Women\'s Kabaddi'].map(p => (
            <div key={p} style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginBottom: 10, fontWeight: 300 }}>{p}</div>
          ))}
        </div>

        {/* Contact */}
        <div>
          <div style={{ fontSize: 11, color: '#c4964a', letterSpacing: 3, fontWeight: 600, marginBottom: 20, textTransform: 'uppercase' }}>Contact</div>
          {[
            { icon: '📞', val: '+91 8302344092', href: 'tel:+918302344092' },
            { icon: '📧', val: 'info@kvsacademy.org', href: 'mailto:info@kvsacademy.org' },
            { icon: '📍', val: 'Siriyade Gaon, Jodhpur, Rajasthan – 342015', href: null },
          ].map(c => (
            <div key={c.val} style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 14, marginTop: 1 }}>{c.icon}</span>
              {c.href
                ? <a href={c.href} style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, textDecoration: 'none', fontWeight: 300, lineHeight: 1.5 }}>{c.val}</a>
                : <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 300, lineHeight: 1.5 }}>{c.val}</span>
              }
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px 48px', maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', fontWeight: 300 }}>
          © 2024 KVS Kabaddi Academy, Jodhpur. All rights reserved. | 🏆 Rajasthan's Premier Kabaddi Academy
        </div>
        <Link to="/login" style={{ fontSize: 12, color: '#c4964a', textDecoration: 'none', letterSpacing: 2, fontWeight: 500 }}>STUDENT LOGIN →</Link>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');`}</style>
    </footer>
  );
}
