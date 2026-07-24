import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

// Helper to determine badge styling based on booking status (calmer/modern palette)
const getStatusBadgeStyle = (status = '') => {
  const normalized = status.toLowerCase();
  switch (normalized) {
    case 'confirmed':
    case 'approved':
      return { background: '#E8F5E9', color: '#2E7D32', label: 'Confirmed' }; // Sage green vibe
    case 'pending':
    case 'requested':
      return { background: '#FFF8E1', color: '#B7791F', label: 'Pending Review' }; // Amber emphasis
    case 'completed':
      return { background: '#E0F2FE', color: '#0369A1', label: 'Completed' }; // Soft blue
    case 'cancelled':
    case 'declined':
      return { background: '#F1F5F9', color: '#475569', label: 'Cancelled' }; // Lavender-grey neutral
    default:
      return { background: '#F1F5F9', color: '#475569', label: status || 'Pending' };
  }
};

// Safe date formatter
const formatDate = (dateString) => {
  if (!dateString) return 'Date unavailable';
  const parsed = new Date(dateString);
  return isNaN(parsed.getTime())
    ? dateString
    : parsed.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
};

// Utility to parse API responses safely whether they return an array or an object wrapper
const extractArrayData = (res, key) => {
  if (Array.isArray(res)) return res;
  return Array.isArray(res?.[key]) ? res[key] : [];
};

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [specialists, setSpecialists] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Action states for cancelling or modifying consultations
  const [actionLoading, setActionLoading] = useState(null);
  const [actionError, setActionError] = useState('');

  const fetchConsults = async () => {
    setLoading(true);
    setError('');
    try {
      const [bookingsRes, specialistsRes] = await Promise.all([
        api.listBookings().catch(() => ({ bookings: [] })),
        api.listSpecialists().catch(() => ({ specialists: [] })),
      ]);

      const rawBookings = extractArrayData(bookingsRes, 'bookings');
      const rawSpecialists = extractArrayData(specialistsRes, 'specialists');

      const specialistMap = Object.fromEntries(
        rawSpecialists.map((sp) => [sp.id, sp])
      );

      setBookings(rawBookings);
      setSpecialists(specialistMap);
    } catch (err) {
      setError(err?.message || 'Failed to load consultation records.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsults();
  }, []);

  // Handler to cancel a booking request
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this consultation request?')) return;
    
    setActionLoading(bookingId);
    setActionError('');
    try {
      if (typeof api.cancelBooking === 'function') {
        await api.cancelBooking(bookingId);
      } else if (typeof api.updateBookingStatus === 'function') {
        await api.updateBookingStatus(bookingId, 'cancelled');
      } else {
        throw new Error('Cancellation endpoint is not available on the client API.');
      }
      await fetchConsults();
    } catch (err) {
      setActionError(err?.message || 'Failed to cancel consultation.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div
      className="main bookings-page"
      style={{
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '16px 12px',
        boxSizing: 'border-box',
        backgroundColor: '#FAF8F5', // Warm off-white
        minHeight: '100vh',
      }}
    >
      {/* PAGE HEADER */}
      <div className="bookings-header" style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: '0 0 6px 0', fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', color: '#2C3E50', fontWeight: '700' }}>
          My Consultations
        </h1>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#5A6E7F' }}>
          Track and manage your requested private appointments and specialist sessions.
        </p>
      </div>

      {/* ERROR BANNER - Urgent Medical Red */}
      {error && (
        <div
          style={{
            background: '#FEE2E2',
            border: '1px solid #DC2626',
            color: '#991B1B',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          <span>⚠️ {error}</span>
          <button
            onClick={fetchConsults}
            style={{
              background: '#DC2626',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ACTION ERROR BANNER - Urgent Medical Red */}
      {actionError && (
        <div
          style={{
            background: '#FEE2E2',
            border: '1px solid #DC2626',
            color: '#991B1B',
            padding: '10px 14px',
            borderRadius: '12px',
            marginBottom: '16px',
            fontSize: '0.88rem',
          }}
        >
          ⚠️ {actionError}
        </div>
      )}

      {/* CONTENT STATES */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#5A6E7F' }}>
          <p style={{ fontSize: '0.95rem' }}>Fetching your consult requests...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div
          className="card empty-state"
          style={{
            background: '#FFFFFF',
            border: '1px dashed #CBD5E1',
            borderRadius: '16px',
            padding: '30px 16px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💬</div>
          <h3 style={{ margin: '0 0 6px 0', color: '#2C3E50', fontSize: '1.1rem' }}>
            No Consultations Found
          </h3>
          <p style={{ margin: 0, color: '#5A6E7F', fontSize: '0.9rem' }}>
            You haven't submitted any consultation requests yet.
          </p>
        </div>
      ) : (
        <div className="bookings-list" style={{ display: 'grid', gap: '16px' }}>
          {bookings.map((b, index) => {
            const bookingId = b.id || b._id;
            const specialist = specialists[b.specialistId] || {};
            const specialistName = specialist.name || b.specialistName || 'Specialist';
            const specialty = specialist.specialty;
            const badge = getStatusBadgeStyle(b.status);
            const normalizedStatus = (b.status || '').toLowerCase();
            const isCancellable = normalizedStatus === 'pending' || normalizedStatus === 'requested' || normalizedStatus === 'confirmed';

            return (
              <div
                key={bookingId || index}
                className="card booking-card"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '16px',
                  boxShadow: '0 2px 6px rgba(44, 62, 80, 0.03)',
                  overflowWrap: 'break-word',
                }}
              >
                {/* CARD HEADER */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '12px',
                    marginBottom: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: '1 1 200px' }}>
                    <h3
                      style={{
                        margin: '0 0 4px 0',
                        fontSize: '1.05rem',
                        color: '#2C3E50',
                        fontWeight: '600',
                      }}
                    >
                      {specialistName}
                    </h3>
                    {specialty && (
                      <span style={{ fontSize: '0.85rem', color: '#5A6E7F', fontWeight: '500' }}>
                        {specialty}
                      </span>
                    )}
                  </div>

                  {/* DYNAMIC STATUS BADGE */}
                  <span
                    className="pill status"
                    style={{
                      background: badge.background,
                      color: badge.color,
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {badge.label}
                  </span>
                </div>

                {/* DETAILS SECTION - Pale Teal / Soft Blue background accent */}
                <div
                  style={{
                    display: 'grid',
                    gap: '8px',
                    fontSize: '0.88rem',
                    color: '#334155',
                    background: '#F0F9FF',
                    padding: '12px',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    border: '1px solid #E0F2FE',
                  }}
                >
                  {b.preferredTimes && (
                    <div>
                      <strong style={{ color: '#0369A1' }}>Preferred Schedule: </strong>
                      <span>{b.preferredTimes}</span>
                    </div>
                  )}

                  {b.contact && (
                    <div>
                      <strong style={{ color: '#0369A1' }}>Contact Info: </strong>
                      <span>{b.contact}</span>
                    </div>
                  )}

                  {b.reason && (
                    <div>
                      <strong style={{ color: '#0369A1' }}>Reason for Visit: </strong>
                      <span style={{ color: '#2C3E50' }}>{b.reason}</span>
                    </div>
                  )}
                </div>

                {/* CARD FOOTER WITH TIMESTAMP & ACTIONS */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap',
                    marginTop: '12px',
                    borderTop: '1px solid #F1F5F9',
                    paddingTop: '10px',
                  }}
                >
                  <div>
                    {isCancellable && bookingId && (
                      <button
                        onClick={() => handleCancelBooking(bookingId)}
                        disabled={actionLoading === bookingId}
                        style={{
                          background: 'transparent',
                          color: '#DC2626', // Urgent Medical Red for cancellation button emphasis
                          border: '1px solid #FCA5A5',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '0.78rem',
                          fontWeight: '600',
                          cursor: actionLoading === bookingId ? 'not-allowed' : 'pointer',
                          opacity: actionLoading === bookingId ? 0.6 : 1,
                        }}
                      >
                        {actionLoading === bookingId ? 'Cancelling...' : 'Cancel Request'}
                      </button>
                    )}
                  </div>

                  {b.createdAt && (
                    <div style={{ fontSize: '0.78rem', color: '#7E8C9D', textAlign: 'right', marginLeft: 'auto' }}>
                      Requested on {formatDate(b.createdAt)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}