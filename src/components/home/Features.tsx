import { useReveal } from "../layout/useReveal";

export function Features() {
  const scope = useReveal();

  return (
    <section className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10" ref={scope}>
        
        {/* Main Content Area */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
          
          {/* Left Column: Image & Text */}
          <div className="reveal" style={{ opacity: 0, transform: "translateY(20px)" }}>
            <img 
              src="https://images.unsplash.com/photo-1588614959060-4d144f28b207?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Sri Lanka Ancient Stupa" 
              className="w-full rounded-lg mb-6 object-cover shadow-sm h-[250px] md:h-[380px]"
            />
            <p className="text-[15px] text-gray-600 leading-[1.8] text-left sm:text-justify">
              Nestled in the heart of Sri Lanka, Ceylon Travels was born from a
              passion for sharing the magic of our island homeland with the world. With
              years of hands-on experience, we have assembled a
              dedicated team of professionals who share a vision of sustainable
              and educational tourism. Each member of our team is deeply rooted in
              the local culture, bringing unparalleled expertise and personal insights
              to every itinerary.
            </p>
          </div>

          {/* Right Column: Title & Text */}
          <div className="reveal pt-4 lg:pt-0" style={{ opacity: 0, transform: "translateY(20px)" }}>
            <div className="relative mb-8">
              <h2 className="hidden sm:block text-[50px] md:text-[80px] lg:text-[90px] font-[900] uppercase text-gray-100 absolute -top-8 md:-top-12 left-0 select-none z-0 tracking-wider leading-none">
                OVERVIEW
              </h2>
              <h3 className="text-2xl md:text-3xl font-[800] uppercase text-[#00A680] relative z-10 tracking-wide pt-4 md:pt-6">
                OVERVIEW OF CEYLON TRAVELS
              </h3>
            </div>

            <div className="space-y-5 text-[15px] text-gray-600 leading-[1.8] text-left sm:text-justify relative z-10">
              <p>
                Our journey began with a simple idea: to bridge the gap between travelers
                and the authentic soul of Sri Lanka. Today, we're proud to be a trusted
                name in the tourism industry, offering personalized tours that showcase
                the island's golden beaches, ancient ruins, lush landscapes, and vibrant
                wildlife.
              </p>
              <p>
                Sri Lanka is also renowned for its ancient Ayurvedic treatments , a 3,000-
                year-old system of natural medicine rooted in the principles of balance
                and holistic wellness. At Ceylon Travels, we offer experiences that
                introduce you to the timeless wisdom of Ayurveda, from herbal therapies
                to rejuvenating spa treatments, all delivered by expert practitioners in
                serene, natural settings. These wellness journeys allow travelers to relax,
                heal, and connect with Sri Lanka's rich traditions of health and harmony.
              </p>
              <p>
                One of our signature offerings is the Ramayana Trail , a captivating
                journey that takes you through the legendary sites connected to the
                ancient Indian epic, the Ramayana. From the mystical Ashok Vatika,
                where Sita was held captive, to Ravana's palace and the battlefield where
                Lord Rama defeated Ravana, this tour offers a unique blend of mythology,
                history, and breathtaking landscapes. Perfect for those seeking spiritual
                and cultural enrichment, the Ramayana Trail invites travelers to delve into
                the fascinating intersections of Sri Lanka's heritage and the epic's
                timeless narrative.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 reveal pt-10" style={{ opacity: 0, transform: "translateY(20px)" }}>
          
          {/* Stat 1 */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="text-[#FF4500] w-12 h-12 flex-shrink-0">
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 10v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V10" />
                <path d="M8 10V6a4 4 0 0 1 8 0v4" />
                <path d="M4 10h16" />
                <path d="M8 14h8" />
                <path d="M8 18h8" />
              </svg>
            </div>
            <div>
              <h4 className="text-3xl font-[800] text-[#00A680]">15 <span className="text-xl">+</span></h4>
              <p className="text-[13px] text-gray-500 font-medium">Years Of Experiences</p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="text-[#FF4500] w-12 h-12 flex-shrink-0">
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="M4.93 4.93l1.41 1.41" />
                <path d="M17.66 17.66l1.41 1.41" />
              </svg>
            </div>
            <div>
              <h4 className="text-3xl font-[800] text-[#00A680]">500 <span className="text-xl">+</span></h4>
              <p className="text-[13px] text-gray-500 font-medium">Best Destinations</p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="text-[#FF4500] w-12 h-12 flex-shrink-0">
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 14h3l1.5-3H11l3 7h7v4H4v-3l-2-2" />
                <path d="M14 18v-4h4" />
                <circle cx="17" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <h4 className="text-3xl font-[800] text-[#00A680]">3,210 <span className="text-xl">+</span></h4>
              <p className="text-[13px] text-gray-500 font-medium">Trips</p>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="text-[#FF4500] w-12 h-12 flex-shrink-0">
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="22" />
              </svg>
            </div>
            <div>
              <h4 className="text-3xl font-[800] text-[#00A680]">30 <span className="text-xl">+</span></h4>
              <p className="text-[13px] text-gray-500 font-medium">Certified Guides</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
