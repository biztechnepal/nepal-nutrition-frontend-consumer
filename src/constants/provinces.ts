export const PROVINCE_COLORS: Record<string, string> = {
  Koshi: "#f6bd60",
  Madhesh: "#f7ede2",
  Bagmati: "#f5cac3",
  Gandaki: "#84a59d",
  Lumbini: "#f28482",
  Karnali: "#98c1d9",
  Sudurpashchim: "#dda15e",
};

export const PROVINCE_MAPPING_TO_DISPLAY: Record<string, string> = {
  "Province No 1": "Koshi",
  "Province No 2": "Madhesh",
  "Bagmati Pradesh": "Bagmati",
  "Gandaki Pradesh": "Gandaki",
  "Province No 5": "Lumbini",
  "Karnali Pradesh": "Karnali",
  "Sudurpashchim Pradesh": "Sudurpashchim",
};

export const getDisplayName = (name: string): string => {
  const key = Object.keys(PROVINCE_MAPPING_TO_DISPLAY).find(
    (k) =>
      name.toLowerCase().includes(k.toLowerCase()) ||
      k.toLowerCase().includes(name.toLowerCase()),
  );
  return key ? PROVINCE_MAPPING_TO_DISPLAY[key] : name;
};
