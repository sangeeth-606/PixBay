import { SignedIn, SignedOut, SignInButton, UserButton, } from "@clerk/clerk-react";

function SignIn() {
//   const { getToken } = useAuth();

//   const logToken = async () => {
//     const token = await getToken();
//     console.log('Clerk Session Token:', token);
//   };

//   logToken(); // Call it to log the token

  return (
   
      
        
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
     
  
  );
}

export default  SignIn;