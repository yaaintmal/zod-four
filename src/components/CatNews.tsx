import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function CatNews() {
  const [fact, setFact] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>("null");

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

        const factArray = apiResponse.data;

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
        if (err instanceof Error) {
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
      <div>Did you know?</div>
      <p style={{ fontStyle: "italic", fontWeight: "bold" }}>{fact}</p>
      <h2 className="text-amber-100 lowercase tracking-widest text-shadow-xs text-xs drop-shadow-lg text-right pt-2">
        Random Cat Fact
      </h2>
    </>
  );
}
