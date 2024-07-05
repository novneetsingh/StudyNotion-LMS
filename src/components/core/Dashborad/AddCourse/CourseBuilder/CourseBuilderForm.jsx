import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { resetCourseState } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../Common/IconBtn";
import Upload from "../Upload";
import { createLecture } from "../../../../../services/operations/courseDetailsAPI";
import { Link } from "react-router-dom";

export default function CourseBuilderForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Handle form submission to create a new lecture
  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();

    formData.append("courseId", course._id); // Assuming course._id is available
    formData.append("title", data.lectureTitle);
    formData.append("video", data.lectureVideo); // Assuming lectureVideo is from Upload component

    try {
      await createLecture(formData, token);
    } catch (error) {
      console.error("Error creating lecture:", error);
    }
      setLoading(false);
  };

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Upload component for video */}
        <Upload
          name="lectureVideo"
          label="Lecture Video"
          register={register}
          setValue={setValue}
          errors={errors}
          video={true}
        />
        {/* Lecture Title */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
            Lecture Title <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="lectureTitle"
            placeholder="Enter Lecture Title"
            {...register("lectureTitle", { required: true })}
            className="form-style w-full"
          />
          {errors.lectureTitle && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Lecture title is required
            </span>
          )}
        </div>
        {/* Submit Button */}
        <div className="flex justify-end">
          <IconBtn
            type="submit"
            disabled={loading}
            text={loading ? "Loading..." : "Add Lecture"}
          />
        </div>
      </form>

      {/* Next Button */}
      <Link
        to={"/dashboard/my-courses"}
        className="flex justify-end gap-x-3"
        onClick={() => dispatch(resetCourseState())} // Dispatch action outside rendering cycle
      >
        <IconBtn disabled={loading} text="Save">
          <MdNavigateNext />
        </IconBtn>
      </Link>
    </div>
  );
}
