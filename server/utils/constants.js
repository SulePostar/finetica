const USER_STATUS = Object.freeze({
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
});
const USER_ROLE = Object.freeze({
  ADMIN: 1,
  USER: 2
})

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
const TEMPLATE_IDS = {
  RESET_PASSWORD: "d-307e6ec4050943c3b9b36617644f6c88",
  WELCOME_EMAIL: "d-1df294c171c3482a9a7b407adc8977e4",
  USER_APPROVAL: "d-251656a729f243ffb8a4651a55146e76"
};
module.exports = {
  USER_STATUS,
  USER_ROLE,
  SOURCES,
  TEMPLATE_IDS
};