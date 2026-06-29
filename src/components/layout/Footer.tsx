import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-gray-100 py-12 mt-auto">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
            <div className="flex items-center space-x-3">
              <div className="relative w-8 h-8">
                <Image
                  src="/images/emblem-of-nepal-seeklogo.svg"
                  alt="Emblem of Nepal"
                  fill
                  className="object-contain opacity-80"
                />
              </div>
              <span className="text-lg font-black tracking-tight text-secondary">
                INIMS
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Integrated Nutrition Information Management System - Empowering
              Nepal with data-driven nutrition insights.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
            <p className="text-sm font-bold text-secondary">
              © {currentYear} National Planning Commission
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
