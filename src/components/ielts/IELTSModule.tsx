import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ThemeToggle } from '../ThemeToggle';
import { 
  ArrowLeft, 
  BookOpen, 
  PenTool, 
  Headphones, 
  Mic
} from 'lucide-react';

export function IELTSModule() {
  const navigate = useNavigate();

  const skills = [
    {
      id: 'reading',
      title: 'READING',
      description: 'Comprehension passages and analysis',
      icon: BookOpen,
      gradient: 'from-blue-500 to-cyan-600',
      glowColor: 'shadow-blue-500/50',
      path: '/ielts/reading'
    },
    {
      id: 'writing',
      title: 'WRITING',
      description: 'Essay composition with AI feedback',
      icon: PenTool,
      gradient: 'from-green-500 to-emerald-600',
      glowColor: 'shadow-green-500/50',
      path: '/ielts/writing'
    },
    {
      id: 'listening',
      title: 'LISTENING',
      description: 'Audio comprehension exercises',
      icon: Headphones,
      gradient: 'from-purple-500 to-indigo-600',
      glowColor: 'shadow-purple-500/50',
      path: '/ielts/listening'
    },
    {
      id: 'speaking',
      title: 'SPEAKING',
      description: 'Voice recording and pronunciation',
      icon: Mic,
      gradient: 'from-pink-500 to-rose-600',
      glowColor: 'shadow-pink-500/50',
      path: '/ielts/speaking'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/30 to-indigo-900/30 dark:from-black dark:via-purple-900/30 dark:to-indigo-900/30 light:from-purple-50 light:via-indigo-50 light:to-white relative overflow-hidden">
      <header className="bg-black/90 backdrop-blur-sm border-b border-pink-500/30 dark:border-pink-500/30 light:border-pink-300/40 sticky top-0 z-50 dark:bg-black/90 light:bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => navigate('/skills-home')}
              className="text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white light:text-gray-600 light:hover:text-gray-900 uppercase text-xs tracking-wider"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <h1 className="text-lg font-bold text-white dark:text-white light:text-gray-900 uppercase tracking-wider">
              IELTS Module
            </h1>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="relative z-10">
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
                onClick={() => navigate(skill.path)}
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
      </div>
    </div>
  );
}
