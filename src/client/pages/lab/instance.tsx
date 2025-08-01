import React from "react";
import { Navigate, useLocation } from "react-router";

export default function InstancePageRoute() {
  const location = useLocation();
  const labInstanceIpAddress = location.state?.labInstanceAddress;

  if (!labInstanceIpAddress) return <Navigate to={"/errorPage"} />;

  return (
    <iframe
      src={`https://${labInstanceIpAddress}:3080`}
      className="w-full h-full"
      title="Lab Instance"
    />
  );
}
