import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

// Helper to automatically turn 'pap_smear' or 'breast_exam' into 'Pap Smear' dynamically
const formatTypeLabel = (type = '') => {
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function Screening() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({});
  const [saving, setSaving] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadReminders = async () => {
    try {
      const res = await api.getReminders();
      // Directly assign database response (fallback to empty array if undefined/null)
      setReminders(res?.reminders || []);
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to fetch screening reminders from backend.');
    }
  };

  useEffect(() => {
    loadReminders().finally(() => setLoading(false));
  }, []);

  const logDate = async (type) => {
    const selectedDate = dates[type];
    if (!selectedDate) {
      setErrorMsg(`Please select a valid date for ${formatTypeLabel(type)}.`);
      return;
    }

    setErrorMsg('');
    setSaving(type);

    try {
      await api.updateScreening({ type, date: selectedDate });
      await loadReminders(); // Re-fetch updated list from database
      setDates((prev) => ({ ...prev, [type]: '' }));
      setSuccessMsg(`Successfully updated record for ${formatTypeLabel(type)}!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to update screening date.');
    } finally {
      setSaving('');
    }
  };

  return (
    <div className="screening-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* HEADER */}
      <div className="screening-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '1.8rem', color: '#2C3E50' }}>
          Screening Reminders
        </h1>
        <div 
          className="disclaimer" 
          style={{
            background: '#F8FAFC',
            borderLeft: '4px solid #64748B',
            padding: '12px 16px',
            fontSize: '0.88rem',
            color: '#475569',
            borderRadius: '4px',
            lineHeight: '1.5'
          }}
        >
          These are general awareness reminders based on standard medical screening intervals—not a diagnosis or personalized medical recommendation. Consult your healthcare specialist about your specific health needs.
        </div>
      </div>

      {/* FEEDBACK BANNERS */}
      {successMsg && (
        <div style={{ background: '#ECFDF5', border: '1px solid #10B981', color: '#065F46', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
          ✨ {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{ background: '#FEF2F2', border: '1px solid #EF4444', color: '#991B1B', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* DYNAMIC CONTENT LOADING */}
      {loading ? (
        <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>Loading schedule from server...</p>
      ) : reminders.length === 0 ? (
        <div className="card empty-state" style={{ padding: '32px', textAlign: 'center', background: '#FFFFFF', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
          <p style={{ margin: 0, color: '#64748B', fontSize: '1rem' }}>
            No screening reminders found in your account profile.
          </p>
        </div>
      ) : (
        <div className="reminders-list" style={{ display: 'grid', gap: '20px' }}>
          {reminders.map((r) => {
            const displayTitle = r.label || formatTypeLabel(r.type);
            const isSavingThis = saving === r.type;

            return (
              <div
                key={r.type}
                className="card"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1E293B' }}>
                    {displayTitle}
                  </h3>
                  <span
                    className={`pill ${r.due ? 'due' : 'ok'}`}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '999px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      background: r.due ? '#FEE2E2' : '#DCFCE7',
                      color: r.due ? '#991B1B' : '#166534'
                    }}
                  >
                    {r.due ? 'Due' : 'Up to date'}
                  </span>
                </div>

                <p style={{ margin: '0 0 12px 0', fontSize: '0.88rem', color: '#64748B' }}>
                  Last logged: <strong>{r.lastDate ? r.lastDate : 'Never'}</strong>
                </p>

                {r.guidance && (
                  <p style={{ margin: '0 0 16px 0', fontSize: '0.92rem', color: '#334155', lineHeight: '1.4' }}>
                    {r.guidance}
                  </p>
                )}

                {/* FORM CONTROLS */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>
                      Log completed {displayTitle}
                    </label>
                    <input
                      type="date"
                      value={dates[r.type] || ''}
                      onChange={(e) => setDates((d) => ({ ...d, [r.type]: e.target.value }))}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <button
                    className="btn secondary small"
                    onClick={() => logDate(r.type)}
                    disabled={isSavingThis || !dates[r.type]}
                    style={{
                      padding: '9px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      background: dates[r.type] ? '#0F172A' : '#94A3B8',
                      color: '#FFFFFF',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      cursor: dates[r.type] && !isSavingThis ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {isSavingThis ? 'Saving…' : 'Save date'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}