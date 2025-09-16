import { MainLayout } from "@/components/layout/LayoutTemplate";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pb } from "@/config/pocketbaseConfig";
import { useUsersStore } from "@/modules/users/usersStore";

export const UsersScreen = () => {
  const usersStore = useUsersStore();

  return (
    <MainLayout>
      <Button onClick={() => pb.collection("_superusers").authRefresh()}>Auth refresh</Button>

      <pre>{JSON.stringify(usersStore.data, undefined, 2)}</pre>

      <br />
      <br />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
        </TableBody>
        <TableCaption>A list of your recent invoices.</TableCaption>
      </Table>
    </MainLayout>
  );
};

export default function UsersPage() {
  return <UsersScreen />;
}
