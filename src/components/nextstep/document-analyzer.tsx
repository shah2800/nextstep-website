"use client";

import { useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Extracted = {
  qualification?: string;
  institution?: string;
  majorOrGroup?: string;
  graduationYear?: string;
  gradeOrGPA?: string;
  keySubjects?: string[];
  englishLevel?: string;
  summary?: string;
  confidence?: string;
};

type Match = {
  slug: string;
  name: string;
  flagEmoji: string;
  reason: string;
};

export function DocumentAnalyzer() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    extracted: Extracted;
    matches: Match[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    setResult(null);
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, or WebP) of your document.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Image is too large. Please upload an image under 8 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      setImageData(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const analyze = async () => {
    if (!imageData || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/analyze-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData, mimeType: "image/png" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Analysis failed");
      }
      setResult({ extracted: data.extracted, matches: data.matches ?? [] });
      toast.success("Document analyzed!", {
        description: `${data.matches?.length ?? 0} destinations matched.`,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Please try again";
      setError(msg);
      toast.error("Analysis failed", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPreview(null);
    setImageData(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Upload column */}
      <Card>
        <CardContent className="p-6">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />

          {!preview ? (
            <div
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
              className="flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary/30 p-8 text-center transition-colors hover:border-brand/50 hover:bg-brand/5"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
                <UploadCloud className="h-7 w-7" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-foreground">
                Upload your transcript
              </h3>
              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Drag & drop or click to upload a photo of your mark sheet,
                transcript, or degree. We&apos;ll extract your academic profile
                with AI.
              </p>
              <Badge variant="secondary" className="mt-4 gap-1">
                <Sparkles className="h-3 w-3 text-gold" />
                AI-Powered · Secure
              </Badge>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl border border-border">
                <img
                  src={preview}
                  alt="Uploaded document preview"
                  className="max-h-[320px] w-full object-contain bg-secondary/30"
                />
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-secondary/50 p-3 text-sm text-muted-foreground">
                <FileText className="h-4 w-4 shrink-0 text-brand" />
                Document ready for analysis
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={analyze}
                  disabled={loading}
                  className="flex-1 bg-brand text-white hover:bg-brand/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Analyze with AI
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={reset} disabled={loading}>
                  Change
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results column */}
      <Card>
        <CardContent className="p-6">
          {!result && !loading && (
            <div className="flex min-h-[280px] flex-col items-center justify-center text-center text-muted-foreground">
              <FileText className="h-12 w-12 text-border" />
              <p className="mt-3 text-sm">
                Your extracted academic profile and matched destinations will
                appear here.
              </p>
            </div>
          )}

          {loading && (
            <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
              <Loader2 className="h-10 w-10 animate-spin text-brand" />
              <p className="mt-4 text-sm font-medium text-foreground">
                Reading your document…
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Extracting qualification, grades, and subjects with AI vision.
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-bold text-foreground">
                  Academic Profile
                </h3>
                {result.extracted.confidence && (
                  <Badge
                    variant="secondary"
                    className={
                      result.extracted.confidence === "high"
                        ? "bg-green-100 text-green-700"
                        : result.extracted.confidence === "medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                    }
                  >
                    {result.extracted.confidence} confidence
                  </Badge>
                )}
              </div>

              {result.extracted.summary && (
                <p className="rounded-lg bg-secondary/50 p-3 text-sm italic text-foreground/90">
                  &ldquo;{result.extracted.summary}&rdquo;
                </p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <InfoTile label="Qualification" value={result.extracted.qualification} />
                <InfoTile label="Major / Group" value={result.extracted.majorOrGroup} />
                <InfoTile label="Grade / GPA" value={result.extracted.gradeOrGPA} />
                <InfoTile label="Graduation Year" value={result.extracted.graduationYear} />
                <InfoTile label="Institution" value={result.extracted.institution} />
                <InfoTile label="English Level" value={result.extracted.englishLevel} />
              </div>

              {result.extracted.keySubjects &&
                result.extracted.keySubjects.length > 0 && (
                  <div>
                    <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Key Subjects
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {result.extracted.keySubjects.map((s) => (
                        <Badge key={s} variant="secondary" className="font-normal">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              {/* Matched destinations */}
              {result.matches.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                    <Sparkles className="h-4 w-4 text-gold" />
                    Matched Destinations ({result.matches.length})
                  </h4>
                  <div className="space-y-2">
                    {result.matches.map((m) => (
                      <div
                        key={m.slug}
                        className="flex items-start gap-3 rounded-xl border border-border bg-card p-3"
                      >
                        <span className="text-2xl">{m.flagEmoji}</span>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-foreground">
                            {m.name}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {m.reason}
                          </p>
                        </div>
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-brand" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={reset} variant="outline" className="w-full">
                Analyze another document
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-medium text-foreground">
        {value || "—"}
      </div>
    </div>
  );
}
