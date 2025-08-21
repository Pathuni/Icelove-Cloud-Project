import React from "react";
import { FaUtensils } from "react-icons/fa";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from 'sweetalert2';

const AddMenu = () => {
  const { register, handleSubmit, reset } = useForm();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  // image hosting key
  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

  console.log(image_hosting_key)

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('image', data.image[0]);

      const hostingImg = await axiosPublic.post(image_hosting_api, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      if (hostingImg.data.success) {
        const menuItem = {
          name: data.name,
          category: data.category,
          price: parseFloat(data.price),
          recipe: data.recipe,
          image: hostingImg.data.data.display_url,
        };

        const postMenuItem = await axiosSecure.post('/menu', menuItem);
        if (postMenuItem.status === 200) {
          reset();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your Item is inserted successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong with the image upload!',
      });
    }
  };

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4">
        Upload A New <span className="text-pink">Ice Cream Item</span>
      </h2>

      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control w-full">
            <label className="label" htmlFor="item-name">
              <span className="label-text">Item Name*</span>
            </label>
            <input
              type="text"
              id="item-name"
              {...register("name", { required: true })}
              placeholder="Item Name"
              className="input input-bordered w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="form-control w-full my-6">
              <label className="label" htmlFor="category">
                <span className="label-text">Category*</span>
              </label>
              <select
                id="category"
                {...register("category", { required: true })}
                className="select select-bordered"
                defaultValue="default"
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
              <label className="label" htmlFor="price">
                <span className="label-text">Price*</span>
              </label>
              <input
                type="number"
                id="price"
                {...register("price", { required: true })}
                placeholder="Price"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label" htmlFor="recipe">
              <span className="label-text">Ice Cream Recipe Details</span>
            </label>
            <textarea
              id="recipe"
              {...register("recipe", { required: true })}
              className="textarea textarea-bordered h-24"
              placeholder="Tell the worlds about your ice cream recipe"
            ></textarea>
          </div>

          <div className="form-control w-full my-6">
            <input
              {...register("image", { required: true })}
              type="file"
              className="file-input w-full max-w-xs"
            />
          </div>

          <button type="submit" className="btn bg-pink text-white px-6">
            Add Item <FaUtensils />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMenu;
