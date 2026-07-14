"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { QueryKeys } from "@/constants/query-keys";
import { getContent } from "@/services/content.service";
import { useLocale } from "@/features/i18n/hooks/useLocale";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export const NavigationBar = () => {
  const pathname = usePathname();
  const { t } = useTranslation("header");
  const { locale } = useLocale();

  const { data: contentData } = useQuery({
    queryKey: [QueryKeys.CONTENT, locale],
    queryFn: () => getContent(locale),
  });

  const contentItems = contentData?.data ?? [];

  const navLinks = [
    { name: t("home"), href: "/" },
    { name: t("nutritionIndicators"), href: "/nutrition-indicators" },
    { name: t("digitalLibrary"), href: "/gallery" },
  ];

  return (
    <div className="w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3 flex items-center overflow-x-auto scrollbar-hide">
        <NavigationMenu>
          <NavigationMenuList>
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.name}>
                <NavigationMenuLink asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent px-4 transition-all relative overflow-hidden whitespace-nowrap",
                      (
                        link.href === "/"
                          ? pathname === "/"
                          : pathname.startsWith(link.href)
                      )
                        ? "text-primary font-bold bg-primary/5"
                        : "hover:bg-primary/5 hover:text-primary text-muted-foreground",
                    )}
                  >
                    {link.name}
                    {(link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href)) && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-in fade-in slide-in-from-bottom-1 duration-300" />
                    )}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            {contentItems.map((item) => (
              <NavigationMenuItem key={item.id}>
                <NavigationMenuLink asChild>
                  <Link
                    href={`/contents/${item.slug}`}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent px-4 transition-all relative overflow-hidden whitespace-nowrap",
                      pathname === `/contents/${item.slug}`
                        ? "text-primary font-bold bg-primary/5"
                        : "hover:bg-primary/5 hover:text-primary text-muted-foreground",
                    )}
                  >
                    {item.title}
                    {pathname === `/contents/${item.slug}` && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-in fade-in slide-in-from-bottom-1 duration-300" />
                    )}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/contact"
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent px-4 transition-all relative overflow-hidden whitespace-nowrap",
                    pathname.startsWith("/contact")
                      ? "text-primary font-bold bg-primary/5"
                      : "hover:bg-primary/5 hover:text-primary text-muted-foreground",
                  )}
                >
                  {t("contactUs")}
                  {pathname.startsWith("/contact") && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-in fade-in slide-in-from-bottom-1 duration-300" />
                  )}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};
