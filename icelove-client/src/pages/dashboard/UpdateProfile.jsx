import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthProvider';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [photoURL, setPhotoURL] = useState('');

  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // image hosting key
  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;


  // Function to handle file upload
  const uploadPhoto = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      // Assuming you have an endpoint to handle photo uploads
      const response = await axios.post(image_hosting_api, formData);
      return response.data.data.url;
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert('Failed to upload photo');
      return '';
    }
  };


  // Function to handle form submission
  const onSubmit = async (data) => {
    let updatedPhotoURL = photoURL;

    if (data.photoURL.length) {
      updatedPhotoURL = await uploadPhoto(data.photoURL[0]);
    }

    try {
      await axios.patch(`/users/${user._id}`, {
        name: data.name,
        photoURL: updatedPhotoURL,
      });

      // Call updateUserProfile to update profile in AuthContext
      await updateUserProfile(data.name, updatedPhotoURL);
      
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className='h-screen max-w-md mx-auto flex items-center justify-center'>
      <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <h3 className='font-bold'>Update Your Profile</h3>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="input input-bordered"
              defaultValue={user?.displayName || ''}
              {...register("name", { required: true })}
            />
            {errors.name && <span className="text-red-500">Name is required</span>}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Upload Photo</span>
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("photoURL")}
              onChange={(e) => setPhotoURL(e.target.files)}
              className="file-input w-full mt-1"
            />
          </div>

          <div className="form-control mt-6">
            <button
              type='submit'
              className="btn bg-pink text-white"
            >Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;
