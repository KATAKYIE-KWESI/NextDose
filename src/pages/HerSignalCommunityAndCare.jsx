import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Bilingual & RTL dictionary strings
const contentStrings = {
  en: {
    heroTitle: "Your Safe Space & Community Care Hub",
    heroSubtitle: "Ask questions anonymously, connect with women on similar journeys, and stay proactive with early health detection guides.",
    tabAnonymous: "Anonymous Safe Space",
    tabCommunity: "Community Circles",
    tabScreening: "Early Detection & Care",
    anonHeading: "Ask Privately & Anonymously",
    anonSub: "Your identity is completely encrypted and shielded. Ask anything without hesitation.",
    questionPlaceholder: "What's on your mind? (e.g., unusual cycle changes, breast tenderness, intimate health...)",
    submitQuestion: "Post Anonymously",
    recentVault: "Recent Community Whispers & Questions",
    communityHeading: "Life Stage Support Circles",
    communitySub: "Find solidarity, advice, and shared experiences from women walking your exact path.",
    joinCircle: "Join Circle",
    joinedCircle: "Connected",
    screeningHeading: "Early Detection & Breast Health Guide",
    screeningSub: "Proactive care saves lives. Learn monthly self-examination steps and log your health checks.",
    stepTitle: "Monthly Self-Examination Checklist",
    markDone: "Mark Check Completed",
    completedBadge: "Checked This Month"
  },
  ar: {
    heroTitle: "مساحتك الآمنة ومجتمع الرعاية",
    heroSubtitle: "اطرحي الأسئلة بشكل مجهول، وتواصلي مع النساء في رحلات مشابهة، وابقي استباقية مع دليلك للكشف المبكر.",
    tabAnonymous: "مساحة آمنة مجهولة",
    tabCommunity: "دوائر المجتمع",
    tabScreening: "الكشف المبكر والعناية",
    anonHeading: "اسألي بسرية وخصوصية تامة",
    anonSub: "هويتك مشفرة ومحمية بالكامل. اطرحي أي سؤال دون تردد.",
    questionPlaceholder: "ما الذي يدور في ذهنك؟ (مثلاً: تغيرات الدورة الشهرية، ألم الثدي، صحة النساء...)",
    submitQuestion: "نشر بشكل مجهول",
    recentVault: "أحدث الهمسات والأسئلة المجتمعية",
    communityHeading: "دوائر دعم المراحل العمرية",
    communitySub: "اعثري على التضامن والنصائح والخبرات المشتركة من نساء يمشين على نفس دربك.",
    joinCircle: "انضمامي للائرة",
    joinedCircle: "متصلة",
    screeningHeading: "الكشف المبكر ودليل صحة الثدي",
    screeningSub: "الرعاية الاستباقية تنقذ الأرواح. تعلمي خطوات الفحص الذاتي الشهري وسجلي فحوصاتك.",
    stepTitle: "قائمة الفحص الذاتي الشهري",
    markDone: "تحديد الفحص مكتمل",
    completedBadge: "تم الفحص هذا الشهر"
  },
  fr: {
    heroTitle: "Votre espace sécurisé et pôle de soins communautaires",
    heroSubtitle: "Posez des questions anonymement, connectez-vous avec des femmes partageant des parcours similaires et restez proactive.",
    tabAnonymous: "Espace Anonyme Sécurisé",
    tabCommunity: "Cercles Communautaires",
    tabScreening: "Détection Précoce & Soins",
    anonHeading: "Posez vos questions en toute confidentialité",
    anonSub: "Votre identité est totalement cryptée et protégée. Posez vos questions sans hésitation.",
    questionPlaceholder: "À quoi pensez-vous ? (ex: changements de cycle, sensibilité des seins, santé intime...)",
    submitQuestion: "Publier Anonymement",
    recentVault: "Questions et murmures récents de la communauté",
    communityHeading: "Cercles de soutien par étape de vie",
    communitySub: "Trouvez solidarité, conseils et expériences partagées.",
    joinCircle: "Rejoindre le cercle",
    joinedCircle: "Connectée",
    screeningHeading: "Guide de détection précoce et santé du sein",
    screeningSub: "Les soins proactifs sauvent des vies. Apprenez les étapes d'auto-examen mensuel.",
    stepTitle: "Liste de contrôle d'auto-examen mensuel",
    markDone: "Marquer comme complété",
    completedBadge: "Vérifié ce mois-ci"
  },
  darija: {
    heroTitle: "المساحة الآمنة ديالك ومجموعة العناية",
    heroSubtitle: "سروحي أسئلتك بلا ما تباني، وتصلي بنساء غاديين ف نفس الطريق، وبقاي متيقظة بصحة مزيانة.",
    tabAnonymous: "مساحة خاصة ومجهولة",
    tabCommunity: "دوائر الجماعة",
    tabScreening: "الكشف المبكر والعناية",
    anonHeading: "سصُلي أو سألي بكل سرية",
    anonSub: "هويتك محمية ومشفرة مزيان. سألي على لي بغيتي بلا حشمة.",
    questionPlaceholder: "شنو فبالك؟ (مثلا: تبدلات فالدورة، وجع فالثدي، صحة شخصية...)",
    submitQuestion: "نشر بشكل سري",
    recentVault: "آخر الأسئلة والهمسات دالمجتمع",
    communityHeading: "دوائر الدعم حسب المراحل ديال الحياة",
    communitySub: "لقي التضامن، النصائح، والخبرات المشتركة مع نساء فحالك.",
    joinCircle: "دخلي للدائرة",
    joinedCircle: "متصلة",
    screeningHeading: "دليل الكشف المبكر وصحة الثدي",
    screeningSub: "العناية المبكرة كتنقذ الحياة. تعلّمي خطوات الفحص الذاتي.",
    stepTitle: "قائمة الفحص الذاتي الشهري",
    markDone: "تسجيل الفحص كمل",
    completedBadge: "مفحوص هاد الشهر"
  }
};

