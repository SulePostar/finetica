import { sendMessage } from '@/api/chat';
import { useMutation } from '@tanstack/react-query';

export const useChatMutation = () => {
  return useMutation({
    mutationFn: sendMessage,
  });
};
