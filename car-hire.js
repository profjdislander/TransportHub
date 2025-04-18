import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function CarHire() {
  // Form state
  const [formData, setFormData] = useState({
    pickupLocation: '',
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: '',
    vehicleType: '',
    driverLicense: null,
    insurance: 'basic',
    name: '',
    phone: '',
    email: ''
  });

  // UI state
  const [step, setStep] = useState(1);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [rentalDays, setRentalDays] = useState(1);

  // Pickup locations
  const pickupLocations = [
    'Jamestown',
    'Airport',
    'Half Tree Hollow',
    'Longwood',
    'St Pauls'
  ];

  // Mock vehicle data
  const vehicles = [
    {
      id: 1,
      name: 'Toyota RAV4',
      type: '4x4',
      seats: 5,
      transmission: 'Automatic',
      fuel: 'Petrol',
      pricePerDay: 45,
      features: ['Air Conditioning', 'Bluetooth', 'Reverse Camera'],
      available: true,
      image: '/rav4.jpg'
    },
    {
      id: 2,
      name: 'Suzuki Jimny',
      type: '4x4',
      seats: 4,
      transmission: 'Manual',
      fuel: 'Petrol',
      pricePerDay: 35,
      features: ['Air Conditioning', '4WD', 'Compact Size'],
      available: true,
      image: '/jimny.jpg'
    },
    {
      id: 3,
      name: 'Toyota Corolla',
      type: 'Compact',
      seats: 5,
      transmission: 'Automatic',
      fuel: 'Petrol',
      pricePerDay: 30,
      features: ['Air Conditioning', 'Bluetooth', 'Fuel Efficient'],
      available: true,
      image: '/corolla.jpg'
    },
    {
      id: 4,
      name: 'Ford Ranger',
      type: 'Pickup',
      seats: 5,
      transmission: 'Manual',
      fuel: 'Diesel',
      pricePerDay: 55,
      features: ['Air Conditioning', '4WD', 'Large Cargo Space'],
      available: true,
      image: '/ranger.jpg'
    }
  ];

  // Insurance options
  const insuranceOptions = [
    {
      id: 'basic',
      name: 'Basic Insurance',
      description: 'Covers damage to third parties only',
      pricePerDay: 5
    },
    {
      id: 'standard',
      name: 'Standard Insurance',
      description: 'Covers damage to the vehicle with £500 excess',
      pricePerDay: 10
    },
    {
      id: 'premium',
      name: 'Premium Insurance',
      description: 'Full coverage with £0 excess',
      pricePerDay: 15
    }
  ];

  // Calculate rental days when dates change
  useEffect(() => {
    if (formData.pickupDate && formData.returnDate) {
      const pickup = new Date(formData.pickupDate);
      const returnDate = new Date(formData.returnDate);
      const diffTime = Math.abs(returnDate - pickup);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setRentalDays(diffDays || 1); // Minimum 1 day
    }
  }, [formData.pickupDate, formData.returnDate]);

  // Filter available vehicles based on selection criteria
  useEffect(() => {
    if (formData.vehicleType) {
      const filtered = vehicles.filter(v => 
        (formData.vehicleType === 'all' || v.type === formData.vehicleType) && 
        v.available
      );
      setAvailableVehicles(filtered);
    } else {
      setAvailableVehicles(vehicles);
    }
  }, [formData.vehicleType]);

  // Calculate total cost when vehicle, days, or insurance changes
  useEffect(() => {
    if (selectedVehicle && rentalDays) {
      const vehicleCost = selectedVehicle.pricePerDay * rentalDays;
      const selectedInsurance = insuranceOptions.find(i => i.id === formData.insurance);
      const insuranceCost = selectedInsurance ? selectedInsurance.pricePerDay * rentalDays : 0;
      setTotalCost(vehicleCost + insuranceCost);
    }
  }, [selectedVehicle, rentalDays, formData.insurance]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file input for driver's license
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        driverLicense: file
      }));
    }
  };

  // Handle vehicle selection
  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, this would be an API call to submit the booking
    // For now, we'll simulate a successful booking after a delay
    setTimeout(() => {
      // Generate a random booking reference
      const reference = 'CH' + Math.floor(100000 + Math.random() * 900000);
      setBookingReference(reference);
      setBookingComplete(true);
      setIsSubmitting(false);
    }, 1500);
  };

  // Reset booking form
  const resetBooking = () => {
    setFormData({
      pickupLocation: '',
      pickupDate: '',
      pickupTime: '',
      returnDate: '',
      returnTime: '',
      vehicleType: '',
      driverLicense: null,
      insurance: 'basic',
      name: '',
      phone: '',
      email: ''
    });
    setStep(1);
    setSelectedVehicle(null);
    setTotalCost(0);
    setBookingComplete(false);
    setBookingReference('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <Head>
        <title>Car Hire - St Helena Transit Hub</title>
        <meta name="description" content="Hire a car on St Helena Island" />
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
                <li><Link href="/car-hire" className="hover:text-blue-200 font-bold">Car Hire</Link></li>
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
          <h1 className="text-3xl font-bold text-blue-800 mb-4">Car Hire</h1>
          <p className="text-gray-700 mb-6">
            Hire a car and explore St Helena Island at your own pace. Choose from our range of vehicles and enjoy the freedom to discover the island's hidden gems.
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
            <p className="text-gray-700 mb-2">Your car hire has been booked successfully.</p>
            <p className="text-gray-700 mb-6">Your booking reference is: <span className="font-bold">{bookingReference}</span></p>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6 max-w-md mx-auto text-left">
              <h3 className="font-bold text-blue-800 mb-2">Booking Details</h3>
              <p className="text-gray-700"><span className="font-semibold">Vehicle:</span> {selectedVehicle?.name}</p>
              <p className="text-gray-700"><span className="font-semibold">Pickup Location:</span> {formData.pickupLocation}</p>
              <p className="text-gray-700"><span className="font-semibold">Pickup Date:</span> {formData.pickupDate}</p>
              <p className="text-gray-700"><span className="font-semibold">Pickup Time:</span> {formData.pickupTime}</p>
              <p className="text-gray-700"><span className="font-semibold">Return Date:</span> {formData.returnDate}</p>
              <p className="text-gray-700"><span className="font-semibold">Return Time:</span> {formData.returnTime}</p>
              <p className="text-gray-700"><span className="font-semibold">Insurance:</span> {insuranceOptions.find(i => i.id === formData.insurance)?.name}</p>
              <p className="text-gray-700"><span className="font-semibold">Total Cost:</span> £{totalCost.toFixed(2)}</p>
            </div>
            
            <p className="text-gray-700 mb-6">
              You will receive a confirmation email shortly. Please bring your driver's license and booking reference when collecting your vehicle.
            </p>
            
            <button 
              onClick={resetBooking}
              className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Book Another Vehicle
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-800 text-white p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Hire a Car</h2>
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
                  <h3 className="text-lg font-bold text-blue-800 mb-4">Rental Details</h3>
                  
                  <div className="mb-4">
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
                      {pickupLocations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
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
                      <label className="block text-gray-700 mb-2" htmlFor="returnDate">Return Date</label>
                      <input
                        type="date"
                        id="returnDate"
                        name="returnDate"
                        value={formData.returnDate}
                        onChange={handleChange}
                        required
                        min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="returnTime">Return Time</label>
                      <input
                        type="time"
                        id="returnTime"
                        name="returnTime"
                        value={formData.returnTime}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="vehicleType">Vehicle Type</label>
                    <select
                      id="vehicleType"
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Vehicle Types</option>
                      <option value="4x4">4x4</option>
                      <option value="Compact">Compact</option>
                      <option value="Pickup">Pickup</option>
                    </select>
                  </div>
                  
                  {formData.pickupDate && formData.returnDate && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      <h4 className="font-bold text-blue-800 mb-2">Rental Duration</h4>
                      <p className="text-gray-700">Your rental period is for <span className="font-bold">{rentalDays} day{rentalDays !== 1 ? 's' : ''}</span>.</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!formData.pickupLocation || !formData.pickupDate || !formData.pickupTime || !formData.returnDate || !formData.returnTime}
                      className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400"
                    >
                      Next: Select Vehicle
                    </button>
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div>
                  <h3 className="text-lg font-bold text-blue-800 mb-4">Select Vehicle</h3>
                  
                  {availableVehicles.length > 0 ? (
                    <div className="space-y-6 mb-6">
                      {availableVehicles.map(vehicle => (
                        <div 
                          key={vehicle.id}
                          onClick={() => handleVehicleSelect(vehicle)}
                          className={`border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                            selectedVehicle?.id === vehicle.id 
                              ? 'border-blue-500 ring-2 ring-blue-200' 
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          <div className="md:flex">
                            <div className="md:flex-shrink-0 bg-gray-200 md:w-48 h-48 md:h-auto">
                              {/* Vehicle image would go here */}
                              <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3a1 1 0 001-1v-3a1 1 0 00-.293-.707l-2-2A1 1 0 0012 7H9c0-.12-.008-.24-.027-.36L8.29 4.72a1 1 0 00-.933-.642H4a1 1 0 00-1 1z" />
                                </svg>
                              </div>
                            </div>
                            <div className="p-6 flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="text-xl font-bold text-gray-800">{vehicle.name}</h4>
                                  <p className="text-sm text-blue-600 font-medium">{vehicle.type}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-blue-800">£{vehicle.pricePerDay}</p>
                                  <p className="text-sm text-gray-600">per day</p>
                                </div>
                              </div>
                              
                              <div className="mt-4 grid md:grid-cols-2 gap-x-4 gap-y-2">
                                <p className="text-gray-700"><span className="font-semibold">Seats:</span> {vehicle.seats}</p>
                                <p className="text-gray-700"><span className="font-semibold">Transmission:</span> {vehicle.transmission}</p>
                                <p className="text-gray-700"><span className="font-semibold">Fuel:</span> {vehicle.fuel}</p>
                                <p className="text-gray-700">
                                  <span className="font-semibold">Total:</span> £{(vehicle.pricePerDay * rentalDays).toFixed(2)} for {rentalDays} day{rentalDays !== 1 ? 's' : ''}
                                </p>
                              </div>
                              
                              <div className="mt-4">
                                <p className="text-gray-700 font-semibold">Features:</p>
                                <div className="flex flex-wrap mt-1">
                                  {vehicle.features.map((feature, index) => (
                                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-2">{feature}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
                      <p className="text-yellow-700">
                        No vehicles available for the selected criteria. Please try different dates or vehicle type.
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
                      disabled={!selectedVehicle}
                      className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400"
                    >
                      Next: Insurance & Details
                    </button>
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div>
                  <h3 className="text-lg font-bold text-blue-800 mb-4">Insurance & Personal Details</h3>
                  
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-800 mb-2">Select Insurance</h4>
                    <div className="space-y-3">
                      {insuranceOptions.map(option => (
                        <div 
                          key={option.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                            formData.insurance === option.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, insurance: option.id }))}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h5 className="font-bold text-gray-800">{option.name}</h5>
                              <p className="text-gray-600">{option.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-blue-800">£{option.pricePerDay}</p>
                              <p className="text-sm text-gray-600">per day</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-800 mb-2">Driver's License</h4>
                    <div className="border border-dashed border-gray-300 rounded-lg p-4">
                      <label className="block text-center cursor-pointer">
                        <span className="text-gray-700 mb-2 block">Upload a copy of your driver's license</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded hover:bg-blue-200 transition-colors duration-300">
                          {formData.driverLicense ? 'Change File' : 'Select File'}
                        </span>
                        {formData.driverLicense && (
                          <span className="block mt-2 text-green-600">
                            File selected: {formData.driverLicense.name}
                          </span>
                        )}
                      </label>
                    </div>
                  </div>
                  
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
                      <p className="text-gray-700"><span className="font-semibold">Vehicle:</span> {selectedVehicle?.name}</p>
                      <p className="text-gray-700"><span className="font-semibold">Type:</span> {selectedVehicle?.type}</p>
                      <p className="text-gray-700"><span className="font-semibold">Pickup:</span> {formData.pickupLocation}</p>
                      <p className="text-gray-700"><span className="font-semibold">Pickup Date:</span> {formData.pickupDate}</p>
                      <p className="text-gray-700"><span className="font-semibold">Return Date:</span> {formData.returnDate}</p>
                      <p className="text-gray-700"><span className="font-semibold">Duration:</span> {rentalDays} day{rentalDays !== 1 ? 's' : ''}</p>
                      <p className="text-gray-700"><span className="font-semibold">Insurance:</span> {insuranceOptions.find(i => i.id === formData.insurance)?.name}</p>
                      <p className="text-gray-700 font-bold text-lg"><span className="font-semibold">Total Cost:</span> £{totalCost.toFixed(2)}</p>
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
                      disabled={isSubmitting || !formData.name || !formData.phone || !formData.email || !formData.driverLicense}
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
            <h2 className="text-xl font-bold">Why Hire With Us</h2>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Well-Maintained Vehicles</h3>
                <p className="text-gray-600">Our vehicles are regularly serviced and maintained to ensure reliability and safety.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Competitive Pricing</h3>
                <p className="text-gray-600">We offer the best rates on St Helena with no hidden fees or charges.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">24/7 Support</h3>
                <p className="text-gray-600">Our customer support team is available around the clock to assist with any issues.</p>
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
