import { Card, Input, Label, Button } from "../../components/ui";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ChangePasswordPage() {
  const navigate = useNavigate();
  const { changePassword, message, errors } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors: formErrors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [localMessage, setLocalMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await changePassword(data.oldPassword, data.newPassword);
      setLocalMessage("✅ Password successfully updated.");
      reset();
      setTimeout(() => navigate("/profile"), 2000);
    } catch {
      setLocalMessage("❌ Error changing the password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <Card className="w-full max-w-xl mx-auto p-8 bg-white shadow-lg border border-gray-200 rounded-xl">
        <h2 className="text-3xl font-bold text-center mb-6">🔒 Change Password</h2>

        {(errors && (
          <p className="text-red-500 text-center mb-2">
            {Array.isArray(errors) ? errors[0] : errors}
          </p>
        )) ||
          (localMessage && (
            <p
              className={`text-center mb-2 ${
                localMessage.startsWith("✅") ? "text-green-500" : "text-red-500"
              }`}
            >
              {localMessage}
            </p>
          )) ||
          (message && (
            <p className="text-green-500 text-center mb-2">{message}</p>
          ))}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="oldPassword">Current Password</Label>
            <Input
              type="password"
              placeholder="Enter your current password"
              {...register("oldPassword", { required: "Current password is required" })}
            />
            {formErrors.oldPassword && (
              <p className="text-red-500 text-sm mt-1">{formErrors.oldPassword.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              type="password"
              placeholder="Enter your new password"
              {...register("newPassword", {
                required: "New password is required",
                minLength: { value: 6, message: "Must be at least 6 characters" },
              })}
            />
            {formErrors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{formErrors.newPassword.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              type="password"
              placeholder="Re-enter the new password"
              {...register("confirmPassword", {
                required: "You must confirm the new password",
                validate: (value) =>
                  value === watch("newPassword") || "Passwords do not match",
              })}
            />
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex justify-between gap-4 mt-6">
            <Button
              className="bg-blue-500 hover:bg-blue-600 w-full"
              disabled={loading}
              type="submit"
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
            <Button
              className="bg-gray-500 hover:bg-gray-600 w-full"
              type="button"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ChangePasswordPage;
