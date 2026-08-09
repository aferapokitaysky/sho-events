import type { Lang } from "./types";

export type PageKey = "home" | "about" | "services" | "formats" | "decor" | "portfolio" | "partners" | "contacts";

export interface PageSeo {
  title: string;
  description: string;
  keywords: string[];
}

export const pagePaths: Record<PageKey, string> = {
  home: "/",
  about: "/about",
  services: "/services",
  formats: "/formats",
  decor: "/decor",
  portfolio: "/portfolio",
  partners: "/partners",
  contacts: "/contacts",
};

export const pathToPage = Object.fromEntries(
  Object.entries(pagePaths).map(([key, path]) => [path, key]),
) as Record<string, PageKey>;

export const localeByLang: Record<Lang, string> = {
  ru: "ru_RU",
  en: "en_GB",
  sk: "sk_SK",
};

export const languageNameByLang: Record<Lang, string> = {
  ru: "Russian",
  en: "English",
  sk: "Slovak",
};

export const seoByLang: Record<Lang, Record<PageKey, PageSeo>> = {
  ru: {
    home: {
      title: "SHO Events — организация мероприятий под ключ в Братиславе",
      description:
        "Ивент-агентство SHO Events в Братиславе: организация свиданий, бранчей, мастер-классов, дегустаций, частных и корпоративных мероприятий под ключ.",
      keywords: [
        "организация мероприятий Братислава",
        "ивент агентство Братислава",
        "мероприятия под ключ Словакия",
        "SHO Events",
        "организация праздников Bratislava",
      ],
    },
    about: {
      title: "О SHO Events — ивент-агентство с эстетикой и вниманием к деталям",
      description:
        "Узнайте подход SHO Events: концепция, атмосфера, декор, гастрономия и полное сопровождение событий в Братиславе и окрестностях.",
      keywords: [
        "о SHO Events",
        "креативное ивент агентство",
        "event agency Bratislava",
        "организация событий с декором",
      ],
    },
    services: {
      title: "Услуги SHO Events — события, декор и организация под ключ",
      description:
        "Организуем мероприятия под ключ, бранчи, мастер-классы, корпоративы, свидания, аренду декора и изготовление 3D-фигур для событий в Братиславе.",
      keywords: [
        "услуги ивент агентства",
        "корпоративные мероприятия Братислава",
        "организация свиданий Братислава",
        "аренда декора Братислава",
        "3D фигуры декор на заказ",
      ],
    },
    formats: {
      title: "Форматы мероприятий — свидания, бранчи, дегустации и корпоративы",
      description:
        "Подбираем формат события под настроение: романтические свидания, бранчи, дегустации, ужины шефов, дни рождения, корпоративы и бренд-активации.",
      keywords: [
        "форматы мероприятий",
        "бранч Братислава",
        "дегустация Братислава",
        "романтическое свидание Братислава",
        "бренд активация Словакия",
      ],
    },
    partners: {
      title: "Партнёрство с SHO Events — события для ресторанов, отелей и брендов",
      description:
        "Создаём совместные мероприятия для ресторанов, отелей, кондитерских, локальных брендов и компаний: концепция, гости, оформление и продюсирование.",
      keywords: [
        "партнерство ивент агентство",
        "события для ресторанов",
        "мероприятия для отелей",
        "коллаборации брендов Братислава",
      ],
    },
    contacts: {
      title: "Контакты SHO Events — обсудить мероприятие в Братиславе",
      description:
        "Свяжитесь с SHO Events, чтобы обсудить частное, корпоративное или партнёрское мероприятие в Братиславе. Ответим в течение 24 часов.",
      keywords: [
        "контакты SHO Events",
        "заказать мероприятие Братислава",
        "ивент агентство контакты",
        "event planner Bratislava contact",
      ],
    },
    decor: {
      title: "Аренда декора для сервировки — SHO Events Братислава",
      description:
        "Каталог посуды, текстиля и декора для самостоятельной сервировки в Братиславе — готовые наборы с фото и ценами.",
      keywords: ["аренда декора Братислава", "прокат посуды Братислава", "декор для сервировки", "SHO Events декор"],
    },
    portfolio: {
      title: "Портфолио SHO Events — фото с наших мероприятий в Братиславе",
      description: "Реальные кадры с мероприятий SHO Events: атмосфера, декор и детали событий в Братиславе.",
      keywords: ["портфолио ивент агентства", "фото мероприятий Братислава", "SHO Events портфолио"],
    },
  },
  en: {
    home: {
      title: "SHO Events — Full-Service Event Planning in Bratislava",
      description:
        "SHO Events is a Bratislava event agency for curated dates, brunches, workshops, tastings, private celebrations and corporate events.",
      keywords: [
        "event planning Bratislava",
        "event agency Bratislava",
        "full service event planner Slovakia",
        "SHO Events",
        "private events Bratislava",
      ],
    },
    about: {
      title: "About SHO Events — Atmospheric Event Agency in Bratislava",
      description:
        "Discover SHO Events' approach to concept, decor, gastronomy and full event coordination for stylish celebrations in Bratislava.",
      keywords: [
        "about SHO Events",
        "creative event agency",
        "Bratislava event planner",
        "event design Slovakia",
      ],
    },
    services: {
      title: "SHO Events Services — Event Planning, Decor and Custom Production",
      description:
        "Turnkey events, brunches, workshops, corporate events, date planning, decor rental and custom 3D decor production in Bratislava.",
      keywords: [
        "event planning services Bratislava",
        "corporate events Bratislava",
        "date planning Bratislava",
        "decor rental Bratislava",
        "custom event decor Slovakia",
      ],
    },
    formats: {
      title: "Event Formats — Dates, Brunches, Tastings and Corporate Events",
      description:
        "Choose a format for your event: romantic dates, brunches, tastings, chef dinners, birthdays, corporate receptions and brand activations.",
      keywords: [
        "event formats Bratislava",
        "brunch events Bratislava",
        "tasting events Slovakia",
        "romantic date planning",
        "brand activation Bratislava",
      ],
    },
    partners: {
      title: "Partner With SHO Events — Events for Venues, Hotels and Brands",
      description:
        "SHO Events creates collaborative events for restaurants, hotels, patisseries, local brands and companies in Bratislava.",
      keywords: [
        "event partnership Bratislava",
        "restaurant events Slovakia",
        "hotel events Bratislava",
        "brand collaborations Bratislava",
      ],
    },
    contacts: {
      title: "Contact SHO Events — Plan an Event in Bratislava",
      description:
        "Contact SHO Events to discuss a private, corporate or partner event in Bratislava. We reply within 24 hours.",
      keywords: [
        "contact SHO Events",
        "book event planner Bratislava",
        "event agency contact Slovakia",
        "event planner Bratislava contact",
      ],
    },
    decor: {
      title: "Decor Rental for Styling — SHO Events Bratislava",
      description: "A catalogue of tableware, textiles and decor for self-styling in Bratislava — ready sets with photos and prices.",
      keywords: ["decor rental Bratislava", "tableware rental Bratislava", "styling decor", "SHO Events decor"],
    },
    portfolio: {
      title: "SHO Events Portfolio — Photos From Our Events in Bratislava",
      description: "Real shots from SHO Events celebrations: atmosphere, decor and detail from events in Bratislava.",
      keywords: ["event agency portfolio", "event photos Bratislava", "SHO Events portfolio"],
    },
  },
  sk: {
    home: {
      title: "SHO Events — organizácia podujatí na kľúč v Bratislave",
      description:
        "Event agentúra SHO Events v Bratislave organizuje rande, brunche, workshopy, ochutnávky, súkromné oslavy a firemné podujatia na kľúč.",
      keywords: [
        "organizácia podujatí Bratislava",
        "event agentúra Bratislava",
        "podujatia na kľúč Slovensko",
        "SHO Events",
        "súkromné oslavy Bratislava",
      ],
    },
    about: {
      title: "O SHO Events — event agentúra s dôrazom na atmosféru",
      description:
        "Spoznajte prístup SHO Events ku konceptu, dekoru, gastronómii a kompletnej koordinácii štýlových podujatí v Bratislave.",
      keywords: [
        "o SHO Events",
        "kreatívna event agentúra",
        "event planner Bratislava",
        "event dizajn Slovensko",
      ],
    },
    services: {
      title: "Služby SHO Events — organizácia, dekor a produkcia podujatí",
      description:
        "Podujatia na kľúč, brunche, workshopy, firemné akcie, organizácia rande, prenájom dekoru a výroba 3D dekorácií v Bratislave.",
      keywords: [
        "služby event agentúry",
        "firemné podujatia Bratislava",
        "organizácia rande Bratislava",
        "prenájom dekoru Bratislava",
        "3D dekorácie na zákazku",
      ],
    },
    formats: {
      title: "Formáty podujatí — rande, brunche, ochutnávky a firemné akcie",
      description:
        "Vyberte si formát podujatia: romantické rande, brunche, ochutnávky, večere šéfkuchárov, narodeniny, firemné recepcie a aktivácie značiek.",
      keywords: [
        "formáty podujatí",
        "brunch Bratislava",
        "ochutnávka Bratislava",
        "romantické rande Bratislava",
        "aktivácia značky Slovensko",
      ],
    },
    partners: {
      title: "Partnerstvo so SHO Events — podujatia pre reštaurácie, hotely a značky",
      description:
        "Tvoríme spoločné podujatia pre reštaurácie, hotely, cukrárne, lokálne značky a firmy: koncept, hostia, styling a produkcia.",
      keywords: [
        "partnerstvo event agentúra",
        "podujatia pre reštaurácie",
        "podujatia pre hotely",
        "brand kolaborácie Bratislava",
      ],
    },
    contacts: {
      title: "Kontakt SHO Events — preberme podujatie v Bratislave",
      description:
        "Kontaktujte SHO Events a preberme súkromné, firemné alebo partnerské podujatie v Bratislave. Odpovieme do 24 hodín.",
      keywords: [
        "kontakt SHO Events",
        "objednať event planner Bratislava",
        "event agentúra kontakt",
        "organizácia podujatí kontakt",
      ],
    },
    decor: {
      title: "Prenájom dekoru na prestieranie — SHO Events Bratislava",
      description: "Katalóg riadu, textilu a dekoru na samostatné prestieranie v Bratislave — hotové sety s fotkami a cenami.",
      keywords: ["prenájom dekoru Bratislava", "prenájom riadu Bratislava", "dekor na prestieranie", "SHO Events dekor"],
    },
    portfolio: {
      title: "Portfólio SHO Events — fotky z našich podujatí v Bratislave",
      description: "Skutočné zábery z podujatí SHO Events: atmosféra, dekor a detaily podujatí v Bratislave.",
      keywords: ["portfólio event agentúry", "fotky z podujatí Bratislava", "SHO Events portfólio"],
    },
  },
};
