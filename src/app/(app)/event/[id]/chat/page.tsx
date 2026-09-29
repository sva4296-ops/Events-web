import { LockedFeature } from "@/components/event/LockedFeature";
import { ui } from "@/components/ui/styles";
import { getMessages } from "@/lib/data/content";
import { getEventContext } from "@/lib/data/eventContext";

import { ChatRoom } from "./ChatRoom";

export default async function ChatPage({ params }: PageProps<"/event/[id]/chat">) {
  const { id } = await params;
  const [{ user, event, capabilities }, messages] = await Promise.all([getEventContext(id), getMessages(id)]);

  if (!capabilities.chatEnabled) {
    return <LockedFeature owner={event.isOwner} message="Chatul de grup nu este inclus în planul curent al acestui eveniment." />;
  }


  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
      <div>
        <h2 className={ui.eyebrow}>Grupul evenimentului</h2>
        <p className="text-sm text-muted">Invitații vorbesc între ei și cu organizatorul.</p>
      </div>
      <ChatRoom eventId={id} userId={user.id} ownerId={event.ownerId} initialMessages={messages} />
    </div>
  );
}
