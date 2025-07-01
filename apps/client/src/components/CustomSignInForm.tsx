import React from "react";
import { useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface CustomSignInFormProps {
  hideHeading?: boolean;
}

const CustomSignInForm: React.FC<CustomSignInFormProps> = ({ hideHeading }) => {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate("/sign-in");
  };

  return (
    <>
      {!hideHeading && (
        <>
          <h2 className="text-lg font-medium mb-1 text-gray-900 tracking-tight">
            Sign in to Pixbay
          </h2>
          <p className="text-gray-400 mb-5 text-xs font-normal">
            Welcome back! To continue, sign in to your account
          </p>
        </>
      )}
      <button
        type="button"
        className="w-full bg-emerald-500 text-white py-2 rounded-md font-medium hover:bg-emerald-600 transition text-sm shadow"
        onClick={handleSignInClick}
      >
        Sign in
      </button>
    </>
  );
};

export default CustomSignInForm;
