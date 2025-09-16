import { MainLayout } from "@/components/layout/LayoutTemplate";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUsersStore } from "@/modules/users/usersStore";

export const UsersScreen = () => {
  const usersStore = useUsersStore();

  return (
    <MainLayout>
      <br />
      <br />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {usersStore.data.map((x) => (
            <TableRow key={x.id}>
              <TableCell className="font-medium">{x.id}</TableCell>
              <TableCell className="font-medium">{x.name}</TableCell>
              <TableCell className="font-medium">{x.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>A list of your recent invoices.</TableCaption>
      </Table>
    </MainLayout>
  );
};

export default function UsersPage() {
  return <UsersScreen />;
}
