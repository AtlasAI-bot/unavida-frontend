import React from 'react';
import { useNavigate } from 'react-router-dom';

export const WorkbookPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#0f1113', color: '#f5f7fa', padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>Workbook</h1>
      <p>Design scaffold: Notes, Quick Jump, and Bookmarks hub will be expanded in Phase 3.</p>
      <button onClick={() => navigate('/textbook/NUR1100')} style={{ padding: '8px 12px', borderRadius: 8 }}>Back to Textbook</button>
    </div>
  );
};

export default WorkbookPage;
