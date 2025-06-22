import notFoundSvg from "@clnt/assets/not-found.svg";
import { Button } from "@clnt/components/ui/button";
import { useUser } from "@clnt/lib/auth";
import { useNavigate } from "react-router";

export default function ErrorPage() {
  const navigate = useNavigate()
  const handleBack = () => navigate('/')
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <img src={notFoundSvg} alt="not-found" />
      <Button className="scale-150" onClick={handleBack}>Go Back</Button>
    </div>
  );
}
