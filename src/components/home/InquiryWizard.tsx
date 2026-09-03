"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { submitInquiry } from "@/actions/inquiries";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { Icons } from "@/components/home/icons";
import { getTravelCategories } from "@/actions/home";
import { TRAVEL_CATEGORIES } from "@/data/home";
import { NationalitySelect } from "@/components/ui/nationality-select";
import { 
  Heart, 
  Compass, 
  TreePine, 
  Palmtree, 
  Users, 
  Sparkles, 
  Milestone, 
  ChevronRight, 
  ChevronLeft, 
  Minus, 
  Plus, 
  Check, 
  Send, 
  Calendar, 
  User, 
  Mail, 
  Phone,
  MessageSquare,
  DollarSign,
  X,
  HeartPulse,
  Landmark
} from "lucide-react";

// Steps definition
// Step 1: Style
// Step 2: Duration & Travelers
// Step 3: Budget & Interests
// Step 4: Contact info & message
// Step 5: Final review & submit

const STYLE_ICONS: Record<string, React.ComponentType<any>> = {
  Honeymoon: Heart,
  Wildlife: TreePine,
  Luxury: Sparkles,
  Surfing: Palmtree,
  Culture: Milestone,
  Adventure: Compass,
  Wellness: HeartPulse,
  Ramayana: Landmark,
  "Ramayana Trail": Landmark,
};

const BUDGETS = [
  { id: "Under $800", label: "Under $800", tier: "$", desc: "Value-focused, great guesthouses & private driver" },
  { id: "$800 – $1,500", label: "$800 – $1,500", tier: "$$", desc: "Premium comfort, 3/4-star boutique hotels" },
  { id: "$1,500 – $3,000", label: "$1,500 – $3,000", tier: "$$$", desc: "Bespoke luxury, 4/5-star colonial bungalows" },
  { id: "$3,000 – $5,000", label: "$3,000 – $5,000", tier: "$$$$", desc: "Ultra-luxury, elite estates, wellness retreats" },
  { id: "$5,000+", label: "$5,000+", tier: "$$$$$", desc: "Top tier, private villas, exclusive experiences" },
  { id: "Flexible", label: "Flexible / Not Decided", tier: "?", desc: "Focus on best experience, open to budgets" }
];

