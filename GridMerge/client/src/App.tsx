import { useEffect } from "react";
import Game2048 from "./components/Game2048";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";

function App() {
  const { setHitSound, setSuccessSound } = useAudio();

  useEffect(() => {
    // Initialize audio assets
    const hitAudio = new Audio("/sounds/hit.mp3");
    const successAudio = new Audio("/sounds/success.mp3");
    
    setHitSound(hitAudio);
    setSuccessSound(successAudio);
  }, [setHitSound, setSuccessSound]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <Game2048 />
    </div>
  );
}

export default App;
