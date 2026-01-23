export type LegalKey = 'privacy' | 'policy' | 'nda';

export const LEGAL_CONTENT: Record<LegalKey, { title: string; body: string }> = {
  privacy: {
    title: 'Privacy Policy',
    body: `PLACEHOLDER PRIVACY POLICY

Replace this text with your Privacy Policy content.

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  },
  policy: {
    title: 'Policy Agreement',
    body: `PLACEHOLDER POLICY AGREEMENT

Replace this text with your Policy Agreement content.

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  },
  nda: {
    title: 'Non-Disclosure Agreement (NDA)',
    body: `PLACEHOLDER NDA

Replace this text with your NDA content.

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
  },
};
