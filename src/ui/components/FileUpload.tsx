import { useRef, useState } from 'react'
import css from './FileUpload.module.css'

export interface UploadedFile {
  name: string
  size: number
  file?: File
}

export interface FileUploadProps {
  files?: UploadedFile[]
  onChange?: (files: UploadedFile[]) => void
  accept?: string
  label?: string
  hint?: string
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(0) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

export function FileUpload({ files = [], onChange, accept, label, hint }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return
    const newFiles: UploadedFile[] = Array.from(fileList).map((f) => ({ name: f.name, size: f.size, file: f }))
    onChange?.([...files, ...newFiles])
  }

  return (
    <div className={css.root}>
      <div
        className={css.dropzone}
        data-drag-over={dragOver || undefined}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
      >
        <span className={`flow-icon ${css.dropzoneIcon}`} aria-hidden="true">cloud_upload</span>
        {label && <div className={css.dropzoneLabel}>{label}</div>}
        {hint && <div className={css.dropzoneHint}>{hint}</div>}
      </div>
      <input ref={inputRef} type="file" accept={accept} multiple onChange={(e) => addFiles(e.target.files)} style={{ display: 'none' }} />
      {files.length > 0 && (
        <div className={css.fileList}>
          {files.map((f, i) => (
            <div key={i} className={css.fileItem}>
              <span className={`flow-icon ${css.fileIcon}`} aria-hidden="true">description</span>
              <span className={css.fileName}>{f.name}</span>
              <span className={css.fileSize}>{formatSize(f.size)}</span>
              <button
                className={css.fileRemove}
                onClick={(e) => { e.stopPropagation(); onChange?.(files.filter((_, j) => j !== i)) }}
                aria-label={'Quitar ' + f.name}
              >
                <span className="flow-icon" style={{ fontSize: 16 }}>close</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
