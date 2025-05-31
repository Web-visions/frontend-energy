import React from 'react';
import { HelpCircle, FileText, Phone, Mail } from 'lucide-react';

const Help = () => {
  const faqs = [
    {
      question: "What types of inverters do you offer?",
      answer: "We offer a wide range of inverters including Su-vastika, Luminous, and Microtek brands. Our selection includes home inverters, commercial inverters, and solar inverters to meet various power backup needs."
    },
    {
      question: "How do I choose the right battery for my needs?",
      answer: "We offer both Lead Acid (Exide, Luminous, Amaron) and Lithium batteries. The choice depends on factors like usage, budget, and space. Our experts can help you select the perfect battery based on your specific requirements."
    },
    {
      question: "What warranty do you provide on solar products?",
      answer: "Our solar products come with comprehensive warranties. Solar panels typically have a 25-year performance warranty, while inverters come with 5-10 years warranty depending on the brand (Usha Shriram, Warree, Vikram, Aadani)."
    },
    {
      question: "Do you provide installation services?",
      answer: "Yes, we provide professional installation services for all our products including inverters, UPS systems, and solar solutions. Our trained technicians ensure proper setup and optimal performance."
    }
  ];

  return (
    <main className="flex-grow bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[#008246] mb-8 text-center">Help Center</h1>

        {/* Quick Support Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Phone className="w-12 h-12 text-[#E4C73F] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#008246] mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-4">Available Mon-Sat, 9AM-7PM</p>
            <a href="tel:+919876543210" className="text-[#008246] font-semibold hover:text-[#006d3b]">
              +91 98765 43210
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Mail className="w-12 h-12 text-[#E4C73F] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#008246] mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">24/7 Email Support</p>
            <a href="mailto:support@energystorage.com" className="text-[#008246] font-semibold hover:text-[#006d3b]">
              support@energystorage.com
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <FileText className="w-12 h-12 text-[#E4C73F] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#008246] mb-2">Documentation</h3>
            <p className="text-gray-600 mb-4">Product Guides & Manuals</p>
            <a href="#" className="text-[#008246] font-semibold hover:text-[#006d3b]">
              View Documentation
            </a>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-[#008246] mb-6 flex items-center">
            <HelpCircle className="w-6 h-6 mr-2" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Categories */}
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#008246] mb-4">Product Support</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600 hover:text-[#008246]">
                <span className="w-2 h-2 bg-[#E4C73F] rounded-full mr-2"></span>
                <a href="#">Inverter Troubleshooting</a>
              </li>
              <li className="flex items-center text-gray-600 hover:text-[#008246]">
                <span className="w-2 h-2 bg-[#E4C73F] rounded-full mr-2"></span>
                <a href="#">Battery Maintenance</a>
              </li>
              <li className="flex items-center text-gray-600 hover:text-[#008246]">
                <span className="w-2 h-2 bg-[#E4C73F] rounded-full mr-2"></span>
                <a href="#">Solar System Guide</a>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#008246] mb-4">Installation Help</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600 hover:text-[#008246]">
                <span className="w-2 h-2 bg-[#E4C73F] rounded-full mr-2"></span>
                <a href="#">Installation Guidelines</a>
              </li>
              <li className="flex items-center text-gray-600 hover:text-[#008246]">
                <span className="w-2 h-2 bg-[#E4C73F] rounded-full mr-2"></span>
                <a href="#">Setup Videos</a>
              </li>
              <li className="flex items-center text-gray-600 hover:text-[#008246]">
                <span className="w-2 h-2 bg-[#E4C73F] rounded-full mr-2"></span>
                <a href="#">Safety Instructions</a>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#008246] mb-4">Warranty & Returns</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600 hover:text-[#008246]">
                <span className="w-2 h-2 bg-[#E4C73F] rounded-full mr-2"></span>
                <a href="#">Warranty Policy</a>
              </li>
              <li className="flex items-center text-gray-600 hover:text-[#008246]">
                <span className="w-2 h-2 bg-[#E4C73F] rounded-full mr-2"></span>
                <a href="#">Return Process</a>
              </li>
              <li className="flex items-center text-gray-600 hover:text-[#008246]">
                <span className="w-2 h-2 bg-[#E4C73F] rounded-full mr-2"></span>
                <a href="#">Claim Status</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Help;