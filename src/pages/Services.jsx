import React from 'react';
import { Zap, Battery, Sun, Shield, PenTool as Tools, Clock } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Zap className="w-12 h-12 text-[#E4C73F]" />,
      title: "Inverter Solutions",
      description: "Complete range of inverter solutions from leading brands like Su-vastika, Luminous, and Microtek for both residential and commercial use.",
      image: "https://images.pexels.com/photos/368893/pexels-photo-368893.jpeg"
    },
    {
      icon: <Battery className="w-12 h-12 text-[#E4C73F]" />,
      title: "Battery Systems",
      description: "High-quality batteries from trusted brands including Exide, Luminous, and Amaron, offering both Lead Acid and Lithium options.",
      image: "https://images.pexels.com/photos/159397/solar-panel-array-power-sun-electricity-159397.jpeg"
    },
    {
      icon: <Sun className="w-12 h-12 text-[#E4C73F]" />,
      title: "Solar Solutions",
      description: "Comprehensive solar products and installation services featuring top brands like Usha Shriram, Warree, and Aadani.",
      image: "https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg"
    }
  ];

  return (
    <main className="flex-grow bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[#008246] mb-8 text-center">Our Services</h1>
        
        {/* Main Services */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden group">
              <div className="h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {service.icon}
                  <h3 className="text-xl font-semibold text-[#008246] ml-3">{service.title}</h3>
                </div>
                <p className="text-gray-600">{service.description}</p>
                <button className="mt-4 bg-[#008246] hover:bg-[#006d3b] text-white px-6 py-2 rounded-md transition-colors duration-300">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Services */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-semibold text-[#008246] mb-8 text-center">Additional Services</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="w-12 h-12 text-[#E4C73F] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#008246] mb-2">Extended Warranty</h3>
              <p className="text-gray-600">Comprehensive warranty coverage for all our products with extended options available.</p>
            </div>
            
            <div className="text-center">
              <Tools className="w-12 h-12 text-[#E4C73F] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#008246] mb-2">Installation & Maintenance</h3>
              <p className="text-gray-600">Professional installation and regular maintenance services by certified technicians.</p>
            </div>
            
            <div className="text-center">
              <Clock className="w-12 h-12 text-[#E4C73F] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#008246] mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock technical support and emergency assistance for all our customers.</p>
            </div>
          </div>
        </div>

        {/* Service Process */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-[#008246] mb-8 text-center">Our Service Process</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center relative">
              <div className="w-16 h-16 bg-[#008246] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Consultation</h3>
              <p className="text-gray-600">Initial discussion to understand your requirements</p>
            </div>
            
            <div className="text-center relative">
              <div className="w-16 h-16 bg-[#008246] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Site Survey</h3>
              <p className="text-gray-600">Technical assessment and solution planning</p>
            </div>
            
            <div className="text-center relative">
              <div className="w-16 h-16 bg-[#008246] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Installation</h3>
              <p className="text-gray-600">Professional setup by certified technicians</p>
            </div>
            
            <div className="text-center relative">
              <div className="w-16 h-16 bg-[#008246] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">After Support</h3>
              <p className="text-gray-600">Ongoing maintenance and technical support</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Services;