import { useState, useEffect, use } from "react";
import { url } from "zod";

export default function useFetch() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const response = await fetch(url, { signal: controller.signal });
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }
        setError(error);
        setLoading(false);
      }
    };
    // cleanup
    fetchData();

    return () => controller.abort();
  }, [url, schema]);

  return {
    data,
    loading,
    error,
  };
}
