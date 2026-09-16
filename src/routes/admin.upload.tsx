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
  languageNativeLabel,
  verticalLabel,
} from "@/config/platform";
import { useCreators } from "@/hooks/admin/useCatalog";
import { useCreateVideo } from "@/hooks/admin/useVideos";
import type { VideoPayload } from "@/types/admin";

const schema = z.object({
  title: z.string().min(3, "Give the video a title of at least 3 characters"),
  description: z.string().min(10, "Add a short synopsis (10+ characters)"),
  vertical: z.string().min(1, "Pick a content vertical"),
  language: z.enum(["bho", "hi", "bh-mag", "raj"]),
  kind: z.enum(["short", "episode", "movie", "trailer"]),
  status: z.enum(["draft", "processing", "published", "scheduled", "rejected"]),
  creatorId: z.string().min(1, "Pick a creator"),
  durationSec: z.coerce.number().min(10, "At least 10 seconds").max(7200),
  mature: z.boolean(),
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
      status: "draft",
      creatorId: "",
      durationSec: 120,
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
    formState: { errors },
  } = form;

  const onSubmit = (values: FormValues) => {
    const parsed = schema.parse(values);
    create.mutate(parsed as VideoPayload, {
      onSuccess: () => toast.success(`"${parsed.title}" saved to the catalog`),
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
                    {languageNativeLabel(watch("language"))} · {languageLabel(watch("language"))}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l.code} value={l.code} disabled={!l.enabled}>
                      {l.nativeLabel} · {l.label}
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
                value={watch("creatorId")}
                onValueChange={(v) => setValue("creatorId", v, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select creator">
                    {creators.find((c) => c.id === watch("creatorId"))?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {creators.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field("creatorId") && (
                <p className="text-xs text-destructive">{field("creatorId")}</p>
              )}
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
            <h2 className="text-base font-semibold">Streaming source</h2>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hlsUrl">HLS manifest URL (.m3u8)</Label>
            <Input
              id="hlsUrl"
              placeholder="https://cdn.echoreels.in/vod/litti-chokha/master.m3u8"
              {...register("hlsUrl")}
            />
            {field("hlsUrl") && <p className="text-xs text-destructive">{field("hlsUrl")}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="thumbnailUrl">Poster image URL</Label>
            <Input
              id="thumbnailUrl"
              placeholder="https://cdn.echoreels.in/posters/litti-chokha.jpg"
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
