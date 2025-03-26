import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import TrailCard from "./TrailCard";
import Navbar from "./Navbar";
import TrailLogForm from "./TrailLogForm"; // hypothetical form component
import NotFound from "./NotFound"; // hypothetical 404 component
import { getTrails } from "./api";

function App() {
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getTrails();
      setTrails(data);
    }
    fetchData();
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard trails={trails} />} />
        <Route path="/log" element={<TrailLogForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
