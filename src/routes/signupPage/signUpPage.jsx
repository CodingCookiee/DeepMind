import './signupPage.css'
import { SignUp } from '@clerk/clerk-react'


const SignUpPage = () => {
    return (
        <div className='h-full flex items-center justify-center'>
           <SignUp path="/sign-up" />
        </div>
    );
};


export default SignUpPage;
