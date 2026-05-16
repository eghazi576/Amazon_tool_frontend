import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, FileSpreadsheet, X, CheckCircle2, ArrowRight } from "lucide-react";

const MAX_SIZE_MB = 20;

const CsvUpload = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const validateAndSet = useCallback(
    (f: File | undefined | null) => {
      if (!f) return;
      const isCsv =
        f.type === "text/csv" ||
        f.type === "application/vnd.ms-excel" ||
        f.name.toLowerCase().endsWith(".csv");

      if (!isCsv) {
        toast({
          title: "Invalid file type",
          description: "Please upload a .csv file.",
          variant: "destructive",
        });
        return;
      }
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `Max size is ${MAX_SIZE_MB}MB.`,
          variant: "destructive",
        });
        return;
      }
      setFile(f);
      toast({
        title: "File ready",
        description: `${f.name} loaded successfully.`,
      });
    },
    [toast]
  );

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSet(e.dataTransfer.files?.[0]);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <section id="upload" className="relative py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary sm:text-sm">
            Try it now
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Upload your <span className="gradient-text">CSV file</span>
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Drag &amp; drop or browse from your device. We&apos;ll handle the rest.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <label
            htmlFor="csv-input"
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={`glass relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-spring sm:p-10 md:p-14 ${
              isDragging
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-border hover:border-primary/50"
            }`}
          >
            <input
              ref={inputRef}
              id="csv-input"
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={(e) => validateAndSet(e.target.files?.[0])}
            />

            {!file ? (
              <>
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-elegant sm:h-20 sm:w-20">
                  <UploadCloud className="h-7 w-7 text-primary-foreground sm:h-9 sm:w-9" />
                </div>
                <h3 className="font-display text-lg font-semibold sm:text-xl">
                  Drop your CSV here
                </h3>
                <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
                  or tap below to browse files from your device
                </p>

                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
                  <Button variant="hero" size="lg" type="button" className="w-full sm:w-auto">
                    <UploadCloud className="h-4 w-4" />
                    Choose CSV File
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Max {MAX_SIZE_MB}MB · .csv only
                  </span>
                </div>
              </>
            ) : (
              <div className="w-full animate-fade-up">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/15 sm:h-16 sm:w-16">
                  <CheckCircle2 className="h-7 w-7 text-green-400 sm:h-8 sm:w-8" />
                </div>

                <div className="mx-auto flex max-w-md items-center gap-3 rounded-xl border border-border bg-muted/40 p-3 text-left sm:p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-primary sm:h-12 sm:w-12">
                    <FileSpreadsheet className="h-5 w-5 text-primary-foreground sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setFile(null);
                      if (inputRef.current) inputRef.current.value = "";
                    }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-smooth hover:bg-destructive/20 hover:text-destructive"
                    aria-label="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button variant="hero" size="lg" type="button" className="group w-full sm:w-auto">
                    Analyze with AI
                    <ArrowRight className="transition-smooth group-hover:translate-x-1" />
                  </Button>
                  <Button
                    variant="glass"
                    size="lg"
                    type="button"
                    className="w-full sm:w-auto"
                    onClick={(e) => {
                      e.preventDefault();
                      inputRef.current?.click();
                    }}
                  >
                    Choose another
                  </Button>
                </div>
              </div>
            )}

            {/* Glow accents */}
            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-accent/15 blur-3xl" />
          </label>
        </div>
      </div>
    </section>
  );
};

export default CsvUpload;
