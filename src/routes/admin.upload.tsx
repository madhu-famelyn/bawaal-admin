import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CONTENT_VERTICALS,
  LANGUAGES,
  languageLabel,
  verticalLabel,
} from "@/config/platform";
import { useCreators } from "@/hooks/admin/useCatalog";
import { useCreateVideo } from "@/hooks/admin/useVideos";
import type { VideoPayload } from "@/types/admin";

const schema = z.object({
  title: z.string().min(2, "Give the video a title of at least 2 characters"),
  description: z.string().optional().default(""),
  vertical: z.string().default("shorts"),
  language: z.enum(["bho", "hi", "bh-mag", "raj"]).default("bho"),
  kind: z.enum(["short", "episode", "movie", "trailer"]).default("short"),
  status: z.enum(["draft", "processing", "published", "scheduled", "rejected"]).default("published"),
  creatorId: z.string().optional().default("admin"),
  durationSec: z.coerce.number().min(1).max(7200).default(60),
  mature: z.boolean().default(false),
  hlsUrl: z.string().url("Enter a valid HLS (.m3u8) URL").or(z.literal("")),
  thumbnailUrl: z.string().url("Enter a valid image URL").or(z.literal("")),
});

type FormValues = z.input<typeof schema>;

export const Route = createFileRoute("/admin/upload")({
  head: () => ({
    meta: [
      { title: "New Upload — Echo Reels Admin" },
      {
        name: "description",
        content:
          "Register a new Bhojpuri video: metadata, vertical, creator, HLS source and publishing state.",
      },
      { property: "og:title", content: "New Upload — Echo Reels Admin" },
      {
        property: "og:description",
        content: "Register a new video with metadata, HLS source and publishing state.",
      },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const navigate = useNavigate();
  const { creators } = useCreators();
  const create = useCreateVideo(() => navigate({ to: "/admin/videos" }));

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      vertical: "shorts",
      language: "bho",
      kind: "short",
      status: "published",
      creatorId: "admin",
      durationSec: 60,
      mature: false,
      hlsUrl: "",
      thumbnailUrl: "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = form;

  const onSubmit = (values: FormValues) => {
    const payload = {
      ...values,
      creatorId: values.creatorId || "admin",
    };
    create.mutate(payload as VideoPayload, {
      onSuccess: () => toast.success(`"${values.title}" saved to the catalog`),
    });
  };

  const field = (name: keyof FormValues) => errors[name]?.message as string | undefined;

  return (
    <>
      <AdminTopbar
        title="New upload"
        subtitle="Metadata is stored now; the transcoder picks up the HLS source for streaming"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-5 px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="panel space-y-5 p-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Litti Chokha & Love Stories" {...register("title")} />
            {field("title") && <p className="text-xs text-destructive">{field("title")}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Synopsis</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Two college rivals from Patna & Ara clash at a highway dhaba…"
              {...register("description")}
            />
            {field("description") && (
              <p className="text-xs text-destructive">{field("description")}</p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Vertical</Label>
              <Select
                value={watch("vertical")}
                onValueChange={(v) => setValue("vertical", v, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue>{verticalLabel(watch("vertical"))}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_VERTICALS.map((v) => (
                    <SelectItem key={v.slug} value={v.slug}>
                      {v.emoji} {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Select
                value={watch("language")}
                onValueChange={(v) =>
                  setValue("language", v as FormValues["language"], { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue>
                    {languageLabel(watch("language"))}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l.code} value={l.code} disabled={!l.enabled}>
                      {l.label}
                      {!l.enabled ? " (soon)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Format</Label>
              <Select
                value={watch("kind")}
                onValueChange={(v) => setValue("kind", v as FormValues["kind"])}
              >
                <SelectTrigger>
                  <SelectValue>
                    <span className="capitalize">{watch("kind")}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (vertical feed)</SelectItem>
                  <SelectItem value="episode">Episode (series)</SelectItem>
                  <SelectItem value="movie">Movie</SelectItem>
                  <SelectItem value="trailer">Trailer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Creator</Label>
              <Select
                value={watch("creatorId") || "admin"}
                onValueChange={(v) => {
                  setValue("creatorId", v || "admin", { shouldValidate: true, shouldDirty: true });
                  clearErrors("creatorId");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select creator">
                    {creators.find((c) => c.id === watch("creatorId"))?.name ?? "Admin (Echo Reels)"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin (Echo Reels)</SelectItem>
                  {creators
                    .filter((c) => c.id !== "admin")
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="durationSec">Duration (seconds)</Label>
              <Input id="durationSec" type="number" {...register("durationSec")} />
              {field("durationSec") && (
                <p className="text-xs text-destructive">{field("durationSec")}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Publishing state</Label>
              <Select
                value={watch("status")}
                onValueChange={(v) => setValue("status", v as FormValues["status"])}
              >
                <SelectTrigger>
                  <SelectValue>
                    <span className="capitalize">{watch("status")}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 p-4">
            <div>
              <p className="text-sm font-medium">18+ mature content</p>
              <p className="text-xs text-muted-foreground">
                Adds the age gate and hides it from the general feed
              </p>
            </div>
            <Switch
              checked={watch("mature")}
              onCheckedChange={(checked) => setValue("mature", checked)}
            />
          </div>
        </div>

        <div className="panel space-y-5 p-5">
          <div className="flex items-center gap-2">
            <UploadCloud className="size-4 text-primary" />
            <h2 className="text-base font-semibold">Bunny Stream Video Source</h2>
          </div>

          <div className="space-y-2 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <Label htmlFor="bunnyGuid" className="text-xs font-semibold text-primary">
              ⚡ Quick Fill: Bunny Video ID (GUID)
            </Label>
            <Input
              id="bunnyGuid"
              placeholder="e.g. fd7ac0ae-ebe2-4037-9832-d14e46740fed or player URL"
              onChange={(e) => {
                const val = e.target.value.trim();
                const match = val.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
                if (match) {
                  const guid = match[0];
                  setValue("hlsUrl", `https://vz-178c7a7d-b5e.b-cdn.net/${guid}/playlist.m3u8`, { shouldValidate: true, shouldDirty: true });
                  setValue("thumbnailUrl", `https://vz-178c7a7d-b5e.b-cdn.net/${guid}/thumbnail.jpg`, { shouldValidate: true, shouldDirty: true });
                  clearErrors("hlsUrl");
                  clearErrors("thumbnailUrl");
                }
              }}
            />
            <p className="text-[11px] text-muted-foreground">
              Paste your Bunny Stream Video GUID to automatically generate the HLS manifest and poster URLs.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hlsUrl">HLS manifest URL (.m3u8)</Label>
            <Input
              id="hlsUrl"
              placeholder="https://vz-178c7a7d-b5e.b-cdn.net/VIDEO_ID/playlist.m3u8"
              {...register("hlsUrl")}
            />
            {field("hlsUrl") && <p className="text-xs text-destructive">{field("hlsUrl")}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="thumbnailUrl">Poster image URL</Label>
            <Input
              id="thumbnailUrl"
              placeholder="https://vz-178c7a7d-b5e.b-cdn.net/VIDEO_ID/thumbnail.jpg"
              {...register("thumbnailUrl")}
            />
            {field("thumbnailUrl") && (
              <p className="text-xs text-destructive">{field("thumbnailUrl")}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={create.isPending}>
            {create.isPending && <Loader2 className="size-4 animate-spin" />}
            Save to catalog
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate({ to: "/admin/videos" })}>
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
}
