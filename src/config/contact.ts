/**
 * Official Desi Musafir Contact Details & Social Media Configuration
 * Centralized source of truth used across the entire platform
 */

export const CONTACT_CONFIG = {
  brandName: "Desi Musafir",
  tagline: "Discover India, One Journey at a Time.",
  alternativeTagline: "India Is More Than a Destination. It's a Journey.",
  phone: "8709349237",
  phoneFormatted: "+91 87093 49237",
  phoneTel: "tel:+918709349237",
  whatsappNumber: "918709349237",
  whatsappDefaultMessage: "Namaste Desi Musafir! Mujhe India travel ke baare mein jaankari chahiye.",
  get whatsappLink() {
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(this.whatsappDefaultMessage)}`;
  },
  email: "informy49@gmail.com",
  emailMailto: "mailto:informy49@gmail.com",
  social: {
    instagramProfile1: {
      name: "Jonty Dubey (Founder)",
      handle: "@jonty_dubey",
      url: "https://www.instagram.com/jonty_dubey?mdxt=aDhuMXpyejhqMXNo",
    },
    instagramProfile2: {
      name: "Desi Musafir India (Official)",
      handle: "@desimusafir.india",
      url: "https://www.instagram.com/desimusafir.india?vrfl=MWI4azF1cWFmMzNpbQ==",
    },
    facebook: {
      name: "Desi Musafir",
      url: "https://www.facebook.com/share/1GtUTyTpAu/",
    },
  },
  location: "India",
  operationalHours: "Monday to Saturday, 9:00 AM – 7:00 PM IST",
};
