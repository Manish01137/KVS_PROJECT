import { Link } from 'react-router-dom';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

const GOLD = '#c4964a';
const GOLD2 = '#e8b86d';

export default function Pricing() {
  const plans = [
    {
      name: 'Kabaddi Training',
      hindi: 'कबड्डी प्रशिक्षण',
      price: 1000,
      period: 'per month',
      color: GOLD,
      featured: false,
      icon: '🏃',
      desc: 'For players who want to train seriously without hostel. Ideal for local students from Jodhpur.',
      features: [
        'Daily morning & evening training sessions',
        'Expert coaching by certified coaches',
        'Performance tracking & feedback',
        'Attendance records on student portal',
        'Match simulations & scrimmages',
        'Team strategy & technique sessions',
        'Access to student dashboard',
        'Monthly progress report',
      ],
      notIncluded: ['Hostel accommodation', 'Meals', 'Gym access'],
    },
    {
      name: 'Hostel + Training',
      hindi: 'छात्रावास + प्रशिक्षण',
      price: 5500,
      period: 'per month',
      color: GOLD,
      featured: true,
      badge: 'MOST POPULAR',
      icon: '🏠',
      desc: 'The complete package for serious players. Live, train and eat together. The fastest path to national level.',
      features: [
        'Everything in Kabaddi Training',
        'Comfortable hostel room & bed',
        '3 nutritious meals daily',
        'High-protein Rajasthani athlete diet',
        '24/7 warden supervision',
        'Laundry facility',
        'Study room access',
        'Medical first aid support',
        'Year-round immersive training',
        'Hostel bonding & team culture',
      ],
      notIncluded: ['Gym access (add ₹600/mo)'],
    },
    {
      name: 'Gym Only',
      hindi: 'जिम सदस्यता',
      price: 800,
      period: 'per month',
      color: '#fff',
      featured: false,
      icon: '🏋️',
      desc: 'For fitness enthusiasts and general members. Full access to our modern gym facility in Jodhpur.',
      features: [
        'Full modern gym access',
        'Cardio, strength & functional zones',
        'Open 6 AM – 9 PM daily',
        'Separate section for women',
        'Locker & changing room',
        'Trainer guidance available',
        'Student portal access',
        'Monthly fitness tracking',
      ],
      notIncluded: ['Kabaddi training sessions', 'Hostel', 'Meals'],
      launchOffer: '🎉 First month at ₹400 only!',
    },
    {
      name: 'Kabaddi + Gym Combo',
      hindi: 'कॉम्बो प्लान',
      price: 1600,
      period: 'per month',
      color: GOLD,
      featured: false,
      badge: 'SAVE ₹200',
      icon: '⚡',
      desc: 'Train kabaddi and gym together at a discounted price. The best value plan for day scholars.',
      features: [
        'Full kabaddi training sessions',
        'Full gym access included',
        'Expert kabaddi coaching',
        'All gym zones (cardio, strength, functional)',
        'Performance tracking',
        'Student portal access',
        'Monthly progress report',
        'Save ₹200 vs buying separately',
      ],
      notIncluded: ['Hostel accommodation', 'Meals'],
    },
  ];

  return (
    <div style={{ background: '#080808', color: '#fff', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Tiro+Devanagari+Hindi&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar />

      {/* HERO */}
      <section style={{ paddingTop: 140, paddingBottom: 60, paddingLeft: 48, paddingRight: 48, textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: GOLD, letterSpacing: 5, fontWeight: 600, marginBottom: 10 }}>TRANSPARENT PRICING</div>
        <h1 style={{ fontSize: 'clamp(52px, 8vw, 96px)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 5, lineHeight: 0.88, marginBottom: 16 }}>CHOOSE YOUR PLAN</h1>
        <div style={{ fontSize: 20, fontFamily: "'Tiro Devanagari Hindi', serif", color: GOLD, marginBottom: 16 }}>अपना रास्ता चुनें</div>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', maxWidth: 560, margin: '0 auto', fontWeight: 300, lineHeight: 1.8 }}>
          No hidden fees. No long contracts. Pay monthly and cancel anytime. All payments processed securely through Razorpay.
        </p>
      </section>

      {/* PLANS */}
      <section style={{ padding: '0 48px 88px', maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {plans.map(plan => (
            <div key={plan.name} style={{
              background: plan.featured ? `linear-gradient(160deg, ${GOLD}18, ${GOLD}06)` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${plan.featured ? GOLD : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 12, padding: '32px 28px', position: 'relative',
              transform: plan.featured ? 'scale(1.03)' : 'none',
            }}>
              {plan.badge && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: plan.featured ? `linear-gradient(135deg,${GOLD},${GOLD2})` : GOLD, color: '#080808', fontSize: 10, fontWeight: 700, letterSpacing: 3, padding: '5px 18px', borderRadius: 20, whiteSpace: 'nowrap' }}>{plan.badge}</div>
              )}

              <div style={{ fontSize: 28, marginBottom: 10 }}>{plan.icon}</div>
              <div style={{ fontSize: 16, fontFamily: "'Tiro Devanagari Hindi', serif", color: GOLD, marginBottom: 4 }}>{plan.hindi}</div>
              <div style={{ fontSize: 20, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2, marginBottom: 16 }}>{plan.name}</div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 52, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2, lineHeight: 1, color: plan.featured ? GOLD : '#fff' }}>₹{plan.price.toLocaleString()}</span>
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 8, letterSpacing: 1 }}>{plan.period}</div>

              {plan.launchOffer && (
                <div style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}40`, borderRadius: 6, padding: '8px 12px', fontSize: 12, color: GOLD, fontWeight: 600, marginBottom: 12 }}>{plan.launchOffer}</div>
              )}

              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 22, fontWeight: 300 }}>{plan.desc}</p>

              <div style={{ marginBottom: 20 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 9, fontWeight: 300 }}>
                    <span style={{ color: GOLD, flexShrink: 0, marginTop: 1 }}>✓</span>{f}
                  </div>
                ))}
                {plan.notIncluded?.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.25)', marginBottom: 8, fontWeight: 300 }}>
                    <span style={{ flexShrink: 0 }}>✗</span>{f}
                  </div>
                ))}
              </div>

              <Link to="/login" style={{
                display: 'block', textAlign: 'center', padding: '14px',
                background: plan.featured ? `linear-gradient(135deg,${GOLD},${GOLD2})` : 'transparent',
                border: plan.featured ? 'none' : `1px solid ${GOLD}55`,
                color: plan.featured ? '#080808' : GOLD,
                borderRadius: 5, textDecoration: 'none',
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 3,
              }}>ENROLL NOW →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#0d0d0d', padding: '80px 48px', borderTop: `1px solid rgba(196,150,74,0.1)` }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, color: GOLD, letterSpacing: 5, fontWeight: 600, marginBottom: 10 }}>FAQ</div>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 4 }}>COMMON QUESTIONS</h2>
          </div>
          {[
            { q: 'How do I pay the fees?', a: 'All fees are paid online through our student portal using Razorpay — UPI, debit card, credit card, and net banking all accepted. You\'ll get a receipt on your email.' },
            { q: 'Is there a joining fee?', a: 'There is a one-time admission fee of ₹500. After that, only the monthly plan fee applies. No other hidden charges.' },
            { q: 'Can I change my plan later?', a: 'Yes. You can upgrade or downgrade your plan at any time. Changes take effect from the next billing cycle. Contact admin through the portal.' },
            { q: 'What if I miss a month of payment?', a: 'A late fee of ₹100–₹200 is added after the 5th of each month. Consistent non-payment may result in enrollment suspension until fees are cleared.' },
            { q: 'Is the gym open for women?', a: 'Yes. We have a dedicated section for women in our gym. Women are welcome for gym membership and for kabaddi training equally.' },
            { q: 'Do you offer discounts for excellent players?', a: 'Yes. The admin can apply merit-based discounts or full fee waivers for deserving players. Speak to our coaching staff to discuss.' },
          ].map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '22px 0' }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10, color: '#fff' }}>Q: {faq.q}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontWeight: 300 }}>{faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PAYMENT METHODS */}
      <section style={{ padding: '60px 48px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: GOLD, letterSpacing: 5, fontWeight: 600, marginBottom: 16 }}>SECURE PAYMENTS</div>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 24, fontWeight: 300 }}>All payments processed through Razorpay — India's most trusted payment gateway</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['UPI / GPay / PhonePe', 'Debit Card', 'Credit Card', 'Net Banking', 'EMI Options'].map(m => (
            <span key={m} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, padding: '8px 16px', fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 300 }}>{m}</span>
          ))}
        </div>
        <div style={{ marginTop: 40 }}>
          <Link to="/login" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, color: '#080808', padding: '15px 44px', textDecoration: 'none', fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3, borderRadius: 3 }}>ENROLL NOW →</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
