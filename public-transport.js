import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import the map component with no SSR to avoid window not defined errors
const MapWithNoSSR = dynamic(() => import('../components/RouteMap'), {
  ssr: false
});

export default function PublicTransport() {
  const [activeRoute, setActiveRoute] = useState('longwood');
  const [fareType, setFareType] = useState('adult');
  const [timetableData, setTimetableData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [journeyPlanner, setJourneyPlanner] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00'
  });
  const [journeyResults, setJourneyResults] = useState(null);
  const [showJourneyResults, setShowJourneyResults] = useState(false);
  const [activeTab, setActiveTab] = useState('timetables');
  
  // Ref for scrolling to results
  const resultsRef = useRef(null);
  
  useEffect(() => {
    // Fetch timetable data from API
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/timetable-data');
        const data = await response.json();
        setTimetableData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching timetable data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle journey planner form input changes
  const handleJourneyInputChange = (e) => {
    const { name, value } = e.target;
    setJourneyPlanner(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle journey planner form submission
  const handleJourneySubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would call an API to find routes
    // For now, we'll simulate some results based on the input
    
    // Get all stops from the timetable data
    const allStops = new Set();
    if (timetableData) {
      Object.values(timetableData.routes).forEach(route => {
        route.stops.forEach(stop => allStops.add(stop));
      });
    }
    
    // Check if from and to stops exist
    if (!allStops.has(journeyPlanner.from) || !allStops.has(journeyPlanner.to)) {
      setJourneyResults({
        error: "One or both of the selected stops are not valid. Please select valid stops."
      });
      setShowJourneyResults(true);
      return;
    }
    
    // Find routes that contain both stops
    const possibleRoutes = [];
    if (timetableData) {
      Object.entries(timetableData.routes).forEach(([routeId, route]) => {
        const fromIndex = route.stops.indexOf(journeyPlanner.from);
        const toIndex = route.stops.indexOf(journeyPlanner.to);
        
        if (fromIndex !== -1 && toIndex !== -1) {
          // Check if the route goes from -> to in the correct order
          if (fromIndex < toIndex) {
            // Direct route
            const weekdayTimes = route.schedules.weekday[journeyPlanner.from] || [];
            const saturdayTimes = route.schedules.saturday[journeyPlanner.from] || [];
            
            possibleRoutes.push({
              routeId,
              routeName: route.name,
              type: 'direct',
              fromStop: journeyPlanner.from,
              toStop: journeyPlanner.to,
              weekdayDepartures: weekdayTimes,
              saturdayDepartures: saturdayTimes,
              estimatedDuration: `${(toIndex - fromIndex) * 15} mins`,
              fare: calculateFare(fromIndex, toIndex, fareType)
            });
          }
        }
      });
    }
    
    // If no direct routes, try to find connections
    if (possibleRoutes.length === 0) {
      // Find routes that contain the 'from' stop
      const fromRoutes = [];
      const toRoutes = [];
      
      if (timetableData) {
        Object.entries(timetableData.routes).forEach(([routeId, route]) => {
          if (route.stops.includes(journeyPlanner.from)) {
            fromRoutes.push({ routeId, routeName: route.name });
          }
          if (route.stops.includes(journeyPlanner.to)) {
            toRoutes.push({ routeId, routeName: route.name });
          }
        });
      }
      
      // Find common interchange points
      const interchanges = ['Jamestown', 'Longwood']; // Common interchange points
      
      // For each from route and to route, check if they share an interchange
      fromRoutes.forEach(fromRoute => {
        const fromRouteStops = timetableData.routes[fromRoute.routeId].stops;
        
        toRoutes.forEach(toRoute => {
          const toRouteStops = timetableData.routes[toRoute.routeId].stops;
          
          interchanges.forEach(interchange => {
            if (fromRouteStops.includes(interchange) && toRouteStops.includes(interchange)) {
              // Found a connection via this interchange
              const fromIndex = fromRouteStops.indexOf(journeyPlanner.from);
              const interchangeIndexFrom = fromRouteStops.indexOf(interchange);
              const interchangeIndexTo = toRouteStops.indexOf(interchange);
              const toIndex = toRouteStops.indexOf(journeyPlanner.to);
              
              // Only add if the stops are in the correct order
              if (fromIndex < interchangeIndexFrom && interchangeIndexTo < toIndex) {
                const weekdayTimes = timetableData.routes[fromRoute.routeId].schedules.weekday[journeyPlanner.from] || [];
                const saturdayTimes = timetableData.routes[fromRoute.routeId].schedules.saturday[journeyPlanner.from] || [];
                
                possibleRoutes.push({
                  type: 'connection',
                  interchange,
                  firstRoute: {
                    routeId: fromRoute.routeId,
                    routeName: fromRoute.routeName,
                    fromStop: journeyPlanner.from,
                    toStop: interchange
                  },
                  secondRoute: {
                    routeId: toRoute.routeId,
                    routeName: toRoute.routeName,
                    fromStop: interchange,
                    toStop: journeyPlanner.to
                  },
                  weekdayDepartures: weekdayTimes,
                  saturdayDepartures: saturdayTimes,
                  estimatedDuration: `${(interchangeIndexFrom - fromIndex + toIndex - interchangeIndexTo) * 15 + 30} mins`,
                  fare: calculateFare(fromIndex, interchangeIndexFrom, fareType) + calculateFare(interchangeIndexTo, toIndex, fareType)
                });
              }
            }
          });
        });
      });
    }
    
    if (possibleRoutes.length > 0) {
      setJourneyResults({
        date: journeyPlanner.date,
        time: journeyPlanner.time,
        from: journeyPlanner.from,
        to: journeyPlanner.to,
        routes: possibleRoutes
      });
    } else {
      setJourneyResults({
        error: "No routes found between these stops. Please try different stops or check the timetables."
      });
    }
    
    setShowJourneyResults(true);
    
    // Scroll to results after a short delay to ensure they're rendered
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Helper function to calculate fare based on stop indices
  const calculateFare = (fromIndex, toIndex, type) => {
    const distance = Math.abs(toIndex - fromIndex);
    let fare;
    
    if (distance <= 2) {
      fare = timetableData.fares[type].up_to_3_miles;
    } else if (distance <= 4) {
      fare = timetableData.fares[type]['3_to_6_miles'];
    } else {
      fare = timetableData.fares[type].over_6_miles;
    }
    
    return fare;
  };

  // Get all stops for the journey planner
  const getAllStops = () => {
    const stops = new Set();
    if (timetableData) {
      Object.values(timetableData.routes).forEach(route => {
        route.stops.forEach(stop => stops.add(stop));
      });
    }
    return Array.from(stops).sort();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <Head>
        <title>Public Transport - St Helena Transit Hub</title>
        <meta name="description" content="View St Helena public transport timetables, routes, and fare information" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-blue-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/">
                <img src="/logo.png" alt="St Helena Transit Hub Logo" className="h-12 w-auto mr-3" />
              </Link>
              <h1 className="text-2xl font-bold">St Helena Transit Hub</h1>
            </div>
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li><Link href="/" className="hover:text-blue-200">Home</Link></li>
                <li><Link href="/taxi" className="hover:text-blue-200">Taxi</Link></li>
                <li><Link href="/car-hire" className="hover:text-blue-200">Car Hire</Link></li>
                <li><Link href="/public-transport" className="hover:text-blue-200 font-bold">Public Transport</Link></li>
                <li><Link href="/about" className="hover:text-blue-200">About</Link></li>
              </ul>
            </nav>
            <button className="md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-4">Public Transport Information</h1>
          <p className="text-gray-700 mb-6">
            View timetables, plan your journey, and check fare information for St Helena's public transport service.
          </p>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('timetables')}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'timetables'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Timetables
              </button>
              <button
                onClick={() => setActiveTab('journey')}
                className={`ml-8 py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'journey'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Journey Planner
              </button>
              <button
                onClick={() => setActiveTab('fares')}
                className={`ml-8 py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'fares'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Fares
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`ml-8 py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === 'map'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Route Map
              </button>
            </nav>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-800 mb-4"></div>
            <p className="text-gray-700">Loading timetable data...</p>
          </div>
        ) : timetableData ? (
          <>
            {/* Timetables Tab */}
            {activeTab === 'timetables' && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="bg-blue-800 text-white p-4">
                  <h2 className="text-xl font-bold">Bus Timetables</h2>
                </div>
                
                <div className="p-4 bg-blue-100">
                  <div className="flex flex-wrap">
                    {Object.keys(timetableData.routes).map(routeId => (
                      <button
                        key={routeId}
                        className={`mr-2 mb-2 px-4 py-2 rounded-lg ${
                          activeRoute === routeId
                            ? 'bg-blue-800 text-white'
                            : 'bg-white text-blue-800 border border-blue-800'
                        }`}
                        onClick={() => setActiveRoute(routeId)}
                      >
                        {timetableData.routes[routeId].name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-blue-800 mb-4">
                      {timetableData.routes[activeRoute].name} Timetable
                    </h3>
                    
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
                      <p className="text-yellow-700">
                        <strong>Note:</strong> The timetable information is loaded from the official St Helena Government website.
                        You can view the full PDF timetable by clicking the button below.
                      </p>
                    </div>
                    
                    <div className="text-center mb-6">
                      <a
                        href="/api/timetable-pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                      >
                        View Full Timetable PDF
                      </a>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                          <tr className="bg-blue-100">
                            <th className="py-3 px-4 border-b text-left">Stop</th>
                            <th className="py-3 px-4 border-b text-center">Monday-Friday</th>
                            <th className="py-3 px-4 border-b text-center">Saturday</th>
                          </tr>
                        </thead>
                        <tbody>
                          {timetableData.routes[activeRoute].stops.map(stop => (
                            <tr key={stop}>
                              <td className="py-3 px-4 border-b font-medium">{stop}</td>
                              <td className="py-3 px-4 border-b text-center">
                                {timetableData.routes[activeRoute].schedules.weekday[stop]?.join(', ') || '-'}
                              </td>
                              <td className="py-3 px-4 border-b text-center">
                                {timetableData.routes[activeRoute].schedules.saturday[stop]?.join(', ') || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-4">
                      * Timetable information is subject to change. Please check the official St Helena Government website for the most up-to-date information.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Journey Planner Tab */}
            {activeTab === 'journey' && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="bg-blue-800 text-white p-4">
                  <h2 className="text-xl font-bold">Journey Planner</h2>
                </div>
                
                <div className="p-6">
                  <form onSubmit={handleJourneySubmit} className="mb-6">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 mb-2" htmlFor="from">From</label>
                        <select
                          id="from"
                          name="from"
                          value={journeyPlanner.from}
                          onChange={handleJourneyInputChange}
                          required
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select departure stop</option>
                          {getAllStops().map(stop => (
                            <option key={`from-${stop}`} value={stop}>{stop}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2" htmlFor="to">To</label>
                        <select
                          id="to"
                          name="to"
                          value={journeyPlanner.to}
                          onChange={handleJourneyInputChange}
                          required
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select destination stop</option>
                          {getAllStops().map(stop => (
                            <option key={`to-${stop}`} value={stop}>{stop}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-gray-700 mb-2" htmlFor="date">Date</label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={journeyPlanner.date}
                          onChange={handleJourneyInputChange}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2" htmlFor="time">Time</label>
                        <input
                          type="time"
                          id="time"
                          name="time"
                          value={journeyPlanner.time}
                          onChange={handleJourneyInputChange}
                          required
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="bg-blue-800 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                      >
                        Find Routes
                      </button>
                    </div>
                  </form>
                  
                  {showJourneyResults && (
                    <div ref={resultsRef} className="mt-8 border-t pt-6">
                      <h3 className="text-xl font-bold text-blue-800 mb-4">Journey Results</h3>
                      
                      {journeyResults.error ? (
                        <div className="bg-red-100 border-l-4 border-red-500 p-4">
                          <p className="text-red-700">{journeyResults.error}</p>
                        </div>
                      ) : (
                        <div>
                          <div className="bg-blue-50 p-4 rounded-lg mb-6">
                            <p className="text-gray-700">
                              <span className="font-semibold">From:</span> {journeyResults.from}
                            </p>
                            <p className="text-gray-700">
                              <span className="font-semibold">To:</span> {journeyResults.to}
                            </p>
                            <p className="text-gray-700">
                              <span className="font-semibold">Date:</span> {new Date(journeyResults.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <p className="text-gray-700">
                              <span className="font-semibold">Time:</span> {journeyResults.time}
                            </p>
                          </div>
                          
                          <div className="space-y-6">
                            {journeyResults.routes.map((route, index) => (
                              <div key={index} className="border rounded-lg overflow-hidden">
                                <div className="bg-blue-100 p-4">
                                  <h4 className="font-bold text-blue-800">
                                    {route.type === 'direct' ? 'Direct Route' : 'Connection Route'}
                                  </h4>
                                </div>
                                
                                <div className="p-4">
                                  {route.type === 'direct' ? (
                                    <div>
                                      <p className="text-gray-700 mb-2">
                                        <span className="font-semibold">Route:</span> {route.routeName}
                                      </p>
                                      <p className="text-gray-700 mb-2">
                                        <span className="font-semibold">From:</span> {route.fromStop}
                                      </p>
                                      <p className="text-gray-700 mb-2">
                                        <span className="font-semibold">To:</span> {route.toStop}
                                      </p>
                                      <p className="text-gray-700 mb-2">
                                        <span className="font-semibold">Duration:</span> {route.estimatedDuration}
                                      </p>
                                      <p className="text-gray-700 mb-4">
                                        <span className="font-semibold">Fare:</span> £{route.fare.toFixed(2)}
                                      </p>
                                      
                                      <div className="bg-gray-100 p-3 rounded-lg mb-2">
                                        <p className="font-semibold text-gray-800 mb-1">Weekday Departures:</p>
                                        <p className="text-gray-700">
                                          {route.weekdayDepartures.length > 0 
                                            ? route.weekdayDepartures.join(', ') 
                                            : 'No weekday departures available'}
                                        </p>
                                      </div>
                                      
                                      <div className="bg-gray-100 p-3 rounded-lg">
                                        <p className="font-semibold text-gray-800 mb-1">Saturday Departures:</p>
                                        <p className="text-gray-700">
                                          {route.saturdayDepartures.length > 0 
                                            ? route.saturdayDepartures.join(', ') 
                                            : 'No Saturday departures available'}
                                        </p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      <p className="text-gray-700 mb-4">
                                        <span className="font-semibold">Connection via:</span> {route.interchange}
                                      </p>
                                      
                                      <div className="border-l-4 border-blue-500 pl-4 mb-4">
                                        <p className="font-semibold text-blue-800 mb-2">First Leg:</p>
                                        <p className="text-gray-700 mb-1">
                                          <span className="font-semibold">Route:</span> {route.firstRoute.routeName}
                                        </p>
                                        <p className="text-gray-700 mb-1">
                                          <span className="font-semibold">From:</span> {route.firstRoute.fromStop}
                                        </p>
                                        <p className="text-gray-700 mb-1">
                                          <span className="font-semibold">To:</span> {route.firstRoute.toStop}
                                        </p>
                                      </div>
                                      
                                      <div className="border-l-4 border-green-500 pl-4 mb-4">
                                        <p className="font-semibold text-green-800 mb-2">Second Leg:</p>
                                        <p className="text-gray-700 mb-1">
                                          <span className="font-semibold">Route:</span> {route.secondRoute.routeName}
                                        </p>
                                        <p className="text-gray-700 mb-1">
                                          <span className="font-semibold">From:</span> {route.secondRoute.fromStop}
                                        </p>
                                        <p className="text-gray-700 mb-1">
                                          <span className="font-semibold">To:</span> {route.secondRoute.toStop}
                                        </p>
                                      </div>
                                      
                                      <p className="text-gray-700 mb-2">
                                        <span className="font-semibold">Total Duration:</span> {route.estimatedDuration}
                                      </p>
                                      <p className="text-gray-700 mb-4">
                                        <span className="font-semibold">Total Fare:</span> £{route.fare.toFixed(2)}
                                      </p>
                                      
                                      <div className="bg-gray-100 p-3 rounded-lg mb-2">
                                        <p className="font-semibold text-gray-800 mb-1">Weekday Departures:</p>
                                        <p className="text-gray-700">
                                          {route.weekdayDepartures.length > 0 
                                            ? route.weekdayDepartures.join(', ') 
                                            : 'No weekday departures available'}
                                        </p>
                                      </div>
                                      
                                      <div className="bg-gray-100 p-3 rounded-lg">
                                        <p className="font-semibold text-gray-800 mb-1">Saturday Departures:</p>
                                        <p className="text-gray-700">
                                          {route.saturdayDepartures.length > 0 
                                            ? route.saturdayDepartures.join(', ') 
                                            : 'No Saturday departures available'}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Fares Tab */}
            {activeTab === 'fares' && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="bg-blue-800 text-white p-4">
                  <h2 className="text-xl font-bold">Fare Information</h2>
                </div>
                
                <div className="p-4 bg-blue-100">
                  <div className="flex">
                    <button
                      className={`flex-1 px-4 py-2 rounded-l-lg ${
                        fareType === 'adult'
                          ? 'bg-blue-800 text-white'
                          : 'bg-white text-blue-800 border border-blue-800'
                      }`}
                      onClick={() => setFareType('adult')}
                    >
                      Adult
                    </button>
                    <button
                      className={`flex-1 px-4 py-2 rounded-r-lg ${
                        fareType === 'child'
                          ? 'bg-blue-800 text-white'
                          : 'bg-white text-blue-800 border border-blue-800'
                      }`}
                      onClick={() => setFareType('child')}
                    >
                      Child (≤{timetableData.fares.child_age_limit} years)
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-blue-800 mb-4">
                      {fareType === 'adult' ? 'Adult' : 'Child'} Fares
                    </h3>
                    
                    <ul className="space-y-4">
                      <li className="flex justify-between items-center p-3 bg-blue-50 rounded">
                        <span>Up to 3 miles:</span>
                        <span className="font-bold">£{timetableData.fares[fareType].up_to_3_miles.toFixed(2)}</span>
                      </li>
                      <li className="flex justify-between items-center p-3 bg-blue-50 rounded">
                        <span>3 to 6 miles:</span>
                        <span className="font-bold">£{timetableData.fares[fareType]['3_to_6_miles'].toFixed(2)}</span>
                      </li>
                      <li className="flex justify-between items-center p-3 bg-blue-50 rounded">
                        <span>Over 6 miles:</span>
                        <span className="font-bold">£{timetableData.fares[fareType].over_6_miles.toFixed(2)}</span>
                      </li>
                    </ul>
                    
                    <div className="mt-6">
                      <h4 className="font-bold text-blue-800 mb-2">Fare Calculator</h4>
                      <div className="bg-gray-100 p-4 rounded-lg">
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-gray-700 mb-2" htmlFor="calcFrom">From</label>
                            <select
                              id="calcFrom"
                              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select departure stop</option>
                              {getAllStops().map(stop => (
                                <option key={`calc-from-${stop}`} value={stop}>{stop}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-gray-700 mb-2" htmlFor="calcTo">To</label>
                            <select
                              id="calcTo"
                              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select destination stop</option>
                              {getAllStops().map(stop => (
                                <option key={`calc-to-${stop}`} value={stop}>{stop}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <button
                          className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-700 transition-colors duration-300"
                        >
                          Calculate Fare
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-sm text-gray-700">
                      <p>All customers who use the 'hop on, hop off' services are asked to ensure that they take a ticket when paying for their journey.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Map Tab */}
            {activeTab === 'map' && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="bg-blue-800 text-white p-4">
                  <h2 className="text-xl font-bold">Route Map</h2>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Select Route to Display</label>
                    <select
                      value={activeRoute}
                      onChange={(e) => setActiveRoute(e.target.value)}
                      className="w-full md:w-auto p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.keys(timetableData.routes).map(routeId => (
                        <option key={`map-${routeId}`} value={routeId}>
                          {timetableData.routes[routeId].name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="h-96 rounded-lg overflow-hidden border border-gray-300 mb-4">
                    <MapWithNoSSR 
                      route={timetableData.routes[activeRoute]} 
                      center={[-15.9650, -5.7089]} 
                      zoom={11} 
                    />
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-bold text-blue-800 mb-2">Route Stops</h3>
                    <ul className="space-y-1">
                      {timetableData.routes[activeRoute].stops.map((stop, index) => (
                        <li key={`stop-${index}`} className="flex items-center">
                          <span className="w-6 h-6 bg-blue-800 text-white rounded-full flex items-center justify-center mr-2 text-xs">
                            {index + 1}
                          </span>
                          {stop}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">
              <strong>Error:</strong> Unable to load timetable data. Please try again later.
            </p>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-800 text-white p-4">
            <h2 className="text-xl font-bold">Other Transport Options</h2>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-blue-100 p-4">
                  <h3 className="font-bold text-blue-800">Need a Taxi?</h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 mb-4">
                    If the bus schedule doesn't suit your needs, consider booking a taxi for more flexibility.
                  </p>
                  <Link href="/taxi" className="inline-block bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300">
                    Book a Taxi
                  </Link>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-blue-100 p-4">
                  <h3 className="font-bold text-blue-800">Explore at Your Own Pace</h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 mb-4">
                    Want complete freedom to explore St Helena? Hire a car and create your own itinerary.
                  </p>
                  <Link href="/car-hire" className="inline-block bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300">
                    Hire a Car
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-blue-900 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">St Helena Transit Hub</h3>
              <p className="text-blue-200">
                Your comprehensive transport solution for St Helena Island.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/taxi" className="text-blue-200 hover:text-white">Taxi Booking</Link></li>
                <li><Link href="/car-hire" className="text-blue-200 hover:text-white">Car Hire</Link></li>
                <li><Link href="/public-transport" className="text-blue-200 hover:text-white">Public Transport</Link></li>
                <li><Link href="/about" className="text-blue-200 hover:text-white">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-blue-200">Phone: 00290 22470</li>
                <li className="text-blue-200">Email: info@sthelenastransit.sh</li>
                <li className="text-blue-200">Address: Jamestown, St Helena Island</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-200 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-blue-200 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-blue-200 hover:text-white">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-blue-800 text-center">
            <p className="text-blue-200">© 2025 St Helena Transit Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
