import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { ThemeToggle } from './ThemeToggle';
import { 
  ArrowLeft, 
  BookOpen, 
  PenTool, 
  Headphones, 
  Mic,
  Play,
  Pause,
  CheckCircle,
  Star,
  Sparkles
} from 'lucide-react';

interface IELTSModuleProps {
  onBack: () => void;
}

type View = 'landing' | 'reading' | 'writing' | 'listening' | 'speaking';

export function IELTSModule({ onBack }: IELTSModuleProps) {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [writingText, setWritingText] = useState('');
  const [completed, setCompleted] = useState(false);

  const skills = [
    {
      id: 'reading' as View,
      title: 'READING',
      description: 'Comprehension passages and analysis',
      icon: BookOpen,
      gradient: 'from-blue-500 to-cyan-600',
      glowColor: 'shadow-blue-500/50'
    },
    {
      id: 'writing' as View,
      title: 'WRITING',
      description: 'Essay composition with AI feedback',
      icon: PenTool,
      gradient: 'from-green-500 to-emerald-600',
      glowColor: 'shadow-green-500/50'
    },
    {
      id: 'listening' as View,
      title: 'LISTENING',
      description: 'Audio comprehension exercises',
      icon: Headphones,
      gradient: 'from-purple-500 to-indigo-600',
      glowColor: 'shadow-purple-500/50'
    },
    {
      id: 'speaking' as View,
      title: 'SPEAKING',
      description: 'Voice recording and pronunciation',
      icon: Mic,
      gradient: 'from-pink-500 to-rose-600',
      glowColor: 'shadow-pink-500/50'
    }
  ];

  const readingPassage = `Climate change is one of the most pressing issues facing humanity today. The increase in global temperatures has led to more frequent extreme weather events, rising sea levels, and shifts in ecosystems around the world.

Scientists have documented a clear correlation between human activities and the acceleration of climate change. The burning of fossil fuels, deforestation, and industrial processes have significantly increased the concentration of greenhouse gases in the atmosphere.

However, there is hope. Renewable energy technologies such as solar and wind power are becoming more efficient and cost-effective. Many countries have committed to reducing their carbon emissions and transitioning to sustainable energy sources.`;

  const readingQuestions = [
    { id: 1, question: 'What is identified as one of the main causes of climate change?', answer: 'Burning of fossil fuels' },
    { id: 2, question: 'What type of energy sources are mentioned as solutions?', answer: 'Solar and wind power' },
    { id: 3, question: 'According to the passage, what have many countries committed to?', answer: 'Reducing carbon emissions' }
  ];

  const handlePlayAudio = () => {
    setIsPlaying(!isPlaying);
    setTimeout(() => setIsPlaying(false), 5000);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setCompleted(true);
      setTimeout(() => setCompleted(false), 3000);
    }, 4000);
  };

  const renderLanding = () => (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-white dark:text-white light:text-gray-900 mb-4 uppercase tracking-wider">
          IELTS PREPARATION
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto mb-6" />
        <p className="text-xl text-gray-400 dark:text-gray-400 light:text-gray-600 uppercase tracking-wide">
          Master all four skills
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skills.map((skill, index) => (
          <Card
            key={skill.id}
            onClick={() => setCurrentView(skill.id)}
            className="group bg-gray-900/80 border border-gray-800 dark:bg-gray-900/80 dark:border-gray-800 light:bg-white light:border-gray-200 hover:border-pink-500/50 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl dashboard-card-enter"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6 text-center">
              <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${skill.gradient} rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:${skill.glowColor}`}>
                <skill.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white dark:text-white light:text-gray-900 mb-2 uppercase tracking-wider group-hover:text-pink-400 transition-colors">
                {skill.title}
              </h3>
              <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 text-sm">
                {skill.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderReading = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="bg-gray-900/90 border border-pink-500/30 dark:bg-gray-900/90 dark:border-pink-500/30 light:bg-white light:border-pink-300/40 shadow-2xl glow-pink">
        <CardHeader>
          <CardTitle className="text-2xl text-white dark:text-white light:text-gray-900 uppercase tracking-wider flex items-center">
            <BookOpen className="w-6 h-6 mr-3 text-blue-400" />
            Reading Comprehension
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ScrollArea className="h-64 px-4">
            <div className="text-gray-300 dark:text-gray-300 light:text-gray-700 leading-relaxed space-y-4">
              {readingPassage.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </ScrollArea>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white dark:text-white light:text-gray-900 uppercase tracking-wider">Questions</h3>
            {readingQuestions.map((q) => (
              <div key={q.id} className="bg-gray-800 dark:bg-gray-800 light:bg-gray-100 rounded-lg p-4 border border-gray-700 dark:border-gray-700 light:border-gray-200">
                <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 mb-2">{q.id}. {q.question}</p>
                <Input
                  placeholder="Your answer..."
                  className="bg-gray-900 border-gray-600 text-white dark:bg-gray-900 dark:border-gray-600 dark:text-white light:bg-white light:border-gray-300 light:text-gray-900"
                />
              </div>
            ))}
          </div>

          <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:opacity-90 text-white uppercase tracking-wider">
            Submit Answers
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderWriting = () => (
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
  );

  const renderListening = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="bg-gray-900/90 border border-pink-500/30 dark:bg-gray-900/90 dark:border-pink-500/30 light:bg-white light:border-pink-300/40 shadow-2xl glow-pink">
        <CardHeader>
          <CardTitle className="text-2xl text-white dark:text-white light:text-gray-900 uppercase tracking-wider flex items-center">
            <Headphones className="w-6 h-6 mr-3 text-purple-400" />
            Listening Comprehension
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-800 dark:bg-gray-800 light:bg-gray-100 rounded-lg p-8 text-center border border-gray-700 dark:border-gray-700 light:border-gray-200">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
              {isPlaying ? (
                <Pause className="w-16 h-16 text-white" />
              ) : (
                <Play className="w-16 h-16 text-white ml-2" />
              )}
            </div>
            <Button
              onClick={handlePlayAudio}
              className={`bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 text-white uppercase tracking-wider px-8 ${isPlaying ? 'kid-pulse' : ''}`}
            >
              {isPlaying ? 'Playing Audio...' : 'Play Audio'}
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white dark:text-white light:text-gray-900 uppercase tracking-wider">Questions</h3>
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="bg-gray-800 dark:bg-gray-800 light:bg-gray-100 rounded-lg p-4 border border-gray-700 dark:border-gray-700 light:border-gray-200">
                <p className="text-gray-300 dark:text-gray-300 light:text-gray-700 mb-2">Question {num}</p>
                <Input
                  placeholder="Your answer..."
                  className="bg-gray-900 border-gray-600 text-white dark:bg-gray-900 dark:border-gray-600 dark:text-white light:bg-white light:border-gray-300 light:text-gray-900"
                />
              </div>
            ))}
          </div>

          <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 text-white uppercase tracking-wider">
            Submit Answers
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderSpeaking = () => (
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
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/30 to-indigo-900/30 dark:from-black dark:via-purple-900/30 dark:to-indigo-900/30 light:from-purple-50 light:via-indigo-50 light:to-white relative overflow-hidden">
      {/* Playful animated background for inner pages */}
      {currentView !== 'landing' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <Sparkles className="absolute top-20 left-20 w-6 h-6 text-pink-400 animate-pulse" />
          <Star className="absolute top-40 right-20 w-5 h-5 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <Sparkles className="absolute bottom-40 left-40 w-5 h-5 text-purple-400 animate-pulse" style={{ animationDelay: '1s' }} />
          <Star className="absolute bottom-20 right-40 w-6 h-6 text-blue-400 animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
      )}

      <header className="bg-black/90 backdrop-blur-sm border-b border-pink-500/30 dark:border-pink-500/30 light:border-pink-300/40 sticky top-0 z-50 dark:bg-black/90 light:bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => currentView === 'landing' ? onBack() : setCurrentView('landing')}
              className="text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white light:text-gray-600 light:hover:text-gray-900 uppercase text-xs tracking-wider"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentView === 'landing' ? 'Back' : 'IELTS Menu'}
            </Button>
            
            <h1 className="text-lg font-bold text-white dark:text-white light:text-gray-900 uppercase tracking-wider">
              IELTS Module
            </h1>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="relative z-10">
        {currentView === 'landing' && renderLanding()}
        {currentView === 'reading' && renderReading()}
        {currentView === 'writing' && renderWriting()}
        {currentView === 'listening' && renderListening()}
        {currentView === 'speaking' && renderSpeaking()}
      </div>
    </div>
  );
}
