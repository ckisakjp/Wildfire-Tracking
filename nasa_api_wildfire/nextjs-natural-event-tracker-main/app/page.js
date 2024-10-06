"use client";

import { useState, useEffect } from "react";
import Map from "@/components/map";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [eventType, setEventType] = useState("wildfires"); // Set default to wildfires
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Define categories directly
  const categories = [
    { id: "wildfires", title: "Wildfires" },
    
  ];

  // Fetch events based on the selected category
  async function getEvents() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://eonet.gsfc.nasa.gov/api/v3/events?category=${eventType}`
      );
      const data = await res.json();
      setEvents(data.events);
    } catch (err) {
      setError("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getEvents();
  }, [eventType]);

  function handleSubmit(e) {
    e.preventDefault();
    getEvents();
  }

  return (
    <div>
      <div className="absolute top-6 right-6 z-[1000]">
        <form onSubmit={handleSubmit}>
          <select
            name="eventType"
            id="eventType"
            className="bg-neutral-200 text-neutral-800 text-sm font-semibold p-2 rounded-lg outline-none border-none focus:ring-2 focus:ring-neutral-600 transition shadow"
            onChange={(e) => setEventType(e.target.value)}
            value={eventType}
          >
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
                className="text-neutral-800 text-sm font-semibold"
              >
                {category.title}
              </option>
            ))}
          </select>
        </form>
      </div>

      {loading && <p>Loading events...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <Map events={events} />
    </div>
  );
}
