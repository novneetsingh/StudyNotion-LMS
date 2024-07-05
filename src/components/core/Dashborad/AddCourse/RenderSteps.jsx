import { useSelector } from "react-redux";
import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm";
import CourseInformationForm from "./CourseInformation/CourseInformationForm";

export default function RenderSteps() {
  const { step } = useSelector((state) => state.course);

  return (
    <div>
      {/* Render specific component based on current step */}
      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
    </div>
  );
}
