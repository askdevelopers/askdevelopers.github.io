import { DocPage } from '../shell/DocPage';
import { ContactDetails, EmailLink } from '../shell/ContactDetails';
import { BUSINESS, jurisdictionLabel } from '@/lib/business';
import { SITE_URL } from '@/lib/site';

/** Terms for the website, for the apps we publish, and for development work we do for clients. */
export function TermsPage() {
  const name = BUSINESS.name;
  return (
    <DocPage
      eyebrow="Legal"
      title="Terms & Conditions"
      intro={
        <>
          These terms govern your use of the {name} website and the mobile applications we publish, and set out the
          general conditions under which we provide software development services. Please read them carefully.
        </>
      }
      sections={[
        {
          id: 'agreement',
          title: 'Agreement to these terms',
          children: (
            <>
              <p>
                By visiting <a href={`${SITE_URL}/`}>{SITE_URL.replace(/^https?:\/\//, '')}</a>, installing or using one of
                our apps, or engaging us for services, you agree to these terms and to our{' '}
                <a href="/privacy/">Privacy Policy</a>. If you are acting on behalf of a company, you confirm that you have
                authority to bind it. If you do not agree, please do not use the website, the apps or the services.
              </p>
              <p>
                &ldquo;{name}&rdquo;, &ldquo;we&rdquo; and &ldquo;us&rdquo; mean {BUSINESS.legalName}. &ldquo;You&rdquo;
                means the person or organisation using our website, apps or services.
              </p>
            </>
          ),
        },
        {
          id: 'website',
          title: 'Using the website',
          children: (
            <>
              <p>
                The website is provided for general information about our company and services. We try to keep its content
                accurate and current, but it is not a binding offer; the scope, price and timeline of any work are agreed in
                a written proposal.
              </p>
              <p>You agree not to:</p>
              <ul>
                <li>use the website or contact form to send unlawful, abusive or unsolicited commercial content;</li>
                <li>attempt to gain unauthorised access to the site, its hosting or any connected system;</li>
                <li>scrape, copy or republish substantial parts of the site without our permission;</li>
                <li>interfere with the site&rsquo;s operation or impose an unreasonable load on it.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'apps',
          title: 'Using our apps',
          children: (
            <>
              <h3>Licence</h3>
              <p>
                We grant you a limited, personal, non-exclusive, non-transferable and revocable licence to install and use
                our apps on devices you own or control, for your own use and in accordance with these terms and the
                Google Play Terms of Service or Apple Media Services Terms and Conditions that apply to the store you
                downloaded the app from. Where Apple&rsquo;s Licensed Application End User Licence Agreement applies, these
                terms supplement it. You may not copy, modify, reverse engineer, resell or distribute the apps except
                where the law expressly allows it.
              </p>
              <h3>Accounts</h3>
              <p>
                Some apps require an account. You must give accurate information, keep your credentials confidential and
                tell us promptly if you suspect unauthorised use. You are responsible for activity under your account. You
                must be at least 13 years old, or the age at which your country allows you to agree to these terms without
                a parent (18 in India), to create an account. You can delete your account at any time; see{' '}
                <a href="/delete-account/">Delete your account</a>.
              </p>
              <h3>Acceptable use</h3>
              <p>
                You agree not to use an app to break the law, infringe anyone&rsquo;s rights, upload harmful or offensive
                content, send spam, interfere with other users, or probe, disrupt or overload our systems.
              </p>
              <h3>Purchases and subscriptions</h3>
              <p>
                In-app purchases and subscriptions are sold and billed by Google Play or the App Store at the price shown in
                the store. Subscriptions renew automatically unless you cancel in your store account settings at least 24
                hours before the end of the current period. Refunds are handled as described in our{' '}
                <a href="/refund-policy/">Refund &amp; Cancellation Policy</a>.
              </p>
              <h3>Changes and availability</h3>
              <p>
                We may update, change or discontinue an app or any of its features. We will try to give reasonable notice of
                changes that materially affect you. Apps depend on third-party services and networks that we do not control,
                so we cannot promise that they will always be available or error-free.
              </p>
              <h3>Suspension and termination</h3>
              <p>
                We may suspend or terminate your access to an app if you breach these terms, if we are required to by law,
                or if we discontinue the app. You may stop using an app at any time by deleting your account and uninstalling
                it.
              </p>
            </>
          ),
        },
        {
          id: 'services',
          title: 'Development services',
          children: (
            <>
              <p>
                When we build software for you, the written proposal, statement of work or contract we agree (the
                &ldquo;Proposal&rdquo;) governs that engagement. If the Proposal and these terms conflict, the Proposal
                prevails. Unless the Proposal says otherwise, the following applies.
              </p>
              <h3>Scope and changes</h3>
              <p>
                We deliver what is described in the Proposal. Requests outside that scope are handled as written change
                requests with their own estimate and may affect the timeline.
              </p>
              <h3>Your responsibilities</h3>
              <p>
                You will provide the content, credentials, access, approvals and feedback we need in a timely manner, and
                you confirm that material you give us does not infringe anyone&rsquo;s rights. Timelines are estimates and
                depend on receiving these inputs on time.
              </p>
              <h3>Fees and payment</h3>
              <p>
                Fees are set out in the Proposal. Work starts after the agreed advance is received, and milestone invoices
                are payable within 7 days of issue unless the Proposal states otherwise. Fees exclude applicable taxes
                (including GST), third-party costs such as hosting, domains, licences and store fees, and bank charges. We
                may pause work while an invoice is overdue.
              </p>
              <h3>Intellectual property</h3>
              <p>
                Once all fees for a deliverable have been paid, you own the custom code, designs and content we created for
                you under the Proposal. We keep ownership of our pre-existing tools, libraries, frameworks and know-how, and
                grant you a perpetual, non-exclusive licence to use them as part of the deliverables. Open-source and
                third-party components remain under their own licences. We may describe the project and show
                non-confidential screenshots in our portfolio unless you ask us in writing not to.
              </p>
              <h3>Confidentiality</h3>
              <p>
                Each party will keep the other&rsquo;s non-public business, technical and financial information
                confidential and use it only for the engagement, during the engagement and for three years after it ends.
              </p>
              <h3>Warranty and support</h3>
              <p>
                For 30 days after delivery of a milestone we will fix, at no cost, defects that cause the deliverable not to
                work as described in the Proposal. This does not cover changes made by anyone else, problems caused by
                third-party services, platform updates, or use outside the agreed scope. Ongoing maintenance is available
                under a separate agreement.
              </p>
              <h3>App store publishing</h3>
              <p>
                Apps are published under your own developer accounts unless we agree otherwise. Approval of an app is at
                the sole discretion of Google and Apple; we will prepare submissions and respond to review feedback, but we
                cannot guarantee approval or its timing.
              </p>
            </>
          ),
        },
        {
          id: 'ip',
          title: 'Intellectual property',
          children: (
            <>
              <p>
                The {name} name, logo, website design, text, images and the apps we publish are owned by us or our
                licensors and are protected by copyright and trademark law. Except for the licences expressly granted in
                these terms, nothing gives you any right to use them. Client names and logos shown on the website belong
                to their respective owners.
              </p>
            </>
          ),
        },
        {
          id: 'disclaimer',
          title: 'Disclaimers',
          children: (
            <>
              <p>
                To the fullest extent permitted by law, the website and our apps are provided &ldquo;as is&rdquo; and
                &ldquo;as available&rdquo;, without warranties of any kind, express or implied, including fitness for a
                particular purpose and non-infringement. We do not warrant that they will be uninterrupted, secure or free
                of errors. Nothing in these terms limits any consumer rights that cannot be excluded under the law of the
                country you live in.
              </p>
            </>
          ),
        },
        {
          id: 'liability',
          title: 'Limitation of liability',
          children: (
            <>
              <p>
                To the fullest extent permitted by law, {name} will not be liable for any indirect, incidental, special,
                consequential or punitive damages, or for loss of profits, revenue, data or goodwill, arising from your use
                of the website, the apps or the services. Our total liability for any claim relating to a paid service is
                limited to the fees you paid us for that service in the 12 months before the claim arose; for the website
                and free apps it is limited to the maximum extent the law allows. Nothing in these terms excludes liability
                for fraud, for death or personal injury caused by negligence, or for anything else that cannot be excluded
                by law.
              </p>
            </>
          ),
        },
        {
          id: 'indemnity',
          title: 'Indemnity',
          children: (
            <>
              <p>
                You agree to indemnify {name} against claims, losses and expenses (including reasonable legal fees) arising
                from your breach of these terms, your misuse of the website or an app, or content and materials you
                provide to us.
              </p>
            </>
          ),
        },
        {
          id: 'law',
          title: 'Governing law and disputes',
          children: (
            <>
              <p>
                These terms are governed by the laws of {BUSINESS.jurisdiction.country}. If a dispute arises, please contact
                us first; we will try to resolve it informally within 30 days. Any dispute that cannot be resolved that way
                is subject to the exclusive jurisdiction of the courts at {jurisdictionLabel()}, except that consumers may
                also rely on the mandatory protections and courts of the country in which they live.
              </p>
            </>
          ),
        },
        {
          id: 'changes',
          title: 'Changes to these terms',
          children: (
            <>
              <p>
                We may update these terms from time to time. The current version is always at{' '}
                <a href={`${SITE_URL}/terms/`}>{SITE_URL.replace(/^https?:\/\//, '')}/terms/</a> with the date it was last
                updated. Material changes to app terms will be announced in the app or by email, and continuing to use the
                app after they take effect means you accept them.
              </p>
            </>
          ),
        },
        {
          id: 'contact',
          title: 'Contact',
          children: (
            <>
              <p>
                Questions about these terms can be sent to <EmailLink subject="Terms" />.
              </p>
              <ContactDetails className="mt-6" />
            </>
          ),
        },
      ]}
    />
  );
}
