/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { FaStar } from 'react-icons/fa';

const Testimonials = () => {
  return (
    <div className='section-container'>
      <div className='flex flex-col md:flex-row items-center justify-between gap-12'>
        <div className='md:w-1/2'>
          <img src='/images/home/testimonials/testimonials.png' alt='Testimonials' />
        </div>
        <div className='md:w-1/2'>
          <div className='text-left md:w-4/5'>
            <p className='subtitle'>Testimonials</p>
            <h2 className='title'>What Our Customers Say About Us</h2>
  
            <blockquote className='my-5 text-secondary leading-[30px]'>
              "ICELOVE has the best variety of flavors I've ever seen. The service was fantastic, and the ambiance was perfect for a family outing."
            </blockquote>
            <blockquote className='my-5 text-secondary leading-[30px]'>
              "The mixberry ice cream was out of this world! I've never tasted anything like it. Highly recommend!"
            </blockquote>

            {/* Avatar and Customer Feedback */}
            <div className='flex items-center gap-4'>
              <div className="avatar-group -space-x-6 rtl:space-x-reverse">
                <div className="avatar">
                  <div className="w-12">
                    <img src="/images/home/testimonials/testimonial1.png" alt="Customer 1" />
                  </div>
                </div>
                <div className="avatar">
                  <div className="w-12">
                    <img src="/images/home/testimonials/testimonial2.png" alt="Customer 2" />
                  </div>
                </div>
                <div className="avatar">
                  <div className="w-12">
                    <img src="/images/home/testimonials/testimonial3.png" alt="Customer 3" />
                  </div>
                </div>
                <div className="avatar placeholder">
                  <div className="w-12 bg-neutral text-neutral-content">
                    <span>+99</span>
                  </div>
                </div>
              </div>
              <div className='space-y-1 ml-4'>
                <h5 className='text-lg font-semibold'>Customer Feedback</h5>
                <div className='flex items-center gap-2'>
                  <FaStar className="text-yellow-400" />
                  <span className='font-medium'>4.9</span> 
                  <span className='text-[#807e7e]'>(10.1k Reviews)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;

