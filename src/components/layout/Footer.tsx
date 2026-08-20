"use client";

import { useTranslation } from "react-i18next";
import { MapPin, Phone, Mail } from "lucide-react";
import { FOOTER_INFO, IMPORTANT_LINKS, type FooterLinkGroup } from "@/config/footer";

const LINK_GROUPS: FooterLinkGroup[] = ["misSystems", "ministries"];

const Footer = () => {
  const { t } = useTranslation("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 bg-footer text-footer-foreground">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-12 lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                alt={t("brandName", { defaultValue: "INIMS" })}
                className="h-10 w-auto"
                src="/images/emblem-of-nepal-seeklogo.svg"
              />
              <div>
                <p className="text-sm font-bold uppercase tracking-widest">
                  {t("brandName", { defaultValue: "INIMS" })}
                </p>
                <p className="text-xs text-footer-muted">
                  {t("brandTagline", {
                    defaultValue: "Integrated National Information Management System",
                  })}
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-footer-muted">
              {t("aboutNpc", {
                defaultValue:
                  "National Planning Commission is the advisory body for formulating national development policies, plans and programmes.",
              })}
            </p>
          </div>

          {LINK_GROUPS.map((group) => (
            <nav key={group} aria-label={t(group, { defaultValue: group })}>
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                <span className="h-4 w-1 rounded-full bg-footer-accent" aria-hidden />
                {t(group, { defaultValue: group })}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {IMPORTANT_LINKS.filter((link) => link.group === group).map((link) =>
                  link.url ? (
                    <li key={link.id}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-footer-muted transition-colors hover:text-white hover:underline underline-offset-4"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.id} className="text-sm text-footer-muted/70">
                      {link.label}
                    </li>
                  ),
                )}
              </ul>
            </nav>
          ))}

          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
              <span className="h-4 w-1 rounded-full bg-footer-accent" aria-hidden />
              {t("npcInformation", { defaultValue: "NPC Information" })}
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-footer-muted">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-footer-accent" aria-hidden />
                <span>{FOOTER_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-footer-accent" aria-hidden />
                <a
                  href={`tel:${FOOTER_INFO.contactNumber.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-white"
                >
                  {FOOTER_INFO.contactNumber}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-footer-accent" aria-hidden />
                <a href={`mailto:${FOOTER_INFO.email}`} className="transition-colors hover:text-white">
                  {FOOTER_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-footer-border">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-footer-muted sm:flex-row lg:px-10">
          <p>
            {t("copyright", {
              year,
              holder: FOOTER_INFO.copyrightHolder,
              defaultValue: "© {{year}} {{holder}}. All rights reserved.",
            })}
          </p>
          <p>{FOOTER_INFO.email}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
