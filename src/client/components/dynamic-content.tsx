// components/dynamic-content.tsx
import { SectionCards } from "./section-cards";
import { ChartAreaInteractive } from "./chart-area-interactive";
import { DataTable } from "./data-table";
import { data } from "@clnt/constants/data";
import { useAppStateStore } from "@clnt/lib/store/app-state-store";
import Calendar from "./calendar";
import { Skeleton } from "./ui/skeleton";
import { mongoGuiUrl } from "@clnt/constants/api";
import { UserDataTable } from "./user-data-table";
import { useUserQuery } from "@clnt/lib/query/user-query";
console.log("🚀 ~ mongoGuiUrl:", mongoGuiUrl);

export function DynamicContent() {
  const { isAppLoading, activeNavName } = useAppStateStore();
  const {
    isLoading: isUserLoading,
    error: isUserError,
    data: userQry
  } = useUserQuery();
  console.log("🚀 ~ DynamicContent ~ userQry:", userQry)

  if (isAppLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
              <Skeleton className="h-42 max-w-3/2rounded-xl" />
              <Skeleton className="h-42 max-w-3/2 rounded-xl" />
              <Skeleton className="h-42 max-w-3/2 rounded-xl" />
              <Skeleton className="h-42 max-w-3/2 rounded-xl" />
            </div>
            <div className="px-4 lg:px-6">
              <Skeleton className="h-100 w-auto rounded-xl" />
            </div>
            <div className="px-4 lg:px-6">
              <Skeleton className="h-100 w-auto rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  switch (activeNavName) {
    case "Dashboard":
      return (
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data.table} />
            </div>
          </div>
        </div>
      );

    case "Users":
      if (isUserLoading) {
        return (
          <div className="px-4 lg:px-6">
            <Skeleton className="h-100 w-auto rounded-xl" />
          </div>
        );
      } else {
        return (
          <>
            {/* <table className="min-w-full divide-y divide-gray-200 overflow-x-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src="https://i.pravatar.cc/150?img=1"
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Jane Cooper
                        </div>
                        <div className="text-sm text-gray-500">
                          jane.cooper@example.com
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Regional Paradigm Technician
                    </div>
                    <div className="text-sm text-gray-500">Optimization</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Admin
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    jane.cooper@example.com
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </a>
                    <a href="#" className="ml-2 text-red-600 hover:text-red-900">
                      Delete
                    </a>
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src="https://i.pravatar.cc/150?img=1"
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Jane Cooper
                        </div>
                        <div className="text-sm text-gray-500">
                          jane.cooper@example.com
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Regional Paradigm Technician
                    </div>
                    <div className="text-sm text-gray-500">Optimization</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Admin
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    jane.cooper@example.com
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </a>
                    <a href="#" className="ml-2 text-red-600 hover:text-red-900">
                      Delete
                    </a>
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src="https://i.pravatar.cc/150?img=1"
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Jane Cooper
                        </div>
                        <div className="text-sm text-gray-500">
                          jane.cooper@example.com
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Regional Paradigm Technician
                    </div>
                    <div className="text-sm text-gray-500">Optimization</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Admin
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    jane.cooper@example.com
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </a>
                    <a href="#" className="ml-2 text-red-600 hover:text-red-900">
                      Delete
                    </a>
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src="https://i.pravatar.cc/150?img=1"
                          alt=""
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Jane Cooper
                        </div>
                        <div className="text-sm text-gray-500">
                          jane.cooper@example.com
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Regional Paradigm Technician
                    </div>
                    <div className="text-sm text-gray-500">Optimization</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Admin
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    jane.cooper@example.com
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </a>
                    <a href="#" className="ml-2 text-red-600 hover:text-red-900">
                      Delete
                    </a>
                  </td>
                </tr>
              </tbody>
            </table> */}
            {/* <UserDataTable data={userQry}/> */}
          </>
        );
      }

    case "Classrooms":
      return (
        <div className="px-4 lg:px-6 text-muted-foreground">
          <h2 className="text-lg font-semibold">Classrooms Management Panel</h2>
          {/* Add your user management component here */}
        </div>
      );

    case "Projects":
      return (
        <div className="px-4 lg:px-6 text-muted-foreground">
          <h2 className="text-lg font-semibold">Projects Management Panel</h2>
          {/* Add your user management component here */}
        </div>
      );

    case "Reports":
      return (
        <div className="px-4 lg:px-6 text-muted-foreground">
          <h2 className="text-lg font-semibold">Reports View</h2>
          {/* Replace with your report view */}
        </div>
      );

    case "Calendar":
      return <Calendar />;

    case "Data Library":
      return (
        <iframe
          src={"http://localhost:5555/"}
          style={{ width: "100%", height: "100%", border: "none" }}
          title="Data Library"
        />
      );

    default:
      return (
        <div className="px-4 lg:px-6 text-muted-foreground">
          <p>
            No content found for <strong>{activeNavName}</strong>
          </p>
        </div>
      );
  }
}
