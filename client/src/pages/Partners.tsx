import { useLanguage } from "@/lib/LanguageContext";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealItem, RevealStagger } from "@/components/ui/Reveal";
import { PhotoBandHero } from "@/components/ui/PhotoBandHero";
import { InquiryForm, type ChannelOption, type FieldConfig } from "@/components/ui/InquiryForm";
import {
  IconBriefcase,
  IconCube,
  IconGift,
  IconGrapes,
  IconHandshake,
  IconPin,
  IconUsers,
} from "@/components/icons";
import type { ComponentType, SVGProps } from "react";
import collabPhoto from "@/assets/photos/wax-seal-photo.webp";
import heroPhotoDefault from "@/assets/photos/hero-partners-band.webp";
import { useSiteImage } from "@/lib/useSiteImage";

const audienceIcons: ComponentType<SVGProps<SVGSVGElement>>[] = [IconGrapes, IconPin, IconGift, IconBriefcase, IconUsers];
const collabIcons: ComponentType<SVGProps<SVGSVGElement>>[] = [IconHandshake, IconPin, IconCube, IconBriefcase];

export default function Partners() {
  const { t } = useLanguage();
  const heroPhoto = useSiteImage("partners_hero", heroPhotoDefault);

  const findChannel = (id: string) => t.contacts.channels.find((c) => c.id === id)?.label;

  const channelOptions: ChannelOption[] = [
    { key: "phone", label: findChannel("phone") ?? "Phone", placeholder: "+421 900 000 000", inputType: "tel" },
    { key: "whatsapp", label: "WhatsApp", placeholder: "+421 900 000 000", inputType: "tel" },
    { key: "telegram", label: "Telegram", placeholder: "@username", inputType: "text" },
    { key: "instagram", label: findChannel("instagram") ?? "Instagram", placeholder: "@username", inputType: "text" },
    { key: "threads", label: findChannel("threads") ?? "Threads", placeholder: "@username", inputType: "text" },
    { key: "email", label: findChannel("email") ?? "Email", placeholder: "you@email.com", inputType: "email" },
  ];

  const fields: FieldConfig[] = [
    { name: "name", label: t.common.formName, type: "text", required: true, span: "half" },
    { name: "company", label: t.common.formCompany, type: "text", required: true, span: "half" },
    { name: "contact", label: t.common.formContact, type: "text", required: true, span: "half" },
    { name: "email", label: t.common.formEmail, type: "email", span: "half" },
    { name: "channels", label: t.common.formPreferredChannels, type: "checkboxGroup", channelOptions },
    { name: "message", label: t.common.formMessage, type: "textarea" },
  ];

  return (
    <div>
      <PhotoBandHero
        kicker={t.partners.kicker}
        title={t.partners.title}
        lead={t.partners.lead}
        image={heroPhoto}
        alt="SHO Events"
        objectPosition="55% 50%"
      />

      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading kicker={t.partners.audiencesKicker} title={t.partners.audiencesTitle} />
          <RevealStagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {t.partners.audiences.map((a, i) => {
              const Icon = audienceIcons[i % audienceIcons.length];
              return (
                <RevealItem key={a.title}>
                  <div className="h-full rounded-2xl bg-paper p-7">
                    <Icon className="h-7 w-7 text-wine-700" />
                    <h3 className="mt-5 text-xl text-ink">{a.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-soft/70">{a.text}</p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealStagger>
        </Container>
      </section>

      <section className="bg-wine-950 py-24 text-ivory sm:py-32">
        <Container className="grid gap-16 lg:grid-cols-[1fr_0.85fr] lg:items-start">
          <div>
            <SectionHeading kicker={t.partners.collabKicker} title={t.partners.collabTitle} dark />
            <RevealStagger className="mt-14 grid gap-8">
              {t.partners.collabTypes.map((c, i) => {
                const Icon = collabIcons[i % collabIcons.length];
                return (
                  <RevealItem key={c.title}>
                    <div className="flex gap-5 border-b border-ivory/10 pb-8">
                      <Icon className="h-8 w-8 shrink-0 text-beige-dark" />
                      <div>
                        <h3 className="text-2xl">{c.title}</h3>
                        <p className="mt-1.5 text-ivory/65">{c.text}</p>
                      </div>
                    </div>
                  </RevealItem>
                );
              })}
            </RevealStagger>
          </div>
          <Reveal delay={0.15}>
            <div className="overflow-hidden rounded-[2rem] shadow-card">
              <img src={collabPhoto} alt="SHO Events — wax seal" className="h-full w-full object-cover" />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-24 sm:py-32">
        <Container className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="text-[2.2rem] text-ink sm:text-[2.6rem]">{t.partners.formTitle}</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-3 text-ink-soft/75">{t.partners.formNote}</p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-12 text-left">
              <InquiryForm endpoint="partners" fields={fields} submitLabel={t.common.formSubmit} />
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
