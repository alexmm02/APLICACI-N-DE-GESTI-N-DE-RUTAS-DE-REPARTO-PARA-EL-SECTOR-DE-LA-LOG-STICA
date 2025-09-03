import { Card, Label, Button } from "../../components/ui";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useSupport } from "../../context/SupportContext";

function SupportPage() {
  const { sendSupportMessage, successMessage, errorMessage, loading } = useSupport();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      category: "Technical error",
      message: "",
    },
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = async (data) => {
    await sendSupportMessage(data);
    if (!errorMessage) {
      reset();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 text-gray-800 min-h-[calc(100vh-5rem)] px-4 py-8">
      <Card className="w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Support</h2>

        {/* Success or error messages */}
        {errorMessage && (
          <p className="bg-red-100 text-red-700 border border-red-300 p-2 rounded-md text-center mb-4">
            {errorMessage}
          </p>
        )}
        {showSuccess && (
          <p className="bg-green-100 text-green-700 border border-green-300 p-2 rounded-md text-center mb-4">
            ✅ Message sent successfully
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="category" className="text-base">Category</Label>
            <select
              {...register("category")}
              className="w-full mt-1 p-3 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Error técnico">🛠 Technical error</option>
              <option value="Sugerencia">💡 Suggestion</option>
              <option value="Pregunta">❓ Question</option>
              <option value="Otro">🔍 Other</option>
            </select>

          </div>

          <div>
            <Label htmlFor="message" className="text-base">Message</Label>
            <textarea
              {...register("message", { required: "Message is required" })}
              placeholder="Describe your issue or suggestion..."
              className="w-full mt-1 p-3 border border-gray-300 rounded-md h-32 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
            )}
          </div>

          <Button
            className="w-full text-lg py-3 bg-blue-500 hover:bg-blue-600 text-white"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default SupportPage;
