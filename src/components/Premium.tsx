import React from 'react';

function Premium() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Premium Features</h1>
        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Upgrade to Premium</h2>
            <p className="text-gray-600">
              Access exclusive features and advanced capabilities with our premium subscription.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Premium;