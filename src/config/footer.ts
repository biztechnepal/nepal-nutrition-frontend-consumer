// Single source of truth for the dashboard footer. Edit this file to change
// the Important Links list or the NPC contact details shown in the footer.

export type FooterLinkGroup = 'misSystems' | 'ministries';

export interface FooterLink {
  id: string;
  label: string;
  url?: string;
  group: FooterLinkGroup;
}

export interface FooterInfo {
  address: string;
  contactNumber: string;
  email: string;
  copyrightHolder: string;
}

// A link without a `url` renders as plain text (e.g. WBRS).
export const IMPORTANT_LINKS: FooterLink[] = [
  // MIS Systems
  { id: 'hmis', label: 'Health Management Information System (HMIS)', url: 'https://hmis.gov.np/', group: 'misSystems' },
  { id: 'iemis', label: 'Integrated Education Management Information System (IEMIS)', url: 'http://iemis.cehrd.gov.np/', group: 'misSystems' },
  { id: 'nwash', label: 'National WASH Management Information System (NWASH)', url: 'https://nwash.gov.np/', group: 'misSystems' },
  { id: 'agriculture-mis', label: 'Agriculture Management Information System (Agriculture MIS)', url: 'http://agristat.moald.gov.np/', group: 'misSystems' },
  { id: 'sims', label: 'Social Information Management System (SIMS)', url: 'https://sims.gov.np/', group: 'misSystems' },
  { id: 'wbrs', label: 'Web-Based Reporting System (WBRS)', group: 'misSystems' },

  // Ministries & NPC
  { id: 'npc', label: 'National Planning Commission (NPC)', url: 'https://npc.gov.np/', group: 'ministries' },
  { id: 'mohp', label: 'Ministry of Health and Food Safety', url: 'https://mohp.gov.np/', group: 'ministries' },
  { id: 'moest', label: 'Ministry of Education and Sports', url: 'https://moest.gov.np/', group: 'ministries' },
  { id: 'mofaga', label: 'Ministry of Land Management, Co-operatives, Federal Affairs & General Administration', url: 'https://mofaga.gov.np/', group: 'ministries' },
  { id: 'moald', label: 'Ministry of Forests and Environment', url: 'https://moald.gov.np/', group: 'ministries' },
  { id: 'mowcsc', label: 'Ministry of Women, Children, Gender and Sexual Minorities, and Social Security', url: 'https://mowcsc.gov.np/', group: 'ministries' },
  { id: 'mows', label: 'Ministry of Water Supply', url: 'https://mows.gov.np/', group: 'ministries' },
];

export const FOOTER_INFO: FooterInfo = {
  address: 'National Planning Commission, Singha Durbar, Kathmandu, Nepal',
  contactNumber: '+977-1-4211528',
  email: 'nnfsp@npc.gov.np',
  copyrightHolder: 'National Planning Commission, Government of Nepal',
};
