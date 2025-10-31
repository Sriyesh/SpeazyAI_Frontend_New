"use client"

export function LoadingAssessment() {
  return (
    <div className="flex flex-col items-center space-y-6 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin"></div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-gray-800">Analyzing Your Speech...</h3>
        <p className="text-sm text-gray-600">Our AI is evaluating your pronunciation, fluency, and proficiency</p>
      </div>

      <div className="w-full space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Pronunciation Analysis</span>
            <span>25%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full animate-pulse"
              style={{ width: "25%" }}
            ></div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Fluency Assessment</span>
            <span>50%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full animate-pulse"
              style={{ width: "50%" }}
            ></div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Proficiency Scoring</span>
            <span>75%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full animate-pulse"
              style={{ width: "75%" }}
            ></div>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center">This usually takes 5-10 seconds...</p>
    </div>
  )
}
