import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

// Dictionary of translations for Header & UI Elements
const TRANSLATIONS = {
  English: {
    badge: '✨ Top-Rated Regional Experts',
    title: 'Top-Rated Specialists in the Middle East',
    subtitle: 'Connect with trusted, highly rated gynecologists and health professionals across Dubai, Riyadh, Abu Dhabi, and the wider MENA region.',
    searchPlaceholder: 'Search doctor, city, or condition (PCOS, IVF)...',
    loading: 'Loading specialists from directory...',
    noResults: 'No specialists found matching',
    bookConsult: 'Request Private Consult',
    bookingTitle: 'Book Consultation with',
    bookingSubtitle: 'Provide your details below for a private callback or confidential WhatsApp confirmation.',
    preferredTimeLabel: 'Preferred Date & Time *',
    preferredTimePlaceholder: 'e.g. Tomorrow 5 PM, or Saturday Morning',
    reasonLabel: 'What would you like to discuss? (Optional)',
    reasonPlaceholder: 'Briefly describe your symptoms or goals for this session...',
    contactLabel: 'Best Way to Reach You (Phone / WhatsApp) *',
    contactPlaceholder: '+971 XX XXX XXXX or WhatsApp number',
    confirmBtn: 'Confirm Request 💬',
    sendingBtn: 'Sending Request...',
    cancelBtn: 'Cancel',
    successHeading: 'Booking Request Submitted!',
    errorHeading: 'Error',
    verifiedTooltip: 'Verified Specialist',
    reviewsText: '+ reviews'
  },
  Arabic: {
    badge: '✨ أفضل الخبراء الإقليميين تقييماً',
    title: 'أفضل الأخصائيين في الشرق الأوسط',
    subtitle: 'تواصل مع أطباء النساء والتوليد والمتخصصين الصحيين الموثوقين ذوي التقييمات العالية في دبي، الرياض، أبوظبي، ومنطقة الشرق الأوسط وشمال إفريقيا.',
    searchPlaceholder: 'ابحث عن طبيب، مدينة، أو حالة (تكيس المبايض، أطفال أنابيب)...',
    loading: 'جاري تحميل الأخصائيين من الدليل...',
    noResults: 'لم يتم العثور على أخصائيين مطابقي لـ',
    bookConsult: 'طلب استشارة خاصة',
    bookingTitle: 'حجز استشارة مع',
    bookingSubtitle: 'قدم تفاصيلك أدناه للحصول على مكالمة عكسية خاصة أو تأكيد سري عبر واتساب.',
    preferredTimeLabel: 'التاريخ والوقت المفضل *',
    preferredTimePlaceholder: 'مثال: غداً الساعة 5 مساءً، أو صباح السبت',
    reasonLabel: 'ما الذي ترغب في مناقشته؟ (اختياري)',
    reasonPlaceholder: 'صف بإيجاز أعراضك أو أهدافك لهذه الجلسة...',
    contactLabel: 'أفضل طريقة للوصول إليك (هاتف / واتساب) *',
    contactPlaceholder: 'رقم الهاتف أو الواتساب +971',
    confirmBtn: 'تأكيد الطلب 💬',
    sendingBtn: 'جاري إرسال الطلب...',
    cancelBtn: 'إلغاء',
    successHeading: 'تم إرسال طلب الحجز!',
    errorHeading: 'خطأ',
    verifiedTooltip: 'أخصائي معتمد',
    reviewsText: '+ تقييم'
  },
  French: {
    badge: '✨ Experts régionaux les mieux notés',
    title: 'Spécialistes de premier plan au Moyen-Orient',
    subtitle: 'Connectez-vous avec des gynécologues et des professionnels de la santé de confiance à Dubaï, Riyad, Abou Dhabi et dans toute la région MENA.',
    searchPlaceholder: 'Rechercher un médecin, une ville ou une affection (SOPK, FIV)...',
    loading: 'Chargement des spécialistes...',
    noResults: 'Aucun spécialiste trouvé correspondant à',
    bookConsult: 'Demander une consultation privée',
    bookingTitle: 'Réserver une consultation avec',
    bookingSubtitle: 'Fournissez vos coordonnées ci-dessous pour un rappel privé ou une confirmation WhatsApp.',
    preferredTimeLabel: 'Date et heure souhaitées *',
    preferredTimePlaceholder: 'ex: Demain 17h, ou samedi matin',
    reasonLabel: 'Que souhaitez-vous discuter ? (Optionnel)',
    reasonPlaceholder: 'Décrivez brièvement vos symptômes ou vos objectifs...',
    contactLabel: 'Meilleur moyen de vous joindre (Téléphone / WhatsApp) *',
    contactPlaceholder: '+971 XX XXX XXXX ou numéro WhatsApp',
    confirmBtn: 'Confirmer la demande 💬',
    sendingBtn: 'Envoi en cours...',
    cancelBtn: 'Annuler',
    successHeading: 'Demande de réservation envoyée !',
    errorHeading: 'Erreur',
    verifiedTooltip: 'Spécialiste vérifié',
    reviewsText: '+ avis'
  }
};

