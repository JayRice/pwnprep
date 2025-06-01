import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function TargetParamsModal({ isOpen, onClose }: Props) {
  const { targetParams, setTargetParams } = useStore();
  const [localParams, setLocalParams] = useState(targetParams);


  const targetParamKeys = Object.keys(localParams).filter(key => key !== 'id');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTargetParams(localParams);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-[60vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Parameters</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 left-4 "
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">


          {targetParamKeys.map((key) => (

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {key}
                </label>
                <input
                    type="text"

                    key={key}

                    onChange={(e) => {
                      console.log("Changing: ", { ...localParams, [key]: e.target.value })
                      setLocalParams({ ...localParams, [key]: e.target.value })
                    }

                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder={`Enter ${key} (e.g., example-${key})`}
                />
              </div>
          ))}


          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
            >
              Save Parameters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}