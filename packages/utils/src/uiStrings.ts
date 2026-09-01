import type { SupportedLocale } from '@rdplatforms/types';

/**
 * Default labels for platform-chrome text that a business hasn't
 * overridden via its own content (section titles, form labels, button
 * text). Business content itself is localized via LocalizedText/
 * resolveLocalizedText — this is only the generic scaffolding around it.
 *
 * A flat key/value swap, deliberately not a full i18n library — there's
 * no pluralization or ICU formatting need here, just "same word in the
 * other language." The Marathi strings are a reasonable first pass and
 * worth a native-speaker review before this goes fully live.
 */
const UI_STRINGS = {
  en: {
    navAbout: 'About',
    navServices: 'Services',
    navGallery: 'Gallery',
    navTeam: 'Team',
    navReviews: 'Reviews',
    navFaq: 'FAQ',
    navPricing: 'Pricing',
    navContact: 'Contact',
    navAppointment: 'Book Now',
    contactUs: 'Contact Us',
    ourServices: 'Our Services',
    gallery: 'Gallery',
    whatPeopleSay: 'What People Say',
    faqTitle: 'Frequently Asked Questions',
    readyToGetStarted: 'Ready To Get Started?',
    getInTouch: 'Get In Touch',
    exploreServices: 'Explore Services',
    callUs: 'Call Us',
    whatsappUs: 'WhatsApp Us',
    findUs: 'Find Us',
    getDirections: 'Get Directions',
    meetTheTeam: 'Meet The Team',
    pricing: 'Pricing',
    visitUs: 'Visit Us',
    name: 'Name',
    email: 'Email',
    emailOptional: 'Email (optional)',
    message: 'Message',
    customerOptional: 'Customer (optional)',
    noteOptional: 'Note (optional)',
    sendMessage: 'Send Message',
    thankYouMessage: "Thanks for reaching out — we'll be in touch shortly.",
    contactLabel: 'Contact',
    hoursLabel: 'Hours',
    followLabel: 'Follow',
    allRightsReserved: 'All rights reserved.',
    pageNotFound: "This page doesn't exist.",
    backToHome: 'Back to Home',
    bookAppointment: 'Book an Appointment',
    selectService: 'Select a service',
    preferredDate: 'Preferred Date',
    preferredTime: 'Preferred Time',
    phone: 'Phone',
    service: 'Service',
    note: 'Note',
    sendViaWhatsApp: 'Send via WhatsApp',
    appointmentRequestHeading: 'New Appointment Request',
    appointmentSentMessage: 'WhatsApp is open with your request ready — just hit send.',
    contactSentMessage: 'WhatsApp is open with your message ready — just hit send.',
    dateMustNotBePast: 'Please pick today or a later date',
    selectTimeSlot: 'Select a time',
    closedOnThisDay: "We're closed that day — please pick another date.",
    closedBannerTitle: "We're Currently Closed",
    closedBannerMessage:
      'Come back during business hours, or send us a message and we’ll get back to you.',
  },
  mr: {
    navAbout: 'आमच्याविषयी',
    navServices: 'सेवा',
    navGallery: 'गॅलरी',
    navTeam: 'टीम',
    navReviews: 'अभिप्राय',
    navFaq: 'प्रश्न',
    navPricing: 'दरपत्रक',
    navContact: 'संपर्क',
    navAppointment: 'बुक करा',
    contactUs: 'संपर्क करा',
    ourServices: 'आमच्या सेवा',
    gallery: 'गॅलरी',
    whatPeopleSay: 'ग्राहकांचे अभिप्राय',
    faqTitle: 'नेहमी विचारले जाणारे प्रश्न',
    readyToGetStarted: 'सुरुवात करण्यास तयार आहात?',
    getInTouch: 'संपर्क करा',
    exploreServices: 'सेवा पहा',
    callUs: 'कॉल करा',
    whatsappUs: 'व्हॉट्सॲप करा',
    findUs: 'आम्हाला शोधा',
    getDirections: 'दिशा मिळवा',
    meetTheTeam: 'टीमला भेटा',
    pricing: 'दरपत्रक',
    visitUs: 'आम्हाला भेट द्या',
    name: 'नाव',
    email: 'ईमेल',
    emailOptional: 'ईमेल (ऐच्छिक)',
    message: 'मेसेज',
    customerOptional: 'ग्राहकाचे नाव (ऐच्छिक)',
    noteOptional: 'टीप (ऐच्छिक)',
    sendMessage: 'मेसेज पाठवा',
    thankYouMessage: 'संपर्क केल्याबद्दल धन्यवाद — आम्ही लवकरच आपल्याशी संपर्क करू.',
    contactLabel: 'संपर्क',
    hoursLabel: 'वेळ',
    followLabel: 'फॉलो करा',
    allRightsReserved: 'सर्व हक्क राखीव.',
    pageNotFound: 'हे पान अस्तित्वात नाही.',
    backToHome: 'मुख्यपानावर जा',
    bookAppointment: 'भेटीची वेळ बुक करा',
    selectService: 'सेवा निवडा',
    preferredDate: 'पसंतीची तारीख',
    preferredTime: 'पसंतीची वेळ',
    phone: 'फोन',
    service: 'सेवा',
    note: 'टीप',
    sendViaWhatsApp: 'व्हॉट्सॲपने पाठवा',
    appointmentRequestHeading: 'नवीन भेटीची विनंती',
    appointmentSentMessage: 'तुमची विनंती व्हॉट्सॲपवर तयार आहे — फक्त पाठवा दाबा.',
    contactSentMessage: 'तुमचा मेसेज व्हॉट्सॲपवर तयार आहे — फक्त पाठवा दाबा.',
    dateMustNotBePast: 'कृपया आजची किंवा पुढील तारीख निवडा',
    selectTimeSlot: 'वेळ निवडा',
    closedOnThisDay: 'त्या दिवशी आम्ही बंद असतो — कृपया दुसरी तारीख निवडा.',
    closedBannerTitle: 'आम्ही सध्या बंद आहोत',
    closedBannerMessage:
      'कामाच्या वेळेत पुन्हा भेट द्या, किंवा आम्हाला मेसेज पाठवा — आम्ही लवकरच संपर्क करू.',
  },
} satisfies Record<SupportedLocale, Record<string, string>>;

export type UiStringKey = keyof typeof UI_STRINGS.en;

export function translateUi(key: UiStringKey, locale: SupportedLocale): string {
  return UI_STRINGS[locale]?.[key] ?? UI_STRINGS.en[key];
}

/**
 * "About {name}" — a separate function rather than a UI_STRINGS entry
 * because English and Marathi put the business name in a different place
 * ("About X" vs. "X विषयी"), not just a different word.
 */
export function getAboutHeading(businessName: string, locale: SupportedLocale): string {
  return locale === 'mr' ? `${businessName} विषयी` : `About ${businessName}`;
}
