export const dynamic = "force-dynamic";

const settings = [
  {
    title: "Authentication",
    description:
      "Admin access is controlled with NextAuth credentials backed by the MongoDB profile collection.",
  },
  {
    title: "Email Delivery",
    description:
      "Contact form notifications depend on RESEND_API_KEY and CONTACT_EMAIL.",
  },
  {
    title: "Advertising",
    description:
      "AdSense slots are driven by NEXT_PUBLIC_ADSENSE_PUBLISHER_ID and the slot environment variables used in the shared ad component.",
  },
];

export default function SiteSettingsPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      {settings.map((setting) => (
        <section
          key={setting.title}
          className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5"
        >
          <h2 className="text-lg font-semibold text-slate-900">{setting.title}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-500">{setting.description}</p>
        </section>
      ))}
    </div>
  );
}
