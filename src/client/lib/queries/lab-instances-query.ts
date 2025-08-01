import axios from "@clnt/lib/axios";
import { useQuery } from "@tanstack/react-query";

const listGns3Containers = async () => {
  return (await axios.get("/gns3labs/list-userinfo")).data.gns3Containers;
};

export const useGns3Containers = () => {
  return useQuery({
    queryKey: ["gns3-containers"],
    queryFn: listGns3Containers,
  });
};
