import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Spinner from "../../components/Spinner/Spinner";
import Swal from "sweetalert2";

const ApplyScholarship = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { data: scholarship, isLoading } = useQuery({
    queryKey: ["scholarship", id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/scholarship/${id}`);
      return data.details;
    },
  });


  useEffect(() => {
    if (user && scholarship) {
      setValue("userName", user.displayName);
      setValue("userEmail", user.email);
      setValue("scholarshipId", scholarship._id);
      setValue("universityName", scholarship.universityName);
      setValue("scholarshipCategory", scholarship.scholarshipCategory);
      setValue("subjectCategory", scholarship.subjectCategory);
      setValue("degree", scholarship.degree);
      setValue("scholarshipAmount", scholarship.scholarshipAmount);
      setValue("serviceCharge", scholarship.serviceCharge);
    }
  }, [user, scholarship, setValue]);

  const { mutate: applyMutation } = useMutation({
    mutationFn: async (applicationData) => {
      const { data } = await axiosSecure.post(
        "/create-checkout-session",
        applicationData
      );
      return data;
    },
  });

  const onSubmit = (data) => {
    const applicationData = {
      ...data,
      scholarshipId: id,
      scholarshipName: scholarship?.scholarshipName,
      universityImage: scholarship?.universityImage,
      userEmail: user?.email,
      userName: user?.displayName,
      universityName: scholarship?.universityName,
      universityCity: scholarship?.universityCity,
      universityCountry: scholarship?.universityCountry,
      scholarshipCategory: scholarship?.scholarshipCategory,
      subjectCategory: scholarship?.subjectCategory,
      degree: scholarship?.degree,
      scholarshipAmount: scholarship?.scholarshipAmount,
      serviceCharge: scholarship?.serviceCharge,
      totalPrice: scholarship?.scholarshipAmount + scholarship?.serviceCharge,
    };

    applyMutation(applicationData);
  };

  if (isLoading || !scholarship) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">
          Scholarship Application
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Read-Only Scholarship Info */}
        <div className="card bg-base-100 shadow border border-base-200">
          <div className="card-body">
            <h3 className="card-title text-sm text-gray-500 uppercase mb-4">
              Applying For
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 w-full">
                <label className="label">
                  <span className="label-text">University</span>
                </label>
                <input
                  type="text"
                  value={scholarship?.universityName || ""}
                  disabled
                  className="input input-bordered bg-base-200 w-full"
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label className="label">
                  <span className="label-text">Degree</span>
                </label>
                <input
                  type="text"
                  value={scholarship?.degree || ""}
                  disabled
                  className="input input-bordered bg-base-200 w-full"
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <input
                  type="text"
                  value={scholarship?.scholarshipCategory || ""}
                  disabled
                  className="input input-bordered bg-base-200 w-full"
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label className="label">
                  <span className="label-text">Total Fees To Pay</span>
                </label>
                <input
                  type="text"
                  value={`$${
                    (scholarship?.scholarshipAmount || 0) +
                    (scholarship?.serviceCharge || 0)
                  }`}
                  disabled
                  className="input input-bordered bg-base-200 font-bold text-primary w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Applicant Details Form (The missing part!) */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title flex items-center gap-2">
              <User className="size-5 text-primary" /> Applicant Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Phone */}
              <div className="flex flex-col gap-1 w-full">
                <label className="label">
                  <span className="label-text">Phone Number *</span>
                </label>
                <input
                  minLength={11}
                  maxLength={11}
                  type="tel"
                  placeholder="+880..."
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  className="input input-bordered focus:outline-none focus:border-primary w-full"
                />
                {errors.phone && (
                  <span className="text-error text-xs">
                    {errors.phone.message}
                  </span>
                )}
              </div>

              {/* Photo */}
              <div className="flex flex-col gap-1 w-full">
                <label className="label">
                  <span className="label-text">Photo URL *</span>
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  {...register("photoURL", {
                    required: "Photo URL is required",
                  })}
                  className="input input-bordered focus:outline-none w-full focus:border-primary"
                />
                {errors.photoURL && (
                  <span className="text-error text-xs">
                    {errors.photoURL.message}
                  </span>
                )}
              </div>

              {/* Address */}
              <div className="flex flex-col gap-1 w-full md:col-span-2">
                <label className="label">
                  <span className="label-text">
                    Address (Village, District, Country) *
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123 Street, Dhaka, Bangladesh"
                  {...register("address", { required: "Address is required" })}
                  className="input input-bordered focus:outline-none focus:border-primary w-full"
                />
                {errors.address && (
                  <span className="text-error text-xs">
                    {errors.address.message}
                  </span>
                )}
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-1 w-full">
                <label className="label">
                  <span className="label-text">Gender *</span>
                </label>
                <select
                  {...register("gender", { required: "Gender is required" })}
                  className="select select-bordered w-full focus:outline-none focus:border-primary"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <span className="text-error text-xs">
                    {errors.gender.message}
                  </span>
                )}
              </div>

              {/* Study Gap */}
              <div className="flex flex-col gap-1 w-full">
                <label className="label">
                  <span className="label-text">Study Gap</span>
                </label>
                <select
                  {...register("studyGap")}
                  className="select select-bordered w-full focus:outline-none focus:border-primary"
                >
                  <option value="None">None</option>
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                  <option value="3+ Years">3+ Years</option>
                </select>
              </div>
            </div>

            <div className="divider">Academic Info</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 w-full">
                <label className="label">
                  <span className="label-text">SSC Result (GPA) *</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("sscResult", { required: "Required" })}
                  className="input input-bordered focus:outline-none w-full focus:border-primary"
                />
                {errors.sscResult && (
                  <span className="text-error text-xs">
                    {errors.sscResult.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label className="label">
                  <span className="label-text">HSC Result (GPA) *</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("hscResult", { required: "Required" })}
                  className="input input-bordered focus:outline-none w-full focus:border-primary"
                />
                {errors.hscResult && (
                  <span className="text-error text-xs">
                    {errors.hscResult.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary btn-lg min-w-[200px]"
          >
              <>
                Applying <Loader2 className="size-5 animate-spin" />
              </>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyScholarship;
