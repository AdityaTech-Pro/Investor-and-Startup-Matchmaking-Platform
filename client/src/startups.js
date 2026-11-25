// Centralized startup data
const startupsData = [
    {
        id: 1,
        name: "EcoTech Solutions",
        description: "Revolutionary waste management platform using AI to optimize recycling processes and reduce environmental impact.",
        industry: "sustainability",
        fundingGoal: "$2.5M",
        raised: "$1.2M",
        investors: 45,
        stage: "Series A",
        location: "San Francisco, CA",
        founded: "2022",
        team: [
            { name: "Sarah Johnson", role: "CEO & Founder", initials: "SJ" },
            { name: "Michael Chen", role: "CTO", initials: "MC" },
            { name: "Dr. Emily Rodriguez", role: "Chief Scientist", initials: "ER" },
            { name: "David Kim", role: "VP of Operations", initials: "DK" }
        ],
        financials: {
            revenue: "$800K",
            growth: "120%",
            valuation: "$15M",
            burnRate: "$150K"
        },
        businessModel: "EcoTech operates on a SaaS model with tiered pricing for municipalities and corporations. We also generate revenue through consulting services and data analytics.",
        marketOpportunity: "The global waste management market is projected to reach $530 billion by 2025. With increasing environmental regulations, our AI-powered solutions address a critical need."
    },
    {
        id: 2,
        name: "MedAI Diagnostics",
        description: "AI-powered medical imaging platform that helps radiologists detect diseases 40% faster with 95% accuracy.",
        industry: "healthcare",
        fundingGoal: "$5M",
        raised: "$3.8M",
        investors: 78,
        stage: "Series B",
        location: "Boston, MA",
        founded: "2021",
        team: [
            { name: "Dr. James Wilson", role: "CEO & Founder", initials: "JW" },
            { name: "Dr. Lisa Park", role: "Chief Medical Officer", initials: "LP" },
            { name: "Alex Thompson", role: "CTO", initials: "AT" },
            { name: "Dr. Rachel Green", role: "VP of Clinical Affairs", initials: "RG" }
        ],
        financials: {
            revenue: "$2.1M",
            growth: "85%",
            valuation: "$28M",
            burnRate: "$320K"
        },
        businessModel: "MedAI operates on a per-scan licensing model with hospitals and clinics. We also offer enterprise solutions for large healthcare networks.",
        marketOpportunity: "The AI in medical imaging market is expected to reach $2.5 billion by 2027. With radiologist shortages globally, our platform addresses a critical healthcare need."
    },
    {
        id: 3,
        name: "CryptoWallet Pro",
        description: "Next-generation cryptocurrency wallet with advanced security features and DeFi integration.",
        industry: "fintech",
        fundingGoal: "$3M",
        raised: "$2.1M",
        investors: 62,
        stage: "Series A",
        location: "New York, NY",
        founded: "2023",
        team: [
            { name: "Marcus Rodriguez", role: "CEO & Founder", initials: "MR" },
            { name: "Sophie Chen", role: "CTO", initials: "SC" },
            { name: "Kevin O'Brien", role: "Chief Security Officer", initials: "KO" },
            { name: "Amanda Lee", role: "VP of Product", initials: "AL" }
        ],
        financials: {
            revenue: "$1.5M",
            growth: "200%",
            valuation: "$18M",
            burnRate: "$180K"
        },
        businessModel: "CryptoWallet Pro generates revenue through transaction fees, premium subscription features, and DeFi protocol integrations.",
        marketOpportunity: "The global cryptocurrency wallet market is projected to reach $3.1 billion by 2027. With increasing crypto adoption, secure wallet solutions are in high demand."
    },
    {
        id: 4,
        name: "EduVerse",
        description: "Immersive VR learning platform transforming education through interactive virtual experiences.",
        industry: "education",
        fundingGoal: "$4M",
        raised: "$2.8M",
        investors: 89,
        stage: "Series A",
        location: "Austin, TX",
        founded: "2022",
        team: [
            { name: "Jennifer Martinez", role: "CEO & Founder", initials: "JM" },
            { name: "Robert Kim", role: "CTO", initials: "RK" },
            { name: "Dr. Patricia White", role: "Chief Learning Officer", initials: "PW" },
            { name: "Daniel Brown", role: "VP of Engineering", initials: "DB" }
        ],
        financials: {
            revenue: "$1.8M",
            growth: "150%",
            valuation: "$22M",
            burnRate: "$250K"
        },
        businessModel: "EduVerse operates on a subscription model for educational institutions and individual learners. We also offer custom content creation services.",
        marketOpportunity: "The VR in education market is expected to reach $13.7 billion by 2027. With remote learning becoming mainstream, immersive educational experiences are highly sought after."
    },
    {
        id: 5,
        name: "SmartCommerce",
        description: "AI-driven e-commerce optimization platform that increases conversion rates by 35% on average.",
        industry: "ecommerce",
        fundingGoal: "$1.5M",
        raised: "$900K",
        investors: 34,
        stage: "Seed",
        location: "Seattle, WA",
        founded: "2023",
        team: [
            { name: "Nina Patel", role: "CEO & Founder", initials: "NP" },
            { name: "Chris Anderson", role: "CTO", initials: "CA" },
            { name: "Maria Garcia", role: "VP of Marketing", initials: "MG" },
            { name: "Tom Wilson", role: "Lead Data Scientist", initials: "TW" }
        ],
        financials: {
            revenue: "$600K",
            growth: "180%",
            valuation: "$8M",
            burnRate: "$120K"
        },
        businessModel: "SmartCommerce operates on a performance-based pricing model, taking a percentage of revenue increase generated for our clients.",
        marketOpportunity: "The e-commerce optimization market is projected to reach $12.5 billion by 2027. With online shopping growth, AI-powered optimization tools are essential."
    },
    {
        id: 6,
        name: "RoboAssist",
        description: "Autonomous robotic assistant for elderly care, providing 24/7 health monitoring and companionship.",
        industry: "ai",
        fundingGoal: "$6M",
        raised: "$4.2M",
        investors: 112,
        stage: "Series B",
        location: "Tokyo, Japan",
        founded: "2020",
        team: [
            { name: "Dr. Hiroshi Tanaka", role: "CEO & Founder", initials: "HT" },
            { name: "Maria Santos", role: "CTO", initials: "MS" },
            { name: "Dr. Ahmed Hassan", role: "Chief Robotics Officer", initials: "AH" },
            { name: "Linda Chang", role: "VP of Operations", initials: "LC" }
        ],
        financials: {
            revenue: "$3.2M",
            growth: "95%",
            valuation: "$35M",
            burnRate: "$280K"
        },
        businessModel: "RoboAssist operates on a subscription rental model for healthcare facilities and direct sales to consumers. We also offer maintenance and support services as additional revenue streams.",
        marketOpportunity: "The healthcare robotics market is expected to reach $37 billion by 2027. With aging populations globally, assistive robotics represents a massive growth opportunity."
    }
];

export default startupsData; 