import React from 'react';

const TermsAndConditions = () => (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white rounded-xl shadow mt-10 mb-10 border border-[#008246]/30">
        <h1 className="text-3xl font-bold mb-6 text-[#008246] border-b-2 border-[#008246] pb-2">Terms and Conditions</h1>
        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-[#008246]">1. Introduction</h2>
            <p className="text-gray-700">Welcome to <span className="text-[#008246] font-semibold">Energy Storage System</span>. By accessing or using our website, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.</p>
        </section>
        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-[#008246]">2. Use of Website</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>You must be at least 18 years old to use this website.</li>
                <li>You agree not to misuse the website or its content.</li>
                <li>All information provided must be accurate and up to date.</li>
            </ul>
        </section>
        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-[#008246]">3. Orders and Payments</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>All orders are subject to acceptance and availability.</li>
                <li>Prices are subject to change without notice.</li>
                <li>Payment must be made in full before dispatch of goods.</li>
            </ul>
        </section>
        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-[#008246]">4. Shipping and Delivery</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>We aim to deliver products within the estimated time frame, but delays may occur.</li>
                <li>Shipping charges and delivery times may vary based on location and product.</li>
            </ul>
        </section>
        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-[#008246]">5. Returns and Refunds</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Returns are accepted within 7 days of delivery, subject to our return policy.</li>
                <li>Refunds will be processed after inspection of returned goods.</li>
            </ul>
        </section>
        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-[#008246]">6. Intellectual Property</h2>
            <p className="text-gray-700">All content, trademarks, and data on this website are the property of <span className="text-[#008246] font-semibold">Energy Storage System</span> or its licensors. Unauthorized use is prohibited.</p>
        </section>
        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-[#008246]">7. Limitation of Liability</h2>
            <p className="text-gray-700">We are not liable for any indirect, incidental, or consequential damages arising from the use of our website or products.</p>
        </section>
        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-[#008246]">8. Changes to Terms</h2>
            <p className="text-gray-700">We reserve the right to update these Terms and Conditions at any time. Changes will be posted on this page.</p>
        </section>
        <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-[#008246]">9. Contact Us</h2>
            <p className="text-gray-700">If you have any questions about these Terms and Conditions, please contact us at <a href="mailto:connect@energystoragesystem.in" className="text-[#008246] underline font-semibold">connect@energystoragesystem.in</a> or call <a href="tel:+918929490346" className="text-[#008246] underline font-semibold">+91-8929490346</a>.</p>
        </section>
    </div>
);

export default TermsAndConditions;
