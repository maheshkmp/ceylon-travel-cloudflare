export const itineraries = {
  "signature-highlands": {
    title: "The Signature Highlands",
    slug: "signature-highlands",
    duration: "7 Days / 6 Nights",
    price: "from $850 per person",
    pace: "Active & Immersive",
    travelStyle: "Private Boutique",
    bestFor: "Nature & Culture Lovers",
    tags: ["Culture", "Nature", "Train Ride", "Signature"],
    heroImg: "https://images.unsplash.com/photo-1546708973-b339540b5162?w=1800&q=90&auto=format&fit=crop",
    overview: "Our most requested journey. Experience the absolute highlights of the island — from the ancient rock fortress of Sigiriya to the misty tea plantations of Ella and the scenic mountain railway. Perfect for first-time visitors seeking a balance of history, scenery, and local soul.",
    highlights: [
      "Dawn climb of the Sigiriya Lion Rock fortress",
      "Cycling through the medieval ruins of Polonnaruwa",
      "Private sunset safari in Minneriya National Park",
      "World's most beautiful train ride: Kandy to Ella",
      "Guided tea factory tour and private tasting session"
    ],
    days: [
      {
        day: "01",
        title: "Arrival & Spice Garden",
        place: "Negombo → Dambulla",
        body: "Upon arrival, head inland towards the cultural triangle. Stop at a local spice garden to learn about Ceylon's famous cinnamon and cardamom. Settle into your boutique guesthouse and enjoy a traditional village dinner.",
        img: "https://images.unsplash.com/photo-1598001306079-68741f00e8df?w=800&q=80",
        activities: ["Spice Garden Walk", "Traditional Dinner"],
        travelTime: "4 hrs driving",
        meals: { b: false, l: false, d: true },
        accommodation: "Heritage Boutique Guesthouse"
      },
      {
        day: "02",
        title: "The Golden Caves",
        place: "Dambulla",
        body: "Explore the Dambulla Cave Temple, a UNESCO site dating back to the 1st century BC. Marvel at the 157 Buddha statues and expansive ceiling frescoes. Spend the afternoon at leisure by the pool.",
        img: "https://images.unsplash.com/photo-1609340040197-3af498a6d8e4?w=800&q=80",
        activities: ["Cave Temple Tour", "Village Market Visit"],
        travelTime: "Local travel",
        meals: { b: true, l: false, d: false },
        accommodation: "Heritage Boutique Guesthouse"
      },
      {
        day: "03",
        title: "Sigiriya: The Lion Rock",
        place: "Sigiriya",
        body: "Rise early for a dawn ascent of Sigiriya Rock. Beat the heat and the crowds to stand atop the ruins of King Kassapa's palace. The 360-degree views of the jungle below are unforgettable.",
        img: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
        activities: ["Rock Fortress Climb", "Ancient Water Gardens"],
        travelTime: "1 hr total",
        meals: { b: true, l: false, d: false },
        accommodation: "Jungle-side Eco Lodge"
      },
      {
        day: "04",
        title: "Medieval Ruins by Bike",
        place: "Polonnaruwa",
        body: "Cycle between the scattered ruins of Polonnaruwa. Visit the Gal Vihara to see the giant reclining Buddha carved into a single granite face. Lunch is served at a local farmhouse.",
        img: "https://images.unsplash.com/photo-1586861203927-800a5acdcc6d?w=800&q=80",
        activities: ["Cycling Tour", "Gal Vihara Visit"],
        travelTime: "1.5 hrs driving",
        meals: { b: true, l: true, d: false },
        accommodation: "Jungle-side Eco Lodge"
      },
      {
        day: "05",
        title: "The Great Gathering",
        place: "Minneriya National Park",
        body: "Witness one of nature's great spectacles. Board a private 4x4 for a sunset safari in Minneriya, where hundreds of wild elephants gather around the ancient tank to drink and socialise.",
        img: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=800&q=80",
        activities: ["Private 4x4 Safari", "Wildlife Photography"],
        travelTime: "2 hrs driving",
        meals: { b: true, l: false, d: false },
        accommodation: "Eco-Luxe Tented Camp"
      },
      {
        day: "06",
        title: "Mist & Mountain Trains",
        place: "Kandy → Ella",
        body: "Board the morning train from Kandy. Wind through emerald tea estates, cross colonial viaducts, and watch the landscape shift from tropical palms to misty cloud forests as you reach Ella.",
        img: "https://images.unsplash.com/photo-1602215863697-6aeabd09d798?w=800&q=80",
        activities: ["Scenic Train Journey", "Nine Arches Bridge"],
        travelTime: "4 hrs train + 2 hrs driving",
        meals: { b: true, l: false, d: true },
        accommodation: "Mountain View Boutique"
      },
      {
        day: "07",
        title: "Sunrise & Fly Home",
        place: "Ella → Airport",
        body: "Enjoy a final sunrise walk to Little Adam's Peak before the long drive back to the airport. Stop for a final coastal lunch on the way if time permits.",
        img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        activities: ["Sunrise Hike", "Farewell Lunch"],
        travelTime: "5 hrs driving",
        meals: { b: true, l: true, d: false },
        accommodation: "Departure"
      }
    ],
    inclusions: [
      "7 Days Private SUV with Local Expert Driver-Guide",
      "Boutique Heritage Accommodation",
      "All Entrance Fees & Safari Permits",
      "First Class Train Tickets (Kandy to Ella)",
      "Daily Breakfast & Selected Local Lunches"
    ],
    exclusions: [
      "International Airfare",
      "Sri Lanka Entry Visa",
      "Alcoholic Beverages",
      "Travel Insurance",
      "Personal Expenses & Tips"
    ],
    needToKnow: [
      { title: "Best Time", detail: "December to April is peak season for the Highlands." },
      { title: "Clothing", detail: "Light cotton for the heat; a light jacket for the cool Ella evenings." },
      { title: "Visa", detail: "Apply for an ETA online before arrival." },
      { title: "Pace", detail: "This trip involves some early starts to beat the heat." }
    ]
  },
  "wild-heart-lanka": {
    title: "Wild Heart of Lanka",
    slug: "wild-heart-lanka",
    duration: "5 Days / 4 Nights",
    price: "from $1,100 per person",
    pace: "Active Safari",
    travelStyle: "Nature & Wildlife",
    bestFor: "Wildlife Enthusiasts",
    tags: ["Wildlife", "Safari", "Nature"],
    heroImg: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=1800&q=90&auto=format&fit=crop",
    overview: "Leopards at dusk, elephant herds at riverbanks, rare birds in ancient wetlands. Sri Lanka's wildlife density rivals any destination on earth. This journey takes you through the premier national parks of the island.",
    highlights: [
      "Search for Leopards in Yala National Park",
      "Witness the elephant gathering in Minneriya",
      "Bird watching in Bundala National Park",
      "Private guided safari in Udawalawe",
      "Stay in eco-luxe tented camps"
    ],
    days: [
      {
        day: "01",
        title: "Arrival & Minneriya",
        place: "Airport → Minneriya",
        body: "Head straight to the heart of the dry zone. Afternoon safari in Minneriya to witness wild elephants.",
        img: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=800&q=80",
        activities: ["Elephant Safari"],
        travelTime: "4 hrs driving",
        meals: { b: false, l: false, d: true },
        accommodation: "Eco-Luxe Lodge"
      },
      {
        day: "02",
        title: "To the Deep South",
        place: "Minneriya → Yala",
        body: "Drive south to Yala National Park. Settle into your tented camp near the park boundary.",
        img: "https://images.unsplash.com/photo-1581888227599-779811939961?w=800&q=80",
        activities: ["Scenic Drive"],
        travelTime: "6 hrs driving",
        meals: { b: true, l: false, d: true },
        accommodation: "Tented Safari Camp"
      },
      {
        day: "03",
        title: "Leopard Search",
        place: "Yala",
        body: "Full day in Yala with dawn and dusk safaris. Track leopards, sloth bears, and crocodiles.",
        img: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&q=80",
        activities: ["Dawn Safari", "Dusk Safari"],
        travelTime: "Park travel",
        meals: { b: true, l: true, d: true },
        accommodation: "Tented Safari Camp"
      },
      {
        day: "04",
        title: "Udawalawe Elephants",
        place: "Yala → Udawalawe",
        body: "Visit the Elephant Transit Home and enjoy a sunset safari in Udawalawe.",
        img: "https://images.unsplash.com/photo-1546708973-b339540b5162?w=800&q=80",
        activities: ["Elephant Transit Home", "Safari"],
        travelTime: "2 hrs driving",
        meals: { b: true, l: false, d: true },
        accommodation: "Riverside Lodge"
      },
      {
        day: "05",
        title: "Farewell Nature",
        place: "Udawalawe → Airport",
        body: "Drive back to the airport for your flight home.",
        img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        activities: ["Scenic Drive"],
        travelTime: "4 hrs driving",
        meals: { b: true, l: false, d: false },
        accommodation: "Departure"
      }
    ],
    inclusions: [
      "5 Days Private SUV with Wildlife Expert Guide",
      "Eco-Luxe Safari Accommodation",
      "All Safari Permits & 4x4 Jeeps",
      "Daily Breakfast & Safari Lunches"
    ],
    exclusions: [
      "International Flights",
      "Visa Fees",
      "Personal Tips"
    ],
    needToKnow: [
      { title: "Best Time", detail: "February to June for Yala leopards." },
      { title: "What to Bring", detail: "Neutral colored clothing and binoculars." }
    ]
  },
  "serene-coastline": {
    title: "Serene Coastline",
    slug: "serene-coastline",
    duration: "10 Days / 9 Nights",
    price: "from $1,800 per person",
    pace: "Relaxed",
    travelStyle: "Nature & Beach",
    bestFor: "Honeymooners & Couples",
    tags: ["Beach", "Relaxation", "Luxury"],
    heroImg: "https://images.unsplash.com/photo-1606820854416-439b3305ff39?w=1800&q=90&auto=format&fit=crop",
    overview: "Boutique jungle lodges, candlelit dinners on private verandas, sunrise swims on empty beaches. Serenity, designed to be remembered forever. This journey focuses on the southern coast's most exclusive spots.",
    highlights: [
      "Whale watching in Mirissa",
      "Private tour of Galle Fort",
      "Beachfront boutique stays",
      "Yoga and wellness sessions",
      "Sunset cocktails on the dunes"
    ],
    days: [
      {
        day: "01",
        title: "Arrival & Coastal Drive",
        place: "Airport → Bentota",
        body: "Settle into a colonial-era villa by the beach.",
        img: "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?w=800&q=80",
        activities: ["Beach Walk"],
        travelTime: "2 hrs driving",
        meals: { b: false, l: false, d: true },
        accommodation: "Boutique Villa"
      },
      {
        day: "02",
        title: "The Architecture of Bawa",
        place: "Bentota",
        body: "Visit Lunuganga, the garden of master architect Geoffrey Bawa.",
        img: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800&q=80",
        activities: ["Garden Tour"],
        travelTime: "Local travel",
        meals: { b: true, l: false, d: false },
        accommodation: "Boutique Villa"
      },
      {
        day: "03",
        title: "Galle Fort Magic",
        place: "Bentota → Galle",
        body: "Explore the UNESCO-listed Galle Fort. Boutique shopping and heritage walks.",
        img: "https://images.unsplash.com/photo-1627664819818-e147d6221422?w=800&q=80",
        activities: ["Fort Walk", "Shopping"],
        travelTime: "1 hr driving",
        meals: { b: true, l: false, d: true },
        accommodation: "Heritage Fort Hotel"
      },
      {
        day: "04",
        title: "Whales & Waves",
        place: "Galle → Mirissa",
        body: "Early morning whale watching and afternoon surfing lessons.",
        img: "https://images.unsplash.com/photo-1580211110825-78e8787c8803?w=800&q=80",
        activities: ["Whale Watching", "Surfing"],
        travelTime: "1 hr driving",
        meals: { b: true, l: false, d: false },
        accommodation: "Beachfront Boutique"
      },
      {
        day: "05-09",
        title: "Ultimate Relaxation",
        place: "Mirissa & Hiriketiya",
        body: "Multiple days of yoga, spa treatments, and pristine beaches.",
        img: "https://images.unsplash.com/photo-1606820854416-439b3305ff39?w=800&q=80",
        activities: ["Yoga", "Spa", "Beach"],
        travelTime: "Local travel",
        meals: { b: true, l: false, d: false },
        accommodation: "Beachfront Boutique"
      },
      {
        day: "10",
        title: "Farewell Sands",
        place: "Hiriketiya → Airport",
        body: "The final drive along the expressway back to the airport.",
        img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        activities: ["Scenic Drive"],
        travelTime: "3.5 hrs driving",
        meals: { b: true, l: false, d: false },
        accommodation: "Departure"
      }
    ],
    inclusions: [
      "10 Days Luxury Transport",
      "Elite Boutique Stays",
      "Private Boat for Whale Watching",
      "Daily Spa Credit"
    ],
    exclusions: [
      "Flights",
      "Lunch & Dinner except where noted",
      "Personal Shopping"
    ],
    needToKnow: [
      { title: "Best Time", detail: "November to April for the south coast." },
      { title: "Vibe", detail: "Romantic, slow-paced, and high-end." }
    ]
  }
};
