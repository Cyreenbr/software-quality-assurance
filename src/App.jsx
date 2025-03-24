import './App.css';
import workImage from './assets/work.jpg'; // Import de l'image

function App() {
  return (
    <>
      <div className="card">
        <h1 className="read-the-docs">Tayy</h1>
        <h2 className="read-the-docs">Haya t7arrek e5dem ayy!!</h2>
        <img src={workImage} alt="Work" className="small-image" />

      </div>
    </>
  );
}

export default App;
