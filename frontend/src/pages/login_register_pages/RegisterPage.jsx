import { Button, Card, Container, Input, Label } from "../../components/ui";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup, errors: signupErrors, message } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    await signup(data);
    if (!signupErrors) {
      setTimeout(() => navigate("/login"), 3000);
    }
  });

  return (
    <Container className="min-h-[calc(100vh-6rem)] flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        {signupErrors &&
          signupErrors.map((err, i) => (
            <p
              key={i}
              className="bg-red-100 text-red-700 border border-red-300 p-2 mb-4 text-center rounded-md"
            >
              {err}
            </p>
          ))}

        {message && (
          <p className="bg-green-100 text-green-700 border border-green-300 p-2 mb-4 text-center rounded-md">
            {message}
          </p>
        )}

        <h3 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Account</h3>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              placeholder="Enter your full name"
              {...register("name", {
                required: "Name is required",
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              placeholder="Enter a password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="companyCode">Company Code (optional)</Label>
            <Input
              placeholder="Enter company code if you have one"
              {...register("companyCode")}
            />
          </div>

          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Sign Up
          </Button>

          <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
            <span>Already have an account?</span>
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Log In
            </Link>
          </div>
        </form>
      </Card>
    </Container>
  );
}

export default RegisterPage;
