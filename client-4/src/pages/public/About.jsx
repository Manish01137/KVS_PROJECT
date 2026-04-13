import { Link } from 'react-router-dom';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';

const GOLD = '#c4964a';
const GOLD2 = '#e8b86d';

export default function About() {
  return (
    <div style={{ background: '#080808', color: '#fff', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Tiro+Devanagari+Hindi&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <Navbar />

      {/* HERO */}
      <section style={{ height: '60vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,8,8,0.95), rgba(8,8,8,0.6))' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, padding: '0 48px', marginTop: 72 }}>
          <div style={{ fontSize: 11, color: GOLD, letterSpacing: 5, fontWeight: 600, marginBottom: 10 }}>ABOUT US</div>
          <h1 style={{ fontSize: 'clamp(52px, 8vw, 100px)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 5, lineHeight: 0.88, marginBottom: 16 }}>
            OUR STORY
          </h1>
          <div style={{ fontSize: 'clamp(18px, 3vw, 28px)', fontFamily: "'Tiro Devanagari Hindi', serif", color: GOLD }}>
            जोधपुर की शान — मारवाड़ का अभिमान
          </div>
        </div>
      </section>

      {/* FOUNDING STORY */}
      <section style={{ padding: '88px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, color: GOLD, letterSpacing: 5, fontWeight: 600, marginBottom: 12 }}>OUR FOUNDATION</div>
            <h2 style={{ fontSize: 'clamp(36px, 4vw, 56px)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 3, lineHeight: 0.9, marginBottom: 24 }}>
              BORN FROM THE<br /><span style={{ color: GOLD }}>HEART OF JODHPUR</span>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.9, marginBottom: 18, fontWeight: 300 }}>
              KVS Kabaddi Academy was founded with a single mission — to give the talented youth of Rajasthan a world-class platform to train, compete, and shine at the national level. Kabaddi is not just a sport here — it is a way of life deeply rooted in Marwar's warrior culture.
            </p>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.9, marginBottom: 18, fontWeight: 300 }}>
              Located in Siriyade Gaon on the outskirts of Jodhpur, our academy sits in the land where Rajput warriors once trained. We carry that heritage forward — with NIS-certified coaches, structured training programs, and a hostel facility that allows players to fully immerse in the sport.
            </p>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.9, marginBottom: 32, fontWeight: 300 }}>
              In just a few years we have produced over 20 national-level players who have represented Rajasthan in prestigious tournaments, bringing glory to Jodhpur and proving that the best talent in India comes from right here in Marwar.
            </p>
            <div style={{ display: 'flex', gap: 32 }}>
              {[['20+', 'National Players'], ['2+', 'Years'], ['100%', 'Dedication']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 40, fontFamily: "'Bebas Neue', sans-serif", color: GOLD, letterSpacing: 2 }}>{n}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: 2, fontWeight: 500 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: -16, right: -16, width: '100%', height: '100%', border: `2px solid ${GOLD}33`, borderRadius: 8 }} />
            <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" alt="Academy" style={{ width: '100%', borderRadius: 8, display: 'block', position: 'relative', zIndex: 1 }} />
            <div style={{ position: 'absolute', bottom: -20, left: -20, background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, borderRadius: 8, padding: '16px 24px', zIndex: 2 }}>
              <div style={{ fontSize: 28, fontFamily: "'Bebas Neue', sans-serif", color: '#080808', letterSpacing: 2 }}>JODHPUR</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(8,8,8,0.7)', letterSpacing: 3 }}>RAJASTHAN, INDIA</div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION VISION */}
      <section style={{ background: '#0d0d0d', padding: '80px 48px', borderTop: `1px solid rgba(196,150,74,0.1)`, borderBottom: `1px solid rgba(196,150,74,0.1)` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, color: GOLD, letterSpacing: 5, fontWeight: 600, marginBottom: 10 }}>OUR PURPOSE</div>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 4 }}>MISSION & VISION</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div style={{ background: `linear-gradient(145deg, ${GOLD}15, transparent)`, border: `1px solid ${GOLD}33`, borderRadius: 10, padding: 40 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🎯</div>
              <div style={{ fontSize: 24, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 3, color: GOLD, marginBottom: 16 }}>OUR MISSION</div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.9, fontWeight: 300 }}>
                To discover, develop and deploy the finest kabaddi talent from Rajasthan onto national and international stages. We provide a structured training environment where every player — regardless of background — gets a fair shot at greatness.
              </p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.9, fontWeight: 300, marginTop: 12 }}>
                We believe that the next kabaddi superstar is already training in the dust of a Rajasthan village — we just need to give them the tools, the coaching, and the stage.
              </p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 40 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>👁️</div>
              <div style={{ fontSize: 24, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 3, color: '#fff', marginBottom: 16 }}>OUR VISION</div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.9, fontWeight: 300 }}>
                To make Jodhpur the kabaddi capital of Rajasthan — a city known not only for its majestic forts and blue buildings, but for producing world-class kabaddi players who carry the warrior spirit of Marwar across India.
              </p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.9, fontWeight: 300, marginTop: 12 }}>
                Within 5 years, we aim to have 50+ players representing Rajasthan and become the top feeder academy for Pro Kabaddi League teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ fontSize: 11, color: GOLD, letterSpacing: 5, fontWeight: 600, marginBottom: 10 }}>WHAT WE STAND FOR</div>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 4 }}>OUR CORE VALUES</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {[
            { hindi: 'अनुशासन', eng: 'Discipline', desc: 'Training starts at 5:30 AM. Every day, rain or shine. No excuses — only results.' },
            { hindi: 'साहस', eng: 'Courage', desc: 'Kabaddi demands you enter the opponent\'s half alone. We train that mental fearlessness.' },
            { hindi: 'एकता', eng: 'Unity', desc: 'A team that lives together, trains together. Our hostel creates bonds that last a lifetime.' },
            { hindi: 'गौरव', eng: 'Pride', desc: 'Every player carries the pride of Jodhpur and Rajasthan on their shoulders.' },
            { hindi: 'उत्कृष्टता', eng: 'Excellence', desc: 'Average is not accepted. We push every student beyond their perceived limits.' },
            { hindi: 'सम्मान', eng: 'Respect', desc: 'For the sport, for coaches, for opponents. Champions are built on respect.' },
          ].map(v => (
            <div key={v.eng} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontFamily: "'Tiro Devanagari Hindi', serif", color: GOLD, marginBottom: 6 }}>{v.hindi}</div>
              <div style={{ fontSize: 16, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 3, marginBottom: 12 }}>{v.eng}</div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, fontWeight: 300 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FACILITIES */}
      <section style={{ background: '#0d0d0d', padding: '80px 48px', borderTop: `1px solid rgba(196,150,74,0.1)` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, color: GOLD, letterSpacing: 5, fontWeight: 600, marginBottom: 10 }}>INFRASTRUCTURE</div>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 4 }}>OUR FACILITIES</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { icon: '🏟️', title: 'Kabaddi Ground', desc: 'Full-size professional kabaddi mat with proper court markings. Indoor and outdoor training areas available for year-round sessions.' },
              { icon: '🏠', title: 'Hostel Rooms', desc: 'Clean, comfortable rooms with beds, storage, and study space. Separate rooms for different batches. 24/7 warden supervision.' },
              { icon: '🍽️', title: 'Nutritious Meals', desc: 'Three meals daily prepared by in-house cook. High-protein Rajasthani diet designed for athletes. Dal baati, missi roti, and more.' },
              { icon: '🏋️', title: 'Modern Gym', desc: 'Brand new gym with treadmills, weight stations, resistance machines, and functional training equipment. Open 6AM–9PM.' },
              { icon: '🏥', title: 'Medical Support', desc: 'First aid facility on premises. Tie-up with local sports medicine clinic for injury management and physiotherapy.' },
              { icon: '📚', title: 'Study Room', desc: 'For our hostel students who are school or college going — dedicated quiet study area to balance education and sport.' },
            ].map(f => (
              <div key={f.title} style={{ display: 'flex', gap: 16, padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8 }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: GOLD }}>{f.title}</div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, fontWeight: 300 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 4, marginBottom: 12 }}>BE PART OF THE LEGACY</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', maxWidth: 500, margin: '0 auto 32px', fontWeight: 300 }}>Join hundreds of players who chose KVS and went on to represent Rajasthan with pride.</p>
        <Link to="/login" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, color: '#080808', padding: '15px 44px', textDecoration: 'none', fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3, borderRadius: 3 }}>ENROLL NOW →</Link>
      </section>

      <Footer />
    </div>
  );
}
