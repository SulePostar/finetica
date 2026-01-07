import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "@/api/chat";

export const useChatMutation = () => {
    return useMutation({
        mutationFn: sendMessage,
    });
};