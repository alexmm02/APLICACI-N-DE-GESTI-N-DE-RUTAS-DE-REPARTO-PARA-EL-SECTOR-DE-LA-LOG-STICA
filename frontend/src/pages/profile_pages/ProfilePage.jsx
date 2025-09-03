import { Card, Input, Label, Button } from "../../components/ui";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();

  const {
    user,
    updateProfile,
    errors: authErrors,
    getMyCompany,
    leaveCompany,
    deleteAccount,
    signout,
  } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      companyCode: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [companyName, setCompanyName] = useState(null);

  useEffect(() => {
    const loadUserAndCompany = async () => {
      if (user) {
        setValue("name", user.name || "");
        setValue("email", user.email || "");
        setValue("companyCode", "");

        if (user.company_id) {
          try {
            const company = await getMyCompany(user.company_id);
            if (company?.name) setCompanyName(company.name);
          } catch (err) {
            console.error("Error getting company:", err);
          }
        }
      }
    };
    loadUserAndCompany();
  }, [user, setValue, getMyCompany]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      await updateProfile(data);
      setSuccessMessage("Profile updated successfully!");
    } catch {
      console.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  });

  const handleLeaveCompany = async () => {
    try {
      await leaveCompany();
      window.location.reload();
    } catch (error) {
      console.error("Error leaving company:", error);
    }
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirm) return;

    try {
      await deleteAccount();
      await signout();
      navigate("/signin");
    } catch (err) {
      console.error("Error deleting account:", err);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 px-4 sm:px-6 py-8 min-h-[calc(100vh-5rem)]">
      <div className="w-full max-w-3xl mx-auto">
        <Card className="w-full max-w-md sm:max-w-lg md:max-w-3xl">
          {authErrors?.length > 0 && (
            <div className="mb-4">
              {authErrors.map((error, i) => (
                <p
                  key={i}
                  className="bg-red-100 text-red-700 border border-red-300 p-2 rounded text-center"
                >
                  {error}
                </p>
              ))}
            </div>
          )}

          {successMessage && (
            <p className="bg-green-100 text-green-700 border border-green-300 p-2 rounded text-center mb-4">
              {successMessage}
            </p>
          )}

          <h2 className="text-3xl font-bold mb-6 text-center">Profile</h2>

          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                placeholder="Your Name"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                placeholder="Email"
                disabled
                {...register("email")}
                className="cursor-not-allowed bg-gray-100 text-gray-500"
              />
            </div>

            {user?.company_id && companyName ? (
              <div>
                <Label>Company</Label>
                <p className="mt-1 p-3 bg-gray-100 border border-gray-200 rounded-md font-medium">
                  {companyName}
                </p>
                <Button
                  type="button"
                  onClick={handleLeaveCompany}
                  className="mt-3 bg-red-500 hover:bg-red-600 text-white"
                >
                  Leave company
                </Button>
              </div>
            ) : (
              <div>
                <Label htmlFor="companyCode">Company Code (optional)</Label>
                <Input
                  type="text"
                  placeholder="Company code"
                  {...register("companyCode")}
                />
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-4">
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg py-3"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Profile"}
              </Button>

              <Button
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white text-lg py-3"
                onClick={() => navigate("/change-password")}
              >
                Change Password
              </Button>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3"
                onClick={handleDeleteAccount}
              >
                ❌ Delete Account
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default ProfilePage;
