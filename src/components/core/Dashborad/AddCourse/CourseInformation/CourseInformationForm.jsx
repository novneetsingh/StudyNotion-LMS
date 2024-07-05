import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  addCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse, setStep } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../Common/IconBtn";
import Upload from "../Upload";

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const categories = await fetchCourseCategories();
      if (categories.length > 0) {
        setCourseCategories(categories);
      }
      setLoading(false);
    };
    getCategories();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc);
    formData.append("price", data.coursePrice);
    formData.append("category", data.courseCategory);
    formData.append("thumbnailImage", data.courseImage);

    try {
      const result = await addCourseDetails(formData, token);
      if (result) {
        dispatch(setStep(2)); // Update step to 2 in Redux state
        dispatch(setCourse(result)); // Save course data in Redux state
      }
    } catch (error) {
      console.error("Error adding course details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">Course Information</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Course Title */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="courseTitle">
            Course Title <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="courseTitle"
            placeholder="Enter Course Title"
            {...register("courseTitle", { required: true })}
            className="form-style w-full"
          />
          {errors.courseTitle && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Course title is required
            </span>
          )}
        </div>

        {/* Course Short Description */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
            Course Short Description <sup className="text-pink-200">*</sup>
          </label>
          <textarea
            id="courseShortDesc"
            placeholder="Enter Description"
            {...register("courseShortDesc", { required: true })}
            className="form-style resize-x-none min-h-[130px] w-full"
          />
          {errors.courseShortDesc && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Course Description is required
            </span>
          )}
        </div>

        {/* Course Price */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="coursePrice">
            Course Price <sup className="text-pink-200">*</sup>
          </label>
          <div className="relative">
            <input
              id="coursePrice"
              placeholder="Enter Course Price"
              {...register("coursePrice", {
                required: true,
                valueAsNumber: true,
                pattern: {
                  value: /^(0|[1-9]\d*)(\.\d+)?$/,
                },
              })}
              className="form-style w-full !pl-12"
            />
            <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
          </div>
          {errors.coursePrice && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Course Price is required
            </span>
          )}
        </div>

        {/* Course Category */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="courseCategory">
            Course Category <sup className="text-pink-200">*</sup>
          </label>
          <select
            {...register("courseCategory", { required: true })}
            defaultValue=""
            id="courseCategory"
            className="form-style w-full"
          >
            <option value="" disabled>
              Choose a Category
            </option>
            {!loading &&
              courseCategories?.map((category, indx) => (
                <option key={indx} value={category?._id}>
                  {category?.name}
                </option>
              ))}
          </select>
          {errors.courseCategory && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Course Category is required
            </span>
          )}
        </div>

        {/* Course Thumbnail Image */}
        <Upload
          name="courseImage"
          label="Course Thumbnail"
          register={register}
          setValue={setValue}
          errors={errors}
        />

        {/* Next Button */}
        <div className="flex justify-end gap-x-2">
          <IconBtn type="submit" disabled={loading} text="Next">
            <MdNavigateNext />
          </IconBtn>
        </div>
      </form>
    </div>
  );
}
