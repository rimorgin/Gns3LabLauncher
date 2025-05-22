import PageMeta from "@clnt/components/page-meta";
import { LoginForm } from "@clnt/components/login-form";

export default function LoginPage() {
  return (
    <>
      <PageMeta
        title="Login"
        description="Launcher of gns3 sessions streamlining classroom based learning"
      />
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginForm />
        </div>
      </div>
    </>
  );
}
