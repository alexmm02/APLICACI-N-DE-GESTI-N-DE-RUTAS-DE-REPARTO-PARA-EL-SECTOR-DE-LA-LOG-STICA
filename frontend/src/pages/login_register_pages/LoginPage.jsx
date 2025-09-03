import { Card, Input, Button, Label, Container } from "../../components/ui";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signin, errors: loginErrors } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    const user = await signin(data);
    if (user) navigate("/welcome");
  });

  return (
    <Container className="min-h-[calc(100vh-6rem)] flex justify-center items-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        {loginErrors &&
          loginErrors.map((err, index) => (
            <p
              key={index}
              className="bg-red-100 text-red-700 border border-red-300 p-2 mb-4 text-center rounded-md"
            >
              {err}
            </p>
          ))}

        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Log In</h1>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              placeholder="Email address"
              {...register("email", {
                required: true,
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">Email is required</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: true,
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">Password is required</p>
            )}
          </div>

          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Log In
          </Button>

          <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
            <span>Don't have an account?</span>
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Sign Up
            </Link>
          </div>

          <div className="text-center mt-4">
            <Link
              to="/forgot-password"
              className="text-blue-600 font-semibold hover:underline text-sm"
            >
              Forgot your password?
            </Link>
          </div>
        </form>
      </Card>
    </Container>
  );
}

export default LoginPage;
