import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, TrendingUp, Headphones, Loader2 } from 'lucide-react';
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
  const { token, refreshToken } = useAuth();
  const [correctAnswers, setCorrectAnswers] = useState<{ [key: number]: string | string[] }>({});
  const [loadingAnswers, setLoadingAnswers] = useState(true);
  
  const state = location.state as {
    listeningContent: ListeningContent;
    userAnswers: { [key: number]: string | string[] };
    correctCount: number;
    totalQuestions: number;
    percentage: number;
    ieltsScore: number;
    answerResults: { [key: number]: boolean };
  };

  // Fetch correct answers from API securely after component loads
  useEffect(() => {
    const fetchAnswers = async () => {
      if (!token || !contentId) {
        setLoadingAnswers(false);
        return;
      }

      try {
        let currentToken = token;
        
        // Try to fetch answers
        const fetchWithToken = async (authToken: string | null) => {
          if (!authToken) return null;
          
          const response = await fetch(
            `https://api.exeleratetechnology.com/api/ielts/listening/content/get-answers.php?content_id=${contentId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
              },
            }
          );
          
          return response;
        };
        
        let response = await fetchWithToken(currentToken);
        
        // If 403, try refreshing token and retry
        if (response && response.status === 403) {
          console.log('Token may be expired, attempting refresh...');
          const refreshed = await refreshToken();
          if (refreshed) {
            // Get updated token from localStorage
            const updatedAuthData = localStorage.getItem('authData');
            if (updatedAuthData) {
              try {
                const parsed = JSON.parse(updatedAuthData);
                currentToken = parsed.token;
                response = await fetchWithToken(currentToken);
              } catch (e) {
                console.error('Error parsing updated auth data:', e);
              }
            }
          }
        }
        
        if (response && response.ok) {
          const data = await response.json();
          const answersMap: { [key: number]: string | string[] } = {};
          
          // Handle different response structures
          if (data.answers && Array.isArray(data.answers)) {
            data.answers.forEach((ans: any) => {
              const qNum = ans.question_id || ans.question_number;
              if (qNum) {
                answersMap[qNum] = ans.correct_answer || ans.answer || '';
              }
            });
          } else if (data.questions && Array.isArray(data.questions)) {
            data.questions.forEach((q: any) => {
              const qNum = q.question_id || q.question_number;
              if (qNum) {
                answersMap[qNum] = q.correct_answer || q.answer || '';
              }
            });
          } else if (data.data && Array.isArray(data.data)) {
            // Handle data.data structure
            data.data.forEach((item: any) => {
              const qNum = item.question_id || item.question_number;
              if (qNum) {
                answersMap[qNum] = item.correct_answer || item.answer || '';
              }
            });
          }
          
          setCorrectAnswers(answersMap);
        } else if (response && response.status === 403) {
          console.error('Access forbidden - unable to fetch answers');
          // Don't expose this error to users, just show "Not available"
        } else if (response) {
          console.error('Failed to fetch answers:', response.status, response.statusText);
        }
      } catch (err) {
        console.error('Error fetching answers:', err);
      } finally {
        setLoadingAnswers(false);
      }
    };

    fetchAnswers();
  }, [token, contentId]);

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
  } = state;

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
          </div>
        </div>

        {/* Questions Review */}
        <div style={{
          background: 'rgba(31, 41, 55, 0.8)',
          border: '1px solid rgba(75, 85, 99, 0.5)',
          borderRadius: '16px',
          padding: '32px',
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '24px',
            color: '#ffffff',
          }}>
            Question Review
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            {listeningContent?.questions.map((question) => {
              const isCorrect = answerResults[question.question_number] || false;
              const userAnswer = userAnswers[question.question_number];
              // Get correct answer from API-fetched data (not from question object)
              let correctAnswer = correctAnswers[question.question_number];
              if (Array.isArray(correctAnswer) && correctAnswer.length === 0) {
                correctAnswer = '';
              } else if (correctAnswer === null || correctAnswer === undefined) {
                correctAnswer = '';
              }
              
              // For MCQ questions, if correct answer is just a letter (A, B, C, etc.)
              // and we have options, try to find the full option text
              let displayCorrectAnswer = correctAnswer;
              if (question.question_type === 'MCQ' && 
                  typeof correctAnswer === 'string' && 
                  correctAnswer.length === 1 && 
                  question.options && 
                  Array.isArray(question.options)) {
                // Find the option that starts with this letter
                const matchingOption = question.options.find((opt: string) => 
                  opt.trim().toUpperCase().startsWith(correctAnswer.toString().toUpperCase() + ':') ||
                  opt.trim().toUpperCase().startsWith(correctAnswer.toString().toUpperCase() + ' ')
                );
                if (matchingOption) {
                  displayCorrectAnswer = matchingOption;
                }
              }

              return (
                <div
                  key={question.question_number}
                  style={{
                    padding: '20px',
                    background: isCorrect 
                      ? 'rgba(34, 197, 94, 0.1)' 
                      : 'rgba(239, 68, 68, 0.1)',
                    border: isCorrect
                      ? '1px solid rgba(34, 197, 94, 0.3)'
                      : '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    marginBottom: '12px',
                  }}>
                    <div style={{
                      minWidth: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: isCorrect ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: isCorrect ? '#22c55e' : '#ef4444',
                    }}>
                      {question.question_number}
                    </div>
                    <div style={{ flex: 1 }}>
                      {question.prompt && (
                        <p style={{
                          color: '#d1d5db',
                          fontSize: '14px',
                          fontWeight: '500',
                          margin: 0,
                          marginBottom: '8px',
                          fontStyle: 'italic',
                        }}>
                          {question.prompt}
                        </p>
                      )}
                      {question.question_type === 'FIB' && question.text ? (
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          gap: '8px',
                          lineHeight: '1.8',
                          marginBottom: '12px',
                        }}>
                          {(() => {
                            const text = question.text;
                            const parts = text.split('__');
                            return parts.map((part, idx) => (
                              <span key={idx}>
                                <span style={{ color: '#ffffff', fontSize: '16px' }}>
                                  {part}
                                </span>
                                {idx < parts.length - 1 && (
                                  <span style={{
                                    padding: '4px 8px',
                                    backgroundColor: isCorrect ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                    border: isCorrect ? '1px solid rgba(34, 197, 94, 0.5)' : '1px solid rgba(239, 68, 68, 0.5)',
                                    borderRadius: '4px',
                                    color: isCorrect ? '#22c55e' : '#ef4444',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    margin: '0 4px',
                                  }}>
                                    {Array.isArray(userAnswer) && userAnswer[idx] 
                                      ? userAnswer[idx] 
                                      : (idx === 0 && !Array.isArray(userAnswer) ? userAnswer : '___')}
                                  </span>
                                )}
                              </span>
                            ));
                          })()}
                        </div>
                      ) : (
                        <p style={{
                          color: '#ffffff',
                          fontSize: '16px',
                          fontWeight: '500',
                          margin: 0,
                          marginBottom: '12px',
                        }}>
                          {question.question}
                        </p>
                      )}

                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}>
                          {isCorrect ? (
                            <CheckCircle size={18} color="#22c55e" />
                          ) : (
                            <XCircle size={18} color="#ef4444" />
                          )}
                          <span style={{
                            fontSize: '14px',
                            color: '#9ca3af',
                          }}>
                            Your Answer:
                          </span>
                          <span style={{
                            fontSize: '14px',
                            color: isCorrect ? '#22c55e' : '#ef4444',
                            fontWeight: '500',
                          }}>
                            {Array.isArray(userAnswer) ? userAnswer.join(', ') : (userAnswer || 'Not answered')}
                          </span>
                        </div>

                        {!isCorrect && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}>
                            <CheckCircle size={18} color="#22c55e" />
                            <span style={{
                              fontSize: '14px',
                              color: '#9ca3af',
                            }}>
                              Correct Answer:
                            </span>
                            <span style={{
                              fontSize: '14px',
                              color: '#22c55e',
                              fontWeight: '500',
                            }}>
                              {loadingAnswers ? (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                                  Loading...
                                </span>
                              ) : (() => {
                                const answerToDisplay = displayCorrectAnswer || correctAnswer;
                                if (Array.isArray(answerToDisplay)) {
                                  return answerToDisplay.length > 0 ? answerToDisplay.join(', ') : 'Not available';
                                }
                                const answerStr = answerToDisplay && answerToDisplay.toString().trim();
                                return answerStr ? answerStr : 'Not available';
                              })()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
