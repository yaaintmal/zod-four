// import { useState } from "react";
import "./App.css";
import CatNews from "./components/CatNews";
import BlurText from "./helper/BlurText";
const handleAnimationComplete = () => {
  console.log("Animation completed!");
};

function App() {
  // const [count, setCount] = useState(0);

  return (
    <div>
      <div className="font-bold text-2xl text-amber-400">
        <h1>zod four</h1>
      </div>
      <div className="flex justify-center p-4">
        <BlurText
          text="your resource for independent cat news"
          delay={150}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="text-xl mb-8"
        />
      </div>
      <CatNews />
    </div>
  );
}

export default App;
