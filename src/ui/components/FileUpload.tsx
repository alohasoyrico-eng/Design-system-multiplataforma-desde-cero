import { useRef, useState } from 'react'
import { useIntl } from 'react-intl'
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
  /** Varios archivos (default). Con false, uno nuevo reemplaza al anterior. */
  multiple?: boolean
  disabled?: boolean
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(0) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

export function FileUpload({ files = [], onChange, accept, label, hint, multiple = true, disabled = false }: FileUploadProps) {
  const intl = useIntl()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  // accept se aplica al selector del sistema y tambien se valida al soltar:
  // arrastrar no puede meter lo que el selector no dejaria elegir.
  const pasaAccept = (f: File) => {
    if (!accept) return true
    const nombre = f.name.toLowerCase()
    const tipo = (f.type || '').toLowerCase()
    return accept
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
      .some((t) =>
        t.startsWith('.') ? nombre.endsWith(t) : t.endsWith('/*') ? tipo.startsWith(t.slice(0, -1)) : tipo === t,
      )
  }

  const addFiles = (fileList: FileList | null, validar = false) => {
    if (!fileList || disabled) return
    const aceptados = Array.from(fileList).filter((f) => !validar || pasaAccept(f))
    if (!aceptados.length) return
    const newFiles: UploadedFile[] = aceptados.map((f) => ({ name: f.name, size: f.size, file: f }))
    onChange?.(multiple ? [...files, ...newFiles] : newFiles.slice(0, 1))
  }

  return (
    <div className={css.root} data-disabled={disabled || undefined}>
      <button
        type="button"
        className={css.dropzone}
        data-drag-over={dragOver || undefined}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files, true) }}
      >
        <span className={`flow-symbol ${css.dropzoneIcon}`} aria-hidden="true">cloud_upload</span>
        {label && <div className={css.dropzoneLabel}>{label}</div>}
        {hint && <div className={css.dropzoneHint}>{hint}</div>}
      </button>
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} disabled={disabled} onChange={(e) => addFiles(e.target.files)} style={{ display: 'none' }} />
      {files.length > 0 && (
        <div className={css.fileList}>
          {files.map((f, i) => (
            <div key={i} className={css.fileItem}>
              <span className={`flow-symbol ${css.fileIcon}`} aria-hidden="true">description</span>
              <span className={css.fileName}>{f.name}</span>
              <span className={css.fileSize}>{formatSize(f.size)}</span>
              <button
                className={css.fileRemove}
                onClick={(e) => { e.stopPropagation(); onChange?.(files.filter((_, j) => j !== i)) }}
                aria-label={intl.formatMessage({ id: 'common.remove', defaultMessage: 'Quitar {name}' }, { name: f.name })}
              >
                <span className="flow-symbol flow-symbol--sm" aria-hidden="true">close</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
