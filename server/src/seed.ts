import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED_ASSETS_DIR = path.resolve(__dirname, "../seed-assets");
const UPLOADS_DIR = path.resolve(__dirname, "../uploads");

const INITIAL_SERVICES = [
  {
    title: { ru: "Мероприятия под ключ", en: "Turnkey Events", sk: "Podujatia na kľúč" },
    description: {
      ru: "Полная организация события — от концепции до реализации.",
      en: "Full event organisation, from concept to execution.",
      sk: "Kompletná organizácia podujatia od konceptu po realizáciu.",
    },
    seedImage: null as string | null,
  },
  {
    title: { ru: "Бранчи и мастер-классы", en: "Brunches & Workshops", sk: "Brunche a workshopy" },
    description: {
      ru: "Камерные бранчи и творческие мастер-классы в стильной, уютной атмосфере.",
      en: "Intimate brunches and creative workshops in a stylish, cosy setting.",
      sk: "Komorné brunche a kreatívne workshopy v štýlovej, útulnej atmosfére.",
    },
    seedImage: null as string | null,
  },
  {
    title: { ru: "Корпоративные мероприятия", en: "Corporate Events", sk: "Firemné podujatia" },
    description: {
      ru: "Тимбилдинги, праздники компании, деловые приёмы под ключ.",
      en: "Team-building, company celebrations and business receptions, end-to-end.",
      sk: "Teambuildingy, firemné oslavy a obchodné recepcie na kľúč.",
    },
    seedImage: null as string | null,
  },
  {
    title: {
      ru: "Изготовление 3D-фигур и декораций под заказ",
      en: "Custom 3D Figures & Decor Production",
      sk: "Výroba 3D figúr a dekorácií na zákazku",
    },
    description: {
      ru: "Авторские глянцевые скульптуры и декорации на заказ — эффектный акцент для любого события или бренд-активации.",
      en: "Custom glossy sculptures and decor pieces — a striking accent for any event or brand activation.",
      sk: "Autorské lesklé sochy a dekorácie na mieru — efektný akcent pre podujatie alebo aktiváciu značky.",
    },
    seedImage: "figure-hippo.webp",
  },
  {
    title: { ru: "Организация свиданий", en: "Date Planning", sk: "Organizácia rande" },
    description: {
      ru: "Атмосферные свидания в необычном формате — для тех, кто ценит детали.",
      en: "Atmospheric, unconventional dates for those who appreciate detail.",
      sk: "Atmosferické rande v nezvyčajnom formáte pre milovníkov detailu.",
    },
    seedImage: null as string | null,
  },
  {
    title: { ru: "Аренда декора для сервировки", en: "Decor Rental for Styling", sk: "Prenájom dekoru na prestieranie" },
    description: {
      ru: "Каталог посуды, текстиля и декора для самостоятельной сервировки по Братиславе.",
      en: "A catalogue of tableware, textiles and decor for self-styling across Bratislava.",
      sk: "Katalóg riadu, textilu a dekoru na samostatné prestieranie po Bratislave.",
    },
    seedImage: "table-bright.webp",
  },
];

function copySeedImage(filename: string): string {
  const dest = `seed-${filename}`;
  const destPath = path.join(UPLOADS_DIR, dest);
  if (!fs.existsSync(destPath)) {
    fs.copyFileSync(path.join(SEED_ASSETS_DIR, filename), destPath);
  }
  return `/api/uploads/${dest}`;
}

export function seedServicesIfEmpty() {
  const { count } = db.prepare("SELECT COUNT(*) as count FROM services").get() as { count: number };
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT INTO services (title_ru, title_en, title_sk, description_ru, description_en, description_sk, image_url, sort_order)
    VALUES (@title_ru, @title_en, @title_sk, @description_ru, @description_en, @description_sk, @image_url, @sort_order)
  `);

  const insertAll = db.transaction((items: typeof INITIAL_SERVICES) => {
    items.forEach((item, i) => {
      insert.run({
        title_ru: item.title.ru,
        title_en: item.title.en,
        title_sk: item.title.sk,
        description_ru: item.description.ru,
        description_en: item.description.en,
        description_sk: item.description.sk,
        image_url: item.seedImage ? copySeedImage(item.seedImage) : null,
        sort_order: i,
      });
    });
  });

  insertAll(INITIAL_SERVICES);
  console.log(`Seeded ${INITIAL_SERVICES.length} services into the database.`);
}

export function seedContactInfoIfEmpty() {
  const existing = db.prepare("SELECT id FROM contact_info WHERE id = 1").get();
  if (existing) return;

  db.prepare(`
    INSERT INTO contact_info (
      id, phone, whatsapp, instagram, threads, email,
      city_ru, city_en, city_sk,
      address_note_ru, address_note_en, address_note_sk
    ) VALUES (
      1, @phone, @whatsapp, @instagram, @threads, @email,
      @city_ru, @city_en, @city_sk,
      @address_note_ru, @address_note_en, @address_note_sk
    )
  `).run({
    phone: "+421918165503",
    whatsapp: "+421918165503",
    instagram: "sho.events.sk",
    threads: "sho.events.sk",
    email: "sho.events.sk@gmail.com",
    city_ru: "Братислава, Словакия",
    city_en: "Bratislava, Slovakia",
    city_sk: "Bratislava, Slovensko",
    address_note_ru: "Работаем по всей Братиславе и окрестностям",
    address_note_en: "We work across Bratislava and the surrounding area",
    address_note_sk: "Pôsobíme po celej Bratislave a okolí",
  });
  console.log("Seeded contact info into the database.");
}
