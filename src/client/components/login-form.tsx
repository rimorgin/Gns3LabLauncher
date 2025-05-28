import { useState } from 'react'
import { cn } from "@clnt/lib/utils"
import { Button } from "@clnt/components/ui/button"
import { Input } from "@clnt/components/ui/input"
import { Label } from "@clnt/components/ui/label"
import { useLoading } from "@clnt/hooks/use-loading";
import { LoginFormValues, useUserStore } from "@clnt/lib/store/user-store";
import { IconBrandWindowsFilled, IconEye, IconEyeClosed } from '@tabler/icons-react'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [form, setForm] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const { loginUser } = useUserStore();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [ showPassword, setShowPassword ] = useState<boolean>(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLoginLocal = async (e: React.FormEvent) => {
    e.preventDefault();
    startLoading();

    try {
      await loginUser(form, 'local');
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      stopLoading();
    }
  };

  const handleLoginMicrosoft = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(form, "microsoft");
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  return (
    <form
      onSubmit={handleLoginLocal}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="gns3@user.net"
            required
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              data-password='{
                "target": "#password"
              }'
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md dark:text-neutral-600"
            >
              {showPassword ? (
                <IconEye className="text-blue-600" />
              ) : (
                <IconEyeClosed />
              )}
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in" : "Login"}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button
          onClick={handleLoginMicrosoft}
          variant="default"
          className="w-full"
        >
          <IconBrandWindowsFilled />
          Login with Microsoft
        </Button>
      </div>
      {/* <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div> */}
    </form>
  );
}
