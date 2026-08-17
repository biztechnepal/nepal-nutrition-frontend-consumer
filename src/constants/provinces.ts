export const PROVINCE_COLORS: Record<string, string> = {
  Koshi: "#f6bd60",
  Madhesh: "#f7ede2",
  Bagmati: "#f5cac3",
  Gandaki: "#84a59d",
  Lumbini: "#f28482",
  Karnali: "#98c1d9",
  Sudurpashchim: "#dda15e",
};

export const PROVINCE_NAMES = Object.keys(PROVINCE_COLORS);

export const provinceColor = (name: string | null | undefined) =>
  (name && PROVINCE_COLORS[name]) || "var(--primary)";

/**
 * Districts and local levels are tinted from their province's colour so the
 * drilled-in view still reads as part of the same province. Sorting the
 * children by name and spreading them across the range keeps neighbouring
 * units distinguishable without inventing a second palette.
 */
export const shadeFor = (base: string, index: number, total: number) => {
  if (total <= 1) return base;
  const hex = base.replace("#", "");
  const to = (offset: number) => parseInt(hex.slice(offset, offset + 2), 16);
  // -18%..+18% lightness around the province colour.
  const t = (index / (total - 1)) * 0.36 - 0.18;
  const mix = (channel: number) =>
    Math.round(
      t >= 0 ? channel + (255 - channel) * t : channel * (1 + t),
    ).toString(16).padStart(2, "0");
  return `#${mix(to(0))}${mix(to(2))}${mix(to(4))}`;
};
