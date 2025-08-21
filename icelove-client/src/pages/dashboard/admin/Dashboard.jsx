import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

ChartJS.register(ArcElement, Tooltip);

const Dashboard = () => {
  const axiosSecure = useAxiosSecure();
  const [pieData, setPieData] = useState({ labels: [], datasets: [] });

  // Fetch user data
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
    onError: (error) => {
      console.error('Error fetching users data:', error);
    },
  });

  // Fetch menu data
  const { data: menu = [] } = useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      const res = await axiosSecure.get("/menu");
      return res.data;
    },
    onError: (error) => {
      console.error('Error fetching menu data:', error);
    },
  });

  useEffect(() => {
    // Categorize menu items
    if (menu.length > 0) {
      const categoryCounts = menu.reduce((acc, item) => {
        // Assuming each item has a `category` field
        const category = item.category;
        if (acc[category]) {
          acc[category]++;
        } else {
          acc[category] = 1;
        }
        return acc;
      }, {});

      // Prepare data for the pie chart
      const labels = Object.keys(categoryCounts);
      const data = Object.values(categoryCounts);
      const backgroundColors = labels.map((label, index) => {
        // Generate a color for each category
        return `hsl(${(index * 360) / labels.length}, 70%, 70%)`;
      });

      setPieData({
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: backgroundColors,
            borderColor: '#fff',
            borderWidth: 1,
          },
        ],
      });
    }
  }, [menu]);

  const pieOptions = {
    plugins: {
      legend: {
        display: false, // Remove legend
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} items`;
          },
        },
      },
      title: {
        display: true,
        text: 'Ice Cream Sales by Category',
        font: {
          size: 18, // Reduced font size
        },
        padding: {
          top: 20,
          bottom: 20,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  // Category items with dynamic counts
  const categoryItems = [
    { id: 2, title: "Users", des: `(${users.length})`, link: "/dashboard/users" },
    { id: 3, title: "Menu Items", des: `(${menu.length})`, link: "/dashboard/menu" },
  ];

  return (
    <div className='section-container bg-gradient-to-r from-[#e0bbd2] to-[#fcfcfc] py-8 px-4'>
      <div className='container mx-auto'>
        {/* Greeting Section */}
        <div className='py-4'>
          <h2 className='text-4xl font-bold'>Hi, User!</h2>
        </div>

        {/* Main Content */}
        <div className='flex flex-col md:flex-row gap-8'>
          {/* Pie Chart */}
          <div className='md:w-1/2'>
            <div className='py-4'>
              <div className='text-center'>
                <h3 className='text-xl font-semibold'>Ice Cream Sales by Category</h3> {/* Adjusted font size */}
              </div>
              <div className='relative' style={{ height: '400px', width: '100%' }}>
                <Pie data={pieData} options={pieOptions} />
              </div>
            </div>
          </div>

          {/* Statistics Boxes */}
          <div className='md:w-1/2 mt-8 md:mt-0'>
            <div className='flex flex-col sm:flex-row flex-wrap gap-8 justify-around items-center'>
              {categoryItems.map((item) => (
                <a key={item.id} href={item.link} className='shadow-lg rounded-md bg-white py-6 px-5 w-72 mx-auto text-center cursor-pointer hover:-translate-y-4 duration-300 transition-all'>
                  <div className='mt-5 space-y-1'>
                    <h5 className='font-semibold'>{item.title}</h5>
                    <p>{item.des}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
