"use client";
import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Toaster, toast } from "sonner";

function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            name: '',
            email: '',
            message: ''
        };

        // Validate name
        if (!formData.name) {
            newErrors.name = "This field is required!";
            valid = false;
        } else if (formData.name.length < 3) {
            newErrors.name = "Name should be at least 3 characters long.";
            valid = false;
        }

        // Validate email
        if (!formData.email) {
            newErrors.email = "This field is required!";
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
            valid = false;
        }

        // Validate message
        if (!formData.message) {
            newErrors.message = "This field is required!";
            valid = false;
        } else if (formData.message.length < 10) {
            newErrors.message = "Message should be more than 10 characters";
            valid = false;
        } else if (formData.message.length > 500) {
            newErrors.message = "Message should be less than 500 characters";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const sendEmail = (params: { to_name: string; from_name: string; reply_to: string; message: string }) => {
        const toastId = toast.loading("Sending your message, please wait...");

        const serviceId = process.env.NEXT_PUBLIC_SERVICE_ID || '';
        const templateId = process.env.NEXT_PUBLIC_TEMPLATE_ID || '';
        const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY || '';

        emailjs
            .send(serviceId, templateId, params, {
                publicKey: publicKey,
                limitRate: {
                    throttle: 5000,
                },
            })
            .then(
                () => {
                    toast.success(
                        "Our team received your message, We will get back to you soon!",
                        { id: toastId }
                    );
                    // Reset form after successful submission
                    setFormData({
                        name: '',
                        email: '',
                        message: ''
                    });
                },
                () => {
                    toast.error(
                        "There was an error sending your message, please try again later!",
                        { id: toastId }
                    );
                })
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateForm()) {
            const templateParams = {
                to_name: "Code Morph Team",
                from_name: formData.name,
                reply_to: formData.email,
                message: formData.message,
            };
            sendEmail(templateParams);
        }
    };

    return (
        <>
            <Toaster richColors={true} />
            <form
                onSubmit={handleSubmit}
                className="max-w-md w-full flex flex-col items-center justify-center space-y-4 z-50 p-8 rounded-2xl backdrop-blur-md bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-700/30"
            >
                <div className="w-full space-y-6">
                    <div className="space-y-2">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                            className="w-full p-3 rounded-lg bg-gray-800/40 border border-gray-600/30 text-sky-100 placeholder:text-gray-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all duration-300"
                        />
                        {errors.name && (
                            <span className="text-sm text-red-400 ml-2">
                                {errors.name}
                            </span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your Email(eg. YourEmail@gmail.com)"
                            className="w-full p-3 rounded-lg bg-gray-800/40 border border-gray-600/30 text-sky-100 placeholder:text-gray-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all duration-300"
                        />
                        {errors.email && (
                            <span className="text-sm text-red-400 ml-2">
                                {errors.email}
                            </span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Your Message(Minimun 10 characters)"
                            rows={4}
                            className="w-full p-3 rounded-lg bg-gray-800/40 border border-gray-600/30 text-sky-100 placeholder:text-gray-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all duration-300 resize-none"
                        />
                        {errors.message && (
                            <span className="text-sm text-red-400 ml-2">
                                {errors.message}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-blue-800 to-sky-600 text-white font-medium shadow-lg shadow-sky-700/30 hover:shadow-sky-700/50 hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-700/50"
                    >
                        Send Mail
                    </button>
                </div>
            </form>
        </>
    );
}

export default ContactUs;