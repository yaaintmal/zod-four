import { useState, useEffect } from "react";

export type Product = typeof ProductSchema;

// importing new schema
import { CatFactsApiResponseSchema } from "../schema/CatFact";
import { z } from "zod"; // zoddy zod

const API_URL = import.meta.env.VITE_API_URL;

export default function CatNews() {
  const [fact, setFact] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchFact = async () => {
      try {
        const res = await fetch(API_URL);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const apiResponse = await res.json();
        console.log("the catty api responded:", apiResponse);

        const validatedResponse = CatFactsApiResponseSchema.parse(apiResponse);
        const factArray = validatedResponse.data;

        if (Array.isArray(factArray) && factArray.length > 0) {
          const randomIndex = Math.floor(Math.random() * factArray.length);
          const randomFactText = factArray[randomIndex].fact;

          setFact(randomFactText);
        } else {
          setFact("No catfacts found 😿");
        }
      } catch (err) {
        console.error("Fetch error 🙀:", err);
        let errorMessage = "I just can't handle dis ish.. 😿";

        if (err instanceof z.ZodError) {
          errorMessage = `Data validation failed: ${err.issues
            .map((e) => e.path.join(".") + ": " + e.message)
            .join("; ")}`;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === "string") {
          errorMessage = err;
        }

        setError(errorMessage);
        setFact("Failed to load fact. 😿");
      } finally {
        setLoading(false);
      }
    };

    fetchFact();
  }, []);

  if (loading) {
    return <h2>Loading a random cat fact... 😻🐈</h2>;
  }

  if (error) {
    return <h2>Error fetching fact: {error} 😿</h2>;
  }

  return (
    <>
      <div className="capitalize text-sm">Did you know?</div>
      <p className="font-bold italic tracking-wide text-trans bg-gradient-to-bl from-amber-100 via-amber-200 to-amber-400 bg-clip-text">
        {fact}
      </p>
      <h2 className="text-amber-100 font-light lowercase tracking-widest text-shadow-xs text-xs drop-shadow-lg text-right pt-2">
        Random Cat Fact
      </h2>
    </>
  );
}
