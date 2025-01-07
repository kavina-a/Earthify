import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-mutedPalette-mutedBlue to-mutedPalette-softTan text-mutedPalette-beige relative overflow-hidden py-12">
      {/* Animated Overlay */}
      <div className="absolute inset-0 -top-full -left-full w-[200%] h-[200%] bg-white opacity-10 animate-spin-slow"></div>
      <div className="absolute inset-0 -top-full -left-full w-[200%] h-[200%] bg-white opacity-20 animate-spin-slower"></div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Logo and Social Icons */}
        <div className="flex flex-wrap justify-between items-center gap-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="images/earthify-logo.png"
              alt="Earthify Logo"
              className="h-20"
            />
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <a
              href="https://facebook.com/earthify"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-2xl transition-transform transform hover:scale-125"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com/earthify"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-2xl transition-transform transform hover:scale-125"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com/earthify"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-2xl transition-transform transform hover:scale-125"
            >
              <FaInstagram />
            </a>
            <a
              href="https://linkedin.com/company/earthify"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-2xl transition-transform transform hover:scale-125"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex flex-wrap justify-between gap-x-12 gap-y-8 mt-8">
          {/* About Us */}
          <div className="flex-1 min-w-[300px]">
            <h3 className="text-2xl font-bold mb-4">About Us</h3>
            <p className="text-base leading-6 text-gray-800">
              Earthify is dedicated to connecting you with sustainable, eco-friendly products that contribute to a healthier planet. Together we can make greener choices.
            </p>
          </div>

          {/* Contact Us */}
          <div className="flex-1 min-w-[300px]">
            <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
            <p className="text-base leading-6 text-gray-800">
              Email: <a href="mailto:support@earthify.com">support@earthify.com</a>
            </p>
            <p className="text-base leading-6 text-gray-800">
              Phone: (+94) 765 123 456
            </p>
          </div>

          {/* Join the Movement */}
          <div className="flex-1 min-w-[300px]">
            <h3 className="text-2xl font-bold mb-4">Join the Movement</h3>
            <p className="text-base leading-6 text-gray-800 mb-4">
              Subscribe to our newsletter for eco-friendly tips, exclusive deals and updates about our mission to create a sustainable future.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your Email"
                className="flex-grow py-2 px-4 rounded-l-md border-none focus:ring-2 focus:ring-green-500"
              />
              <button className="px-4 py-2 bg-mutedPalette-mutedBlue text-white rounded-r-md hover:bg-mutedPalette-softTan transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-800">
            &copy; 2024 Earthify. All rights reserved. Designed for a greener future.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;