import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"

i18n.use(LanguageDetector).init({
  // we init with resources
  resources: {
    en: {
      translations: {
        Welcome: "Welcome",
        "Good afternoon": "Good Afternoon",
        "Good evening": "Good Evening",
        "Search": "Search…",
        
        Today: "Today",
        "2 days": "2 days",
        "3 days": "3 days",
        "Week": "Week",
        "2 weeks": "2 weeks",

        "Places": "Places",
        "places": "Places",
        "Events": "Events",
        "events": "Events",
        "Everything": "Everything",
        "both": "Places & Events",

        "Current Vibe": "Current Vibe",
        "Signature Vibe": "Signature Vibe",
        "What's your vibe": "What's your vibe",
        "Pick Activity": "Pick Activity",

        buzzing: "This is for people looking for popular spots, sightseeing landmarks, very vibrant, where you’d be alert to all the color and smell and sound, but also poppin places, dive spots, street events and markets where you’re guaranteed to find everybody. These are fun and funny places and experiences that can sometimes be mischievous and irreverent. This is for people that enjoy what they are doing and are spontaneous and impulsive. Just do it!",
        chill: "These are for the people looking for a reliable place to have simple, no drama experiences.This is where the young, optimistic people hang out.They are loyal, have strong values of openness and look for the authentic.No nonsense, practical and analytic.The relaxed, calm events and peaceful spots.",
        dreamy: "For those who are living the upscale dream, shining and living who they are out loud, but also kicking back in beautiful artspaces, buying from cool shops and peaceful, purpose-free experiences. Going to make a positive mark on the world, solve big problems and inspire others to do the same. Consciousness expanding, helping to transform people and society. Utopian for sure!",
        quite: "For those interested in sentimental and responsive reflections on the places and events around us. Spaces where we can express empathy and love.",
        oldschool: "For those looking to explore folksy things and events that look at how the past influences the future. For those into landmarks, reviving older things, feeling retro, nostalgic, sentimental, traditional, and sightseeing at popular old spots. They embody meaning and enduring value in creativity, imagination and art. Looking to past leaders brings a sense of stability and durability. Caring for our past and helping people care for themselves is how we can serve the public good. Roots remedies!!! This is where you go to get some old school health and wellness guidance!",
        playful: "For the passionate hobbyist, the content & confident, the curious & inquisitive. On the edge of sassy. Includes activities where you can expect to be engaged, learn things, tinkerer, have adventurous distractions, break a sweat, DIY together, or have whimsical relaxation",
        solidarity: "For those looking for mindful and conscious experiences, universally welcoming/loving experiences or places that put women, POC and marginalized groups front and center, that celebrate their contributions AND also help you find like-minded people in other arenas, like sober-curious and Black queer, welcomingness but also family bonding, friend making, -- where you might even go alone and be expected to contribute or find friendly hosts. Positivity rules here! Lift up voices that have been left out or left behind.",
        together: "For those interested in the warmth and joy of events/meals that promote *romantic* bonding, Cozy could also go here. This is for everyone, it is down to earth and folksy. There is a warm and familiar feel to it so it is accessible to all. This is where we “show the love”, where we show appreciation and connection. Good vibes, self love and meaningful relationships.",
        wild: "For those who are adventurous, outdoorsy, rebellious and are into breaking a sweat, connecting to the land. Are agents of change advocating for the disillusioned and for others to also break traditions. Outside heteronormative futuristic stuff!",
        wonderful: "For those interested in uplifting experiences, giant architectural landmarks that dwarf us tiny humans, inspiring joyful stuff, quirky and daring and unique events and surprising, astonishing festivals. Eagerness matters. Creative, imaginative with a value for the artistic and inventive. Science and Art come together well here. Local legends and role models fit in here.",

        message: "Introduction",
        clickToAdd: "Click to check out this vibe",
        "is an internationalization-framework which offers a complete solution to localize your product from web to mobile and desktop":
          "is an internationalization-framework which offers a complete solution to localize your product from web to mobile and desktop",
        "Plugins to detect the user language":
          "Plugins to detect the user language",
        "Plugins to load translations": "Plugins to load translations",
        "Optionally cache the translations":
          "Optionally cache the translations",
        Advantages: "Advantages",
        "Flexibility to use other packages": "Flexibility to use other packages"
      }
    },
    es: {
      translations: {
        Welcome: "Bienvenidos",
        "Good afternoon": "Buenas Tardes",
        "Good evening": "Buenas Tardes",
        "Search": "Buscar…",

        Today: "Ahora",
        "2 days": "2 días",
        "3 days": "3 días",
        "Week": "Semana",
        "2 weeks": "Dos Semanas",

        "Places": "Lugares",
        "Events": "Eventos",
        "Everything": "Todos",
        "both": "Todos",
        "Filters": "Filtros…",

        "Current Vibe": "Vibra Actual",
        "Signature Vibe": "Vibra característico",
        "What's your vibe": "¿Cual es tu vibra?",
        "Pick Activity": "¿Qué quieres hacer?",

      }
    },
    jap: {
      translations: {
        Introduction: "前書き",
        "is an internationalization-framework which offers a complete solution to localize your product from web to mobile and desktop":
          "Webからモバイルとデスクトップに製品をローカライズするための完全なソリューションを提供する国際化フレームワークです",
        "Plugins to detect the user language":
          "ユーザー言語を検出するためのプラグイン",
        "Plugins to load translations": "翻訳をロードするためのプラグイン",
        "Optionally cache the translations": "必要に応じて翻訳をキャッシュする",
        Advantages: "利点",
        "Flexibility to use other packages": "他のパッケージを使用する柔軟性"
      }
    },

    hin: {
      translations: {
        Introduction: "प्रस्तावना",
        "is an internationalization-framework which offers a complete solution to localize your product from web to mobile and desktop":
          "एक अंतर्राष्ट्रीयकरण - ढांचा है जो आपके उत्पाद को वेब से मोबाइल और डेस्कटॉप पर स्थानांतरित करने का एक संपूर्ण समाधान प्रदान करता है",
        "Plugins to detect the user language":
          "उपयोगकर्ता भाषा का पता लगाने के लिए प्लगइन्स",
        "Plugins to load translations": "अनुवाद लोड करने के लिए प्लगइन्स",
        "Optionally cache the translations": "वैकल्पिक रूप से अनुवाद कैश करें",
        Advantages: "लाभ",
        "Flexibility to use other packages":
          "अन्य पैकेजों का उपयोग करने के लिए लचीलापन"
      }
    },

    ger: {
      translations: {
        Introduction: "Einführung",
        "is an internationalization-framework which offers a complete solution to localize your product from web to mobile and desktop":
          "ist ein Internationalisierungs-Framework, das eine Komplettlösung für die Lokalisierung Ihres Produkts vom Web auf das Handy und den Desktop bietet",
        "Plugins to detect the user language":
          "Plugins zur Erkennung der Benutzersprache",
        "Plugins to load translations": "Plugins zum Laden von Übersetzungen",
        "Optionally cache the translations":
          "Optional die Übersetzungen zwischenspeichern",
        Advantages: "Vorteile",
        "Flexibility to use other packages":
          "Flexibilität zur Verwendung anderer Pakete"
      }
    },
    fre: {
      translations: {
        Introduction: "Introduction",
        "is an internationalization-framework which offers a complete solution to localize your product from web to mobile and desktop":
          "est un cadre d'internationalisation qui offre une solution complète pour localiser votre produit du Web au mobile et au bureau",
        "Plugins to detect the user language":
          "Plugins pour détecter la langue de l'utilisateur",
        "Plugins to load translations": "Plugins pour charger les traductions",
        "Optionally cache the translations":
          "Cachez éventuellement les traductions",
        Advantages: "Les avantages",
        "Flexibility to use other packages":
          "Flexibilité d'utiliser d'autres packages"
      }
    }
  },
  fallbackLng: "en",
  debug: true,

  // have a common namespace used around the full app
  ns: ["translations"],
  defaultNS: "translations",

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ","
  },

  react: {
    wait: true
  }
});

export default i18n;