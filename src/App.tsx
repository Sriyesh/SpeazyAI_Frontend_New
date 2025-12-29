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


export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="size-full">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quick-practice" element={<QuickPractice />} />
            <Route path="/application" element={<Navigate to="/login" replace />} />
            <Route path="/famous-speeches" element={<FamousSpeeches />} />
            <Route path="/academic-samples" element={<AcademicSamples />} />
            <Route path="/academic-samples/chapter/:chapterId" element={<ChapterView />} />
            <Route path="/academic-samples/results" element={<AssessmentResultsPage />} />
            <Route path="/my-lessons" element={<MyLessons />} />
            <Route path="/custom-content" element={<CustomContent />} />
            <Route path="/chat" element={<ChatWithAI />} />
            <Route path="/ielts" element={<IELTSModule />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
            <Route path="/content-library" element={<ContentLibrary />} />
            <Route path="/writing-practice" element={<WritingPractice />} />
            <Route path="/listening-practice" element={<ListeningPractice />} />
            <Route path="/casual-conversations" element={<CasualConversations />} />
            <Route path="/official-conversations" element={<OfficialConversations />} />
            <Route path="/formal-conversations" element={<FormalConversations />} />
            <Route path="/connect-teacher" element={<Connectteacher />} />
            <Route path="/skills-home" element={<NewDashboard />} />
            <Route path="/skills/:skillId" element={<SkillDetail />} />
            <Route path="/reading-page" element={<ReadingPage />} />
            <Route path="/reading-modules" element={<ReadingModulesPage />} />
            <Route path="/speaking-modules" element={<SpeakingModulesPage />} />
            <Route path="/writing-modules" element={<WritingModulesPage />} />
            <Route path="/listening-modules" element={<ListeningModulesPage />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/story/:storyId" element={<StoryDetail />} />
            <Route path="/novel" element={<Novel />} />
            <Route path="/novel/:novelId" element={<NovelDetail />} />
            <Route path="/phoneme-guide" element={<PhonemeGuide />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}
