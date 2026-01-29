import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { notify } from "@/lib/notifications";

export function useRealtimeNotifications(enabled) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (payload) => {
      notify.info(payload.message, { description: payload.user?.email });
    };

    socket.on("notification:new-user", handler);

    return () => {
      socket.off("notification:new-user", handler);
    };
  }, [enabled]);
}
