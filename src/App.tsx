import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { HomePage } from "./components/HomePage"
import { AboutPage } from "./components/AboutPage"
import { ContactPage } from "./components/ContactPage"
import { LoginPage } from "./components/LoginPage"
import { SignUpPage } from "./components/SignUpPage"
import { ForgotPasswordPage } from "./components/ForgotPasswordPage"
import { Dashboard } from "./components/Dashboard"
import { ApplicationLanding } from "./components/ApplicationLanding"
import { FamousSpeeches } from "./components/FamousSpeeches"
import { AcademicSamples } from "./components/AcademicSamples"
import { MyLessons } from "./components/MyLessons"
import { CustomContent } from "./components/CustomContent"
import { ChatWithAI } from "./components/ChatWithAI"
import { IELTSModule } from "./components/IELTSModule"
import { Profile } from "./components/Profile"
import { ThemeProvider } from "./components/ThemeProvider"

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="size-full">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/application" element={<ApplicationLanding />} />
            <Route path="/famous-speeches" element={<FamousSpeeches />} />
            <Route path="/academic-samples" element={<AcademicSamples />} />
            <Route path="/my-lessons" element={<MyLessons />} />
            <Route path="/custom-content" element={<CustomContent />} />
            <Route path="/chat" element={<ChatWithAI />} />
            <Route path="/ielts" element={<IELTSModule />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}
