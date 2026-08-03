import { MessagesInbox } from "@/components/admin/MessagesInbox";

export default function AdminMessagesPage() {
  return (
    <>
      <h1 className="mb-2 font-display text-2xl font-bold">Messages</h1>
      <p className="mb-8 text-sm text-nasah-gray">
        Submissions from the /contact form.
      </p>
      <MessagesInbox />
    </>
  );
}
