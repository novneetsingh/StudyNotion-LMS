import React from "react";
import HighlightText from "./HighlightText";
import CTAButton from "../../../components/core/HomePage/Button";
import KnowYourProgressImage from "../../../assets/Images/Know_your_progress.png";
import CompareWithOthersImage from "../../../assets/Images/Compare_with_others.svg";
import PlanYourLessonsImage from "../../../assets/Images/Plan_your_lessons.svg";

const LearningLanguageSection = () => {
  return (
    <div>
      {/* Section Title */}
      <div className="text-4xl font-semibold text-center my-10">
        Your swiss knife for
        <HighlightText text={"learning any language"} />
      </div>

      {/* Section Description */}
      <div className="text-center text-richblack-700 font-medium lg:w-[75%] mx-auto leading-6 text-base mt-3">
        Using spin making learning multiple languages easy. with 20+ languages
        realistic voice-over, progress tracking, custom schedule and more.
      </div>

      {/* Images */}
      <div className="flex flex-col lg:flex-row items-center justify-center mt-20 lg:mt-0">
        {/* Know Your Progress Image */}
        <img
          src={KnowYourProgressImage}
          alt="Know Your Progress"
          className="object-contain lg:-mr-32 -mt-12 lg:mt-0"
        />

        {/* Compare With Others Image */}
        <img
          src={CompareWithOthersImage}
          alt="Compare With Others"
          className="object-contain lg:-mb-10 lg:-mt-0 -mt-12"
        />

        {/* Plan Your Lessons Image */}
        <img
          src={PlanYourLessonsImage}
          alt="Plan Your Lessons"
          className="object-contain lg:-ml-36 lg:-mt-5 -mt-12"
        />
      </div>

      {/* CTA Button */}
      <div className="w-fit mx-auto lg:mb-20 mb-8 mt-5">
        <CTAButton active={true} linkto={"/signup"}>
          <div className="">Learn More</div>
        </CTAButton>
      </div>
    </div>
  );
};

export default LearningLanguageSection;
