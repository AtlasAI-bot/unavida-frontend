import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStudentProgress } from '../context/StudentProgressContext';

export const TextbookDashboard = () => {
  const navigate = useNavigate();
  const { textbookId } = useParams();
  const { getChapterProgress } = useStudentProgress();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const textbookData = {
    NUR1100: {
      id: 'NUR1100',
      title: 'Pharmacology I',
      courseCode: 'NUR1100',
      description: '13 chapter episodes, interactive reading mode, integrated videos, case studies, flashcards, and progress checkpoints designed for nursing students.',
      icon: '💊',
      episodes: [
        { id: 'ch1_0', number: '1.0', title: 'Overview & Introduction', duration: '25 min • Intro video + guided reading', status: 'Completed', progress: 100 },
        { id: 'ch1_1', number: '1.1', title: 'Definition & Scope of Pharmacology', duration: '20 min • Video + visuals + learning objectives', status: 'In Progress', progress: 60 },
        { id: 'ch1_2', number: '1.2', title: 'Historical Context of Pharmacology', duration: '20 min • timeline + expanded narrative', status: 'Ready', progress: 0 },
        { id: 'ch1_6', number: '1.6', title: 'Pharmacokinetics vs Pharmacodynamics', duration: '45 min • featured lesson video', status: 'In Progress', progress: 50 },
        { id: 'ch1_11', number: '1.11', title: 'Review Questions & Assessment', duration: '30 min • quiz + case studies', status: 'Ready', progress: 0 },
      ],
    },
  };

  const textbook = textbookData[textbookId] || textbookData.NUR1100;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return '#39d0c8';
      case 'In Progress':
        return '#fbbf24';
      case 'Ready':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className={isDarkMode ? 'bg-[#0a1022] text-white' : 'bg-[#edf2ff] text-[#1b2542]'} style={{ minHeight: '100vh' }}>
      {/* Top Bar */}
      <div style={{
        padding: '18px 24px',
        borderBottom: `1px solid ${isDarkMode ? 'rgba(255,255,255,.1)' : '#cfd9f7'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: isDarkMode ? '#0f1733' : '#dfe8ff',
      }}>
        <div>
          <div style={{ color: isDarkMode ? '#9fb0e8' : '#5f6f9e', fontSize: '13px' }}>Home / My Courses / Pharmacology I</div>
          <strong>UnaVida • Student View (Demo)</strong>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={toggleTheme}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,.2)' : '#cfd9f7'}`,
              background: isDarkMode ? '#ffffff10' : '#fff',
              color: isDarkMode ? '#fff' : '#1b2542',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button
            onClick={() => navigate('/bookshelf')}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,.2)' : '#cfd9f7'}`,
              background: isDarkMode ? '#ffffff10' : '#fff',
              color: isDarkMode ? '#fff' : '#1b2542',
              cursor: 'pointer',
              fontSize: '13px',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Back to Bookshelf
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section style={{
        padding: '28px 24px',
        background: isDarkMode ? 'linear-gradient(180deg,#15224b,#0a1022)' : 'linear-gradient(180deg,#dfe8ff,#edf2ff)',
      }}>
        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{textbook.title} ({textbook.courseCode})</h1>
        <p style={{ color: isDarkMode ? '#c4cfef' : '#455582', maxWidth: '900px', marginTop: '12px' }}>
          {textbook.description}
        </p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
          <button
            onClick={() => navigate(`/reader/${textbook.episodes[3].id}`)}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: '#39d0c8',
              color: '#032320',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            Continue: Chapter {textbook.episodes[3].number}
          </button>
          <button
            onClick={() => navigate(`/reader/${textbook.episodes[0].id}`)}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,.2)' : '#cfd9f7'}`,
              background: isDarkMode ? '#ffffff10' : '#fff',
              color: isDarkMode ? '#fff' : '#1b2542',
              cursor: 'pointer',
            }}
          >
            Open Chapter 1
          </button>
          <button
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,.2)' : '#cfd9f7'}`,
              background: isDarkMode ? '#ffffff10' : '#fff',
              color: isDarkMode ? '#fff' : '#1b2542',
              cursor: 'pointer',
            }}
          >
            Open Study Hub
          </button>
        </div>
      </section>

      {/* Main Content Grid */}
      <div style={{
        padding: '20px 24px',
        display: 'grid',
        gridTemplateColumns: '1.2fr .8fr',
        gap: '16px',
      }}>
        {/* Left Panel - Chapter Episodes */}
        <section style={{
          background: isDarkMode ? '#111a38' : '#fff',
          border: `1px solid ${isDarkMode ? 'rgba(255,255,255,.08)' : '#d9e3ff'}`,
          borderRadius: '12px',
          padding: '14px',
        }}>
          <h2 style={{ margin: '0 0 10px', fontSize: '18px' }}>Chapter Episodes</h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            {textbook.episodes.map((episode) => (
              <div
                key={episode.id}
                onClick={() => navigate(`/reader/${episode.id}`)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '70px 1fr auto',
                  gap: '10px',
                  alignItems: 'center',
                  padding: '10px',
                  borderRadius: '10px',
                  background: isDarkMode ? '#1a2651' : '#f7faff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode ? '#1f2f5a' : '#eef7ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDarkMode ? '#1a2651' : '#f7faff';
                }}
              >
                <div
                  style={{
                    width: '70px',
                    height: '42px',
                    borderRadius: '8px',
                    background: isDarkMode ? '#2f3e73' : '#eef7ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDarkMode ? '#b6c5ff' : '#144057',
                    fontSize: '11px',
                    fontWeight: '600',
                  }}
                >
                  {episode.number}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>{episode.title}</h4>
                  <p style={{ margin: '2px 0 0', color: isDarkMode ? '#adbadf' : '#5c6c97', fontSize: '12px' }}>
                    {episode.duration}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    borderRadius: '999px',
                    background: isDarkMode ? '#2f3e73' : '#eef7ff',
                    color: isDarkMode ? '#d3ddff' : '#144057',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {episode.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Right Panel - Performance Snapshot */}
        <aside style={{
          background: isDarkMode ? '#111a38' : '#fff',
          border: `1px solid ${isDarkMode ? 'rgba(255,255,255,.08)' : '#d9e3ff'}`,
          borderRadius: '12px',
          padding: '14px',
        }}>
          <h2 style={{ margin: '0 0 10px', fontSize: '18px' }}>Quick Performance Snapshot</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '10px',
          }}>
            <div style={{
              background: isDarkMode ? '#1a2651' : '#f7faff',
              padding: '12px',
              borderRadius: '10px',
            }}>
              <strong>Overall Progress</strong>
              <p style={{ margin: '4px 0 0' }}>42% complete</p>
            </div>
            <div style={{
              background: isDarkMode ? '#1a2651' : '#f7faff',
              padding: '12px',
              borderRadius: '10px',
            }}>
              <strong>Time Studied</strong>
              <p style={{ margin: '4px 0 0' }}>3h 18m</p>
            </div>
            <div style={{
              background: isDarkMode ? '#1a2651' : '#f7faff',
              padding: '12px',
              borderRadius: '10px',
            }}>
              <strong>Flashcards</strong>
              <p style={{ margin: '4px 0 0' }}>60 cards available</p>
            </div>
            <div style={{
              background: isDarkMode ? '#1a2651' : '#f7faff',
              padding: '12px',
              borderRadius: '10px',
            }}>
              <strong>Case Studies</strong>
              <p style={{ margin: '4px 0 0' }}>7 scenarios</p>
            </div>
          </div>
          <div style={{
            marginTop: '12px',
            padding: '10px',
            border: isDarkMode ? '1px dashed #39d0c8' : '1px dashed #39d0c8',
            borderRadius: '10px',
            color: isDarkMode ? '#d8fff9' : '#144057',
            background: isDarkMode ? '#101d3d' : '#eef7ff',
            fontSize: '13px',
          }}>
            <strong>Atlas says:</strong> "If nursing school had a boss level, it'd be dosage calculations without coffee."
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TextbookDashboard;
