const config = {
  // Basic
  valentineName: "तिम्रो नाम",
  pageTitle: "मेरो भ्यालेन्टाइन बनिदिन्छौ? 💝",

  // Background floating emojis
  floatingEmojis: {
    hearts: ['❤️','💖','💝','💕','💗'],
    bears: ['🧸','🐻']
  },

  // Questions (Nepali)
  questions: {
    first: {
      text: "तिमी मलाई मन पराउँछौ?",
      yesBtn: "हो",
      noBtn: "होइन",
      secretAnswer: "मन मात्र होइन, म तिमीलाई माया गर्छु ❤️"
    },
    second: {
      text: "तिमी मलाई कति माया गर्छौ?",
      startText: "यति धेरै!",
      nextBtn: "अर्को ❤️"
    },
    third: {
      text: "मेरो भ्यालेन्टाइन बनिदिन्छौ...?",
      yesBtn: "हुन्छ!",
      noBtn: "हुँदैन"
    }
  },

  // Love meter messages
  loveMessages: {
    extreme: "वाऊ! यति धेरै?? 🥰💝",
    high: "अनन्तसम्म! 🚀💝",
    normal: "अझै धेरै! 🥰"
  },

  // Celebration
  celebration: {
    title: "याय! म कति भाग्यमानी रहेछु...",
    message: "अब आफ्नो गिफ्ट लिन आउनु 💝",
    emojis: "🎁💖🤗💝💋❤️💕"
  },

  // Premium Valentine palette
  colors: {
    backgroundStart: "#ff5f9e",
    backgroundEnd: "#ffd1dc",
    buttonBackground: "#ff2e63",
    buttonHover: "#ff5a84",
    textColor: "#9b0036"
  },

  // Animation tuning
  animations: {
    floatDuration: "14s",
    floatDistance: "55px",
    bounceSpeed: "0.5s",
    heartExplosionSize: 1.6
  },

  // Memories per step (photos + quotes)
  memories: {
    first: {
      title: "हाम्रो पहिलो भेट",
      quote: "साना क्षणहरू नै हाम्रो ठूलो कथा हुन्।",
      items: [
        { img: "assets/01.jpg", caption: "त्यो दिन अझै सम्झिन्छु।" },
        { img: "assets/02.jpg", caption: "हाम्रो पहिलो कफी डेट।" }
      ]
    },
    second: {
      title: "हाम्रो यात्राहरू",
      quote: "जहाँ तिमी, त्यहीँ मेरो घर।",
      items: [
        { img: "assets/03.jpg", caption: "संगै हाँसेको क्षण।" },
        { img: "assets/04.jpg", caption: "हात समातेर सधैं।" }
      ]
    },
    third: {
      title: "मेरो मनका कुरा",
      quote: "म तिमीलाई शब्दले होइन, समयले माया गर्छु।",
      items: [
        { img: "assets/05.jpg", caption: "आज पनि, भोलि पनि—तिमी नै।" }
      ]
    }
  },

  // Music (optional)
  music: {
    enabled: true,
    autoplay: true,
    musicUrl: "YOUR_CLOUDINARY_URL_HERE",
    startText: "🎵 संगीत बजाऊ",
    stopText: "🔇 बन्द गर",
    volume: 0.5
  }
};
