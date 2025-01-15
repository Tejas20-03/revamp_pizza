import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <div className="min-h-screen">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="relative w-full h-[300px] mb-8">
          <Image 
            src="/assets/bwp-about-page-content.png"
            alt="Broadway Pizza About"
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-lg text-gray-700 dark:text-gray-100">
              What started as a small kitchen in 2013 at Rahat Commercial DHA, Karachi, has grown leaps and bounds in a span of just 10 years. With a simple dream of introducing the finest quality pizzas in Pakistan, Broadway Pizza has now become Pakistan's largest national and award-winning pizza chain with 64 outlets nationwide. From starting small to reaching new heights, our journey is proof that passion, hard work, and commitment to quality can turn a simple idea into something truly remarkable!
            </p>
          </div>
          <div>
            <p className="text-base text-gray-700 dark:text-gray-100">
              Our passion to deliver the best is fuelled by our customer's trust. What sets our pizza apart is our commitment to quality; never having compromised on the taste or the ingredients from the very first day we started. Each pizza is made with love, care and the best ingredients, ensuring our customers keep coming back for more. High quality and standard is what form the core fibre of our DNA!
            </p>
          </div>
        </div>

        <div className="relative w-full h-[300px] mt-8">
          <Image 
            src="/assets/bwp-about-img-2.png"
            alt="Broadway Pizza"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