const INTERESTS = [
  "Beaches & Surfing",
  "Wildlife Safari",
  "Tea Estates & Ella Train",
  "Ancient Temples & Ruins",
  "Ayurveda & Yoga Spa",
  "Ramayana Trail Sites",
  "Sri Lankan Cooking & Food",
  "Water Sports & Hiking",
  "Scenic Waterfalls",
  "Local Village Life",
  "Colonial Galle Fort"
];

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function InquiryWizard() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [style, setStyle] = useState("");
  const [duration, setDuration] = useState(7);
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [arrivalMonth, setArrivalMonth] = useState("Jan");
  const [arrivalDate, setArrivalDate] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  // Contact details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [message, setMessage] = useState("");
  
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: dbCategories = [] } = useQuery({
    queryKey: ["travelCategories"],
    queryFn: async () => await getTravelCategories(),
  });

  // Ensure default categories (including Wellness and Ramayana) always show up
  const categories = (() => {
    const defaultList = TRAVEL_CATEGORIES.map(cat => ({
      id: String(cat.id),
      label: cat.label,
      image: cat.image,
      description: cat.desc,
    }));

    if (!dbCategories || dbCategories.length === 0) {
      return defaultList;
    }

    const existingLabels = new Set(dbCategories.map((c: any) => c.label.toLowerCase()));
    const missingDefaults = defaultList.filter(cat => !existingLabels.has(cat.label.toLowerCase()));
    return [...dbCategories, ...missingDefaults];
  })();

  // Sync state with URL hash "#inquiry" and custom events
  useEffect(() => {
    const handleOpen = (e?: Event) => {
      const customEvent = e as CustomEvent<{
        style?: string;
        name?: string;
        email?: string;
        arrivalDate?: string;
      }>;
      
      if (customEvent?.detail) {
        let hasData = false;
        if (customEvent.detail.style) {
          setStyle(customEvent.detail.style);
          hasData = true;
        }
        if (customEvent.detail.name) {
          setName(customEvent.detail.name);
          hasData = true;
        }
        if (customEvent.detail.email) {
          setEmail(customEvent.detail.email);
          hasData = true;
        }
        if (customEvent.detail.arrivalDate) {
          setArrivalDate(customEvent.detail.arrivalDate);
          setArrivalMonth("");
          hasData = true;
        }
        
        if (hasData) {
          setStep(2);
        } else {
          setStep(1);
        }
      } else {
        setStep(1);
      }
      
      setIsOpen(true);
      document.body.style.overflow = "hidden";
      if (window.location.hash !== "#inquiry") {
        window.history.pushState(null, "", window.location.pathname + window.location.search + "#inquiry");
      }
    };

    const handleCloseEvent = () => {
      setIsOpen(false);
      document.body.style.overflow = "unset";
      if (window.location.hash === "#inquiry") {
        window.history.pushState(null, "", window.location.pathname + window.location.search);
      }
    };

    const handleHashChange = () => {
      if (window.location.hash === "#inquiry") {
        handleOpen();
      } else {
        handleCloseEvent();
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("open-inquiry", handleOpen);
    window.addEventListener("close-inquiry", handleCloseEvent);
    
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("open-inquiry", handleOpen);
      window.removeEventListener("close-inquiry", handleCloseEvent);
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleClose = () => {
    window.dispatchEvent(new CustomEvent("close-inquiry"));
  };

  // Handle Escape keypress to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const { settings } = useSiteSettings();
  const whatsapp = settings?.contact?.whatsapp || "+94775105848";
  const waLink = `https://wa.me/${whatsapp.replace(/\+/g, "").replace(/\s/g, "")}`;

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: any) => {
      try {
        return await submitInquiry(data);
      } catch (err: any) {
        console.warn("Server action submission failed, trying /api/inquiries endpoint fallback...", err);
        const res = await fetch("/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || "Failed to submit inquiry");
        }
        return json.data;
      }
    },
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (err: any) => {
      setErrorMsg(err?.message || "Something went wrong. Please try again or contact us directly.");
    }
  });

  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const validateStep = () => {
    setErrorMsg("");
    if (step === 1 || step === 5) {
      if (!style) {
        setErrorMsg("Please select a trip style to continue.");
        return false;
      }
    }
    if (step === 3 || step === 5) {
      if (!budget) {
        setErrorMsg("Please select your approximate budget per person.");
        return false;
      }
    }
    if (step === 4 || step === 5) {
      if (!name.trim()) {
        setErrorMsg("Name is required.");
        return false;
      }
      if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
        setErrorMsg("Please enter a valid email address.");
        return false;
      }
      if (!phone.trim()) {
        setErrorMsg("WhatsApp or Phone number is required.");
        return false;
      }
    }
    return true;
  };

  const resetScroll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, 5));
      resetScroll();
    }
  };

  const handleBack = () => {
    setErrorMsg("");
    setStep(prev => Math.max(prev - 1, 1));
    resetScroll();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 5) {
      handleNext();
    }
  };

  const executeSubmit = () => {
    if (!validateStep()) return;

    const formattedArrival = arrivalDate 
      ? arrivalDate 
      : `Month: ${arrivalMonth}`;

    mutate({
      name,
      email,
      whatsapp: phone,
      nationality,
      arrivalDate: formattedArrival,
      duration,
      travelers: adults + childrenCount,
      budget,
      style,
      interests: selectedInterests,
      message: message || "No special requests",
    });
  };

  const handleButtonClick = () => {
    if (step < 5) {
      handleNext();
    } else {
      executeSubmit();
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.22, ease: "easeOut" as const }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 30 : -30,
      opacity: 0,
      transition: { duration: 0.18, ease: "easeIn" as const }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.08 }}
            className="bg-white rounded-t-2xl sm:rounded-3xl shadow-2xl border-0 sm:border border-slate-100 overflow-hidden w-full max-w-full sm:max-w-4xl h-[100dvh] sm:h-auto sm:max-h-[90vh] flex flex-col relative z-10 min-w-0"
          >
            {/* Header Progress Bar */}
            <div className="bg-slate-50 px-3.5 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex items-center justify-between shrink-0 w-full min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex gap-1 sm:gap-1.5 shrink-0">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 sm:h-2 w-4 sm:w-8 rounded-full transition-all duration-300 ${
                        i <= step ? "bg-brand" : "bg-slate-200"
                      }`}
                      style={{ backgroundColor: i <= step ? "var(--color-brand)" : "#E2E8F0" }}
                    />
                  ))}
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-500 whitespace-nowrap">Step {step} of 5</span>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                <span className="text-xs font-semibold text-slate-400 hidden md:inline">Free Quote & Best Price Guaranteed</span>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <AnPresenceMode custom={step}>
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-6 py-12 sm:px-8 sm:py-16 text-center overflow-y-auto flex-1 flex flex-col justify-center items-center"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shrink-0" style={{ background: "rgba(37, 211, 102, 0.1)" }}>
                    <Check className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: "#25D366" }} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3">Your Request is on its Way!</h3>
                  <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto mb-8 leading-relaxed">
                    Thank you, <span className="font-bold text-slate-800">{name}</span>! Our certified Sri Lanka destination expert has been assigned and is already working on your bespoke itinerary. Look out for a response in your inbox within 24 hours.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3.5 w-full max-w-md">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl font-bold text-white text-xs sm:text-sm shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto"
                      style={{ background: "#25D366" }}
                    >
                      <span className="shrink-0">{Icons.message}</span>
                      Start Live WhatsApp Chat
                    </a>
                    <button 
                      onClick={() => {
                        setStep(1);
                        setStyle("");
                        setBudget("");
                        setSelectedInterests([]);
                        setName("");
                        setEmail("");
                        setPhone("");
                        setNationality("");
                        setMessage("");
                        setSubmitted(false);
                      }}
                      className="px-6 py-3.5 sm:py-4 rounded-xl text-slate-600 font-semibold border border-slate-200 text-xs sm:text-sm transition-colors hover:bg-slate-50 w-full sm:w-auto"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} autoComplete="off" className="flex flex-col flex-1 overflow-hidden min-w-0 w-full max-w-full">
                  <div ref={scrollContainerRef} className="p-3.5 sm:p-8 md:p-10 overflow-y-auto overflow-x-hidden flex-1 scroll-smooth min-w-0 w-full max-w-full">
                  {errorMsg && (
                    <div className="mb-4 sm:mb-6 p-3.5 sm:p-4 bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm rounded-2xl flex items-center gap-2 animate-pulse">
                      <span className="font-bold">⚠️</span> {errorMsg}
                    </div>
                  )}

                  {/* STEP 1: TRIP STYLE */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-4"
                    >
                      <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900">What is your preferred travel style?</h3>
                        <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">Select the option that matches your dream experience best.</p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3.5">
                        {categories.map((st) => {
                          const Icon = STYLE_ICONS[st.label] || Compass;
                          const isSelected = style === st.label;
                          return (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => {
                                setStyle(st.label);
                                setErrorMsg("");
                              }}
                              className={`group relative rounded-2xl overflow-hidden text-left transition-all duration-300 focus:outline-none h-[115px] sm:h-[145px] md:h-[155px] border-2 flex flex-col justify-between ${
                                isSelected 
                                  ? "border-brand shadow-xl -translate-y-0.5 scale-[1.01]" 
                                  : "border-transparent hover:border-slate-300 hover:-translate-y-0.5 hover:shadow-md"
                              }`}
                              style={{
                                borderColor: isSelected ? "var(--color-brand)" : undefined,
                                boxShadow: isSelected ? "0 8px 24px rgba(1, 48, 114, 0.25)" : undefined,
                              }}
                            >
                              {/* Background Image */}
                              <img
                                src={st.image}
                                alt={st.label}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                              />
                              
                              {/* Gradient Overlay */}
                              <div 
                                className="absolute inset-0 transition-opacity duration-300" 
                                style={{ 
                                  background: isSelected
                                    ? "linear-gradient(to top, rgba(1, 48, 114, 0.92) 0%, rgba(1, 48, 114, 0.45) 60%, transparent 100%)"
                                    : "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 65%, transparent 100%)"
                                }}
                              />

                              {/* Active Check Indicator */}
                              <AnimatePresence>
                                {isSelected && (
                                  <motion.div 
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                    className="absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-white shadow-md z-10" 
                                    style={{ background: "var(--color-brand)" }}
                                  >
                                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Card Content Overlay */}
                              <div className="absolute inset-0 p-2.5 sm:p-3.5 flex flex-col justify-end z-10">
                                {/* SVG Icon Pill */}
                                <div
                                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg flex items-center justify-center mb-1 sm:mb-1.5 transition-all duration-300 ${
                                    isSelected ? "bg-white text-brand" : "bg-white/20 text-white"
                                  }`}
                                  style={{
                                    color: isSelected ? "var(--color-brand)" : undefined
                                  }}
                                >
                                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>
                                <span className="text-white font-bold text-xs sm:text-sm leading-tight">
                                  {st.label}
                                </span>
                                <span className="text-white/75 text-[9.5px] sm:text-[10.5px] leading-tight line-clamp-1 mt-0.5 font-medium">
                                  {st.description}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: DURATION & TRAVELERS */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-6 sm:space-y-8"
                    >
                      <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900">How long is your trip and who is coming?</h3>
                        <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">Specify duration, group size, and your desired travel timeframe.</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                        {/* Left: Duration Counter */}
                        <div className="space-y-3 sm:space-y-4">
                          <div className="bg-slate-50 p-3.5 sm:p-5 rounded-2xl border border-slate-100 flex items-center justify-between gap-3">
                            <div>
                              <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Trip Duration</h4>
                              <p className="text-[11px] text-slate-400 mt-0.5">Number of days/nights</p>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                              <button
                                type="button"
                                onClick={() => setDuration(prev => Math.max(1, prev - 1))}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-base sm:text-lg font-bold text-slate-800 w-6 sm:w-8 text-center">{duration}</span>
                              <button
                                type="button"
                                onClick={() => setDuration(prev => Math.min(60, prev + 1))}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Adults counter */}
                          <div className="bg-slate-50 p-3.5 sm:p-5 rounded-2xl border border-slate-100 flex items-center justify-between gap-3">
                            <div>
                              <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Adults</h4>
                              <p className="text-[11px] text-slate-400 mt-0.5">Ages 12 or above</p>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                              <button
                                type="button"
                                onClick={() => setAdults(prev => Math.max(1, prev - 1))}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-base sm:text-lg font-bold text-slate-800 w-6 sm:w-8 text-center">{adults}</span>
                              <button
                                type="button"
                                onClick={() => setAdults(prev => Math.min(20, prev + 1))}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Children counter */}
                          <div className="bg-slate-50 p-3.5 sm:p-5 rounded-2xl border border-slate-100 flex items-center justify-between gap-3">
                            <div>
                              <h4 className="font-bold text-slate-800 text-xs sm:text-sm">Children</h4>
                              <p className="text-[11px] text-slate-400 mt-0.5">Ages 2 to 11</p>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                              <button
                                type="button"
                                onClick={() => setChildrenCount(prev => Math.max(0, prev - 1))}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-base sm:text-lg font-bold text-slate-800 w-6 sm:w-8 text-center">{childrenCount}</span>
                              <button
                                type="button"
                                onClick={() => setChildrenCount(prev => Math.min(20, prev + 1))}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Right: Arrival Timeframe */}
                        <div className="bg-slate-50 p-3.5 sm:p-5 rounded-2xl border border-slate-100 space-y-3">
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs sm:text-sm">When are you arriving?</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">Select month or input specific dates.</p>
                          </div>

                          {/* Months selector grid */}
                          <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-4 gap-1.5 pt-1">
                            {MONTHS.map((m) => {
                              const isSelected = arrivalMonth === m && !arrivalDate;
                              return (
                                <button
                                  key={m}
                                  type="button"
                                  onClick={() => {
                                    setArrivalMonth(m);
                                    setArrivalDate("");
                                  }}
                                  className={`py-1.5 px-1 rounded-xl font-bold text-[11px] sm:text-xs transition-all border ${
                                    isSelected 
                                      ? "bg-brand text-white border-transparent shadow-sm" 
                                      : "bg-white border-slate-100 hover:border-slate-300 text-slate-600"
                                  }`}
                                  style={{
                                    backgroundColor: isSelected ? "var(--color-brand)" : undefined,
                                    color: isSelected ? "#FFF" : undefined
                                  }}
                                >
                                  {m}
                                </button>
                              );
                            })}
                          </div>

                          <div className="relative flex py-1 items-center">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="flex-shrink mx-3 text-slate-400 text-[10px] sm:text-xs font-bold uppercase">Or Specific Date</span>
                            <div className="flex-grow border-t border-slate-200"></div>
                          </div>

                          <div className="flex items-center gap-3 bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200">
                            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                            <input
                              type="date"
                              value={arrivalDate}
                              onChange={(e) => {
                                setArrivalDate(e.target.value);
                                setArrivalMonth("");
                              }}
                              className="bg-transparent border-none text-xs text-slate-800 font-bold focus:outline-none w-full cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: BUDGET & INTERESTS */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-5 sm:space-y-6"
                    >
                      {/* Step Header */}
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-1">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Bespoke Customization</span>
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                          What is your approximate budget and key interests?
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium">
                          This helps us match you with the ideal luxury hotels, private drivers, and trip pacing.
                        </p>
                      </div>

                      <div className="space-y-5 sm:space-y-6">
                        {/* 1. Budget Section Box */}
                        <div className="bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                                <DollarSign className="w-4 h-4 stroke-[3]" />
                              </div>
                              <div>
                                <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">Approximate Budget (per person) *</h4>
                                <p className="text-[11px] text-slate-500">Includes transport, hotels & expert local guides</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                            {BUDGETS.map((bg) => {
                              const isSelected = budget === bg.id;
                              return (
                                <button
                                  key={bg.id}
                                  type="button"
                                  onClick={() => {
                                    setBudget(bg.id);
                                    setErrorMsg("");
                                  }}
                                  className={`p-3.5 rounded-xl text-left border-2 transition-all flex items-start gap-3 relative ${
                                    isSelected 
                                      ? "border-emerald-600 bg-emerald-50/80 shadow-sm ring-2 ring-emerald-500/20" 
                                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs active:bg-slate-50"
                                  }`}
                                >
                                  <div 
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                                      isSelected ? "bg-emerald-600 text-white shadow-xs" : "bg-slate-100 text-slate-700"
                                    }`}
                                  >
                                    {bg.tier}
                                  </div>
                                  <div className="flex-1 pr-4">
                                    <h5 className={`font-bold text-xs sm:text-sm ${isSelected ? "text-emerald-950" : "text-slate-900"}`}>{bg.label}</h5>
                                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug font-medium">{bg.desc}</p>
                                  </div>
                                  {isSelected && (
                                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                                      <Check className="w-3 h-3 stroke-[3]" />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 2. Key Interests Section Box */}
                        <div className="bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                              <Heart className="w-4 h-4 fill-white/20 stroke-[2.5]" />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">Select Key Interests (Optional)</h4>
                              <p className="text-[11px] text-slate-500">Tap one or more activities to tailor your custom itinerary</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-1">
                            {INTERESTS.map((interest) => {
                              const isSelected = selectedInterests.includes(interest);
                              return (
                                <button
                                  key={interest}
                                  type="button"
                                  onClick={() => handleInterestToggle(interest)}
                                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 active:scale-95 ${
                                    isSelected 
                                      ? "bg-emerald-700 border-emerald-700 text-white shadow-md ring-2 ring-emerald-500/20" 
                                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-2xs hover:bg-slate-50"
                                  }`}
                                >
                                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />}
                                  <span>{interest}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: CONTACT INFO */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-4 sm:space-y-6"
                    >
                      <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900">Who should we send the quote to?</h3>
                        <p className="text-xs text-slate-400 mt-0.5 sm:mt-1">We respect your privacy and will never send spam.</p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3.5 sm:gap-5">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Full Name *</label>
                          <div className="relative flex items-center">
                            <User className="absolute left-3.5 w-4 h-4 text-slate-400 shrink-0" />
                            <input
                              required
                              type="text"
                              autoComplete="off"
                              placeholder="e.g. John Smith"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm border border-slate-200 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
                              style={{ color: "#0F172A" }}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Email Address *</label>
                          <div className="relative flex items-center">
                            <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 shrink-0" />
                            <input
                              required
                              type="email"
                              autoComplete="off"
                              placeholder="e.g. john@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm border border-slate-200 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
                              style={{ color: "#0F172A" }}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">WhatsApp / Phone Number *</label>
                          <div className="relative flex items-center">
                            <Phone className="absolute left-3.5 w-4 h-4 text-slate-400 shrink-0" />
                            <input
                              required
                              type="tel"
                              autoComplete="off"
                              placeholder="e.g. +1 (234) 567-8900"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm border border-slate-200 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
                              style={{ color: "#0F172A" }}
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">Including country code. We will text you once your itinerary PDF is ready.</p>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Nationality / Country of Residence</label>
                          <NationalitySelect
                            value={nationality}
                            onChange={(val) => setNationality(val)}
                            placeholder="Search & select nationality..."
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 5: FINAL NOTES & SUBMIT */}
                  {step === 5 && (
                    <motion.div
                      key="step5"
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-4 sm:space-y-6"
                    >
                      <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900">Any special requests? (Optional)</h3>
                        <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1 leading-relaxed">Let us know about special occasions (honeymoon/anniversary), accessibility, or specific spots you want to visit.</p>
                      </div>

                      <div className="space-y-3.5 sm:space-y-4">
                        <div className="relative">
                          <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500 shrink-0" />
                          <textarea
                            rows={3}
                            placeholder="Example: We are traveling with a toddler so we prefer shorter drives. We'd love to try a cooking class and stay in eco-lodges near Ella..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm border border-slate-300 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors resize-none placeholder:text-slate-600 font-medium text-slate-900"
                            style={{ color: "#0F172A" }}
                          />
                        </div>

                        {/* Summary Review Panel */}
                        <div className="bg-slate-100/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-2.5">
                          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Your Inquiry Summary</h4>
                          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 text-xs sm:text-sm">
                            <div>
                              <span className="text-slate-600 font-medium">Trip Style:</span>
                              <span className="font-extrabold text-slate-900 ml-1.5">{style}</span>
                            </div>
                            <div>
                              <span className="text-slate-600 font-medium">Travelers:</span>
                              <span className="font-extrabold text-slate-900 ml-1.5">{adults + childrenCount} ({adults} Adults{childrenCount > 0 ? `, ${childrenCount} Kids` : ""})</span>
                            </div>
                            <div>
                              <span className="text-slate-600 font-medium">Duration:</span>
                              <span className="font-extrabold text-slate-900 ml-1.5">{duration} Days</span>
                            </div>
                            <div>
                              <span className="text-slate-600 font-medium">Budget Range:</span>
                              <span className="font-extrabold text-slate-900 ml-1.5">{budget}</span>
                            </div>
                            <div className="xs:col-span-2">
                              <span className="text-slate-600 font-medium">Timeframe:</span>
                              <span className="font-extrabold text-slate-900 ml-1.5">{arrivalDate ? arrivalDate : arrivalMonth}</span>
                            </div>
                            {nationality && (
                              <div className="xs:col-span-2">
                                <span className="text-slate-600 font-medium">Nationality:</span>
                                <span className="font-extrabold text-slate-900 ml-1.5">{nationality}</span>
                              </div>
                            )}
                            {selectedInterests.length > 0 && (
                              <div className="xs:col-span-2">
                                <span className="text-slate-600 font-medium">Interests:</span>
                                <span className="font-extrabold text-slate-900 ml-1.5">{selectedInterests.join(", ")}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  </div>

                  {/* Footer buttons */}
                  <div className="flex items-center justify-between px-4 sm:px-8 md:px-10 py-3.5 sm:py-5 border-t border-slate-100 bg-slate-50 shrink-0">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </button>
                    ) : (
                      <div />
                    )}

                    <button
                      type="button"
                      onClick={handleButtonClick}
                      disabled={isPending}
                      className={`px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-xl text-white font-bold text-xs flex items-center gap-2 shadow-md transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 ${
                        step === 5 ? "px-8 sm:px-10 shadow-lg" : ""
                      }`}
                      style={{ background: step < 5 ? "var(--color-brand)" : "var(--color-accent)" }}
                    >
                      {step < 5 ? (
                        <>
                          Continue
                          <ChevronRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          {isPending ? "Submitting..." : (
                            <>
                              <Send className="w-4 h-4" />
                              Submit Request
                            </>
                          )}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </AnPresenceMode>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Helper wrapper to handle types/framer-motion imports
function AnPresenceMode({ children, custom }: { children: React.ReactNode; custom: any }) {
  return (
    <AnimatePresence mode="wait" custom={custom}>
      {children}
    </AnimatePresence>
  );
}
