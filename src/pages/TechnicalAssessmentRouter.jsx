// src/pages/TechnicalAssessmentRouter.jsx
import { useParams } from "react-router-dom";
import TechnicalAssessmentMCQ from "./TechnicalAssessmentMCQ";
import TechnicalAssessmentPlaceholder from "./TechnicalAssessmentPlaceholder";

export default function TechnicalAssessmentRouter() {
  const { id } = useParams();

  // Route to MCQ component for public-speaking, reading-writing, logical-quotient, memory-game, and coding-challenge
  const mcqAssessments = ["public-speaking", "reading-writing", "logical-quotient", "memory-game", "coding-challenge"];

  if (mcqAssessments.includes(id)) {
    return <TechnicalAssessmentMCQ />;
  }

  // Route to placeholder for all other assessments
  return <TechnicalAssessmentPlaceholder />;
}
