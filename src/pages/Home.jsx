import React, { useState } from "react";
import workImage from "../assets/work.jpg"; // Import the image

function Home() {
    // State to handle the message
    const [message, setMessage] = useState("");

    // Function to handle button click
    const handleClick = () => {
        setMessage("Yezzi bla la3b dherr w t7arrek e5dem 😡😡");

        // Clear the message after 7 seconds
        setTimeout(() => {
            setMessage("");
        }, 7000); // 7000ms = 7 seconds
    };

    return (
        <>
            <div className="flex items-center justify-center mt-50">
                <div className="bg-white shadow-xl rounded-2xl p-6 text-center max-w-sm w-full">
                    <h1 className="text-2xl font-extrabold text-gray-800">Tayy</h1>
                    <h2 className="text-3xl text-gray-600 mt-2">Haya t7arrek e5dem ayy!!</h2>


                    <img
                        src={workImage}
                        alt="Work"
                        className="w-40 h-40 mx-auto mt-4 rounded-lg"
                    />
                    {message && (
                        <h2 className="text-3xl text-green-600 mt-4">{message}</h2>
                    )}
                    <button
                        onClick={handleClick}
                        className="bg-blue-600 text-white cursor-pointer text-xl font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 mt-6"
                    >
                        Click
                    </button>
                </div>
            </div>
        </>
    );
}

export default Home;