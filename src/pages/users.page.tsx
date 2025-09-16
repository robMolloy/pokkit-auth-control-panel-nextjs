import { MainLayout } from "@/components/layout/LayoutTemplate";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pb } from "@/config/pocketbaseConfig";
import { useUsersStore } from "@/modules/users/usersStore";
import { useState } from "react";

const pageSize = 5;

export const UsersScreen = () => {
  const usersStore = useUsersStore();
  const [page, setPage] = useState(0);
  const firstItem = page * pageSize;
  const lastItem = firstItem + pageSize;

  return (
    <MainLayout>
      <Button
        onClick={() => {
          [...Array(100)].map((_, i) => {
            const email = `test-1${i}@test.com`;

            pb.collection("users").create({
              name: email,
              email,
              password: email,
              passwordConfirm: email,
            });
          });
        }}
      >
        Create users
      </Button>
      {usersStore.data === undefined && <div>Loading...</div>}
      {usersStore.data === null && <div>No users found</div>}
      {usersStore.data && (
        <>
          <Button disabled={page === 0} onClick={() => setPage((x) => (x -= 1))}>
            previous
          </Button>
          <Button
            disabled={lastItem >= usersStore.data.length}
            onClick={() => setPage((x) => (x += 1))}
          >
            Next
          </Button>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {usersStore.data.slice(firstItem, lastItem).map((x) => (
                <TableRow key={x.id}>
                  <TableCell className="font-medium">{x.id}</TableCell>
                  <TableCell className="font-medium">{x.name}</TableCell>
                  <TableCell className="font-medium">{x.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </MainLayout>
  );
};

export default function UsersPage() {
  return <UsersScreen />;
}
