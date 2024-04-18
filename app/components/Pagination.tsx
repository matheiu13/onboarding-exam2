"use client";
import { Button, Group } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({
  hasNextPage,
  hasPrevPage,
}: {
  hasNextPage: boolean;
  hasPrevPage: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = searchParams.get("page") ?? "1";
  const per_page = searchParams.get("per_page") ?? "3";
  return (
    <div>
      <Group>
        <Button
          onClick={() => {
            router.push(`/home/?page=${Number(page) - 1}&per_page=${per_page}`);
          }}
          disabled={!hasPrevPage}
        >
          previous
        </Button>
        <Button
          onClick={() => {
            router.push(`/home/?page=${Number(page) + 1}&per_page=${per_page}`);
          }}
          disabled={!hasNextPage}
        >
          next
        </Button>
      </Group>
    </div>
  );
}
