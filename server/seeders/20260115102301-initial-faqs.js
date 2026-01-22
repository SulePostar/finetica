'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('faq_items', [

      {
        category_key: 'getting-started',
        question: 'How do I log in to the system?',
        answer: 'Navigate to the login page and enter your credentials (email and password). If you don\'t have an account yet, contact your administrator to create one for you.',
        display_order: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_key: 'getting-started',
        question: 'How do I reset my password?',
        answer: 'Click on "Forgot Password" on the login page. Enter your email address and follow the instructions sent to your email to reset your password.',
        display_order: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_key: 'getting-started',
        question: 'What is the Dashboard?',
        answer: 'The Dashboard is your main overview page where you can see key metrics and quick access to important features. It provides a snapshot of your system\'s current state.',
        display_order: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },

      {
        category_key: 'managing-documents',
        question: 'How do I upload documents?',
        answer: 'Navigate to the specific document type page (KIF, KUF, Contracts, or Bank Transactions). Look for the upload button, click it, and select your PDF files. The system will automatically process them.',
        display_order: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_key: 'managing-documents',
        question: 'What document formats are supported?',
        answer: 'Currently, the system supports PDF files. Make sure your documents are in PDF format before uploading.',
        display_order: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_key: 'managing-documents',
        question: 'How do I view document details?',
        answer: 'Click on any document in the table to view its detailed information. You can see all extracted data, processing status, and related information.',
        display_order: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_key: 'managing-documents',
        question: 'What are Invalid PDFs?',
        answer: 'Invalid PDFs are documents that failed processing or validation. Check the Invalid PDFs page to see which documents need attention and why they failed.',
        display_order: 4,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },

      {
        category_key: 'bank-transactions',
        question: 'How do I upload bank statements?',
        answer: 'Go to the Bank Transactions page and click the upload button. Select your bank statement PDF files and the system will extract transaction data automatically.',
        display_order: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_key: 'bank-transactions',
        question: 'Can I edit bank transaction data?',
        answer: 'Yes, click on a transaction to view its details and use the edit function to modify information as needed.',
        display_order: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_key: 'bank-transactions',
        question: 'How do I filter transactions?',
        answer: 'Use the filter options at the top of the Bank Transactions page to filter by date, amount, status, or other criteria.',
        display_order: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },

      {
        category_key: 'partners',
        question: 'How do I add a new partner?',
        answer: 'Navigate to the Partners page and click "Add Partner". Fill in the required information including name, contact details, and any relevant business information.',
        display_order: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_key: 'partners',
        question: 'How do I view partner details?',
        answer: 'Click on any partner in the partners list to view their complete profile, including contact information, transaction history, and associated documents.',
        display_order: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_key: 'partners',
        question: 'Can I edit partner information?',
        answer: 'Yes, from the partner details page, click the edit button to modify partner information. Make sure to save your changes.',
        display_order: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },

      // --- User Management ---
      {
        category_key: 'user-management',
        question: 'How do I manage users?',
        answer: 'Navigate to the Users page where you can view all system users, add new users, edit user information, and manage user roles and statuses.',
        display_order: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_key: 'user-management',
        question: 'What are user roles?',
        answer: 'User roles define what actions a user can perform in the system. Different roles have different permissions. Visit the Roles & Statuses page to manage these.',
        display_order: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_key: 'user-management',
        question: 'How do I update my profile?',
        answer: 'Click on your profile avatar in the sidebar to access your profile page. You can update your personal information, change your password, and upload a profile picture.',
        display_order: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('faq_items', null, {});
  }
};
