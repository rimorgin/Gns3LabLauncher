import PageMeta from "@clnt/components/page-meta";
import { LoginForm } from "@clnt/components/login-form";
import logo from '@clnt/assets/favicon.ico'
import gif from '@clnt/assets/login-image.gif'

export default function LoginPage() {
  return (
    <>
      <PageMeta
        title="Login"
        description="Launcher of gns3 sessions streamlining classroom based learning"
      />
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium">
              <div className="flex h-12 w-12 bg-transparent">
                <img src={logo} alt="gns3logo"/>
              </div>
              Gns3 Lab Launcher
            </a>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <LoginForm />
            </div>
          </div>
        </div>
        <div className="relative hidden bg-stone-300 lg:block">
          <img
            src={gif}
            alt="Image"
            className="absolute inset-0 h-full w-full object-contain brightness-[0.84] grayscale"
          />
        </div>
      </div>
    </>
  );
}
