import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const navLinks = [
    { to: '/',          label: 'Home' },
    { to: '/about',     label: 'About' },
    { to: '/coaches',   label: 'Coaches' },
    { to: '/gym',       label: 'Gym' },
    { to: '/pricing',   label: 'Pricing' },
    { to: '/contact',   label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '0 48px', height: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(8,8,8,0.97)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(196,150,74,0.2)' : 'none',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'all 0.4s',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, background: 'linear-gradient(135deg, #c4964a, #e8b86d)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 900, color: '#080808', fontFamily: 'serif',
          }}>K</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 3, color: '#fff', fontFamily: "'Bebas Neue', sans-serif", lineHeight: 1 }}>KVS ACADEMY</div>
            <div style={{ fontSize: 9, color: '#c4964a', letterSpacing: 3, fontFamily: 'Inter, sans-serif' }}>JODHPUR • RAJASTHAN</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              color: isActive(link.to) ? '#c4964a' : 'rgba(255,255,255,0.75)',
              textDecoration: 'none', fontSize: 12,
              fontFamily: 'Inter, sans-serif', fontWeight: 500,
              letterSpacing: 2, textTransform: 'uppercase',
              borderBottom: isActive(link.to) ? '1px solid #c4964a' : '1px solid transparent',
              paddingBottom: 2, transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.target.style.color = '#c4964a'; }}
            onMouseLeave={e => { if (!isActive(link.to)) e.target.style.color = 'rgba(255,255,255,0.75)'; }}
            >{link.label}</Link>
          ))}
          <Link to="/login" style={{
            background: 'linear-gradient(135deg, #c4964a, #e8b86d)',
            color: '#080808', padding: '10px 28px',
            borderRadius: 3, textDecoration: 'none', fontSize: 12,
            fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: 2,
            textTransform: 'uppercase',
          }}>Join Now</Link>
        </div>

        {/* Mobile btn */}
        <button onClick={() => setMenuOpen(v => !v)} style={{
          display: 'none', background: 'none', border: 'none',
          color: '#fff', fontSize: 26, cursor: 'pointer',
        }} className="kvs-mobile-btn">{menuOpen ? '✕' : '☰'}</button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: '#080808', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 28,
        }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              color: isActive(link.to) ? '#c4964a' : '#fff',
              textDecoration: 'none', fontSize: 36,
              fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 6,
            }}>{link.label}</Link>
          ))}
          <Link to="/login" style={{
            background: 'linear-gradient(135deg, #c4964a, #e8b86d)',
            color: '#080808', padding: '14px 48px', borderRadius: 3,
            textDecoration: 'none', fontSize: 24,
            fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 4,
            marginTop: 12,
          }}>JOIN NOW</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          nav > div:nth-child(2) { display: none !important; }
          .kvs-mobile-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
