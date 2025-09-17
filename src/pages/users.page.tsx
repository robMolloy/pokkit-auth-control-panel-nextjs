import { MainLayout } from "@/components/layout/LayoutTemplate";
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
import { useUsersStore } from "@/modules/users/usersStore";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { useEffect, useState } from "react";

const Paginator = (
  p: {
    pageNumber?: number;
    setPageNumber?: (x: number) => void;
  } & ({ numberOfPages: number } | { numberOfItems: number; itemsPerPage: number }),
) => {
  const [innerPageNumber, setInnerPageNumber] = useState(p.pageNumber ?? 0);

  const numberOfPages =
    "numberOfPages" in p ? p.numberOfPages : Math.ceil(p.numberOfItems / p.itemsPerPage);

  const allPageNumbers = [...Array(numberOfPages)].map((_, i) => i);
  const firstVisiblePageNumber = Math.max(0, innerPageNumber - 2);
  const lastVisiblePageNumber = Math.min(numberOfPages, innerPageNumber + 3);
  const visiblePageNumbers = allPageNumbers.slice(firstVisiblePageNumber, lastVisiblePageNumber);
  const lastPageNumber = Math.max(allPageNumbers.slice(-1)[0] ?? 0);
  const isFirstPageNumberVisible = visiblePageNumbers.includes(0);
  const isLastPageNumberVisible = visiblePageNumbers.includes(lastPageNumber);

  useEffect(() => {
    if (p.pageNumber) setInnerPageNumber(p.pageNumber);
  }, [p.pageNumber]);
  useEffect(() => p.setPageNumber?.(innerPageNumber), [innerPageNumber]);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => setInnerPageNumber((x) => (x === 0 ? x : x - 1))} />
        </PaginationItem>
        {!isFirstPageNumberVisible && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => setInnerPageNumber(0)}>{1}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}
        {visiblePageNumbers.map((x) => (
          <PaginationItem key={x}>
            <PaginationLink onClick={() => setInnerPageNumber(x)} isActive={innerPageNumber === x}>
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
              <PaginationLink onClick={() => setInnerPageNumber(lastPageNumber)}>
                {lastPageNumber + 1}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() => setInnerPageNumber((x) => (x === lastPageNumber ? x : x + 1))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

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
