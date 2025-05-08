import React, { useState, useEffect, useRef } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [isSimulatorRunning, setIsSimulatorRunning] = useState(false);
  const [historicalData, setHistoricalData] = useState([]);
  const [timeRange, setTimeRange] = useState({ startDate: '', endDate: '' });
  const [activeTab, setActiveTab] = useState('realtime');
  const [isLoading, setIsLoading] = useState(false);
  const eventSourceRef = useRef(null);

  // Control simulator
  const controlSimulator = async (action) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3001/api/control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });
      const data = await response.json();
      setIsSimulatorRunning(action === 'start');
    } catch (error) {
      console.error('Error controlling simulator:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch historical data
  const fetchHistoricalData = async () => {
    try {
      setIsLoading(true);
      let url = 'http://localhost:3001/api/historical';
      if (timeRange.startDate && timeRange.endDate) {
        url += `?startDate=${timeRange.startDate}&endDate=${timeRange.endDate}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setHistoricalData(data.data);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check simulator status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3001/api/status');
        const data = await response.json();
        setIsSimulatorRunning(data.isRunning);
      } catch (error) {
        console.error('Error checking simulator status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkStatus();
  }, []);

  // SSE connection
  useEffect(() => {
    if (isSimulatorRunning) {
      eventSourceRef.current = new EventSource('http://localhost:3001/sse');

      eventSourceRef.current.onmessage = (e) => {
        const newData = JSON.parse(e.data);
        setWeatherData(prev => [...prev.slice(-29), newData]); // Keep last 30 readings
      };

      eventSourceRef.current.onerror = () => {
        console.log('SSE connection error');
        eventSourceRef.current?.close();
      };

      return () => {
        eventSourceRef.current?.close();
      };
    }
  }, [isSimulatorRunning]);

  // Chart data configurations
  const temperatureData = {
    labels: weatherData.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: weatherData.map(d => parseFloat(d.temperature)),
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3,
        fill: true,
        borderWidth: 2
      }
    ]
  };

  const currentReadingsData = {
    labels: ['Humidity', 'Wind Speed', 'Rainfall'],
    datasets: [
      {
        label: 'Current Values',
        data: weatherData.length > 0 ? [
          parseFloat(weatherData[weatherData.length - 1].humidity),
          parseFloat(weatherData[weatherData.length - 1].windSpeed),
          parseFloat(weatherData[weatherData.length - 1].rainfall)
        ] : [0, 0, 0],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(139, 92, 246, 0.7)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(139, 92, 246, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const historicalChartData = {
    labels: historicalData.slice(0, 50).map(d => new Date(d.timestamp).toLocaleString()),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: historicalData.slice(0, 50).map(d => d.temperature),
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        yAxisID: 'y',
        borderWidth: 2
      },
      {
        label: 'Humidity (%)',
        data: historicalData.slice(0, 50).map(d => d.humidity),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        yAxisID: 'y1',
        borderWidth: 2
      }
    ]
  };

  const getWeatherIcon = (temp, rainfall) => {
    if (rainfall > 5) return '🌧️';
    if (temp > 30) return '☀️';
    if (temp < 15) return '❄️';
    return '⛅';
  };

  const getWeatherColor = (temp) => {
    if (temp > 30) return 'bg-red-100 border-red-300';
    if (temp < 15) return 'bg-blue-100 border-blue-300';
    return 'bg-yellow-100 border-yellow-300';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Weather Simulator </h1>
          <p className="text-gray-600">Real-time and historical weather data visualization</p>
        </header>

        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Simulator Control</h2>
              <p className="text-gray-600">
                Status: <span className={`font-medium ${isSimulatorRunning ? 'text-green-600' : 'text-red-600'}`}>
                  {isSimulatorRunning ? 'Running' : 'Stopped'}
                </span>
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => controlSimulator('start')}
                disabled={isSimulatorRunning || isLoading}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${isSimulatorRunning || isLoading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
              >
                {isLoading ? 'Processing...' : 'Start Simulator'}
              </button>
              <button
                onClick={() => controlSimulator('stop')}
                disabled={!isSimulatorRunning || isLoading}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${!isSimulatorRunning || isLoading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
              >
                {isLoading ? 'Processing...' : 'Stop Simulator'}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('realtime')}
            className={`px-4 py-2 font-medium ${activeTab === 'realtime' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Real-time Data
          </button>
          <button
            onClick={() => setActiveTab('historical')}
            className={`px-4 py-2 font-medium ${activeTab === 'historical' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Historical Data
          </button>
        </div>

        {activeTab === 'realtime' ? (
          <>
            {/* Current Weather Card */}
            <div className={`rounded-xl shadow-md overflow-hidden mb-8 transition-all ${weatherData.length > 0 ? getWeatherColor(weatherData[weatherData.length - 1].temperature) : 'bg-white'}`}>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Weather</h2>
                {weatherData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-6xl mb-2">
                        {getWeatherIcon(
                          weatherData[weatherData.length - 1].temperature,
                          weatherData[weatherData.length - 1].rainfall
                        )}
                      </span>
                      <p className="text-3xl font-bold">
                        {weatherData[weatherData.length - 1].temperature}°C
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/80 p-3 rounded-lg shadow-sm">
                        <p className="text-gray-500 text-sm">Humidity</p>
                        <p className="text-xl font-semibold">
                          {weatherData[weatherData.length - 1].humidity}%
                        </p>
                      </div>
                      <div className="bg-white/80 p-3 rounded-lg shadow-sm">
                        <p className="text-gray-500 text-sm">Wind Speed</p>
                        <p className="text-xl font-semibold">
                          {weatherData[weatherData.length - 1].windSpeed} km/h
                        </p>
                      </div>
                      <div className="bg-white/80 p-3 rounded-lg shadow-sm">
                        <p className="text-gray-500 text-sm">Rainfall</p>
                        <p className="text-xl font-semibold">
                          {weatherData[weatherData.length - 1].rainfall} mm
                        </p>
                      </div>
                      <div className="bg-white/80 p-3 rounded-lg shadow-sm">
                        <p className="text-gray-500 text-sm">Last Update</p>
                        <p className="text-sm font-medium">
                          {new Date(weatherData[weatherData.length - 1].timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No data available. Start the simulator to begin receiving data.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Real-time Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Temperature Trend</h3>
                <div className="h-64">
                  <Line
                    data={temperatureData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        tooltip: {
                          mode: 'index',
                          intersect: false,
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: false
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Readings</h3>
                <div className="h-64">
                  <Bar
                    data={currentReadingsData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Historical Data</h2>
            
            {/* Date Range Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="datetime-local"
                  value={timeRange.startDate}
                  onChange={(e) => setTimeRange({...timeRange, startDate: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="datetime-local"
                  value={timeRange.endDate}
                  onChange={(e) => setTimeRange({...timeRange, endDate: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={fetchHistoricalData}
                  disabled={isLoading}
                  className={`w-full py-2 px-4 rounded-lg font-medium ${isLoading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  {isLoading ? 'Loading...' : 'Fetch Data'}
                </button>
              </div>
            </div>

            {/* Historical Chart */}
            {historicalData.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Historical Trends</h3>
                <div className="h-96">
                  <Line
                    data={historicalChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      interaction: {
                        mode: 'index',
                        intersect: false,
                      },
                      plugins: {
                        legend: {
                          position: 'top',
                        }
                      },
                      scales: {
                        y: {
                          type: 'linear',
                          display: true,
                          position: 'left',
                        },
                        y1: {
                          type: 'linear',
                          display: true,
                          position: 'right',
                          grid: {
                            drawOnChartArea: false,
                          },
                        },
                      }
                    }}
                  />
                </div>
                
                {/* Data Table (simplified) */}
                <div className="mt-8 overflow-x-auto">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Records</h3>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temp (°C)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humidity (%)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wind (km/h)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rain (mm)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {historicalData.slice(0, 10).map((record, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(record.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {record.temperature}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.humidity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.windSpeed}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.rainfall}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {timeRange.startDate && timeRange.endDate 
                    ? "No data found for the selected date range." 
                    : "Select a date range and click 'Fetch Data' to view historical records."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;