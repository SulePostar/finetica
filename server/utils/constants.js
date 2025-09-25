const USER_STATUS = Object.freeze({
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
});

const SOURCES = {
  kif: {
    localFolder: './googleDriveDownloads/kif/',
    supabaseBucket: 'kif'
  },
  kuf: {
    localFolder: './googleDriveDownloads/kuf/',
    supabaseBucket: 'kuf'
  },
  transactions: {
    localFolder: './googleDriveDownloads/bank-transactions/',
    supabaseBucket: 'transactions'
  },
  contracts: {
    localFolder: './googleDriveDownloads/contracts/',
    supabaseBucket: 'contracts'
  }
};
module.exports = {
  USER_STATUS,
  SOURCES
};