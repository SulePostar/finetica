import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBankTransactions, getBankTransactionById } from "../api/BankTransactions";

export const bankTransactionKeys = {
  all: ["bank-transactions"],

  lists: () => [...bankTransactionKeys.all, "list"],
  list: (filters) => [...bankTransactionKeys.lists(), { filters }],

  details: () => [...bankTransactionKeys.all, "detail"],
  detail: (id) => [...bankTransactionKeys.details(), id],
};

// GET - list of bank transactions
export const useBankTransactions = (filters = {}) => {
  return useQuery({
    queryKey: bankTransactionKeys.list(filters),
    queryFn: () => getBankTransactions(filters),
    // Optional: enabled if you need to wait for some condition
    // enabled: !!someCondition,
  });
};