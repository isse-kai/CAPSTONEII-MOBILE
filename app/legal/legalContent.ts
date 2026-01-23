export type LegalKey = "privacy" | "policy" | "nda";

export const LEGAL_CONTENT: Record<LegalKey, { title: string; body: string }> =
  {
    privacy: {
      title: "Privacy Policy",
      body: `Privacy Policy
Please read the policy below. Click “I Agree” to enable and check the checkbox.

JDK HOMECARE Privacy Policy

This Privacy Policy explains how JDK HOMECARE collects, uses, stores, and protects your information when you use our platform as a worker.

1. Information We Collect

• Account information (name, email, sex) you provide during registration.
• Work/service-related information you submit while using worker features.
• Device and usage data (basic logs, timestamps) to help secure and improve the platform.

2. How We Use Your Information

• To create and manage your worker account.
• To provide core features (applications, matching, notifications).
• To improve security, prevent fraud, and comply with legal obligations.
• To communicate important updates related to your account and activity.

3. Data Sharing

• We may share limited information with clients only as necessary to fulfill a service request (e.g., name and service-related details).
• We do not sell your personal information. We may share information when required by law or to protect our users and platform.

4. Data Retention

We keep information only as long as needed to operate the service and meet legal and security requirements.

5. Security

We use reasonable safeguards to protect your information. No method of transmission or storage is 100% secure, but we work to protect your data.

6. Updates to this Policy

We may update this policy from time to time. Continued use of the platform means you accept the updated policy.`,
    },

    policy: {
      title: "Policy Agreement",
      body: `Policy Agreement
Please read the policy below. Click “I Agree” to continue.

JDK HOMECARE Worker Policy Agreement

This Worker Policy works together with the Client Policy to keep jobs safe, properly supported, and recorded. By using JDK HOMECARE as a worker, you agree to the rules below when interacting with clients on the platform.

1. Acceptable Use (Worker)

• Provide accurate information in your account and applications.
• Use the platform only for legitimate home service and maintenance work.
• Act professionally: communicate respectfully, follow agreed scope, and do not abuse, harass, scam, or attempt to harm clients or other users.

2. Off-Platform Transactions Are Not Allowed (Worker)

• You must not request, offer, or accept payment or any transaction outside JDK HOMECARE for services found, arranged, or coordinated through the platform, including asking for cash, bank transfer, or e-wallet payments to bypass JDK HOMECARE.
• You must not encourage clients to cancel or move a booking off-platform, and you must not share or request contact details (phone, social media, external chat apps) for the purpose of taking jobs outside JDK HOMECARE.
• Keep bookings, agreements, and payments inside JDK HOMECARE so support can assist with records, disputes, and safety issues. If a client asks to pay outside the platform, do not proceed and report it through JDK HOMECARE.

3. Account Responsibilities

• You are responsible for maintaining the confidentiality of your account.
• You agree not to share your login credentials with others.
• You agree to notify us if you suspect unauthorized access to your account.

4. Platform Integrity

• No attempts to bypass security, disrupt services, or misuse platform features.
• No uploading of harmful or illegal content.
• We may suspend or terminate accounts that violate policies or threaten platform safety.

5. No Refund Agreement

• By using JDK HOMECARE, you acknowledge that fees paid through the platform are generally non-refundable once a service booking is confirmed or processed.
• Disputes, failed service attempts, or cancellations may be reviewed by JDK HOMECARE support, but any refund or credit is not guaranteed and may be provided only when required by applicable law or when JDK HOMECARE determines it is appropriate.
• You agree to provide accurate details and cooperate with verification requests (e.g., messages, timestamps, photos) during dispute review.

6. Payment Responsibility for Multi-Worker Requests

• You acknowledge that some client service requests may require multiple workers.
• You agree that you are responsible for handling and ensuring proper payment collection/settlement from the client based on the service request details when the request requires multiple workers.
• You must follow the platform’s rules and records for pricing and payment, and you must not request or accept off-platform payment arrangements.`,
    },

    nda: {
      title: "Non-Disclosure Agreement (NDA)",
      body: `Non-Disclosure Agreement
Please read the agreement below. Click “I Agree” to continue.

JDK HOMECARE Non-Disclosure Agreement (NDA)

This Worker NDA supports the same confidentiality goals as the Client NDA, but focuses on the information workers may access while delivering services and communicating with clients through the platform.

1. What You Must Keep Confidential

• Client and household details learned through a job (address, access instructions, schedules, contact info, photos, messages, and any personal circumstances shared for the service).
• Job details that are not publicly shared (service request details, pricing/quotes, work notes, and platform chat messages).
• JDK HOMECARE platform information (internal processes, moderation decisions, non-public features, and operational details).

2. How You May Use Confidential Information

• Use it only to complete the service, coordinate with the client, and comply with platform requirements.
• Do not post, sell, share, or publish any client/job information (including screenshots) outside the platform.
• If you need to share information for legitimate reasons (e.g., emergency, legal requirement), share only the minimum necessary.

3. Special Rules for Photos, Videos, and Screenshots

• No sharing service photos or videos outside JDK HOMECARE without the client’s permission.
• No sharing screenshots of messages, profiles, or job details to third parties.
• If proof is required for disputes, submit it only through the platform’s reporting/support process.

4. Exceptions

• Information that is publicly available through no fault of your own.
• Information required to be disclosed by law or valid legal process.
• Information disclosed to prevent immediate harm or respond to emergencies.

5. Duration

Your confidentiality obligations continue during and after your use of the platform, to the extent allowed by applicable law.`,
    },
  };
