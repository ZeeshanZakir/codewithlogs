import { ContactMessagesTable } from "@/components/admin/ContactMessagesTable";
import { getContactMessages } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function ContactMessagesPage() {
  const messages = await getContactMessages();

  return <ContactMessagesTable messages={messages} />;
}
