import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <main className="flex-grow bg-gray-50 mt-20 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[#008246] mb-8 text-center">Contact Us</h1>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-[#008246] mb-6">Get in Touch</h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="text-[#E4C73F] w-6 h-6 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Our Location</h3>
                  <p className="text-gray-600">LT Atul Kataria Marg, Part-6<br />Sector 6, Gurugram, Haryana 122001</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="text-[#E4C73F] w-6 h-6 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Phone</h3>
                  <a href="tel:8929490346" className="text-[#008246] font-semibold hover:underline">8929490346</a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="text-[#E4C73F] w-6 h-6 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Email</h3>
                  <a href="mailto:connect@energystoragesystem.in" className="text-[#008246] font-semibold hover:underline">connect@energystoragesystem.in</a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="text-[#E4C73F] w-6 h-6 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Working Hours</h3>
                  <p className="text-gray-600">Open all days (Monday - Sunday) from 9:30 AM to 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-[#008246] mb-6">Send us a Message</h2>

            <form className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008246]"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2" htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008246]"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2" htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008246]"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008246]"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#008246] hover:bg-[#006d3b] text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-lg p-4 h-[400px] relative">
            <img
              src="https://images.pexels.com/photos/4386442/pexels-photo-4386442.jpeg"
              alt="Location Map"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;