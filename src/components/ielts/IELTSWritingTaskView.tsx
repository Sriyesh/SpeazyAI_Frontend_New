import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, ChevronLeft, ChevronRight, Check, Clock } from 'lucide-react';

interface TaskContent {
  id: string;
  title: string;
  task_1?: {
    instruction: string;
    word_limit: number;
    time_limit_minutes: number;
    visual?: {
      type: string;
      url: string;
    };
  };
  task_2?: {
    instruction: string;
    word_limit: number;
    time_limit_minutes: number;
  };
}

export function IELTSWritingTaskView() {
  const { contentId } = useParams<{ contentId: string }>();
  const [searchParams] = useSearchParams();
  const taskNumber = searchParams.get('task') || '1';
  const navigate = useNavigate();
  const { token } = useAuth();
  const [taskContent, setTaskContent] = useState<TaskContent | null>(null);
  const [task1ImageUrl, setTask1ImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [leftPanelWidth, setLeftPanelWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Fetch task data
  useEffect(() => {
    const fetchTaskData = async () => {
      if (!token || !contentId) {
        setError('Missing authentication or content ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // First, get the content item to find json_url
        const listResponse = await fetch(
          'https://api.exeleratetechnology.com/api/ielts/writing/content/list.php',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!listResponse.ok) {
          const errorText = await listResponse.text();
          console.error('List response error:', errorText);
          throw new Error(`Failed to fetch content list: ${listResponse.status}`);
        }

        const listData = await listResponse.json();
        console.log('List data:', listData);
        
        if (!listData.success || !Array.isArray(listData.items)) {
          throw new Error('Invalid response format from API');
        }

        const item = listData.items.find((item: any) => item.content_id === contentId || item.id.toString() === contentId);

        if (!item) {
          console.error('Item not found. ContentId:', contentId, 'Available items:', listData.items);
          throw new Error('Content not found');
        }

        if (!item.json_url) {
          throw new Error('Content URL not found');
        }

        // Store task1_image_url if it exists
        if (item.task1_image_url) {
          setTask1ImageUrl(item.task1_image_url);
        }

        // Fetch the actual task data from json_url (CDN - no auth needed)
        console.log('Fetching from CDN:', item.json_url);
        const taskResponse = await fetch(item.json_url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // CDN URLs are public - don't send Authorization header
          },
        });

        if (!taskResponse.ok) {
          const errorText = await taskResponse.text();
          console.error('CDN response error:', errorText);
          throw new Error(`Failed to fetch task data: ${taskResponse.status}`);
        }

        const content: TaskContent = await taskResponse.json();
        console.log('Task content loaded:', content);
        setTaskContent(content);
        
        // Extract task data based on task number
        const isTask1 = taskNumber === '1';
        const task = isTask1 ? content.task_1 : content.task_2;
        
        if (!task) {
          throw new Error(`Task ${taskNumber} not found in content`);
        }
        
        // Set image URL for task 1
        if (isTask1 && task.visual?.url) {
          setTask1ImageUrl(task.visual.url);
        }
      } catch (err: any) {
        console.error('Error fetching task data:', err);
        setError(err.message || 'Failed to load writing task. Please try again.');
        setTaskContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskData();
  }, [token, contentId, taskNumber]);

  // Update word count when text changes
  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [text]);

  // Timer countdown
  useEffect(() => {
    if (!taskContent) return;
    
    const isTask1 = taskNumber === '1';
    const currentTask = isTask1 ? taskContent.task_1 : taskContent.task_2;
    if (!currentTask) return;

    const totalSeconds = currentTask.time_limit_minutes * 60;
    setTimeRemaining(totalSeconds);

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [taskContent, taskNumber]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      const clampedWidth = Math.max(30, Math.min(70, newWidth));
      setLeftPanelWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #000000, rgba(147, 51, 234, 0.3), rgba(99, 102, 241, 0.3))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(75, 85, 99, 0.5)',
            borderTopColor: '#22c55e',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }}></div>
          <p style={{ color: '#d1d5db', fontSize: '16px' }}>Loading task...</p>
        </div>
      </div>
    );
  }

  if (error || !taskContent) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #000000, rgba(147, 51, 234, 0.3), rgba(99, 102, 241, 0.3))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#f87171', marginBottom: '16px', fontSize: '16px' }}>{error || 'Task not found'}</p>
          <button
            onClick={() => navigate('/ielts/writing')}
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
            Back to Writing
          </button>
        </div>
      </div>
    );
  }

  const isTask1 = taskNumber === '1';
  const task = isTask1 ? taskContent.task_1 : taskContent.task_2;

  if (!task) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #000000, rgba(147, 51, 234, 0.3), rgba(99, 102, 241, 0.3))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#f87171', marginBottom: '16px', fontSize: '16px' }}>Task {taskNumber} not found</p>
          <button
            onClick={() => navigate('/ielts/writing')}
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
            Back to Writing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #000000, rgba(147, 51, 234, 0.3), rgba(99, 102, 241, 0.3))',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(236, 72, 153, 0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ padding: '16px 24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
          }}>
            <button
              onClick={() => navigate('/ielts/writing')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                fontSize: '14px',
                padding: '4px 8px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#9ca3af';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ArrowLeft style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Back
            </button>
            <h1 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Part {taskNumber}
            </h1>
            {/* Timer in top right */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(17, 24, 39, 0.8)',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(236, 72, 153, 0.3)',
            }}>
              <Clock style={{ width: '18px', height: '18px', color: timeRemaining < 300 ? '#f87171' : '#22c55e' }} />
              <span style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: timeRemaining < 300 ? '#f87171' : '#22c55e',
                fontFamily: 'monospace',
              }}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
          <div style={{
            backgroundColor: 'rgba(17, 24, 39, 0.6)',
            borderRadius: '4px',
            padding: '10px 16px',
            fontSize: '14px',
            color: '#d1d5db',
            border: '1px solid rgba(75, 85, 99, 0.5)',
          }}>
            You should spend about {task.time_limit_minutes} minutes on this task. Write at least {task.word_limit} words.
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {/* Left Panel */}
        <div
          style={{
            borderRight: '1px solid rgba(75, 85, 99, 0.5)',
            overflowY: 'auto',
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            width: `${leftPanelWidth}%`,
          }}
        >
          <div style={{ padding: '24px' }}>
            {/* Task Description */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{
                color: '#ffffff',
                fontSize: '16px',
                lineHeight: '1.6',
                marginBottom: '16px',
              }}>
                {task.instruction}
              </p>
              {isTask1 && (
                <p style={{
                  color: '#d1d5db',
                  fontSize: '14px',
                  marginBottom: '16px',
                }}>
                  Summarise the information by selecting and reporting the main features, and make comparisons where relevant.
                </p>
              )}
            </div>

            {/* Task 1 Image */}
            {isTask1 && task1ImageUrl && (
              <div style={{ marginTop: '24px' }}>
                <img
                  src={task1ImageUrl}
                  alt="Task 1 Chart"
                  style={{
                    width: '100%',
                    height: 'auto',
                    border: '1px solid rgba(75, 85, 99, 0.5)',
                    borderRadius: '4px',
                    maxHeight: '500px',
                    objectFit: 'contain',
                    backgroundColor: '#ffffff',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Resizable Divider */}
        <div
          ref={resizeRef}
          style={{
            width: '4px',
            backgroundColor: 'rgba(75, 85, 99, 0.5)',
            cursor: 'col-resize',
            position: 'relative',
          }}
          onMouseDown={handleResizeStart}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(236, 72, 153, 0.5)';
          }}
          onMouseLeave={(e) => {
            if (!isResizing) {
              e.currentTarget.style.backgroundColor = 'rgba(75, 85, 99, 0.5)';
            }
          }}
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '24px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0';
          }}
          >
            <div style={{
              width: '20px',
              height: '24px',
              backgroundColor: 'rgba(236, 72, 153, 0.3)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
            }}>
              <div style={{ width: '2px', height: '16px', backgroundColor: '#ec4899' }}></div>
              <div style={{ width: '2px', height: '16px', backgroundColor: '#ec4899' }}></div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            width: `${100 - leftPanelWidth}%`,
          }}
        >
          <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Text Area */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start writing your response here..."
              style={{
                flex: 1,
                width: '100%',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                borderRadius: '4px',
                padding: '16px',
                color: '#ffffff',
                backgroundColor: 'rgba(31, 41, 55, 0.6)',
                resize: 'none',
                outline: 'none',
                fontSize: '14px',
                lineHeight: '1.5',
                fontFamily: 'inherit',
                minHeight: '400px',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#22c55e';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(75, 85, 99, 0.5)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />

            {/* Word Counter and Navigation */}
            <div style={{
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{
                fontSize: '14px',
                color: '#d1d5db',
              }}>
                Words: {wordCount}
              </div>
              <div style={{
                display: 'flex',
                gap: '8px',
              }}>
                <button
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid rgba(75, 85, 99, 0.5)',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(17, 24, 39, 0.8)',
                    cursor: isTask1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isTask1 ? 0.5 : 1,
                  }}
                  disabled={isTask1}
                  onClick={() => {
                    if (!isTask1 && contentId) {
                      navigate(`/ielts/writing/${contentId}?task=1`);
                    }
                  }}
                >
                  <ChevronLeft style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                </button>
                <button
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid rgba(34, 197, 94, 0.5)',
                    borderRadius: '4px',
                    background: isTask1 && taskContent?.task_2 ? 'linear-gradient(to right, #22c55e, #10b981)' : 'rgba(17, 24, 39, 0.8)',
                    cursor: isTask1 && taskContent?.task_2 ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isTask1 && taskContent?.task_2 ? 1 : 0.5,
                  }}
                  disabled={!isTask1 || !taskContent?.task_2}
                  onClick={() => {
                    if (isTask1 && taskContent?.task_2 && contentId) {
                      navigate(`/ielts/writing/${contentId}?task=2`);
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (isTask1 && taskContent?.task_2) {
                      e.currentTarget.style.background = 'linear-gradient(to right, #10b981, #059669)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isTask1 && taskContent?.task_2) {
                      e.currentTarget.style.background = 'linear-gradient(to right, #22c55e, #10b981)';
                    }
                  }}
                >
                  <ChevronRight style={{ width: '20px', height: '20px', color: '#ffffff' }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(75, 85, 99, 0.5)',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Part {taskNumber}
          </span>
          <button
            style={{
              background: 'transparent',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              color: '#ec4899',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 12px',
              borderRadius: '8px',
            }}
            onClick={() => {
              // If Task 1 is complete and Task 2 exists, move to Task 2
              // Otherwise, show completion message or submit
              if (isTask1 && taskContent?.task_2 && contentId) {
                navigate(`/ielts/writing/${contentId}?task=2`);
              } else {
                // Task 2 complete or no Task 2 - could show completion message
                alert('Task completed!');
              }
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(236, 72, 153, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.3)';
            }}
          >
            <Check style={{ width: '20px', height: '20px' }} />
          </button>
        </div>
      </footer>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
