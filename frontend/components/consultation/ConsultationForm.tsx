"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";

import {
  createConsultationRequest,
  getMyConsultationRequests,
} from "@/lib/api";
import type { ConsultationRequestSummary } from "@/lib/types";

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"];
const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

type ConsultationTab = "new" | "mine";

function hasValidExtension(fileName: string) {
  const lowered = fileName.toLowerCase();
  return ALLOWED_EXTENSIONS.some((extension) => lowered.endsWith(extension));
}

function isSameFile(left: File, right: File) {
  return (
    left.name === right.name &&
    left.size === right.size &&
    left.lastModified === right.lastModified
  );
}

function statusClasses(status: ConsultationRequestSummary["status"]) {
  switch (status) {
    case "resolved":
      return "bg-green-100 text-green-800 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    case "in_review":
      return "bg-amber-100 text-amber-800 border-amber-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
}

export default function ConsultationForm() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { data: session, status } = useSession();

  const [activeTab, setActiveTab] = useState<ConsultationTab>("new");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requests, setRequests] = useState<ConsultationRequestSummary[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [requestsError, setRequestsError] = useState("");

  const validateFiles = (selectedFiles: File[]) => {
    if (selectedFiles.length > MAX_FILES) {
      return `Solo puedes adjuntar hasta ${MAX_FILES} archivos.`;
    }

    for (const file of selectedFiles) {
      if (!hasValidExtension(file.name)) {
        return `El archivo ${file.name} no tiene un formato permitido.`;
      }
      if (file.size > MAX_FILE_SIZE) {
        return `El archivo ${file.name} supera el maximo de 10 MB.`;
      }
    }

    return "";
  };

  const syncFileInput = (nextFiles: File[]) => {
    if (!fileInputRef.current) return;

    const dataTransfer = new DataTransfer();
    nextFiles.forEach((file) => dataTransfer.items.add(file));
    fileInputRef.current.files = dataTransfer.files;
  };

  const loadRequests = async () => {
    setIsLoadingRequests(true);
    setRequestsError("");

    try {
      const result = await getMyConsultationRequests();
      setRequests(result);
    } catch (loadError) {
      setRequestsError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudieron cargar tus solicitudes."
      );
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      loadRequests();
    }
  }, [status, session?.user?.email]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const incomingFiles = Array.from(event.target.files ?? []);
    const mergedFiles = [...files];

    incomingFiles.forEach((incomingFile) => {
      const alreadyExists = mergedFiles.some((file) => isSameFile(file, incomingFile));
      if (!alreadyExists) {
        mergedFiles.push(incomingFile);
      }
    });

    const validationError = validateFiles(mergedFiles);
    setError(validationError);

    if (!validationError) {
      setFiles(mergedFiles);
      syncFileInput(mergedFiles);
    } else if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    event.target.value = "";
  };

  const handleRemoveFile = (fileToRemove: File) => {
    const updatedFiles = files.filter((file) => !isSameFile(file, fileToRemove));
    setFiles(updatedFiles);
    setError("");
    syncFileInput(updatedFiles);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateFiles(files);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("phone", phone.trim());
      formData.append("subject", subject.trim());
      formData.append("message", message.trim());
      files.forEach((file) => formData.append("attachments", file, file.name));

      const result = await createConsultationRequest(formData);

      setPhone("");
      setSubject("");
      setMessage("");
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSuccessMessage(result.message);

      await loadRequests();
      setActiveTab("mine");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "No se pudo enviar la solicitud de consultoria."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="animate-pulse bg-surface rounded-lg p-6 border border-border">
        <div className="h-4 bg-border rounded w-1/3 mb-4" />
        <div className="h-12 bg-border rounded mb-3" />
        <div className="h-12 bg-border rounded mb-3" />
        <div className="h-32 bg-border rounded" />
      </div>
    );
  }

  if (!session?.user?.email || !session.user.name) {
    return (
      <div className="bg-surface rounded-lg p-8 text-center border border-border">
        <h2 className="text-2xl font-bold text-heading mb-3">
          Solicita una consultoria legal
        </h2>
        <p className="text-body mb-6">
          Para proteger tu informacion, el envio de solicitudes y la consulta
          de su estado se realizan con inicio de sesion de Google.
        </p>
        <button
          onClick={() => signIn("google")}
          className="inline-flex items-center gap-3 px-6 py-3 rounded-md bg-white border border-border shadow-sm hover:shadow-md transition-all text-heading font-medium"
        >
          Iniciar sesion con Google
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-white p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("new")}
            className={`rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === "new"
                ? "bg-primary text-white shadow-sm"
                : "text-heading hover:bg-surface"
            }`}
          >
            Nueva solicitud
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("mine")}
            className={`rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === "mine"
                ? "bg-primary text-white shadow-sm"
                : "text-heading hover:bg-surface"
            }`}
          >
            Mis solicitudes
          </button>
        </div>
      </div>

      {activeTab === "new" ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-border shadow-sm p-6 md:p-8 space-y-7"
        >
          <div>
            <h2 className="text-2xl font-bold text-heading">
              Nueva solicitud de consultoria
            </h2>
            <p className="mt-2 text-body">
              Completa este formulario para enviarnos tu caso. Una vez recibida
              la solicitud, podrás consultar aquí mismo el estado de atención.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-heading mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                value={session.user.name}
                disabled
                className="w-full px-4 py-3 rounded-md border border-border bg-surface text-heading"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-heading mb-1">
                Email
              </label>
              <input
                type="email"
                value={session.user.email}
                disabled
                className="w-full px-4 py-3 rounded-md border border-border bg-surface text-heading"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-heading mb-1"
            >
              Telefono
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
              maxLength={50}
              placeholder="Tu telefono de contacto"
              className="w-full px-4 py-3 rounded-md border border-border bg-white text-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-heading mb-1"
            >
              Asunto
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              required
              maxLength={200}
              placeholder="Resume brevemente tu consulta"
              className="w-full px-4 py-3 rounded-md border border-border bg-white text-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-heading mb-1"
            >
              Descripcion del caso
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={6}
              required
              maxLength={5000}
              placeholder="Describe tu consulta con el mayor contexto posible"
              className="w-full px-4 py-3 rounded-md border border-border bg-white text-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y"
            />
          </div>

          <div className="space-y-3">
            <label
              htmlFor="attachments"
              className="block text-sm font-medium text-heading mb-1"
            >
              Adjuntos
            </label>

            <div className="rounded-xl border border-dashed border-border bg-surface px-4 py-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium text-heading">
                    Adjunta documentos de soporte
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Puedes subir demandas, soportes o imagenes relacionadas con
                    el caso.
                  </p>
                </div>

                <label
                  htmlFor="attachments"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-md bg-primary text-white font-semibold text-sm uppercase tracking-wider hover:bg-primary-light transition-colors cursor-pointer shadow-sm"
                >
                  Elegir archivos
                </label>
              </div>

              <input
                ref={fileInputRef}
                id="attachments"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="sr-only"
              />

              <div className="mt-4 rounded-lg border border-border bg-white px-4 py-3">
                {files.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-heading">
                      {files.length} archivo{files.length > 1 ? "s" : ""} seleccionado
                      {files.length > 1 ? "s" : ""}
                    </p>
                    <ul className="space-y-2 text-sm text-body">
                      {files.map((file) => (
                        <li
                          key={`${file.name}-${file.size}-${file.lastModified}`}
                          className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2"
                        >
                          <span className="truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(file)}
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-muted hover:border-primary hover:text-primary transition-colors"
                            aria-label={`Quitar ${file.name}`}
                            title={`Quitar ${file.name}`}
                          >
                            X
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-muted">
                    Ningun archivo seleccionado todavia.
                  </p>
                )}
              </div>
            </div>

            <p className="text-sm text-muted">
              Hasta 5 archivos. Formatos permitidos: PDF, DOC, DOCX, PNG, JPG y
              JPEG. Maximo 10 MB por archivo.
            </p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {successMessage && (
            <p className="text-sm text-green-700">{successMessage}</p>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-md bg-primary text-white font-semibold text-sm uppercase tracking-wider hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Enviando..." : "Enviar solicitud"}
            </button>
          </div>
        </form>
      ) : (
        <section className="bg-white rounded-xl border border-border shadow-sm p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-heading">Mis solicitudes</h2>
            <p className="mt-2 text-body">
              Aquí puedes revisar el estado de las solicitudes que has enviado
              con tu cuenta.
            </p>
          </div>

          {requestsError && <p className="text-sm text-red-600">{requestsError}</p>}

          {isLoadingRequests ? (
            <div className="space-y-3">
              <div className="h-20 rounded-lg bg-surface animate-pulse" />
              <div className="h-20 rounded-lg bg-surface animate-pulse" />
            </div>
          ) : requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((request) => (
                <article
                  key={request.id}
                  className="rounded-xl border border-border bg-surface p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-heading">
                        {request.subject}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        Enviada el{" "}
                        {new Date(request.created_at).toLocaleDateString("es-CO", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusClasses(
                        request.status
                      )}`}
                    >
                      {request.status_label}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-surface px-8 py-12 text-center">
              <p className="text-body">
                Aun no tienes solicitudes registradas con esta cuenta.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("new")}
                className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white hover:bg-primary-light transition-colors"
              >
                Crear mi primera solicitud
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
