import { DocPage } from '../shell/DocPage';
import { ContactDetails, EmailLink } from '../shell/ContactDetails';
import { BUSINESS } from '@/lib/business';

/** Refund and cancellation terms for development services and for app purchases. Payment providers ask for this page. */
export function RefundPage() {
  const name = BUSINESS.name;
  return (
    <DocPage
      eyebrow="Legal"
      title={
        <>
          Refund &amp; Cancellation
          <br />
          Policy
        </>
      }
      intro={
        <>
          This policy explains when {name} refunds a payment, how to cancel a project, a retainer or a subscription, and
          how long a refund takes. It forms part of our <a href="/terms/">Terms &amp; Conditions</a>.
        </>
      }
      sections={[
        {
          id: 'services',
          title: 'Development services',
          children: (
            <>
              <h3>Advance payment</h3>
              <p>
                A project starts once the advance stated in the proposal has been received. The advance is refunded in full
                if you cancel before we start work. Once discovery, design or development has begun, the advance covers the
                time and resources already committed and is non-refundable.
              </p>
              <h3>Milestones</h3>
              <p>
                Milestones are invoiced when they are delivered and approved. Delivered milestones are non-refundable. If
                you cancel while a milestone is in progress, we invoice the work completed on a pro-rata basis and refund
                any prepaid amount that exceeds it.
              </p>
              <h3>Cancelling a project</h3>
              <p>
                Either party may end a project with 15 days&rsquo; written notice. We hand over all completed and paid-for
                work, including source code and design files, within 7 days of the final payment.
              </p>
              <h3>Retainers and maintenance plans</h3>
              <p>
                Monthly retainers and maintenance plans can be cancelled with 30 days&rsquo; written notice. The current
                month is not refunded; no further months are charged.
              </p>
              <h3>Third-party costs</h3>
              <p>
                Domains, hosting, licences, store developer fees, advertising spend and other third-party costs that we
                have already paid on your behalf are non-refundable.
              </p>
              <h3>If you are not satisfied</h3>
              <p>
                Tell us within 7 days of a delivery. Defects in work that is within the agreed scope are fixed at no cost
                under the warranty in our Terms. We would always rather put something right than lose a client.
              </p>
            </>
          ),
        },
        {
          id: 'apps',
          title: 'App purchases and subscriptions',
          children: (
            <>
              <h3>Purchases through Google Play or the App Store</h3>
              <p>
                In-app purchases and subscriptions are sold by Google or Apple, and their refund rules apply. Request a
                refund from Google Play under &ldquo;Order history&rdquo; or from Apple at reportaproblem.apple.com. We
                cannot issue refunds for store purchases ourselves, but if you have trouble, email us and we will help you
                through the process.
              </p>
              <h3>Cancelling a subscription</h3>
              <p>
                Cancel at any time in your Google Play or Apple ID subscription settings. You keep access until the end of
                the period you have paid for, and you are not charged again. Partial periods are not refunded unless the
                law where you live requires it.
              </p>
              <h3>Purchases made directly from us</h3>
              <p>
                If you paid us directly (for example on our website) for something we failed to deliver, or that was
                defective and could not be fixed, you can request a full refund within 7 days of the purchase.
              </p>
            </>
          ),
        },
        {
          id: 'how-refunds-are-paid',
          title: 'How refunds are paid',
          children: (
            <>
              <p>
                Approved refunds are returned to the original payment method within 7 business days of approval. Depending
                on your bank or card issuer, it can take a further 5 to 10 business days to appear on your statement.
                Bank charges and currency differences on international payments are not refunded.
              </p>
            </>
          ),
        },
        {
          id: 'how-to-request',
          title: 'How to request a refund',
          children: (
            <>
              <p>
                Email <EmailLink subject="Refund request" /> with &ldquo;Refund request&rdquo; in the subject line and
                include:
              </p>
              <ul>
                <li>your name and the email address or phone number used for the purchase or project;</li>
                <li>the invoice number, order number or app and transaction date;</li>
                <li>the reason for the request.</li>
              </ul>
              <p>We acknowledge every request within 2 business days and give you a decision within 7 business days.</p>
            </>
          ),
        },
        {
          id: 'contact',
          title: 'Contact',
          children: <ContactDetails className="mt-2" />,
        },
      ]}
    />
  );
}
