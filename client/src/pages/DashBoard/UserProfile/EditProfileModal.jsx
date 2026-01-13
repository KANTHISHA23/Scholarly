import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  Camera,
  X,
  User,
  Mail,
  Upload,
  Check,
  AlertCircle,
  Lock,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import { uploadImage } from "../../../utils";

const EditProfileModal = ({ isOpen, onClose, user }) => {
  const [previewImage, setPreviewImage] = useState(user?.photoURL);
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { updateProfileFunc } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm();

  // const selectedFile = watch("image");
  const selectedFile = useWatch({ control, name: "image" });

  useEffect(() => {
    if (isOpen && user) {
      reset({
        displayName: user.displayName,
        email: user.email,
        image: null,
      });
      setPreviewImage(user.photoURL);
    }
  }, [isOpen, user, reset]);

  useEffect(() => {
    if (selectedFile && selectedFile[0]) {
      const file = selectedFile[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      return () => URL.revokeObjectURL(imageUrl);
    }
  }, [selectedFile]);

  // Handle Drag and Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setValue("image", files, { shouldDirty: true });
    }
  };

  const onSubmit = async (data) => {
    const imgURL = await uploadImage(data.image?.[0]);
    await updateProfileFunc(data.displayName, imgURL);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open backdrop-blur-sm">
      <div
        className="modal-box w-11/12 max-w-md p-0 overflow-hidden bg-base-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Gradient Background */}
        <div className="relative h-32 bg-primary">
          {/* Pattern Overlay */}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="btn btn-circle btn-sm bg-base-100/20 hover:bg-base-100/40 border-0 absolute right-3 top-3 text-white"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Avatar Section - Overlapping the header */}
        <div className="relative -mt-12 px-6">
          <div
            className={`relative mx-auto w-fit group ${
              isDragging ? "scale-105" : ""
            } transition-transform duration-200`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Avatar Container */}
            <div className="avatar">
              <div
                className={`w-24 h-24 rounded-full ring-4 ring-base-100 shadow-lg overflow-hidden bg-base-200 ${
                  isDragging ? "ring-primary ring-offset-2" : ""
                }`}
              >
                {imageError ? (
                  <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-primary-content text-2xl font-bold">
                    {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                ) : (
                  <img
                    src={previewImage}
                    alt={user?.displayName || "User"}
                    onError={() => setImageError(true)}
                  />
                )}
              </div>
            </div>

            {/* Upload Overlay */}
            <label
              htmlFor="file-upload"
              className={`absolute inset-0 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "bg-primary/80"
                  : "bg-black/0 hover:bg-black/50 opacity-0 hover:opacity-100"
              }`}
            >
              <Camera className="text-white size-6 mb-1" />
              <span className="text-white text-xs font-medium">
                {isDragging ? "Drop here" : "Change"}
              </span>
            </label>

            {/* Camera Badge */}
            <div
              className="absolute -bottom-1 -right-1 bg-primary text-primary-content rounded-full p-2 shadow-lg border-2 border-base-100"
            >
              <Camera className="size-4" />
            </div>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              {...register("image")}
            />
          </div>

          {/* Drag Drop Hint */}
          <p className="text-center text-xs text-base-content/50 mt-3">
            Click or drag & drop to upload
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 pt-4 space-y-5">
          {/* Name Input */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-semibold flex items-center gap-2">
                <User className="size-4 text-primary" />
                Full Name
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your full name"
                className={`input input-bordered w-full pl-4 pr-10 focus:input-primary transition-all ${
                  errors.displayName
                    ? "input-error focus:input-error"
                    : "focus:border-primary"
                }`}
                {...register("displayName", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
              />
              {/* Validation Icon */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {errors.displayName ? (
                  <AlertCircle className="size-5 text-error" />
                ) : watch("displayName")?.length >= 2 ? (
                  <Check className="size-5 text-success" />
                ) : null}
              </div>
            </div>
            {errors.displayName && (
              <label className="label py-1">
                <span className="label-text-alt text-error flex items-center gap-1">
                  <AlertCircle className="size-3" />
                  {errors.displayName.message}
                </span>
              </label>
            )}
          </div>

          {/* Email Input (Disabled) */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-semibold flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                Email Address
              </span>
              <span className="label-text-alt">
                <span className="badge badge-ghost badge-sm gap-1">
                  <Lock className="size-4 text-primary" />
                  Locked
                </span>
              </span>
            </label>
            <input
              type="email"
              disabled
              className="input input-bordered w-full bg-base-200/50 text-base-content/60 cursor-not-allowed"
              {...register("email")}
            />
            <label className="label py-1">
              <span className="label-text-alt text-base-content/50">
                Contact support to change your email
              </span>
            </label>
          </div>

          {/* Divider */}
          <div className="divider my-2"></div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn flex-1 gap-2"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary flex-1 gap-2 ${
                !isDirty ? "btn-disabled" : ""
              }`}
              disabled={isSubmitting || !isDirty}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>

          {/* Helper Text */}
          {!isDirty && (
            <p className="text-center text-xs text-base-content/50">
              Make changes to enable save button
            </p>
          )}
        </form>
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop bg-black/60" onClick={onClose}></div>
    </div>
  );
};

export default EditProfileModal;
