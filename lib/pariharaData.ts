export interface MantraInfo {
  sanskrit: string;
  transliteration: string;
  meaning: string;
  count: string;
}

export interface DeityInfo {
  primary: string;
  secondary: string[];
  aspect: string;
  iconography: string;
}

export interface PariharaInfo {
  // Lagna qualities
  qualities: string[];
  strengths: string[];
  challenges: string[];
  goodFor: string[];
  avoid: string[];

  // Spiritual
  deity: DeityInfo;
  mantra: MantraInfo;
  stotra: string; // name of recommended stotra/prayer
  vratam: string; // fasting / vrata
  tirtha: string; // sacred place / pilgrimage

  // Gemstone & remedies
  gemstone: string;
  alternateGem: string;
  metal: string;
  color: string;
  direction: string;
  day: string;

  // Parihara prayers (actual prayer text)
  pariharaPrayer: {
    tamil: string;
    sanskrit: string;
    english: string;
  };

  // Deva/Devi summary
  devaDeviNote: string;

  // Muhurta quality
  muhurtaScore: number; // 1-5
  muhurtaNote: string;
}

const PARIHARA_DATA: Record<string, PariharaInfo> = {
  Mesha: {
    qualities: ['Courageous', 'Dynamic', 'Pioneering', 'Assertive', 'Energetic'],
    strengths: ['Natural leadership', 'Physical vitality', 'Quick decision-making', 'Initiative'],
    challenges: ['Impulsiveness', 'Short temper', 'Head-related ailments', 'Accidents'],
    goodFor: ['Military & police', 'Surgery & medicine', 'Engineering', 'Athletics', 'New ventures'],
    avoid: ['Hasty decisions', 'Confrontations during Mars transit afflictions'],

    deity: {
      primary: 'Subramanya (Murugan / Karthikeya)',
      secondary: ['Mangal Deva', 'Nrusimha', 'Hanuman'],
      aspect: 'God of war, courage and victory',
      iconography: 'Six-faced youth riding peacock with Vel (spear)',
    },
    mantra: {
      sanskrit: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
      transliteration: 'Om Kraam Kreem Kraum Sah Bhaumaya Namah',
      meaning: 'Salutation to Mars (Bhuma), the red planet of energy and courage',
      count: '108 times on Tuesdays',
    },
    stotra: 'Subramanya Bhujangam (Adi Shankaracharya)',
    vratam: 'Skanda Shashthi Vratam — fast on Shashthi tithi each month',
    tirtha: 'Palani, Thiruchendur, Swamimalai (Arupadaiveedu Murugan temples)',

    gemstone: 'Red Coral (Moonga)',
    alternateGem: 'Carnelian',
    metal: 'Copper',
    color: 'Red, Coral',
    direction: 'South',
    day: 'Tuesday',

    pariharaPrayer: {
      tamil: `முருகா! வேலா! சக்தி வேலா!
எனை ஆளும் தெய்வமே — செம்பவளமே,
கோபம் தணிந்து கருணை சுரக்க வேண்டும்,
வீரம் தவறாது விவேகம் வளர வேண்டும்.
ஷண்முகனே! என் மேஷ லக்னத்தை
நலமோடு வழி நடத்திடு வாய்.`,
      sanskrit: `हे कार्तिकेय षण्मुख वेलायुध,
मेषलग्ने जातस्य मम रक्षणं कुरु।
क्रोधं शमय बुद्धिं विवर्धय,
शौर्यं च धर्मेण संयुञ्ज।।`,
      english: `O Murugan, Lord of the Vel and six faces,
Guardian of those born under Mesha lagna —
Temper my fire with wisdom and grace,
Let courage serve dharma, not haste.
Bless this native with victory in right action,
And shield from reckless harm.`,
    },
    devaDeviNote: 'Worship Lord Murugan / Subramanya on Tuesdays and Shashthi. Offer red flowers, vel, and recite Thirupugazh. Visiting Tiruttani or Palani on Shashthi is highly auspicious.',
    muhurtaScore: 4,
    muhurtaNote: 'Powerful lagna for initiating bold new ventures, medical procedures, and competitive endeavors.',
  },

  Vrishabha: {
    qualities: ['Steady', 'Sensual', 'Patient', 'Artistic', 'Determined'],
    strengths: ['Financial acumen', 'Artistic talent', 'Reliability', 'Sensory refinement'],
    challenges: ['Stubbornness', 'Overindulgence', 'Possessiveness', 'Throat ailments'],
    goodFor: ['Finance & banking', 'Arts & music', 'Agriculture', 'Luxury goods', 'Culinary arts'],
    avoid: ['Speculation during Venus affliction', 'Overindulgence in food'],

    deity: {
      primary: 'Mahalakshmi (Shri Lakshmi)',
      secondary: ['Shukra Deva', 'Gauri (Parvati)', 'Annapurna'],
      aspect: 'Goddess of wealth, beauty, and abundance',
      iconography: 'Four-armed goddess standing on lotus, holding lotus flowers, gold coins flowing',
    },
    mantra: {
      sanskrit: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः',
      transliteration: 'Om Draam Dreem Draum Sah Shukraya Namah',
      meaning: 'Salutation to Venus (Shukra), planet of beauty, love and abundance',
      count: '108 times on Fridays',
    },
    stotra: 'Sri Lakshmi Ashtottara Shatanamavali / Kanakadhara Stotram',
    vratam: 'Varalakshmi Vratam — Friday fasting and Shukravar Puja',
    tirtha: 'Thiruvanaikaval (Jambukeshwara), Kolhapur Mahalakshmi, Tirupati',

    gemstone: 'Diamond or White Sapphire',
    alternateGem: 'White Zircon, Opal',
    metal: 'Silver',
    color: 'White, Pink, Cream',
    direction: 'Southeast',
    day: 'Friday',

    pariharaPrayer: {
      tamil: `மகாலட்சுமி அம்மா! கமலவாசினி!
விருஷப லக்னத்தில் பிறந்தேன் — அருள்வாயே,
செல்வமும் சுகமும் கலையும் தருவாயே,
பேராசை தவிர்க்க புத்தி நல்குவாயே.
சிரமின்றி வாழும் வரம் தருவாயே
கமலை அம்மா — கதிர் மணியே.`,
      sanskrit: `हे महालक्ष्मि कमलासने वरदे,
वृषभलग्नजातस्य मम कल्याणं कुरु।
धनधान्यं सौभाग्यं कलां च प्रयच्छ,
लोभं निवार्य सन्तोषं ददातु भवती।।`,
      english: `O Mahalakshmi, lotus-born, radiant one —
Bestow wealth of heart and hand,
On this child of Vrishabha lagna.
Refine taste, cultivate beauty within,
Remove greed and grant contentment.
Let abundance flow in dharmic ways.`,
    },
    devaDeviNote: 'Worship Mahalakshmi and Shukra Deva on Fridays. Offer white lotus, sugarcane juice, and white sweets. Recite Kanakadhara Stotram or Sri Sukta. Avoid meat and intoxicants on Fridays.',
    muhurtaScore: 5,
    muhurtaNote: 'Excellent lagna for financial dealings, artistic works, marriages, and matters of beauty and luxury.',
  },

  Mithuna: {
    qualities: ['Intellectual', 'Communicative', 'Versatile', 'Curious', 'Witty'],
    strengths: ['Communication skills', 'Adaptability', 'Business acumen', 'Writing & oratory'],
    challenges: ['Indecisiveness', 'Nervousness', 'Inconsistency', 'Skin and nervous ailments'],
    goodFor: ['Writing & media', 'Commerce & trade', 'Teaching', 'Technology', 'Legal work'],
    avoid: ['Scatter of energy', 'Deceptive communication'],

    deity: {
      primary: 'Vishnu (as Trivikrama)',
      secondary: ['Budha Deva (Mercury)', 'Saraswati', 'Vitthala'],
      aspect: 'Preserver, lord of intellect and dharmic speech',
      iconography: 'Vishnu with conch, chakra, mace and lotus; Saraswati with veena and pustaka',
    },
    mantra: {
      sanskrit: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
      transliteration: 'Om Braam Breem Braum Sah Budhaya Namah',
      meaning: 'Salutation to Mercury (Budha), planet of intellect and communication',
      count: '108 times on Wednesdays',
    },
    stotra: 'Vishnu Sahasranama / Saraswati Stotram',
    vratam: 'Budhavar Vrata — Wednesday fast and Vishnu puja',
    tirtha: 'Srirangam, Thiruvananthapuram (Padmanabhaswamy), Guruvayur',

    gemstone: 'Emerald (Panna)',
    alternateGem: 'Green Tourmaline, Peridot',
    metal: 'Gold or Bronze',
    color: 'Green, Emerald, Grey',
    direction: 'North',
    day: 'Wednesday',

    pariharaPrayer: {
      tamil: `சரஸ்வதி அம்மா! வீணாபாணி!
மிதுன லக்னத்தினில் வந்தேன் — வழி காட்டு,
வாக்கில் வல்லமை வழங்கி அருள்வாயே,
நாவில் உண்மை நலமான சொல் நிற்கட்டும்.
புத்திர் தெளிவாக்கி பொய் அகற்றிடு
வித்யா தாயே — விமலை அருள்வாயே.`,
      sanskrit: `हे बुधदेव सरस्वति विष्णो,
मिथुनलग्नजस्य मम बुद्धिं विशोधय।
वाक्सिद्धिं मेधां व्यापारकौशलं च,
सत्यवचनं सत्कर्मणा संयुञ्ज।।`,
      english: `O Saraswati, Budha Deva, Lord Vishnu —
Purify the mind of this Mithuna native,
Grant clarity of thought and truth of speech,
Let commerce and learning serve the highest.
Remove duplicity, bless with discrimination,
That intellect may serve liberation.`,
    },
    devaDeviNote: 'Worship Saraswati and Lord Vishnu on Wednesdays. Offer green leaves (tulsi), white flowers, and recite Vishnu Sahasranama. Study and intellectual pursuits on Wednesdays are highly beneficial.',
    muhurtaScore: 4,
    muhurtaNote: 'Favorable for signing contracts, trade, communication, learning, and travel.',
  },

  Karka: {
    qualities: ['Nurturing', 'Intuitive', 'Emotional', 'Protective', 'Imaginative'],
    strengths: ['Emotional intelligence', 'Memory', 'Nurturing ability', 'Psychic sensitivity'],
    challenges: ['Moodiness', 'Over-attachment', 'Chest/digestive issues', 'Excessive worry'],
    goodFor: ['Healing professions', 'Real estate', 'Catering & hospitality', 'Psychology', 'Spiritual practice'],
    avoid: ['Emotional decision-making', 'Holding grudges', 'Excess water/fluids'],

    deity: {
      primary: 'Parvati / Durga (Uma Maheshwari)',
      secondary: ['Chandra Deva (Moon)', 'Annapurna', 'Kali'],
      aspect: 'Divine Mother, nurturing shakti and protective cosmic womb',
      iconography: 'Parvati with crescent moon, Uma seated with Shiva, or Durga riding lion',
    },
    mantra: {
      sanskrit: 'ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः',
      transliteration: 'Om Shraam Shreem Shraum Sah Chandraya Namah',
      meaning: 'Salutation to Moon (Chandra), planet of mind, emotions and motherly love',
      count: '108 times on Mondays',
    },
    stotra: 'Lalita Sahasranama / Durga Saptashati / Chandra Kavacha',
    vratam: 'Somavar Vrata — Monday fast, Pradosha observance',
    tirtha: 'Madurai Meenakshi, Kanchipuram Kamakshi, Varanasi Annapurna',

    gemstone: 'Natural Pearl (Moti)',
    alternateGem: 'Moonstone, White Coral',
    metal: 'Silver',
    color: 'White, Silver, Cream',
    direction: 'Northwest',
    day: 'Monday',

    pariharaPrayer: {
      tamil: `உமா மகேஸ்வரி! சக்தி வடிவே!
கர்க்கட லக்னத்தில் வந்தேன் — கைதூக்கு,
மன நிலை தெளிவு தருவாயே அம்மா,
மோகம் விட்டு முக்தி நோக்கி நடத்திடு.
உள்ளத்தை ஒளியால் நிரப்பி அருள்வாயே
அன்னை பராசக்தி — ஆதி அம்பிகை.`,
      sanskrit: `हे पार्वति उमे महेश्वरि जगन्मातः,
कर्कटलग्नजस्य मम मनः शोधय।
चन्द्रदोषं शमय मातृकृपां प्रयच्छ,
भक्तिमार्गे च संयोजय भवानि।।`,
      english: `O Uma, Parvati, Divine Mother of all —
Steady the restless mind of this Cancer native,
Heal old wounds, release past attachments,
Fill the heart with devotion, not longing.
Grant the gift of nurturing without losing self,
And lead this soul toward the highest shelter.`,
    },
    devaDeviNote: 'Worship Parvati/Durga and Chandra Deva on Mondays. Offer white flowers, milk, and rice. Pradosha puja is especially beneficial. Avoid fasting on Mondays in a way that depletes the body — instead offer food to the needy.',
    muhurtaScore: 3,
    muhurtaNote: 'Good for domestic matters, real estate purchase, healing, and emotional commitments. Avoid major confrontational decisions.',
  },

  Simha: {
    qualities: ['Regal', 'Generous', 'Commanding', 'Proud', 'Dramatic'],
    strengths: ['Natural authority', 'Generosity', 'Charisma', 'Leadership presence'],
    challenges: ['Pride and ego', 'Heart ailments', 'Spinal issues', 'Spending excess'],
    goodFor: ['Politics & governance', 'Administration', 'Performing arts', 'Gold trade', 'Spiritual teaching'],
    avoid: ['Arrogance', 'Confronting authority without preparation'],

    deity: {
      primary: 'Surya Narayana (Sun God)',
      secondary: ['Shiva as Bhairava', 'Nrusimha', 'Rama'],
      aspect: 'Solar divinity, cosmic king and illuminator of souls',
      iconography: 'Surya with lotus hands in chariot drawn by seven horses, or Nrusimha — lion-faced Vishnu',
    },
    mantra: {
      sanskrit: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः',
      transliteration: 'Om Hraam Hreem Hraum Sah Suryaya Namah',
      meaning: 'Salutation to the Sun (Surya), the soul of the universe and cosmic king',
      count: '108 times on Sundays at sunrise',
    },
    stotra: 'Aditya Hridayam / Surya Ashtakam / Nrusimha Kavacha',
    vratam: 'Ravi Vrata — Sunday sunrise prayer and fasting',
    tirtha: 'Konark Sun Temple, Tiruvarur, Srirangam (Surya shrine)',

    gemstone: 'Ruby (Manikya)',
    alternateGem: 'Red Garnet, Red Spinel',
    metal: 'Gold',
    color: 'Gold, Orange, Bright Red',
    direction: 'East',
    day: 'Sunday',

    pariharaPrayer: {
      tamil: `சூர்ய நாராயணா! ஆதித்யா! உலகொளியே!
சிம்ம லக்னத்தில் பிறந்தேன் — ஆசி தருவாய்,
அகங்காரம் அகல அருள் புரிவாயே,
தலைமைத்துவம் தர்மத்தோடு நிலைக்கட்டும்.
நெஞ்சில் உதயமாகும் ஞான ஒளியாய்
வந்திடு வாய் — விமல சூர்யா.`,
      sanskrit: `हे सूर्यनारायण आदित्य जगच्चक्षो,
सिंहलग्नजस्य मम आत्मानं ज्योतयस्व।
अहङ्कारं शमय ज्ञानं वर्धय,
धर्मराज्ये नेतृत्वं प्रयच्छ।।`,
      english: `O Surya, eye of the universe, golden sovereign —
Illumine the heart of this Simha native,
Dissolve vanity, preserve true dignity,
Let authority serve all, not glorify self.
Grant the warmth that heals, not the fire that scorches,
And make this soul a lamp in darkness.`,
    },
    devaDeviNote: 'Worship Lord Surya at sunrise on Sundays — offer arghya (water with red flowers toward rising sun). Recite Aditya Hridayam daily. Avoid ego-driven decisions. Service to father or elderly men is deeply protective.',
    muhurtaScore: 5,
    muhurtaNote: 'Supremely auspicious for coronations, assumption of power, gold purchase, and spiritual initiations.',
  },

  Kanya: {
    qualities: ['Analytical', 'Service-oriented', 'Precise', 'Discriminating', 'Health-conscious'],
    strengths: ['Attention to detail', 'Healing ability', 'Organizational skill', 'Humility'],
    challenges: ['Over-criticism', 'Anxiety', 'Digestive disorders', 'Perfectionism causing paralysis'],
    goodFor: ['Medicine & healing', 'Accounting & audit', 'Research', 'Writing', 'Yoga & Ayurveda'],
    avoid: ['Excessive self-criticism', 'Analysis paralysis'],

    deity: {
      primary: 'Saraswati Devi',
      secondary: ['Budha Deva', 'Vishnu as Vamana', 'Ayyappa'],
      aspect: 'Goddess of wisdom, purity, discriminative knowledge',
      iconography: 'Saraswati in white, playing veena, with swan and books',
    },
    mantra: {
      sanskrit: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः',
      transliteration: 'Om Braam Breem Braum Sah Budhaya Namah',
      meaning: 'Salutation to Mercury (Budha), lord of intellect and healing arts',
      count: '108 times on Wednesdays',
    },
    stotra: 'Saraswati Ashtakam / Sri Suktam / Vishnu Sahasranama',
    vratam: 'Saraswati Puja during Navaratri, Budhavar Vrata',
    tirtha: 'Sringeri Sharada Peetham, Basara Saraswati Temple, Koothanur',

    gemstone: 'Emerald (Panna)',
    alternateGem: 'Green Tourmaline, Jade',
    metal: 'Gold',
    color: 'Green, White, Navy',
    direction: 'North',
    day: 'Wednesday',

    pariharaPrayer: {
      tamil: `சரஸ்வதி தேவி! வித்யா தாயி! வீணாபாணி!
கன்னி லக்னத்தில் பிறந்தேன் — கரம் தாங்கு,
விமர்சனம் விட்டு விவேகம் வளர்க்கவும்
சேவையில் சித்தி சேர்க்கவும் அருள்வாயே.
குறை காணும் மனம் குணம் காண முனைய
அறிவு வேண்டும் — அம்பிகை ஆசி தருவாயே.`,
      sanskrit: `हे सरस्वति विमले वाग्देवि विद्यारूपे,
कन्यालग्नजातस्य मम शोधनं कुरु।
बुद्धेः सूक्ष्मतां सेवाभावं च वर्धय,
आत्मनिन्दां त्यजित्वा समत्वं देहि।।`,
      english: `O Saraswati, pure intellect, goddess of all learning —
Guide this Kanya native toward healing service,
Remove the thorn of excessive criticism,
That analysis may uplift, not wound.
Grant the precision of a physician's hand,
And the heart of a devoted servant.`,
    },
    devaDeviNote: 'Worship Saraswati on Wednesdays and Panchami tithis. Offer white flowers, books, and write prayers. Serve the sick or elderly as direct parihara. Maintain dietary purity — avoid impure food.',
    muhurtaScore: 3,
    muhurtaNote: 'Suitable for medical treatments, research, writing, and analytical work. Avoid major speculation.',
  },

  Tula: {
    qualities: ['Balanced', 'Diplomatic', 'Aesthetic', 'Relationship-oriented', 'Just'],
    strengths: ['Diplomacy', 'Sense of justice', 'Partnership ability', 'Artistic refinement'],
    challenges: ['Indecision', 'Dependency on others', 'Kidney issues', 'People-pleasing'],
    goodFor: ['Law & judiciary', 'Diplomacy', 'Fine arts', 'Fashion & design', 'Counseling'],
    avoid: ['Compromising truth for peace', 'Legal entanglements when Venus is weak'],

    deity: {
      primary: 'Shri Lakshmi (as Rajalakshmi / Dhanalakshmi)',
      secondary: ['Shukra Deva', 'Mitra (Vedic sun as friend)', 'Swarna Gowri'],
      aspect: 'Goddess of harmony, balance, wealth and beauty in relationships',
      iconography: 'Lakshmi with scales, or Gowri in golden attire with lotus',
    },
    mantra: {
      sanskrit: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः',
      transliteration: 'Om Draam Dreem Draum Sah Shukraya Namah',
      meaning: 'Salutation to Venus (Shukra), bestower of harmony, beauty and prosperity',
      count: '108 times on Fridays',
    },
    stotra: 'Sri Lakshmi Ashtottaram / Swarna Gowri Vrata Katha',
    vratam: 'Swarna Gowri Vratam / Varalakshmi Vratam — Friday fasting',
    tirtha: 'Kolhapur Mahalakshmi, Alathiyur Hanumankudi, Madurai Meenakshi',

    gemstone: 'Diamond or White Sapphire',
    alternateGem: 'Opal, White Zircon',
    metal: 'Silver',
    color: 'White, Pink, Light Blue',
    direction: 'Southeast',
    day: 'Friday',

    pariharaPrayer: {
      tamil: `ஸ்ரீ ராஜலக்ஷ்மி! சமத்துவ தேவி!
துலா லக்னத்தில் வந்தேன் — தூக்கி நில்லு,
தர்மத்தோடு தீர்வு காண் வழி தருவாயே,
சரியான தீர்மானம் எடுக்க சக்தி தாராயே.
உறவுகளில் உண்மை நிலைக்க அருள்வாயே
தாமரை அம்மா — தயை தருவாயே.`,
      sanskrit: `हे श्रीलक्ष्मि राजराजेश्वरि शुक्रप्रिये,
तुलालग्नजस्य मम निर्णयशक्तिं देहि।
सम्बन्धेषु सत्यं न्यायं च पालय,
सौन्दर्यं धर्मेण युक्तं कुरु।।`,
      english: `O Lakshmi, goddess of balance and refined grace —
Steady the scales within this Tula native,
Grant decisive clarity where hesitation lingers,
Let relationships be founded on truth, not comfort.
Bestow the beauty that comes from inner harmony,
And let justice and love walk hand in hand.`,
    },
    devaDeviNote: 'Worship Mahalakshmi and Shukra on Fridays. Offer pink lotus, rose water, and white sweets. Swarna Gowri Vrata is especially potent. Serve couples and support marriages as parihara for relationship blockages.',
    muhurtaScore: 4,
    muhurtaNote: 'Excellent for marriage ceremonies, legal agreements, partnerships, and diplomatic meetings.',
  },

  Vrishchika: {
    qualities: ['Intense', 'Transformative', 'Perceptive', 'Secretive', 'Powerful'],
    strengths: ['Deep insight', 'Occult knowledge', 'Crisis management', 'Regeneration'],
    challenges: ['Jealousy', 'Manipulation', 'Reproductive & urinary issues', 'Vengeance'],
    goodFor: ['Research & investigation', 'Occult & healing', 'Surgery', 'Psychology', 'Tantra & spiritual practice'],
    avoid: ['Vengeance', 'Secrecy that harms others', 'Rahu-Ketu period excesses'],

    deity: {
      primary: 'Kali Maa (Mahakali / Bhadrakali)',
      secondary: ['Mangal Deva', 'Shiva as Mahakala', 'Narasimha'],
      aspect: 'Destroyer of ego, transformer of death-rebirth cycle',
      iconography: 'Kali — dark complexion, wild hair, skull garland, sword and severed head',
    },
    mantra: {
      sanskrit: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः',
      transliteration: 'Om Kraam Kreem Kraum Sah Bhaumaya Namah',
      meaning: 'Salutation to Mars-Kuja, lord of Scorpio and protective fiery energy',
      count: '108 times on Tuesdays; also Kali mantra: Om Krim Kalikayai Namah',
    },
    stotra: 'Mahakali Stotram / Devi Mahatmyam (Durga Saptashati)',
    vratam: 'Ashtami Vrata — fasting on Ashtami (8th day of lunar month)',
    tirtha: 'Kanyakumari, Kodungallur Bhagavathi, Varanasi Kashi Vishwanath',

    gemstone: 'Red Coral (Moonga)',
    alternateGem: 'Bloodstone, Garnet',
    metal: 'Copper',
    color: 'Deep Red, Black, Dark Maroon',
    direction: 'South',
    day: 'Tuesday',

    pariharaPrayer: {
      tamil: `காளி மா! மகா காளி! பத்ரகாளி!
விருச்சிக லக்னத்தில் பிறந்தேன் — வழிகாட்டு,
இருளான எண்ணங்கள் அழித்திடு அம்மா,
பழிவாங்கும் மனம் பரிசுத்தமாகட்டும்.
மாற்றம் மட்டும் நிலையானது என்று
மனதில் ஆழமாய் பதிக்கவும் அருள்வாயே.`,
      sanskrit: `हे महाकालि भद्रकालि चण्डे,
वृश्चिकलग्नजस्य मम रूपान्तरं कुरु।
ईर्ष्यां प्रतिशोधं च नाशय,
तीव्रशक्तिं साधनाय संयोजय।।`,
      english: `O Mahakali, mother of transformation and fierce grace —
Burn the ego-poisons of this Vrishchika native,
Release jealousy, obsession, and old wounds,
Transform shadow into spiritual power.
Let the intensity that destroys become intensity that heals,
And guide this soul through death into rebirth.`,
    },
    devaDeviNote: 'Worship Kali / Bhadrakali on Tuesdays and Ashtami tithis. Offer red hibiscus, lemon, and camphor. Devi Mahatmyam recitation is the greatest protection. Tantra practices should only be approached with a genuine guru.',
    muhurtaScore: 2,
    muhurtaNote: 'Powerful for occult research and crisis intervention but inauspicious for new beginnings, marriages, and financial dealings.',
  },

  Dhanus: {
    qualities: ['Philosophical', 'Optimistic', 'Adventurous', 'Dharmic', 'Generous'],
    strengths: ['Wisdom & philosophy', 'Teaching ability', 'Optimism', 'Spiritual seeking'],
    challenges: ['Overconfidence', 'Hip/thigh issues', 'Preachiness', 'Over-expansion'],
    goodFor: ['Teaching & academia', 'Law & dharma', 'Philosophy', 'Spiritual counseling', 'Foreign travel'],
    avoid: ['Dogmatism', 'Over-promising', 'Jupiter combustion periods'],

    deity: {
      primary: 'Dakshinamurthy (Shiva as Supreme Guru)',
      secondary: ['Guru Brihaspati (Jupiter)', 'Vishnu as Vamana', 'Hayagriva'],
      aspect: 'The silent teacher — absolute wisdom in stillness',
      iconography: 'Dakshinamurthy under banyan tree, young guru with old disciples at feet',
    },
    mantra: {
      sanskrit: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',
      transliteration: 'Om Graam Greem Graum Sah Gurave Namah',
      meaning: 'Salutation to Jupiter (Guru/Brihaspati), lord of wisdom, dharma and grace',
      count: '108 times on Thursdays',
    },
    stotra: 'Dakshinamurthy Stotram (Adi Shankaracharya) / Guru Ashtakam',
    vratam: 'Guruvar Vrata — Thursday fasting and Vishnu/Guru puja',
    tirtha: 'Chidambaram Nataraja, Kanchipuram Varadharaja, Tiruvannamalai',

    gemstone: 'Yellow Sapphire (Pukhraj)',
    alternateGem: 'Yellow Topaz, Citrine',
    metal: 'Gold',
    color: 'Yellow, Orange, Gold',
    direction: 'Northeast',
    day: 'Thursday',

    pariharaPrayer: {
      tamil: `தட்சிணாமூர்த்தி! மௌன குரு! ஞான தெய்வமே!
தனுசு லக்னத்தில் பிறந்தேன் — தலை வணங்குகிறேன்,
அகந்தை இல்லா அறிவு தந்திடு,
உண்மைத் தேடல் ஒருமையில் நிறைந்திடு.
வழி காட்டும் குருவை வாழ்வில் அருள்வாயே
வட்டமர நிழலில் ஞான ஒளி தந்திடு.`,
      sanskrit: `हे दक्षिणामूर्ते मौनव्याख्यान प्रवर्तक,
धनुर्लग्नजस्य मम विद्यां प्रयच्छ।
सद्गुरुसंयोगं ज्ञानवैराग्यं च,
अहङ्कारहीनं धर्मं दर्शय।।`,
      english: `O Dakshinamurthy, the guru who teaches in silence —
Bless this Dhanus native with true wisdom,
Not merely intellectual pride but realized knowing.
Grant a worthy teacher and spiritual direction,
Let philosophy become lived dharma,
And optimism become genuine surrender.`,
    },
    devaDeviNote: 'Worship Dakshinamurthy and Brihaspati on Thursdays. Offer yellow flowers, turmeric, and chana dal. Serve teachers, Brahmins, and cows as parihara. Reading sacred texts daily is the best remedy.',
    muhurtaScore: 5,
    muhurtaNote: 'Most auspicious lagna for religious ceremonies, initiations (diksha), higher education, and long-distance travel.',
  },

  Makara: {
    qualities: ['Disciplined', 'Ambitious', 'Patient', 'Practical', 'Authoritative'],
    strengths: ['Long-term planning', 'Perseverance', 'Administrative ability', 'Karmic rectitude'],
    challenges: ['Coldness', 'Knee/bone ailments', 'Depression', 'Overwork and isolation'],
    goodFor: ['Government & administration', 'Engineering', 'Real estate', 'Long-term investments', 'Karma yoga'],
    avoid: ['Saturn transit affliction periods', 'Cold and damp environments when health is weak'],

    deity: {
      primary: 'Shani Deva (Saturn / Shanaishchara)',
      secondary: ['Hanuman', 'Bhairava', 'Ayyappa'],
      aspect: 'Lord of karma, discipline, justice and ultimate liberation through effort',
      iconography: 'Shani — dark, riding crow or vulture, with bow and arrow or oil lamp',
    },
    mantra: {
      sanskrit: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
      transliteration: 'Om Praam Preem Praum Sah Shanaishcharaya Namah',
      meaning: 'Salutation to Saturn (Shani), the slow-moving planet of karma and discipline',
      count: '108 times on Saturdays',
    },
    stotra: 'Shani Ashtakam / Hanuman Chalisa / Dasharatha Shani Stotram',
    vratam: 'Shanivar Vrata — Saturday fast and Hanuman/Shani puja',
    tirtha: 'Thirunallar Shani temple (Karaikal), Shingnapur Shani, Vaitheeswaran Koil',

    gemstone: 'Blue Sapphire (Neelam) — only after careful testing',
    alternateGem: 'Amethyst, Blue Spinel, Lapis Lazuli',
    metal: 'Iron or Steel',
    color: 'Black, Dark Blue, Indigo',
    direction: 'West',
    day: 'Saturday',

    pariharaPrayer: {
      tamil: `சனீஸ்வரா! நீதிமான்! கர்மாதிபதி!
மகர லக்னத்தில் பிறந்தேன் — மன்னித்தருள்வாய்,
கடந்த கர்மங்கள் கரைய வழி தந்திடு,
ஒழுக்கத்தில் ஒளி காண அருள்வாயே.
தனிமையில் தவிப்பை தாங்கும் உள்ளம் தருவாயே
சனி பகவானே — சாந்தி அருள்வாயே.`,
      sanskrit: `हे शनैश्चर कर्मफलदायक धर्मराज,
मकरलग्नजस्य मम कर्मशुद्धिं कुरु।
विगतजन्मकर्मदोषान् क्षमस्व,
अनुशासनेन मोक्षमार्गं प्रदर्शय।।`,
      english: `O Shani Deva, lord of karma and cosmic justice —
Release the burdens of past actions for this Makara native,
Grant patience in delay, endurance in hardship,
Let discipline become devotion, not despair.
Teach through experience without crushing the spirit,
And let slowness become the grace of deep arrival.`,
    },
    devaDeviNote: 'Worship Shani Deva on Saturdays — offer sesame oil, black sesame, and dark flowers. Visit Thirunallar temple if possible. Feeding crows and serving laborers/poor people is the most direct Shani parihara. Recite Hanuman Chalisa daily to deflect Saturn afflictions.',
    muhurtaScore: 2,
    muhurtaNote: 'Generally inauspicious for new beginnings. Suitable for long-term karmic work, infrastructure, and disciplinary pursuits.',
  },

  Kumbha: {
    qualities: ['Humanitarian', 'Independent', 'Innovative', 'Eccentric', 'Visionary'],
    strengths: ['Original thinking', 'Humanitarian impulse', 'Scientific mind', 'Group leadership'],
    challenges: ['Detachment from emotions', 'Circulatory issues', 'Eccentricity', 'Isolation'],
    goodFor: ['Social reform', 'Science & technology', 'Astrology & occult', 'NGOs', 'Inventions'],
    avoid: ['Extremism', 'Isolation from community', 'Saturn-Rahu combined afflictions'],

    deity: {
      primary: 'Shiva (as Nataraj / Maheshwara)',
      secondary: ['Shani Deva', 'Varuna (Vedic water deity)', 'Vishwakarma'],
      aspect: 'Cosmic dancer of creation and destruction, lord of revolutionary consciousness',
      iconography: 'Nataraja — dancing Shiva in ring of fire, trampling ignorance',
    },
    mantra: {
      sanskrit: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः',
      transliteration: 'Om Praam Preem Praum Sah Shanaishcharaya Namah',
      meaning: 'Salutation to Saturn/Shani, co-lord of Kumbha and liberating karma',
      count: '108 times on Saturdays; also Shiva Panchakshara: Om Namah Shivaya',
    },
    stotra: 'Shiva Tandava Stotram / Mahimna Stotram / Nataraja Stotram',
    vratam: 'Shivaratri Vrata — monthly Pradosha and annual Mahashivaratri',
    tirtha: 'Chidambaram (Nataraja), Tiruvannamalai (Arunachala), Rameswaram',

    gemstone: 'Blue Sapphire (Neelam) — after careful testing',
    alternateGem: 'Amethyst, Indigo Kyanite',
    metal: 'Iron, Lead',
    color: 'Electric Blue, Violet, Black',
    direction: 'West',
    day: 'Saturday',

    pariharaPrayer: {
      tamil: `நடராஜா! சிவனே! ஆனந்த தாண்டவா!
கும்ப லக்னத்தில் பிறந்தேன் — கணை கொண்டருள்,
புரட்சியான எண்ணங்கள் பொது நலனுக்காய் திரும்பட்டும்,
தனித்துவம் தர்மத்தோடு இணையட்டும்.
உலகின் மாற்றத்தை உள்ளில் ஏற்க
அம்பலவா! ஆசி தருவாயே.`,
      sanskrit: `हे महेश्वर नटराज सर्वसंहारक,
कुम्भलग्नजस्य मम चित्तशुद्धिं कुरु।
क्रान्तिचिन्तनं लोककल्याणाय संयोज,
विलक्षणतां धर्ममार्गेण सङ्घटय।।`,
      english: `O Nataraja, cosmic dancer in the ring of fire —
Bless this Kumbha native's revolutionary spirit,
Let eccentricity serve universal benefit,
And detachment become compassion, not coldness.
Grant vision that uplifts society,
And ground innovation in eternal dharma.`,
    },
    devaDeviNote: 'Worship Shiva on Saturdays and Pradosha. Offer bael leaves, vibhuti, and water. Mahashivaratri night vigil is the supreme parihara. Serve community, participate in collective welfare — this is the highest Kumbha remedy.',
    muhurtaScore: 3,
    muhurtaNote: 'Suitable for humanitarian endeavors, scientific research, group activities, and unconventional projects.',
  },

  Meena: {
    qualities: ['Compassionate', 'Intuitive', 'Spiritual', 'Imaginative', 'Selfless'],
    strengths: ['Spiritual depth', 'Empathy', 'Artistic vision', 'Mystical connection'],
    challenges: ['Escapism', 'Foot ailments', 'Boundaries issues', 'Addiction tendencies'],
    goodFor: ['Spiritual practice', 'Healing arts', 'Music & poetry', 'Charitable work', 'Moksha sadhana'],
    avoid: ['Escapism through substances', 'Excessive selflessness without discernment'],

    deity: {
      primary: 'Vishnu (as Vaikunthanatha / Ranganatha)',
      secondary: ['Guru Brihaspati', 'Ganga Devi', 'Annamalai Swami lineage (Ramana)'],
      aspect: 'The resting Vishnu — cosmic dream of creation, ultimate dissolution into bliss',
      iconography: 'Vishnu reclining on Adishesha serpent on cosmic ocean, Lakshmi at feet',
    },
    mantra: {
      sanskrit: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः',
      transliteration: 'Om Graam Greem Graum Sah Gurave Namah',
      meaning: 'Salutation to Jupiter (Guru), lord of Pisces, wisdom, and spiritual grace',
      count: '108 times on Thursdays; also Om Namo Narayanaya',
    },
    stotra: 'Vishnu Sahasranama / Narayana Suktam / Purusha Suktam',
    vratam: 'Ekadashi Vrata — fasting on both Ekadashis each month',
    tirtha: 'Srirangam (Ranganathar), Thiruvananthapuram (Padmanabhaswamy), Badrinath',

    gemstone: 'Yellow Sapphire (Pukhraj)',
    alternateGem: 'Yellow Topaz, Aquamarine',
    metal: 'Gold, Silver',
    color: 'Sea Green, Ocean Blue, Aqua, Violet',
    direction: 'Northeast',
    day: 'Thursday',

    pariharaPrayer: {
      tamil: `வைகுண்ட நாதா! ரங்கநாதா! அனந்தசயனா!
மீன லக்னத்தில் வந்தேன் — வழி கோலு,
கனவு மயக்கம் விட்டு கரை சேர்க்கவும்
கருணையை கட்டுப்பாட்டோடு வளர்க்கவும்.
சரணாகதி கற்றுத் தந்திடு
ஆதிசேஷன் மேல் துயிலும் அரியே.`,
      sanskrit: `हे वैकुण्ठनाथ रङ्गनाथ शेषशायिन्,
मीनलग्नजस्य मम संसारसागरं तर।
मायामोहं त्यजित्वा शरणागतिं देहि,
आध्यात्मसाधने करुणां संयुञ्ज।।`,
      english: `O Ranganatha, resting on cosmic waters —
Carry this Meena native across the ocean of illusion,
Grant discernment to the deeply feeling heart,
Let compassion have wisdom as its companion.
Dissolve the fog of escapism into clear surrender,
And guide this soul to the shore of liberation.`,
    },
    devaDeviNote: 'Worship Vishnu on Thursdays and Ekadashi. Offer tulsi leaves, yellow flowers, and milk. Ekadashi fasting with Vishnu Sahasranama is the most powerful parihara. Charity and selfless service — especially to the poor and pilgrimages — dissolves Meena obstacles rapidly.',
    muhurtaScore: 4,
    muhurtaNote: 'Auspicious for spiritual initiation, meditation retreats, moksha-oriented work, charitable giving, and artistic creation.',
  },
};

export default PARIHARA_DATA;

export function getPariharaForRasi(rasi: string): PariharaInfo | null {
  return PARIHARA_DATA[rasi] ?? null;
}
