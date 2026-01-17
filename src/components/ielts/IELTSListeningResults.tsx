import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Headphones, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ListeningContent {
  id: string;
  title: string;
  audio_url: string;
  questions: Array<{
    question_number: number;
    question_type: string;
    question: string;
    options?: string[];
    correct_answer: string | string[];
    prompt?: string;
    text?: string;
    max_words?: number;
  }>;
  total_questions: number;
  time_limit_minutes?: number;
}

export function IELTSListeningResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { contentId } = useParams<{ contentId: string }>();
  const { logout } = useAuth();
  
  const state = location.state as {
    listeningContent: ListeningContent;
    userAnswers: { [key: number]: string | string[] };
    correctCount: number;
    totalQuestions: number;
    percentage: number;
    ieltsScore: number;
    answerResults: { [key: number]: boolean };
    saveResultResponse?: {
      success: boolean;
      message: string;
      result: {
        id: number;
        content_id: string;
        title: string;
        created_at: string;
      };
      scores: {
        ielts_score: number;
        correct_answers: number;
        total_questions: number;
        accuracy_percent: number;
      };
      time: {
        total_time_seconds: number;
        formatted: string;
      };
      raw_result_json?: any;
      answer_results?: { [key: number]: boolean };
      correct_answers?: Array<{
        question_id?: number;
        question_number?: number;
        correct_answer?: string | string[];
      }>;
    };
  };


  if (!state) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #000000, rgba(147, 51, 234, 0.3), rgba(99, 102, 241, 0.3))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#f87171', marginBottom: '16px', fontSize: '16px' }}>No results data found</p>
          <button
            onClick={() => navigate('/ielts/listening')}
            style={{
              background: 'linear-gradient(to right, #22c55e, #10b981)',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            Back to Listening
          </button>
        </div>
      </div>
    );
  }

  const { 
    listeningContent,
    userAnswers,
    correctCount,
    totalQuestions,
    percentage,
    ieltsScore,
    answerResults,
    saveResultResponse,
  } = state;
  
  // Calculate total time in minutes and seconds
  const totalTimeSeconds = saveResultResponse?.time?.total_time_seconds || 0;
  const totalTimeMinutes = Math.floor(totalTimeSeconds / 60);
  const remainingSeconds = totalTimeSeconds % 60;
  const timeDisplay = totalTimeSeconds > 0 
    ? `${totalTimeMinutes} min ${remainingSeconds} sec`
    : '0 min 0 sec';

  const getScoreColor = (score: number) => {
    if (score >= 7) return '#22c55e'; // green
    if (score >= 6) return '#eab308'; // yellow
    if (score >= 5) return '#f97316'; // orange
    return '#f87171'; // red
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #000000, rgba(147, 51, 234, 0.3), rgba(99, 102, 241, 0.3))',
      padding: '24px',
      color: '#ffffff',
    }}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '32px',
        }}>
          <button
            onClick={() => navigate('/ielts/listening')}
            style={{
              background: 'rgba(31, 41, 55, 0.8)',
              border: '1px solid rgba(75, 85, 99, 0.5)',
              borderRadius: '8px',
              padding: '10px 14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#ffffff',
              marginRight: '16px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(31, 41, 55, 1)';
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(31, 41, 55, 0.8)';
              e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)';
            }}
          >
            <ArrowLeft size={18} />
            <span>Back to Listening</span>
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              margin: 0,
              background: 'linear-gradient(to right, #a855f7, #6366f1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {listeningContent?.title || 'Listening Results'}
            </h1>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '10px 14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#ef4444',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        {/* Score Card */}
        <div style={{
          background: 'rgba(31, 41, 55, 0.8)',
          border: '1px solid rgba(75, 85, 99, 0.5)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '8px',
          }}>
            <Headphones size={32} color={getScoreColor(ieltsScore)} />
            <div>
              <div style={{
                fontSize: '14px',
                color: '#9ca3af',
                marginBottom: '4px',
              }}>
                Your IELTS Listening Score
              </div>
              <div style={{
                fontSize: '48px',
                fontWeight: '700',
                color: getScoreColor(ieltsScore),
              }}>
                {ieltsScore.toFixed(1)}
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '32px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <div style={{
              textAlign: 'center',
              padding: '16px 24px',
              background: 'rgba(168, 85, 247, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(168, 85, 247, 0.3)',
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#22c55e',
                marginBottom: '4px',
              }}>
                {correctCount}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#9ca3af',
              }}>
                Correct Answers
              </div>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '16px 24px',
              background: 'rgba(168, 85, 247, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(168, 85, 247, 0.3)',
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#6366f1',
                marginBottom: '4px',
              }}>
                {totalQuestions}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#9ca3af',
              }}>
                Total Questions
              </div>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '16px 24px',
              background: 'rgba(168, 85, 247, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(168, 85, 247, 0.3)',
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#a855f7',
                marginBottom: '4px',
              }}>
                {percentage.toFixed(1)}%
              </div>
              <div style={{
                fontSize: '14px',
                color: '#9ca3af',
              }}>
                Accuracy
              </div>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '16px 24px',
              background: 'rgba(168, 85, 247, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(168, 85, 247, 0.3)',
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#eab308',
                marginBottom: '4px',
              }}>
                {timeDisplay}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#9ca3af',
              }}>
                Time Taken
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
