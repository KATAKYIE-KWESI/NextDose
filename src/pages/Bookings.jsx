import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

// Helper to determine badge styling based on booking status
const getStatusBadgeStyle = (status = '') => {
  const normalized = status.toLowerCase();
  switch (normalized) {
    case 'confirmed':
    case 'approved':
      return { background: '#DCFCE7', color: '#166534', label: 'Confirmed' };
    case 'pending':
    case 'requested':
      return { background: '#FEF3C7', color: '#92400E', label: 'Pending Review' };
    case 'completed':
      return { background: '#E0F2FE', color: '#0369A1', label: 'Completed' };
    case 'cancelled':
    case 'declined':
      return { background: '#FEE2E2', color: '#991B1B', label: 'Cancelled' };
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
        // Fallback simulation or direct patch if client supports generic updates
        throw new Error('Cancellation endpoint is not available on the client API.');
      }
      // Refresh list after successful cancellation
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
      }}
    >
      {/* PAGE HEADER */}
      <div className="bookings-header" style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: '0 0 6px 0', fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', color: '#1E293B', fontWeight: '700' }}>
          My Consultations
        </h1>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748B' }}>
          Track and manage your requested private appointments and specialist sessions.
        </p>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div
          style={{
            background: '#FEF2F2',
            border: '1px solid #EF4444',
            color: '#991B1B',
            padding: '12px 16px',
            borderRadius: '8px',
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
              background: '#991B1B',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ACTION ERROR BANNER */}
      {actionError && (
        <div
          style={{
            background: '#FEF2F2',
            border: '1px solid #EF4444',
            color: '#991B1B',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '0.88rem',
          }}
        >
          ⚠️ {actionError}
        </div>
      )}

      {/* CONTENT STATES */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748B' }}>
          <p style={{ fontSize: '0.95rem' }}>Fetching your consult requests...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div
          className="card empty-state"
          style={{
            background: '#FFFFFF',
            border: '1px dashed #CBD5E1',
            borderRadius: '12px',
            padding: '30px 16px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💬</div>
          <h3 style={{ margin: '0 0 6px 0', color: '#334155', fontSize: '1.1rem' }}>
            No Consultations Found
          </h3>
          <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem' }}>
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
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
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
                        color: '#0F172A',
                        fontWeight: '600',
                      }}
                    >
                      {specialistName}
                    </h3>
                    {specialty && (
                      <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '500' }}>
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
                      padding: '4px 10px',
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

                {/* DETAILS SECTION */}
                <div
                  style={{
                    display: 'grid',
                    gap: '8px',
                    fontSize: '0.88rem',
                    color: '#334155',
                    background: '#F8FAFC',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '12px',
                  }}
                >
                  {b.preferredTimes && (
                    <div>
                      <strong style={{ color: '#475569' }}>Preferred Schedule: </strong>
                      <span>{b.preferredTimes}</span>
                    </div>
                  )}

                  {b.contact && (
                    <div>
                      <strong style={{ color: '#475569' }}>Contact Info: </strong>
                      <span>{b.contact}</span>
                    </div>
                  )}

                  {b.reason && (
                    <div>
                      <strong style={{ color: '#475569' }}>Reason for Visit: </strong>
                      <span style={{ color: '#1E293B' }}>{b.reason}</span>
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
                          color: '#DC2626',
                          border: '1px solid #FCA5A5',
                          borderRadius: '6px',
                          padding: '5px 10px',
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
                    <div style={{ fontSize: '0.78rem', color: '#94A3B8', textAlign: 'right', marginLeft: 'auto' }}>
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