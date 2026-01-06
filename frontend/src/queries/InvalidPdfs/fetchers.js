import { getBankStatementsInvalidPdfs } from "@/api/BankTransactions";
import { getKifInvalidPdfs } from "@/api/Kif";
import { getKufInvalidPdfs } from "@/api/Kuf";
import { getContractsInvalidPdfs } from "@/api/contracts";

export const invalidPdfsFetchers = {
  bank: getBankStatementsInvalidPdfs,
  kif: getKifInvalidPdfs,
  kuf: getKufInvalidPdfs,
  contracts: getContractsInvalidPdfs,
};
