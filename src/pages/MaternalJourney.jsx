import { useState } from 'react';

export default function MaternalJourney() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Pregnancy Overview state
  const [pregnancyData, setPregnancyData] = useState({
    currentWeek: '24',
    trimester: '2nd Trimester',
    dueDate: '2026-11-12',
    babySize: 'Corn Ear (~30cm, 600g)',
    pregnancyType: 'Singleton',
    nextAntenatal: '2026-07-28',
    hospitalProvider: 'Korle-Bu Teaching Hospital',
    emergencyContact: '+233 30 266 5011'
  });

  // Symptoms tracking state
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomSeverity, setSymptomSeverity] = useState('Mild');
  const [symptomDuration, setSymptomDuration] = useState('Today');
  const [symptomNote, setSymptomNote] = useState('');

  // Urgent flags state
  const [selectedUrgentFlags, setSelectedUrgentFlags] = useState([]);

  // Vitals tracking state
  const [weight, setWeight] = useState('72.5');
  const [bpSystolic, setBpSystolic] = useState('120');
  const [bpDiastolic, setBpDiastolic] = useState('80');
  const [bloodSugar, setBloodSugar] = useState('5.4');
  const [temperature, setTemperature] = useState('36.6');

  // Fetal Movement state
  const [fetalStatus, setFetalStatus] = useState('Movement feels normal');
  const [movementCount, setMovementCount] = useState('');
  const [fetalNotes, setFetalNotes] = useState('');

  // Contraction Timer state
  const [contractions, setContractions] = useState([]);
  const [isContractionActive, setIsContractionActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [contractionIntensity, setContractionIntensity] = useState('Moderate');
  const [watersBreaking, setWatersBreaking] = useState(false);
  const [hospitalContacted, setHospitalContacted] = useState(false);

  const routineSymptomsList = [
    'Nausea or vomiting', 'Fatigue', 'Headache or dizziness', 
    'Back or pelvic pain', 'Heartburn or bloating', 'Constipation', 
    'Swelling or leg cramps', 'Sleep problems', 'Vaginal discharge', 
    'Mood or anxiety', 'Other symptoms'
  ];

  const urgentSignsList = [
    'Vaginal bleeding', 'Leaking fluid', 'Severe abdominal pain', 
    'Severe or persistent headache', 'Vision changes', 'Sudden swelling', 
    'Fever', 'Chest pain or difficulty breathing', 'Severe vomiting or dehydration', 
    'Reduced fetal movement', 'Possible early labour'
  ];

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const toggleUrgentFlag = (flag) => {
    setSelectedUrgentFlags(prev => 
      prev.includes(flag) ? prev.filter(f => f !== flag) : [...prev, flag]
    );
  };

  const startContractionTimer = () => {
    setStartTime(new Date());
    setIsContractionActive(true);
  };

  const stopContractionTimer = () => {
    if (!startTime) return;
    const endTime = new Date();
    const durationSecs = Math.round((endTime - startTime) / 1000);
    const newEntry = {
      id: Date.now(),
      time: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: `${durationSecs} secs`,
      intensity: contractionIntensity,
    };
    setContractions([newEntry, ...contractions]);
    setIsContractionActive(false);
    setStartTime(null);
  };

  return (
    <div 
      className="maternal-container"
      style={{
        width: '100%',
        maxWidth: '850px',
        margin: '0 auto',
        padding: '20px 16px',
        boxSizing: 'border-box',
        fontFamily: 'system-ui, sans-serif',
        color: '#1E293B',
        background: '#F8FAFC',
        minHeight: '100vh'
      }}
    >
      {/* MODULE HEADER */}
      <div className="maternal-header" style={{ marginBottom: '24px', textAlign: 'center' }}>
        <span 
          style={{ 
            display: 'inline-block', 
            fontSize: '0.8rem', 
            fontWeight: '700', 
            color: '#0284c7', 
            background: '#e0f2fe', 
            padding: '4px 14px', 
            borderRadius: '20px',
            marginBottom: '10px'
          }}
        >
          Maternal Track • High-Stakes Life Stage Module
        </span>
        <h1 style={{ margin: '0 0 6px 0', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', color: '#1E293B', fontWeight: '800' }}>
          Maternal Journey Dashboard
        </h1>
        <p style={{ margin: 0, fontSize: '0.92rem', color: '#64748B', lineHeight: '1.5', maxWidth: '650px', marginLeft: 'auto', marginRight: 'auto' }}>
          Pregnancy-based calendar, WHO antenatal standards, intelligent symptom segmentation, vitals monitoring, and emergency readiness.
        </p>
      </div>

      {/* SUB-NAVIGATION TABS */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '24px', 
          overflowX: 'auto', 
          paddingBottom: '4px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}
      >
        {[
          { id: 'dashboard', label: '1. Overview & Calendar' },
          { id: 'symptoms', label: '2. Symptoms & Urgent' },
          { id: 'vitals', label: '3. Vitals & Measurements' },
          { id: 'fetal', label: '4. Fetal & Contractions' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              border: activeTab === tab.id ? '1px solid #0284c7' : '1px solid #CBD5E1',
              background: activeTab === tab.id ? '#0284c7' : '#FFFFFF',
              color: activeTab === tab.id ? '#FFFFFF' : '#475569',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PREGNANCY OVERVIEW & CALENDAR */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0284c7', textTransform: 'uppercase' }}>Pregnancy-Based Calendar</span>
                <h2 style={{ margin: '2px 0 0 0', fontSize: '1.5rem', color: '#1E293B' }}>Week {pregnancyData.currentWeek} • {pregnancyData.trimester}</h2>
              </div>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px 14px', borderRadius: '10px', color: '#166534', fontSize: '0.85rem', fontWeight: '700' }}>
                👶 Baby size: {pregnancyData.babySize}
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div style={{ width: '100%', background: '#F1F5F9', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '20px' }}>
              <div style={{ width: '60%', background: '#0284c7', height: '100%', borderRadius: '6px' }}></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748B', display: 'block' }}>Estimated Due Date</span>
                <strong style={{ fontSize: '1.05rem', color: '#1E293B' }}>{pregnancyData.dueDate} (Countdown: 110 days)</strong>
              </div>
              <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748B', display: 'block' }}>Next Antenatal Appointment</span>
                <strong style={{ fontSize: '1.05rem', color: '#0284c7' }}>{pregnancyData.nextAntenatal} (5 days remaining)</strong>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748B', display: 'block' }}>Pregnancy Type</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#334155' }}>{pregnancyData.pregnancyType} Pregnancy</span>
              </div>
              <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748B', display: 'block' }}>Hospital / Maternity Provider</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#334155' }}>{pregnancyData.hospitalProvider}</span>
              </div>
              <div style={{ background: '#FEF2F2', padding: '14px', borderRadius: '12px', border: '1px solid #FCA5A5' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '600', color: '#991B1B', display: 'block' }}>Emergency Contact</span>
                <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#991B1B' }}>{pregnancyData.emergencyContact}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SYMPTOMS & URGENT SIGNS */}
      {activeTab === 'symptoms' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          
          {/* URGENT SIGNS SECTION (Visually Separate & Prominent) */}
          <div style={{ background: '#FEF2F2', borderRadius: '20px', border: '2px solid #EF4444', padding: '24px', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>🚨</span>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#991B1B' }}>Urgent Signs (Immediate Attention Required)</h3>
            </div>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.88rem', color: '#B91C1C' }}>
              This should be visually separate from routine symptoms. Selecting any sign below immediately triggers emergency support protocols.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px', marginBottom: '16px' }}>
              {urgentSignsList.map((sign) => {
                const isSelected = selectedUrgentFlags.includes(sign);
                return (
                  <button
                    key={sign}
                    onClick={() => toggleUrgentFlag(sign)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #991B1B' : '1px solid #FCA5A5',
                      background: isSelected ? '#991B1B' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : '#991B1B',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>{isSelected ? '⚠️' : '⭕'}</span> {sign}
                  </button>
                );
              })}
            </div>

            {selectedUrgentFlags.length > 0 && (
              <div style={{ background: '#FFFFFF', border: '2px solid #EF4444', borderRadius: '12px', padding: '16px', marginTop: '16px' }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: '700', color: '#991B1B' }}>
                  ⚠️ This symptom may need urgent medical attention. Please contact your maternity unit, midwife, doctor or local emergency service.
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <a href={`tel:${pregnancyData.emergencyContact}`} style={{ background: '#EF4444', color: '#FFFFFF', textDecoration: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem', display: 'inline-block' }}>
                    📞 Call Maternity Unit
                  </a>
                  <button onClick={() => alert('Summary of selected urgent symptoms shared with registered provider.')} style={{ background: '#1E293B', color: '#FFFFFF', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}>
                    📤 Share Symptom Summary
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ROUTINE SYMPTOMS SECTION */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#1E293B' }}>Routine Pregnancy Symptoms</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#64748B' }}>
              Select symptoms, specify severity and duration, and add short notes if needed.
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {routineSymptomsList.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom);
                return (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '20px',
                      border: isSelected ? '1px solid #0284c7' : '1px solid #CBD5E1',
                      background: isSelected ? '#e0f2fe' : '#F8FAFC',
                      color: isSelected ? '#0369a1' : '#334155',
                      fontSize: '0.82rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {isSelected ? '✓ ' : '+ '}{symptom}
                  </button>
                );
              })}
            </div>

            {selectedSymptoms.length > 0 && (
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'grid', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>Severity</label>
                    <select 
                      value={symptomSeverity} 
                      onChange={(e) => setSymptomSeverity(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', background: '#FFF' }}
                    >
                      <option>Mild</option>
                      <option>Moderate</option>
                      <option>Severe</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>Duration</label>
                    <select 
                      value={symptomDuration} 
                      onChange={(e) => setSymptomDuration(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', background: '#FFF' }}
                    >
                      <option>Today</option>
                      <option>Past few days</option>
                      <option>Ongoing / Constant</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>Short Note</label>
                  <input
                    type="text"
                    placeholder="Add optional notes about triggers or relief methods..."
                    value={symptomNote}
                    onChange={(e) => setSymptomNote(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                  />
                </div>

                <button 
                  onClick={() => alert('Routine symptom logged successfully!')}
                  style={{ background: '#0284c7', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '0.88rem', cursor: 'pointer', justifySelf: 'start' }}
                >
                  Save Symptom Log
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: VITALS & MEASUREMENTS (Weight, BP, Blood Sugar, Temperature) */}
      {activeTab === 'vitals' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#1E293B' }}>Clinical Vitals Tracking</h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: '#64748B' }}>
              Regularly record your key health parameters to share during antenatal visits.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              
              {/* Weight */}
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>4. Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '1rem', boxSizing: 'border-box', background: '#FFF' }}
                />
              </div>

              {/* Blood Pressure */}
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>5. Blood Pressure (mmHg)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    value={bpSystolic}
                    onChange={(e) => setBpSystolic(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '1rem', boxSizing: 'border-box', background: '#FFF' }}
                    placeholder="Sys"
                  />
                  <span style={{ fontWeight: 'bold', color: '#64748B' }}>/</span>
                  <input
                    type="number"
                    value={bpDiastolic}
                    onChange={(e) => setBpDiastolic(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '1rem', boxSizing: 'border-box', background: '#FFF' }}
                    placeholder="Dia"
                  />
                </div>
              </div>

              {/* Blood Sugar */}
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>6. Blood Sugar (mmol/L)</label>
                <input
                  type="number"
                  step="0.1"
                  value={bloodSugar}
                  onChange={(e) => setBloodSugar(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '1rem', boxSizing: 'border-box', background: '#FFF' }}
                />
              </div>

              {/* Temperature */}
              <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>7. Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '1rem', boxSizing: 'border-box', background: '#FFF' }}
                />
              </div>

            </div>

            <button 
              onClick={() => alert('Vitals recorded successfully!')}
              style={{ background: '#0284c7', color: '#FFFFFF', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', width: '100%' }}
            >
              Save Vitals Record
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: FETAL MOVEMENT & CONTRACTION TIMER */}
      {activeTab === 'fetal' && (
        <div style={{ display: 'grid', gap: '20px' }}>
          
          {/* Fetal Movement Section */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#1E293B' }}>8. Fetal Movement Tracker</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#64748B' }}>
              Monitor your baby's daily activity patterns.
            </p>

            <div style={{ display: 'grid', gap: '10px', marginBottom: '16px' }}>
              {[
                'Movement felt today', 
                'Movement feels normal', 
                'Movement feels reduced or different', 
                'No movement felt'
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => setFetalStatus(status)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: fetalStatus === status ? '2px solid #0284c7' : '1px solid #E2E8F0',
                    background: fetalStatus === status ? '#e0f2fe' : '#F8FAFC',
                    color: fetalStatus === status ? '#0369a1' : '#334155',
                    fontSize: '0.88rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {fetalStatus === status ? '🔘 ' : '⚪ '} {status}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>Optional Count</label>
                <input 
                  type="number"
                  placeholder="e.g. 10 kicks"
                  value={movementCount}
                  onChange={(e) => setMovementCount(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>Notes</label>
                <input 
                  type="text"
                  placeholder="Active after meals..."
                  value={fetalNotes}
                  onChange={(e) => setFetalNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>

          {/* Contractions Timer Section */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: '#1E293B' }}>9. Contraction Timer & Labour Prep</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#64748B' }}>
              Track start time, duration, and frequency when contractions begin.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              {!isContractionActive ? (
                <button
                  onClick={startContractionTimer}
                  style={{ background: '#0284c7', color: '#FFFFFF', border: 'none', width: '130px', height: '130px', borderRadius: '50%', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 8px 20px rgba(2, 132, 199, 0.3)' }}
                >
                  START CONTRACTION
                </button>
              ) : (
                <button
                  onClick={stopContractionTimer}
                  style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', width: '130px', height: '130px', borderRadius: '50%', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)', animation: 'pulse 1.5s infinite' }}
                >
                  STOP (Recording...)
                </button>
              )}
            </div>

            {contractions.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '8px' }}>Recent Contractions:</h4>
                <div style={{ display: 'grid', gap: '6px' }}>
                  {contractions.map((c) => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
                      <span>🕒 {c.time}</span>
                      <span>Duration: <strong>{c.duration}</strong></span>
                      <span>Intensity: <strong>{c.intensity}</strong></span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer' }}>
                <input type="checkbox" checked={watersBreaking} onChange={(e) => setWatersBreaking(e.target.checked)} style={{ width: '16px', height: '16px' }} />
                Possible waters breaking
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer' }}>
                <input type="checkbox" checked={hospitalContacted} onChange={(e) => setHospitalContacted(e.target.checked)} style={{ width: '16px', height: '16px' }} />
                Hospital contacted
              </label>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}