import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { StatusPill, statusTone } from "@/components/admin/StatusPill";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUsers } from "@/hooks/admin/useCatalog";
import { fullNumber, shortDate } from "@/lib/format";
import type { Role } from "@/types/admin";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { title: "Users & Roles — Echo Reels Admin" },
      {
        name: "description",
        content:
          "Assign USER or ADMIN roles, suspend accounts and review watch time for Echo Reels viewers.",
      },
      { property: "og:title", content: "Users & Roles — Echo Reels Admin" },
      {
        property: "og:description",
        content: "Assign USER or ADMIN roles, suspend accounts and review watch time.",
      },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  const { users, isPending, updateUser } = useUsers();

  return (
    <>
      <AdminTopbar
        title="Users & roles"
        subtitle="Two roles exist: USER for viewers, ADMIN for console access"
      />

      <div className="px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="panel overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead className="hidden md:table-cell">Watch minutes</TableHead>
                <TableHead className="hidden lg:table-cell">Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    <Loader2 className="mr-2 inline size-4 animate-spin" /> Loading accounts…
                  </TableCell>
                </TableRow>
              )}
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {fullNumber(u.watchMinutes)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {shortDate(u.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <StatusPill tone={statusTone(u.status)}>{u.status}</StatusPill>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => {
                          const next = u.status === "active" ? "suspended" : "active";
                          updateUser(u.id, { status: next });
                          toast.success(`${u.name} is now ${next}`);
                        }}
                      >
                        {u.status === "active" ? "Suspend" : "Restore"}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Select
                      value={u.role}
                      onValueChange={(role) => {
                        updateUser(u.id, { role: role as Role });
                        toast.success(`${u.name} role set to ${role}`);
                      }}
                    >
                      <SelectTrigger className="ml-auto h-8 w-28 text-xs">
                        <SelectValue>{u.role}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">USER</SelectItem>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                      </SelectContent>
                    </Select>
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
