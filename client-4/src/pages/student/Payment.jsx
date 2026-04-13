import { useEffect, useState, useCallback, useRef } from 'react';
import Sidebar from '../../components/common/Sidebar';
import API from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import PaymentWall from '../../components/student/PaymentWall';

function StudentPayment() {
  const { user } = useAuth();
  const [fees, setFees]           = useState([]);
  const [payments, setPayments]   = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [paying, setPaying]       = useState(false);
  const razorpayLoaded = useRef(false);

  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthLabel = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  const fetchData = useCallback(() => {
    setLoading(true);
    Promise.all([
      API.get('/fees'),
      API.get('/payment/history'),
      API.get('/students/me/enrollment'),
    ]).then(([f, p, e]) => {
      setFees(f.data.filter(fee => fee.isActive));
      const paymentList = p.data.payments || p.data;
      setPayments(Array.isArray(paymentList) ? paymentList : []);
      setEnrollment(e.data);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Load Razorpay script once
  useEffect(() => {
    if (razorpayLoaded.current) return;
    const existing = document.querySelector('script[src*="razorpay"]');
    if (existing) { razorpayLoaded.current = true; return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => { razorpayLoaded.current = true; };
    document.body.appendChild(script);
  }, []);

  const paidThisMonth = payments.find(p => p.month === month && p.status === 'paid');

  const handlePay = async (planName) => {
    if (paying) return;
    setPaying(true);
    try {
      const { data } = await API.post('/payment/order', { planName, month });

      const options = {
        key: data.keyId,
        amount: data.amount * 100,
        currency: 'INR',
        name: 'KVS Kabaddi Academy',
        description: `Fee payment for ${monthLabel}`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await API.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success('Payment successful! Receipt sent to your email.');
            fetchData(); // Refresh data instead of page reload
          } catch {
            toast.error('Payment verification failed. Contact admin.');
          } finally {
            setPaying(false);
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

      if (!window.Razorpay) {
        toast.error('Payment gateway not loaded. Please refresh and try again.');
        setPaying(false);
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setPaying(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not initiate payment');
      setPaying(false);
    }
  };

  const getPlanForEnrollment = () => {
    if (!enrollment) return null;
    if (enrollment.type === 'gym') return 'gym-monthly';
    if (enrollment.type === 'both') return 'combo';
    return enrollment.plan === 'hostel' ? 'kabaddi-hostel' : 'kabaddi-training';
  };

  const myPlan = getPlanForEnrollment();
  const myFee = fees.find(f => f.planName === myPlan);

  if (loading) return <div className="layout"><Sidebar /><div className="main-content loader"><div className="spinner" /></div></div>;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <div><h1>💳 Fee Payment</h1><p>Pay your monthly academy fees</p></div>
        </div>

        {/* Fee waived message */}
        {enrollment?.isWaived && (
          <div className="card" style={{ marginBottom: 24, background: '#d1fae5', border: '1px solid #6ee7b7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 32 }}>🎉</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#065f46' }}>Your Fees Are Waived</div>
                <div style={{ fontSize: 13, color: '#047857' }}>
                  {enrollment.waivedReason ? `Reason: ${enrollment.waivedReason}` : 'Your fees have been waived by the admin. No payment required.'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current month payment */}
        {!enrollment?.isWaived && (
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Current Month — {monthLabel}</h3>
            {enrollment?.status !== 'active' ? (
              <div style={{ background: '#fef3c7', borderRadius: 10, padding: '14px 18px', color: '#92400e' }}>
                ⚠️ Your enrollment is <strong>{enrollment?.status || 'not active'}</strong>. Contact admin to activate.
              </div>
            ) : paidThisMonth ? (
              <div style={{ background: '#d1fae5', borderRadius: 10, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 32 }}>✅</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#065f46' }}>Fees Paid for {monthLabel}</div>
                  <div style={{ fontSize: 13, color: '#047857' }}>Amount: ₹{paidThisMonth.amount?.toLocaleString()} · Payment ID: {paidThisMonth.razorpayPaymentId}</div>
                </div>
              </div>
            ) : myFee ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{myFee.displayName}</div>
                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{myFee.description}</div>
                  {enrollment?.discount > 0 && (
                    <div style={{ fontSize: 13, color: '#059669', marginTop: 4 }}>🎉 {enrollment.discount}% discount applied</div>
                  )}
                  {new Date().getDate() > myFee.dueDayOfMonth && (
                    <div style={{ fontSize: 13, color: '#ef4444', marginTop: 4 }}>⚠️ Late fee of ₹{myFee.lateFee} will be added</div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#1a1a2e' }}>₹{myFee.amount?.toLocaleString()}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>Due by {myFee.dueDayOfMonth}th</div>
                  <button className="btn btn-primary" style={{ marginTop: 10 }}
                    onClick={() => handlePay(myFee.planName)} disabled={paying}>
                    {paying ? 'Processing...' : '💳 Pay Now'}
                  </button>
                </div>
              </div>
            ) : (
              <p style={{ color: '#9ca3af' }}>No fee plan found. Contact admin.</p>
            )}
          </div>
        )}

        {/* All fee plans */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>All Fee Plans</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {fees.map(fee => (
              <div key={fee._id} style={{ border: fee.planName === myPlan ? '2px solid #e94560' : '1px solid #e5e7eb', borderRadius: 10, padding: '16px', position: 'relative' }}>
                {fee.planName === myPlan && (
                  <span className="badge badge-danger" style={{ position: 'absolute', top: 10, right: 10, fontSize: 10 }}>Your Plan</span>
                )}
                <div style={{ fontWeight: 600, fontSize: 14 }}>{fee.displayName}</div>
                <div style={{ fontSize: 22, fontWeight: 800, margin: '8px 0', color: '#1a1a2e' }}>₹{fee.amount?.toLocaleString()}</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>{fee.type === 'monthly' ? '/month' : 'one-time'}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>{fee.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment history */}
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Payment History</h3>
          {payments.length === 0 ? (
            <p style={{ color: '#9ca3af' }}>No payment history yet.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Month</th><th>Plan</th><th>Amount</th><th>Late Fee</th><th>Status</th><th>Date</th><th>Payment ID</th></tr></thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p._id}>
                      <td>{p.month || '—'}</td>
                      <td>{p.planName}</td>
                      <td style={{ fontWeight: 600 }}>₹{p.amount?.toLocaleString()}</td>
                      <td>{p.lateFeeAmount > 0 ? <span style={{ color: '#ef4444' }}>₹{p.lateFeeAmount}</span> : '—'}</td>
                      <td><span className={`badge ${p.status === 'paid' ? 'badge-success' : p.status === 'failed' ? 'badge-danger' : 'badge-warning'}`}>{p.status}</span></td>
                      <td style={{ fontSize: 13, color: '#6b7280' }}>{p.paidAt ? new Date(p.paidAt).toLocaleDateString('en-IN') : '—'}</td>
                      <td style={{ fontSize: 12, color: '#9ca3af' }}>{p.razorpayPaymentId || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const WrappedPayment = () => (
  <PaymentWall>
    <StudentPayment />
  </PaymentWall>
);
export default WrappedPayment;
