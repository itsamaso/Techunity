import { useToast } from "@/components/ui/use-toast";
import { Loader, UserCard } from "@/components/shared";
import { useGetUsers } from "@/lib/react-query/queries";

const AllUsers = () => {
  const { toast } = useToast();

  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });
    
    return;
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex items-center gap-3 mb-6 p-6 rounded-3xl bg-gradient-to-br from-blue-100/85 via-indigo-100/80 to-purple-100/85 border-2 border-primary-500/30 shadow-2xl backdrop-blur-md">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-500/25 to-secondary-500/25 shadow-md">
            <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent tracking-tight drop-shadow-lg">People</h2>
            <p className="text-base text-gray-800 font-bold mt-2">Discover and connect with amazing people</p>
          </div>
        </div>

        <div className="user-container">
        {isLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id} className="flex-1 min-w-[200px] w-full  ">
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
