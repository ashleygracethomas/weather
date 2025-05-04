import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/flowapi";

const FlowsList = () => {
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlows = async () => {
      try {
        const data = await api.listFlows();
        setFlows(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching flows:", error);
        setLoading(false);
      }
    };

    fetchFlows();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Your Flowcharts</h1>
      <Link
        to="/flowchart"
        className="inline-block px-4 py-2 mb-4 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Create New Flow
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flows.map((flow) => (
          <div
            key={flow._id}
            className="p-4 bg-white border border-gray-300 rounded"
          >
            <h3 className="text-lg font-semibold">{flow.name}</h3>
            <p className="text-gray-600">{flow.description}</p>
            <div className="mt-2">
              <Link
                to={`/flow/${flow._id}`}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowsList;
