import React from "react";

interface UserListHeaderProps {
  userCount: number;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const UserListHeader: React.FC<UserListHeaderProps> = ({ 
  userCount, 
  onRefresh, 
  isRefreshing 
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
          User Management
        </h1>
        <p className="text-gray-500 mt-1">
          Manage all registered users • <span className="font-medium text-indigo-600">{userCount}</span> total
        </p>
      </div>

      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                   bg-gradient-to-r from-violet-500 to-indigo-500
                   hover:from-violet-600 hover:to-indigo-600
                   text-white font-medium shadow-lg hover:shadow-xl
                   transition-all duration-300 transform hover:scale-105
                   disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
                   cursor-pointer"
      >
        {isRefreshing ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Refreshing...
          </>
        ) : (
          <>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </>
        )}
      </button>
    </div>
  );
};