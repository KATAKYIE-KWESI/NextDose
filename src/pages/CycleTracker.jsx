import { useState, useEffect } from 'react';
import { api } from '../api/client.js';

export default function CycleTracker() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [activeTab, setActiveTab] = useState('menstruation'); // menstruation, pregnancy, parenting
  const [logs, setLogs] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Visibility toggles for optional/sensitive categories
  const [showSexualHealth, setShowSexualHealth] = useState(true);
  const [showBreastAwareness, setShowBreastAwareness] = useState(true);
  const [showNotesAttachments, setShowNotesAttachments] = useState(true);

  // Complete state matching every section in your specification
  const [activeLog, setActiveLog] = useState({
    flow: '', // e.g., 'Period started today', 'Light flow', etc.
    symptoms: [], // array of selected items from physical, vaginal discharge, mood, etc.
    mood: '',
    painSeverity: '',
    painLocation: '',
    painMedication: '',
    sexualActivity: false,
    contraception: '',
    libido: '',
    pregnancyTest: '',
    ovulationTest: '',
    conceivingStatus: '',
    breastChange: '',
    breastChangeDetails: '',
    notes: '',
  });

  const fetchLogs = async () => {
    try {
      const res = api.getCycleLogs ? await api.getCycleLogs() : { logs: [] };
      setLogs(res?.logs || []);
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to fetch cycle logs.');
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleDayClick = (dayNum) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(dayNum).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    setSelectedDateStr(dateStr);

    const existing = logs.find((l) => l.date === dateStr);
    if (existing) {
      setActiveLog({
        flow: existing.flow || '',
        symptoms: existing.symptoms || [],
        mood: existing.mood || '',
        painSeverity: existing.painSeverity || '',
        painLocation: existing.painLocation || '',
        painMedication: existing.painMedication || '',
        sexualActivity: existing.sexualActivity || false,
        contraception: existing.contraception || '',
        libido: existing.libido || '',
        pregnancyTest: existing.pregnancyTest || '',
        ovulationTest: existing.ovulationTest || '',
        conceivingStatus: existing.conceivingStatus || '',
        breastChange: existing.breastChange || '',
        breastChangeDetails: existing.breastChangeDetails || '',
        notes: existing.notes || '',
      });
    } else {
      setActiveLog({
        flow: '',
        symptoms: [],
        mood: '',
        painSeverity: '',
        painLocation: '',
        painMedication: '',
        sexualActivity: false,
        contraception: '',
        libido: '',
        pregnancyTest: '',
        ovulationTest: '',
        conceivingStatus: '',
        breastChange: '',
        breastChangeDetails: '',
        notes: '',
      });
    }
  };

  const toggleItem = (item) => {
    setActiveLog((prev) => {
      const exists = prev.symptoms.includes(item);
      return {
        ...prev,
        symptoms: exists
          ? prev.symptoms.filter((s) => s !== item)
          : [...prev.symptoms, item],
      };
    });
  };

  const handleSave = async () => {
    try {
      await api.addCycleLog({
        date: selectedDateStr,
        type: 'cycle_entry',
        ...activeLog,
      });
      await fetchLogs();
      setSuccessMsg(`Successfully saved record for ${selectedDateStr}!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to save entry.');
    }
  };

  // Icon definitions matching the UI image style
  const physicalSymptomsList = [
    { name: 'no symptoms', icon: '👍' },
    { name: 'Backache', icon: '👤' },
    { name: 'stomach ache', icon: '⚡' },
    { name: 'Lower abdominal discomfort', icon: '❗' },
    { name: 'breast tenderness', icon: '👙' },
    { name: 'body aches', icon: '🔴' },
    { name: 'Headache', icon: '🧠' },
    { name: 'dizziness', icon: '💫' },
    { name: 'Insomnia', icon: '🌙' },
    { name: 'acne', icon: '✨' },
    { name: 'dry skin', icon: '💧' },
    { name: 'Loss of appetite', icon: '🍽️' },
    { name: 'Heavy or cold limbs', icon: '❄️' },
    { name: 'diarrhea', icon: '🧻' },
    { name: 'constipation', icon: '🌀' },
    { name: 'exhausted', icon: '🔋' },
  ];

  const dischargeIconsList = [
    { name: 'Normal discharge', colorBg: '#e2e8f0' },
    { name: 'Dryness', colorBg: '#cbd5e1' },
    { name: 'Watery, creamy or stretchy discharge', colorBg: '#f472b6' },
    { name: 'Unusual colour or smell', colorBg: '#fb923c' },
    { name: 'Itching, irritation or burning', colorBg: '#f87171' },
    { name: 'Possible infection symptoms', colorBg: '#ef4444' },
    { name: 'brown discharge', colorBg: '#b45309' },
    { name: 'Bleeding', colorBg: '#be185d' },
    { name: 'There is blood clot', colorBg: '#991b1b' },
    { name: 'Increased leucorrhea', colorBg: '#fbcfe8' },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '850px', margin: '0 auto', padding: '20px 16px', boxSizing: 'border-box', color: '#1E293B', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* TOP SUB-NAV BAR */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '0.9rem', fontWeight: '600', color: '#64748B', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
        <button 
          onClick={() => setActiveTab('menstruation')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'menstruation' ? '#be185d' : '#64748B', fontWeight: activeTab === 'menstruation' ? '700' : '500', borderBottom: activeTab === 'menstruation' ? '2px solid #be185d' : 'none', paddingBottom: '4px' }}
        >
          menstruation
        </button>
        <button 
          onClick={() => setActiveTab('pregnancy')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'pregnancy' ? '#be185d' : '#64748B', fontWeight: activeTab === 'pregnancy' ? '700' : '500', borderBottom: activeTab === 'pregnancy' ? '2px solid #be185d' : 'none', paddingBottom: '4px' }}
        >
          Preparing for pregnancy
        </button>
        <button 
          onClick={() => setActiveTab('parenting')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'parenting' ? '#be185d' : '#64748B', fontWeight: activeTab === 'parenting' ? '700' : '500', borderBottom: activeTab === 'parenting' ? '2px solid #be185d' : 'none', paddingBottom: '4px' }}
        >
          parenting
        </button>
      </div>

      {/* MONTH HEADER & CALENDAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#1E293B' }}>
          &lt; {monthNames[month]} {year}
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF', cursor: 'pointer' }}>&lt;</button>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF', cursor: 'pointer' }}>&gt;</button>
        </div>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px', marginBottom: '24px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: '700', color: '#94A3B8', fontSize: '0.8rem', marginBottom: '10px' }}>
          <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
          {Array.from({ length: firstDayIndex }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: totalDays }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isSelected = selectedDateStr === dateStr;
            const hasLog = logs.some((l) => l.date === dateStr);

            return (
              <button
                key={dayNum}
                onClick={() => handleDayClick(dayNum)}
                style={{
                  aspectRatio: '1',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #be185d' : '1px solid #F1F5F9',
                  background: isSelected ? '#fce7f3' : hasLog ? '#fdf2f8' : '#F8FAFC',
                  color: isSelected ? '#be185d' : '#334155',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span>{dayNum}</span>
                {hasLog && <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#be185d', marginTop: '2px' }} />}
              </button>
            );
          })}
        </div>

        {/* CALENDAR LEGEND */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', fontSize: '0.72rem', color: '#64748B', flexWrap: 'wrap' }}>
          <span><span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#be185d', borderRadius: '50%' }} /> Confirmed/predicted menstrual days</span>
          <span><span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#f472b6', borderRadius: '50%' }} /> Fertile window</span>
          <span><span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#9333ea', borderRadius: '50%' }} /> Predicted ovulation day</span>
        </div>
      </div>

      {successMsg && <div style={{ background: '#ECFDF5', color: '#065F46', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>{successMsg}</div>}
      {errorMsg && <div style={{ background: '#FEF2F2', color: '#991B1B', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>{errorMsg}</div>}

      {/* RECORDING SECTIONS DIVIDED INTO CLEAR CATEGORIES */}
      <div style={{ display: 'grid', gap: '20px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#1E293B' }}>
          Recording Options for: <span style={{ color: '#be185d' }}>{selectedDateStr}</span>
        </h3>

        {/* 1. PERIOD AND BLEEDING */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: '700', color: '#1E293B' }}>Period and bleeding</h4>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setActiveLog(p => ({ ...p, flow: 'Period started today' }))}
              style={{ background: activeLog.flow === 'Period started today' ? '#be185d' : '#fce7f3', color: activeLog.flow === 'Period started today' ? '#FFF' : '#be185d', border: '1px solid #fbcfe8', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}
            >
              + Period started today
            </button>
            <button 
              onClick={() => setActiveLog(p => ({ ...p, flow: 'Period ended today' }))}
              style={{ background: activeLog.flow === 'Period ended today' ? '#475569' : '#F1F5F9', color: activeLog.flow === 'Period ended today' ? '#FFF' : '#475569', border: '1px solid #CBD5E1', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer' }}
            >
              + Period ended today
            </button>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Spotting', 'Light flow', 'Medium flow', 'Heavy flow', 'Blood clots', 'Bleeding between periods', 'Bleeding after sex'].map((item) => {
              const active = activeLog.flow === item;
              return (
                <button
                  key={item}
                  onClick={() => setActiveLog(p => ({ ...p, flow: active ? '' : item }))}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '20px',
                    border: active ? '1px solid #be185d' : '1px solid #CBD5E1',
                    background: active ? '#be185d' : '#F8FAFC',
                    color: active ? '#FFF' : '#334155',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  + {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. PAIN AND PHYSICAL SYMPTOMS */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: '700', color: '#1E293B' }}>Pain and physical symptoms</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(85px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            {physicalSymptomsList.map((item) => {
              const isSelected = activeLog.symptoms.includes(item.name);
              return (
                <button
                  key={item.name}
                  onClick={() => toggleItem(item.name)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <div 
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      background: isSelected ? '#fce7f3' : '#F8FAFC',
                      border: isSelected ? '2px solid #be185d' : '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      marginBottom: '6px'
                    }}
                  >
                    {item.icon}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: isSelected ? '#be185d' : '#64748B', textAlign: 'center', fontWeight: isSelected ? '700' : '500', lineHeight: '1.1' }}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sub-inputs for Pain Severity & Medication */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '14px', borderTop: '1px solid #F1F5F9', paddingTop: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>Pain severity and location</label>
              <input
                type="text"
                placeholder="e.g., Mild, Lower abdomen"
                value={activeLog.painLocation}
                onChange={(e) => setActiveLog(p => ({ ...p, painLocation: e.target.value }))}
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>Pain medication & effectiveness</label>
              <input
                type="text"
                placeholder="e.g., Ibuprofen - Effective"
                value={activeLog.painMedication}
                onChange={(e) => setActiveLog(p => ({ ...p, painMedication: e.target.value }))}
                style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </div>

        {/* 3. VAGINAL DISCHARGE AND REPRODUCTIVE SYMPTOMS */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: '700', color: '#1E293B' }}>Vaginal discharge and reproductive symptoms</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(95px, 1fr))', gap: '14px' }}>
            {dischargeIconsList.map((item) => {
              const isSelected = activeLog.symptoms.includes(item.name);
              return (
                <button
                  key={item.name}
                  onClick={() => toggleItem(item.name)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <div 
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: item.colorBg,
                      border: isSelected ? '3px solid #be185d' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFF',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      marginBottom: '6px'
                    }}
                  >
                    {isSelected ? '✓' : ''}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: isSelected ? '#be185d' : '#64748B', textAlign: 'center', fontWeight: isSelected ? '700' : '500', lineHeight: '1.1' }}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. MOOD AND MENTAL WELLBEING */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: '700', color: '#1E293B' }}>Mood and mental wellbeing</h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Happy or calm', 'Energetic or motivated', 'Sensitive or irritable', 'Anxious or stressed', 'Low mood', 'Difficulty concentrating', 'Mood swings'].map((m) => {
              const active = activeLog.mood === m;
              return (
                <button
                  key={m}
                  onClick={() => setActiveLog(p => ({ ...p, mood: active ? '' : m }))}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '20px',
                    border: active ? '1px solid #be185d' : '1px solid #CBD5E1',
                    background: active ? '#be185d' : '#F8FAFC',
                    color: active ? '#FFF' : '#334155',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  + {m}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. OPTIONAL: SEXUAL AND FERTILITY INFORMATION (Removable) */}
        {showSexualHealth && (
          <div style={{ background: '#FFFFFF', border: '1px dashed #be185d', borderRadius: '16px', padding: '20px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#1E293B' }}>Sexual and fertility information</h4>
              <button 
                onClick={() => setShowSexualHealth(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}
              >
                Remove category ✕
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {['Sexual activity', 'Protection or contraception used', 'Libido', 'Pain during sex', 'Pregnancy test result', 'Ovulation test result', 'Trying to conceive status'].map((item) => {
                const isSelected = activeLog.symptoms.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggleItem(item)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '20px',
                      border: isSelected ? '1px solid #be185d' : '1px solid #CBD5E1',
                      background: isSelected ? '#be185d' : '#F8FAFC',
                      color: isSelected ? '#FFF' : '#334155',
                      fontSize: '0.82rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    + {item}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. OPTIONAL: BREAST AWARENESS (Removable & Clinical Safeguard) */}
        {showBreastAwareness && (
          <div style={{ background: '#FFFFFF', border: '1px dashed #be185d', borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#1E293B' }}>Breast awareness</h4>
              <button 
                onClick={() => setShowBreastAwareness(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}
              >
                Remove category ✕
              </button>
            </div>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.75rem', color: '#64748B', fontStyle: 'italic' }}>
              The app should not diagnose breast disease. It should identify persistent or unusual changes and recommend professional assessment.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Breast tenderness or pain', 'New lump or thickening', 'Swelling or skin changes', 'Nipple changes or discharge', 'Change in breast shape or size'].map((item) => {
                const isSelected = activeLog.symptoms.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggleItem(item)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '20px',
                      border: isSelected ? '1px solid #be185d' : '1px solid #CBD5E1',
                      background: isSelected ? '#be185d' : '#F8FAFC',
                      color: isSelected ? '#FFF' : '#334155',
                      fontSize: '0.82rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    + {item}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 7. NOTES AND ATTACHMENTS */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', fontWeight: '700', color: '#1E293B' }}>Notes and attachments</h4>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap', fontSize: '0.8rem', color: '#64748B' }}>
            <span>✓ Written note</span>
            <span>✓ Voice note</span>
            <span>✓ Photo</span>
            <span>✓ Medical report / Lab result</span>
            <span>✓ Prescription</span>
            <span>✓ Consultation note</span>
          </div>
          <textarea
            rows="3"
            placeholder="Add a written note, voice note reference, or laboratory report details..."
            value={activeLog.notes}
            onChange={(e) => setActiveLog(p => ({ ...p, notes: e.target.value }))}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none', marginBottom: '16px' }}
          />
          <button
            onClick={handleSave}
            style={{
              background: '#be185d',
              color: '#FFFFFF',
              border: 'none',
              padding: '14px 24px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(190, 24, 93, 0.25)',
              width: '100%'
            }}
          >
            Save Day's Record
          </button>
        </div>

      </div>
    </div>
  );
}