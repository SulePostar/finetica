import { useBankTransactionById } from "@/queries/BankTransactionsQueries";
import { useKifById } from "@/queries/KifQueries";
import { useKufById } from "@/queries/Kuf";
import { useContractById } from "@/queries/useContracts";

const hookRegistry = {
    kuf: useKufById,
    kif: useKifById,
    'bank-transaction': useBankTransactionById,
    contracts: useContractById,
};

export const useDocumentFetcher = (documentType, id) => {
    const specificHook = hookRegistry[documentType];
    if (!specificHook) {
        throw new Error(`Document type "${documentType}" is not supported.`);
    }
    return specificHook(id);
};
