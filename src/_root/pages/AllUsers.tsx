import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui";
import { Loader, UserCard, PageHeader } from "@/components/shared";
import { useGetUsers, useSearchUsers } from "@/lib/react-query/queries";
import { useUserContext } from "@/context/AuthContext";
import useDebounce from "@/hooks/useDebounce";

export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedUsers: any;
};

const SearchResults = ({ isSearchFetching, searchedUsers }: SearchResultProps) => {
  if (isSearchFetching) {
    return <Loader />;
  } else if (searchedUsers && searchedUsers.documents && searchedUsers.documents.length > 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
        {searchedUsers.documents.map((creator: any) => (
          <div key={creator?.$id} className="group">
            <UserCard user={creator} />
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No users found</h3>
        <p className="text-gray-600 text-center max-w-md">
          Try searching with a different term or check your spelling.
        </p>
      </div>
    );
  }
};

const AllUsers = () => {
  const { toast } = useToast();
  const { user } = useUserContext();

  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState<'username' | 'name'>('username');
  const debouncedSearch = useDebounce(searchValue, 500);
  const { data: searchedUsers, isFetching: isSearchFetching } = useSearchUsers(debouncedSearch, searchType);

  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });
    
    return;
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <PageHeader
          title="All Users"
          subtitle="Connect with other members of our community"
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          }
        />

        {/* Search Type Selector */}
        <div className="flex flex-col items-center gap-4 mb-6 w-full">
          <label className="text-sm font-semibold text-light-1 flex items-center gap-2 bg-dark-2 px-3 py-2 rounded-lg border border-dark-4/50 shadow-md">
            <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            Search Type
          </label>
          <div className="flex bg-dark-2 rounded-2xl p-2 shadow-xl border-2 border-dark-4/50 relative w-96">
            <button
              onClick={() => setSearchType('username')}
              className={`flex items-center justify-center gap-3 px-8 py-3 rounded-xl text-base font-semibold transition-all duration-300 relative z-10 w-[calc(50%-4px)] ${
                searchType === 'username'
                  ? 'text-white drop-shadow-lg'
                  : 'text-light-2 hover:text-light-1 hover:bg-dark-4/50'
              }`}
            >
              <svg className={`w-5 h-5 ${searchType === 'username' ? 'text-white drop-shadow-lg' : 'text-light-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Username
            </button>
            
            {/* Vertical Separator */}
            <div className="w-px bg-dark-4/60 mx-1 z-20 relative"></div>
            
            <button
              onClick={() => setSearchType('name')}
              className={`flex items-center justify-center gap-3 px-8 py-3 rounded-xl text-base font-semibold transition-all duration-300 relative z-10 w-[calc(50%-4px)] ${
                searchType === 'name'
                  ? 'text-white drop-shadow-lg'
                  : 'text-light-2 hover:text-light-1 hover:bg-dark-4/50'
              }`}
            >
              <svg className={`w-5 h-5 ${searchType === 'name' ? 'text-white drop-shadow-lg' : 'text-light-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Name
            </button>
            
            {/* Enhanced animated background indicator */}
            <div 
              className={`absolute top-2 bottom-2 rounded-xl bg-gradient-to-r from-slate-500 via-slate-600 to-slate-700 shadow-xl transition-all duration-400 ease-out ${
                searchType === 'username' 
                  ? 'left-2 w-[calc(50%-12px)]' 
                  : 'left-[calc(50%+4px)] w-[calc(50%-12px)]'
              }`}
            />
          </div>
        </div>

        <div className="flex gap-1 px-4 w-full rounded-xl bg-dark-4 mb-6 border-2 border-dark-4/50 focus-within:border-primary-500/50 transition-all duration-300 shadow-lg">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
            className="opacity-70"
          />
          <Input
            type="text"
            placeholder={`Search by ${searchType === 'username' ? 'username' : 'name'}...`}
            className="explore-search border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-light-4/70"
            value={searchValue}
            onChange={(e) => {
              const { value } = e.target;
              setSearchValue(value);
            }}
          />
        </div>

        {/* Main Content */}
        {isLoading && !creators ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <div className="w-full">
            {searchValue !== "" ? (
              // Show search results
              <SearchResults
                isSearchFetching={isSearchFetching}
                searchedUsers={searchedUsers}
              />
            ) : (
              // Show all users
              <>
                {/* Stats Header */}
                <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Community Members
                      </h3>
                      <p className="text-sm text-gray-600">
                        {creators?.documents?.filter(creator => creator.$id !== user.id).length || 0} members to connect with
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Active community</span>
                    </div>
                  </div>
                </div>

                {/* Users Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                  {creators?.documents
                    ?.filter(creator => creator.$id !== user.id) // Exclude current user
                    ?.map((creator) => (
                      <div key={creator?.$id} className="group">
                        <UserCard user={creator} />
                      </div>
                    ))}
                </div>

                {/* Empty State */}
                {(!creators?.documents || creators.documents.filter(creator => creator.$id !== user.id).length === 0) && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                      <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No other users found</h3>
                    <p className="text-gray-600 text-center max-w-md">
                      You're the only member of the community right now. Invite others to join!
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
