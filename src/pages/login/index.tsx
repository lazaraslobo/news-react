import React, {useEffect, useState} from 'react';
import {ProgressComponent} from "../../components/progress";
import {InputBoxComponent} from "../../components/user-controlls/input-box";
import {ButtonComponent} from "../../components/user-controlls/button";
import pagePaths from "../../routes/page-paths";
import {Link} from "react-router-dom";
import {LogoHeadingCardComponent} from "../../components/logo-heading-card";
import type {LoginPayload} from '../../redux/auth/dataTypes';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import useAuthActions from '../../hooks/useAuthActions';
import {postApi_logUserOut} from '../../apis';
import './styles.scss';

export const LoginPage: React.FC = () => {
    const authState = useSelector((state: RootState) => state.auth);
    const authActions = useAuthActions();

    useEffect(() => {
        if(authState.isAuthenticated === true){
            postApi_logUserOut();
        }
    }, []);

    const [userInfo, setInfo] = useState<{ [key in keyof LoginPayload]: {value: string; hasError: boolean} }>({
        userEmail: {
            hasError: false,
            value: ""
        },
        userPassword: {
            hasError: false,
            value: ""
        },
    });

    const componentFunctions = {
        handleInputChange: (key: keyof LoginPayload, value: string, hasError: boolean = false) => setInfo({...userInfo, [key]:{value, hasError}}),
        handleLoginClick: () => {
            if(!userInfo.userEmail.hasError && !userInfo.userPassword.hasError) {
                const {userEmail, userPassword} = userInfo;
                authActions.login(userEmail.value, userPassword.value);
            }
        },
        handleInputEvents : (key: keyof LoginPayload) => (e: React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>, hasError?: boolean) => {
            const value = e.target.value;
            const isError = hasError ?? false;
            componentFunctions.handleInputChange(key, value, isError);
        }
    }

    return (
        <div className="login-page-container d-flex justify-content-center">
            <div className="col-md-6 col-lg-5 col-xl-4">
                <LogoHeadingCardComponent heading="LOGIN">
                    <div className="d-grid my-2">
                        <InputBoxComponent placeholder="Email" type="email" label="Enter Email" value={userInfo.userEmail.value}
                           onChange={componentFunctions.handleInputEvents("userEmail")}
                           onFocus={componentFunctions.handleInputEvents("userEmail")}
                           onBlur={componentFunctions.handleInputEvents("userEmail")}
                        />
                    </div>
                    <div className="d-grid my-2">
                        <InputBoxComponent placeholder="Password" type="password" label="Enter Password" value={userInfo.userPassword.value}
                           onChange={componentFunctions.handleInputEvents("userPassword")}
                           onFocus={componentFunctions.handleInputEvents("userPassword")}
                           onBlur={componentFunctions.handleInputEvents("userPassword")}
                        />
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <Link to={pagePaths.SIGNUP_PAGE} className="login-cta-link">New User?</Link>
                        <ButtonComponent text="LOGIN" className="cta-login btn-primary d-flex"
                             onClick={componentFunctions.handleLoginClick}
                             disabled={userInfo.userEmail.hasError || userInfo.userPassword.hasError || authState.isProcessing}
                        >
                            {
                                authState.isProcessing && <ProgressComponent progressType="border" color="warning" width={1} height={1}/>
                            }
                        </ButtonComponent>
                    </div>
                </LogoHeadingCardComponent>
            </div>
        </div>
);
};
