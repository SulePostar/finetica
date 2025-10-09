'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: config.logging,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  });
} else {
  // Fallback to old configuration if DATABASE_URL is not set
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Static requires for model files to avoid webpack dynamic require/context which
// can produce runtime async chunk loading. Keep this list in sync when you add/remove models.
try {
  const BankTransaction = require('./BankTransaction.js')(sequelize, Sequelize.DataTypes);
  const BankTransactionItem = require('./BankTransactionItem.js')(sequelize, Sequelize.DataTypes);
  const BankTransactionProcessingLog = require('./BankTransactionProcessingLog.js')(sequelize, Sequelize.DataTypes);
  const BusinessPartner = require('./BusinessPartner.js')(sequelize, Sequelize.DataTypes);
  const BusinessUnit = require('./BusinessUnit.js')(sequelize, Sequelize.DataTypes);
  const Contract = require('./Contract.js')(sequelize, Sequelize.DataTypes);
  const ContractProcessingLog = require('./ContractProcessingLog.js')(sequelize, Sequelize.DataTypes);
  const EmailQueue = require('./EmailQueue.js')(sequelize, Sequelize.DataTypes);
  const EmailTemplate = require('./EmailTemplate.js')(sequelize, Sequelize.DataTypes);
  const KifProcessedFile = require('./KifProcessedFile.js')(sequelize, Sequelize.DataTypes);
  const KufProcessedFile = require('./KufProcessedFile.js')(sequelize, Sequelize.DataTypes);
  const KufProcessingLog = require('./KufProcessingLog.js')(sequelize, Sequelize.DataTypes);
  const PurchaseInvoice = require('./PurchaseInvoice.js')(sequelize, Sequelize.DataTypes);
  const PurchaseInvoiceItem = require('./PurchaseInvoiceItem.js')(sequelize, Sequelize.DataTypes);
  const RefreshToken = require('./RefreshToken.js')(sequelize, Sequelize.DataTypes);
  const SalesInvoice = require('./SalesInvoice.js')(sequelize, Sequelize.DataTypes);
  const SalesInvoiceItem = require('./SalesInvoiceItem.js')(sequelize, Sequelize.DataTypes);
  const TaxDeclaration = require('./TaxDeclaration.js')(sequelize, Sequelize.DataTypes);
  const TransactionCategory = require('./TransactionCategory.js')(sequelize, Sequelize.DataTypes);
  const UploadedFile = require('./UploadedFile.js')(sequelize, Sequelize.DataTypes);
  const User = require('./User.js')(sequelize, Sequelize.DataTypes);
  const UserRole = require('./UserRole.js')(sequelize, Sequelize.DataTypes);
  const UserStatus = require('./UserStatus.js')(sequelize, Sequelize.DataTypes);

  // register in db map
  [
    BankTransaction,
    BankTransactionItem,
    BankTransactionProcessingLog,
    BusinessPartner,
    BusinessUnit,
    Contract,
    ContractProcessingLog,
    EmailQueue,
    EmailTemplate,
    KifProcessedFile,
    KufProcessedFile,
    KufProcessingLog,
    PurchaseInvoice,
    PurchaseInvoiceItem,
    RefreshToken,
    SalesInvoice,
    SalesInvoiceItem,
    TaxDeclaration,
    TransactionCategory,
    UploadedFile,
    User,
    UserRole,
    UserStatus
  ].forEach(m => {
    if (m && m.name) db[m.name] = m;
  });
} catch (err) {
  // If a model file is missing or errors during load, throw a helpful message
  throw new Error('Failed to load models statically: ' + err.message);
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
