import { DocPage } from '../shell/DocPage';
import { ContactDetails, EmailLink } from '../shell/ContactDetails';
import { BUSINESS } from '@/lib/business';
import { SITE_URL } from '@/lib/site';

/**
 * Privacy policy for the website and for the apps published under the Ask Developers developer accounts.
 * Google Play, the App Store, Google Ads, Facebook Login and payment providers all require this URL.
 */
export function PrivacyPage() {
  const name = BUSINESS.legalName;
  return (
    <DocPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro={
        <>
          This policy explains what personal data {name} collects, why we collect it, how it is used and shared, and the
          choices you have. It applies to our website, to the mobile applications we publish on Google Play and the App
          Store, and to the services we provide to clients.
        </>
      }
      sections={[
        {
          id: 'who-we-are',
          title: 'Who we are',
          children: (
            <>
              <p>
                {name} (&ldquo;{BUSINESS.name}&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a software development company
                based in {BUSINESS.address.country}. We design and build mobile apps, web platforms and AI products for
                clients worldwide, and we publish some apps of our own.
              </p>
              <p>
                For the personal data described in this policy we are the data controller (the &ldquo;data
                fiduciary&rdquo; under India&rsquo;s Digital Personal Data Protection Act, 2023). You can reach us at{' '}
                <EmailLink subject="Privacy" />.
              </p>
            </>
          ),
        },
        {
          id: 'scope',
          title: 'What this policy covers',
          children: (
            <>
              <p>This policy applies to:</p>
              <ul>
                <li>
                  our website at <a href={`${SITE_URL}/`}>{SITE_URL.replace(/^https?:\/\//, '')}</a>, including the contact
                  form;
                </li>
                <li>
                  mobile applications published under the {BUSINESS.name} developer account on Google Play and the Apple App
                  Store (&ldquo;our apps&rdquo;);
                </li>
                <li>emails, calls and messages exchanged with us.</li>
              </ul>
              <p>
                Apps that we build for clients are published under the client&rsquo;s own name and are governed by that
                client&rsquo;s privacy policy. Where we process personal data on a client&rsquo;s behalf we act as a
                processor under our contract with them, and the client remains responsible for how that data is used.
              </p>
            </>
          ),
        },
        {
          id: 'data-we-collect',
          title: 'Information we collect',
          children: (
            <>
              <h3>Information you give us</h3>
              <ul>
                <li>
                  <strong>Enquiries.</strong> When you use the contact form, email or call us: your name, email address,
                  company, phone number, the type of project, budget range and anything you write in your message.
                </li>
                <li>
                  <strong>App accounts.</strong> When an app offers accounts and you register: your name, email address,
                  phone number, profile photo and, if you sign in with Google or Apple, the identifier and basic profile
                  those services share with us.
                </li>
                <li>
                  <strong>Content you create in an app</strong>, such as entries, preferences, saved items and uploads.
                </li>
                <li>
                  <strong>Support requests</strong> and the correspondence that follows.
                </li>
              </ul>

              <h3>Information collected automatically</h3>
              <ul>
                <li>
                  <strong>Device and app data:</strong> device model, operating system and version, app version, language,
                  time zone, screen size and crash or diagnostic reports.
                </li>
                <li>
                  <strong>Usage data:</strong> which screens and features are used and when, so we can understand what
                  works and fix what does not.
                </li>
                <li>
                  <strong>Network data:</strong> your IP address and the approximate (city-level) location derived from it.
                </li>
                <li>
                  <strong>Identifiers:</strong> an app-instance identifier and, only where an app uses advertising or
                  attribution SDKs, the device advertising identifier that you can reset or disable in your device
                  settings.
                </li>
              </ul>

              <h3>Device permissions</h3>
              <p>
                Some apps ask for access to the camera, photo library, microphone, precise location, contacts, calendar,
                health data or notifications. Access is requested only when a feature needs it, your operating system
                always asks you first, and you can withdraw it at any time in your device settings. Exactly which data each
                app collects is listed in its Google Play Data safety section and its App Store privacy label.
              </p>

              <h3>Payment information</h3>
              <p>
                Purchases inside our apps are processed by Google Play Billing or Apple In-App Purchase. We receive a record
                of the transaction but never your full card details. Payments for development services are made by bank
                transfer or through a payment provider, which handles your payment data under its own policy.
              </p>
            </>
          ),
        },
        {
          id: 'how-we-use',
          title: 'How we use information',
          children: (
            <>
              <p>We use personal data to:</p>
              <ul>
                <li>respond to enquiries, prepare proposals and deliver the services you ask for;</li>
                <li>create and manage app accounts and provide the features of our apps;</li>
                <li>provide customer support and keep you informed about your requests;</li>
                <li>understand how our apps and website are used, fix bugs and improve them;</li>
                <li>keep our services secure and prevent fraud, abuse and unauthorised access;</li>
                <li>meet legal obligations such as tax, accounting and responding to lawful requests;</li>
                <li>
                  send service messages (for example about changes to an app or these policies). Marketing messages are
                  sent only with your consent, and every one includes a way to opt out.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: 'legal-bases',
          title: 'Legal bases for processing',
          children: (
            <>
              <p>
                Where the law of your country requires a legal basis (for example in the European Economic Area or the
                United Kingdom), we rely on:
              </p>
              <ul>
                <li>
                  <strong>your consent</strong>, for example for marketing or optional device permissions, which you can
                  withdraw at any time;
                </li>
                <li>
                  <strong>performance of a contract</strong>, to provide an app or service you have signed up for;
                </li>
                <li>
                  <strong>our legitimate interests</strong> in running, securing and improving our services, as long as
                  those interests are not overridden by your rights;
                </li>
                <li>
                  <strong>legal obligations</strong> we are subject to.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: 'sharing',
          title: 'How we share information',
          children: (
            <>
              <p>
                <strong>We do not sell personal data</strong> and we do not share it with third parties for their own
                marketing. We share it only in the following cases.
              </p>
              <h3>Service providers</h3>
              <p>
                Companies that process data on our behalf and only under our instructions. For the website these are
                currently GitHub Pages (hosting), Supabase (storage of contact form submissions), Resend (email delivery)
                and Google Fonts and Fontshare (web fonts, which receive your IP address when a font loads). Depending on
                the app, our apps may additionally use cloud infrastructure (such as Amazon Web Services, Google Cloud or
                Microsoft Azure), analytics and crash reporting (such as Firebase Analytics and Firebase Crashlytics), push
                notification services (Firebase Cloud Messaging and Apple Push Notification service), and payment
                processors (Google Play, Apple and, for direct payments, our payment provider).
              </p>
              <h3>Legal reasons</h3>
              <p>
                When required by law, regulation or a valid legal request, or when necessary to protect the rights, safety
                or property of our users, the public or {BUSINESS.name}.
              </p>
              <h3>Business transfers</h3>
              <p>
                If {BUSINESS.name} is involved in a merger, acquisition or sale of assets, personal data may be transferred
                as part of that transaction; this policy will continue to apply.
              </p>
              <h3>With your consent</h3>
              <p>In any other case, only after telling you and obtaining your consent.</p>
            </>
          ),
        },
        {
          id: 'cookies',
          title: 'Cookies and similar technologies',
          children: (
            <>
              <p>
                Our website does not use advertising or cross-site tracking cookies. It may use local storage to remember
                settings on your device. Our hosting provider keeps standard server logs (IP address, requested page,
                browser type) for security and operations.
              </p>
              <p>
                If we add analytics or advertising measurement in future (for example Google Analytics or Google Ads
                conversion tracking), we will update this policy and ask for your consent where the law requires it. You
                can control cookies in your browser settings, and advertising identifiers in your device settings.
              </p>
            </>
          ),
        },
        {
          id: 'retention',
          title: 'How long we keep information',
          children: (
            <>
              <ul>
                <li>
                  <strong>Enquiries:</strong> up to 24 months after our last contact, or for the duration of the project
                  and the statutory record-keeping period if you become a client.
                </li>
                <li>
                  <strong>App accounts:</strong> while your account is active. When you delete your account or ask us to,
                  the data linked to it is deleted within 30 days (see{' '}
                  <a href="/delete-account/">Delete your account</a>), except for records we must keep by law.
                </li>
                <li>
                  <strong>Diagnostics and analytics:</strong> typically aggregated or deleted within 14 months.
                </li>
                <li>
                  <strong>Transaction and invoice records:</strong> for as long as tax and accounting law requires.
                </li>
                <li>
                  <strong>Backups:</strong> deleted data may persist in backups for up to 90 days before it is overwritten.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: 'security',
          title: 'How we protect information',
          children: (
            <>
              <p>
                Data is encrypted in transit (TLS) and stored with providers that encrypt it at rest. Access is limited to
                people who need it to do their job, protected by authentication and reviewed regularly. No method of
                transmission or storage is completely secure, so we cannot guarantee absolute security, but if a breach
                affects your data we will notify you and the relevant authorities as the law requires.
              </p>
            </>
          ),
        },
        {
          id: 'transfers',
          title: 'International transfers',
          children: (
            <>
              <p>
                We are based in {BUSINESS.address.country}, and the providers listed above may store or process data in
                other countries, including the United States and the European Union. Where the law requires it, transfers
                are protected by appropriate safeguards such as standard contractual clauses.
              </p>
            </>
          ),
        },
        {
          id: 'your-rights',
          title: 'Your rights and choices',
          children: (
            <>
              <p>Depending on where you live, you may have the right to:</p>
              <ul>
                <li>access the personal data we hold about you and receive a copy;</li>
                <li>correct data that is inaccurate or incomplete;</li>
                <li>delete your data (see also <a href="/delete-account/">Delete your account</a>);</li>
                <li>receive your data in a portable format;</li>
                <li>object to, or ask us to restrict, certain processing;</li>
                <li>withdraw consent at any time, without affecting processing that happened before;</li>
                <li>
                  complain to your data protection authority, including the Data Protection Board of India or your local
                  supervisory authority in the EEA or UK.
                </li>
              </ul>
              <p>
                To exercise any of these rights, email <EmailLink subject="Privacy request" />. We may ask you to verify
                your identity, and we respond within 30 days. You can also manage permissions, notifications and
                advertising identifiers in your device settings at any time.
              </p>
            </>
          ),
        },
        {
          id: 'children',
          title: "Children's privacy",
          children: (
            <>
              <p>
                Our website and apps are not directed to children under 13, or under the higher age at which your
                country requires parental consent (18 in India). We do not knowingly collect personal data from children.
                If you believe a child has provided us with personal data, contact us and we will delete it.
              </p>
            </>
          ),
        },
        {
          id: 'third-parties',
          title: 'Third-party links and sign-in',
          children: (
            <>
              <p>
                Our website and apps link to third-party sites and services such as Google Play, the App Store and
                Facebook, and some apps let you sign in with Google or Apple. Those services have their own privacy
                policies, which we encourage you to read; this policy does not cover them.
              </p>
            </>
          ),
        },
        {
          id: 'changes',
          title: 'Changes to this policy',
          children: (
            <>
              <p>
                We may update this policy from time to time. The current version is always available at{' '}
                <a href={`${SITE_URL}/privacy/`}>{SITE_URL.replace(/^https?:\/\//, '')}/privacy/</a> with the date it was
                last updated. If a change materially affects how we use your data, we will tell you in the app or by
                email before it takes effect.
              </p>
            </>
          ),
        },
        {
          id: 'contact',
          title: 'Contact us',
          children: (
            <>
              <p>
                Questions, requests and complaints about privacy can be sent to our Grievance Officer at{' '}
                <EmailLink subject="Privacy" /> (please use &ldquo;Privacy&rdquo; in the subject line), or by post at the
                address below.
              </p>
              <ContactDetails className="mt-6" />
            </>
          ),
        },
      ]}
    />
  );
}
