// This is a one-off script to export the pure JavaScript configs
// (categories, classifiers, etc.) to YAML for the purpose of making
// them as language-agnostic as possible

const yaml = require('js-yaml');
const fs = require('fs');

const classifiers = [
    // Animals
    { input: "animal", output: "animals" },
    { input: "cats", output: "animals" },
    { input: "dogs", output: "animals" },

    // Art
    { input: "architecture", output: "art" },
    { input: "Art Crawl", output: "art" },
    { input: "Artist", output: "art" },
    { input: "art", output: "art" },
    { input: "arts", output: "art" },
    { input: "artists", output: "art" },
    { input: "artworks", output: "art" },
    { input: "craft", output: "art" },
    { input: "colorful", output: "art" },
    { input: "exhibition", output: "art" },
    { input: "galleries", output: "art" },
    { input: "sculptures", output: "art" },

    // Books & Writing
    { input: "book", output: "books" },
    { input: "poets", output: "books" },
    { input: "read their work", output: "books" },
    { input: "writer", output: "books" },
    { input: "writing", output: "books" },

    // Cannabis
    { input: "cannabis", output: "cannabis" },
    { input: "puff", output: "cannabis" },

    // Comedy
    { input: "Comedy", output: "comedy" },
    { input: "comics", output: "comedy" },
    { input: "comedian", output: "comedy" },
    { input: "comedians", output: "comedy" },
    { input: "Comedy Night", output: "comedy" },
    { input: "improv", output: "comedy" },
    { input: "laugh", output: "comedy" },

    // Business & Networking
    { input: "business", output: "business" },
    { input: "money", output: "business" },
    { input: "professional", output: "business" },

    // Community Gatherings
    { input: "community", output: "community" },
    { input: "diversity", output: "community" },
    { input: "friends", output: "community" },
    { input: "together", output: "community" },
    { input: "public", output: "community" },
    { input: "group", output: "community" },

    // Crafts and Making
    { input: "craft", output: "crafts" },
    { input: "crafts", output: "crafts" },
    { input: "embroidery", output: "crafts" },
    { input: "maker", output: "crafts" },

    // Culture & History
    { input: "culture", output: "culture" },
    { input: "exhibition", output: "culture" },
    { input: "ideas", output: "culture" },
    { input: "museum", output: "culture" },
    { input: "history", output: "culture" },
    { input: "library", output: "culture" },
    { input: "programs", output: "culture" },

    // Dancing
    { input: "dance", output: "dance" },
    { input: "DJ", output: "dance" },
    { input: "dancing", output: "dancing" },

    // Design
    { input: "design", output: "design" },
    { input: "designed", output: "design" },
    { input: "designs", output: "design" },
    { input: "create a better world", output: "design" },
    { input: "California design", output: "design" },

    // Drinking
    { input: "bar", output: "drinks" },
    { input: "beer", output: "drinks" },
    { input: "craft beer", output: "drinks" },
    { input: "coffee", output: "drinks" },
    { input: "cocktails", output: "drinks" },
    { input: "drink", output: "drinks" },
    { input: "happy hour", output: "drinks" },
    { input: "Tequila", output: "drinks" },
    { input: "open bar", output: "drinks" },
    { input: "wine", output: "drinks" },

    // For Family
    { input: "baby", output: "family" },
    { input: "child", output: "family" },
    { input: "children", output: "family" },
    { input: "family", output: "family" },
    { input: "families", output: "family" },
    { input: "family and friends", output: "family" },
    { input: "family-friendly", output: "family" },
    { input: "kids", output: "family" },
    { input: "storytime", output: "family" },

    // For Women
    { input: "men", output: "men" },
    { input: "mens", output: "men" },

    // For Women
    { input: "goddess", output: "women" },
    { input: "women", output: "women" },
    { input: "womens", output: "women" },


    // Festive
    { input: "annual tree lighting ceremony", output: "festive" },
    { input: "celebration", output: "festive" },
    { input: "festival", output: "festive" },
    { input: "christmas market", output: "festive" },
    { input: "Celebration", output: "festive" },
    { input: "glittering lights", output: "festive" },
    { input: "Holiday Train", output: "festive" },

    // Film
    { input: "documentary", output: "film" },
    { input: "film", output: "film" },
    { input: "films", output: "film" },
    { input: "movie", output: "film" },

    // Food
    { input: "bacon", output: "food" },
    { input: "chocolate", output: "food" },
    { input: "food", output: "food" },
    { input: "dinner", output: "food" },
    { input: "food", output: "food" },
    { input: "dishes", output: "food" },
    { input: "restaurant", output: "food" },
    { input: "sandwiches", output: "food" },
    { input: "tasty", output: "food" },
    { input: "truck", output: "food" },
    { input: "waffle", output: "food" },

    // Free
    { input: "FREE", output: "free" },
    { input: "free", output: "free" },
    { input: "complimentary", output: "free" },
    { input: "Admission is free", output: "free" },
    { input: "complimentary", output: "free" },

    // Games
    { input: "games", output: "games" },
    { input: "trivia game show", output: "games" },
    { input: "prizes", output: "games" },
    { input: "Retro Game", output: "games" },
    { input: "Play games", output: "games" },
    { input: "video games", output: "games" },
    { input: "Chess", output: "games" },

    // Education
    { input: "school", output: "education" },

    // Health
    { input: "fitness", output: "health" },
    { input: "health", output: "health" },
    { input: "mind", output: "health" },
    { input: "yoga", output: "health" },
    { input: "wellness", output: "health" },

    // Immersive & Experiencees
    { input: "experiences", output: "immersive" },
    { input: "light", output: "immersive" },
    { input: "live", output: "immersive" },
    { input: "rhythm", output: "immersive"},
    { input: "sound", output: "immersive" },

    // Interactive
    { input: "hands on", output: "interactive" },
    { input: "interactive", output: "interactive" },

    // Learning
    { input: "training", output: "learning" },
    { input: "students", output: "learning" },
    { input: "programs", output: "learning" },
    { input: "teacher", output: "learning" },

    // Local
    { input: "artisan", output: "local" },
    { input: "family-owned", output: "local" },
    { input: "food trucks", output: "local" },
    { input: "local", output: "local" },
    { input: "market", output: "local" },
    { input: "one of a kind", output: "local" },
    { input: "makers", output: "local" },
    { input: "neighborhood", output: "local" },
    { input: "popup", output: "local" },
    { input: "vendor", output: "local" },
    { input: "vibrant", output: "local" },
    { input: "market", output: "local" },
    { input: "vendor", output: "local" },

    // Music
    { input: "acoustic", output: "music" },
    { input: "album", output: "music" },
    { input: "albums", output: "music" },
    { input: "band", output: "music" },
    { input: "choir", output: "music" },
    { input: "classical", output: "music" },
    { input: "concert", output: "music" },
    { input: "DJ", output: "music" },
    { input: "DJing", output: "music" },
    { input: "drums", output: "music" },
    { input: "electric", output: "music" },
    { input: "flute", output: "music" },
    { input: "funk", output: "music" },
    { input: "groove", output: "music" },
    { input: "harmonica", output: "music" },
    { input: "hip-hop", output: "music" },
    { input: "jazz", output: "music" },
    { input: "keyboards", output: "music" },
    { input: "instrumental", output: "music" },
    { input: "motown", output: "music" },
    { input: "music", output: "music" },
    { input: "musician", output: "music" },
    { input: "orchestra", output: "music" },
    { input: "piano", output: "music" },
    { input: "rapper", output: "music" },
    { input: "saxophone", output: "music" },
    { input: "song", output: "music" },
    { input: "songs", output: "music" },
    { input: "symphony", output: "music" },
    { input: "soul", output: "music" },
    { input: "vocals", output: "music" },
    { input: "vinyl", output: "music" },


    // Outdoors
    { input: "animal", output: "outdoors" },
    { input: "bird", output: "outdoors" },
    { input: "estuary", output: "outdoors" },
    { input: "garden", output: "outdoors" },
    { input: "gondola", output: "outdoors" },
    { input: "mountain", output: "outdoors" },
    { input: "parks", output: "outdoors" },
    { input: "nature", output: "outdoors" },
    { input: "open spaces", output: "outdoors" },
    { input: "outdoor", output: "outdoors" },
    { input: "outdoors", output: "outdoors" },
    { input: "outside", output: "outdoors" },
    { input: "plants", output: "outdoors" },
    { input: "shore", output: "outdoors" },
    { input: "sunroof", output: "outdoors" },

    // Performance
    { input: "arts", output: "performance" },
    { input: "ballet", output: "performance" },
    { input: "chorus", output: "performance" },
    { input: "concert", output: "performance" },
    { input: "live", output: "performance" },
    { input: "musical", output: "performance" },
    { input: "performers", output: "performance" },
    { input: "performance", output: "performance" },
    { input: "plays", output: "performance" },
    { input: "singing", output: "performance" },
    { input: "stage", output: "performance" },
    { input: "theater", output: "performance" },

    // Mingle, Romance, Relationships
    { input: "dating", output: "romance" },
    { input: "relationships", output: "romance" },
    { input: "sex", output: "romance" },
    { input: "sexual", output: "romance" },
    { input: "singles", output: "romance" },
    { input: "single", output: "romance" },

    //Pop-ups
    { input: "pop-up", output: "popup" },

    // Recuring
    { input: "On Mondays", output: "recurs" },
    { input: "monthly", output: "recurs" },
    { input: "first tuesdays", output: "recurs" },
    { input: "first Sunday", output: "recurs" },
    { input: "1st and 3rd Sunday", output: "recurs" },
    { input: "First Friday", output: "recurs" },
    { input: "Second Saturday", output: "recurs" },
    { input: "Every Friday", output: "recurs" },
    { input: "Every Saturday", output: "recurs" },
    { input: "Every Sunday", output: "recurs" },
    { input: "3rd Thursday", output: "recurs" },
    { input: "series", output: "recurs" },

    // Science & Tech
    { input: "science", output: "science" },
    { input: "technology", output: "science" },

    // Shopping
    { input: "Market", output: "shopping" },
    { input: "Fashion", output: "shopping" },
    { input: "perfect gift", output: "shopping" },
    { input: "treat yourself", output: "shopping" },

    // Spiritual
    { input: "church", output: "spiritual" },
    { input: "faith", output: "spiritual" },
    { input: "gospel", output: "spiritual" },
    { input: "pastor", output: "spiritual" },
    { input: "pray", output: "spiritual" },
    { input: "tea", output: "spiritual" },

    //Storytelling & Books
    { input: "story", output: "storytelling" },
    { input: "stories", output: "storytelling" },
    { input: "story", output: "storytelling" },
    { input: "podcast", output: "storytelling" },
    { input: "storytelling", output: "storytelling" },

    // Urban
    { input: "bart", output: "urban" },
    { input: "downtown", output: "urban" },
    { input: "open green space", output: "urban" },
    { input: "pedestrian", output: "urban" },
    { input: "guided walking", output: "urban" },
    { input: "plaza", output: "urban" },
    { input: "pop up", output: "urban" },
    { input: "take public", output: "urban" },
    { input: "urban", output: "urban" },
    { input: "street", output: "urban" },
    { input: "tour", output: "urban" },
    { input: "train", output: "urban" },
    { input: "walk", output: "urban" },
    { input: "walking", output: "urban" },

    // Nightlife
    { input: "party", output: "nightlife" },
    { input: "dance", output: "nightlife" },
];

const output = yaml.safeDump(classifiers);

fs.writeFile('classifiers.yml', output, (err) => {
    if (err) throw err;
    console.log("exported classifiers to classifiers.yml");
});