export default function HerSignalCommunityAndCare({ currentLang }) {
  // Prefer the live app-wide language; `currentLang` prop is only used if a
  // parent explicitly wants to override it (e.g. for a preview/demo view).
  const { language } = useLanguage();
  const activeLang = currentLang || language;

  const [activeTab, setActiveTab] = useState('anonymous');
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState([
    { id: 1, text: "Is it normal to experience mild spotting two weeks after my cycle during high stress periods?", replies: 5, time: "2 hours ago" },
    { id: 2, text: "Looking for recommendations or shared experiences on managing intense hormonal migraines naturally.", replies: 12, time: "Yesterday" }
  ]);
  
  const [circles, setCircles] = useState([
    { id: 1, name: "First-Time Expecting Mums", members: 1420, joined: false, desc: "Navigating trimester changes, kicks, and early nesting together." },
    { id: 2, name: "PCOS & Cycle Warriors", members: 3100, joined: true, desc: "A safe zone for managing insulin resistance, hirsutism, and regular cycles." },
    { id: 3, name: "Breast Health & Early Awareness", members: 890, joined: false, desc: "Empowering each other with monthly checks, screening tips, and professional guidance." }
  ]);

  const [screeningSteps, setScreeningSteps] = useState([
    { id: 1, title: "Visual Inspection in Front of Mirror", desc: "Check for symmetry, skin dimpling, or unusual contour changes with hands on hips.", completed: false },
    { id: 2, title: "Raised Arm Examination", desc: "Raise arms overhead and check for any structural changes or surface dimpling.", completed: false },
    { id: 3, title: "Circular Palpation Pattern", desc: "Using the pads of your three middle fingers, move in small dime-sized circles across the entire breast tissue.", completed: false }
  ]);

  const t = contentStrings[activeLang] || contentStrings.en;
  const isRTL = activeLang === 'ar' || activeLang === 'darija';

  const handlePostQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setQuestions([{ id: Date.now(), text: newQuestion, replies: 0, time: "Just now" }, ...questions]);
    setNewQuestion('');
  };

  const toggleCircle = (id) => {
    setCircles(circles.map(c => c.id === id ? { ...c, joined: !c.joined } : c));
  };

  const toggleScreeningStep = (id) => {
    setScreeningSteps(screeningSteps.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} style={{ padding: '24px 16px', maxWidth: '1000px', margin: '0 auto', boxSizing: 'border-box' }}>
      
      {/* Hero Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
        borderRadius: '16px',
        padding: '32px 24px',
        color: '#FFFFFF',
        marginBottom: '24px',
        boxShadow: '0 10px 25px rgba(14, 165, 233, 0.15)'
      }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '8px', marginTop: 0 }}>{t.heroTitle}</h1>
        <p style={{ fontSize: '0.95rem', opacity: 0.9, maxWidth: '700px', lineHeight: '1.5', margin: 0 }}>{t.heroSubtitle}</p>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', overflowX: 'auto' }}>
        <button 
          onClick={() => setActiveTab('anonymous')}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'anonymous' ? '#0EA5E9' : '#F1F5F9',
            color: activeTab === 'anonymous' ? '#FFFFFF' : '#334155',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s'
          }}
        >
          {t.tabAnonymous}
        </button>

        <button 
          onClick={() => setActiveTab('community')}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'community' ? '#0EA5E9' : '#F1F5F9',
            color: activeTab === 'community' ? '#FFFFFF' : '#334155',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s'
          }}
        >
          {t.tabCommunity}
        </button>

        <button 
          onClick={() => setActiveTab('screening')}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'screening' ? '#0EA5E9' : '#F1F5F9',
            color: activeTab === 'screening' ? '#FFFFFF' : '#334155',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.9rem',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s'
          }}
        >
          {t.tabScreening}
        </button>
      </div>

      {/* TAB 1: ANONYMOUS SAFE SPACE */}
      {activeTab === 'anonymous' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#0F172A' }}>{t.anonHeading}</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#64748B' }}>{t.anonSub}</p>
            
            <form onSubmit={handlePostQuestion}>
              <textarea 
                rows="3"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder={t.questionPlaceholder}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  marginBottom: '12px',
                  fontFamily: 'inherit'
                }}
              />
              <button 
                type="submit"
                style={{
                  background: '#0EA5E9',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                {t.submitQuestion}
              </button>
            </form>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', color: '#334155', marginBottom: '12px' }}>{t.recentVault}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {questions.map((q) => (
                <div key={q.id} style={{ background: '#FFFFFF', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#1E293B', fontWeight: '500' }}>🔒 {q.text}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B' }}>
                    <span>{q.time}</span>
                    <span>💬 {q.replies} supportive replies</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMMUNITY CIRCLES */}
      {activeTab === 'community' && (
        <div>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#0F172A' }}>{t.communityHeading}</h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: '#64748B' }}>{t.communitySub}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {circles.map((circle) => (
              <div key={circle.id} style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', color: '#0F172A' }}>{circle.name}</h4>
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#64748B', lineHeight: '1.4' }}>{circle.desc}</p>
                  <span style={{ fontSize: '0.75rem', color: '#0EA5E9', fontWeight: '600' }}>👥 {circle.members} women connected</span>
                </div>
                <button 
                  onClick={() => toggleCircle(circle.id)}
                  style={{
                    marginTop: '16px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: circle.joined ? '1px solid #CBD5E1' : 'none',
                    background: circle.joined ? '#F1F5F9' : '#0EA5E9',
                    color: circle.joined ? '#334155' : '#FFFFFF',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    width: '100%'
                  }}
                >
                  {circle.joined ? `✓ ${t.joinedCircle}` : t.joinCircle}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EARLY DETECTION & CARE */}
      {activeTab === 'screening' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#0F172A' }}>{t.screeningHeading}</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#64748B' }}>{t.screeningSub}</p>

            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0369A1' }}>💡 Clinical Note</span>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#334155', lineHeight: '1.4' }}>
                Performing a monthly check 3 to 5 days after your period starts helps ensure your breasts are not tender or swollen. Early detection increases treatment success rates significantly.
              </p>
            </div>

            <h4 style={{ fontSize: '1rem', color: '#1E293B', marginBottom: '12px' }}>{t.stepTitle}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {screeningSteps.map((step) => (
                <div key={step.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: step.completed ? '#F0FDF4' : '#FFFFFF', borderRadius: '8px', border: `1px solid ${step.completed ? '#86EFAC' : '#E2E8F0'}` }}>
                  <div>
                    <h5 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: '#0F172A' }}>{step.title}</h5>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>{step.desc}</p>
                  </div>
                  <button 
                    onClick={() => toggleScreeningStep(step.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      background: step.completed ? '#22C55E' : '#E2E8F0',
                      color: step.completed ? '#FFFFFF' : '#334155',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {step.completed ? t.completedBadge : t.markDone}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}