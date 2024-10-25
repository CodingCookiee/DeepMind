import './signinPage.css'
import { SignIn } from '@clerk/clerk-react'



const SignInPage = () => {
    return (
        <div className='signinPage'>
        <SignIn path="/sign-in" />
        </div>
    );
};

export default SignInPage;

