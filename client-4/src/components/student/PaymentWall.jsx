import { useEffect, useState, useRef } from 'react';
import API from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function PaymentWall({ children }) {
  const { user } = useAuth();
  const [status, setStatus] = useState('loading');
  const [data, setData]     = useState({ enrollment: null, payment: null, fee: null });
  const [paying, setPaying] = useState(false);
  const razorpayLoaded = useRef(false);

  useEffect(() => {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    Promise.all([
      API.get('/students/me/enrollment'),
      API.get('/payment/history'),
      API.get('/fees'),
    ]).then(([e, p, f]) => {
      const enrollment = e.data;
      const paymentList = p.data.payments || p.data;
      const payments = Array.isArray(paymentList) ? paymentList : [];
      const fees = f.data;

      if (!enrollment) { setStatus('pending'); return; }
      if (enrollment.status === 'pending') { setStatus('pending'); return; }
      if (enrollment.status === 'rejected') { setStatus('rejected'); return; }

      if (enrollment.status === 'active') {
        if (enrollment.isWaived) { setStatus('paid'); return; }

        const paidThisMonth = payments.find(p => p.month === month && p.status === 'paid');
        if (paidThisMonth) {
          setStatus('paid');
          setData({ enrollment, payment: paidThisMonth, fee: null });
          return;
        }

        const planKey = enrollment.type === 'gym' ? 'gym-monthly'
                      : enrollment.type === 'both' ? 'combo'
                      : enrollment.plan === 'hostel' ? 'kabaddi-hostel' : 'kabaddi-training';
        const fee = fees.find(f => f.planName === planKey && f.isActive);
        setStatus('unpaid');
        setData({ enrollment, payment: null, fee });
        return;
      }

      setStatus('pending');
    }).catch(() => setStatus('pending'));
  }, []);

  // Load Razorpay script once
  useEffect(() => {
    if (razorpayLoaded.current || status !== 'unpaid') return;
    const existing = document.querySelector('script[src*="razorpay"]');
    if (existing) { razorpayLoaded.current = true; return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => { razorpayLoaded.current = true; };
    document.body.appendChild(script);
  }, [status]);

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6fb' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (status === 'paid') return children;

  if (status === 'pending') {
    return (
      <div style={{ minHeight: '100vh', background: '#f4f6fb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '48px 40px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>⏳</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Enrollment Pending</h2>
          <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.7, marginBottom: 28 }}>
            Your enrollment is waiting for admin approval. Once approved, you can pay your fees and access your dashboard.
          </p>
          <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 10, padding: '14px 18px', marginBottom: 28, textAlign: 'left' }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#92400e', marginBottom: 4 }}>What happens next?</div>
            <div style={{ fontSize: 13, color: '#92400e', lineHeight: 1.7 }}>
              1. Admin reviews your enrollment<br />
              2. You get approved (usually within 24 hours)<br />
              3. Pay your fees online<br />
              4. Full dashboard access unlocked ✅
            </div>
          </div>
          <a href="https://wa.me/918302344092?text=Hi, I just registered at KVS Academy. Please approve my enrollment."
            target="_blank" rel="noreferrer"
            style={{ display: 'block', background: '#25D366', color: '#fff', padding: '13px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 15, marginBottom: 12 }}>
            💬 WhatsApp Admin for Quick Approval
          </a>
          <button onClick={() => window.location.reload()} style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer', fontSize: 14, color: '#6b7280' }}>
            🔄 Refresh Status
          </button>
        </div>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div style={{ minHeight: '100vh', background: '#f4f6fb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '48px 40px', maxWidth: 440, width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>❌</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Enrollment Rejected</h2>
          <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.7, marginBottom: 28 }}>
            Your enrollment was not approved. Please contact the academy for more information.
          </p>
          <a href="https://wa.me/918302344092" target="_blank" rel="noreferrer"
            style={{ display: 'block', background: '#e94560', color: '#fff', padding: '13px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 15 }}>
            📞 Contact KVS Academy
          </a>
        </div>
      </div>
    );
  }

  // Unpaid — Payment Wall
  const { enrollment, fee } = data;
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const isLate = fee && now.getDate() > fee.dueDayOfMonth;
  const totalAmount = fee ? (fee.amount + (isLate ? fee.lateFee : 0)) : 0;
  const monthLabel = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  const discount = enrollment?.discount || 0;
  const finalAmount = discount > 0 ? Math.round(totalAmount - (totalAmount * discount / 100)) : totalAmount;

  const handlePay = async () => {
    if (paying) return;
    setPaying(true);
    try {
      const { data: order } = await API.post('/payment/order', {
        planName: fee?.planName,
        month,
      });

      if (!window.Razorpay) {
        toast.error('Payment gateway not loaded. Please refresh.');
        setPaying(false);
        return;
      }

      const options = {
        key: order.keyId,
        amount: order.amount * 100,
        currency: 'INR',
        name: 'KVS Kabaddi Academy',
        description: `Fee for ${monthLabel}`,
        order_id: order.orderId,
        handler: async (response) => {
          try {
            await API.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success('Payment successful!');
            window.location.reload();
          } catch {
            toast.error('Verification failed. Contact admin.');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: { color: '#e94560' },
        modal: {
          ondismiss: () => setPaying(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setPaying(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Try again.');
      setPaying(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6fb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '48px 40px', maxWidth: 500, width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🔒</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Pay to Access Dashboard</h2>
          <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.6 }}>
            Your dashboard is locked until you pay your fees for <strong>{monthLabel}</strong>.
          </p>
        </div>

        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 22px', marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>Fee Breakdown</div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 15 }}>
            <span style={{ color: '#374151' }}>{fee?.displayName || 'Monthly Fee'}</span>
            <span style={{ fontWeight: 600 }}>₹{fee?.amount?.toLocaleString()}</span>
          </div>

          {discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 15 }}>
              <span style={{ color: '#059669' }}>🎉 Discount ({discount}%)</span>
              <span style={{ color: '#059669', fontWeight: 600 }}>−₹{Math.round(fee?.amount * discount / 100)}</span>
            </div>
          )}

          {isLate && fee?.lateFee > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 15 }}>
              <span style={{ color: '#ef4444' }}>⚠️ Late Fee (after {fee?.dueDayOfMonth}th)</span>
              <span style={{ color: '#ef4444', fontWeight: 600 }}>+₹{fee?.lateFee}</span>
            </div>
          )}

          <div style={{ borderTop: '1px solid #e5e7eb', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Total Due</span>
            <span style={{ fontWeight: 800, fontSize: 28, color: '#e94560' }}>₹{finalAmount.toLocaleString()}</span>
          </div>
        </div>

        {isLate ? (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#991b1b', display: 'flex', gap: 8 }}>
            <span>⚠️</span>
            <span>Payment is overdue! Late fee of ₹{fee?.lateFee} has been added.</span>
          </div>
        ) : (
          <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#065f46', display: 'flex', gap: 8 }}>
            <span>✅</span>
            <span>Pay before the <strong>{fee?.dueDayOfMonth}th</strong> to avoid late fee of ₹{fee?.lateFee}.</span>
          </div>
        )}

        <button onClick={handlePay} disabled={paying} style={{
          width: '100%', padding: '16px', background: paying ? '#9ca3af' : 'linear-gradient(135deg, #e94560, #c0392b)',
          color: '#fff', border: 'none', borderRadius: 10, fontSize: 17,
          fontWeight: 700, cursor: paying ? 'not-allowed' : 'pointer', marginBottom: 12, letterSpacing: 0.5,
        }}>
          {paying ? 'Processing...' : `💳 Pay ₹${finalAmount.toLocaleString()} via Razorpay`}
        </button>

        <div style={{ textAlign: 'center', fontSize: 13, color: '#9ca3af', marginBottom: 20 }}>
          Accepts UPI, Cards, Net Banking, Wallets
        </div>

        <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>Having trouble paying? Contact us</div>
          <a href="https://wa.me/918302344092?text=Hi, I need help with fee payment for KVS Academy."
            target="_blank" rel="noreferrer"
            style={{ display: 'inline-block', background: '#25D366', color: '#fff', padding: '10px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
            💬 WhatsApp Us
          </a>
        </div>
      </div>
    </div>
  );
}
