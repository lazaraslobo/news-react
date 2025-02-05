import React, {useState} from 'react';
import {ProgressComponent} from "../../components/progress";
import {InputBoxComponent} from "../../components/user-controlls/input-box";
import {ButtonComponent} from "../../components/user-controlls/button";
import pagePaths from "../../routes/page-paths";
import { Link} from "react-router-dom";
import {CreateAccountType} from "../../interfaces-types/UserAuthTypes";
import {LogoHeadingCardComponent} from "../../components/logo-heading-card";
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import useAuthActions from '../../hooks/useAuthActions';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './styles.scss';

const defaultInputsValue: CreateAccountType = {
    fullName: {
        label: "Enter Name",
        value: "",
        hasError: false
    },
    email: {
        label: "Enter Email",
        value: "",
        hasError: false
    },
    password: {
        label: "Enter Password",
        value: "",
        hasError: false
    }
}

export const SignupPage: React.FC = () => {
    const authState = useSelector((state: RootState) => state.auth);
    const authActions = useAuthActions();
    const navigate = useNavigate();

    const [userInputs, setUserInputs] = useState<CreateAccountType>(defaultInputsValue)

    const componentFunctions = {
        handleInputChange : (key: keyof CreateAccountType, value: string, hasError: boolean = false) =>
            setUserInputs({...userInputs, [key]: {...userInputs[key], value, hasError}}),
        handleInputEvents : (key: keyof CreateAccountType) => (e: React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>, hasError?: boolean) => {
            const value = e.target.value;
            const isError = hasError ?? false;
            componentFunctions.handleInputChange(key, value, isError);
        },
        handleCreateAccount: () => {
            if(!userInputs.password.hasError && !userInputs.password.hasError && !userInputs.password.hasError){
                authActions.createAccount({
                    password: userInputs.password.value,
                    email: userInputs.email.value,
                    name: userInputs.fullName.value,
                    onSuccessCallback: componentFunctions.onSuccessAccountCreation,
                    onErrorCallback: componentFunctions.onErrorAccountCreation,
                })
            }
        },
        onErrorAccountCreation: (msg: string) => toast(msg),
        onSuccessAccountCreation: () =>  navigate(pagePaths.DASHBOARD_PAGE)
    }

    const isDisableActions = authState.isProcessing ||
        userInputs.fullName.hasError ||
        userInputs.email.hasError ||
        userInputs.password.hasError;

    return (
        <div className="signup-page-container d-flex justify-content-center">
            <div className="col-md-6 col-lg-5 col-xl-4">
                <LogoHeadingCardComponent heading="SIGN UP">
                    <div className="d-grid my-2">
                        <InputBoxComponent
                            disabled={authState.isProcessing}
                            placeholder="Full Name"
                            type="text"
                            label="Enter Name"
                            onChange={componentFunctions.handleInputEvents('fullName')}
                            onFocus={componentFunctions.handleInputEvents('fullName')}
                            onBlur={componentFunctions.handleInputEvents('fullName')}
                            value={userInputs.fullName.value}
                            isError={userInputs.fullName.hasError}
                        />
                    </div>
                    <div className="d-grid my-2">
                        <InputBoxComponent
                            disabled={authState.isProcessing}
                            placeholder="Email" type="email" label="Enter Email"
                            onChange={componentFunctions.handleInputEvents('email')}
                            onFocus={componentFunctions.handleInputEvents('email')}
                            onBlur={componentFunctions.handleInputEvents('email')}
                            isError={userInputs.email.hasError}
                            value={userInputs.email.value}
                        />
                    </div>
                    <div className="d-grid my-2">
                        <InputBoxComponent placeholder="Password" type="password" label="Enter Password"
                           disabled={authState.isProcessing}
                           onChange={componentFunctions.handleInputEvents('password')}
                           onFocus={componentFunctions.handleInputEvents('password')}
                           onBlur={componentFunctions.handleInputEvents('password')}
                           value={userInputs.password.value}
                           isError={userInputs.password.hasError}
                        />
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <Link to={pagePaths.LOGIN_PAGE} className="login-cta-link">Existing User?</Link>
                        <ButtonComponent text="CREATE ACCOUNT" className="cta-signup btn-info d-flex"
                             disabled={isDisableActions}
                             onClick={componentFunctions.handleCreateAccount}>
                            {authState.isProcessing && <ProgressComponent progressType="border" color="warning" width={1} height={1}/>}
                        </ButtonComponent>
                    </div>
                </LogoHeadingCardComponent>
            </div>
        </div>
    );
};
