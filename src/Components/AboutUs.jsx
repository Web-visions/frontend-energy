import React from "react";
import udyamPDF from '../assets/udyam.pdf';
import isoPDF from '../assets/ENERGY_STORAGE_SYSTEM__QMS[1].pdf';
import gstPDF from '../assets/gst-certificate.pdf';

const AboutUs = () => (
  <main className="bg-gray-50 min-h-screen py-16">
    <div className="container mx-auto px-4 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-bold text-[#008246] mb-6 text-center">About Energy Storage System (ESS)</h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        Energy Storage System (ESS) is your one-stop destination for complete power backup and energy solutions. We are committed to powering homes, businesses, and institutions with reliable, efficient, and future-ready energy systems.
      </p>
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
        <p className="mb-4 text-gray-800">
          Established with a mission to bridge the gap between power demand and dependable supply, ESS has quickly grown into a trusted name in the energy sector. We pride ourselves on delivering innovative and scalable solutions that not only meet your present needs but also prepare you for a sustainable future.
        </p>
        <p className="mb-4 text-gray-800">
          Our commitment to excellence, combined with our technical expertise and customer-centric approach, ensures that we deliver nothing but the best—no matter the scale or complexity of the project.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <section className="bg-[#e4c73f]/10 rounded-xl p-6 shadow">
          <h2 className="text-2xl font-semibold text-[#008246] mb-4">Our Key Offerings</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><b>Inverters & Batteries (Home & Commercial Use):</b> Reliable and efficient systems designed to provide backup power during outages and ensure continuous operation of essential appliances.</li>
            <li><b>UPS Systems (Online/Offline):</b> Uninterruptible Power Supply systems that protect sensitive equipment from power fluctuations, surges, and outages.</li>
            <li><b>Solar Rooftop Systems (On-grid, Off-grid, Hybrid):</b> Customized solar energy solutions tailored for residential, commercial, and industrial use, ensuring maximum efficiency and return on investment.</li>
            <li><b>Solar Street Lights & Car Batteries:</b> Environmentally friendly and cost-effective lighting and energy solutions for outdoor and automotive applications.</li>
            <li><b>Advanced Lithium Batteries for EVs & Backup:</b> High-performance, lightweight, and long-lasting lithium battery systems built for electric vehicles and power storage.</li>
            <li><b>Installation, Maintenance & After-Sales Support:</b> End-to-end project execution with ongoing support and maintenance to keep your systems running smoothly and efficiently.</li>
          </ul>
        </section>
        <section className="bg-[#e4c73f]/10 rounded-xl p-6 shadow">
          <h2 className="text-2xl font-semibold text-[#008246] mb-4">Why Choose ESS?</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><b>Comprehensive product portfolio</b> that covers all power and energy backup needs.</li>
            <li><b>Expert technical support,</b> including free site visits and load assessments for precise solutions.</li>
            <li><b>Top-tier brands and high-quality equipment</b> sourced for durability and performance.</li>
            <li><b>Seamless integration with government policies</b> and subsidy programs to reduce your investment burden.</li>
            <li><b>Efficient project execution</b> with minimal downtime and superior workmanship.</li>
            <li><b>Dedicated customer service team</b> providing timely maintenance, upgrades, and AMC services.</li>
            <li><b>Transparency, integrity, and customer satisfaction</b> as the core values guiding every interaction.</li>
          </ul>
        </section>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
        <p className="mb-4 text-gray-800">
          At Energy Storage System (ESS), we believe energy is not just a utility—it's a necessity. With a passion for technology and a commitment to sustainable progress, we continue to deliver solutions that empower lives, drive businesses, and protect the environment.
        </p>
        <p className="mb-4 text-gray-800">
          Join the ESS family and experience the power of reliable, affordable, and clean energy—today and for the future.
        </p>
      </div>
      {/* Certificates Grid */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-[#008246] mb-6 text-center">Our Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Udyam Certificate */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition">
            <span className="text-[#008246] font-bold mb-2">Udyam Certificate</span>
            <embed src={udyamPDF} type="application/pdf" className="w-full h-48 rounded mb-3 border" />
            <a href={udyamPDF} target="_blank" rel="noopener noreferrer" className="text-sm text-[#008246] font-semibold hover:underline">View Full PDF</a>
          </div>
          {/* ISO Certificate */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition">
            <span className="text-[#008246] font-bold mb-2">ISO 9001:2015 Certificate</span>
            <embed src={isoPDF} type="application/pdf" className="w-full h-48 rounded mb-3 border" />
            <a href={isoPDF} target="_blank" rel="noopener noreferrer" className="text-sm text-[#008246] font-semibold hover:underline">View Full PDF</a>
          </div>
          {/* GST Certificate */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition">
            <span className="text-[#008246] font-bold mb-2">GST Certificate</span>
            <embed src={gstPDF} type="application/pdf" className="w-full h-48 rounded mb-3 border" />
            <a href={gstPDF} target="_blank" rel="noopener noreferrer" className="text-sm text-[#008246] font-semibold hover:underline">View Full PDF</a>
          </div>
        </div>
      </div>
    </div>
  </main>
);

export default AboutUs;