import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { HomePage } from "./components/HomePage"
import { AboutPage } from "./components/AboutPage"
import { ContactPage } from "./components/ContactPage"
import { LoginPage } from "./components/LoginPage"
import { SignUpPage } from "./components/SignUpPage"
import { ForgotPasswordPage } from "./components/ForgotPasswordPage"
import { Dashboard } from "./components/Dashboard"
import { FamousSpeeches } from "./components/FamousSpeeches"
import { AcademicSamples } from "./components/AcademicSamples"
import { ChapterView } from "./components/ChapterView"
import { MyLessons } from "./components/MyLessons"
import { CustomContent } from "./components/CustomContent"
import { ChatWithAI } from "./components/ChatWithAI"
import { IELTSModule } from "./components/IELTSModule"
import { Profile } from "./components/Profile"
import { ThemeProvider } from "./components/ThemeProvider"
import { ContentLibrary } from "./components/ContentLibrary"
import { QuickPractice } from "./components/QuickPractice"
import { WritingPractice } from "./components/WritingPractice"
import { ListeningPractice } from "./components/ListeningPractice";
import { CasualConversations } from "./components/listening-practice/CasualConversations";
import { OfficialConversations } from "./components/listening-practice/OfficialConversations";
import { FormalConversations } from "./components/listening-practice/FormalConversations";
import { Connectteacher } from "./components/Connectteacher";
import { NewDashboard } from "./components/NewDashboard";
import { SkillDetail } from "./components/SkillDetail"
import ReadingPage from "./components/ReadingPage"
import { ReadingModulesPage } from "./components/modules/ReadingModulesPage"
import { SpeakingModulesPage } from "./components/modules/SpeakingModulesPage"
import { WritingModulesPage } from "./components/modules/WritingModulesPage"
import { ListeningModulesPage } from "./components/modules/ListeningModulesPage"
import { Stories } from "./components/Stories"
import { Novel } from "./components/Novel"
import { PhonemeGuide } from "./components/PhonemeGuide"
import { StoryDetail } from "./components/StoryDetail"
import { NovelDetail } from "./components/NovelDetail"
import { AssessmentResultsPage } from "./components/AssessmentResultsPage"
import { SpeechAssessmentResultsPage } from "./components/SpeechAssessmentResultsPage"
import { AuthProvider } from "./contexts/AuthContext"
import { Toaster } from "./components/ui/sonner"
import { ProtectedRoute } from "./components/ProtectedRoute"


export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="size-full">
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/quick-practice" element={<ProtectedRoute><QuickPractice /></ProtectedRoute>} />
            <Route path="/application" element={<Navigate to="/login" replace />} />
            <Route path="/famous-speeches" element={<ProtectedRoute><FamousSpeeches /></ProtectedRoute>} />
            <Route path="/academic-samples" element={<ProtectedRoute><AcademicSamples /></ProtectedRoute>} />
            <Route path="/academic-samples/chapter/:chapterId" element={<ProtectedRoute><ChapterView /></ProtectedRoute>} />
            <Route path="/academic-samples/results" element={<ProtectedRoute><SpeechAssessmentResultsPage /></ProtectedRoute>} />
            <Route path="/my-lessons" element={<ProtectedRoute><MyLessons /></ProtectedRoute>} />
            <Route path="/custom-content" element={<ProtectedRoute><CustomContent /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><ChatWithAI /></ProtectedRoute>} />
            <Route path="/ielts" element={<ProtectedRoute><IELTSModule /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/content-library" element={<ProtectedRoute><ContentLibrary /></ProtectedRoute>} />
            <Route path="/writing-practice" element={<ProtectedRoute><WritingPractice /></ProtectedRoute>} />
            <Route path="/listening-practice" element={<ProtectedRoute><ListeningPractice /></ProtectedRoute>} />
            <Route path="/casual-conversations" element={<ProtectedRoute><CasualConversations /></ProtectedRoute>} />
            <Route path="/official-conversations" element={<ProtectedRoute><OfficialConversations /></ProtectedRoute>} />
            <Route path="/formal-conversations" element={<ProtectedRoute><FormalConversations /></ProtectedRoute>} />
            <Route path="/connect-teacher" element={<ProtectedRoute><Connectteacher /></ProtectedRoute>} />
            <Route path="/skills-home" element={<ProtectedRoute><NewDashboard /></ProtectedRoute>} />
            <Route path="/skills/:skillId" element={<ProtectedRoute><SkillDetail /></ProtectedRoute>} />
            <Route path="/reading-page" element={<ProtectedRoute><ReadingPage /></ProtectedRoute>} />
            <Route path="/reading-modules" element={<ProtectedRoute><ReadingModulesPage /></ProtectedRoute>} />
            <Route path="/speaking-modules" element={<ProtectedRoute><SpeakingModulesPage /></ProtectedRoute>} />
            <Route path="/writing-modules" element={<ProtectedRoute><WritingModulesPage /></ProtectedRoute>} />
            <Route path="/listening-modules" element={<ProtectedRoute><ListeningModulesPage /></ProtectedRoute>} />
            <Route path="/stories" element={<ProtectedRoute><Stories /></ProtectedRoute>} />
            <Route path="/story/:storyId" element={<ProtectedRoute><StoryDetail /></ProtectedRoute>} />
            <Route path="/novel" element={<ProtectedRoute><Novel /></ProtectedRoute>} />
            <Route path="/novel/:novelId" element={<ProtectedRoute><NovelDetail /></ProtectedRoute>} />
            <Route path="/phoneme-guide" element={<ProtectedRoute><PhonemeGuide /></ProtectedRoute>} />
            
            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  )
}
