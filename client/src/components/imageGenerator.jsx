import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './imageGenerator.css';
import axios from 'axios';


export const ImageGenerator = () => {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [isImageGenerating, setIsImageGenerating] = useState(false);
    const [userPrompt, setUserPrompt] = useState('');
    const [userImgQuantity, setUserImgQuantity] = useState(4); // Default value is 4
    const [imageGallery, setImageGallery] = useState([
        { id: 1, src: 'img-1.jpg', alt: 'image 1' },
        { id: 2, src: 'img-2.jpg', alt: 'image 2' },
        { id: 3, src: 'img-3.jpg', alt: 'image 3' },
        { id: 4, src: 'img-4.jpg', alt: 'image 4' },
    ]);



    const updateImageCard = (imgDataArray) => {
        setImageGallery(
            imgDataArray.map((imgObject, index) => ({
                id: index + 1,
                src: `data:image/jpeg;base64,${imgObject.b64_json}`,
                alt: `AI generated image ${index + 1}`
            }))
        );
    };

    const generateAiImages = async () => {

        try {
            const response = await axios.post(`${import.meta.env.VITE_PROD_BASE_URL}${import.meta.env.VITE_GENERATE_IMAGES_API}`, {
                prompt: userPrompt,
                n: userImgQuantity,
            });


            const { data } = response.data;
            updateImageCard([...data]);

        } catch (error) {

            if (error.response && error.response.status === 400) {
                showToast(error.response.data.error);


            } else if (error.response && error.response.status === 500) {
                showToast(error.response.data.error);

            } else
                showToast("Seems somethig wrong with the Server, try again later");


        } finally {
            setIsImageGenerating(false);
        }
    };

    const showToast = (message) => {
        toast.error('😨 Oops !! ' + message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const handleImageGeneration = async (e) => {
        e.preventDefault();
        if (isImageGenerating) return;

        setUserPrompt(e.target[0].value);
        setUserImgQuantity(parseInt(e.target[1].value, 10));

        setIsImageGenerating(true);

        try {
            await generateAiImages();
        } catch (error) {
        }
    };

    const handleDownload = (image) => {
        const link = document.createElement('a');
        link.href = image.src;
        link.download = `generated_image_${image.id}.jpg`;
        link.click();
    };

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []); // Empty dependency array ensures the effect runs once on mount




    return (
        <div className="wrapper">
            <section className="image-generator">
                <div className="content">
                    <h1>AI Image Generator Tool with React</h1>
                    <p>
                        Easily transform your text into captivating images in seconds
                        using this React-powered AI Image Generator tool.
                    </p>
                    <form className="generate-form" onSubmit={handleImageGeneration}>
                        <input
                            className="prompt-input"
                            type="text"
                            placeholder="Describe what you want to see"
                            required=""
                            value={userPrompt}
                            onChange={(e) => setUserPrompt(e.target.value)}
                        />
                        <div className="controls">
                            <select
                                className="img-quantity"
                                value={userImgQuantity}
                                onChange={(e) => setUserImgQuantity(parseInt(e.target.value, 10))}
                            >
                                <option value={1}>1 Image</option>
                                <option value={2}>2 Images</option>
                                <option value={3}>3 Images</option>
                                <option value={4}>4 Images</option>
                            </select>
                            <button type="submit" className="generate-btn" disabled={isImageGenerating}>
                                {isImageGenerating ? "Generating" : "Generate"}
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <section className="image-gallery">
                {imageGallery.map((image) => (

                    <div className="imageContainer" key={image.id}>
                        <div className="img-card">
                            <img src={image.src} alt={image.alt} />
                            <div className="download-btn">
                                <div onClick={() => handleDownload(image)}>
                                    <img src="download.svg" alt="download icon" />
                                </div>
                            </div>
                        </div>
                        <div className="loading">
                            <div className={isImageGenerating ? "loading-bar-full" : "loading-bar"}></div>
                        </div>
                    </div>


                ))}
                <ToastContainer />
            </section>

            <section className='footerSection'>
                <div className="footer">
                    <hr />
                    <p>&copy; Made by Ghizlane ❤ <span> {currentYear} </span> </p>
                    <hr />
                </div>
            </section>
        </div>
    );
};
