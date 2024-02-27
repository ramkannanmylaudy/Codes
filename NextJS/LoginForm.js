"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    ErrorNotification
} from "../component/Notification/Notification";
import { validation, formValidation } from "@/utils/formHandling";

export default function LoginForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState(null);
    const [fieldError, setFieldError] = useState({});

    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;

        const fieldValidation = validation(["login", name, value]);

        setFieldError({
            ...fieldError,
            [name]: fieldValidation,
        });

        setFormData({
            ...formData,
            [name]: value,
        });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);

        //validation
        const validation = formValidation('login', formData, setFieldError);
        if(!validation){
            return;
        }

        try {
            const { email, password } = formData;
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res.error) {
                setError("Invalid Credentials");
                return;
            }

            router.replace("/dashboard/list");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container">
            <div className="">
                <h1 className="text-primary">Login</h1>

                <form onSubmit={handleSubmit} className="">
                    <div className="mb-3">
                        <label className="form-label">Email:</label>
                        <input className="form-control"
                            name="email" onChange={handleChange}
                            type="text"
                            placeholder="Email"
                        />
                        {fieldError.email && <p className="text-danger">{fieldError.email}</p>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password:</label>
                        <input className="form-control"
                            name="password" onChange={handleChange}
                            type="password"
                            placeholder="Password"
                        />
                        {fieldError.password && <p className="text-danger">{fieldError.password}</p>}
                    </div>
                    <button className="btn btn-primary">
                        Login
                    </button>

                    <Link className="mx-3 text-sm mt-3 text-right" href={"/register"}>
                        Don't have an account? <span className="underline">Register</span>
                    </Link>
                </form>
                {errorMessage ? <ErrorNotification message={errorMessage} /> : ""}
            </div>
        </div>
    );
}