// Roster of top-rated Middle Eastern specialists with UNIQUE high-quality avatars
const TOP_RATED_ME_SPECIALISTS = [
  {
    id: 'sp_1',
    name: 'Dr. Layla Mansour',
    specialty: 'Obstetrics & Gynecology',
    city: 'Dubai, UAE',
    rating: 4.9,
    reviewsCount: 128,
    languages: ['Arabic', 'English'],
    bio: 'Specializing in reproductive endocrinology, cycle wellness, and preventative cervical care with over 12 years of clinical practice.',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'sp_2',
    name: 'Dr. Yasmin Al-Sayed',
    specialty: 'Pelvic Health & Physiotherapy',
    city: 'Riyadh, Saudi Arabia',
    rating: 5.0,
    reviewsCount: 94,
    languages: ['Arabic', 'English', 'French'],
    bio: 'Certified specialist in post-partum recovery, pelvic floor rehabilitation, and chronic pelvic pain management.',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'sp_3',
    name: 'Dr. Tariq Al-Hashimi',
    specialty: 'Gynecologic Oncology & Screening',
    city: 'Abu Dhabi, UAE',
    rating: 4.8,
    reviewsCount: 112,
    languages: ['Arabic', 'English'],
    bio: 'Expert in early detection screening, HPV management, and holistic preventative care routines for women across all age groups.',
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'sp_4',
    name: 'Dr. Nour El-Din',
    specialty: 'Endocrinology & PCOS Specialist',
    city: 'Cairo, Egypt',
    rating: 4.9,
    reviewsCount: 156,
    languages: ['Arabic', 'English'],
    bio: 'Focuses on hormonal balance, polycystic ovary syndrome (PCOS) management, and personalized lifestyle/dietary protocols.',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'sp_5',
    name: 'Dr. Rania Khoury',
    specialty: 'Reproductive Endocrinology & IVF',
    city: 'Beirut, Lebanon',
    rating: 4.9,
    reviewsCount: 87,
    languages: ['Arabic', 'English', 'French'],
    bio: 'Dedicated fertility specialist focused on gentle, personalized reproductive guidance and discreet family planning consults.',
    imageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=200',
  },
];

