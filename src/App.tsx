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
    // <div className="border border-amber-400 p-12 border-dashed w-[600px]">
    <div className="module-border-wrap">
      <div className="module">
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
    </div>
  );
}

export default App;
