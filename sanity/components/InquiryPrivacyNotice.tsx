export default function InquiryPrivacyNotice() {
  return (
    <section style={{ padding: 32, maxWidth: 800, lineHeight: 1.8 }}>
      <h2>Private inquiry storage is not configured</h2>
      <p>
        Do not store names, email addresses, phone numbers, messages, or
        internal notes in the public website dataset.
      </p>
      <p>
        A schema, read-only field, hidden sidebar, or disabled action does not
        restrict Content Lake API access. Public datasets remain publicly
        readable.
      </p>
      <p>
        The inquiry model is registered for a future private CRM workspace.
        Creation, editing, and form persistence are disabled in this workspace.
        The existing email inquiry API is unchanged.
      </p>
      <p>
        Before enabling CRM storage, configure a separate private dataset or
        secured backend, server-only write credentials, authorized staff roles,
        retention rules, and a privacy notice. Product references must then use
        cross-dataset references or a validated public product ID/text snapshot.
      </p>
    </section>
  );
}
