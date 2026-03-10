"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Nutrition Indicators", href: "/nutrition-indicators" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="w-full py-2">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative w-7 h-7 group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/images/emblem-of-nepal-seeklogo.svg"
              alt="Emblem of Nepal"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-black tracking-tight text-secondary">
            INIMS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.name}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent px-4 transition-all relative overflow-hidden",
                        pathname === link.href
                          ? "text-primary font-bold bg-primary/5"
                          : "hover:bg-primary/5 hover:text-primary text-muted-foreground",
                      )}
                    >
                      {link.name}
                      {pathname === link.href && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-in fade-in slide-in-from-bottom-1 duration-300" />
                      )}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:max-w-sm p-0 border-l-border/40"
            >
              <div className="flex flex-col h-full">
                {/* Drawer Header */}
                <div className="px-8 pt-10 pb-6 border-b border-border/50 bg-muted/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="relative w-6 h-6">
                      <Image
                        src="/images/emblem-of-nepal-seeklogo.svg"
                        alt="Emblem of Nepal"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-secondary leading-tight mt-1">
                      INIMS
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium mt-2">
                    Data-Driven Insights
                  </p>
                </div>

                {/* Drawer Links */}
                <div className="grow overflow-y-auto px-4 py-8">
                  <nav className="flex flex-col space-y-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={cn(
                          "px-4 py-4 rounded-xl text-lg font-semibold transition-all flex items-center justify-between group",
                          pathname === link.href
                            ? "bg-primary/10 text-primary shadow-sm"
                            : "text-foreground hover:bg-muted",
                        )}
                      >
                        {link.name}
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                            pathname === link.href
                              ? "bg-primary text-white"
                              : "bg-muted group-hover:bg-primary/20 group-hover:text-primary",
                          )}
                        >
                          <span className="text-xl">→</span>
                        </div>
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
