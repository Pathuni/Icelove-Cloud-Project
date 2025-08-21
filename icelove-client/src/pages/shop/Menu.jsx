import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Cards from '../../components/Cards';
import { FaFilter } from "react-icons/fa";

const Menu = () => {
    const [menu, setMenu] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortOption, setSortOption] = useState("default");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // Number of items to display per page

    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:6001/menu");
                const data = await response.json();
                setMenu(data);
                setFilteredItems(data);
            } catch (error) {
                console.log("Error fetching data", error);
            }
        };
        fetchData();
    }, []);

    const filterItems = useCallback((category) => {
        const filtered = category === "all" ? menu : menu.filter((item) => item.category === category);
        setFilteredItems(filtered);
        setSelectedCategory(category);
        setCurrentPage(1);
    }, [menu]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const category = queryParams.get('category') || 'all';
        filterItems(category);
    }, [location, filterItems]);

    const handleSortChange = (option) => {
        setSortOption(option);

        let sortedItems = [...filteredItems];

        switch (option) {
            case "A-Z":
                sortedItems.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "Z-A":
                sortedItems.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "low-to-high":
                sortedItems.sort((a, b) => a.price - b.price);
                break;
            case "high-to-low":
                sortedItems.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }

        setFilteredItems(sortedItems);
        setCurrentPage(1);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className='section-container bg-gradient-to-r from-[#e0bbd2] from-0% to-[#fcfcfc] to-100%'>
                <div className='py-48 flex flex-col justify-center items-center gap-8'>
                    <div className='text-center space-y-7 px-4'>
                        <h2 className='md:text-5xl text-4xl font-bold md:leading-snug leading-snug'>
                            For the love of delicious 
                            <span className='text-pink'> ICE CREAM</span>
                        </h2>
                        <p className='text-xl text-[#4a4a4a] md:w-4/5 mx-auto'>
                            Come with family and experience the joy of our mouthwatering ice cream flavors such as classic vanilla, rich chocolate, refreshing mint, fruity sorbet, and more, all at an affordable price.
                        </p>
                        <button className='btn bg-pink px-8 py-3 font-semibold text-white rounded-full'>Order Now</button>
                    </div>
                </div>

                <div className='section-container'>
                    <div className='flex flex-col md:flex-row flex-wrap md:justify-between items-center space-y-3 mb-8'>
                        <div className='flex flex-row justify-start md:items-center md:gap-8 gap-4 flex-wrap'>
                            <button onClick={() => filterItems("all")} className={selectedCategory === "all" ? "active" : ""}>All</button>
                            <button onClick={() => filterItems("cups")} className={selectedCategory === "cups" ? "active" : ""}>Cups</button>
                            <button onClick={() => filterItems("rolls")} className={selectedCategory === "rolls" ? "active" : ""}>Rolls</button>
                            <button onClick={() => filterItems("milkshakes")} className={selectedCategory === "milkshakes" ? "active" : ""}>MilkShakes</button>
                            <button onClick={() => filterItems("bars")} className={selectedCategory === "bars" ? "active" : ""}>Bars</button>
                            <button onClick={() => filterItems("cones")} className={selectedCategory === "cones" ? "active" : ""}>Cones</button>
                        </div>

                        <div className='flex justify-end mb-4 rounded-sm'>
                            <div className='bg-pink p-2'>
                                <FaFilter className='h-4 w-4 text-white'/>
                            </div>
                            <select name="sort" id="sort" onChange={(e) => handleSortChange(e.target.value)} value={sortOption} className='bg-pink text-white px-2 py-1 rounded-sm'>
                                <option value="default">Default</option>
                                <option value="A-Z">A-Z</option>
                                <option value="Z-A">Z-A</option>
                                <option value="low-to-high">Low to High</option>
                                <option value="high-to-low">High to Low</option>
                            </select>
                        </div>
                    </div>

                    <div className='grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4'>
                        {currentItems.map((item) => (
                            <Cards key={item._id} item={item}/>
                        ))}
                    </div>
                </div>

                <div className='flex justify-center my-8'>
                    {
                        Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }).map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => paginate(index + 1)}
                                className={`mx-1 px-3 py-1 rounded-full ${currentPage === index + 1 ? "bg-pink text-white" : "bg-gray-200"}`}
                            >
                                {index + 1}
                            </button>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default Menu;
