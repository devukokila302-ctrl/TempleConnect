// server/app.ts
import express from "express";

// server/templesData.ts
var initialTemples = [
  // 1. Tirupati (Sri Venkateswara Swamy Temple)
  {
    id: "temple-tirupati",
    name: "Sri Venkateswara Swamy Temple (Tirumala)",
    deity: "Lord Venkateswara (Govinda / Balaji / Srinivasa)",
    city: "Tirumala, Tirupati",
    state: "Andhra Pradesh",
    address: "S Mada St, Tirumala, Tirupati, Andhra Pradesh 517504",
    lat: 13.6833,
    lng: 79.3472,
    description: "The world-renowned Kaliyuga Vaikuntha temple dedicated to Lord Venkateswara atop the seven sacred peaks of Seshachalam Hills.",
    history: "Ancient Vaishnava Divya Kshetra mentioned in Sangam works and Rigvedic verses. Extensively patronized by the Pallavas, Cholas, Pandyas, and Vijayanagara emperor Sri Krishnadevaraya, who offered his crowns and gold to the Lord.",
    timings: {
      morning: "03:00 AM \u2013 11:30 AM",
      evening: "12:00 PM \u2013 11:30 PM (Ekantha Seva at midnight)",
      notes: "Suprabhatam begins at 03:00 AM. Sarva Darshan queues operate continuously through Vaikuntam Queue Complex.",
      specialDays: "Salakatla & Navaratri Brahmotsavams feature 24-hour continuous darshan."
    },
    pujas: [
      { id: "p-t1", name: "Suprabhata Seva", timing: "03:00 AM", significance: "Morning awakening prayer to Lord Venkateswara in the sanctum", fee: "\u20B9120" },
      { id: "p-t2", name: "Thomala Seva", timing: "03:45 AM", significance: "Adorning the deity with fragrant sacred flower garlands", fee: "\u20B9220" },
      { id: "p-t3", name: "Sahasranamarchana", timing: "04:45 AM", significance: "Recitation of 1,008 divine names with Tulasi leaves", fee: "\u20B9220" },
      { id: "p-t4", name: "Kalyanotsavam", timing: "11:00 AM", significance: "Grand celestial wedding ceremony of Sri Malayappa Swamy with Sridevi and Bhudevi", fee: "\u20B91,000" },
      { id: "p-t5", name: "Sahastra Deepalankara Seva", timing: "05:30 PM", significance: "Procession and swing seva amidst 1,000 lit ghee lamps outside the temple", fee: "\u20B9500" }
    ],
    contact: {
      phone: "+91 877 2277777",
      email: "helpdesk@tirumala.org",
      website: "https://ttdevasthanams.ap.gov.in",
      trusteeContact: "TTD Executive Officer Administrative Building, K.T. Road, Tirupati"
    },
    photos: [
      "/images/temples/temple-tirupati.jpg"
    ],
    status: "representative_verified",
    claimStatus: "claimed",
    contributors: [],
    events: [
      {
        id: "ev-t1",
        title: "Srivari Salakatla Brahmotsavam",
        date: "2026-09-28",
        time: "08:00 AM",
        description: "Nine-day annual festival featuring Garuda Seva, Rathotsavam, and sacred Chakra Snanam."
      },
      {
        id: "ev-t2",
        title: "Vaikunta Ekadasi Uttara Dwara Darshanam",
        date: "2026-12-21",
        time: "04:00 AM",
        description: "Pilgrims pass through the sacred Vaikunta Dwaram for the special 10-day period."
      }
    ],
    dressCode: "Strict traditional dress code enforced. Men: Dhoti with Kurta or Melchattai (shirtless with angavastram preferred). Women: Saree or Half-Saree or Churidar with Dupatta. Jeans, shorts, and T-shirts strictly prohibited.",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z"
  },
  // 2. Vijayawada Kanaka Durga Ammavaru
  {
    id: "temple-vijayawada-kanakadurgamma",
    name: "Sri Durga Malleswara Swamy Varla Devasthanam (Kanaka Durga Temple)",
    deity: "Goddess Kanaka Durga (Swayambhu Mahishasuramardini) & Sri Malleswara Swamy",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    address: "Indrakeeladri Hill, Mallikarjunapeta, Vijayawada, Andhra Pradesh 520001",
    lat: 16.5162,
    lng: 80.6067,
    description: "The celebrated Shakta kshetra perched on the sacred Indrakeeladri hill overlooking the river Krishna, where Mother Kanaka Durga resides as Swayambhu.",
    history: "Sthala puranam reveals that Arjuna performed intense penance on Indrakeeladri hill to propitiate Lord Shiva and attained the Pasupatastra. Sage Indrakeela meditated here to host the Mother Goddess. Adi Shankaracharya visited the temple and consecrated the auspicious Sri Chakra Yantra to pacify her fiery form.",
    timings: {
      morning: "04:00 AM \u2013 12:30 PM",
      evening: "01:30 PM \u2013 09:30 PM",
      notes: "Continuous Sarva Darshan open throughout the day. Temple opens early at 03:00 AM during Navaratri.",
      specialDays: "Dasara Sharannavaratri and Bhavani Deeksha Viramana witness 24-hour special darshan lanes."
    },
    pujas: [
      { id: "p-kd1", name: "Suprabhata Seva", timing: "04:00 AM", significance: "Morning awakening prayer and Mangala Harathi", fee: "\u20B9100" },
      { id: "p-kd2", name: "Khadgamala Archana", timing: "06:00 AM", significance: "Sacred Shakta hymn chanting with vermilion (kumkum)", fee: "\u20B9250" },
      { id: "p-kd3", name: "Kumkumarchana", timing: "07:00 AM \u2013 06:00 PM", significance: "Devotees participate in individual kumkuma archana to Ammavaru", fee: "\u20B9300" },
      { id: "p-kd4", name: "Sri Chandi Homam", timing: "08:30 AM", significance: "Grand sacrificial fire ritual invoking Durga Saptashati for prosperity and protection", fee: "\u20B91,500" },
      { id: "p-kd5", name: "Nitya Kalyanam", timing: "09:30 AM", significance: "Celestial wedding of Sri Malleswara Swamy and Kanaka Durga Devi", fee: "\u20B91,000" },
      { id: "p-kd6", name: "Maha Harathi", timing: "09:00 PM", significance: "Solemn night concluding aarti and pushpanjali", fee: "Free" }
    ],
    contact: {
      phone: "+91 866 2423600",
      email: "eo_kanakadurgamma@yahoo.co.in",
      website: "https://kanakadurgamma.org",
      trusteeContact: "Executive Officer Office, Indrakeeladri Devasthanam, Vijayawada"
    },
    photos: [
      "/images/temples/temple-vijayawada-kanakadurgamma.jpg"
    ],
    status: "representative_verified",
    claimStatus: "claimed",
    contributors: [],
    events: [
      {
        id: "ev-kd1",
        title: "Dasara Sharannavaratri Mahotsavam",
        date: "2026-10-10",
        time: "04:00 AM",
        description: "Ten days of distinct divine alankarams of Ammavaru culminating in the Krishna River Teppotsavam with the celestial Hamsa Vahanam."
      },
      {
        id: "ev-kd2",
        title: "Bhavani Deeksha Viramana",
        date: "2026-12-28",
        time: "05:00 AM",
        description: "Lakhs of Bhavani devotees wearing red robes congregate to offer Irumudi at the sanctum."
      }
    ],
    dressCode: "Strict traditional Indian attire: Dhoti or Kurta-Pyjama for men; Saree, Half-Saree, or Chudidar with Dupatta for women. Shorts, mini-skirts, and sleeveless tops not permitted.",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z"
  },
  // 3. Arunachalam (Arulmigu Arunachaleswarar Temple)
  {
    id: "temple-arunachalam",
    name: "Arulmigu Arunachaleswarar Temple (Arunachalam / Annamalaiyar)",
    deity: "Lord Arunachaleswarar (Agni Lingam) & Goddess Unnamalai Amman (Apeethakuchambal)",
    city: "Thiruvannamalai",
    state: "Tamil Nadu",
    address: "Pavazhakundur, Thiruvannamalai, Tamil Nadu 606601",
    lat: 12.2253,
    lng: 79.0677,
    description: "One of the five sacred Pancha Bhoota Sthalams representing Fire (Agni). The magnificent 25-acre complex lies at the foot of Mount Arunachala, revered as the Shiva Lingam itself.",
    history: "Celebrated in the hymns of the Shaivite Nayanars. Sthala purana states Lord Shiva appeared as a boundless pillar of blazing light (Jyotirlinga) when Brahma and Vishnu vied for superiority. Consecrated center of Sri Ramana Maharshi and Saint Arunagirinathar.",
    timings: {
      morning: "05:30 AM \u2013 12:30 PM",
      evening: "03:30 PM \u2013 09:30 PM",
      notes: "Sanctum closes between 12:30 PM and 03:30 PM. Pournami Girivalam pathway around the 14-km hill is open 24 hours."
    },
    pujas: [
      { id: "p-ar1", name: "Ushakkala Puja", timing: "06:00 AM", significance: "Dawn abhishekam and arati to the Agni Lingam", fee: "Free" },
      { id: "p-ar2", name: "Kalasandhi Puja", timing: "08:00 AM", significance: "Morning archana with sacred bilva leaves", fee: "\u20B950" },
      { id: "p-ar3", name: "Uchikala Puja", timing: "11:30 AM", significance: "Midday grand naivedyam and arati", fee: "\u20B950" },
      { id: "p-ar4", name: "Sayaratchai Puja", timing: "06:00 PM", significance: "Dusk deeparadhana with traditional nadaswaram recital", fee: "\u20B9100" },
      { id: "p-ar5", name: "Arthajama Puja", timing: "09:00 PM", significance: "Night closing puja and palliarai seva", fee: "\u20B9100" }
    ],
    contact: {
      phone: "+91 4175 252438",
      email: "jointcommissioner_annamalaiyar@hrce.tn.gov.in",
      website: "https://arunachaleswarartemple.tnhrce.in"
    },
    photos: [
      "/images/temples/temple-arunachalam.jpg"
    ],
    status: "representative_verified",
    contributors: [],
    events: [
      {
        id: "ev-ar1",
        title: "Karthigai Deepam Brahmotsavam",
        date: "2026-11-23",
        time: "06:00 PM",
        description: "The monumental Karthigai Maha Deepam cauldron is lit atop the 2,668-foot peak of Mount Arunachala, visible for over 30 kilometers."
      },
      {
        id: "ev-ar2",
        title: "Pournami Girivalam",
        date: "2026-10-25",
        time: "All Night",
        description: "Hundreds of thousands of devotees perform barefoot circumambulation along the 14-km sacred mountain path."
      }
    ],
    dressCode: "Traditional attire mandatory. Men: Dhoti or Pyjama with shirt/upper cloth. Women: Saree, Half-Saree, or Churidar with Shawl.",
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z"
  },
  // 4. Kedarnath
  {
    id: "temple-kedarnath",
    name: "Kedarnath Jyotirlinga Temple",
    deity: "Lord Kedarnath (Shiva Jyotirlinga - Sadashiva)",
    city: "Kedarnath",
    state: "Uttarakhand",
    address: "Kedarnath, Rudraprayag District, Uttarakhand 246445",
    lat: 30.7352,
    lng: 79.0669,
    description: "The highest and northernmost of the twelve Jyotirlingas, situated at 3,583 meters altitude in the snow-clad Garhwal Himalayas beside the Mandakini River.",
    history: "Built with colossal interlocking granite slabs. The Pandavas sought Lord Shiva to atone for the Mahabharata war; Shiva assumed the form of a celestial bull whose hump manifested at Kedarnath. Present shrine consecrated by Adi Shankaracharya who attained Mahasamadhi here.",
    timings: {
      morning: "05:00 AM \u2013 01:30 PM",
      evening: "05:00 PM \u2013 09:00 PM",
      notes: "Temple opens annually on Akshaya Tritiya (April/May) and closes on Bhai Dooj (October/November). During winter, the Utsava Murti is worshipped at Omkareshwar Temple in Ukhimath."
    },
    pujas: [
      { id: "p-kn1", name: "Maha Abhishek", timing: "04:00 AM", significance: "Sacred early morning bath of the holy triangular rock Jyotirlinga with Panchamrit", fee: "\u20B91,700" },
      { id: "p-kn2", name: "Rudrabhishek", timing: "05:30 AM", significance: "Continuous recitation of Sri Rudram and Chamakam by Badrinath-Kedarnath Temple Committee Rawals", fee: "\u20B91,000" },
      { id: "p-kn3", name: "Laghu Rudra Puja", timing: "07:00 AM", significance: "Special Vedic oblations offered in the inner sanctum", fee: "\u20B9600" },
      { id: "p-kn4", name: "Sandhya Shringar Aarti", timing: "07:00 PM", significance: "Evening aarti with divine flowers and musical chants amidst mountain echoes", fee: "Free" }
    ],
    contact: {
      phone: "+91 135 2741600",
      email: "bktc.kedarnath@gmail.com",
      website: "https://badrinath-kedarnath.gov.in"
    },
    photos: [
      "/images/temples/temple-kedarnath.jpg"
    ],
    status: "representative_verified",
    contributors: [],
    events: [
      {
        id: "ev-kn1",
        title: "Kedarnath Kapat Opening Ceremony",
        date: "2026-05-02",
        time: "06:00 AM",
        description: "Sacred opening of the temple doors accompanied by Army bands, flower shower, and the arrival of Lord Kedarnath Doli from Ukhimath."
      },
      {
        id: "ev-kn2",
        title: "Shravan Maas Jalabhishek",
        date: "2026-08-01",
        time: "05:00 AM",
        description: "Auspicious month of holy offerings of Ganga jal from Gaumukh and Gangotri by Kanwariyas."
      }
    ],
    dressCode: "Warm modest clothing suitable for Himalayan sub-zero climate. Footwear, mobile phones, cameras, and leather belts strictly prohibited in the inner Garbhagriha.",
    createdAt: "2024-01-04T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z"
  },
  // 5. Nandalur (Sri Soumyanatha Swamy Temple)
  {
    id: "temple-nandalur",
    name: "Sri Soumyanatha Swamy Temple (Nandalur)",
    deity: "Lord Soumyanatha Swamy (Sri Maha Vishnu in standing serene posture)",
    city: "Nandalur",
    state: "Andhra Pradesh",
    address: "Nandalur Village, Rajampet Mandal, Annamayya District, Andhra Pradesh 516150",
    lat: 14.2589,
    lng: 79.1172,
    description: "An architectural jewel of the 11th century built by the Cholas, featuring 108 intricately carved stone pillars and a sanctum aligned with the rays of the sun on the banks of the Cheyyeru River.",
    history: "Built by Kulottunga Chola I and patronized by the Kakatiyas, Matsya chiefs, and Vijayanagara monarchs. The Moolavirat of Soumyanatha Swamy is carved from lustrous black granite. A remarkable architectural phenomenon occurs during equinoxes when the morning rays of the sun illuminate the feet and face of the deity.",
    timings: {
      morning: "06:00 AM \u2013 12:00 PM",
      evening: "04:30 PM \u2013 08:30 PM",
      notes: "Special archana and tirumanjanam performed on every Ekadasi and Sravana Nakshatra."
    },
    pujas: [
      { id: "p-nl1", name: "Suprabhata Seva", timing: "06:00 AM", significance: "Morning awakening prayer", fee: "\u20B920" },
      { id: "p-nl2", name: "Nitya Archana", timing: "08:30 AM", significance: "Recitation of Vishnu Sahasranama with sacred tulasi leaves", fee: "\u20B930" },
      { id: "p-nl3", name: "Sahasranamarchana", timing: "10:00 AM", significance: "Special archana with fragrant flowers", fee: "\u20B950" },
      { id: "p-nl4", name: "Santhana Gopala Homam", timing: "11:00 AM", significance: "Auspicious ritual for marital harmony and progeny blessing", fee: "\u20B9250" },
      { id: "p-nl5", name: "Sayaratchai Harathi", timing: "06:30 PM", significance: "Evening camphor light offering with bells", fee: "Free" }
    ],
    contact: {
      phone: "+91 8567 222123",
      email: "soumyanatha.nandalur@apendowments.gov.in",
      website: "https://aptemples.ap.gov.in"
    },
    photos: [
      "/images/temples/temple-nandalur.webp"
    ],
    status: "representative_verified",
    contributors: [],
    events: [
      {
        id: "ev-nl1",
        title: "Soumyanatha Swamy Annual Brahmotsavams",
        date: "2026-04-18",
        time: "08:00 AM",
        description: "Seven-day Chaitra Masa festival featuring Garuda Vahanam, Hamsa Vahanam, and Rathotsavam."
      },
      {
        id: "ev-nl2",
        title: "Vaikunta Ekadasi",
        date: "2026-12-21",
        time: "05:00 AM",
        description: "Special Uttara Dwara Pravesham for thousands of devotees from Rayalaseema."
      }
    ],
    dressCode: "Traditional Indian attire: Dhoti/Kurta for men; Saree/Salwar for women.",
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z"
  },
  // 6. Ontimitta (Sri Kodandarama Swamy Temple)
  {
    id: "temple-ontimitta",
    name: "Sri Kodandarama Swamy Temple (Ontimitta / Vontimitta)",
    deity: "Sri Kodandarama Swamy (Rama holding Kodandam bow, Sita Devi & Lakshmana on single stone)",
    city: "Vontimitta (Ontimitta)",
    state: "Andhra Pradesh",
    address: "Vontimitta, Kadapa-Tirupati Highway, YSR Kadapa District, Andhra Pradesh 516213",
    lat: 14.3941,
    lng: 79.0275,
    description: 'Famed as the "Andhra Bhadrachalam", this 14th-century Vijayanagara architectural masterpiece houses a unique monolithic deity and is deeply linked with the composition of Andhra Maha Bhagavatham.',
    history: "Built by Vijayanagara rulers Bukka Raya I and expanded by Krishnadevaraya. The sanctum features a monolithic stone carved with Rama, Sita, and Lakshmana without Hanuman (depicting the Kishkindha Kanda phase before meeting Hanuman). Saint-poet Bammera Potana composed his Telugu epic Andhra Maha Bhagavatham in this courtyard and dedicated it to Sri Rama.",
    timings: {
      morning: "06:00 AM \u2013 01:00 PM",
      evening: "04:00 PM \u2013 08:30 PM",
      notes: "Temple administered under Tirumala Tirupati Devasthanams (TTD)."
    },
    pujas: [
      { id: "p-om1", name: "Suprabhatam", timing: "06:00 AM", significance: "Morning awakening prayer", fee: "\u20B930" },
      { id: "p-om2", name: "Nitya Sahasranama Archana", timing: "08:30 AM", significance: "Recitation of sacred Vishnu Sahasranama with Tulasi", fee: "\u20B950" },
      { id: "p-om3", name: "Kalyanotsavam", timing: "10:30 AM", significance: "Celestial wedding ceremony of Sita Rama", fee: "\u20B9300" },
      { id: "p-om4", name: "Sayaratchai Deepam", timing: "06:30 PM", significance: "Evening camphor arati and Vishnu stuti", fee: "Free" }
    ],
    contact: {
      phone: "+91 8568 288333",
      email: "helpdesk@tirumala.org",
      website: "https://ttdevasthanams.ap.gov.in"
    },
    photos: [
      "/images/temples/temple-ontimitta.jpg"
    ],
    status: "representative_verified",
    contributors: [],
    events: [
      {
        id: "ev-om1",
        title: "State Festival Sri Rama Navami Brahmotsavams",
        date: "2026-03-27",
        time: "07:00 PM",
        description: "Andhra Pradesh state festival featuring the celestial Sita Rama Kalyanam conducted on Chaitra Suddha Pournami night under the moonlight, attended by the Chief Minister presenting silk vastrams and pearls."
      }
    ],
    dressCode: "Traditional dress mandatory: Dhoti or Kurta for men; Saree or Chudidar with Dupatta for women.",
    createdAt: "2024-01-06T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z"
  },
  // 7. Srikalahasthi (Srikalahasteeswara Temple)
  {
    id: "temple-srikalahasthi",
    name: "Srikalahasteeswara Temple (Srikalahasthi)",
    deity: "Lord Srikalahasteeswara (Vayu Lingam) & Goddess Gnanaprasunambika",
    city: "Srikalahasti",
    state: "Andhra Pradesh",
    address: "Srikalahasti, Tirupati District, Andhra Pradesh 517644",
    lat: 13.7498,
    lng: 79.7037,
    description: "The ancient Pancha Bhoota Kshetra representing the Air / Wind element (Vayu Lingam), world-renowned for Rahu-Ketu Sarpa Dosha Nivarana pujas on the banks of the Swarnamukhi River.",
    history: "Constructed by the Pallavas in the 5th century and greatly patronized by the Cholas and Vijayanagara Emperor Krishnadevaraya who built the hundred-pillared mandapam. The flame in the sanctum flutters perpetually even with all doors closed, manifesting the Vayu Lingam. Named after Sri (spider), Kala (snake), and Hasti (elephant) who worshipped Lord Shiva with pure devotion.",
    timings: {
      morning: "06:00 AM \u2013 09:00 PM",
      evening: "Open continuously all day",
      notes: "Rahu Ketu Pujas are performed continuously in batches from 06:30 AM to 06:00 PM."
    },
    pujas: [
      { id: "p-sk1", name: "Rahu Ketu Sarpa Dosha Nivarana Puja", timing: "06:30 AM \u2013 06:00 PM", significance: "World-famous Vedic remedy puja for clearing ancestral, astrological, and marital doshas", fee: "\u20B9500 / \u20B91,500 / \u20B92,500" },
      { id: "p-sk2", name: "Rudrabhishekam", timing: "07:30 AM", significance: "Sacred abhishekam of the Vayu Lingam with panchamrit and bilva leaves", fee: "\u20B9600" },
      { id: "p-sk3", name: "Gomatha Puja", timing: "06:00 AM", significance: "Worship of Kamadhenu cow at the temple entrance", fee: "\u20B9100" },
      { id: "p-sk4", name: "Pallaki Seva", timing: "08:30 PM", significance: "Night palanquin procession of the Utsava deities", fee: "\u20B9200" }
    ],
    contact: {
      phone: "+91 8578 222240",
      email: "eo_srikalahasti@yahoo.co.in",
      website: "https://srikalahasthitemple.com"
    },
    photos: [
      "/images/temples/temple-srikalahasthi.jpg"
    ],
    status: "representative_verified",
    contributors: [],
    events: [
      {
        id: "ev-sk1",
        title: "Maha Shivaratri Brahmotsavam",
        date: "2026-03-08",
        time: "All Night",
        description: "13-day grand festival featuring Nandi Vahanam procession, Giri Pradakshina, and Rathotsavam with millions of pilgrims."
      }
    ],
    dressCode: "Strict traditional Indian attire. Men: Dhoti or Kurta-Pyjama (must remove upper shirts for sanctum abhishekam and Rahu-Ketu pujas). Women: Saree or Chudidar with Dupatta.",
    createdAt: "2024-01-07T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z"
  },
  // 8. Srisailam (Sri Bhramaramba Mallikarjuna Swamy Temple)
  {
    id: "temple-srisailam",
    name: "Sri Bhramaramba Mallikarjuna Swamy Temple (Srisailam)",
    deity: "Lord Mallikarjuna Swamy (Shiva Jyotirlinga) & Goddess Bhramaramba Devi (Maha Shakti Peetham)",
    city: "Srisailam",
    state: "Andhra Pradesh",
    address: "Srisailam Devasthanam, Srisailam, Nandyal District, Andhra Pradesh 518101",
    lat: 16.0741,
    lng: 78.8686,
    description: "One of the rarest shrines on earth where a Jyotirlinga of Lord Shiva and an Ashtadasa Maha Shakti Peetha of Mother Sati reside together atop the Nallamala forest hills beside Krishna River.",
    history: "Dating back over two millennia, patronized by the Satavahanas, Ikshvakus, Kakatiyas (Queen Rudrama Devi), and Chhatrapati Shivaji Maharaj who built the northern gopuram. Devotees are uniquely permitted Sparsha Darshanam (to physically touch the holy Jyotirlinga during Abhishekam).",
    timings: {
      morning: "04:30 AM \u2013 03:30 PM",
      evening: "06:00 PM \u2013 10:00 PM",
      notes: "Sparsha Darshanam (touching the Lingam) occurs during morning and evening slots with online token."
    },
    pujas: [
      { id: "p-sr1", name: "Sparsha Darshanam & Abhishekam", timing: "06:30 AM", significance: "Direct touching and bathing of the holy Jyotirlinga with holy water and bilva patra", fee: "\u20B9500" },
      { id: "p-sr2", name: "Bhramaramba Devi Kumkumarchana", timing: "07:00 AM \u2013 02:00 PM", significance: "Special vermilion archana at the Maha Shakti Peetham", fee: "\u20B9200" },
      { id: "p-sr3", name: "Maha Rudra Homam", timing: "08:30 AM", significance: "Vedic fire ritual invoking 11 Anuvakas of Sri Rudram", fee: "\u20B91,116" },
      { id: "p-sr4", name: "Nitya Kalyanam", timing: "07:00 PM", significance: "Divine wedding ritual of Mallikarjuna Swamy and Bhramaramba Devi", fee: "\u20B91,000" }
    ],
    contact: {
      phone: "+91 8524 288888",
      email: "support@srisailadevasthanam.org",
      website: "https://srisailadevasthanam.org"
    },
    photos: [
      "/images/temples/temple-srisailam.jpg"
    ],
    status: "representative_verified",
    contributors: [],
    events: [
      {
        id: "ev-sr1",
        title: "Maha Shivaratri Brahmotsavam",
        date: "2026-03-08",
        time: "All Night",
        description: "Seven-day grand festival with Lingodbhava Kaala Rudrabhishekam and Pagalankarana (tying of sacred turban cloth around the vimana)."
      },
      {
        id: "ev-sr2",
        title: "Ugadi Mahotsavam",
        date: "2026-03-20",
        time: "06:00 AM",
        description: "Traditional Telugu and Kannada New Year festivities with lakhs of Kannada pilgrims arriving on padayatra."
      }
    ],
    dressCode: "Strict Vedic dress code: Men must wear Dhoti & Uttariyam without shirt during Sparsha Darshan. Women must wear Saree or Salwar with Dupatta.",
    createdAt: "2024-01-08T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z"
  },
  // 9. Simhachalam (Sri Varaha Lakshmi Narasimha Swamy Temple)
  {
    id: "temple-simhachalam",
    name: "Sri Varaha Lakshmi Narasimha Swamy Temple (Simhachalam)",
    deity: "Lord Varaha Lakshmi Narasimha Swamy (Narasimha Avatar)",
    city: "Simhachalam, Visakhapatnam",
    state: "Andhra Pradesh",
    address: "Simhachalam Hill, Visakhapatnam, Andhra Pradesh 530028",
    lat: 17.7665,
    lng: 83.2505,
    description: "Perched 800 feet high on the Simhachalam hill, this ancient 11th-century temple features the Lord covered in continuous consecrated sandalwood paste throughout the year to soothe his celestial ferocity.",
    history: "Built by King Narasimhadeva I of the Eastern Ganga dynasty and patronized by Sri Krishnadevaraya. The presiding deity is an amalgamation of the Varaha (boar) and Narasimha (lion) avatars. The sandalwood paste is scraped away only once a year on Akshaya Tritiya for the sacred 12-hour Chandanotsavam Nijaroopa Darshanam.",
    timings: {
      morning: "07:00 AM \u2013 04:00 PM",
      evening: "06:00 PM \u2013 09:00 PM",
      notes: "Continuous darshan throughout the day. Sanctum closes briefly for Rajabhogam at 11:30 AM."
    },
    pujas: [
      { id: "p-sc1", name: "Suprabhata Seva", timing: "05:00 AM", significance: "Morning awakening prayer", fee: "\u20B9100" },
      { id: "p-sc2", name: "Ashtottara Shatanama Archana", timing: "08:00 AM", significance: "Recitation of 108 holy names of Lord Narasimha", fee: "\u20B950" },
      { id: "p-sc3", name: "Nitya Kalyanam", timing: "09:30 AM", significance: "Celestial wedding ceremony of the Lord with Lakshmi Devi", fee: "\u20B91,000" },
      { id: "p-sc4", name: "Sahasranamarchana", timing: "10:30 AM", significance: "1000 divine names chanting with Tulasi", fee: "\u20B9200" },
      { id: "p-sc5", name: "Sayana Seva", timing: "08:30 PM", significance: "Lullaby and resting ritual of the Lord", fee: "\u20B9100" }
    ],
    contact: {
      phone: "+91 891 2715400",
      email: "simhachalamdevasthanam@gmail.com",
      website: "https://simhachalamdevasthanam.org"
    },
    photos: [
      "/images/temples/temple-simhachalam.jpg"
    ],
    status: "representative_verified",
    contributors: [],
    events: [
      {
        id: "ev-sc1",
        title: "Chandanotsavam (Nijaroopa Darshanam)",
        date: "2026-05-02",
        time: "04:00 AM",
        description: "The sole day of the year on Akshaya Tritiya when the sandalwood paste is ceremonially removed and devotees behold the real form of the deity."
      },
      {
        id: "ev-sc2",
        title: "Giri Pradakshina",
        date: "2026-07-29",
        time: "02:00 PM",
        description: "Over 300,000 devotees walk the 32-km circumference of the Simhachalam hill range on Ashadha Pournami."
      }
    ],
    dressCode: "Traditional Indian attire: Dhoti/Kurta for men; Saree/Half-Saree/Chudidar with Dupatta for women.",
    createdAt: "2024-01-09T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z"
  },
  // 10. Yadadri (Sri Lakshmi Narasimha Swamy Temple)
  {
    id: "temple-yadadri",
    name: "Sri Lakshmi Narasimha Swamy Temple (Yadadri / Yadagirigutta)",
    deity: "Lord Pancha Narasimha Swamy (Jwala, Yogananda, Gandabherunda, Ugra, and Lakshminarasimha)",
    city: "Yadagirigutta (Yadadri)",
    state: "Telangana",
    address: "Yadadri Hill, Yadagirigutta, Telangana 508115",
    lat: 17.5888,
    lng: 78.9405,
    description: "The revered Pancha Narasimha cave shrine on a hillock, reconstructed into an architectural marvel of Dravidian craft using 250,000 tonnes of traditional black granite (Krishna Shila).",
    history: "Sage Yadarishi performed penance here to behold Lord Narasimha. The Lord granted darshan in five manifestations inside the natural cave. The modern temple was rebuilt under master sthapathis adhering to Agama and Shilpa Shastra without using cement.",
    timings: {
      morning: "04:00 AM \u2013 01:30 PM",
      evening: "03:00 PM \u2013 09:30 PM",
      notes: "Morning Suprabhatam starts at 04:00 AM; Nijabhishekam at 05:30 AM."
    },
    pujas: [
      { id: "p-yd1", name: "Suprabhatam", timing: "04:00 AM", significance: "Morning awakening hymns to Lord Narasimha", fee: "\u20B950" },
      { id: "p-yd2", name: "Nijabhishekam", timing: "05:30 AM", significance: "Panchamrita abhishekam of the Swayambhu cave idols", fee: "\u20B9500" },
      { id: "p-yd3", name: "Nitya Kalyana Mahotsavam", timing: "09:30 AM", significance: "Celestial wedding ceremony of Lakshmi and Narasimha", fee: "\u20B91,500" },
      { id: "p-yd4", name: "Sudarshana Homam", timing: "08:30 AM", significance: "Sacred fire oblation with the Sudarshana Yantra", fee: "\u20B91,116" },
      { id: "p-yd5", name: "Sahasranamarchana", timing: "10:30 AM", significance: "Chanting 1000 names with sacred Tulasi leaves", fee: "\u20B9200" },
      { id: "p-yd6", name: "Shayanotsavam", timing: "09:00 PM", significance: "Night closing arati and resting seva", fee: "\u20B9100" }
    ],
    contact: {
      phone: "+91 8685 236622",
      email: "eoyadagirigutta@gmail.com",
      website: "https://yadadritemple.telangana.gov.in"
    },
    photos: [
      "/images/temples/temple-yadadri.jpg"
    ],
    status: "representative_verified",
    contributors: [],
    events: [
      {
        id: "ev-yd1",
        title: "Annual Brahmotsavam",
        date: "2026-03-02",
        time: "08:00 AM",
        description: "11-day festival from Phalguna Shuddha Padyami with celestial wedding and Divya Vimana Ratha Yatra."
      },
      {
        id: "ev-yd2",
        title: "Narasimha Jayanthi",
        date: "2026-05-19",
        time: "06:00 PM",
        description: "Special dusk abhishekam commemorating the incarnation of Lord Narasimha."
      }
    ],
    dressCode: "Traditional Indian attire mandatory: Dhoti or Kurta-Pyjama for men; Saree or Chudidar with Dupatta for women.",
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z"
  },
  // 11. Bhadrachalam (Sri Seetha Ramachandra Swamy Temple)
  {
    id: "temple-bhadrachalam",
    name: "Sri Seetha Ramachandra Swamy Temple (Bhadrachalam)",
    deity: "Lord Vaikuntha Rama (holding Shankha, Chakra, Bow and Arrow) with Sita Devi and Lakshmana",
    city: "Bhadrachalam",
    state: "Telangana",
    address: "Bhadrachalam, Bhadradri Kothagudem District, Telangana 507111",
    lat: 17.6688,
    lng: 80.8936,
    description: "The supreme Rama kshetra nestled on the banks of the sacred Godavari River in the Dandakaranya forest, immortalized by the divine devotion of Bhakta Ramadasu.",
    history: "Lord Vishnu manifested as Vaikuntha Rama with four hands (holding Shankha and Chakra) to fulfill his promise to sage Bhadra. In the 17th century, Tahsildar Kancharla Gopanna (Bhakta Ramadasu) constructed the temple and crafted peerless gem-studded jewels (Chintaku Pathakam, Pachala Haram) for the deities, enduring 12 years in Golconda prison before Lord Rama redeemed him.",
    timings: {
      morning: "04:30 AM \u2013 01:00 PM",
      evening: "03:00 PM \u2013 09:00 PM",
      notes: "Suprabhatam at 04:30 AM; Nitya Kalyanam performed daily at 09:30 AM."
    },
    pujas: [
      { id: "p-bc1", name: "Suprabhata Seva", timing: "04:30 AM", significance: "Morning awakening hymns and arati", fee: "\u20B950" },
      { id: "p-bc2", name: "Abhishekam", timing: "07:00 AM", significance: "Holy bath of the Moolavirat with panchamrit", fee: "\u20B9200" },
      { id: "p-bc3", name: "Nitya Kalyana Utsavam", timing: "09:30 AM", significance: "Daily celestial wedding of Sri Rama and Sita Devi at the Kalyana Mandapam", fee: "\u20B91,000" },
      { id: "p-bc4", name: "Sahasranama Archana", timing: "10:30 AM", significance: "Chanting 1000 names of Lord Rama", fee: "\u20B9100" },
      { id: "p-bc5", name: "Rajabhogam & Pavalimpu Seva", timing: "08:30 PM", significance: "Night naivedyam and lullaby for the divine couple", fee: "\u20B9100" }
    ],
    contact: {
      phone: "+91 8743 232428",
      email: "eobhadrachalam@gmail.com",
      website: "https://bhadrachalam.telangana.gov.in"
    },
    photos: [
      "/images/temples/temple-bhadrachalam.jpg"
    ],
    status: "representative_verified",
    contributors: [],
    events: [
      {
        id: "ev-bc1",
        title: "Sri Rama Navami Vasanthotsavam",
        date: "2026-03-27",
        time: "10:00 AM",
        description: "Telangana state celebration of the celestial wedding of Lord Rama and Sita Devi with pearls (Mutyala Talambralu) presented by the State Government."
      },
      {
        id: "ev-bc2",
        title: "Vaikunta Ekadasi Teppotsavam",
        date: "2026-12-21",
        time: "05:00 PM",
        description: "Mukkoti Ekadasi celebrations featuring a magnificent boat procession in the Godavari River and Uttara Dwara Darshanam."
      }
    ],
    dressCode: "Traditional Indian attire: Dhoti or Kurta-Pyjama for men; Saree or Chudidar with Dupatta for women.",
    createdAt: "2024-01-11T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z"
  },
  // 12. Ramanathaswamy Temple (Rameswaram)
  {
    id: "temple-ramanathaswamy",
    name: "Arulmigu Ramanathaswamy Temple (Rameswaram)",
    deity: "Lord Ramanathaswamy (Ramalinga Jyotirlinga) & Goddess Parvathavardhini",
    city: "Rameswaram",
    state: "Tamil Nadu",
    address: "Rameswaram, Ramanathapuram District, Tamil Nadu 623526",
    lat: 9.2881,
    lng: 79.3174,
    description: "One of the four sacred Char Dham shrines and one of the 12 Jyotirlingas, featuring 22 consecrated teertham wells and the longest carved pillared corridor in the world.",
    history: "Consecrated by Lord Rama and Mother Sita to atone for killing Ravana. Sita sculpted the sand Ramalingam while Hanuman brought the Vishwalingam from Mount Kailash. The third corridor built by the Setupati kings contains 1,212 granite pillars stretching 197 meters.",
    timings: {
      morning: "05:00 AM \u2013 01:00 PM",
      evening: "03:00 PM \u2013 09:00 PM",
      notes: "Spatika Linga darshan held from 05:00 AM to 06:00 AM. Snanam in the 22 holy Teerthams takes approximately 1 hour."
    },
    pujas: [
      { id: "p-rm1", name: "Spatika Linga Darshanam", timing: "05:00 AM \u2013 06:00 AM", significance: "Early dawn darshan of the transparent crystal Spatika Lingam consecrated by Adi Shankaracharya", fee: "\u20B950" },
      { id: "p-rm2", name: "Thiruvanandal Puja", timing: "05:30 AM", significance: "Morning awakening prayer and first deeparadhana", fee: "\u20B950" },
      { id: "p-rm3", name: "Kala Santhi Puja", timing: "07:00 AM", significance: "Morning milk and sandal abhishekam", fee: "\u20B9100" },
      { id: "p-rm4", name: "Sayaratchai Puja", timing: "06:00 PM", significance: "Dusk deeparadhana with classical instrumental music", fee: "\u20B9100" },
      { id: "p-rm5", name: "Arthajama Puja", timing: "08:30 PM", significance: "Night closing puja and palanquin procession to the Palli Arai", fee: "\u20B9100" },
      { id: "p-rm6", name: "22 Teertham Snanam", timing: "06:00 AM \u2013 12:00 PM", significance: "Purification bath from 22 holy wells inside the temple complex", fee: "\u20B925" }
    ],
    contact: {
      phone: "+91 4573 221223",
      email: "rameswaramtemple@tnhrce.in",
      website: "https://rameswaramtemple.tnhrce.in"
    },
    photos: [
      "/images/temples/temple-ramanathaswamy.jpg"
    ],
    status: "representative_verified",
    contributors: [],
    events: [
      {
        id: "ev-rm1",
        title: "Maha Shivaratri Festival",
        date: "2026-03-08",
        time: "All Night",
        description: "Ten-day celebration culminating in all-night abhishekam and the silver car procession of Lord Ramanathaswamy."
      },
      {
        id: "ev-rm2",
        title: "Thirukalyanam (Aadi Thirukalyanam)",
        date: "2026-08-04",
        time: "08:00 AM",
        description: "Celestial wedding of Goddess Parvathavardhini and Lord Ramanathaswamy with coastal car festival."
      }
    ],
    dressCode: "Strict traditional attire. Men: Dhoti or Pyjama (must remove shirts/vests before entering the sanctum). Women: Saree or Chudidar with Dupatta. Wet clothes are strictly prohibited inside the main sanctum after taking bath in the 22 teerthams (dry clothes must be worn).",
    createdAt: "2024-01-12T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z"
  },
  // 13. Madurai (Arulmigu Meenakshi Sundareswarar Temple)
  {
    id: "temple-meenakshi",
    name: "Arulmigu Meenakshi Sundareswarar Temple (Madurai)",
    deity: "Goddess Meenakshi & Lord Sundareswarar (Shiva)",
    city: "Madurai",
    state: "Tamil Nadu",
    address: "Madurai Main, Madurai, Tamil Nadu 625001",
    lat: 9.9195,
    lng: 78.1193,
    description: "Historic architectural marvel located on the southern bank of the Vaigai River, world-famous for its 14 towering sculptured gopurams, Thousand Pillar Hall, and living Saivite heritage.",
    history: "Built during the Pandyan era and expanded during the 16th-17th century Nayakar rule by King Tirumala Nayaka. Celebrates the divine sovereign rule and cosmic wedding of warrior Goddess Meenakshi with Lord Sundareswarar.",
    timings: {
      morning: "05:00 AM \u2013 12:30 PM",
      evening: "04:00 PM \u2013 10:00 PM",
      notes: "Palli Arai Deeparadhana performed every evening at 09:30 PM with golden palanquin procession."
    },
    pujas: [
      { id: "p-m1", name: "Thiruvanandal Puja", timing: "05:00 AM", significance: "Morning awakening prayer and first darshan", fee: "Free" },
      { id: "p-m2", name: "Vila Puja & Kalasandhi", timing: "06:30 AM", significance: "Solemn morning abhishekam and archana", fee: "\u20B9250" },
      { id: "p-m3", name: "Uchikalam Puja", timing: "11:00 AM", significance: "Midday grand offering and deeparadhana", fee: "\u20B9150" },
      { id: "p-m4", name: "Sayaratchai Puja", timing: "06:00 PM", significance: "Dusk arati with nadaswaram recital", fee: "\u20B9200" },
      { id: "p-m5", name: "Palli Arai Puja", timing: "09:30 PM", significance: "Night ceremonial procession of Lord Sundareswarar to Goddess Meenakshi sanctum", fee: "\u20B9500" }
    ],
    contact: {
      phone: "+91 452 2344360",
      email: "jointcommissioner@maduraimeenakshi.org",
      website: "https://maduraimeenakshi.hrce.tn.gov.in"
    },
    photos: [
      "/images/temples/temple-meenakshi.jpg"
    ],
    status: "representative_verified",
    contributors: ["user-priest-sharma"],
    events: [
      {
        id: "ev-m1",
        title: "Chithirai Thiruvizha (Celestial Wedding)",
        date: "2026-04-20",
        time: "08:00 AM",
        description: "Grand annual festival featuring Meenakshi Thirukalyanam and chariot procession around the historic Masi streets."
      },
      {
        id: "ev-m2",
        title: "Navaratri Golu & Special Alankaram",
        date: "2026-10-12",
        time: "05:30 PM",
        description: "Nine nights of divine alankarams of Amman displayed in the Thousand Pillar Hall."
      }
    ],
    dressCode: "Traditional Indian attire mandatory: Dhoti or Pyjama with shirt for men; Saree or Salwar with Dupatta for women.",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z"
  },
  // 14. Udupi Sri Krishna Temple (Sri Krishna Matha)
  {
    id: "temple-udupi-srikrishna",
    name: "Sri Krishna Matha / Temple (Udupi)",
    deity: "Lord Balakrishna (Kadagolu Krishna with churning rod) & Mukhyaprana (Hanuman)",
    city: "Udupi",
    state: "Karnataka",
    address: "Car Street, Sri Krishna Temple Complex, Udupi, Karnataka 576101",
    lat: 13.3409,
    lng: 74.7523,
    description: "The epicenter of Dvaita Vedanta founded by Jagadguru Sri Madhvacharya in the 13th century, where Lord Balakrishna is viewed exclusively through the nine-holed silver window (Kanakana Kindi).",
    history: "Sri Madhvacharya retrieved the consecrated idol of Balakrishna encased in Gopichandana clay from a merchant ship off Malpe beach. The Lord turned around to face west towards the outer wall to grant darshan to his devoted saint-poet Kanakadasa. The shrine is administered in rotation every two years by the pontiffs of the Ashta Mathas (Paryaya system).",
    timings: {
      morning: "05:00 AM \u2013 11:00 AM",
      evening: "05:00 PM \u2013 09:00 PM",
      notes: "Nirmalya Visarjana darshan begins at 05:30 AM. Free holy Anna Santharpana (prasadam lunch) served to all devotees daily."
    },
    pujas: [
      { id: "p-ud1", name: "Nirmalya Visarjana Puja", timing: "05:30 AM", significance: "Morning removal of previous day garlands and holy bath", fee: "Free" },
      { id: "p-ud2", name: "Ushakala Puja", timing: "06:00 AM", significance: "Dawn offering with fresh milk and butter", fee: "Free" },
      { id: "p-ud3", name: "Panchamrutha Abhisheka", timing: "08:30 AM", significance: "Ritual bathing with milk, curd, ghee, honey, and jaggery", fee: "\u20B9250" },
      { id: "p-ud4", name: "Mahapuja", timing: "10:00 AM", significance: "Grand noon offering and arati with golden palanquin", fee: "\u20B9500" },
      { id: "p-ud5", name: "Chamara Seva & Ratri Puja", timing: "07:30 PM", significance: "Night whisk waving ritual with Vedic chanting", fee: "\u20B9200" }
    ],
    contact: {
      phone: "+91 820 2520598",
      email: "paryaya@udupisrikrishnamatha.org",
      website: "https://udupisrikrishnamatha.org"
    },
    photos: [
      "/images/temples/temple-udupi-srikrishna.jpg"
    ],
    status: "representative_verified",
    contributors: [],
    events: [
      {
        id: "ev-ud1",
        title: "Biennial Paryaya Mahotsava",
        date: "2026-01-18",
        time: "03:00 AM",
        description: "The ancient historic handover of worship rights among the pontiffs of the Ashta Mathas with grand night processions on Car Street."
      },
      {
        id: "ev-ud2",
        title: "Sri Krishna Janmashtami & Vittal Pindi",
        date: "2026-09-04",
        time: "All Day",
        description: "Grand celebrations of the Lord birth with clay idol procession and traditional Huli Vesha folk dance."
      }
    ],
    dressCode: "Traditional Indian attire. Men must remove shirts, t-shirts, and vests before stepping into the inner sanctum. Saree or Salwar with Dupatta for women.",
    createdAt: "2024-01-13T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z"
  },
  // 15. Dwaraka (Dwarkadhish Temple / Jagat Mandir)
  {
    id: "temple-dwarka",
    name: "Dwarkadhish Temple (Jagat Mandir, Dwaraka)",
    deity: "Lord Dwarkadhish (Trivikrama form of Lord Krishna with four arms)",
    city: "Dwarka",
    state: "Gujarat",
    address: "Dwarka, Devbhumi Dwarka District, Gujarat 361335",
    lat: 22.2376,
    lng: 68.9678,
    description: "One of the four supreme Char Dham pilgrimage kshetras and one of the seven Sapta Puris (Moksha cities), situated where the Gomti River enters the Arabian Sea.",
    history: "Originally established by Vajranabha, great-grandson of Lord Krishna, over the ruins of Hari Griha (Krishna residential palace). The 5-storey sandstone main shrine rises 78 meters high supported by 72 exquisitely carved pillars, hoisting a 52-yard flag (Dhwaja) that is changed five times daily.",
    timings: {
      morning: "06:30 AM \u2013 01:00 PM",
      evening: "05:00 PM \u2013 09:30 PM",
      notes: "Mangala Aarti at 06:30 AM; Shayan Aarti at 08:30 PM. Sanctum closes for bhog between 01:00 PM and 05:00 PM."
    },
    pujas: [
      { id: "p-dw1", name: "Mangala Aarti", timing: "06:30 AM", significance: "First auspicious morning arati of King Dwarkadhish", fee: "Free" },
      { id: "p-dw2", name: "Shringar Aarti", timing: "08:00 AM", significance: "Royal royal dressing and ornament adornment", fee: "Free" },
      { id: "p-dw3", name: "Snan Bhog", timing: "10:30 AM", significance: "Holy bath ritual and dry fruit offering", fee: "\u20B9150" },
      { id: "p-dw4", name: "Sandhya Aarti", timing: "07:30 PM", significance: "Dusk arati with conch and drum resonance", fee: "Free" },
      { id: "p-dw5", name: "Dhwaja Arohan Seva", timing: "Five times daily", significance: "Ceremonial hoisting of the 52-yard flag atop the temple spire", fee: "Booking required" }
    ],
    contact: {
      phone: "+91 2892 234090",
      email: "dwarkadhishtemple@gujarat.gov.in",
      website: "https://dwarkadhish.org"
    },
    photos: [
      "/images/temples/temple-dwarka.jpg"
    ],
    status: "representative_verified",
    contributors: [],
    events: [
      {
        id: "ev-dw1",
        title: "Krishna Janmashtami",
        date: "2026-09-04",
        time: "All Night",
        description: "Colossal celebration in the Lord own capital city with midnight Janmotsav and Maha Aarti."
      },
      {
        id: "ev-dw2",
        title: "Annakoot Mahotsav",
        date: "2026-11-10",
        time: "11:00 AM",
        description: "Offering of 56 varieties of sweets (Chhappan Bhog) to Dwarkadhish on Diwali New Year."
      }
    ],
    dressCode: "Modest traditional Indian clothing. Electronic devices, mobiles, and leather accessories must be deposited at the free cloak counter.",
    createdAt: "2024-01-14T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z"
  },
  // 16. Sri Padmanabhaswamy Temple
  {
    id: "temple-padmanabhaswamy",
    name: "Sree Padmanabhaswamy Temple (Thiruvananthapuram)",
    deity: "Lord Padmanabhaswamy (Maha Vishnu in Anantha Sayanam posture on Adi Shesha)",
    city: "Thiruvananthapuram",
    state: "Kerala",
    address: "West Nada, East Fort, Pazhavangadi, Thiruvananthapuram, Kerala 695023",
    lat: 8.4831,
    lng: 76.9436,
    description: "The royal 108 Divya Desam shrine where the 18-foot Moolavirat of Lord Vishnu reclines on the serpent Adi Shesha, viewed through three separate sanctum doorways.",
    history: 'Celebrated in Sangam literature and Divya Prabandham. In 1750 CE, Maharajah Marthanda Varma performed Thrippadi Danam, surrendering his entire Travancore kingdom to Lord Padmanabha and ruling as His humble servant ("Padmanabha Dasa"). The deity is sculpted out of 12,008 Salagrama stones.',
    timings: {
      morning: "03:15 AM \u2013 12:00 PM",
      evening: "05:00 PM \u2013 07:20 PM",
      notes: "Specific intermittent darshan slots: 03:15\u201304:15 AM, 06:30\u201307:00 AM, 08:30\u201310:00 AM, 10:30\u201311:15 AM, 11:45 AM\u201312:00 PM, 05:00\u201306:15 PM, 06:45\u201307:20 PM."
    },
    pujas: [
      { id: "p-pn1", name: "Nirmalya Darshanam", timing: "03:15 AM \u2013 04:15 AM", significance: "First auspicious early morning darshan of the day", fee: "\u20B950" },
      { id: "p-pn2", name: "Usha Puja", timing: "06:30 AM", significance: "Morning awakening prayer and butter offering", fee: "Free" },
      { id: "p-pn3", name: "Pantheeradi", timing: "08:30 AM", significance: "Solemn midway morning archana and naivedyam", fee: "\u20B9150" },
      { id: "p-pn4", name: "Sayaratcha Deeparadhana", timing: "06:30 PM", significance: "Evening camphor light arati in the sanctum", fee: "Free" },
      { id: "p-pn5", name: "Paal Payasam Nivedyam", timing: "11:00 AM", significance: "Offering of sacred milk sweet rice pudding consecrated for the Lord", fee: "\u20B9120" }
    ],
    contact: {
      phone: "+91 471 2450233",
      email: "info@spst.in",
      website: "https://spst.in"
    },
    photos: [
      "/images/temples/temple-padmanabhaswamy.jpg"
    ],
    status: "representative_verified",
    contributors: [],
    events: [
      {
        id: "ev-pn1",
        title: "Panguni & Alpashi Aaraattu Procession",
        date: "2026-04-02",
        time: "04:30 PM",
        description: "The royal sword-bearing procession led by the titular Maharaja to the Arabian Sea at Shanghumugham beach for the sacred Aaraattu holy immersion."
      },
      {
        id: "ev-pn2",
        title: "Murajapam & Laksha Deepam",
        date: "2026-01-14",
        time: "06:00 PM",
        description: "Vedic recitation festival conducted once every six years culminating in 100,000 oil lamps illuminating the gopuram."
      }
    ],
    dressCode: "Strict ancient Travancore Vedic code strictly enforced. Men: Mundu (dhoti) worn around the waist without shirts or banyans. Women: Saree, Set-Mundu, or Pavada. Salwar kameez, pants, and modern western dresses are strictly banned.",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z"
  },
  // 17. Shirdi (Shri Saibaba Sansthan Temple)
  {
    id: "temple-shirdi",
    name: "Shri Saibaba Sansthan Temple (Shirdi)",
    deity: "Shri Sai Baba of Shirdi (Samadhi Mandir & Dwarkamai)",
    city: "Shirdi",
    state: "Maharashtra",
    address: "Mauli Nagar, Shirdi, Rahata Taluka, Ahmednagar District, Maharashtra 423109",
    lat: 19.7668,
    lng: 74.4762,
    description: 'One of the world foremost spiritual sanctuaries where saint Shri Sai Baba lived, taught universal harmony, faith ("Shraddha") and patience ("Saburi"), and entered Mahasamadhi.',
    history: "Sai Baba arrived in Shirdi in the mid-19th century, took abode at the dilapidated Dwarkamai mosque tending the eternal Dhuni fire, and took Mahasamadhi in October 1918. The holy complex encompasses the Samadhi Mandir featuring an Italian white marble murti of Baba, Gurusthan under the neem tree, Chavadi, and Lendi garden.",
    timings: {
      morning: "04:00 AM \u2013 11:15 PM",
      evening: "Continuous darshan throughout the day",
      notes: "Kakad Aarti at 04:30 AM; Shej Aarti at 10:30 PM. Mega Prasadalaya operates serving over 50,000 consecrated meals daily."
    },
    pujas: [
      { id: "p-sb1", name: "Kakad Aarti", timing: "04:30 AM", significance: "Dawn awakening aarti with lamps and stotras", fee: "\u20B9600" },
      { id: "p-sb2", name: "Madhyan Aarti", timing: "12:00 PM", significance: "Midday grand arati with bell resonance", fee: "\u20B9400" },
      { id: "p-sb3", name: "Dhoop Aarti", timing: "06:15 PM", significance: "Sunset fragrant incense offering", fee: "\u20B9400" },
      { id: "p-sb4", name: "Shej Aarti", timing: "10:30 PM", significance: "Night closing lullaby arati", fee: "\u20B9400" },
      { id: "p-sb5", name: "Abhishek Puja", timing: "07:00 AM \u2013 11:00 AM", significance: "Holy bath ritual conducted by devotee families with Sansthan purohits", fee: "\u20B9250" }
    ],
    contact: {
      phone: "+91 2423 258500",
      email: "saibaba@sai.org.in",
      website: "https://sai.org.in"
    },
    photos: [
      "/images/temples/temple-shirdi.jpg"
    ],
    status: "representative_verified",
    contributors: [],
    events: [
      {
        id: "ev-sb1",
        title: "Shri Sai Baba Punyatithi Festival",
        date: "2026-10-20",
        time: "All Day",
        description: "Grand three-day Mahasamadhi commemoration attracting over 300,000 pilgrims on foot from across India."
      },
      {
        id: "ev-sb2",
        title: "Guru Purnima Mahotsav",
        date: "2026-07-29",
        time: "05:00 AM",
        description: "Solemn festival dedicated to honoring the Satguru with continuous Akhand Ramayan and Sai Satcharitra path."
      }
    ],
    dressCode: "Modest respectful clothing. Devotees are requested to maintain solemnity. Free mega Prasadalaya serves hot satvik meals continuously.",
    createdAt: "2024-01-16T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z"
  },
  // 18. Somnath (Shree Somnath Jyotirlinga Temple)
  {
    id: "temple-somnath",
    name: "Shree Somnath Jyotirlinga Temple (Prabhas Patan)",
    deity: "Lord Somnath (First among the 12 Jyotirlingas of Shiva)",
    city: "Prabhas Patan",
    state: "Gujarat",
    address: "Somnath Mandir Marg, Prabhas Patan, Veraval, Gujarat 362268",
    lat: 20.888,
    lng: 70.4013,
    description: "The first of the twelve sacred Jyotirlinga shrines of Lord Shiva situated on the shore of the Arabian Sea, known as the Shrine Eternal.",
    history: "Known as the Shrine Eternal. Built in the Chalukya style of temple architecture under Sardar Vallabhbhai Patel following Indian independence.",
    timings: {
      morning: "06:00 AM \u2013 09:30 PM (Continuous Darshan)",
      evening: "Aarti at 07:00 PM, Sound & Light Show 08:00 PM",
      notes: "Temple remains open all day without midday closure.",
      specialDays: "Maha Shivratri features all-night four-pahar Mahapuja."
    },
    pujas: [
      { id: "p-s1", name: "Pratah Aarti", timing: "07:00 AM", significance: "Morning aarti with Shankhanaad", fee: "Free" },
      { id: "p-s2", name: "Madhyahna Aarti", timing: "12:00 PM", significance: "Midday grand offering", fee: "Free" },
      { id: "p-s3", name: "Sandhya Aarti", timing: "07:00 PM", significance: "Evening oceanfront arati", fee: "Free" },
      { id: "p-s4", name: "Laghu Rudra Abhishek", timing: "08:00 AM \u2013 10:30 AM", significance: "Vedic chanting with continuous holy waters", fee: "\u20B91,100" }
    ],
    contact: {
      phone: "+91 2876 231200",
      email: "info@somnath.org",
      website: "https://somnath.org"
    },
    photos: [
      "/images/temples/temple-somnath.jpg"
    ],
    status: "representative_verified",
    adminId: "user-admin-somnath",
    claimedBy: "user-admin-somnath",
    claimStatus: "claimed",
    contributors: [],
    events: [
      {
        id: "ev-s1",
        title: "Maha Shivaratri Mahotsav",
        date: "2026-03-08",
        time: "All Night",
        description: "Special continuous abhishekam, palanquin yatra, and laser illumination show."
      }
    ],
    dressCode: "Modest traditional dress. Leather belts, bags, electronic items, and cameras must be deposited at the locker room.",
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z"
  },
  // Bonus sacred kshetras preserved for completeness
  {
    id: "temple-kashi",
    name: "Shri Kashi Vishwanath Temple (Varanasi)",
    deity: "Lord Vishwanath (Shiva Jyotirlinga)",
    city: "Varanasi",
    state: "Uttar Pradesh",
    address: "Lahori Tola, Varanasi, Uttar Pradesh 221001",
    lat: 25.3109,
    lng: 83.0107,
    description: "One of the most sacred pilgrimage centers located along the western bank of the holy River Ganga in Kashi.",
    history: "Rebuilt by Maharani Ahilyabai Holkar of Indore in 1780; modern Kashi Vishwanath Dham corridor connected to Ganga Ghats.",
    timings: {
      morning: "03:00 AM \u2013 11:15 AM",
      evening: "12:20 PM \u2013 11:00 PM",
      notes: "Temple corridor open 24 hours for river views."
    },
    pujas: [
      { id: "p-k1", name: "Mangala Aarti", timing: "03:00 AM", significance: "First auspicious aarti of the day", fee: "\u20B9350" },
      { id: "p-k2", name: "Bhog Aarti", timing: "11:15 AM", significance: "Midday food offering", fee: "\u20B9180" },
      { id: "p-k3", name: "Sapta Rishi Aarti", timing: "07:00 PM", significance: "Conducted simultaneously by 7 venerable purohits", fee: "\u20B9300" },
      { id: "p-k4", name: "Rudra Abhishek", timing: "06:00 AM \u2013 01:00 PM", significance: "Panchamrit ritual bathing with Vedic hymns", fee: "\u20B9700" }
    ],
    contact: {
      phone: "+91 542 2392629",
      email: "shrikashivishwanathvaranasi@gmail.com",
      website: "https://shrikashivishwanath.org"
    },
    photos: [
      "/images/temples/temple-kashi.jpg"
    ],
    status: "representative_verified",
    contributors: [],
    events: [
      {
        id: "ev-k1",
        title: "Dev Deepawali & Ganga Mahotsav",
        date: "2026-11-23",
        time: "05:00 PM",
        description: "Lakhs of earthen lamps lit along all 84 ghats from Assi to Rajghat with Maha Aarti."
      }
    ],
    dressCode: "Traditional Indian attire. Prohibited items to be left in cloakroom.",
    createdAt: "2024-02-10T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z"
  },
  {
    id: "temple-brihadisvara",
    name: "Brihadisvara Temple (Peruvudaiyar Kovil, Thanjavur)",
    deity: "Lord Shiva (Brihadisvara)",
    city: "Thanjavur",
    state: "Tamil Nadu",
    address: "Membalam Rd, Balaganapathy Nagar, Thanjavur, Tamil Nadu 613007",
    lat: 10.7828,
    lng: 79.1318,
    description: "UNESCO World Heritage Site, quintessential example of Chola architecture built by Emperor Raja Raja Chola I.",
    history: "Consecrated in 1010 CE; the vimana tower is 216 feet high and topped by an 80-tonne monolithic granite kumbam.",
    timings: {
      morning: "06:00 AM \u2013 12:30 PM",
      evening: "04:00 PM \u2013 08:30 PM"
    },
    pujas: [
      { id: "p-b1", name: "Usha Kalam", timing: "06:30 AM", significance: "Early dawn puja", fee: "Free" },
      { id: "p-b2", name: "Sayaratchai", timing: "06:00 PM", significance: "Evening deeparadhana", fee: "Free" },
      { id: "p-b3", name: "Maha Pradosham Abhishek", timing: "04:30 PM (Bi-monthly)", significance: "Grand milk and sandal abhishekam to massive Nandi", fee: "\u20B9100" }
    ],
    contact: {
      phone: "+91 4362 274476",
      email: "thanjavurtourism@tn.gov.in"
    },
    photos: [
      "/images/temples/temple-brihadisvara.jpg"
    ],
    status: "community_confirmed",
    contributors: [],
    events: [
      {
        id: "ev-b1",
        title: "Brahmotsavam & Raja Raja Chola Jayanthi",
        date: "2026-10-30",
        time: "09:00 AM",
        description: "Sadhaya Vizha celebration celebrating Emperor Raja Raja Chola with classic Bharatanatyam recital."
      }
    ],
    dressCode: "Traditional Indian attire.",
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z"
  }
];

