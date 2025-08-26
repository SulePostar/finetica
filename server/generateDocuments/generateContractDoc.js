const PDFDocument = require('pdfkit');
const fs = require('fs');

const contractData = {
  partnerName: 'ABC Company',
  contractNumber: '123/2025',
  contractType: 'Collaboration Agreement',
  description: 'Description of the contract and terms.',
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-12-31'),
  paymentTerms: '30 days',
  currency: 'EUR',
  amount: 50000,
  signedAt: new Date('2025-01-05'),
};

function formatDate(date) {
  if (!date) return 'N/A';
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
}

function generatePDF(data, outputPath) {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(outputPath));

  doc.fontSize(20).text('Contract', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12);
  doc.text(`Partner: ${data.partnerName || 'N/A'}`);
  doc.text(`Contract Number: ${data.contractNumber || 'N/A'}`);
  doc.text(`Contract Type: ${data.contractType || 'N/A'}`);
  doc.text(`Description: ${data.description || 'N/A'}`);
  doc.text(`Start Date: ${formatDate(data.startDate)}`);
  doc.text(`End Date: ${formatDate(data.endDate)}`);
  doc.text(`Payment Terms: ${data.paymentTerms || 'N/A'}`);
  doc.text(`Currency: ${data.currency || 'N/A'}`);
  doc.text(`Amount: ${data.amount != null ? data.amount : 'N/A'}`);
  doc.text(`Signed At: ${formatDate(data.signedAt)}`);

  doc.end();
  console.log(`PDF created: ${outputPath}`);
}

generatePDF(contractData, 'contract.pdf');
