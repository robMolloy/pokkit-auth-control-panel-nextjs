import { MainLayout } from "@/components/layout/LayoutTemplate";
import { ConfirmationModalContent } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { deleteUsers } from "@/modules/users/dbUsersUtils";
import { deleteUser } from "@/modules/users/dbUserUtils";
import { useUsersStore } from "@/modules/users/usersStore";
import { toastMultiMessages } from "@/modules/utils/pbUtils";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { useModalStore } from "@/stores/modalStore";
import { useEffect, useState } from "react";

export const UsersScreen = () => {
  const usersStore = useUsersStore();

  const [pageSize, _setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);

  const firstItem = pageNumber * pageSize;
  const lastItem = firstItem + pageSize;

  const modalStore = useModalStore();

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  useEffect(() => setSelectedUserIds([]), [usersStore.data, pageNumber]);

  return (
    <MainLayout>
      {usersStore.data === undefined && <LoadingScreen />}
      {usersStore.data === null && <div>No users found</div>}
      {usersStore.data &&
        (() => {
          const displayedUsers = usersStore.data.slice(firstItem, lastItem);
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
                    <TableHead>
                      <Checkbox
                        checked={selectedUserIds.length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) return setSelectedUserIds(displayedUsers.map((x) => x.id));
                          setSelectedUserIds([]);
                        }}
                      />
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {usersStore.data.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                  {displayedUsers.map((x, j) => (
                    <TableRow key={x.id}>
                      <TableCell className="font-medium">
                        <span>{firstItem + j + 1}</span>
                      </TableCell>
                      <TableCell className="font-medium">{x.id}</TableCell>
                      <TableCell className="font-medium">{x.name}</TableCell>
                      <TableCell className="font-medium">{x.email}</TableCell>
                      <TableCell
                        className="flex justify-center font-medium"
                        onClick={() =>
                          modalStore.setData(
                            <ConfirmationModalContent
                              title="Delete user"
                              description="Are you sure you want to delete this user?"
                              content={<pre>{JSON.stringify(x, undefined, 2)}</pre>}
                              onConfirm={async () => {
                                const resp = await deleteUser({ pb, id: x.id });

                                toastMultiMessages(resp.messages);
                              }}
                            />,
                          )
                        }
                      >
                        <Button>Delete</Button>
                      </TableCell>
                      <TableCell className="font-medium">
                        <Checkbox
                          checked={selectedUserIds.includes(x.id)}
                          onCheckedChange={(checked) => {
                            if (checked) return setSelectedUserIds([...selectedUserIds, x.id]);
                            setSelectedUserIds(selectedUserIds.filter((y) => y !== x.id));
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between">
                <span>{`${firstItem + 1} to ${lastItem < usersStore.data.length ? lastItem : usersStore.data.length} of ${usersStore.data.length}`}</span>
                <Button
                  disabled={selectedUserIds.length === 0}
                  onClick={() => {
                    modalStore.setData(
                      <ConfirmationModalContent
                        title="Delete users"
                        description="Are you sure you want to delete these users?"
                        content={<pre>{JSON.stringify(selectedUserIds, undefined, 2)}</pre>}
                        onConfirm={async () => {
                          const resp = await deleteUsers({ pb, ids: selectedUserIds });
                          toastMultiMessages(resp.messages);
                        }}
                      />,
                    );
                  }}
                >
                  {`Delete selected ${selectedUserIds.length === 0 ? "" : `(${selectedUserIds.length})`}`}
                </Button>
              </div>
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