// server/db.ts
var db = {
  users: [
    {
      id: "user-devotee-1",
      email: "devotee@templeconnect.org",
      role: "user",
      name: "Ramesh Kumar",
      phone: "+91 98410 12345",
      createdAt: "2025-01-10T10:00:00Z"
    },
    {
      id: "user-admin-meenakshi",
      email: "admin@meenakshi.org",
      role: "admin",
      name: "Sundaram Gurukkal (Trustee)",
      phone: "+91 94432 98765",
      templeId: "temple-meenakshi",
      createdAt: "2024-11-01T08:30:00Z"
    },
    {
      id: "user-admin-somnath",
      email: "admin@somnath.org",
      role: "admin",
      name: "Dharmendra Shastri (Board)",
      phone: "+91 98250 45678",
      templeId: "temple-somnath",
      createdAt: "2024-12-15T09:00:00Z"
    },
    {
      id: "user-priest-sharma",
      email: "priest.sharma@vedic.org",
      role: "priest",
      name: "Pandit Rajesh Sharma",
      phone: "+91 98765 43210",
      priestProfileId: "priest-sharma-profile",
      createdAt: "2024-12-20T11:00:00Z"
    },
    {
      id: "user-priest-venkat",
      email: "priest.venkat@vedic.org",
      role: "priest",
      name: "Shri Venkatachari Swami",
      phone: "+91 98450 67890",
      priestProfileId: "priest-venkat-profile",
      createdAt: "2025-01-05T14:20:00Z"
    }
  ],
  temples: [...initialTemples],
  priestProfiles: [
    {
      id: "priest-sharma-profile",
      userId: "user-priest-sharma",
      fullName: "Pandit Rajesh Sharma",
      experienceYears: 12,
      previousTemples: [
        {
          templeName: "Kashi Vishwanath Sub-Shrine",
          role: "Assistant Acharya (Rudrabhishekam & Archana)",
          duration: "2016 \u2013 2021",
          city: "Varanasi"
        },
        {
          templeName: "Sri Raghavendra Swamy Mutt",
          role: "Purohit & Veda Parayana Adhyapaka",
          duration: "2021 \u2013 2024",
          city: "Madurai"
        }
      ],
      purohithamSkills: [
        "Rudrabhishekam",
        "Ganapathi Homam",
        "Navagraha Shanthi",
        "Veda Parayanam",
        "Vivaham / Wedding Rites",
        "Satyanarayana Vratam",
        "Maha Sudarshana Homam"
      ],
      vedaTradition: "Rigveda - Shakala Shakha",
      trainingQualifications: "Sri Venkateswara Veda Pathashala - Kramanta Completed (8-Year Rigveda Adhyayanam)",
      languages: ["Sanskrit", "Hindi", "Tamil", "Telugu"],
      achievements: "Veda Vibhushan Title awarded by Jagadguru Shankaracharya Peetham (2022). Performed over 250 Shatachandi and Rudra Homams.",
      bio: "Disciplined Rigvedic Purohit dedicated to authentic Agamic traditions, precise svara chanting, and devout deity alankaram. Seeking long-term service in a consecrated Shiva or Devi temple.",
      location: "Madurai, Tamil Nadu (Willing to relocate across India)",
      phone: "+91 98765 43210",
      email: "priest.sharma@vedic.org",
      shareContactConsent: true,
      availableForRelocation: true,
      expectedRemuneration: "\u20B940,000 \u2013 \u20B955,000 / month + Traditional Temple Accommodation",
      verifiedAgama: true
    },
    {
      id: "priest-venkat-profile",
      userId: "user-priest-venkat",
      fullName: "Shri Venkatachari Swami",
      experienceYears: 16,
      previousTemples: [
        {
          templeName: "Sri Varadaraja Perumal Temple",
          role: "Pancharatra Agama Archakar",
          duration: "2012 \u2013 2023",
          city: "Kanchipuram"
        }
      ],
      purohithamSkills: [
        "Pancharatra Agama Seva",
        "Alankaram & Pushpa Kainkaryam",
        "Kalyana Utsavam",
        "Sudarshana Homam",
        "Veda Parayanam",
        "Brahmotsavam Vahana Nirvahana"
      ],
      vedaTradition: "Krishna Yajurveda - Taittiriya Shakha",
      trainingQualifications: "Madurantakam Veda Agama Pathashala (Pancharatra Agama Praveena)",
      languages: ["Tamil", "Telugu", "Sanskrit", "English"],
      achievements: "Agama Ratnakara recipient; specialized in rare flower alankarams and Utsava Vigraha procession protocol.",
      bio: "Experienced Pancharatra Archakar with 16 years of continuous sanctum service in Vaishnavite kshetras. Highly skilled in daily pujas, nitya tirumanjanam, and annual Brahmotsavam management.",
      location: "Chennai / Kanchipuram, Tamil Nadu",
      phone: "+91 98450 67890",
      email: "priest.venkat@vedic.org",
      shareContactConsent: true,
      availableForRelocation: true,
      expectedRemuneration: "\u20B945,000 \u2013 \u20B960,000 / month",
      verifiedAgama: true
    }
  ],
  vacancies: [
    {
      id: "vac-somnath-1",
      templeId: "temple-somnath",
      templeName: "Shree Somnath Jyotirlinga Temple",
      location: "Prabhas Patan, Gujarat",
      title: "Senior Vedic Archaka & Rudrabhishekam Specialist",
      ritualSpecialization: [
        "Rudrabhishekam",
        "Veda Parayanam",
        "Laghu Rudra / Maha Rudra",
        "Daily Sanctum Arati"
      ],
      vedaTraditionRequired: "Rigveda or Shukla Yajurveda",
      minExperienceYears: 7,
      remuneration: "\u20B945,000 \u2013 \u20B960,000 / month + Free Temple Quarters + Prasadam",
      accommodationProvided: true,
      foodProvided: true,
      description: "Shree Somnath Trust invites applications from certified Vedic Purohits to conduct early-morning Laghu Rudra abhishekams, daily deeparadhana, and lead Veda Parayanam at the sanctum sanctorum.",
      status: "open",
      postedDate: "2025-01-15",
      applicantsCount: 2
    },
    {
      id: "vac-meenakshi-1",
      templeId: "temple-meenakshi",
      templeName: "Arulmigu Meenakshi Sundareswarar Temple",
      location: "Madurai, Tamil Nadu",
      title: "Assistant Shiva Archakar & Veda Parayana Purohit",
      ritualSpecialization: [
        "Saiva Agama Diksha",
        "Rudrabhishekam",
        "Vila Puja & Deeparadhana",
        "Veda Parayanam"
      ],
      vedaTraditionRequired: "Rigveda or Krishna Yajurveda (Saiva Siddhanta Agama knowledge preferred)",
      minExperienceYears: 5,
      remuneration: "\u20B938,000 \u2013 \u20B950,000 / month + Official Trust Quarters",
      accommodationProvided: true,
      foodProvided: true,
      description: "Arulmigu Meenakshi Amman Temple seeks devout, trained Archakar to assist in nitya pujas, Sayaratchai deeparadhana, and participate in grand Chithirai festival rituals.",
      status: "open",
      postedDate: "2025-01-28",
      applicantsCount: 1
    }
  ],
  applications: [
    {
      id: "app-sharma-somnath",
      vacancyId: "vac-somnath-1",
      vacancyTitle: "Senior Vedic Archaka & Rudrabhishekam Specialist",
      templeId: "temple-somnath",
      templeName: "Shree Somnath Jyotirlinga Temple",
      priestId: "user-priest-sharma",
      priestName: "Pandit Rajesh Sharma",
      priestPhone: "+91 98765 43210",
      priestEmail: "priest.sharma@vedic.org",
      priestExperience: 12,
      priestSkills: [
        "Rudrabhishekam",
        "Ganapathi Homam",
        "Navagraha Shanthi",
        "Veda Parayanam"
      ],
      priestVeda: "Rigveda - Shakala Shakha",
      priestLanguages: ["Sanskrit", "Hindi", "Tamil", "Telugu"],
      coverNote: "Namaste. With 12 years of devoted Rigvedic training from Sri Venkateswara Veda Pathashala and extensive experience conducting Laghu Rudra abhishekams in Varanasi and Madurai, I humbly offer my services for Somnath Mahadev.",
      availableFrom: "2025-03-01",
      status: "shortlisted",
      adminNotes: "Strong Vedic credentials. Kramanta passed. Verified references from Kashi Vishwanath sub-shrine. Excellent candidate for Laghu Rudra.",
      aiMatchScore: 94,
      aiMatchSummary: "Exceptional match: Rigveda Kramanta background matches vacancy requirement precisely; 12 years experience exceeds 7-year threshold; verified Rudrabhishekam expertise.",
      submittedAt: "2025-01-20T14:30:00Z",
      updatedAt: "2025-01-22T09:15:00Z"
    }
  ],
  messages: [
    {
      id: "msg-1",
      applicationId: "app-sharma-somnath",
      templeId: "temple-somnath",
      senderId: "user-admin-somnath",
      senderName: "Dharmendra Shastri (Board)",
      senderRole: "admin",
      recipientId: "user-priest-sharma",
      recipientName: "Pandit Rajesh Sharma",
      content: "Pranam Panditji. The Somnath Board has reviewed your Rigveda Kramanta certificate and application. We have shortlisted you for the Senior Archaka position.",
      timestamp: "2025-01-22T09:20:00Z",
      read: true
    },
    {
      id: "msg-2",
      applicationId: "app-sharma-somnath",
      templeId: "temple-somnath",
      senderId: "user-priest-sharma",
      senderName: "Pandit Rajesh Sharma",
      senderRole: "priest",
      recipientId: "user-admin-somnath",
      recipientName: "Dharmendra Shastri (Board)",
      content: "Har Har Mahadev. Thank you Shastriji. I am deeply honored and ready for the viva-voce and recitation assessment at your convenience.",
      timestamp: "2025-01-22T10:05:00Z",
      read: true
    }
  ],
  contributorProposals: [
    {
      id: "prop-1",
      templeId: "temple-meenakshi",
      templeName: "Arulmigu Meenakshi Sundareswarar Temple",
      priestId: "user-priest-sharma",
      priestName: "Pandit Rajesh Sharma",
      updateType: "timings",
      proposedData: {
        morning: "04:30 AM \u2013 01:00 PM",
        evening: "04:00 PM \u2013 10:30 PM",
        specialDays: "Chithirai Thiruvizha: Special continuous queue tokens from 04:00 AM.",
        notes: "Recommended opening 30 minutes earlier during upcoming festival month for outstation devotees."
      },
      rationale: "During the upcoming Chithirai festival month, crowd ingress begins as early as 04:15 AM. Opening sanctum gates 30 minutes earlier will avoid crowd congestion at the South Gopuram.",
      status: "pending_admin_review",
      submittedAt: "2025-02-14T11:00:00Z"
    }
  ],
  claimRequests: [
    {
      id: "claim-1",
      templeId: "temple-varanasi-sankatmochan",
      templeName: "Sankat Mochan Hanuman Temple",
      applicantUserId: "user-devotee-1",
      applicantName: "Ramesh Kumar",
      officialRole: "Heritage Preservation Volunteer / Liaison",
      phone: "+91 98410 12345",
      email: "devotee@templeconnect.org",
      verificationDocs: "Submitted Letter of Recommendation from local Seva Samiti (Ref #VNS-2025-412)",
      status: "pending",
      submittedAt: "2025-02-10T16:00:00Z"
    }
  ],
  notifications: [
    {
      id: "notif-1",
      userId: "user-admin-somnath",
      type: "application",
      title: "New Priest Application Received",
      message: "Pandit Rajesh Sharma submitted an application for Senior Vedic Archaka position.",
      link: "/admin/applications",
      read: false,
      createdAt: "2025-01-20T14:30:00Z"
    },
    {
      id: "notif-2",
      userId: "user-priest-sharma",
      type: "status_change",
      title: "Application Shortlisted! \u{1F389}",
      message: "Your application for Senior Vedic Archaka at Shree Somnath Jyotirlinga Temple has been shortlisted.",
      link: "/priest/applications",
      read: false,
      createdAt: "2025-01-22T09:15:00Z"
    },
    {
      id: "notif-3",
      userId: "user-admin-meenakshi",
      type: "contributor_update",
      title: "Contributor Proposed Temple Update",
      message: "Pandit Rajesh Sharma proposed revised festival darshan timings for Meenakshi Amman Temple.",
      link: "/admin/contributors",
      read: false,
      createdAt: "2025-02-14T11:00:00Z"
    }
  ],
  auditLogs: [
    {
      id: "audit-1",
      templeId: "temple-meenakshi",
      performedBy: "Sundaram Gurukkal (Trustee)",
      action: "Grant Contributor Permission",
      details: "Granted verified contributor permissions to Pandit Rajesh Sharma (Rigvedic Scholar).",
      timestamp: "2025-01-10T10:15:00Z"
    },
    {
      id: "audit-2",
      templeId: "temple-somnath",
      performedBy: "Dharmendra Shastri (Board)",
      action: "Shortlist Applicant",
      details: 'Shortlisted Pandit Rajesh Sharma for vacancy "Senior Vedic Archaka". AI compatibility score: 94%.',
      timestamp: "2025-01-22T09:15:00Z"
    }
  ]
};

