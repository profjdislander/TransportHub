import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Dashboard() {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'April 2025'
  });
  
  const [bookings, setBookings] = useState([
    {
      id: 'TX123456',
      type: 'taxi',
      date: '2025-04-20',
      time: '14:30',
      from: 'Jamestown Wharf',
      to: 'Airport',
      status: 'confirmed'
    },
    {
      id: 'CH789012',
      type: 'car-hire',
      date: '2025-05-15',
      returnDate: '2025-05-18',
      vehicle: 'Toyota RAV4',
      location: 'Jamestown',
      status: 'confirmed'
    }
  ]);
  
  const [savedLocations, setSavedLocations] = useState([
    'Jamestown Wharf',
    'Airport',
    'Longwood House',
    'Home (Half Tree Hollow)'
  ]);
  
  const [activeTab, setActiveTab] = useState('bookings');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <Head>
        <title>My Dashboard - St Helena Transit Hub</title>
        <meta name="description" content="Manage your St Helena Transit Hub account and bookings" />
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
                <li><Link href="/public-transport" className="hover:text-blue-200">Public Transport</Link></li>
                <li><Link href="/about" className="hover:text-blue-200">About</Link></li>
              </ul>
            </nav>
            <div className="flex items-center">
              <span className="mr-4">Welcome, {user.name.split(' ')[0]}</span>
              <Link href="/auth" className="bg-white text-blue-800 px-4 py-2 rounded hover:bg-blue-100 transition-colors duration-300">
                Logout
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-4">My Dashboard</h1>
          <p className="text-gray-700 mb-6">
            Manage your bookings, saved locations, and account settings.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
              <div className="bg-blue-800 text-white p-4">
                <h2 className="text-xl font-bold">Account</h2>
              </div>
              
              <div className="p-4">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-blue-800">{user.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">Member since {user.joinDate}</p>
                </div>
                
                <nav>
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => setActiveTab('bookings')}
                        className={`w-full text-left px-4 py-2 rounded ${
                          activeTab === 'bookings'
                            ? 'bg-blue-100 text-blue-800 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        My Bookings
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('locations')}
                        className={`w-full text-left px-4 py-2 rounded ${
                          activeTab === 'locations'
                            ? 'bg-blue-100 text-blue-800 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        Saved Locations
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('settings')}
                        className={`w-full text-left px-4 py-2 rounded ${
                          activeTab === 'settings'
                            ? 'bg-blue-100 text-blue-800 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        Account Settings
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-blue-800 text-white p-4">
                <h2 className="text-xl font-bold">Quick Actions</h2>
              </div>
              
              <div className="p-4">
                <ul className="space-y-2">
                  <li>
                    <Link href="/taxi" className="block text-blue-600 hover:text-blue-800 hover:underline">
                      Book a Taxi
                    </Link>
                  </li>
                  <li>
                    <Link href="/car-hire" className="block text-blue-600 hover:text-blue-800 hover:underline">
                      Hire a Car
                    </Link>
                  </li>
                  <li>
                    <Link href="/public-transport" className="block text-blue-600 hover:text-blue-800 hover:underline">
                      Plan a Journey
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3">
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-800 text-white p-4">
                  <h2 className="text-xl font-bold">My Bookings</h2>
                </div>
                
                <div className="p-6">
                  {bookings.length > 0 ? (
                    <div className="space-y-6">
                      {bookings.map(booking => (
                        <div key={booking.id} className="border rounded-lg overflow-hidden">
                          <div className={`p-4 ${
                            booking.type === 'taxi' ? 'bg-yellow-100' : 'bg-green-100'
                          }`}>
                            <div className="flex justify-between items-center">
                              <h3 className="font-bold text-gray-800">
                                {booking.type === 'taxi' ? 'Taxi Booking' : 'Car Hire'}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                booking.status === 'confirmed'
                                  ? 'bg-green-200 text-green-800'
                                  : booking.status === 'pending'
                                  ? 'bg-yellow-200 text-yellow-800'
                                  : 'bg-red-200 text-red-800'
                              }`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <div className="grid md:grid-cols-2 gap-x-4 gap-y-2">
                              <p className="text-gray-700"><span className="font-semibold">Booking ID:</span> {booking.id}</p>
                              <p className="text-gray-700"><span className="font-semibold">Date:</span> {new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                              
                              {booking.type === 'taxi' ? (
                                <>
                                  <p className="text-gray-700"><span className="font-semibold">Time:</span> {booking.time}</p>
                                  <p className="text-gray-700"><span className="font-semibold">From:</span> {booking.from}</p>
                                  <p className="text-gray-700"><span className="font-semibold">To:</span> {booking.to}</p>
                                </>
                              ) : (
                                <>
                                  <p className="text-gray-700"><span className="font-semibold">Return Date:</span> {new Date(booking.returnDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                  <p className="text-gray-700"><span className="font-semibold">Vehicle:</span> {booking.vehicle}</p>
                                  <p className="text-gray-700"><span className="font-semibold">Pickup Location:</span> {booking.location}</p>
                                </>
                              )}
                            </div>
                            
                            <div className="mt-4 flex space-x-2">
                              <button className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300">
                                View Details
                              </button>
                              {booking.status === 'confirmed' && (
                                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-300">
                                  Cancel Booking
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">No Bookings Found</h3>
                      <p className="text-gray-600 mb-4">You haven't made any bookings yet.</p>
                      <div className="flex justify-center space-x-4">
                        <Link href="/taxi" className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300">
                          Book a Taxi
                        </Link>
                        <Link href="/car-hire" className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300">
                          Hire a Car
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Saved Locations Tab */}
            {activeTab === 'locations' && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-800 text-white p-4">
                  <h2 className="text-xl font-bold">Saved Locations</h2>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex mb-4">
                      <input
                        type="text"
                        placeholder="Add a new location"
                        className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="bg-blue-800 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition-colors duration-300">
                        Add
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      Save your frequently visited locations for quicker booking.
                    </p>
                  </div>
                  
                  {savedLocations.length > 0 ? (
                    <ul className="space-y-2">
                      {savedLocations.map((location, index) => (
                        <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="text-gray-700">{location}</span>
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                              </svg>
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">No Saved Locations</h3>
                      <p className="text-gray-600">Add your frequently visited locations for quicker booking.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Account Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-800 text-white p-4">
                  <h2 className="text-xl font-bold">Account Settings</h2>
                </div>
                
                <div className="p-6">
                  <form>
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-blue-800 mb-4">Personal Information</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-gray-700 mb-2" htmlFor="name">Full Name</label>
                          <input
                            type="text"
                            id="name"
                            value={user.name}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 mb-2" htmlFor="email">Email Address</label>
                          <input
                            type="email"
                            id="email"
                            value={user.email}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 mb-2" htmlFor="phone">Phone Number</label>
                          <input
                            type="tel"
                            id="phone"
                            placeholder="e.g. 00290 12345"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-blue-800 mb-4">Change Password</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-gray-700 mb-2" htmlFor="currentPassword">Current Password</label>
                          <input
                            type="password"
                            id="currentPassword"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 mb-2" htmlFor="newPassword">New Password</label>
                          <input
                            type="password"
                            id="newPassword"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">Confirm New Password</label>
                          <input
                            type="password"
                            id="confirmPassword"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-blue-800 mb-4">Notification Preferences</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="emailNotifications"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            defaultChecked
                          />
                          <label htmlFor="emailNotifications" className="ml-2 block text-gray-700">
                            Email notifications for bookings and updates
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="smsNotifications"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="smsNotifications" className="ml-2 block text-gray-700">
                            SMS notifications for bookings and updates
                          </label>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="marketingEmails"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            defaultChecked
                          />
                          <label htmlFor="marketingEmails" className="ml-2 block text-gray-700">
                            Receive promotional offers and newsletters
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
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
