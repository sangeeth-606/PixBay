import { useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    handleRedirectCallback()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error handling redirect callback:", error);
        navigate("/");
      });
  }, [handleRedirectCallback, navigate]);

  return <div>Loading...</div>;
}