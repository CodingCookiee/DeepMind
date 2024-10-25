import './signupPage.css'
import { SignUp } from '@clerk/clerk-react'


const SignUpPage = () => {
    return (
        <div className='signupPage'>
           <SignUp path="/sign-up" />
        </div>
    );
};


export default SignUpPage;
