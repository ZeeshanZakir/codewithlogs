export const dynamic = "force-dynamic";

const settings = [
  {
    title: "Authentication",
    description:
      "Admin access is controlled with NextAuth credentials using ADMIN_EMAIL and ADMIN_PASSWORD_HASH from .env.local.",
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
          className="rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <h2 className="text-lg font-semibold text-white">{setting.title}</h2>
          <p className="mt-3 text-sm leading-7 text-white/60">{setting.description}</p>
        </section>
      ))}
    </div>
  );
}
