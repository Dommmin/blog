import type React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useForm, router } from "@inertiajs/react"
import { useState } from "react"
import { useTranslations } from "@/hooks/useTranslation"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { type File as FileType } from "@/types/blog"
import { toast } from "sonner"
import { Pagination } from "./ui/pagination"

interface FileDialogProps {
  onSelect: (file: number) => void
  selectedFileId?: number | null
  files: {
      data: FileType[];
      current_page: number;
      last_page: number;
      prev_page_url: string | null;
      next_page_url: string | null;
  }
}

export function FileManager({ onSelect, selectedFileId, files }: FileDialogProps) {
  const [open, setOpen] = useState(false)
  const { __ } = useTranslations()

  const { data, setData, reset, post, processing } = useForm<{ file: File | null }>({
    file: null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          setData('file', file as never);
      }
  };

  const handleFileUpload = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.stopPropagation();

      post(route('admin.files.store'), {
          onSuccess: () => {
              setData('file', null as never);
              reset();
              toast.success(__('File uploaded successfully'));
          },
      });
  };

  const handleFileSelect = (file: FileType) => {
    onSelect(file.id)
    setOpen(false)
  }

  const handlePageChange = (url: string | null) => {
    if (!url) return;
    router.get(url, {}, {
      preserveState: true,
      replace: true,
      onSuccess: () => setOpen(true),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button">
          {selectedFileId ? __("Change File") : __("Select File")}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-none h-[90vh] w-[95vw] p-0 flex flex-col"
        style={{ width: "95vw", maxWidth: "95vw" }}
      >
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>{__('File Manager')}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex flex-col px-4 min-h-0">
          <div className="flex-1 overflow-auto min-h-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5 lg:gap-4 auto-rows-max">
              {files.data.map((file) => (
                <Card
                  key={file.id}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-accent",
                    selectedFileId === file.id && "border-primary border-2",
                    "aspect-square"
                  )}
                  onClick={() => handleFileSelect(file)}
                >
                  <CardContent className="p-1 h-full w-full">
                    {file.mime_type.startsWith("image/") ? (
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt={file.original_name}
                        className="w-full h-full object-cover rounded-sm aspect-square"
                      />
                    ) : (
                      <div className="flex w-full h-full aspect-square items-center justify-center bg-muted rounded-sm">
                        <span className="text-lg">📄</span>
                      </div>
                    )}
                    <p className="mt-0.5 truncate text-[9px] leading-tight">{file.original_name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination */}
        {(files.prev_page_url || files.next_page_url) && (
          <div className="mt-6 px-4">
              <Pagination className="justify-between">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(files.prev_page_url)}
                    onMouseEnter={() => files.prev_page_url && router.prefetch(files.prev_page_url, { method: 'get', data: { page: files.current_page - 1 } }, { cacheFor: '1m' })}
                    disabled={!files.prev_page_url}
                  >
                    {__('Previous')}
                  </Button>

                  <div className="text-muted-foreground text-sm">
                      {__('Page')} {files.current_page} {__('of')} {files.last_page}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(files.next_page_url)}
                    onMouseEnter={() => files.next_page_url && router.prefetch(files.next_page_url, { method: 'get', data: { page: files.current_page + 1 } }, { cacheFor: '1m' })}
                    disabled={!files.next_page_url}
                  >
                    {__('Next')}
                  </Button>
              </Pagination>
          </div>
        )}

        <DialogFooter className="px-6 py-2 border-t">
          <form onSubmit={handleFileUpload} className="flex items-center">
            <Input type="file" onChange={handleFileChange} />
            <Button type="submit" disabled={!data.file || processing} size="sm" className="h-7 px-2 text-xs">
              {processing ? __('Uploading...') : __('Upload')}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
