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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTargetParams(localParams);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Target Parameters</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Target IP
            </label>
            <input
              type="text"
              value={localParams.ip}
              onChange={(e) =>
                setLocalParams({ ...localParams, ip: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="e.g., 10.10.10.10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Port
            </label>
            <input
              type="text"
              value={localParams.port}
              onChange={(e) =>
                setLocalParams({ ...localParams, port: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="e.g., 445"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Service
            </label>
            <input
              type="text"
              value={localParams.service}
              onChange={(e) =>
                setLocalParams({ ...localParams, service: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="e.g., smb"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Wordlist
            </label>
            <input
                type="text"
                value={localParams.wordlist}
                onChange={(e) =>
                    setLocalParams({ ...localParams, wordlist: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="e.g., password.txt"
            />
          </div>

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