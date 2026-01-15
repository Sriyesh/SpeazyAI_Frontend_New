import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { ThemeToggle } from '../ThemeToggle';
import { ArrowLeft, PenTool } from 'lucide-react';

export function IELTSWritingPage() {
  const navigate = useNavigate();
  const [writingText, setWritingText] = useState('');

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
              IELTS Writing
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
                <PenTool className="w-6 h-6 mr-3 text-green-400" />
                Essay Writing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-800 dark:bg-gray-800 light:bg-gray-100 rounded-lg p-6 border border-gray-700 dark:border-gray-700 light:border-gray-200">
                <h3 className="text-lg font-bold text-white dark:text-white light:text-gray-900 mb-3 uppercase tracking-wider">Task</h3>
                <p className="text-gray-300 dark:text-gray-300 light:text-gray-700">
                  Write an essay discussing the advantages and disadvantages of social media in modern society. 
                  Provide specific examples to support your arguments. (Minimum 250 words)
                </p>
              </div>

              <Textarea
                value={writingText}
                onChange={(e) => setWritingText(e.target.value)}
                placeholder="Begin writing your essay here..."
                rows={15}
                className="bg-gray-800 border-gray-600 text-white dark:bg-gray-800 dark:border-gray-600 dark:text-white light:bg-white light:border-gray-300 light:text-gray-900"
              />

              <div className="flex justify-between items-center text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
                <span>Word count: {writingText.split(/\s+/).filter(w => w).length}</span>
                <span>Target: 250+ words</span>
              </div>

              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white uppercase tracking-wider">
                Get AI Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
