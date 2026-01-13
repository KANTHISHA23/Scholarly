import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import {
  FileText,
  Save,
  ArrowLeft,
  Loader2,
  User,
  GraduationCap,
} from "lucide-react";
import toast from "react-hot-toast";
import Spinner from "../../../../components/Spinner/Spinner";

const EditApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { data: application, isLoading } = useQuery({
    queryKey: ["application", id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/applications/${id}`);
      return data;
    },
  });

  useEffect(() => {
    if (application) {
      setValue("phone", application.phone);
      setValue("photoURL", application.photoURL);
      setValue("address", application.address);
      setValue("gender", application.gender);
      setValue("sscResult", application.sscResult);
      setValue("hscResult", application.hscResult);
      setValue("studyGap", application.studyGap);
      setValue("universityName", application.universityName);
      setValue("scholarshipCategory", application.scholarshipCategory);
      setValue("subjectCategory", application.subjectCategory);
    }
  }, [application, setValue]);

  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const { data } = await axiosSecure.patch(
        `/applications/${id}`,
        updatedData
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-applications"]);
      toast.success("Application updated successfully!");
      navigate("/dashboard/my-application");
    },
    onError: () => {
      toast.error("Failed to update application");
    },
  });

  const onSubmit = (data) => {
    const updatedFields = {
      phone: data.phone,
      photo: data.photo,
      address: data.address,
      gender: data.gender,
      sscResult: data.sscResult,
      hscResult: data.hscResult,
      studyGap: data.studyGap,
    };
    updateMutation.mutate(updatedFields);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-circle"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="text-primary" />
            Edit Application
          </h1>
          <p className="text-gray-500 mt-1">
            Update your details for {application?.universityName}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card bg-base-100 shadow-md border border-base-200">
          <div className="card-body">
            <h3 className="card-title text-base text-gray-500 uppercase">
              Scholarship Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="label">
                  <span className="label-text font-medium">University</span>
                </label>
                <input
                  type="text"
                  {...register("universityName")}
                  className="input input-bordered bg-base-200 w-full"
                  disabled
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="label">
                  <span className="label-text font-medium">Subject</span>
                </label>
                <input
                  type="text"
                  {...register("subjectCategory")}
                  className="input input-bordered bg-base-200 w-full"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-lg flex items-center gap-2 mb-4">
              <User className="text-primary size-5" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <input
                  type="tel"
                  {...register("phone", { required: "Phone is required" })}
                  className="input input-bordered focus:border-primary focus:outline-none w-full"
                />
                {errors.phone && (
                  <span className="text-error text-xs">
                    {errors.phone.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="label">
                  <span className="label-text">Photo URL</span>
                </label>
                <input
                  type="url"
                  {...register("photoURL", {
                    required: "Photo URL is required",
                  })}
                  className="input input-bordered focus:border-primary focus:outline-none w-full"
                />
                {errors.photoURL && (
                  <span className="text-error text-xs">
                    {errors.photoURL.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="label">
                  <span className="label-text">Address</span>
                </label>
                <input
                  type="text"
                  {...register("address", { required: "Address is required" })}
                  className="input input-bordered focus:border-primary focus:outline-none w-full"
                />
                {errors.address && (
                  <span className="text-error text-xs">
                    {errors.address.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-lg flex items-center gap-2 mb-4">
              <GraduationCap className="text-primary size-5" />
              Academic Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="label">
                  <span className="label-text">SSC Result (GPA)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("sscResult", {
                    required: "Required",
                    min: 0,
                    max: 5,
                  })}
                  className="input input-bordered focus:border-primary focus:outline-none w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="label">
                  <span className="label-text">HSC Result (GPA)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("hscResult", {
                    required: "Required",
                    min: 0,
                    max: 5,
                  })}
                  className="input input-bordered focus:border-primary focus:outline-none w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="label">
                  <span className="label-text">Gender</span>
                </label>
                <select
                  {...register("gender")}
                  className="select select-bordered focus:border-primary focus:outline-none w-full"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="label">
                  <span className="label-text">Study Gap</span>
                </label>
                <select
                  {...register("studyGap")}
                  className="select select-bordered focus:border-primary focus:outline-none w-full"
                >
                  <option value="None">None</option>
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                  <option value="3+ Years">3+ Years</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 bg-base-100 shadow-md p-5 rounded-md">
          <button type="button" onClick={() => navigate(-1)} className="btn">
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary min-w-[150px]"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <Loader2 className="animate-spin size-5" />
            ) : (
              <>
                <Save className="size-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditApplication;
