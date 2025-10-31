import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Mic, BookOpen, AlertTriangle, Volume2, Award, Brain } from "lucide-react";

export function SpeechAssessmentResults({ data }) {
  if (!data) return null;

  const pronunciation = data.pronunciation || {};
  const fluency = data.fluency || {};
  const overall = data.overall || {};
  const reading = data.reading || {};
  const warnings = data.warnings || {};
  const metadata = data.metadata || {};

  const wordScores = (pronunciation.words || []).map((w) => ({
    name: w.word_text,
    score: w.word_score,
  }));

  const cardBase =
    "rounded-2xl shadow-md border border-gray-200 bg-white/60 backdrop-blur text-gray-800";

  return (
    <div className="w-full space-y-8 mt-8">
      {/* ========== Overall Summary ========== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={cardBase}>
          <CardContent className="p-6 text-center">
            <Award className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-5xl font-bold text-blue-600 mb-1">
              {overall.overall_score}
            </div>
            <p className="text-sm text-gray-700">Overall Score</p>
            <p className="text-xs text-gray-500 mt-1">
              IELTS {overall.english_proficiency_scores?.mock_ielts?.prediction} •{" "}
              CEFR {overall.english_proficiency_scores?.mock_cefr?.prediction} • PTE{" "}
              {overall.english_proficiency_scores?.mock_pte?.prediction}
            </p>
          </CardContent>
        </Card>

        <Card className={cardBase}>
          <CardContent className="p-6 text-center">
            <Mic className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
            <div className="text-5xl font-bold text-cyan-600 mb-1">
              {pronunciation.overall_score}
            </div>
            <p className="text-sm text-gray-700">Pronunciation Accuracy</p>
            <p className="text-xs text-gray-500 mt-1">
              IELTS {pronunciation.english_proficiency_scores?.mock_ielts?.prediction} •{" "}
              CEFR {pronunciation.english_proficiency_scores?.mock_cefr?.prediction}
            </p>
          </CardContent>
        </Card>

        <Card className={cardBase}>
          <CardContent className="p-6 text-center">
            <BookOpen className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <div className="text-5xl font-bold text-emerald-600 mb-1">
              {fluency.overall_score}
            </div>
            <p className="text-sm text-gray-700">Fluency</p>
            <p className="text-xs text-gray-500 mt-1">
              IELTS {fluency.english_proficiency_scores?.mock_ielts?.prediction} •{" "}
              CEFR {fluency.english_proficiency_scores?.mock_cefr?.prediction}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ========== Pronunciation Breakdown ========== */}
      <Card className={cardBase}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Volume2 className="w-5 h-5 text-blue-500" />
            Pronunciation Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={wordScores}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#475569" />
              <YAxis domain={[0, 100]} stroke="#475569" />
              <Tooltip />
              <Bar dataKey="score" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="flex flex-wrap gap-2 mt-4">
            {(pronunciation.lowest_scoring_phonemes || []).map((p, idx) => (
              <span
                key={idx}
                className="border border-red-300 text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm"
              >
                {p.ipa_label}: {p.phoneme_score}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ========== Fluency Metrics ========== */}
      <Card className={cardBase}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <Brain className="w-5 h-5 text-emerald-500" />
            Fluency & Rhythm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-emerald-50 rounded-lg text-center border border-emerald-100">
              <p className="text-sm text-gray-600">Speech Rate (wpm)</p>
              <p className="text-2xl font-semibold text-emerald-600">
                {fluency.metrics?.speech_rate}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg text-center border border-emerald-100">
              <p className="text-sm text-gray-600">Pauses</p>
              <p className="text-2xl font-semibold text-emerald-600">
                {fluency.metrics?.pauses}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg text-center border border-emerald-100">
              <p className="text-sm text-gray-600">Filler Words</p>
              <p className="text-2xl font-semibold text-emerald-600">
                {fluency.metrics?.filler_words}
              </p>
            </div>
          </div>

          <div className="grid gap-2 mt-4">
            {Object.entries(fluency.feedback || {}).map(([key, value]) =>
              key !== "tagged_transcript" ? (
                <div
                  key={key}
                  className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm"
                >
                  <p className="text-sm font-semibold text-emerald-700 capitalize">
                    {key.replace(/_/g, " ")}
                  </p>
                  <p className="text-gray-700 text-sm">{value.feedback_text}</p>
                </div>
              ) : null
            )}
          </div>
        </CardContent>
      </Card>

      {/* ========== Reading Metrics ========== */}
      <Card className={cardBase}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <BookOpen className="w-5 h-5 text-purple-500" />
            Reading Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="text-sm text-gray-600">Accuracy</p>
              <p className="text-2xl font-semibold text-purple-600">
                {(reading.accuracy * 100).toFixed(0)}%
              </p>
            </div>
            <div className="text-center bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="text-sm text-gray-600">Completion</p>
              <p className="text-2xl font-semibold text-purple-600">
                {(reading.completion * 100).toFixed(0)}%
              </p>
            </div>
            <div className="text-center bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="text-sm text-gray-600">Speed (WPM)</p>
              <p className="text-2xl font-semibold text-purple-600">
                {reading.speed_wpm.toFixed(1)}
              </p>
            </div>
            <div className="text-center bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="text-sm text-gray-600">Words Read</p>
              <p className="text-2xl font-semibold text-purple-600">
                {reading.words_read}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========== Metadata & Warnings ========== */}
      {(Object.keys(warnings).length > 0 || metadata.predicted_text) && (
        <Card className={cardBase}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-800">
            {Object.entries(warnings).map(([key, value]) => (
              <div key={key}>
                <strong>{key}: </strong>
                {value}
              </div>
            ))}
            {metadata.predicted_text && (
              <div>
                <strong>Predicted Text:</strong> {metadata.predicted_text}
              </div>
            )}
            {metadata.content_relevance && (
              <div>
                <strong>Content Relevance:</strong> {metadata.content_relevance}%
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
