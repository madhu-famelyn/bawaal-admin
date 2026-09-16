import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { languageNativeLabel } from "@/config/platform";
import { useCreators } from "@/hooks/admin/useCatalog";
import { compactNumber, shortDate } from "@/lib/format";

export const Route = createFileRoute("/admin/creators")({
  head: () => ({
    meta: [
      { title: "Creators — Echo Reels Admin" },
      {
        name: "description",
        content:
          "Manage Bhojpuri studios and independent creators on Echo Reels: verification, catalog size and audience reach.",
      },
      { property: "og:title", content: "Creators — Echo Reels Admin" },
      {
        property: "og:description",
        content: "Verification, catalog size and audience reach for every creator.",
      },
    ],
  }),
  component: CreatorsPage,
});

function CreatorsPage() {
  const { creators, isPending, toggleVerified } = useCreators();

  return (
    <>
      <AdminTopbar title="Creators" subtitle="Studios and independent creators publishing on Echo Reels" />

      <div className="px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="panel overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Creator</TableHead>
                <TableHead className="hidden sm:table-cell">Language</TableHead>
                <TableHead>Followers</TableHead>
                <TableHead className="hidden md:table-cell">Videos</TableHead>
                <TableHead className="hidden lg:table-cell">Joined</TableHead>
                <TableHead className="text-right">Verification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    <Loader2 className="mr-2 inline size-4 animate-spin" /> Loading creators…
                  </TableCell>
                </TableRow>
              )}
              {creators.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <p className="flex items-center gap-1.5 font-medium">
                      {c.name}
                      {c.verified && <BadgeCheck className="size-4 text-primary" />}
                    </p>
                    <p className="text-xs text-muted-foreground">@{c.handle}</p>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {languageNativeLabel(c.language)}
                  </TableCell>
                  <TableCell className="text-sm">{compactNumber(c.followers)}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {c.videoCount}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {shortDate(c.joinedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={c.verified ? "secondary" : "default"}
                      onClick={() => {
                        toggleVerified(c.id, !c.verified);
                        toast.success(
                          c.verified ? `Verification removed for ${c.name}` : `${c.name} verified`,
                        );
                      }}
                    >
                      {c.verified ? "Remove badge" : "Verify"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
