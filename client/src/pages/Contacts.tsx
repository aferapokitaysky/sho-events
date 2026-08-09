import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { Container, Divider, Kicker } from "@/components/ui/Section";
import { Reveal, RevealItem, RevealStagger } from "@/components/ui/Reveal";
import { PhotoBandHero } from "@/components/ui/PhotoBandHero";
import { InquiryForm, type ChannelOption, type FieldConfig } from "@/components/ui/InquiryForm";
import { IconArrowUpRight, IconInstagram, IconMail, IconPhone, IconPin, IconThreads, IconWhatsapp } from "@/components/icons";
import type { ComponentType, SVGProps } from "react";
import { fetchContactInfo, pick, type PublicContactInfo } from "@/lib/publicContent";
import flatlayPhoto from "@/assets/photos/stationery-flatlay.webp";
import heroPhotoDefault from "@/assets/photos/hero-contacts-band.webp";
import { useSiteImage } from "@/lib/useSiteImage";

const channelIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  phone: IconPhone,
  whatsapp: IconWhatsapp,
  instagram: IconInstagram,
  threads: IconThreads,
  email: IconMail,
};

const channelLabels: Record<string, string> = {
  phone: "Телефон",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  threads: "Threads",
  email: "Email",
};

export default function Contacts() {
  const { t, lang } = useLanguage();
  const heroPhoto = useSiteImage("contacts_hero", heroPhotoDefault);
  const [contactInfo, setContactInfo] = useState<PublicContactInfo | null>(null);

  useEffect(() => {
    fetchContactInfo()
      .then(setContactInfo)
      .catch(() => setContactInfo(null));
  }, []);

  const findLabel = (id: string) => t.contacts.channels.find((c) => c.id === id)?.label ?? channelLabels[id];

  const channelOptions: ChannelOption[] = [
    { key: "phone", label: findLabel("phone"), placeholder: "+421 900 000 000", inputType: "tel" },
    { key: "whatsapp", label: "WhatsApp", placeholder: "+421 900 000 000", inputType: "tel" },
    { key: "telegram", label: "Telegram", placeholder: "@username", inputType: "text" },
    { key: "instagram", label: findLabel("instagram"), placeholder: "@username", inputType: "text" },
    { key: "threads", label: findLabel("threads"), placeholder: "@username", inputType: "text" },
    { key: "email", label: findLabel("email"), placeholder: "you@email.com", inputType: "email" },
  ];

  const fields: FieldConfig[] = [
    { name: "name", label: t.common.formName, type: "text", required: true, span: "half" },
    { name: "contact", label: t.common.formContact, type: "text", required: true, span: "half" },
    { name: "eventType", label: t.common.formEventType, type: "select", options: t.contacts.eventTypes, span: "half" },
    { name: "date", label: t.common.formDate, type: "dateMask", span: "half" },
    {
      name: "channels",
      label: t.common.formPreferredChannels,
      type: "checkboxGroup",
      channelOptions,
    },
    { name: "message", label: t.common.formMessage, type: "textarea", required: true },
  ];

  const city = contactInfo ? pick(contactInfo.city, lang) : t.contacts.city;
  const addressNote = contactInfo ? pick(contactInfo.addressNote, lang) : t.contacts.addressNote;
  const channels = contactInfo
    ? contactInfo.channels.map((c) => ({ ...c, label: findLabel(c.id) }))
    : t.contacts.channels;

  return (
    <div>
      <PhotoBandHero
        kicker={t.contacts.kicker}
        title={t.contacts.title}
        lead={t.contacts.lead}
        image={heroPhoto}
        alt="SHO Events"
        objectPosition="65% 55%"
      />

      <section className="pb-16 pt-24 sm:pb-20 sm:pt-32">
        <Container className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-stretch lg:gap-14">
          <div>
            <Reveal>
              <div className="flex items-center gap-3 text-ink">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-wine-800 text-ivory">
                  <IconPin className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <p className="text-lg">{city}</p>
                  <p className="text-sm text-ink-soft/60">{addressNote}</p>
                </div>
              </div>
            </Reveal>

            <RevealStagger className="mt-8 grid gap-4 sm:grid-cols-2">
              {channels.map((c) => {
                const Icon = channelIcons[c.id] ?? IconPhone;
                const external = c.id !== "phone" && c.id !== "email";
                return (
                  <RevealItem key={c.id}>
                    <a
                      href={c.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      data-cursor-hover
                      className="group flex h-full items-center gap-4 rounded-2xl bg-paper p-5 transition-colors duration-300 hover:bg-wine-900"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ivory text-wine-700 shadow-sm transition-colors duration-300 group-hover:bg-wine-800 group-hover:text-ivory">
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="kicker block text-ink-soft/50 transition-colors duration-300 group-hover:text-beige-dark">
                          {c.label}
                        </span>
                        <span className="block truncate text-lg text-ink transition-colors duration-300 group-hover:text-ivory">
                          {c.value}
                        </span>
                      </span>
                      <IconArrowUpRight className="h-4 w-4 shrink-0 text-ink-soft/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-beige-dark" />
                    </a>
                  </RevealItem>
                );
              })}
            </RevealStagger>
          </div>

          <Reveal delay={0.12}>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-soft lg:aspect-auto lg:h-full lg:min-h-[420px]">
              <img src={flatlayPhoto} alt="SHO Events" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-wine-950/35 via-transparent to-transparent" />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-wine-950 py-24 text-ivory sm:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden="true">
          <svg viewBox="0 0 400 400" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
            <circle cx="60" cy="40" r="220" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="60" cy="40" r="170" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
        </div>

        <Container className="relative mx-auto max-w-2xl">
          <Reveal>
            <div className="text-center">
              <Kicker dark className="justify-center">
                {t.contacts.kicker}
              </Kicker>
              <h2 className="mt-5 text-balance text-[2.4rem] leading-tight sm:text-[3rem]">{t.contacts.formTitle}</h2>
              <p className="mx-auto mt-4 max-w-sm text-ivory/65">{t.contacts.formNote}</p>
              <Divider className="mx-auto mt-8 text-beige-dark/60" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 rounded-[2rem] bg-ivory p-8 shadow-soft sm:p-12">
              <InquiryForm endpoint="contact" fields={fields} submitLabel={t.common.formSubmit} />
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
