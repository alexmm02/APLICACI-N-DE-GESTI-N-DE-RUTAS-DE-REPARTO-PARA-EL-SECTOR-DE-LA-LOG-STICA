import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOwnerCompanies } from "../../context/ownerContext/OwnerCompanyContext"; 
import { Card, Input, Label, Button } from "../../components/ui";

function CreateCompanyPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const { createCompany } = useOwnerCompanies(); 

  const onSubmit = async (data) => {
    setServerError("");
    setSuccessMessage("");

    const res = await createCompany(data); 

    console.log("🧪 Result of createCompany:", res);

    if (res?.company?.join_code) {
      setSuccessMessage(`✅ Company created successfully. Code: ${res.company.join_code}`);
    } else {
      setServerError("❌ Error creating the company");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      <Card className="w-full max-w-xl mx-auto p-8 shadow-lg border border-gray-200 rounded-xl bg-white">
        <h1 className="text-3xl font-bold text-center mb-6">🏢 Create Company</h1>

        {serverError && <p className="text-red-500 text-center mb-4">{serverError}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="name">Company Name</Label>
            <Input
              type="text"
              {...register("name", { required: "Name is required" })}
              placeholder="e.g., FastRoute Logistics"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div className="flex justify-between gap-4 mt-6">
            <Button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 w-full"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 w-full">
              Create Company
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default CreateCompanyPage;
