import { UserButton, useUser , useAuth } from '@clerk/clerk-react';
import { Layout, Plus } from 'lucide-react';
import { useState , useEffect } from 'react';
import { sendUserData } from '../api/user-api';

interface Website {
  id: string;
  name: string;
  published: boolean;
  domain?: string;
}

export function Dashboard() {
  const { user , isLoaded} = useUser();
  const [websites, setWebsites] = useState<Website[]>([]);
  const {getToken}=useAuth();

     useEffect(() => {
        if (isLoaded && user) {
          const userData = {
              id:user.id ,
            firstName: user.firstName,
            lastName: user.lastName,
            email_addresses: user.emailAddresses
            }
// console.log(user)
          // Use the API function to send user data to the backend
//           sendUserData(userData)
//             .then((data) => {
//               console.log('User data sent successfully:', data);
//             })
//             .catch((error) => {
//               console.error('Error sending user data:', error);
//             });
        }
      }, [isLoaded, user]);

  if (!isLoaded || !user) {
      return <div>Loading user information...</div>;
    }

  const fetchToken = async () => {
    const token = await getToken();
    console.log("Session Token:", token);
  };
  fetchToken()
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center group">
              <Layout className="h-8 w-8 text-blue-600 transition-transform duration-300 group-hover:scale-110 animate-float" />
              <span className="ml-2 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                Website Builder
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 animate-slide-in">
                Welcome, {user?.firstName || 'User'}!
              </span>
              <div className="transition-transform duration-300 hover:scale-105">
                <UserButton afterSignOutUrl="/sign-in" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 animate-slide-in">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">My Websites</h1>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 transition-all duration-300 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Plus className="h-4 w-4 mr-2" />
              New Website
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg transition-all duration-300 hover:shadow-xl">
            <ul className="divide-y divide-gray-200">
              {websites.length === 0 ? (
                <li className="px-6 py-4">
                  <div className="text-center py-12 animate-slide-in">
                    <Layout className="mx-auto h-12 w-12 text-gray-400 animate-float" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No websites</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new website.</p>
                    <div className="mt-6">
                      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 transition-all duration-300 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <Plus className="h-4 w-4 mr-2" />
                        New Website
                      </button>
                    </div>
                  </div>
                </li>
              ) : (
                websites.map((website, index) => (
                  <li 
                    key={website.id} 
                    className="px-6 py-4 transition-all duration-300 hover:bg-gray-50 animate-slide-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{website.name}</h3>
                        {website.domain && (
                          <p className="text-sm text-gray-500">{website.domain}</p>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 ${
                          website.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {website.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
