import { MainLayout } from "@/components/layout/LayoutTemplate";
import { Paginator } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUsersStore } from "@/modules/users/usersStore";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { useState } from "react";

export const UsersScreen = () => {
  const usersStore = useUsersStore();

  const [pageSize, _setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(0);

  const firstItem = pageNumber * pageSize;
  const lastItem = firstItem + pageSize;

  return (
    <MainLayout>
      {usersStore.data === undefined && <LoadingScreen />}
      {usersStore.data === null && <div>No users found</div>}
      {usersStore.data &&
        (() => {
          return (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Id</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {usersStore.data.slice(firstItem, lastItem).map((x, j) => (
                    <TableRow key={x.id}>
                      <TableCell className="font-medium">{firstItem + j + 1}</TableCell>
                      <TableCell className="font-medium">{x.id}</TableCell>
                      <TableCell className="font-medium">{x.name}</TableCell>
                      <TableCell className="font-medium">{x.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {firstItem + 1} to{" "}
              {lastItem < usersStore.data.length ? lastItem : usersStore.data.length} of{" "}
              {usersStore.data.length}
              <Paginator
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                itemsPerPage={pageSize}
                numberOfItems={usersStore.data.length}
              />
            </>
          );
        })()}
    </MainLayout>
  );
};

export default function UsersPage() {
  return <UsersScreen />;
}
