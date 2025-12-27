import { useQuery } from "@tanstack/react-query";
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

// GET - single bank transaction by ID
export const useBankTransactionById = (id) => {
  return useQuery({
    queryKey: bankTransactionKeys.detail(id),
    queryFn: () => getBankTransactionById(id),
    enabled: !!id,
  });
};

/* -------------------- */
/*     Invalid PDFs     */
/* -------------------- */
export const useBankTransactionInvalidPdfs = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: [...bankTransactionKeys.all, "invalid-pdfs", { page, limit }],
    queryFn: () => getBankStatementsInvalidPdfs(page, limit),
  });
}

export const useBankTransactionInvalidPdfById = (id) => {
  return useQuery({
    queryKey: [...bankTransactionKeys.all, "invalid-pdfs", "detail", id],
    queryFn: () => getBankStatementInvalidPdfById(id),
    enabled: !!id,
  });
}