// server/auth.ts
function generateToken(user) {
  const payload = Buffer.from(JSON.stringify({ id: user.id, role: user.role, time: Date.now() })).toString("base64");
  return `tc_${payload}`;
}
function parseToken(token) {
  try {
    if (!token.startsWith("tc_")) return null;
    const raw = Buffer.from(token.replace("tc_", ""), "base64").toString("utf-8");
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (err) {
    return null;
  }
}
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    const customHeader = req.headers["x-auth-token"];
    if (customHeader) {
      const data2 = parseToken(customHeader);
      if (data2) {
        const found = db.users.find((u) => u.id === data2.id);
        if (found) {
          req.user = found;
          return next();
        }
      }
    }
    return res.status(401).json({ error: "Authentication required. No token provided." });
  }
  const data = parseToken(token);
  if (!data) {
    return res.status(403).json({ error: "Invalid or expired authentication token." });
  }
  const foundUser = db.users.find((u) => u.id === data.id);
  if (!foundUser) {
    return res.status(403).json({ error: "User associated with token no longer exists." });
  }
  req.user = foundUser;
  next();
}
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized. Please sign in." });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access Denied: Role '${req.user.role}' is not authorized to access this resource. Requires one of: [${allowedRoles.join(", ")}]`
      });
    }
    next();
  };
}
function requireTempleOwnership(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin role required." });
  }
  const requestedTempleId = req.params.templeId || req.body.templeId || req.query.templeId;
  if (!requestedTempleId) {
    return res.status(400).json({ error: "Temple ID required." });
  }
  const temple = db.temples.find((t) => t.id === requestedTempleId);
  if (!temple) {
    return res.status(404).json({ error: "Temple not found." });
  }
  if (temple.adminId !== req.user.id && req.user.templeId !== temple.id) {
    return res.status(403).json({
      error: `Access Denied: You are not authorized to administer temple '${temple.name}'.`
    });
  }
  next();
}
function requireContributorAccess(req, res, next) {
  if (!req.user || req.user.role !== "priest") {
    return res.status(403).json({ error: "Priest role required for contributor proposals." });
  }
  const requestedTempleId = req.params.templeId || req.body.templeId;
  const temple = db.temples.find((t) => t.id === requestedTempleId);
  if (!temple) {
    return res.status(404).json({ error: "Temple not found." });
  }
  const isContributor = temple.contributors && temple.contributors.includes(req.user.id);
  if (!isContributor) {
    return res.status(403).json({
      error: `Forbidden: Contributor access is not automatic. The administrator of '${temple.name}' must explicitly grant you contributor permission.`
    });
  }
  next();
}

