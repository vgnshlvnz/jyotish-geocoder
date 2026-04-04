export interface PlanetInfo {
  englishName: string;
  nature: string;
  orbitalPeriod: string;
  represents: string;
  gemstone: string;
  color: string;
  bodyParts: string[];
  diseases: string[];
  materials: string[];
  places: string[];
  animals: string[];
  physique: string[];
  personality: string[];
}

const PLANET_DATA: Record<string, PlanetInfo> = {

  Surya: {
    englishName: 'Sun',
    nature: 'Dry, Masculine, Positive, Hot',
    orbitalPeriod: 'One year to orbit all 12 signs',
    represents: 'Father',
    gemstone: 'Ruby',
    color: 'Dark Red / Orange',
    bodyParts: [
      'Heart', 'Right eye (men)', 'Left eye (women)',
      'Mouth', 'Throat', 'Brain',
    ],
    diseases: [
      'Blood pressure', 'Haemorrhage', 'Cardiac troubles',
      'Bilious complaints in the head', 'Loss of speech',
      'Sharp fevers', 'Typhoid', 'Epilepsy', 'Sun-stroke',
      'Ailments in the head',
    ],
    materials: [
      'Gold', 'Copper', 'Wheat', 'Medicine', 'Chemicals', 'Rice',
      'Ground-nut', 'Coconut', 'Asafoetida', 'Cardamom', 'Almonds',
      'Omam', 'Pepper', 'Nutmeg', 'Aromatic herbs',
      'Thorny trees', 'Medicinal herbs',
    ],
    places: [
      'Forests', 'Mountains', 'Shiva Temples',
      'Forts', 'Government buildings',
    ],
    animals: [
      'Lion', 'Horse', 'Bear', 'Serpents', 'Cattle',
      'Forest four-legged animals', 'Singing birds',
    ],
    physique: [
      'Well-built, robust physique',
      'Average to tall height',
      'Broad chest with strong limbs',
      'Fair to wheatish complexion, golden or reddish tinge',
      'Symmetrical, well-proportioned body',
      'Sharp, prominent facial features',
      'Well-defined jawline',
      'Energetic and full of vitality',
    ],
    personality: [
      'Natural leader with charismatic personality',
      'Confident, ambitious, and self-assured',
      'Strong sense of pride and self-respect',
      'Generous and warm-hearted',
      'Honest and truthful with strong moral compass',
      'Strong sense of justice and loyalty',
      'Independent and self-reliant',
      'Action-oriented — takes charge rather than waiting',
      'Commanding presence, admired and respected by others',
      'Strong willpower and clear sense of purpose',
      'Strong ego and sense of individuality',
      'Not easily influenced by others',
      'Willing to sacrifice to achieve success and recognition',
    ],
  },

  Chandra: {
    englishName: 'Moon',
    nature: 'Wet, Cold, Feminine',
    orbitalPeriod: '27 days 8 hours around the Earth',
    represents: 'Mother',
    gemstone: 'Pearl',
    color: 'White',
    bodyParts: [
      'Left eye (men)', 'Right eye (women)',
      'Liquid system', 'Mind', 'Thought waves',
      'Uterus', 'Breast', 'Stomach', 'Spleen', 'Ovaries', 'Bladder',
      'Thyroid glands',
    ],
    diseases: [
      'Cold', 'Fever', 'Monthly periods (ladies)',
      'Breast disorders', 'Stomach complaints',
      'Uterus troubles', 'Spleen issues', 'Ovary problems',
      'Bladder ailments', 'Thyroid gland complaints',
    ],
    materials: [
      'Milk and milky products', 'Tea', 'Petrol', 'Liquids',
      'Aquatic fruits', 'Coffee', 'Cabbage', 'Roots', 'Bulbs',
      'Mushroom', 'Sugar-cane', 'Cucumber',
    ],
    places: [
      'Canals', 'Streams', 'Oceans', 'Trenches',
      'Washing ghats', 'Fisheries', 'Dairy farms', 'Sea-shores',
      'Hospitals', 'Pumping stations', 'Sewages', 'Watery places',
    ],
    animals: [
      'Worms', 'Reptiles', 'Swift creatures',
    ],
    physique: [
      'Soft and gentle physique',
      'Average height, slightly plump or round',
      'Fair complexion, pale or milky white tinge',
      'Round or oval face with soft features',
      'Well-proportioned body',
      'Sensitive constitution, prone to emotional health issues',
      'Fluctuating energy levels tied to emotional state',
    ],
    personality: [
      'Caring, compassionate, and nurturing',
      'Highly sensitive, easily influenced by environment',
      'Gentle, kind, and empathetic — good listener',
      'Strong need for emotional security and belonging',
      'Creative and imaginative',
      'Good character, honest and trustworthy',
      'Tendency towards moodiness or melancholy',
      'Cautious, may take time with decisions',
      'Prefers to work behind the scenes',
      'Self-confidence fluctuates with emotional state',
      'May struggle with self-discipline when overwhelmed',
      'Hesitant to take initiative or risks',
    ],
  },

  Kuja: {
    englishName: 'Mars',
    nature: 'Dry, Masculine',
    orbitalPeriod: 'Approx. 2 years to orbit all 12 signs',
    represents: 'Brothers and Sisters',
    gemstone: 'Coral',
    color: 'Light Red',
    bodyParts: [
      'Muscular system', 'Sex functions', 'Blood system',
      'Stomach', 'Face', 'Shoulder', 'Bladder', 'Uterus',
      'Nose', 'Pelvis', 'Kidney', 'Rectum', 'Testicles', 'Bone marrow',
    ],
    diseases: [
      'Boils', 'Short-sight', 'Fever', 'Plague',
      'Rupture of capillaries', 'Fistula', 'Brain fever',
      'Haemorrhage', 'Typhoid', 'Ulcer', 'Hernia', 'Malaria',
      'Abortion', 'Bleeding', 'Carbuncles', 'Appendicitis',
      'Tumours', 'Tetanus',
    ],
    materials: [
      'Thorny plants', 'Garlic', 'Mustard', 'Coriander',
      'Tobacco',
    ],
    places: [
      'Battlefields', 'Surgical theatres', 'Fire stations',
      'Police stations', 'Sports grounds',
    ],
    animals: [
      'Tiger', 'Wolf', 'Hunting dogs', 'Vultures', 'Hawks',
    ],
    physique: [
      'Average to tall height, muscular and athletic build',
      'Ruddy or reddish complexion, tendency to flush easily',
      'Sharp, angular features',
      'Well-defined musculature, prominent jawline or brow',
      'Strong and robust constitution, generally healthy',
      'Prone to fevers and inflammatory conditions',
      'High energy levels, restless and dynamic',
    ],
    personality: [
      'Assertive, independent, and competitive',
      'Courageous, bold, and adventurous',
      'Direct and honest, sometimes blunt',
      'Driven to achieve and conquer',
      'Quick temper and impatience',
      'Protective of those they care about',
      'Strong sense of justice',
      'Natural leader, though can be domineering',
      'Proactive and takes initiative — not afraid of challenges',
      'Can be impulsive and reckless',
      'Very strong willpower and determination',
      'Stubborn and resistant to change',
    ],
  },

  Budha: {
    englishName: 'Mercury',
    nature: 'Dry, Feminine',
    orbitalPeriod: '88 days to circle the Sun',
    represents: 'Intellect and Communication',
    gemstone: 'Emerald',
    color: 'Dark Green',
    bodyParts: [
      'Nervous system', 'Sense organs', 'Brain', 'Skin',
      'Naval', 'Neck',
    ],
    diseases: [
      'Mental trouble', 'Brain fever', 'Nervous breakdown',
      'Stammering', 'Skin diseases', 'Naval troubles',
      'Neck troubles', 'Epilepsy', 'Colic',
    ],
    materials: [
      'Medicines', 'Musical instruments', 'Precision tools',
      'Currency notes', 'Textiles', 'Green prism',
    ],
    places: [
      'Walls', 'Hills', 'Playgrounds', 'Dining rooms',
      'Nurseries', 'Gardens', 'Hotels', 'Libraries',
      'Bookshops', 'Diaries', 'Store-rooms',
    ],
    animals: [
      'Chameleon', 'Fox', 'Cunning and intelligent animals',
      'Cunning and intelligent birds',
    ],
    physique: [
      'Often average height, lean or slender physique',
      'May appear youthful',
      'Greenish or yellowish complexion, clear and bright',
      'Well-proportioned, symmetrical features',
      'Lively and expressive face',
      'Generally good constitution, prone to nervous issues',
      'High mental energy; physical energy may fluctuate',
    ],
    personality: [
      'Intellectual, curious, and communicative',
      'Adaptable and versatile',
      'Witty, intelligent, and articulate',
      'Charming and persuasive',
      'Analytical and logical in approach',
      'Can be restless and easily bored',
      'May be scattered or lack focus at times',
      'Generally honest and truthful',
      'May struggle with consistency and follow-through',
      'Takes initiative in intellectual pursuits',
      'Driven by a thirst for knowledge and communication',
      'Values intellectual autonomy and freedom of thought',
    ],
  },

  Guru: {
    englishName: 'Jupiter',
    nature: 'Fruitful, Masculine',
    orbitalPeriod: 'About 12 years to orbit all 12 signs',
    represents: 'Children (Putra Karaka), Teachers, Wisdom',
    gemstone: 'Yellow Sapphire / Topaz',
    color: 'Yellow / Golden',
    bodyParts: [
      'Liver', 'Fat', 'Marrow', 'Arteries',
    ],
    diseases: [
      'Liver complaints', 'Jaundice', 'Dropsy', 'Flatulence',
      'Dyspepsia', 'Abscess', 'Hernia', 'Skin troubles',
      'Cerebral congestion', 'Catarrh', 'Carbuncles',
    ],
    materials: [
      'Gold', 'Tin',
    ],
    places: [
      'Temples', 'Courthouses', 'Schools', 'Colleges',
      'Palaces', 'Assembly halls', 'Religious places',
    ],
    animals: [
      'Elephant', 'Horse', 'Cow', 'Owl', 'Peacock',
    ],
    physique: [
      'Average to above-average height, well-proportioned',
      'Sometimes slightly stout, majestic or dignified bearing',
      'Fair complexion, golden or yellowish tinge',
      'Broad forehead, large and expressive eyes',
      'Pleasant and benevolent facial appearance',
      'Generally strong and healthy constitution',
      'Tendency towards weight gain',
      'More intellectual and spiritual energy than physical',
    ],
    personality: [
      'Optimistic, jovial, and generous',
      'Philosophical and spiritual inclinations',
      'Warm, friendly, and approachable',
      'Wise and insightful',
      'Honest, truthful, and ethical',
      'Compassionate and kind',
      'May be preachy or dogmatic at times',
      'Approaches life with optimism and enthusiasm',
      'May be overly trusting or naive',
      'Strong moral and ethical principles',
      'Takes initiative in ethics, philosophy, and spirituality',
      'Driven by a quest for knowledge and spiritual enlightenment',
      'Finds purpose in teaching, guiding, and helping others',
    ],
  },

  Shukra: {
    englishName: 'Venus',
    nature: 'Feminine',
    orbitalPeriod: 'About 225 days to circle the Sun',
    represents: 'Marriage partner (Karaka for marriage)',
    gemstone: 'Diamond / White Sapphire',
    color: 'White / Variegated',
    bodyParts: [
      'Genital parts', 'Kidneys', 'Ovaries', 'Female organs',
      'Throat', 'Chin',
    ],
    diseases: [
      'Anaemia', 'Venereal diseases', 'Eye diseases',
      'Skin diseases', 'Joint pains', 'Ovary troubles',
      'Mucus diseases', 'Cysts', 'Over-eating troubles',
      'Nervous disorders', 'Hysteria',
    ],
    materials: [
      'Silk', 'Textiles', 'Silver', 'Copper', 'Mica',
      'Perfumery', 'Fancy goods', 'Photo-film', 'Hosiery',
      'Confectionery', 'Sandalwood oil', 'Fruits', 'Flowers',
      'Sugar', 'Automobiles', 'Musical instruments',
      'Chemicals', 'Rubber', 'Embroidery', 'Paints', 'Petrol',
      'Cotton', 'Jasmine', 'Nutmeg', 'Condiments',
    ],
    places: [
      'Bedrooms', 'Dancing halls', 'Cinema theatres',
      'Gardens', 'Nurseries', 'Auto factories',
      'Silk and rayon factories', 'Glass and mica factories',
    ],
    animals: [
      'Panther', 'Bulls', 'Cows', 'Buffaloes', 'Goats',
      'Dove', 'Peacock', 'Sparrow',
    ],
    physique: [
      'Often average height, graceful and well-proportioned',
      'Pleasing physique',
      'Fair complexion, rosy or glowing undertone',
      'Attractive and symmetrical features',
      'Charming smile and expressive eyes',
      'Moderate energy levels',
      'More inclined towards leisure than strenuous activity',
    ],
    personality: [
      'Artistic, creative, and romantic',
      'Enjoys beauty, luxury, and comfort',
      'Charming, sociable, and diplomatic',
      'Kind, compassionate, and loving',
      'Seeks harmony and avoids conflict',
      'Can be vain or materialistic',
      'Appreciates beauty and art',
      'Diplomatic and tactful',
      'May be passive or lack assertiveness',
      'May be easily influenced',
      'Can be tempted by pleasures and indulgences',
      'Finds purpose in creating beauty and spreading joy',
      'Willpower fluctuates with emotional state and desires',
    ],
  },

  Shani: {
    englishName: 'Saturn',
    nature: 'Barren, Wet, Cold, Eunuch',
    orbitalPeriod: 'About 29½ years to circle the Sun',
    represents: 'Longevity, Karma, Discipline',
    gemstone: 'Blue Sapphire / Prism Violet',
    color: 'Dark Blue / Black',
    bodyParts: [
      'Bones', 'Hair', 'Ears', 'Teeth',
      'Pneumogastric nerve',
    ],
    diseases: [
      'Lymphatic troubles', 'Excretory system disorders',
      'Hardening of membranes', 'Toothache', 'Small-pox',
      'Deafness', 'Diphtheria', 'Asthma', 'Tuberculosis',
      'Stammering', 'Paralysis', 'Vomiting', 'Impotency',
      'Cancer', 'Cardiac trouble', 'Gout', 'Baldness', 'Leprosy',
    ],
    materials: [
      'Lead', 'Kerosene', 'Petrol', 'Coal', 'Ores', 'Cement',
      'Leather', 'Wood', 'Hair', 'Wool', 'Black stone', 'Jute',
      'Gingelly oil', 'Banana', 'Potato', 'Black grains', 'Barley',
    ],
    places: [
      'Valleys', 'Hills', 'Forests', 'Caves', 'Deserts',
      'Dense old buildings', 'Churches', 'Temples', 'Wells',
      'Trenches', 'Slums', 'Saloons', 'Tanneries',
      'Bone and metal factories',
    ],
    animals: [
      'Buffaloes', 'Elephants', 'Mules', 'Horses', 'Dogs',
      'Goats', 'Cows', 'Birds',
    ],
    physique: [
      'Often average or slightly shorter height',
      'Lean and wiry build',
      'May appear older than actual age',
      'Darkish or dusky complexion',
      'Sharp, angular features',
      'Serious or melancholic expression',
      'Energy levels low or inconsistent',
      'Periods of fatigue or lethargy',
    ],
    personality: [
      'Reserved, disciplined, and hardworking',
      'Responsible, reliable, and dependable',
      'Strong sense of duty and justice',
      'Patient and persevering in the face of obstacles',
      'Values tradition and stability',
      'Can be pessimistic or overly serious',
      'May be introverted, shy, or emotionally repressed',
      'Cautious and methodical in approach',
      'May be overly critical or judgmental',
      'Slow to start but determined to finish',
      'Can be inflexible or resistant to change',
      'Resilient — driven by need for security and recognition',
      'Very strong willpower in fulfilling duties and obligations',
    ],
  },

  Rahu: {
    englishName: 'Rahu (North Node)',
    nature: 'Shadow Planet, Ascending Node, Anti-clockwise motion',
    orbitalPeriod: 'Completes cycle in ~18 years; always opposite Ketu',
    represents: 'Paternal grandfather, Worldly ambitions, Foreign connections',
    gemstone: 'Gomedh (Hessonite Garnet)',
    color: 'Smoky / Dark',
    bodyParts: [
      'Spleen',
    ],
    diseases: [
      'Severe pain', 'Gas trouble', 'Spleen disorders',
      'Mysterious or difficult-to-diagnose ailments',
    ],
    materials: [
      'Black gram',
    ],
    places: [
      'Dark places', 'Caves', 'Tunnels',
    ],
    animals: [
      'Snakes', 'Monkey', 'Wolf', 'Camel',
      'Poisonous insects', 'Mosquito', 'Bugs', 'Virus', 'Bacteria',
    ],
    physique: [
      'Can vary widely — sometimes tall and imposing',
      'Often dusky or darkish complexion',
      'Striking or unusual appearance',
      'Distinctive facial features',
      'Erratic energy — sometimes very high, sometimes very low',
    ],
    personality: [
      'Ambitious, materialistic, and unconventional',
      'Charismatic, magnetic, and unpredictable',
      'Drawn to foreign cultures and the unknown',
      'Resourceful and adaptable',
      'Can be manipulative or deceptive at times',
      'Rebellious and non-conformist',
      'Strong desire for recognition and power',
      'May take unconventional paths to success',
      'Can be very loyal and devoted to those they care about',
      'Complex and multifaceted — dual nature',
      'Very decisive and action-oriented when pursuing ambitions',
      'Very strong-willed when pursuing goals',
    ],
  },

  Ketu: {
    englishName: 'Ketu (South Node)',
    nature: 'Shadow Planet, Descending Node, Anti-clockwise motion',
    orbitalPeriod: 'Completes cycle in ~18 years; always opposite Rahu',
    represents: 'Maternal grandfather, Past karma, Spiritual liberation',
    gemstone: 'Vaidooryam (Cat\'s Eye / Chrysoberyl)',
    color: 'Smoky Grey / Multi-coloured',
    bodyParts: [
      'Spleen',
    ],
    diseases: [
      'Severe pain', 'Gas trouble', 'Spleen disorders',
      'Sudden and unexpected ailments',
    ],
    materials: [
      'Horse gram',
    ],
    places: [
      'Dark places', 'Caves', 'Tunnels', 'Secluded environments',
    ],
    animals: [
      'Snakes', 'Monkey', 'Wolf', 'Camel',
      'Poisonous insects', 'Mosquito', 'Bugs',
    ],
    physique: [
      'Often leans towards a lean or thin build',
      'May not be very tall',
      'Often smoky or grayish complexion',
      'Unusual or distinct appearance',
      'Sharp or pointed facial features',
      'Fluctuating or low energy levels',
      'Periods of lethargy or lack of motivation',
    ],
    personality: [
      'Detached, introspective, and spiritual',
      'Strong interest in occult, philosophy, and mysticism',
      'Quiet, reserved, and sometimes mysterious',
      'Insightful and perceptive',
      'Emotionally withdrawn or isolated at times',
      'Very honest and truthful',
      'Strong unconventional sense of morality',
      'May experience sudden, unexpected life changes',
      'Seeks identity through spiritual or philosophical exploration',
      'May lack initiative in worldly matters',
      'Prefers to work behind the scenes or in isolation',
      'Strong willpower in spiritual pursuits',
      'Can be indecisive or lack direction in material matters',
    ],
  },

};

export default PLANET_DATA;
