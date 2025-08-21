import React from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosPublic from '../../../hooks/useAxiosPublic';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaUtensils } from 'react-icons/fa';

const UpdateMenu = () => {
    const item = useLoaderData();
    const { register, handleSubmit, reset } = useForm();
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    // Check if item is null or undefined
    if (!item) {
        return <div>Loading...</div>; // or a more appropriate loading indicator
    }

    // image hosting key
    const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
    const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

    const onSubmit = async (data) => {
        try {
            let imageUrl = item.image; // Keep existing image URL if no new image is uploaded

            if (data.image.length > 0) {
                const formData = new FormData();
                formData.append('image', data.image[0]);

                const hostingImg = await axiosPublic.post(image_hosting_api, formData, {
                    headers: {
                        "content-type": "multipart/form-data",
                    },
                });

                if (hostingImg.data.success) {
                    imageUrl = hostingImg.data.data.display_url;
                } else {
                    throw new Error('Image upload failed');
                }
            }

            const menuItem = {
                name: data.name,
                category: data.category,
                price: parseFloat(data.price),
                recipe: data.recipe,
                image: imageUrl,
            };

            const postMenuItem = await axiosSecure.patch(`/menu/${item._id}`, menuItem);

            if (postMenuItem.status === 200) {
                reset();
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Your item updated successfully!",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate("/dashboard/manage-items");
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            console.error("Error updating menu item", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.message || 'Something went wrong!',
            });
        }
    };

    return (
        <div className="w-full md:w-[870px] px-4 mx-auto">
            <h2 className="text-2xl font-semibold my-4">
                Update <span className="text-pink">Ice Cream Item</span>
            </h2>

            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Item Name*</span>
                        </label>
                        <input
                            type="text"
                            defaultValue={item.name || ""}
                            {...register("name", { required: true })}
                            placeholder="Item Name"
                            className="input input-bordered w-full"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="form-control w-full my-6">
                            <label className="label">
                                <span className="label-text">Category*</span>
                            </label>
                            <select
                                {...register("category", { required: true })}
                                className="select select-bordered"
                                defaultValue={item.category || "default"}
                            >
                                <option disabled value="default">
                                    Select a category
                                </option>
                                <option value="cups">Cups</option>
                                <option value="rolls">Rolls</option>
                                <option value="milkshakes">Milkshakes</option>
                                <option value="bars">Bars</option>
                                <option value="cones">Cones</option>
                                <option value="popular">Popular</option>
                            </select>
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Price*</span>
                            </label>
                            <input
                                type="number"
                                defaultValue={item.price || ""}
                                {...register("price", { required: true })}
                                placeholder="Price"
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Ice Cream Recipe Details</span>
                        </label>
                        <textarea
                            defaultValue={item.recipe || ""}
                            {...register("recipe")}
                            className="textarea textarea-bordered h-24"
                            placeholder="Tell the world about your recipe"
                        ></textarea>
                    </div>

                    <div className="form-control w-full my-6">
                        <input
                            {...register("image")}
                            type="file"
                            className="file-input w-full max-w-xs"
                        />
                    </div>

                    <button type="submit" className="btn bg-pink text-white px-6">
                        Update Item <FaUtensils />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateMenu;
