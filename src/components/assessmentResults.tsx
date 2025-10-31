import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AssessmentResultsProps {
  data: any;
  onClose: () => void;
}

export const AssessmentResults = React.forwardRef<HTMLDivElement, AssessmentResultsProps>(
  ({ data, onClose }, ref) => {
    const pronunciation = data?.pronunciation || {};
    const overall = data?.overall || {};
    const fluency = data?.fluency || {};

    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent
          ref={ref}
          className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 border-0 shadow-2xl backdrop-blur-md"
        >
          {/* Accessibility-friendly title */}
          <DialogTitle className="sr-only">Speech Assessment Results</DialogTitle>

          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Main content */}
          <div className="pt-6 pb-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Your Speech Assessment Results
              </h2>
              <p className="text-gray-600">
                Detailed analysis of your pronunciation, fluency, and proficiency
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {overall.overall_score || 0}
                </div>
                <p className="text-sm text-gray-700">Overall Score</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-cyan-600 mb-2">
                  {pronunciation.overall_score || 0}
                </div>
                <p className="text-sm text-gray-700">Pronunciation</p>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-teal-600 mb-2">
                  {fluency.overall_score || 0}
                </div>
                <p className="text-sm text-gray-700">Fluency</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

AssessmentResults.displayName = "AssessmentResults";
