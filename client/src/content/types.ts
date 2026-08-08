export type Lang = "ru" | "en" | "sk";

export interface NavContent {
  home: string;
  about: string;
  services: string;
  formats: string;
  partners: string;
  contacts: string;
}

export interface CommonContent {
  ctaConsult: string;
  ctaBook: string;
  ctaLearnMore: string;
  ctaSend: string;
  ctaViewAll: string;
  ctaWriteUs: string;
  formName: string;
  formPhone: string;
  formContact: string;
  formEmail: string;
  formMessage: string;
  formEventType: string;
  formDate: string;
  formGuests: string;
  formCompany: string;
  formPreferredChannels: string;
  formSubmit: string;
  formSubmitting: string;
  formSuccessTitle: string;
  formSuccessText: string;
  formError: string;
  formRequired: string;
  menu: string;
  close: string;
  rights: string;
  addressLabel: string;
  followUs: string;
  searchPlaceholder: string;
  searchNoResults: string;
  searchCta: string;
  scrollHint: string;
  since: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface HomeContent {
  heroKicker: string;
  heroTitleTop: string;
  heroTitleScript: string;
  heroTitleBottom: string;
  heroSubtitle: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  stats: StatItem[];
  introKicker: string;
  introTitle: string;
  introText: string;
  servicesKicker: string;
  servicesTitle: string;
  servicesText: string;
  formatsKicker: string;
  formatsTitle: string;
  processKicker: string;
  processTitle: string;
  processSteps: { number: string; title: string; text: string }[];
  partnersKicker: string;
  partnersTitle: string;
  partnersText: string;
  quote: string;
  quoteAuthor: string;
  ctaTitle: string;
  ctaText: string;
}

export interface ValueItem {
  title: string;
  text: string;
}

export interface AboutContent {
  kicker: string;
  title: string;
  lead: string;
  storyKicker: string;
  storyTitle: string;
  storyParagraphs: string[];
  valuesKicker: string;
  valuesTitle: string;
  values: ValueItem[];
  approachKicker: string;
  approachTitle: string;
  approachSteps: { title: string; text: string }[];
  quote: string;
  ctaTitle: string;
  ctaText: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  tag?: string;
}

export interface ServicesContent {
  kicker: string;
  title: string;
  lead: string;
  services: ServiceItem[];
  ctaTitle: string;
  ctaText: string;
}

export interface FormatItem {
  id: string;
  title: string;
  description: string;
}

export interface FormatsContent {
  kicker: string;
  title: string;
  lead: string;
  formats: FormatItem[];
  ctaTitle: string;
  ctaText: string;
}

export interface PartnersContent {
  kicker: string;
  title: string;
  lead: string;
  audiencesKicker: string;
  audiencesTitle: string;
  audiences: ValueItem[];
  collabKicker: string;
  collabTitle: string;
  collabTypes: ValueItem[];
  formTitle: string;
  formNote: string;
}

export interface ContactsContent {
  kicker: string;
  title: string;
  lead: string;
  city: string;
  addressNote: string;
  channels: { id: "phone" | "whatsapp" | "instagram" | "threads" | "email"; label: string; value: string; href: string }[];
  formTitle: string;
  formNote: string;
  eventTypes: string[];
}

export interface SiteContent {
  meta: {
    title: string;
    description: string;
  };
  nav: NavContent;
  common: CommonContent;
  home: HomeContent;
  about: AboutContent;
  services: ServicesContent;
  formats: FormatsContent;
  partners: PartnersContent;
  contacts: ContactsContent;
}
