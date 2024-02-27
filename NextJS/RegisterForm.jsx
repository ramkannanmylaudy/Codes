"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ErrorNotification,
  SuccessNotification,
} from "../component/Notification/Notification";
import { postData } from "@/services/api";
import { validation, formValidation } from "@/utils/formHandling";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [fieldError, setFieldError] = useState({});

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;

    const fieldValidation = validation(["register", name, value]);

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
    const validation = formValidation('register', formData, setFieldError);
    if(!validation){
        return;
    }

    postData("/api/register", formData)
      .then((result) => {
        if (result.status == 'success') {
          setErrorMessage(null);
          setSuccessMessage(result.message);
          const form = e.target;
          form.reset();
          setTimeout(() => {
            setFieldError({});
          }, 100);
        }
        else {
          setSuccessMessage(null);
          setErrorMessage(result.message);
        }
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <div className="container">
      <div className="col-12">
        <h1 className="text-primary">Register</h1>

        <form onSubmit={handleSubmit} className="">
          <div className="mb-3">
            <label className="form-label">Name:</label>
            <input className='form-control' name="name"
              onChange={handleChange}
              type="text"
              placeholder="Full Name"
            />
            {fieldError.name && <p className="text-danger">{fieldError.name}</p>}
          </div>
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input className='form-control' name="email"
              onChange={handleChange}
              type="text"
              placeholder="Email"
            />
            {fieldError.email && <p className="text-danger">{fieldError.email}</p>}
          </div>
          <div className="mb-3">
            <label className="form-label">Password:</label>
            <input className='form-control' name="password"
              onChange={handleChange}
              type="password"
              placeholder="Password"
            />
            {fieldError.password && <p className="text-danger">{fieldError.password}</p>}
          </div>
          <button className="btn btn-primary">
            Register
          </button>

          <Link className="mx-3 text-sm mt-3 text-right" href={"/login"}>
            Already have an account? <span className="underline">Login</span>
          </Link>
        </form>
        {successMessage ? <SuccessNotification message={successMessage} /> : ""}
        {errorMessage ? <ErrorNotification message={errorMessage} /> : ""}
      </div>
    </div>
  );
}
