import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

const SYMPTOM_OPTIONS = [
  { key: 'cramps', label: 'Cramps', icon: '🩸' },
  { key: 'bloating', label: 'Bloating', icon: '🎈' },
  { key: 'fatigue', label: 'Fatigue', icon: '😴' },
  { key: 'headache', label: 'Headache', icon: '🤕' },
  { key: 'mood', label: 'Mood changes', icon: '🎭' },
  { key: 'breast', label: 'Breast tenderness', icon: '🍒' },
  { key: 'acne', label: 'Acne', icon: '✨' },
  { key: 'back', label: 'Back pain', icon: '🧘‍♀️' },
  { key: 'nausea', label: 'Nausea', icon: '🤢' },
  { key: 'cravings', label: 'Cravings', icon: '🍫' }
];

export default function CycleTracker() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Form State
  const [type, setType] = useState('period');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [flow, setFlow] = useState('medium');
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState('');

  // Load logs safely from API
  const loadLogs = async () => {
    try {
      const response = await api.listLogs();
      const rawLogs = Array.isArray(response)
        ? response
        : (response?.logs || []);

      const sortedLogs = [...rawLogs].sort(
        (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
      );

      setLogs(sortedLogs);
      setError('');
    } catch (err) {
      console.error('Failed to load logs:', err);
      setError('Failed to load your history.');
      setLogs([]);
    }
  };

  useEffect(() => {
    loadLogs().finally(() => setLoading(false));
  }, []);

  const toggleSymptom = (label) => {
    setSymptoms((cur) =>
      cur.includes(label) ? cur.filter((x) => x !== label) : [...cur, label]
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.addLog({
        date,
        type,
        flow: type === 'period' ? flow : null,
        symptoms,
        notes: notes.trim(),
      });

      setSymptoms([]);
      setNotes('');
      await loadLogs();
    } catch (err) {
      setError(err.message || 'Failed to save entry.');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      await api.deleteLog(id);
      await loadLogs();
    } catch (err) {
      alert('Failed to delete log.');
    }
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return 'Date unavailable';
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
  };

  return (
    <div className="dashboard-container tracker-page" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '16px 12px', boxSizing: 'border-box' }}>
      <header className="dashboard-header" style={{ marginBottom: '20px' }}>
        <h1 className="greeting-title" style={{ fontSize: 'clamp(1.5rem, 4vw, 1.8rem)' }}>Cycle & symptom tracker</h1>
        <p className="greeting-date" style={{ fontSize: '0.9rem' }}>
          Log periods and symptoms to build your private health history.
        </p>
      </header>

      {/* NEW ENTRY CARD */}
      <div className="card tracker-form-card" style={{ padding: '16px', marginBottom: '24px' }}>
        <h2 className="card-title" style={{ fontSize: '1.2rem', marginBottom: '12px' }}>New Entry</h2>
        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={onSubmit} className="auth-form tracker-form">
          <div className="form-row-split" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div className="field">
              <label htmlFor="entryType">Entry type</label>
              <select
                id="entryType"
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              >
                <option value="period">Period Start/End</option>
                <option value="symptom">Symptom Log Only</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="entryDate">Date</label>
              <input
                id="entryDate"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {type === 'period' && (
            <div className="field flow-field" style={{ marginTop: '12px' }}>
              <label>Flow intensity</label>
              <div className="flow-selector" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['light', 'medium', 'heavy'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`flow-btn ${f} ${flow === f ? 'selected' : ''}`}
                    onClick={() => setFlow(f)}
                    style={{ flex: 1, padding: '8px', cursor: 'pointer' }}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="field symptoms-field" style={{ marginTop: '12px' }}>
            <label>Symptoms & Mood</label>
            <div className="symptoms-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '8px', marginTop: '6px' }}>
              {SYMPTOM_OPTIONS.map((item) => {
                const isSelected = symptoms.includes(item.label);
                return (
                  <button
                    key={item.key}
                    type="button"
                    className={`symptom-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleSymptom(item.label)}
                    style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-start', cursor: 'pointer' }}
                  >
                    <span className="symptom-icon">{item.icon}</span>
                    <span className="symptom-label" style={{ fontSize: '0.85rem' }}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="field" style={{ marginTop: '12px' }}>
            <label htmlFor="notes">Notes (optional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling overall?"
              rows="3"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <button
            className="auth-btn tracker-submit-btn"
            type="submit"
            disabled={saving}
            style={{ width: '100%', marginTop: '16px', padding: '12px', cursor: 'pointer' }}
          >
            {saving ? 'Saving Entry…' : 'Save entry'}
          </button>
        </form>
      </div>

      {/* HISTORY SECTION */}
      <section className="section-block history-section">
        <h3 className="section-title" style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Your History</h3>

        {loading ? (
          <div className="card loading-card" style={{ padding: '20px', textAlign: 'center' }}>
            <p className="muted">Loading history…</p>
          </div>
        ) : !Array.isArray(logs) || logs.length === 0 ? (
          <div className="card empty-card" style={{ padding: '20px', textAlign: 'center' }}>
            <p className="muted" style={{ fontSize: '0.9rem' }}>
              No entries logged yet. Use the form above to start your history.
            </p>
          </div>
        ) : (
          <div className="history-list" style={{ display: 'grid', gap: '12px' }}>
            {logs.map((log) => (
              <div className="card log-entry-card" key={log.id || log._id} style={{ padding: '16px' }}>
                <div className="log-entry-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div className="log-meta" style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className={`log-type-pill ${log.type}`} style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px' }}>
                      {log.type === 'period' ? 'PERIOD' : 'SYMPTOM'}
                    </span>
                    <span className="log-date-display" style={{ fontSize: '0.85rem', color: '#64748B' }}>
                      {formatDateDisplay(log.date)}
                    </span>
                  </div>
                  <button
                    className="icon-btn-delete"
                    onClick={() => onDelete(log.id || log._id)}
                    title="Delete entry"
                    style={{ background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#EF4444' }}
                  >
                    &times;
                  </button>
                </div>

                <div className="log-entry-body">
                  {log.type === 'period' && (
                    <p className="log-flow-data" style={{ fontSize: '0.9rem', margin: '4px 0' }}>
                      Flow: <strong>{log.flow}</strong>
                    </p>
                  )}

                  {log.symptoms?.length > 0 && (
                    <div className="log-symptoms-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '8px 0' }}>
                      {log.symptoms.map((sLabel) => {
                        const sOpt = SYMPTOM_OPTIONS.find((o) => o.label === sLabel);
                        return (
                          <span key={sLabel} className="history-symptom-pill" style={{ fontSize: '0.8rem', background: '#F1F5F9', padding: '4px 8px', borderRadius: '6px' }}>
                            {sOpt?.icon} {sLabel}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {log.notes && (
                    <div className="log-notes-box" style={{ marginTop: '8px', padding: '8px', background: '#F8FAFC', borderRadius: '6px' }}>
                      <p className="log-notes-text" style={{ fontSize: '0.88rem', margin: 0, color: '#334155' }}>{log.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}