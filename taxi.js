import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function TaxiBooking() {
  // Form state
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    pickupTime: '',
    passengers: 1,
    vehicleType: 'sedan',
    specialRequirements: '',
    name: '',
    phone: '',
    email: ''
  });

  // UI state
  const [step, setStep] = useState(1);
  const [fareEstimate, setFareEstimate] = useState(null);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  // Landmarks for pickup/dropoff locations
  const landmarks = [
    'Jamestown Wharf',
    'Longwood House',
    'Airport',
    'Half Tree Hollow',
    'St Pauls Cathedral',
    'Sandy Bay Beach',
    'Blue Hill',
    'Levelwood',
    'Plantation House',
    'Diana\'s Peak',
    'High Knoll Fort',
    'Ladder Hill',
    'Rosemary Plain',
    'The Briars'
  ];

  // Mock taxi operators data
  const operators = [
    {
      id: 1,
      name: 'John Smith',
      rating: 4.8,
      vehicle: 'Toyota Corolla',
      vehicleType: 'sedan',
      licensePlate: 'SH 1234',
      photo: '/driver1.jpg',
      available: true
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      rating: 4.9,
      vehicle: 'Honda CR-V',
      vehicleType: 'suv',
      licensePlate: 'SH 5678',
      photo: '/driver2.jpg',
      available: true
    },
    {
      id: 3,
      name: 'Michael Brown',
      rating: 4.7,
      vehicle: 'Toyota Hiace',
      vehicleType: 'minivan',
      licensePlate: 'SH 9012',
      photo: '/driver3.jpg',
      available: true
    }
  ];

  // Calculate fare estimate based on locations
  useEffect(() => {
    if (formData.pickupLocation && formData.dropoffLocation && formData.vehicleType) {
      // In a real app, this would be an API call to calculate distance and fare
      // For now, we'll use a simple mock calculation
      const baseRate = formData.vehicleType === 'sedan' ? 3.50 : 
                      formData.vehicleType === 'suv' ? 4.50 : 5.50;
      
      // Simple distance simulation based on location names
      const locationPairs = {
        'Jamestown Wharf-Airport': 8.5,
        'Jamestown Wharf-Longwood House': 5.2,
        'Jamestown Wharf-Half Tree Hollow': 2.1,
        'Airport-Longwood House': 3.4,
        // Add more pairs as needed
      };
      
      // Default distance if pair not found
      let distance = 5;
      
      // Check if we have this pair in our mapping
      const pair1 = `${formData.pickupLocation}-${formData.dropoffLocation}`;
      const pair2 = `${formData.dropoffLocation}-${formData.pickupLocation}`;
      
      if (locationPairs[pair1]) {
        distance = locationPairs[pair1];
      } else if (locationPairs[pair2]) {
        distance = locationPairs[pair2];
      }
      
      // Calculate fare
      const fare = baseRate + (distance * 0.80);
      setFareEstimate(fare.toFixed(2));
      
      // Filter available drivers based on vehicle type
      const filtered = operators.filter(op => 
        op.vehicleType === formData.vehicleType && op.available
      );
      setAvailableDrivers(filtered);
    }
  }, [formData.pickupLocation, formData.dropoffLocation, formData.vehicleType]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle driver selection
  const handleDriverSelect = (driver) => {
    setSelectedDriver(driver);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, this would be an API call to submit the booking
    // For now, we'll simulate a successful booking after a delay
    setTimeout(() => {
      // Generate a random booking reference
      const reference = 'TX' + Math.floor(100000 + Math.random() * 900000);
      setBookingReference(reference);
      setBookingComplete(true);
      setIsSubmitting(false);
    }, 1500);
  };

  // Reset booking form
  const resetBooking = () => {
    setFormData({
      pickupLocation: '',
      dropoffLocation: '',
      pickupDate: '',
      pickupTime: '',
      passengers: 1,
      vehicleType: 'sedan',
      specialRequirements: '',
      name: '',
      phone: '',
      email: ''
    });
    setStep(1);
    setFareEstimate(null);
    setSelectedDriver(null);
    setBookingComplete(false);
    setBookingReference('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <Head>
        <title>Taxi Booking - St Helena Transit Hub</title>
        <meta name="description" content="Book a taxi on St Helena Island" />
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
                <li><Link href="/taxi" className="hover:text-blue-200 font-bold">Taxi</Link></li>
                <li><Link href="/car-hire" className="hover:text-blue-200">Car Hire</Link></li>
                <li><Link href="/public-transport" className="hover:text-blue-200">Public Transport</Link></li>
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
          <h1 className="text-3xl font-bold text-blue-800 mb-4">Taxi Booking</h1>
          <p className="text-gray-700 mb-6">
            Book a taxi for your journey around St Helena Island. Our reliable taxi operators will get you to your destination safely and comfortably.
          </p>
        </div>

        {bookingComplete ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Booking Confirmed!</h2>
            <p className="text-gray-700 mb-2">Your taxi has been booked successfully.</p>
            <p className="text-gray-700 mb-6">Your booking reference is: <span className="font-bold">{bookingReference}</span></p>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6 max-w-md mx-auto text-left">
              <h3 className="font-bold text-blue-800 mb-2">Booking Details</h3>
              <p className="text-gray-700"><span className="font-semibold">Pickup:</span> {formData.pickupLocation}</p>
              <p className="text-gray-700"><span className="font-semibold">Dropoff:</span> {formData.dropoffLocation}</p>
              <p className="text-gray-700"><span className="font-semibold">Date:</span> {formData.pickupDate}</p>
              <p className="text-gray-700"><span className="font-semibold">Time:</span> {formData.pickupTime}</p>
              <p className="text-gray-700"><span className="font-semibold">Passengers:</span> {formData.passengers}</p>
              <p className="text-gray-700"><span className="font-semibold">Vehicle:</span> {formData.vehicleType.charAt(0).toUpperCase() + formData.vehicleType.slice(1)}</p>
              <p className="text-gray-700"><span className="font-semibold">Driver:</span> {selectedDriver?.name}</p>
              <p className="text-gray-700"><span className="font-semibold">Estimated Fare:</span> £{fareEstimate}</p>
            </div>
            
            <p className="text-gray-700 mb-6">
              You will receive a confirmation email shortly. Your driver will contact you before pickup.
            </p>
            
            <button 
              onClick={resetBooking}
              className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Book Another Taxi
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-800 text-white p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Book Your Taxi</h2>
                <div className="flex">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 1 ? 'bg-white text-blue-800' : 'bg-blue-700 text-white'}`}>1</div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 2 ? 'bg-white text-blue-800' : 'bg-blue-700 text-white'}`}>2</div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-white text-blue-800' : 'bg-blue-700 text-white'}`}>3</div>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {step === 1 && (
                <div>
                  <h3 className="text-lg font-bold text-blue-800 mb-4">Journey Details</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="pickupLocation">Pickup Location</label>
                      <select
                        id="pickupLocation"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select pickup location</option>
                        {landmarks.map(landmark => (
                          <option key={`pickup-${landmark}`} value={landmark}>{landmark}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="dropoffLocation">Dropoff Location</label>
                      <select
                        id="dropoffLocation"
                        name="dropoffLocation"
                        value={formData.dropoffLocation}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select dropoff location</option>
                        {landmarks.map(landmark => (
                          <option key={`dropoff-${landmark}`} value={landmark}>{landmark}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="pickupDate">Pickup Date</label>
                      <input
                        type="date"
                        id="pickupDate"
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="pickupTime">Pickup Time</label>
                      <input
                        type="time"
                        id="pickupTime"
                        name="pickupTime"
                        value={formData.pickupTime}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="passengers">Number of Passengers</label>
                      <input
                        type="number"
                        id="passengers"
                        name="passengers"
                        value={formData.passengers}
                        onChange={handleChange}
                        required
                        min="1"
                        max="8"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="vehicleType">Vehicle Type</label>
                      <select
                        id="vehicleType"
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="sedan">Sedan (up to 4 passengers)</option>
                        <option value="suv">SUV (up to 5 passengers)</option>
                        <option value="minivan">Minivan (up to 8 passengers)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="specialRequirements">Special Requirements</label>
                    <textarea
                      id="specialRequirements"
                      name="specialRequirements"
                      value={formData.specialRequirements}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Any special requirements or notes for the driver"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                  
                  {fareEstimate && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      <h4 className="font-bold text-blue-800 mb-2">Fare Estimate</h4>
                      <p className="text-gray-700">Estimated fare for your journey: <span className="font-bold">£{fareEstimate}</span></p>
                      <p className="text-sm text-gray-600 mt-2">This is an estimate. Actual fare may vary based on waiting time and exact route taken.</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!formData.pickupLocation || !formData.dropoffLocation || !formData.pickupDate || !formData.pickupTime}
                      className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400"
                    >
                      Next: Select Driver
                    </button>
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div>
                  <h3 className="text-lg font-bold text-blue-800 mb-4">Select Driver</h3>
                  
                  {availableDrivers.length > 0 ? (
                    <div className="space-y-4 mb-6">
                      {availableDrivers.map(driver => (
                        <div 
                          key={driver.id}
                          onClick={() => handleDriverSelect(driver)}
                          className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                            selectedDriver?.id === driver.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 flex-shrink-0">
                              {/* Driver photo would go here */}
                              <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                </svg>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800">{driver.name}</h4>
                              <div className="flex items-center text-yellow-500 mb-1">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className={`w-4 h-4 ${i < Math.floor(driver.rating) ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                  </svg>
                                ))}
                                <span className="text-gray-700 ml-1">{driver.rating}</span>
                              </div>
                              <p className="text-gray-600">{driver.vehicle} ({driver.licensePlate})</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
                      <p className="text-yellow-700">
                        No drivers available for the selected vehicle type and time. Please try a different vehicle type or time.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition-colors duration-300"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={!selectedDriver}
                      className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400"
                    >
                      Next: Contact Details
                    </button>
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div>
                  <h3 className="text-lg font-bold text-blue-800 mb-4">Contact Details</h3>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 00290 12345"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h4 className="font-bold text-blue-800 mb-2">Booking Summary</h4>
                    <div className="grid md:grid-cols-2 gap-x-4 gap-y-2">
                      <p className="text-gray-700"><span className="font-semibold">Pickup:</span> {formData.pickupLocation}</p>
                      <p className="text-gray-700"><span className="font-semibold">Dropoff:</span> {formData.dropoffLocation}</p>
                      <p className="text-gray-700"><span className="font-semibold">Date:</span> {formData.pickupDate}</p>
                      <p className="text-gray-700"><span className="font-semibold">Time:</span> {formData.pickupTime}</p>
                      <p className="text-gray-700"><span className="font-semibold">Passengers:</span> {formData.passengers}</p>
                      <p className="text-gray-700"><span className="font-semibold">Vehicle:</span> {formData.vehicleType.charAt(0).toUpperCase() + formData.vehicleType.slice(1)}</p>
                      <p className="text-gray-700"><span className="font-semibold">Driver:</span> {selectedDriver?.name}</p>
                      <p className="text-gray-700"><span className="font-semibold">Estimated Fare:</span> £{fareEstimate}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition-colors duration-300"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.name || !formData.phone || !formData.email}
                      className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : 'Confirm Booking'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
        
        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-800 text-white p-4">
            <h2 className="text-xl font-bold">Why Book With Us</h2>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Reliable Service</h3>
                <p className="text-gray-600">Our drivers are punctual and professional, ensuring you reach your destination on time.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Transparent Pricing</h3>
                <p className="text-gray-600">No hidden fees. Get fare estimates before booking and pay exactly what you expect.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Safe Travel</h3>
                <p className="text-gray-600">All our drivers are licensed and vehicles are regularly inspected for your safety.</p>
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
