import './signupPage.css'
import { SignUp } from '@clerk/clerk-react'


const SignUpPage = () => {
    return (
        <div className='flex items-center justify-center overflow-auto'>
           <SignUp path="/sign-up" signInUrl= "sign-in"  />
        </div>
    );
};


export default SignUpPage;
