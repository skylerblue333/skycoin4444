import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function CRM() {
  return (
    <FeatureUnavailable
      title="CRM Hub is not enabled yet"
      description="Contacts, customer identities, deal stages, pipeline values, revenue analytics, lead scores, communications, activities, and closed-won status require verified CRM storage, access controls, consent, audit logs, and business-system integrations. The current release does not fabricate customer records or claim that a deal, contact, activity, or revenue event exists."
      capability="Customer records, sales pipeline, revenue analytics, and activity history"
      nextStep="Review the operations and evidence boundaries"
    />
  );
}
