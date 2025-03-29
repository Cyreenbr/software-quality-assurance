import "./App.css";
import workImage from "./assets/work.jpg"; // Import de l'image

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white shadow-lg rounded-2xl p-6 text-center max-w-sm">
        <h1 className="text-2xl font-extrabold text-gray-800">Tayy</h1>
        <h2 className="text-gray-600 mt-2">Haya t7arrek e5dem ayy!!</h2>
        <img
          src={workImage}
          alt="Work"
          className="w-40 h-40 mx-auto mt-4 rounded-lg object-cover"
        />
        <h1 className="text-4xl text-blue-600 underline hover:cursor-pointer mt-4">
          Hello world with Tailwind CSS!
        </h1>
      </div>
    </div>
  );
}

export default App;
