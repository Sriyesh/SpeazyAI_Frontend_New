import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ThemeToggle } from '../ThemeToggle';
import { ArrowLeft, Mic, CheckCircle, Star } from 'lucide-react';

export function IELTSSpeakingPage() {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleStartRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setCompleted(true);
      setTimeout(() => setCompleted(false), 3000);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/30 to-indigo-900/30 dark:from-black dark:via-purple-900/30 dark:to-indigo-900/30 light:from-purple-50 light:via-indigo-50 light:to-white relative overflow-hidden">
      <header className="bg-black/90 backdrop-blur-sm border-b border-pink-500/30 dark:border-pink-500/30 light:border-pink-300/40 sticky top-0 z-50 dark:bg-black/90 light:bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => navigate('/ielts')}
              className="text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white light:text-gray-600 light:hover:text-gray-900 uppercase text-xs tracking-wider"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              IELTS Menu
            </Button>
            
            <h1 className="text-lg font-bold text-white dark:text-white light:text-gray-900 uppercase tracking-wider">
              IELTS Speaking
            </h1>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-gray-900/90 border border-pink-500/30 dark:bg-gray-900/90 dark:border-pink-500/30 light:bg-white light:border-pink-300/40 shadow-2xl glow-pink">
            <CardHeader>
              <CardTitle className="text-2xl text-white dark:text-white light:text-gray-900 uppercase tracking-wider flex items-center">
                <Mic className="w-6 h-6 mr-3 text-pink-400" />
                Speaking Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-800 dark:bg-gray-800 light:bg-gray-100 rounded-lg p-6 border border-gray-700 dark:border-gray-700 light:border-gray-200">
                <h3 className="text-lg font-bold text-white dark:text-white light:text-gray-900 mb-3 uppercase tracking-wider">Speaking Prompt</h3>
                <p className="text-gray-300 dark:text-gray-300 light:text-gray-700">
                  Describe a memorable journey you have taken. You should say:
                </p>
                <ul className="list-disc list-inside text-gray-300 dark:text-gray-300 light:text-gray-700 mt-2 space-y-1">
                  <li>Where you went</li>
                  <li>Who you went with</li>
                  <li>What you did there</li>
                  <li>Why it was memorable</li>
                </ul>
              </div>

              <div className="text-center py-8">
                {completed ? (
                  <div>
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center kid-bounce">
                      <CheckCircle className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white dark:text-white light:text-gray-900 mb-2">Excellent Work!</h3>
                    <div className="flex justify-center space-x-2 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className={`w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center ${isRecording ? 'kid-pulse' : ''}`}>
                      <Mic className="w-16 h-16 text-white" />
                    </div>
                    <Button
                      onClick={handleStartRecording}
                      disabled={isRecording}
                      className={`bg-gradient-to-r from-pink-500 to-rose-600 hover:opacity-90 text-white uppercase tracking-wider px-8 ${isRecording ? 'opacity-50' : ''}`}
                    >
                      {isRecording ? 'Recording...' : 'Start Recording'}
                    </Button>
                    {isRecording && (
                      <p className="text-pink-400 mt-4 kid-pulse">🎤 Speak clearly and naturally...</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