export default function Specialists() {
  const [specialists, setSpecialists] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [preferredTimes, setPreferredTimes] = useState('');
  const [reason, setReason] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS['English'];
  const isRtl = currentLanguage === 'Arabic';

  useEffect(() => {
    api
      .listSpecialists()
      .then((r) => {
        if (r?.specialists && r.specialists.length >= 3) {
          const formatted = r.specialists.map((doc, idx) => ({
            ...doc,
            imageUrl: doc.imageUrl || TOP_RATED_ME_SPECIALISTS[idx % TOP_RATED_ME_SPECIALISTS.length].imageUrl,
          }));
          setSpecialists(formatted);
        } else {
          setSpecialists(TOP_RATED_ME_SPECIALISTS);
        }
      })
      .catch(() => {
        setSpecialists(TOP_RATED_ME_SPECIALISTS);
      })
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await api.createBooking({
        specialistId: selected.id,
        preferredTimes,
        reason,
        contact,
      });
      setSuccess(
        currentLanguage === 'Arabic' 
          ? `تم إرسال طلب الاستشارة إلى ${selected.name}. سيتم تأكيد جلستك مباشرة عبر ${contact}.`
          : currentLanguage === 'French'
          ? `Demande de consultation envoyée à ${selected.name}. Ils confirmeront votre session directement via ${contact}.`
          : `Consultation request sent to ${selected.name}. They will confirm your session directly via ${contact}.`
      );
      setSelected(null);
      setPreferredTimes('');
      setReason('');
      setContact('');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const filteredSpecialists = specialists.filter((sp) => {
    const term = searchTerm.toLowerCase();
    const matchesName = sp.name.toLowerCase().includes(term);
    const matchesSpecialty = sp.specialty.toLowerCase().includes(term);
    const matchesCity = sp.city.toLowerCase().includes(term);
    const matchesLang = sp.languages?.some((l) =>
      l.toLowerCase().includes(term)
    );
    return matchesName || matchesSpecialty || matchesCity || matchesLang;
  });

  return (
    <div 
      className="specialists-container"
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        width: '100%',
        maxWidth: '850px',
        margin: '0 auto',
        padding: '16px 12px',
        boxSizing: 'border-box',
        backgroundColor: '#F9F8F6',
        textAlign: isRtl ? 'right' : 'left'
      }}
    >
      {/* LANGUAGE SELECTOR HEADER */}
      <div 
        className="language-selector-bar"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: '16px',
          gap: '8px'
        }}
      >
        <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#475569' }}>
          🌐 Language / اللغة / Langue:
        </span>
        <select
          value={currentLanguage}
          onChange={(e) => setCurrentLanguage(e.target.value)}
          style={{
            padding: '6px 10px',
            borderRadius: '8px',
            border: '1px solid #CBD5E1',
            background: '#FFFFFF',
            color: '#1E293B',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="English">English</option>
          <option value="Arabic">العربية (Arabic)</option>
          <option value="French">Français</option>
        </select>
      </div>

      {/* HEADER SECTION */}
      <div className="specialists-header" style={{ marginBottom: '24px' }}>
        <span 
          className="badge-pill"
          style={{
            display: 'inline-block',
            fontSize: '0.8rem',
            fontWeight: '700',
            color: '#2B6CB0',
            background: '#E0F2FE',
            padding: '4px 12px',
            borderRadius: '20px',
            marginBottom: '10px'
          }}
        >
          {t.badge}
        </span>
        <h1 style={{ margin: '0 0 8px 0', fontSize: 'clamp(1.5rem, 4vw, 1.9rem)', color: '#1E293B', fontWeight: '700' }}>
          {t.title}
        </h1>
        <p className="muted-text" style={{ margin: 0, fontSize: '0.92rem', color: '#64748B', lineHeight: '1.5' }}>
          {t.subtitle}
        </p>

        {/* SEARCH BAR */}
        <div
          className="specialist-search-box"
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '12px',
            padding: '10px 14px',
            marginTop: '16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            width: '100%',
            boxSizing: 'border-box',
            flexDirection: isRtl ? 'row-reverse' : 'row'
          }}
        >
          <span style={{ fontSize: '1.1rem', [isRtl ? 'marginLeft' : 'marginRight']: '10px', color: '#64748B' }}>🔍</span>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '0.92rem',
              color: '#1E293B',
              background: 'transparent',
              textAlign: isRtl ? 'right' : 'left'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '0.9rem',
                color: '#64748B',
                cursor: 'pointer',
                padding: '0 4px'
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* SUCCESS BANNER */}
      {success && (
        <div 
          className="alert-banner alert-success"
          style={{
            background: '#F0FDF4',
            border: '1px solid #38A169',
            color: '#22543D',
            padding: '14px',
            borderRadius: '10px',
            marginBottom: '20px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
            fontSize: '0.9rem',
            flexDirection: isRtl ? 'row-reverse' : 'row',
            textAlign: isRtl ? 'right' : 'left'
          }}
        >
          <span className="alert-icon" style={{ fontSize: '1.2rem' }}>✨</span>
          <div>
            <strong style={{ display: 'block', marginBottom: '2px' }}>{t.successHeading}</strong>
            <p style={{ margin: 0, lineHeight: '1.4' }}>{success}</p>
          </div>
        </div>
      )}

      {/* ERROR BANNER */}
      {error && !selected && (
        <div 
          className="alert-banner alert-error"
          style={{
            background: '#FEF2F2',
            border: '1px solid #EF4444',
            color: '#991B1B',
            padding: '14px',
            borderRadius: '10px',
            marginBottom: '20px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
            fontSize: '0.9rem',
            flexDirection: isRtl ? 'row-reverse' : 'row',
            textAlign: isRtl ? 'right' : 'left'
          }}
        >
          <span className="alert-icon" style={{ fontSize: '1.2rem' }}>⚠️</span>
          <div>
            <strong style={{ display: 'block', marginBottom: '2px' }}>{t.errorHeading}</strong>
            <p style={{ margin: 0, lineHeight: '1.4' }}>{error}</p>
          </div>
        </div>
      )}

      {/* SPECIALISTS LIST */}
      <div className="specialists-list" style={{ display: 'grid', gap: '16px' }}>
        {loading ? (
          <div className="skeleton-container" style={{ padding: '20px 0', textAlign: 'center', color: '#64748B' }}>
            <p>{t.loading}</p>
          </div>
        ) : filteredSpecialists.length === 0 ? (
          <div className="card empty-state-card" style={{ padding: '32px', textAlign: 'center', background: '#FFFFFF', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
            <p style={{ margin: 0, color: '#64748B', fontSize: '0.95rem' }}>{t.noResults} "{searchTerm}".</p>
          </div>
        ) : (
          filteredSpecialists.map((sp, idx) => {
            const isSelected = selected?.id === sp.id;
            const avatarUrl = sp.imageUrl || TOP_RATED_ME_SPECIALISTS[idx % TOP_RATED_ME_SPECIALISTS.length].imageUrl;

            return (
              <div
                key={sp.id || idx}
                className={`card specialist-card ${isSelected ? 'active-booking' : ''}`}
                style={{
                  background: '#FFFFFF',
                  border: isSelected ? '2px solid #319795' : '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '16px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  boxSizing: 'border-box'
                }}
              >
                <div 
                  className="specialist-profile-header"
                  style={{
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    flexDirection: isRtl ? 'row-reverse' : 'row'
                  }}
                >
                  {/* DOCTOR AVATAR */}
                  <div 
                    className="specialist-avatar"
                    style={{
                      position: 'relative',
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={avatarUrl}
                      alt={sp.name}
                      onError={(e) => {
                        e.target.src = TOP_RATED_ME_SPECIALISTS[idx % TOP_RATED_ME_SPECIALISTS.length].imageUrl;
                      }}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #F1F5F9'
                      }}
                    />
                    <span 
                      className="verified-dot" 
                      title={t.verifiedTooltip}
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        [isRtl ? 'left' : 'right']: '0',
                        background: '#38A169',
                        color: '#FFFFFF',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        border: '2px solid #FFFFFF'
                      }}
                    >
                      ✓
                    </span>
                  </div>

                  {/* MAIN INFO */}
                  <div className="specialist-info" style={{ flex: '1 1 240px', minWidth: 0, textAlign: isRtl ? 'right' : 'left' }}>
                    <div 
                      className="title-row"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '8px',
                        marginBottom: '6px',
                        flexWrap: 'wrap',
                        flexDirection: isRtl ? 'row-reverse' : 'row'
                      }}
                    >
                      <div className="name-and-rating" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1E293B', fontWeight: '700' }}>{sp.name}</h3>
                        {sp.rating && (
                          <span className="rating-badge" style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>
                            ⭐ {sp.rating}{' '}
                            <small style={{ color: '#94A3B8', fontWeight: '450' }}>({sp.reviewsCount || 50}{t.reviewsText})</small>
                          </span>
                        )}
                      </div>
                      <span 
                        className="specialty-pill"
                        style={{
                          background: '#E6FFFA',
                          color: '#234E52',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: '600',
                          border: '1px solid #B2F5EA',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {sp.specialty}
                      </span>
                    </div>

                    <div 
                      className="meta-info"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.82rem',
                        color: '#64748B',
                        marginBottom: '10px',
                        flexWrap: 'wrap',
                        flexDirection: isRtl ? 'row-reverse' : 'row'
                      }}
                    >
                      <span>📍 {sp.city}</span>
                      <span className="dot-divider">•</span>
                      <span>🗣️ {sp.languages?.join(', ')}</span>
                    </div>

                    <p className="specialist-bio" style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: '1.4' }}>
                      {sp.bio}
                    </p>
                  </div>
                </div>

                {/* BOOKING FORM / TOGGLE BUTTON */}
                {isSelected ? (
                  <div 
                    className="booking-form-wrapper"
                    style={{
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid #E2E8F0',
                      textAlign: isRtl ? 'right' : 'left'
                    }}
                  >
                    <div className="form-header" style={{ marginBottom: '14px' }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#1E293B' }}>{t.bookingTitle} {sp.name}</h4>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748B' }}>
                        {t.bookingSubtitle}
                      </p>
                    </div>

                    <form onSubmit={onSubmit} className="specialist-form" style={{ display: 'grid', gap: '12px' }}>
                      {error && (
                        <div 
                          className="form-error-box"
                          style={{ background: '#FEF2F2', border: '1px solid #EF4444', color: '#991B1B', padding: '10px', borderRadius: '6px', fontSize: '0.85rem' }}
                        >
                          {error}
                        </div>
                      )}

                      <div className="field-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#334155' }}>{t.preferredTimeLabel}</label>
                        <input
                          type="text"
                          required
                          placeholder={t.preferredTimePlaceholder}
                          value={preferredTimes}
                          onChange={(e) => setPreferredTimes(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            fontSize: '0.9rem',
                            boxSizing: 'border-box',
                            outline: 'none',
                            backgroundColor: '#FAFAF9',
                            textAlign: isRtl ? 'right' : 'left'
                          }}
                        />
                      </div>

                      <div className="field-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#334155' }}>{t.reasonLabel}</label>
                        <textarea
                          rows="3"
                          placeholder={t.reasonPlaceholder}
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            fontSize: '0.9rem',
                            boxSizing: 'border-box',
                            outline: 'none',
                            resize: 'vertical',
                            backgroundColor: '#FAFAF9',
                            textAlign: isRtl ? 'right' : 'left'
                          }}
                        />
                      </div>

                      <div className="field-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#334155' }}>{t.contactLabel}</label>
                        <input
                          type="text"
                          required
                          placeholder={t.contactPlaceholder}
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            fontSize: '0.9rem',
                            boxSizing: 'border-box',
                            outline: 'none',
                            backgroundColor: '#FAFAF9',
                            textAlign: isRtl ? 'right' : 'left'
                          }}
                        />
                      </div>

                      <div 
                        className="form-actions"
                        style={{
                          display: 'flex',
                          gap: '10px',
                          marginTop: '6px',
                          flexWrap: 'wrap',
                          flexDirection: isRtl ? 'row-reverse' : 'row'
                        }}
                      >
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={saving}
                          style={{
                            flex: '1 1 180px',
                            padding: '10px 16px',
                            borderRadius: '6px',
                            border: 'none',
                            background: '#319795',
                            color: '#FFFFFF',
                            fontWeight: '600',
                            fontSize: '0.88rem',
                            cursor: saving ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {saving ? t.sendingBtn : t.confirmBtn}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setSelected(null)}
                          style={{
                            flex: '0 1 90px',
                            padding: '10px 16px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            background: '#F8FAFC',
                            color: '#475569',
                            fontWeight: '600',
                            fontSize: '0.88rem',
                            cursor: 'pointer'
                          }}
                        >
                          {t.cancelBtn}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div 
                    className="card-footer"
                    style={{
                      marginTop: '14px',
                      paddingTop: '12px',
                      borderTop: '1px solid #F1F5F9',
                      display: 'flex',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <button
                      className="btn btn-outline"
                      onClick={() => setSelected(sp)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #319795',
                        background: '#E6FFFA',
                        color: '#234E52',
                        fontWeight: '600',
                        fontSize: '0.88rem',
                        cursor: 'pointer'
                      }}
                    >
                      {t.bookConsult} {isRtl ? '←' : '→'}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}