// server/gemini.ts
import { GoogleGenAI } from "@google/genai";

// server/locationSearch.ts
var KNOWN_LOCATIONS = [
  {
    name: "Tirupati",
    aliases: ["tirupati", "tirupathi", "tirumala", "thirupati", "sv temple"],
    lat: 13.6288,
    lng: 79.4192,
    state: "Andhra Pradesh"
  },
  {
    name: "Srikalahasti",
    aliases: ["srikalahasti", "srikalahasthi", "kalahasti", "kalahasthi"],
    lat: 13.7498,
    lng: 79.7037,
    state: "Andhra Pradesh"
  },
  {
    name: "Nandalur",
    aliases: ["nandalur", "nandaluru", "rajampet"],
    lat: 14.2589,
    lng: 79.1172,
    state: "Andhra Pradesh"
  },
  {
    name: "Ontimitta",
    aliases: ["ontimitta", "vontimitta", "kadapa", "cuddapah"],
    lat: 14.3941,
    lng: 79.0275,
    state: "Andhra Pradesh"
  },
  {
    name: "Vijayawada",
    aliases: ["vijayawada", "bezawada", "indrakeeladri", "kanaka durga"],
    lat: 16.5062,
    lng: 80.648,
    state: "Andhra Pradesh"
  },
  {
    name: "Srisailam",
    aliases: ["srisailam", "srisaila", "mallikarjuna", "kurnool"],
    lat: 16.0741,
    lng: 78.8686,
    state: "Andhra Pradesh"
  },
  {
    name: "Thiruvannamalai",
    aliases: ["thiruvannamalai", "tiruvannamalai", "arunachalam", "arunachala", "annamalai"],
    lat: 12.2253,
    lng: 79.0677,
    state: "Tamil Nadu"
  },
  {
    name: "Madurai",
    aliases: ["madurai", "meenakshi", "pandya"],
    lat: 9.9195,
    lng: 78.1193,
    state: "Tamil Nadu"
  },
  {
    name: "Rameswaram",
    aliases: ["rameswaram", "rameshwaram", "dhanushkodi", "ramanathaswamy"],
    lat: 9.2881,
    lng: 79.3174,
    state: "Tamil Nadu"
  },
  {
    name: "Thanjavur",
    aliases: ["thanjavur", "tanjore", "brihadisvara", "brihadeeswara", "chola"],
    lat: 10.7828,
    lng: 79.1318,
    state: "Tamil Nadu"
  },
  {
    name: "Visakhapatnam",
    aliases: ["visakhapatnam", "vizag", "simhachalam", "simhadri"],
    lat: 17.7665,
    lng: 83.2505,
    state: "Andhra Pradesh"
  },
  {
    name: "Yadagirigutta",
    aliases: ["yadagirigutta", "yadadri", "hyderabad", "secunderabad", "bhongir"],
    lat: 17.5888,
    lng: 78.9405,
    state: "Telangana"
  },
  {
    name: "Bhadrachalam",
    aliases: ["bhadrachalam", "kothagudem", "godavari"],
    lat: 17.6688,
    lng: 80.8936,
    state: "Telangana"
  },
  {
    name: "Udupi",
    aliases: ["udupi", "udipi", "mangalore", "mangaluru", "karnataka"],
    lat: 13.3409,
    lng: 74.7523,
    state: "Karnataka"
  },
  {
    name: "Dwarka",
    aliases: ["dwarka", "dwaraka", "jagat mandir", "gujarat"],
    lat: 22.2376,
    lng: 68.9678,
    state: "Gujarat"
  },
  {
    name: "Somnath",
    aliases: ["somnath", "prabhas patan", "veraval", "gir somnath"],
    lat: 20.888,
    lng: 70.4013,
    state: "Gujarat"
  },
  {
    name: "Thiruvananthapuram",
    aliases: ["thiruvananthapuram", "trivandrum", "padmanabhaswamy", "kerala"],
    lat: 8.4831,
    lng: 76.9436,
    state: "Kerala"
  },
  {
    name: "Shirdi",
    aliases: ["shirdi", "ahmednagar", "nashik", "sai baba"],
    lat: 19.7668,
    lng: 74.4762,
    state: "Maharashtra"
  },
  {
    name: "Varanasi",
    aliases: ["varanasi", "kashi", "banaras", "benaras", "vishwanath", "ganga"],
    lat: 25.3109,
    lng: 83.0107,
    state: "Uttar Pradesh"
  },
  {
    name: "Kedarnath",
    aliases: ["kedarnath", "rudraprayag", "uttarakhand", "himalayas", "char dham"],
    lat: 30.7352,
    lng: 79.0669,
    state: "Uttarakhand"
  },
  {
    name: "Chennai",
    aliases: ["chennai", "madras"],
    lat: 13.0827,
    lng: 80.2707,
    state: "Tamil Nadu"
  },
  {
    name: "Bengaluru",
    aliases: ["bengaluru", "bangalore"],
    lat: 12.9716,
    lng: 77.5946,
    state: "Karnataka"
  }
];
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
function parseLocationQuery(rawQuery, userLat, userLng, userCityName) {
  const q = rawQuery.trim().toLowerCase();
  let remaining = q;
  let radiusKm = void 0;
  const radiusRegex = /(?:within|radius|in|under|around)\s*(\d+)\s*(?:km|kms|kilometers|kilometres)?/i;
  const directKmRegex = /(\d+)\s*(?:km|kms|kilometers|kilometres)/i;
  const rMatch = q.match(radiusRegex);
  if (rMatch) {
    radiusKm = parseInt(rMatch[1], 10);
    remaining = remaining.replace(rMatch[0], " ");
  } else {
    const dMatch = q.match(directKmRegex);
    if (dMatch) {
      radiusKm = parseInt(dMatch[1], 10);
      remaining = remaining.replace(dMatch[0], " ");
    }
  }
  const nearMeRegex = /(?:near\s+me|around\s+me|around\s+my\s+location|near\s+my\s+location|close\s+to\s+me|nearby|closest|around\s+here)/i;
  const isNearMe = nearMeRegex.test(q);
  if (isNearMe) {
    remaining = remaining.replace(nearMeRegex, " ");
  }
  const selectedLocRegex = /(?:my\s+selected\s+location|selected\s+location|current\s+location)/i;
  const isNearSelectedLocation = selectedLocRegex.test(q);
  if (isNearSelectedLocation) {
    remaining = remaining.replace(selectedLocRegex, " ");
  }
  let matchedLocation = void 0;
  for (const loc of KNOWN_LOCATIONS) {
    for (const alias of loc.aliases) {
      const aliasRegex = new RegExp(`\\b${alias}\\b`, "i");
      if (aliasRegex.test(remaining) || aliasRegex.test(q)) {
        matchedLocation = loc;
        remaining = remaining.replace(aliasRegex, " ");
        break;
      }
    }
    if (matchedLocation) break;
  }
  const fillerRegex = /\b(temples|temple|mandir|kovil|gudi|near|around|close|to|of|in|within|find|show|search|the|all|list|me)\b/gi;
  let cleanSearch = remaining.replace(fillerRegex, " ").replace(/\s+/g, " ").trim();
  let targetDeity = void 0;
  const deityKeywords = {
    shiva: "Shiva",
    siva: "Shiva",
    linga: "Shiva",
    jyotirlinga: "Shiva",
    vishnu: "Vishnu",
    venkateswara: "Venkateswara",
    balaji: "Venkateswara",
    krishna: "Krishna",
    durga: "Durga",
    ammavaru: "Durga",
    shakthi: "Durga",
    shakti: "Durga",
    devi: "Durga",
    narasimha: "Narasimha",
    rama: "Rama",
    ram: "Rama",
    ganesha: "Ganesha",
    vinayaka: "Ganesha",
    saibaba: "Saibaba",
    sai: "Saibaba"
  };
  for (const [key, deityName] of Object.entries(deityKeywords)) {
    const dRegex = new RegExp(`\\b${key}\\b`, "i");
    if (dRegex.test(q)) {
      targetDeity = deityName;
      cleanSearch = cleanSearch.replace(dRegex, " ").replace(/\s+/g, " ").trim();
      break;
    }
  }
  const hasLocationIntent = isNearMe || isNearSelectedLocation || matchedLocation !== void 0 || radiusKm !== void 0 || /^(temples?\s*(near|around|nearby|close|within|in))/i.test(q);
  let centerLocation = void 0;
  if (matchedLocation) {
    centerLocation = {
      name: matchedLocation.name,
      lat: matchedLocation.lat,
      lng: matchedLocation.lng
    };
  } else if (isNearSelectedLocation || isNearMe) {
    if (userLat !== void 0 && userLng !== void 0 && !isNaN(userLat) && !isNaN(userLng)) {
      centerLocation = {
        name: userCityName || "Your Location",
        lat: userLat,
        lng: userLng
      };
    } else {
      centerLocation = {
        name: "Tirupati (Default Hub)",
        lat: 13.6288,
        lng: 79.4192
      };
    }
  } else if (radiusKm !== void 0) {
    if (userLat !== void 0 && userLng !== void 0 && !isNaN(userLat) && !isNaN(userLng)) {
      centerLocation = {
        name: userCityName || "Your Location",
        lat: userLat,
        lng: userLng
      };
    } else {
      centerLocation = {
        name: "Tirupati (Default Hub)",
        lat: 13.6288,
        lng: 79.4192
      };
    }
  }
  let explanation = "";
  if (centerLocation && radiusKm) {
    explanation = `Showing temples within ${radiusKm} km of ${centerLocation.name}, ranked by nearest proximity.`;
  } else if (centerLocation) {
    explanation = `Showing temples near ${centerLocation.name}, ranked by shortest driving/aerial distance.`;
  } else if (hasLocationIntent) {
    explanation = `Showing temples ranked by proximity to your current location.`;
  }
  return {
    isLocationQuery: hasLocationIntent,
    radiusKm,
    centerLocation,
    isNearMe,
    isNearSelectedLocation,
    targetCity: matchedLocation?.name,
    targetDeity,
    cleanSearchText: cleanSearch,
    explanation
  };
}
function filterTemplesByLocationQuery(allTemples, rawQuery, userLat, userLng, userCityName) {
  const parsed = parseLocationQuery(rawQuery, userLat, userLng, userCityName);
  if (!parsed.isLocationQuery && !rawQuery.trim()) {
    if (userLat !== void 0 && userLng !== void 0) {
      const tagged = allTemples.map((t) => ({
        ...t,
        distanceKm: haversineKm(userLat, userLng, t.lat, t.lng)
      }));
      return { temples: tagged, parsed, isLocationFilterActive: false };
    }
    return { temples: allTemples, parsed, isLocationFilterActive: false };
  }
  let candidates = [...allTemples];
  if (parsed.targetDeity) {
    const dLower = parsed.targetDeity.toLowerCase();
    candidates = candidates.filter((t) => t.deity.toLowerCase().includes(dLower));
  }
  if (parsed.cleanSearchText) {
    const kw = parsed.cleanSearchText.toLowerCase();
    const keywordMatches = candidates.filter(
      (t) => t.name.toLowerCase().includes(kw) || t.deity.toLowerCase().includes(kw) || t.city.toLowerCase().includes(kw) || t.description.toLowerCase().includes(kw)
    );
    if (keywordMatches.length > 0) {
      candidates = keywordMatches;
    }
  }
  if (parsed.centerLocation) {
    const { lat: cLat, lng: cLng } = parsed.centerLocation;
    let withDistances = candidates.map((t) => ({
      ...t,
      distanceKm: haversineKm(cLat, cLng, t.lat, t.lng)
    }));
    if (parsed.radiusKm !== void 0 && parsed.radiusKm > 0) {
      withDistances = withDistances.filter(
        (t) => t.distanceKm !== void 0 && t.distanceKm <= parsed.radiusKm
      );
    } else if (parsed.targetCity) {
      const nearbyOnly = withDistances.filter(
        (t) => t.distanceKm !== void 0 && t.distanceKm <= 160
      );
      if (nearbyOnly.length > 0) {
        withDistances = nearbyOnly;
      }
    }
    withDistances.sort((a, b) => (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999));
    return {
      temples: withDistances,
      parsed,
      isLocationFilterActive: true
    };
  }
  const qLower = rawQuery.toLowerCase();
  const filtered = candidates.filter(
    (t) => t.name.toLowerCase().includes(qLower) || t.deity.toLowerCase().includes(qLower) || t.city.toLowerCase().includes(qLower) || t.state.toLowerCase().includes(qLower) || t.description.toLowerCase().includes(qLower)
  );
  return {
    temples: filtered,
    parsed,
    isLocationFilterActive: false
  };
}

