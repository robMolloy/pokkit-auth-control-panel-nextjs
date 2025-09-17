import { MainLayout } from "@/components/layout/LayoutTemplate";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { LoadingScreen } from "@/screens/LoadingScreen";
import { useState } from "react";

export const UsersScreen = () => {
  const [pageSize, _setPageSize] = useState(5);
  const usersStore = useUsersStore();
  const [pageNumber, setPageNumber] = useState(0);
  const firstItem = pageNumber * pageSize;
  const lastItem = firstItem + pageSize;

  return (
    <MainLayout>
      <Button
        onClick={() => {
          [...Array(1)].map((_, i) => {
            const email = `test-${Math.floor(Math.random() * 100000000)}-${i}@test.com`;

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
      {usersStore.data === undefined && <LoadingScreen />}
      {usersStore.data === null && <div>No users found</div>}
      {usersStore.data &&
        (() => {
          const numberOfPages = Math.ceil(usersStore.data.length / pageSize);
          const allPageNumbers = [...Array(numberOfPages)].map((_, i) => i);
          const firstVisiblePageNumber = Math.max(0, pageNumber - 2);
          const lastVisiblePageNumber = Math.min(numberOfPages, pageNumber + 3);
          const visiblePageNumbers = allPageNumbers.slice(
            firstVisiblePageNumber,
            lastVisiblePageNumber,
          );
          const lastPageNumber = Math.max(allPageNumbers.slice(-1)[0] ?? 0);
          const isFirstPageNumberVisible = visiblePageNumbers.includes(0);
          const isLastPageNumberVisible = visiblePageNumbers.includes(lastPageNumber);

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
              {lastItem < usersStore.data.length ? lastItem : usersStore.data.length + 1} of{" "}
              {usersStore.data.length + 1}
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPageNumber((x) => (x === 0 ? x : x - 1))}
                    />
                  </PaginationItem>
                  {!isFirstPageNumberVisible && (
                    <>
                      <PaginationItem>
                        <PaginationLink onClick={() => setPageNumber(0)}>{1}</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    </>
                  )}
                  {visiblePageNumbers.map((x) => (
                    <PaginationItem key={x}>
                      <PaginationLink onClick={() => setPageNumber(x)} isActive={pageNumber === x}>
                        {x + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {!isLastPageNumberVisible && (
                    <>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink onClick={() => setPageNumber(lastPageNumber)}>
                          {lastPageNumber + 1}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPageNumber((x) => (x === lastPageNumber ? x : x + 1))}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          );
        })()}
    </MainLayout>
  );
};

export default function UsersPage() {
  return <UsersScreen />;
}
