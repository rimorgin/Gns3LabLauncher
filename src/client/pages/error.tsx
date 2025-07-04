import { NotFoundIcon } from "@clnt/components/common/svg-icons";
import { Button } from "@clnt/components/ui/button";
import { useNavigate } from "react-router";

export default function ErrorPage() {
  const navigate = useNavigate();
  const handleBack = () => navigate("/");
  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <NotFoundIcon />
      <Button className="scale-150" onClick={handleBack}>
        Go Back
      </Button>
    </div>
  );
}
