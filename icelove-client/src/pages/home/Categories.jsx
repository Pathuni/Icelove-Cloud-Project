import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [cupsCount, setCupsCount] = useState(0);
  const [barsCount, setBarsCount] = useState(0);
  const [conesCount, setConesCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:6001/menu");
        const data = await response.json();

        setTotalItems(data.length);

        // Calculate counts for each category
        const cups = data.filter(item => item.category === "cups");
        const bars = data.filter(item => item.category === "bars");
        const cones = data.filter(item => item.category === "cones");

        setCupsCount(cups.length);
        setBarsCount(bars.length);
        setConesCount(cones.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Category items with dynamic counts
  const categoryItems = [
    { id: 1, title: "Cups", des: `(${cupsCount} Items)`, image: "/images/home/category/img1.png", link: "/menu?category=cups" },
    { id: 2, title: "Bars", des: `(${barsCount} Flavors)`, image: "/images/home/category/img2.png", link: "/menu?category=bars" },
    { id: 3, title: "Cones", des: `(${conesCount} Flavors)`, image: "/images/home/category/img3.png", link: "/menu?category=cones" },
    { id: 4, title: "Browse All", des: `(${totalItems} Items)`, image: "/images/home/category/img4.png", link: "/menu?category=all" },
  ];

  return (
    <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4 py-16'>
      <div className='text-center'>
        <p className='subtitle'>Meet your favorite flavor</p>
        <h2 className='title'>Popular Categories</h2>
      </div>

      {/* category cards */}
      <div className='flex flex-col sm:flex-row flex-wrap gap-8 justify-around items-center mt-12'>
        {
          categoryItems.map((item, i) => (
            <Link key={i} to={item.link} className='shadow-lg rounded-md bg-white py-6 px-5 w-72 mx-auto text-center cursor-pointer 
            hover:-translate-y-4 duration-300 transition-all'>
              <div className='flex w-full mx-auto items-center justify-center'>
                <img src={item.image} alt="" className='bg-[#cf91b5] p-5 rounded-full w-28 h-28' />
              </div>
              <div className='mt-5 space-y-1'>
                <h5 className='font-semibold'>{item.title}</h5>
                <p>{item.des}</p>
              </div>
            </Link>
          ))
        }
      </div>
    </div>
  );
};

export default Categories;