// server/gemini.ts
var genAIClient = null;
var PREFERRED_MODELS = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite", "gemini-3.8-flash"];
var priestMatchCache = /* @__PURE__ */ new Map();
var duplicateDetectCache = /* @__PURE__ */ new Map();
var templeAssistantCache = /* @__PURE__ */ new Map();
var aiSearchCache = /* @__PURE__ */ new Map();
function getGenAI() {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return genAIClient;
}
async function callGeminiWithFallback(ai, prompt, config) {
  for (const model of PREFERRED_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config
      });
      if (response.text) {
        return response.text;
      }
    } catch (err) {
      const isQuotaOrRate = err?.status === 429 || err?.message?.includes("429") || err?.message?.includes("quota") || err?.message?.includes("RESOURCE_EXHAUSTED") || err?.message?.includes("limit");
      if (isQuotaOrRate) {
        continue;
      }
      break;
    }
  }
  return null;
}
async function aiTempleSearch(query, userLat, userLng) {
  const cacheKey = `${query.trim().toLowerCase()}_${userLat || 0}_${userLng || 0}`;
  if (aiSearchCache.has(cacheKey)) {
    return aiSearchCache.get(cacheKey);
  }
  const locationSearchResult = filterTemplesByLocationQuery(db.temples, query, userLat, userLng);
  const ai = getGenAI();
  if (locationSearchResult.isLocationFilterActive && locationSearchResult.temples.length > 0) {
    const ids = locationSearchResult.temples.map((t) => t.id);
    const topTemples = locationSearchResult.temples.slice(0, 3).map((t) => `${t.name} (${t.distanceKm} km away)`).join(", ");
    const fallbackExp = `${locationSearchResult.parsed.explanation} Closest: ${topTemples}.`;
    if (ai) {
      try {
        const prompt = `Devotee query: "${query}"
Matched nearby temples by real coordinates:
${JSON.stringify(locationSearchResult.temples.slice(0, 5).map((t) => ({ name: t.name, city: t.city, deity: t.deity, distanceKm: t.distanceKm })), null, 2)}

Provide a concise 1-2 sentence response summarizing these nearby temples, their exact distances, and spiritual significance.
Return valid JSON: { "explanation": "..." }`;
        const text = await callGeminiWithFallback(ai, prompt, {
          responseMimeType: "application/json",
          temperature: 0.2
        });
        if (text) {
          const parsed = JSON.parse(text.trim() || "{}");
          const result3 = {
            matchedTempleIds: ids,
            explanation: parsed.explanation || fallbackExp,
            extractedCriteria: {
              deity: locationSearchResult.parsed.targetDeity,
              city: locationSearchResult.parsed.centerLocation?.name,
              rituals: []
            }
          };
          aiSearchCache.set(cacheKey, result3);
          return result3;
        }
      } catch (e) {
      }
    }
    const result2 = {
      matchedTempleIds: ids,
      explanation: fallbackExp,
      extractedCriteria: {
        deity: locationSearchResult.parsed.targetDeity,
        city: locationSearchResult.parsed.centerLocation?.name,
        rituals: []
      }
    };
    aiSearchCache.set(cacheKey, result2);
    return result2;
  }
  const templeCatalog = db.temples.map((t) => ({
    id: t.id,
    name: t.name,
    deity: t.deity,
    city: t.city,
    state: t.state,
    description: t.description,
    pujas: t.pujas.map((p) => p.name).join(", "),
    timings: `${t.timings.morning}; ${t.timings.evening}`
  }));
  if (ai) {
    try {
      const prompt = `You are an expert Hindu temple search assistant for TempleConnect.
User query: "${query}"
Candidate Temples database:
${JSON.stringify(templeCatalog, null, 2)}

Analyze the user's intent (deities, traditions, location preferences, rituals, timings).
Select matching temple IDs ranked by relevance.
Return valid JSON only in this format:
{
  "matchedTempleIds": ["id1", "id2"],
  "explanation": "Brief 1-sentence rationale for the devotee",
  "extractedCriteria": {
    "deity": "Identified deity or null",
    "city": "Identified city or null",
    "rituals": ["identified ritual names"]
  }
}`;
      const text = await callGeminiWithFallback(ai, prompt, {
        responseMimeType: "application/json",
        temperature: 0.2
      });
      if (text) {
        const parsed = JSON.parse(text.trim() || "{}");
        if (Array.isArray(parsed.matchedTempleIds) && parsed.matchedTempleIds.length > 0) {
          aiSearchCache.set(cacheKey, parsed);
          return parsed;
        }
      }
    } catch (err) {
    }
  }
  if (locationSearchResult.temples.length > 0) {
    const result2 = {
      matchedTempleIds: locationSearchResult.temples.map((m) => m.id),
      explanation: locationSearchResult.parsed.explanation || `Found ${locationSearchResult.temples.length} temples matching "${query}".`,
      extractedCriteria: {
        deity: locationSearchResult.parsed.targetDeity,
        city: locationSearchResult.parsed.centerLocation?.name,
        rituals: []
      }
    };
    aiSearchCache.set(cacheKey, result2);
    return result2;
  }
  const qLower = query.toLowerCase();
  const matched = db.temples.filter((t) => {
    return t.name.toLowerCase().includes(qLower) || t.deity.toLowerCase().includes(qLower) || t.city.toLowerCase().includes(qLower) || t.state.toLowerCase().includes(qLower) || t.description.toLowerCase().includes(qLower) || t.pujas.some((p) => p.name.toLowerCase().includes(qLower));
  });
  const result = {
    matchedTempleIds: matched.map((m) => m.id),
    explanation: `Found ${matched.length} temples matching "${query}".`,
    extractedCriteria: {
      deity: query,
      city: void 0,
      rituals: []
    }
  };
  aiSearchCache.set(cacheKey, result);
  return result;
}
async function aiMatchPriestToVacancy(vacancy, priest) {
  const cacheKey = `${vacancy.id}_${priest.userId || priest.id}`;
  if (priestMatchCache.has(cacheKey)) {
    return priestMatchCache.get(cacheKey);
  }
  const ai = getGenAI();
  if (ai) {
    try {
      const prompt = `You are a Vedic hiring advisor assisting a Hindu Temple Trust.
Evaluate the compatibility between the Priest Profile and the Temple Vacancy based strictly on explicit ritual qualifications, Vedic lineage, experience years, and language skills.
DO NOT make final hiring decisions; provide an advisory score and breakdown.

Vacancy Details:
- Title: ${vacancy.title}
- Temple: ${vacancy.templeName}, ${vacancy.location}
- Required Vedic Tradition: ${vacancy.vedaTraditionRequired}
- Required Ritual Specializations: ${vacancy.ritualSpecialization.join(", ")}
- Minimum Experience Years: ${vacancy.minExperienceYears}
- Description: ${vacancy.description}

Priest Profile:
- Name: ${priest.fullName}
- Veda Tradition: ${priest.vedaTradition}
- Experience: ${priest.experienceYears} years
- Purohitham Skills: ${priest.purohithamSkills.join(", ")}
- Formal Training: ${priest.trainingQualifications}
- Languages: ${priest.languages.join(", ")}
- Achievements: ${priest.achievements}

Return JSON in this exact structure:
{
  "matchScore": 88,
  "strengths": ["string", "string"],
  "gaps": ["string"],
  "summary": "Concise 2-sentence objective summary",
  "recommendation": "Highly Recommended" | "Strong Candidate" | "Moderate Match" | "Gaps Detected"
}`;
      const text = await callGeminiWithFallback(ai, prompt, {
        responseMimeType: "application/json",
        temperature: 0.2
      });
      if (text) {
        const parsed = JSON.parse(text.trim() || "{}");
        if (typeof parsed.matchScore === "number") {
          priestMatchCache.set(cacheKey, parsed);
          return parsed;
        }
      }
    } catch (err) {
    }
  }
  let score = 50;
  const strengths = [];
  const gaps = [];
  if (priest.experienceYears >= vacancy.minExperienceYears) {
    score += 20;
    strengths.push(`Meets experience threshold (${priest.experienceYears} yrs vs ${vacancy.minExperienceYears} yrs required).`);
  } else {
    score -= 15;
    gaps.push(`Experience is below requested minimum (${priest.experienceYears} yrs vs ${vacancy.minExperienceYears} yrs).`);
  }
  const matchedSkills = vacancy.ritualSpecialization.filter(
    (rs) => priest.purohithamSkills.some((ps) => ps.toLowerCase().includes(rs.toLowerCase()) || rs.toLowerCase().includes(ps.toLowerCase()))
  );
  if (matchedSkills.length > 0) {
    score += Math.min(25, matchedSkills.length * 10);
    strengths.push(`Direct ritual expertise in: ${matchedSkills.join(", ")}.`);
  } else {
    gaps.push("No direct overlap found in stated primary ritual specializations.");
  }
  if (priest.vedaTradition && priest.vedaTradition.toLowerCase().includes("veda")) {
    score += 5;
    strengths.push(`Formally trained in ${priest.vedaTradition}.`);
  }
  const finalScore = Math.max(10, Math.min(99, score));
  let rec = "Moderate Match";
  if (finalScore >= 85) rec = "Highly Recommended";
  else if (finalScore >= 70) rec = "Strong Candidate";
  else if (finalScore < 50) rec = "Gaps Detected";
  const result = {
    matchScore: finalScore,
    strengths,
    gaps,
    summary: `${priest.fullName} scores ${finalScore}% compatibility based on Vedic tradition, ${priest.experienceYears} years experience, and ritual specializations.`,
    recommendation: rec
  };
  priestMatchCache.set(cacheKey, result);
  return result;
}
async function aiDetectDuplicateTemple(newTemple) {
  if (!newTemple.name || !newTemple.city) {
    return { isDuplicateLikely: false, confidence: 0 };
  }
  const cacheKey = `${newTemple.name.toLowerCase()}_${newTemple.city.toLowerCase()}`;
  if (duplicateDetectCache.has(cacheKey)) {
    return duplicateDetectCache.get(cacheKey);
  }
  const existingSummary = db.temples.map((t) => ({
    id: t.id,
    name: t.name,
    deity: t.deity,
    city: t.city,
    lat: t.lat,
    lng: t.lng
  }));
  const ai = getGenAI();
  if (ai) {
    try {
      const prompt = `You are a geospatial and heritage data integrity system for TempleConnect.
Evaluate if this newly submitted temple is a duplicate of an existing temple in the database.
Check for phonetic similarities in temple name, deity, and city proximity.

New Submission:
Name: ${newTemple.name}
Deity: ${newTemple.deity}
City: ${newTemple.city}
Address: ${newTemple.address}
Latitude: ${newTemple.lat || "unknown"}
Longitude: ${newTemple.lng || "unknown"}

Existing Temple Records:
${JSON.stringify(existingSummary, null, 2)}

Return JSON:
{
  "isDuplicateLikely": true or false,
  "confidence": number between 0 and 100,
  "existingTempleMatch": {
    "id": "matched temple id or null",
    "name": "matched temple name",
    "city": "matched city",
    "reason": "explanation of similarity"
  } or null,
  "warningMessage": "Short friendly warning if duplicate, else null"
}`;
      const text = await callGeminiWithFallback(ai, prompt, {
        responseMimeType: "application/json",
        temperature: 0.1
      });
      if (text) {
        const parsed = JSON.parse(text.trim() || "{}");
        duplicateDetectCache.set(cacheKey, parsed);
        return parsed;
      }
    } catch (err) {
    }
  }
  const newNameLower = newTemple.name.toLowerCase();
  const newCityLower = newTemple.city.toLowerCase();
  for (const t of db.temples) {
    const existingNameLower = t.name.toLowerCase();
    const existingCityLower = t.city.toLowerCase();
    if (existingCityLower === newCityLower && (existingNameLower.includes(newNameLower) || newNameLower.includes(existingNameLower))) {
      const result2 = {
        isDuplicateLikely: true,
        confidence: 85,
        existingTempleMatch: {
          id: t.id,
          name: t.name,
          city: t.city,
          reason: `A temple named "${t.name}" already exists in ${t.city}.`
        },
        warningMessage: `A temple with a similar name already exists in ${t.city} ("${t.name}"). Please verify to prevent duplicates.`
      };
      duplicateDetectCache.set(cacheKey, result2);
      return result2;
    }
  }
  const result = {
    isDuplicateLikely: false,
    confidence: 10
  };
  duplicateDetectCache.set(cacheKey, result);
  return result;
}
async function aiTempleAssistant(templeId, userQuestion) {
  const temple = db.temples.find((t) => t.id === templeId);
  if (!temple) {
    return "I could not find the verified record for this temple in the TempleConnect registry.";
  }
  const cacheKey = `${templeId}_${userQuestion.trim().toLowerCase()}`;
  if (templeAssistantCache.has(cacheKey)) {
    return templeAssistantCache.get(cacheKey);
  }
  const ai = getGenAI();
  if (ai) {
    try {
      const prompt = `You are TempleConnect's verified temple guide assistant for ${temple.name}.
Answer the devotee's question accurately using ONLY the verified database facts provided below.
If information is not known from the data (like ticket prices not listed or private sanctum photos), politely state that devotees should check directly with the temple office at ${temple.contact.phone}.
Do NOT make up false dates or timings.

Temple Verified Record:
- Name: ${temple.name}
- Deity: ${temple.deity}
- Location: ${temple.address}, ${temple.city}, ${temple.state}
- Timings: Morning ${temple.timings.morning}, Evening ${temple.timings.evening}
- Notes: ${temple.timings.notes || "None"}
- Special Days: ${temple.timings.specialDays || "None"}
- Pujas: ${temple.pujas.map((p) => `${p.name} at ${p.timing} (Significance: ${p.significance}, Fee: ${p.fee || "N/A"})`).join("; ")}
- Dress Code: ${temple.dressCode || "Traditional attire recommended"}
- Contact: ${temple.contact.phone}, ${temple.contact.email}
- History & Significance: ${temple.history}
- Description: ${temple.description}
- Upcoming Events: ${temple.events.map((e) => `${e.title} on ${e.date} at ${e.time}: ${e.description}`).join("; ") || "No upcoming events listed"}

Devotee Question: "${userQuestion}"
Provide a warm, polite, and helpful response:`;
      const text = await callGeminiWithFallback(ai, prompt, {
        temperature: 0.3
      });
      if (text) {
        templeAssistantCache.set(cacheKey, text);
        return text;
      }
    } catch (err) {
    }
  }
  const fallback = `Regarding ${temple.name}:
- Deity: ${temple.deity}
- Daily Timings: ${temple.timings.morning} & ${temple.timings.evening} (${temple.timings.notes || ""})
- Dress Code: ${temple.dressCode || "Traditional modest attire"}
- Temple Contact: ${temple.contact.phone} | ${temple.contact.email}
For special sevas, please visit the Pujas section.`;
  templeAssistantCache.set(cacheKey, fallback);
  return fallback;
}

