import React from 'react';
import { CCard, CCardHeader, CCardBody, CCardTitle } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilFile } from '@coreui/icons';

const KufDocumentInfo = ({ data }) => (
  <CCard className="h-100 shadow-sm detail-card">
    <CCardHeader>
      <CCardTitle className="mb-0">
        <CIcon icon={cilFile} className="me-2" />
        Document Information
      </CCardTitle>
    </CCardHeader>
    <CCardBody>
      <div className="kuf-info-list">
        <div className="info-row">
          <span className="info-label">Document:</span>
          <span className="info-value">{data.documentNumber}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Name:</span>
          <span className="info-value">{data.name}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Supplier:</span>
          <span className="info-value">{data.supplier}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Category:</span>
          <span className="info-value">{data.category}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Amount:</span>
          <span className="info-value">{data.amount}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Price:</span>
          <span className="info-value">{data.price} {data.currency}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Total:</span>
          <span className="info-value">{data.total} {data.currency}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Status:</span>
          <span className="info-value">{data.status}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Date:</span>
          <span className="info-value">{data.date}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Created:</span>
          <span className="info-value">{new Date(data.createdAt).toLocaleString()}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Updated:</span>
          <span className="info-value">{new Date(data.updatedAt).toLocaleString()}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Description:</span>
          <span className="info-value">{data.description}</span>
        </div>
      </div>
    </CCardBody>
  </CCard>
);

export default KufDocumentInfo;