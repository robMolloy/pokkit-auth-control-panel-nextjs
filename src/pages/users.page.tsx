import { MainLayout } from "@/components/layout/LayoutTemplate";
import { ConfirmationModalContent } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Paginator } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pb } from "@/config/pocketbaseConfig";
import { deleteUser } from "@/modules/users/dbUserUtils";
import { useUsersStore } from "@/modules/users/usersStore";
import {
  extractMessageFromPbError,
  showMultipleErrorMessagesAsToast,
} from "@/modules/utils/pbUtils";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { useModalStore } from "@/stores/modalStore";
import { useState } from "react";
import { toast } from "sonner";

export const UsersScreen = () => {
  const usersStore = useUsersStore();

  const [pageSize, _setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);

  const firstItem = pageNumber * pageSize;
  const lastItem = firstItem + pageSize;

  const modalStore = useModalStore();

  return (
    <MainLayout>
      {usersStore.data === undefined && <LoadingScreen />}
      {usersStore.data === null && <div>No users found</div>}
      {usersStore.data &&
        (() => {
          const PaginatorImplementation = () => (
            <Paginator
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              itemsPerPage={pageSize}
              numberOfItems={usersStore.data!.length}
            />
          );
          return (
            <>
              <PaginatorImplementation />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Id</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {usersStore.data.slice(firstItem, lastItem).map((x, j) => (
                    <TableRow key={x.id}>
                      <TableCell className="font-medium">{firstItem + j + 1}</TableCell>
                      <TableCell className="font-medium">{x.id}</TableCell>
                      <TableCell className="font-medium">{x.name}</TableCell>
                      <TableCell className="font-medium">{x.email}</TableCell>
                      <TableCell
                        className="font-medium"
                        onClick={() =>
                          modalStore.setData(
                            <ConfirmationModalContent
                              title="Delete user"
                              description="Are you sure you want to delete this user?"
                              content={<pre>{JSON.stringify(x, undefined, 2)}</pre>}
                              onConfirm={async () => {
                                const resp = await deleteUser({ pb, id: x.id });
                                if (resp.success) return toast("User deleted successfully");
                                showMultipleErrorMessagesAsToast(resp.error.messages);
                              }}
                            />,
                          )
                        }
                      >
                        <Button>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {firstItem + 1} to{" "}
              {lastItem < usersStore.data.length ? lastItem : usersStore.data.length} of{" "}
              {usersStore.data.length}
              <PaginatorImplementation />
            </>
          );
        })()}
    </MainLayout>
  );
};

export default function UsersPage() {
  return <UsersScreen />;
}