// server/app.ts
function createApiApp() {
  const app2 = express();
  app2.use(express.json());
  app2.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "TempleConnect API" });
  });
  app2.get("/api/auth/demo-users", (_req, res) => {
    const demoAccounts = [
      {
        role: "user",
        label: "Devotee / General User",
        name: "Ramesh Kumar",
        email: "devotee@templeconnect.org",
        password: "password123",
        description: "Explore temples, search by radius/GPS, ask temple AI assistant, add missing temples."
      },
      {
        role: "admin",
        label: "Temple Admin (Meenakshi Amman)",
        name: "Sundaram Gurukkal (Trustee)",
        email: "admin@meenakshi.org",
        password: "password123",
        templeName: "Arulmigu Meenakshi Sundareswarar Temple",
        description: "Manage temple data, post vacancies, oversee applicants, grant/revoke contributor access, approve updates."
      },
      {
        role: "admin",
        label: "Temple Admin (Somnath Jyotirlinga)",
        name: "Dharmendra Shastri (Board)",
        email: "admin@somnath.org",
        password: "password123",
        templeName: "Shree Somnath Jyotirlinga Temple",
        description: "Manage Somnath vacancy, review Priest applications, shortlist candidates with AI matching."
      },
      {
        role: "priest",
        label: "Priest / Job Seeker (Sharma)",
        name: "Pandit Rajesh Sharma",
        email: "priest.sharma@vedic.org",
        password: "password123",
        description: "12 yrs experience (Rigveda). Shortlisted for Somnath. Verified contributor for Meenakshi Temple."
      },
      {
        role: "priest",
        label: "Priest / Job Seeker (Venkatachari)",
        name: "Shri Venkatachari Swami",
        email: "priest.venkat@vedic.org",
        password: "password123",
        description: "16 yrs experience (Pancharatra Agama). Search temple vacancies, apply, track status."
      }
    ];
    res.json(demoAccounts);
  });
  app2.post("/api/auth/login", (req, res) => {
    const { email, role } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const user = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && (!role || u.role === role)
    );
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials. User not found for this role." });
    }
    const token = generateToken(user);
    res.json({
      user,
      token,
      message: `Signed in as ${user.name} (${user.role.toUpperCase()})`
    });
  });
  app2.post("/api/auth/register", (req, res) => {
    const { name, email, role, phone, templeName, city } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ error: "Name, email, and role are required." });
    }
    const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: "User with this email already exists." });
    }
    const userId = `user-${Date.now()}`;
    let newTempleId = void 0;
    if (role === "admin" && templeName) {
      newTempleId = `temple-${Date.now()}`;
      const newTemple = {
        id: newTempleId,
        name: templeName,
        deity: req.body.deity || "Presiding Deity",
        city: city || "Unknown City",
        state: req.body.state || "India",
        address: req.body.address || `${city || "City Center"}`,
        lat: req.body.lat ? parseFloat(req.body.lat) : 12.9716,
        lng: req.body.lng ? parseFloat(req.body.lng) : 77.5946,
        description: req.body.description || "Sacred temple managed through TempleConnect.",
        history: req.body.history || "Ancient shrine with rich cultural heritage.",
        timings: {
          morning: "06:00 AM \u2013 12:00 PM",
          evening: "04:30 PM \u2013 08:30 PM",
          notes: "Special archana during morning and evening hours."
        },
        pujas: [
          { id: `p-${Date.now()}-1`, name: "Daily Nitya Puja", timing: "07:00 AM", significance: "Morning archana", fee: "Free" },
          { id: `p-${Date.now()}-2`, name: "Sandhya Arati", timing: "06:30 PM", significance: "Evening deepam", fee: "Free" }
        ],
        contact: {
          phone: phone || "+91 90000 00000",
          email
        },
        photos: [
          "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80"
        ],
        status: "pending_verification",
        adminId: userId,
        claimedBy: userId,
        claimStatus: "claimed",
        contributors: [],
        events: [],
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      db.temples.push(newTemple);
    }
    let priestProfileId = void 0;
    if (role === "priest") {
      priestProfileId = `priest-profile-${Date.now()}`;
      db.priestProfiles.push({
        id: priestProfileId,
        userId,
        fullName: name,
        experienceYears: req.body.experienceYears ? parseInt(req.body.experienceYears, 10) : 1,
        previousTemples: [],
        purohithamSkills: req.body.skills || ["Veda Parayanam", "Nitya Puja"],
        vedaTradition: req.body.vedaTradition || "Rigveda / Yajurveda",
        trainingQualifications: req.body.qualifications || "Veda Pathashala Trained",
        languages: req.body.languages || ["Sanskrit", "Hindi"],
        achievements: req.body.achievements || "",
        bio: req.body.bio || "Devout Purohit dedicated to traditional worship and rituals.",
        location: city || "India",
        phone: phone || "",
        email,
        shareContactConsent: true,
        availableForRelocation: true,
        expectedRemuneration: "\u20B930,000 \u2013 \u20B945,000 / month"
      });
    }
    const newUser = {
      id: userId,
      email,
      role,
      name,
      phone,
      templeId: newTempleId,
      priestProfileId,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.users.push(newUser);
    const token = generateToken(newUser);
    res.json({
      user: newUser,
      token,
      message: "Account successfully registered."
    });
  });
  app2.get("/api/auth/me", authenticateToken, (req, res) => {
    res.json({ user: req.user });
  });
  app2.get("/api/temples", (req, res) => {
    const { city, lat, lng, radiusKm, search, deity, sort } = req.query;
    const userLat = lat ? parseFloat(lat) : void 0;
    const userLng = lng ? parseFloat(lng) : void 0;
    const maxRadius = radiusKm ? parseFloat(radiusKm) : void 0;
    const userCityName = typeof city === "string" && city.trim() !== "" && city !== "All Cities" ? city : void 0;
    let results = [...db.temples];
    let locationFilterInfo = null;
    if (search && typeof search === "string" && search.trim() !== "") {
      const locResult = filterTemplesByLocationQuery(
        results,
        search,
        userLat,
        userLng,
        userCityName
      );
      results = locResult.temples;
      if (locResult.isLocationFilterActive) {
        locationFilterInfo = {
          isActive: true,
          explanation: locResult.parsed.explanation,
          radiusKm: locResult.parsed.radiusKm,
          center: locResult.parsed.centerLocation
        };
      }
    } else {
      if (userLat !== void 0 && userLng !== void 0 && !isNaN(userLat) && !isNaN(userLng)) {
        results = results.map((t) => {
          const dist = haversineKm(userLat, userLng, t.lat, t.lng);
          return { ...t, distanceKm: dist };
        });
        if (maxRadius && !isNaN(maxRadius) && maxRadius > 0) {
          results = results.filter((t) => t.distanceKm !== void 0 ? t.distanceKm <= maxRadius : true);
        }
      }
    }
    if (deity && typeof deity === "string" && deity !== "All Deities") {
      const deityLower = deity.toLowerCase();
      results = results.filter((t) => t.deity.toLowerCase().includes(deityLower));
    }
    if (userCityName && (!search || !locationFilterInfo?.isActive)) {
      results = results.filter((t) => t.city.toLowerCase() === userCityName.toLowerCase());
    }
    if (sort === "distance" || !sort && (userLat !== void 0 || locationFilterInfo?.isActive)) {
      results.sort((a, b) => {
        if (a.distanceKm === void 0 && b.distanceKm === void 0) return 0;
        if (a.distanceKm === void 0) return 1;
        if (b.distanceKm === void 0) return -1;
        return a.distanceKm - b.distanceKm;
      });
    } else if (sort === "name") {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }
    res.json({
      temples: results,
      total: results.length,
      userLocation: userLat && userLng ? { lat: userLat, lng: userLng } : null,
      locationFilter: locationFilterInfo
    });
  });
  app2.get("/api/temples/:id", (req, res) => {
    const temple = db.temples.find((t) => t.id === req.params.id);
    if (!temple) {
      return res.status(404).json({ error: "Temple not found" });
    }
    res.json(temple);
  });
  app2.post("/api/temples", authenticateToken, async (req, res) => {
    const { name, deity, city, state, address, lat, lng, description, history, timings, pujas, contact, photos } = req.body;
    if (!name || !city) {
      return res.status(400).json({ error: "Temple name and city are required." });
    }
    const duplicateCheck = await aiDetectDuplicateTemple({
      name,
      deity: deity || "",
      city,
      address: address || city,
      lat: lat ? parseFloat(lat) : void 0,
      lng: lng ? parseFloat(lng) : void 0
    });
    const newTemple = {
      id: `temple-${Date.now()}`,
      name,
      deity: deity || "Hindu Deity",
      city,
      state: state || "India",
      address: address || `${city}, ${state || "India"}`,
      lat: lat ? parseFloat(lat) : 13.0827,
      lng: lng ? parseFloat(lng) : 80.2707,
      description: description || "Sacred temple community submission.",
      history: history || "",
      timings: timings || {
        morning: "06:00 AM \u2013 12:00 PM",
        evening: "04:30 PM \u2013 08:30 PM"
      },
      pujas: pujas || [
        { id: `p-${Date.now()}-1`, name: "Daily Nitya Puja", timing: "07:00 AM", significance: "Nitya Archana", fee: "Free" }
      ],
      contact: contact || {
        phone: req.user?.phone || "+91 90000 00000",
        email: req.user?.email || "temple@vedic.org"
      },
      photos: photos && photos.length > 0 ? photos : [
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80"
      ],
      status: "pending_verification",
      contributors: [],
      events: [],
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.temples.push(newTemple);
    const newLog = {
      id: `audit-${Date.now()}`,
      templeId: newTemple.id,
      performedBy: req.user.name,
      action: "TEMPLE_SUBMITTED",
      details: `Devotee submitted new temple: "${name}" (${city}). Verification status: pending.`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.auditLogs.push(newLog);
    res.status(201).json({
      temple: newTemple,
      duplicateWarning: duplicateCheck.isDuplicateLikely ? duplicateCheck : null,
      message: "Temple submitted for community verification."
    });
  });
  app2.post("/api/temples/:id/claim", authenticateToken, (req, res) => {
    const temple = db.temples.find((t) => t.id === req.params.id);
    if (!temple) return res.status(404).json({ error: "Temple not found" });
    if (temple.claimedBy || temple.claimStatus === "claimed") {
      return res.status(400).json({ error: "This temple has already been claimed and verified." });
    }
    const { officialRole, phone, email, verificationDocs } = req.body;
    if (!officialRole || !phone) {
      return res.status(400).json({ error: "Official role and phone are required for claim verification." });
    }
    const claim = {
      id: `claim-${Date.now()}`,
      templeId: temple.id,
      templeName: temple.name,
      applicantUserId: req.user.id,
      applicantName: req.user.name,
      officialRole,
      phone,
      email: email || req.user.email,
      verificationDocs: verificationDocs || "Official Trustee Resolution / HR&CE ID Proof",
      status: req.user.role === "admin" ? "verified" : "pending",
      submittedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.claimRequests.push(claim);
    if (req.user.role === "admin") {
      temple.claimedBy = req.user.id;
      temple.adminId = req.user.id;
      temple.claimStatus = "claimed";
    } else {
      temple.claimStatus = "claim_pending";
    }
    res.json({
      claim,
      message: req.user.role === "admin" ? "Temple officially linked to your admin account!" : "Claim request submitted. Admin team will verify legal trustee documentation."
    });
  });
  app2.get("/api/admin/my-temple", authenticateToken, requireRole(["admin"]), (req, res) => {
    let temple = db.temples.find((t) => t.adminId === req.user.id || t.claimedBy === req.user.id);
    if (!temple && req.user.templeId) {
      temple = db.temples.find((t) => t.id === req.user.templeId);
    }
    if (!temple && db.temples.length > 0) {
      temple = db.temples[0];
      temple.adminId = req.user.id;
    }
    if (!temple) {
      return res.status(404).json({ error: "No temple managed by this admin yet." });
    }
    res.json(temple);
  });
  app2.put("/api/admin/temples/:templeId", authenticateToken, requireRole(["admin"]), requireTempleOwnership, (req, res) => {
    const temple = db.temples.find((t) => t.id === req.params.templeId);
    if (!temple) return res.status(404).json({ error: "Temple not found" });
    const updatable = [
      "name",
      "deity",
      "city",
      "state",
      "address",
      "lat",
      "lng",
      "description",
      "history",
      "timings",
      "pujas",
      "contact",
      "photos"
    ];
    updatable.forEach((key) => {
      if (req.body[key] !== void 0) {
        temple[key] = req.body[key];
      }
    });
    temple.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    db.auditLogs.push({
      id: `audit-${Date.now()}`,
      templeId: temple.id,
      performedBy: req.user.name,
      action: "TEMPLE_UPDATED",
      details: `Admin updated temple details.`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    res.json({ temple, message: "Temple profile successfully updated." });
  });
  app2.post("/api/admin/temples/:templeId/events", authenticateToken, requireRole(["admin"]), requireTempleOwnership, (req, res) => {
    const temple = db.temples.find((t) => t.id === req.params.templeId);
    if (!temple) return res.status(404).json({ error: "Temple not found" });
    const { title, date, time, description } = req.body;
    if (!title || !date) {
      return res.status(400).json({ error: "Event title and date are required." });
    }
    const newEvent = {
      id: `ev-${Date.now()}`,
      title,
      date,
      time: time || "08:00 AM",
      description: description || ""
    };
    if (!temple.events) temple.events = [];
    temple.events.push(newEvent);
    res.status(201).json({ event: newEvent, message: "Festival/Event scheduled." });
  });
  app2.delete("/api/admin/temples/:templeId/events/:eventId", authenticateToken, requireRole(["admin"]), requireTempleOwnership, (req, res) => {
    const temple = db.temples.find((t) => t.id === req.params.templeId);
    if (!temple) return res.status(404).json({ error: "Temple not found" });
    temple.events = (temple.events || []).filter((e) => e.id !== req.params.eventId);
    res.json({ message: "Event removed." });
  });
  app2.get("/api/admin/temples/:templeId/vacancies", authenticateToken, requireRole(["admin"]), (req, res) => {
    const vacancies = db.vacancies.filter((v) => v.templeId === req.params.templeId);
    res.json(vacancies);
  });
  app2.post("/api/admin/temples/:templeId/vacancies", authenticateToken, requireRole(["admin"]), requireTempleOwnership, (req, res) => {
    const temple = db.temples.find((t) => t.id === req.params.templeId);
    if (!temple) return res.status(404).json({ error: "Temple not found" });
    const {
      title,
      vedaTraditionRequired,
      minExperienceYears,
      ritualSpecialization,
      accommodationProvided,
      foodProvided,
      remuneration,
      description
    } = req.body;
    if (!title || !vedaTraditionRequired) {
      return res.status(400).json({ error: "Job title and Veda / Agama tradition are required." });
    }
    const newVacancy = {
      id: `vac-${Date.now()}`,
      templeId: temple.id,
      templeName: temple.name,
      location: `${temple.city}, ${temple.state}`,
      title,
      vedaTraditionRequired,
      minExperienceYears: parseInt(minExperienceYears, 10) || 3,
      ritualSpecialization: ritualSpecialization || ["Daily Nitya Archana", "Veda Parayanam"],
      accommodationProvided: accommodationProvided ?? true,
      foodProvided: foodProvided ?? true,
      remuneration: remuneration || "\u20B935,000 \u2013 \u20B950,000 / month",
      description: description || "Seeking experienced Vedic priest for sanctum seva.",
      status: "open",
      postedDate: (/* @__PURE__ */ new Date()).toISOString(),
      applicantsCount: 0
    };
    db.vacancies.push(newVacancy);
    db.users.filter((u) => u.role === "priest").forEach((p) => {
      db.notifications.push({
        id: `notif-${Date.now()}-${p.id}`,
        userId: p.id,
        type: "application",
        title: `New Vacancy: ${title}`,
        message: `${temple.name} (${temple.city}) is hiring: ${title}.`,
        link: `/priest`,
        read: false,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    });
    res.status(201).json({ vacancy: newVacancy, message: "Vacancy published successfully." });
  });
  app2.get("/api/admin/temples/:templeId/applications", authenticateToken, requireRole(["admin"]), (req, res) => {
    const apps = db.applications.filter((a) => a.templeId === req.params.templeId);
    res.json(apps);
  });
  app2.put("/api/admin/applications/:applicationId/status", authenticateToken, requireRole(["admin"]), (req, res) => {
    const appRecord = db.applications.find((a) => a.id === req.params.applicationId);
    if (!appRecord) return res.status(404).json({ error: "Application not found" });
    const { status, adminNotes } = req.body;
    appRecord.status = status;
    if (adminNotes !== void 0) appRecord.adminNotes = adminNotes;
    appRecord.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    db.notifications.push({
      id: `notif-${Date.now()}`,
      userId: appRecord.priestId,
      type: "status_change",
      title: `Application Update: ${appRecord.templeName}`,
      message: `Your application status for ${appRecord.vacancyTitle} is now: ${status.toUpperCase().replace("_", " ")}.`,
      link: "/priest",
      read: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    res.json({ application: appRecord, message: `Status updated to ${status}.` });
  });
  app2.get("/api/admin/temples/:templeId/contributors", authenticateToken, requireRole(["admin"]), (req, res) => {
    const temple = db.temples.find((t) => t.id === req.params.templeId);
    if (!temple) return res.status(404).json({ error: "Temple not found" });
    const authorized = (temple.contributors || []).map((userId) => {
      const u = db.users.find((user) => user.id === userId);
      const profile = db.priestProfiles.find((p) => p.userId === userId);
      return {
        id: userId,
        userId,
        name: u?.name || profile?.fullName || "Contributor",
        email: u?.email || profile?.email || "",
        vedaTradition: profile?.vedaTradition || "Vedic Scholar",
        role: u?.role || "priest"
      };
    });
    const availablePriests = db.users.filter((u) => u.role === "priest" && !(temple.contributors || []).includes(u.id)).map((u) => {
      const profile = db.priestProfiles.find((p) => p.userId === u.id);
      return {
        id: u.id,
        userId: u.id,
        name: u.name,
        email: u.email,
        vedaTradition: profile?.vedaTradition || "Vedic Tradition",
        experienceYears: profile?.experienceYears || 0
      };
    });
    res.json({
      contributors: authorized,
      availablePriests
    });
  });
  app2.post("/api/admin/temples/:templeId/contributors/grant", authenticateToken, requireRole(["admin"]), requireTempleOwnership, (req, res) => {
    const temple = db.temples.find((t) => t.id === req.params.templeId);
    if (!temple) return res.status(404).json({ error: "Temple not found" });
    const { priestUserId } = req.body;
    if (!priestUserId) return res.status(400).json({ error: "priestUserId is required." });
    if (!temple.contributors) temple.contributors = [];
    if (!temple.contributors.includes(priestUserId)) {
      temple.contributors.push(priestUserId);
    }
    db.notifications.push({
      id: `notif-${Date.now()}`,
      userId: priestUserId,
      type: "contributor_update",
      title: "Contributor Access Granted",
      message: `You are now an authorized contributor for ${temple.name}. You can update timings and rituals.`,
      link: "/priest",
      read: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    res.json({ message: "Contributor access granted.", contributors: temple.contributors });
  });
  app2.post("/api/admin/temples/:templeId/contributors/revoke", authenticateToken, requireRole(["admin"]), requireTempleOwnership, (req, res) => {
    const temple = db.temples.find((t) => t.id === req.params.templeId);
    if (!temple) return res.status(404).json({ error: "Temple not found" });
    const { priestUserId } = req.body;
    temple.contributors = (temple.contributors || []).filter((id) => id !== priestUserId);
    res.json({ message: "Contributor access revoked.", contributors: temple.contributors });
  });
  app2.get("/api/admin/temples/:templeId/proposals", authenticateToken, requireRole(["admin"]), (req, res) => {
    const list = db.contributorProposals.filter((p) => p.templeId === req.params.templeId);
    res.json(list);
  });
  app2.post("/api/admin/proposals/:proposalId/review", authenticateToken, requireRole(["admin"]), (req, res) => {
    const proposal = db.contributorProposals.find((p) => p.id === req.params.proposalId);
    if (!proposal) return res.status(404).json({ error: "Proposal not found" });
    const { action, feedback } = req.body;
    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ error: "Action must be approve or reject." });
    }
    const decision = action === "approve" ? "approved" : "rejected";
    proposal.status = decision;
    proposal.adminFeedback = feedback || "";
    proposal.reviewedAt = (/* @__PURE__ */ new Date()).toISOString();
    const temple = db.temples.find((t) => t.id === proposal.templeId);
    if (decision === "approved" && temple) {
      if (proposal.updateType === "timings" && proposal.proposedData) {
        temple.timings = { ...temple.timings, ...proposal.proposedData };
      } else if (proposal.updateType === "pujas" && proposal.proposedData) {
        temple.pujas = proposal.proposedData;
      }
      temple.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    }
    db.notifications.push({
      id: `notif-${Date.now()}`,
      userId: proposal.priestId,
      type: "contributor_update",
      title: `Update Proposal ${decision.toUpperCase()}`,
      message: `Your proposed updates for ${proposal.templeName} have been ${decision}.`,
      link: "/priest",
      read: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    res.json({ proposal, temple, message: `Proposal ${decision}.` });
  });
  app2.get("/api/admin/temples/:templeId/audit-logs", authenticateToken, requireRole(["admin"]), (req, res) => {
    const list = db.auditLogs.filter((l) => l.templeId === req.params.templeId);
    res.json(list);
  });
  app2.get(["/api/priest/profile", "/api/priests/me/profile"], authenticateToken, requireRole(["priest"]), (req, res) => {
    let profile = db.priestProfiles.find((p) => p.userId === req.user.id);
    if (!profile) {
      profile = {
        id: `priest-profile-${Date.now()}`,
        userId: req.user.id,
        fullName: req.user.name,
        experienceYears: 1,
        previousTemples: [],
        purohithamSkills: ["Nitya Puja"],
        vedaTradition: "Rigveda",
        trainingQualifications: "Veda Pathashala",
        languages: ["Sanskrit", "Hindi"],
        achievements: "",
        bio: "",
        location: "India",
        phone: req.user.phone || "",
        email: req.user.email,
        shareContactConsent: true,
        availableForRelocation: true,
        expectedRemuneration: "\u20B935,000 / month"
      };
      db.priestProfiles.push(profile);
    }
    res.json(profile);
  });
  app2.put(["/api/priest/profile", "/api/priests/me/profile"], authenticateToken, requireRole(["priest"]), (req, res) => {
    let profile = db.priestProfiles.find((p) => p.userId === req.user.id);
    if (!profile) {
      profile = {
        id: `priest-profile-${Date.now()}`,
        userId: req.user.id,
        fullName: req.user.name,
        experienceYears: 0,
        previousTemples: [],
        purohithamSkills: [],
        vedaTradition: "",
        trainingQualifications: "",
        languages: [],
        achievements: "",
        bio: "",
        location: "",
        phone: req.user.phone || "",
        email: req.user.email,
        shareContactConsent: true,
        availableForRelocation: true,
        expectedRemuneration: ""
      };
      db.priestProfiles.push(profile);
    }
    const fields = [
      "fullName",
      "experienceYears",
      "previousTemples",
      "purohithamSkills",
      "vedaTradition",
      "trainingQualifications",
      "languages",
      "achievements",
      "bio",
      "location",
      "phone",
      "email",
      "shareContactConsent",
      "availableForRelocation",
      "expectedRemuneration"
    ];
    fields.forEach((k) => {
      if (req.body[k] !== void 0) {
        profile[k] = req.body[k];
      }
    });
    res.json({ profile, message: "Priest profile updated successfully." });
  });
  app2.get(["/api/vacancies", "/api/priests/vacancies"], (req, res) => {
    const { tradition, skill, city, accommodation } = req.query;
    let list = db.vacancies.filter((v) => v.status === "open");
    if (tradition && typeof tradition === "string" && tradition !== "All Traditions") {
      const tradLower = tradition.toLowerCase();
      list = list.filter((v) => v.vedaTraditionRequired.toLowerCase().includes(tradLower));
    }
    if (skill && typeof skill === "string") {
      const skillLower = skill.toLowerCase();
      list = list.filter(
        (v) => v.ritualSpecialization.some((s) => s.toLowerCase().includes(skillLower))
      );
    }
    if (city && typeof city === "string" && city !== "All Cities") {
      list = list.filter((v) => v.location.toLowerCase().includes(city.toLowerCase()));
    }
    if (accommodation === "true") {
      list = list.filter((v) => v.accommodationProvided);
    }
    res.json(list);
  });
  app2.get("/api/vacancies/:id", (req, res) => {
    const vac = db.vacancies.find((v) => v.id === req.params.id);
    if (!vac) return res.status(404).json({ error: "Vacancy not found" });
    res.json(vac);
  });
  app2.post(["/api/priest/apply", "/api/priests/vacancies/:vacancyId/apply"], authenticateToken, requireRole(["priest"]), (req, res) => {
    const vacancyId = req.params.vacancyId || req.body.vacancyId;
    const { coverNote, availableFrom } = req.body;
    if (!vacancyId) return res.status(400).json({ error: "vacancyId is required." });
    const vacancy = db.vacancies.find((v) => v.id === vacancyId);
    if (!vacancy) return res.status(404).json({ error: "Vacancy not found or has expired." });
    const existing = db.applications.find(
      (a) => a.vacancyId === vacancyId && a.priestId === req.user.id
    );
    if (existing) {
      return res.status(400).json({ error: "You have already applied for this vacancy." });
    }
    const profile = db.priestProfiles.find((p) => p.userId === req.user.id);
    if (!profile) {
      return res.status(400).json({ error: "Please complete your Priest Profile before applying." });
    }
    const newApp = {
      id: `app-${Date.now()}`,
      vacancyId: vacancy.id,
      vacancyTitle: vacancy.title,
      templeId: vacancy.templeId,
      templeName: vacancy.templeName,
      priestId: req.user.id,
      priestName: profile.fullName || req.user.name,
      priestPhone: profile.phone || req.user.phone,
      priestEmail: profile.email || req.user.email,
      priestExperience: profile.experienceYears,
      priestSkills: profile.purohithamSkills,
      priestVeda: profile.vedaTradition,
      priestLanguages: profile.languages,
      coverNote: coverNote || "Pranam. I would be honored to render sanctum services for the temple.",
      availableFrom: availableFrom || "Immediate / 15 Days",
      status: "submitted",
      submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.applications.push(newApp);
    const temple = db.temples.find((t) => t.id === vacancy.templeId);
    if (temple && temple.adminId) {
      db.notifications.push({
        id: `notif-${Date.now()}`,
        userId: temple.adminId,
        type: "application",
        title: `New Applicant for ${vacancy.title}`,
        message: `${profile.fullName} (${profile.vedaTradition}, ${profile.experienceYears} yrs exp) applied.`,
        link: "/admin",
        read: false,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    res.status(201).json({ application: newApp, message: "Application submitted to Temple Board." });
  });
  app2.get(["/api/priest/my-applications", "/api/priests/me/applications"], authenticateToken, requireRole(["priest"]), (req, res) => {
    const list = db.applications.filter((a) => a.priestId === req.user.id);
    res.json(list);
  });
  app2.put("/api/priests/me/applications/:applicationId/withdraw", authenticateToken, requireRole(["priest"]), (req, res) => {
    const appRecord = db.applications.find((a) => a.id === req.params.applicationId && a.priestId === req.user.id);
    if (!appRecord) return res.status(404).json({ error: "Application not found" });
    appRecord.status = "withdrawn";
    appRecord.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    res.json({ application: appRecord, message: "Application withdrawn." });
  });
  app2.get("/api/priests/me/contributor-temples", authenticateToken, requireRole(["priest"]), (req, res) => {
    const temples = db.temples.filter((t) => t.contributors && t.contributors.includes(req.user.id));
    res.json(temples);
  });
  app2.get(["/api/priest/my-proposals", "/api/priests/me/proposals"], authenticateToken, requireRole(["priest"]), (req, res) => {
    const list = db.contributorProposals.filter((p) => p.priestId === req.user.id);
    res.json(list);
  });
  app2.post(
    ["/api/priest/temples/:templeId/propose-update", "/api/priests/temples/:templeId/propose-update"],
    authenticateToken,
    requireRole(["priest"]),
    requireContributorAccess,
    (req, res) => {
      const temple = db.temples.find((t) => t.id === req.params.templeId);
      if (!temple) return res.status(404).json({ error: "Temple not found" });
      const { updateType, proposedData, rationale } = req.body;
      if (!rationale) {
        return res.status(400).json({ error: "Rationale of proposed changes is required." });
      }
      const proposal = {
        id: `prop-${Date.now()}`,
        templeId: temple.id,
        templeName: temple.name,
        priestId: req.user.id,
        priestName: req.user.name,
        updateType: updateType || "timings",
        proposedData: proposedData || {},
        rationale,
        status: "pending_admin_review",
        submittedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      db.contributorProposals.push(proposal);
      if (temple.adminId) {
        db.notifications.push({
          id: `notif-${Date.now()}`,
          userId: temple.adminId,
          type: "contributor_update",
          title: `Update Proposed for ${temple.name}`,
          message: `${req.user.name} submitted updates: "${rationale}".`,
          link: "/admin",
          read: false,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      res.status(201).json({ proposal, message: "Update proposal submitted for Temple Admin approval." });
    }
  );
  app2.get("/api/messages", authenticateToken, (req, res) => {
    const list = db.messages.filter((m) => m.senderId === req.user.id || m.recipientId === req.user.id).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    res.json(list);
  });
  app2.post("/api/messages", authenticateToken, (req, res) => {
    const { recipientId, content, templeId, applicationId } = req.body;
    if (!content || !recipientId) {
      return res.status(400).json({ error: "Recipient and content are required." });
    }
    const recipient = db.users.find((u) => u.id === recipientId);
    const newMsg = {
      id: `msg-${Date.now()}`,
      applicationId,
      templeId: templeId || "",
      senderId: req.user.id,
      senderName: req.user.name,
      senderRole: req.user.role,
      recipientId,
      recipientName: recipient?.name || "User",
      content,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      read: false
    };
    db.messages.push(newMsg);
    db.notifications.push({
      id: `notif-${Date.now()}`,
      userId: recipientId,
      type: "message",
      title: `Message from ${req.user.name}`,
      message: content.length > 60 ? `${content.substring(0, 60)}...` : content,
      link: req.user.role === "admin" ? "/priest" : "/admin",
      read: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    res.status(201).json(newMsg);
  });
  app2.get("/api/notifications", authenticateToken, (req, res) => {
    const list = db.notifications.filter((n) => n.userId === req.user.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(list);
  });
  app2.put("/api/notifications/:id/read", authenticateToken, (req, res) => {
    const notif = db.notifications.find((n) => n.id === req.params.id && n.userId === req.user.id);
    if (notif) notif.read = true;
    res.json({ success: true });
  });
  app2.put("/api/notifications/read-all", authenticateToken, (req, res) => {
    db.notifications.filter((n) => n.userId === req.user.id).forEach((n) => n.read = true);
    res.json({ success: true });
  });
  app2.post("/api/ai/temple-search", async (req, res) => {
    const { query, lat, lng } = req.body;
    if (!query) return res.status(400).json({ error: "Search query is required." });
    const searchResult = await aiTempleSearch(query, lat, lng);
    let matchedTemples = searchResult.matchedTempleIds.map((id) => db.temples.find((t) => t.id === id)).filter((t) => Boolean(t));
    if (lat !== void 0 && lng !== void 0 && !isNaN(lat) && !isNaN(lng)) {
      matchedTemples = matchedTemples.map((t) => ({
        ...t,
        distanceKm: haversineKm(lat, lng, t.lat, t.lng)
      }));
    }
    res.json({
      ...searchResult,
      temples: matchedTemples
    });
  });
  app2.post("/api/ai/match-priest", authenticateToken, async (req, res) => {
    const { vacancyId, priestId } = req.body;
    const vacancy = db.vacancies.find((v) => v.id === vacancyId);
    const priest = db.priestProfiles.find((p) => p.userId === priestId || p.id === priestId);
    if (!vacancy || !priest) {
      return res.status(404).json({ error: "Vacancy or Priest profile not found." });
    }
    const matchAnalysis = await aiMatchPriestToVacancy(vacancy, priest);
    res.json(matchAnalysis);
  });
  app2.post("/api/ai/detect-duplicate", async (req, res) => {
    const { name, deity, city, address, lat, lng } = req.body;
    if (!name || !city) {
      return res.status(400).json({ error: "Temple name and city are required." });
    }
    const detection = await aiDetectDuplicateTemple({
      name,
      deity: deity || "",
      city,
      address: address || city,
      lat,
      lng
    });
    res.json(detection);
  });
  app2.post("/api/ai/temple-assistant", async (req, res) => {
    const { templeId, question } = req.body;
    if (!templeId || !question) {
      return res.status(400).json({ error: "Temple ID and question are required." });
    }
    const answer = await aiTempleAssistant(templeId, question);
    res.json({ answer });
  });
  return app2;
}

// server/api-entry.ts
var app = createApiApp();
var api_entry_default = app;
export {
  api_entry_default as default
};
