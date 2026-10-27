import { Mail, Smartphone } from 'lucide-react';
import { DocPage } from '../shell/DocPage';
import { ContactDetails, EmailLink } from '../shell/ContactDetails';
import { BUSINESS, CONTACT } from '@/lib/business';

const MAIL_BODY = [
  'Please delete my account and the personal data linked to it.',
  '',
  'App name: ',
  'Account email or phone number: ',
  'Username (if any): ',
  '',
  'I understand this cannot be undone.',
].join('\n');

/**
 * Google Play's account-deletion requirement and Facebook Login's data-deletion URL both point here.
 * It must describe the steps, what is deleted, what is kept and how long it takes.
 */
export function DeleteAccountPage() {
  const name = BUSINESS.name;
  const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Delete my account')}&body=${encodeURIComponent(MAIL_BODY)}`;
  return (
    <DocPage
      eyebrow="Your data"
      title="Delete your account and data"
      intro={
        <>
          If you have an account in any app published by {name}, you can delete it and the personal data linked to it at
          any time, whether or not you still have the app installed. This page explains how, what is removed and how long
          it takes.
        </>
      }
      sections={[
        {
          id: 'in-app',
          title: 'Delete from inside the app',
          children: (
            <>
              <p>Where an app offers accounts, it includes a delete option:</p>
              <ol>
                <li>Open the app and sign in.</li>
                <li>
                  Go to <strong>Settings</strong> (or your profile) and choose <strong>Account</strong>.
                </li>
                <li>
                  Tap <strong>Delete account</strong> and confirm.
                </li>
              </ol>
              <p>
                You are signed out immediately and the account can no longer be used. Deletion of the underlying data is
                completed within 30 days.
              </p>
            </>
          ),
        },
        {
          id: 'by-email',
          title: 'Request deletion by email',
          children: (
            <>
              <p>
                If you no longer have the app, cannot sign in, or the app has no delete option, send a request from the
                email address registered with your account:
              </p>
              <div className="not-doc mt-5 grid gap-4 sm:grid-cols-2">
                <a href={mailto} className="flex items-start gap-4 rounded-2xl bg-card p-5 shadow-tile transition-shadow hover:shadow-tile-hover">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white">
                    <Mail className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-fg">Email a deletion request</span>
                    <span className="mt-1 block text-xs text-muted">
                      Opens a pre-filled email to {CONTACT.email} with the subject &ldquo;Delete my account&rdquo;.
                    </span>
                  </span>
                </a>
                <div className="flex items-start gap-4 rounded-2xl bg-card p-5 shadow-tile">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-800 text-white">
                    <Smartphone className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-fg">Include in your email</span>
                    <span className="mt-1 block text-xs text-muted">
                      The app name, and the email address, phone number or username your account uses.
                    </span>
                  </span>
                </div>
              </div>
              <p>
                We confirm receipt and verify that the request comes from the account holder within 3 business days, then
                complete the deletion within 30 days and email you when it is done. We cannot delete an account on behalf
                of someone else without their verified request.
              </p>
            </>
          ),
        },
        {
          id: 'what-is-deleted',
          title: 'What is deleted',
          children: (
            <>
              <ul>
                <li>your profile: name, email address, phone number, photo and login credentials;</li>
                <li>sign-in links to Google, Apple or other identity providers;</li>
                <li>content you created in the app, such as entries, saved items, preferences and uploads;</li>
                <li>push-notification tokens and device records;</li>
                <li>analytics and crash data that can be linked to your account.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'what-is-kept',
          title: 'What may be kept, and for how long',
          children: (
            <>
              <ul>
                <li>
                  <strong>Purchase and invoice records</strong> required by tax and accounting law, for the statutory
                  period, without any link to your profile beyond what the law requires.
                </li>
                <li>
                  <strong>Records needed to prevent fraud or abuse</strong> or to establish, exercise or defend legal
                  claims, for as long as that purpose exists.
                </li>
                <li>
                  <strong>Anonymised, aggregated statistics</strong> that cannot identify you.
                </li>
                <li>
                  <strong>Backups:</strong> deleted data may remain in encrypted backups for up to 90 days until they are
                  overwritten; it is not restored to live systems.
                </li>
              </ul>
              <p>
                Purchases made through Google Play or the App Store are also recorded by Google or Apple under their own
                policies; deleting your account with us does not delete your store account.
              </p>
            </>
          ),
        },
        {
          id: 'partial',
          title: 'Delete only some data, or export it first',
          children: (
            <>
              <p>
                You do not have to delete the whole account. Email us if you only want certain data removed (for example
                your uploads or your phone number), or if you would like a copy of your data before it is deleted. See our{' '}
                <a href="/privacy/">Privacy Policy</a> for all the rights you have.
              </p>
            </>
          ),
        },
        {
          id: 'client-apps',
          title: 'Apps we built for other companies',
          children: (
            <>
              <p>
                {name} builds apps for clients that are published under the client&rsquo;s own name. For those apps,
                account deletion is handled by that company under its own privacy policy. If you are not sure who
                publishes the app, email us the app name and we will point you to the right place.
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
                Questions about deletion can be sent to <EmailLink subject="Delete my account" />.
              </p>
              <ContactDetails className="mt-6" />
            </>
          ),
        },
      ]}
    />
  );
}
