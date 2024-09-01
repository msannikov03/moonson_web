import React from 'react';

const Newsletter: React.FC = () => {
  return (
    <div className="bg-black text-white p-8 flex justify-between items-center">
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Quick links</h3>
        <nav className="flex flex-col">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Search</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Return Policy</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping Policy</a>
        </nav>
      </div>

      <div>
        <h3 className="text-sm font-semibold">Subscribe to our newsletter</h3>
        <p className="mt-2 text-sm text-gray-400">
          The latest news, articles, and resources, sent to your inbox weekly.
        </p>
        <form className="mt-4 flex">
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <input
            type="email"
            name="email-address"
            id="email-address"
            autoComplete="email"
            required
            className="w-full min-w-0 appearance-none rounded-md border-0 bg-white px-3 py-2 text-base text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600"
            placeholder="Enter your email"
          />
          <button
            type="submit"
            className="ml-4 flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;