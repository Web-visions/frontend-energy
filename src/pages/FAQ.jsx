import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqData = [
    {
        question: "What products do you offer?",
        answer: (
            <>
                <p>We offer a wide range of energy storage solutions, including:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Inverter Batteries</li>
                    <li>Solar Products (Panels, Inverters, etc.)</li>
                    <li>Lithium Batteries</li>
                    <li>Online UPS</li>
                    <li>Car Batteries</li>
                    <li>E-Rickshaw Batteries</li>
                    <li>Truck Batteries</li>
                </ul>
                <p className="mt-4">We are proud to be authorized distributors of Su-Vastika Solar and Usha Shree Ram products, providing top-quality solutions for all your energy needs.</p>
            </>
        )
    },
    {
        question: "Do you sell solar products?",
        answer: "Yes, we specialize in solar products, including solar panels, solar inverters, and other solar energy accessories. offering high-quality solar solutions."
    },
    {
        question: "Are you an authorized distributor for any brands?",
        answer: "Yes! We are authorized distributors of Su-Vastika Solar and Usha Shree Ram, two well-established and trusted brands in the energy storage and solar industry."
    },
    {
        question: "Can I buy your products online?",
        answer: "Yes, our products are available for purchase online through our website. Simply browse our categories, select the products you need, and place your order. We offer fast delivery and secure payment options."
    },
    {
        question: "What types of batteries do you sell?",
        answer: (
            <>
                <p>We offer a wide variety of batteries for different applications:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Inverter Batteries</li>
                    <li>Lithium Batteries</li>
                    <li>Car Batteries</li>
                    <li>Truck Batteries</li>
                    <li>E-Rickshaw Batteries</li>
                </ul>
                <p className="mt-4">Each type is designed to offer superior performance, longevity, and reliability.</p>
            </>
        )
    },
    {
        question: "What is the difference between a lithium battery and a traditional battery?",
        answer: "Lithium batteries are more efficient, lightweight, and have a longer lifespan compared to traditional lead-acid batteries. They also require less maintenance and offer better energy storage capacity, making them ideal for renewable energy systems, electric vehicles, and other applications."
    },
    {
        question: "Can you help me choose the right battery for my inverter?",
        answer: "Absolutely! Our expert team is available to guide you in choosing the right inverter battery based on your power requirements, usage patterns, and preferences. Feel free to reach out to us for personalized advice."
    },
    {
        question: "Do you offer installation services for solar products?",
        answer: "Yes, we provide installation services for all solar products we sell, including solar panels, inverters, and batteries. Our professional technicians will ensure proper installation and optimal system performance."
    },
    {
        question: "Are your products covered by a warranty?",
        answer: "Yes, all of our products come with manufacturer warranties. The specific warranty period depends on the brand and type of product. Please check the product details on our website or contact our customer service team for warranty information."
    },
    {
        question: "How can I track my order?",
        answer: "Once your order is dispatched, you will receive an email with a tracking number. You can use this number to track the status of your delivery through our courier partner's website."
    },
    {
        question: "Do you offer bulk orders for businesses or institutions?",
        answer: "Yes, we offer bulk orders for businesses, institutions, and commercial clients. If you're looking to place a large order, please contact us directly to discuss your requirements and get the best pricing."
    },
    {
        question: "How can I contact customer support?",
        answer: (
            <>
                <p>You can reach our customer support team through:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Phone: +918929490346</li>
                    <li>Email: info.energystoragesystem@gmail.com</li>
                    <li>Live Chat: Available on our website</li>
                </ul>
                <p className="mt-4">We are here to assist you with any questions or issues you may have!</p>
            </>
        )
    },
    {
        question: "Do you offer any payment options?",
        answer: (
            <>
                <p>Yes, we offer multiple payment options for your convenience:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Credit/Debit Card</li>
                    <li>Net Banking</li>
                    <li>Cash on Delivery (COD)</li>
                    <li>UPI Payment</li>
                </ul>
            </>
        )
    },
    {
        question: "Can I return a product if I'm not satisfied?",
        answer: "We offer a return policy for products that are damaged or defective. Please refer to our Return & Exchange policy on our website for more details. For non-defective returns, please check with our customer service team for eligibility."
    },
    {
        question: "Do you offer international shipping?",
        answer: "Currently, we only offer shipping within India. For international shipping inquiries, please reach out to our customer service team for further assistance."
    }
];

const FAQItem = ({ faq, index, isOpen, toggleFAQ }) => {
    return (
        <div className="border-b border-gray-200 py-6">
            <button
                className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-800 focus:outline-none"
                onClick={() => toggleFAQ(index)}
            >
                <span className="hover:text-[#008246] transition-colors">{faq.question}</span>
                {isOpen ? <ChevronUp className="h-6 w-6 text-[#008246]" /> : <ChevronDown className="h-6 w-6 text-gray-500" />}
            </button>
            {isOpen && (
                <div className="mt-4 text-gray-700 leading-relaxed prose">
                    {faq.answer}
                </div>
            )}
        </div>
    );
};

const FAQ = () => {
    const [openFAQ, setOpenFAQ] = useState(null);

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-28">
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
                    <p className="text-lg text-gray-600 mb-12">Find answers to common questions about our products and services.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {faqData.map((faq, index) => (
                        <FAQItem
                            key={index}
                            index={index}
                            faq={faq}
                            isOpen={openFAQ === index}
                            toggleFAQ={toggleFAQ}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ; 