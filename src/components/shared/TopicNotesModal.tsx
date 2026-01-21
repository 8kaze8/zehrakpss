/**
 * TopicNotesModal Component
 * Konu notları görüntüleme ve ekleme modal'ı
 */

"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/utils/cn";
import { Button } from "./Button";
import { Card } from "./Card";
import { useToast } from "@/context/ToastContext";
import { formatDate } from "@/utils/date";
import type { SubjectTopic } from "@/data/subjects";
import type { Subject, TopicNote } from "@/types";

interface TopicNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: SubjectTopic | null;
  subject: Subject;
  notes: TopicNote[];
  onAddNote: (topicId: string, content: string) => Promise<void>;
  onUpdateNote: (noteId: string, content: string) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
}

export function TopicNotesModal({
  isOpen,
  onClose,
  topic,
  subject,
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: TopicNotesModalProps) {
  const { showToast } = useToast();
  const [newNote, setNewNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Modal açıldığında formu temizle
  useEffect(() => {
    if (isOpen) {
      setNewNote("");
      setEditingNoteId(null);
      setEditContent("");
    }
  }, [isOpen]);

  // ESC tuşu ile kapat
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Modal açıkken body scroll'unu engelle
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleAddNote = useCallback(async () => {
    if (!topic || !newNote.trim()) {
      showToast({ message: "Lütfen bir not yazın.", type: "warning" });
      return;
    }

    setIsAdding(true);
    try {
      await onAddNote(topic.id, newNote.trim());
      setNewNote("");
      showToast({ message: "Not başarıyla eklendi.", type: "success" });
    } catch (error) {
      showToast({ message: "Not eklenirken bir hata oluştu.", type: "error" });
    } finally {
      setIsAdding(false);
    }
  }, [topic, newNote, onAddNote, showToast]);

  const handleEditNote = useCallback((note: TopicNote) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingNoteId(null);
    setEditContent("");
  }, []);

  const handleSaveEdit = useCallback(async (noteId: string) => {
    if (!editContent.trim()) {
      showToast({ message: "Not boş olamaz.", type: "warning" });
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdateNote(noteId, editContent.trim());
      setEditingNoteId(null);
      setEditContent("");
      showToast({ message: "Not güncellendi.", type: "success" });
    } catch (error) {
      showToast({ message: "Not güncellenirken bir hata oluştu.", type: "error" });
    } finally {
      setIsUpdating(false);
    }
  }, [editContent, onUpdateNote, showToast]);

  const handleDeleteNote = useCallback(async (noteId: string) => {
    setIsDeleting(noteId);
    try {
      await onDeleteNote(noteId);
      showToast({ message: "Not silindi.", type: "success" });
    } catch (error) {
      showToast({ message: "Not silinirken bir hata oluştu.", type: "error" });
    } finally {
      setIsDeleting(null);
    }
  }, [onDeleteNote, showToast]);

  // Topic notes'ları filtrele - early return'den önce (hook rules)
  const topicNotes = useMemo(() => {
    if (!topic) return [];
    return notes.filter((note) => note.topicId === topic.id);
  }, [notes, topic]);

  if (!isOpen) return null;
  
  if (!topic) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full sm:max-w-[600px] md:max-w-[700px] bg-background-light dark:bg-background-dark rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col ring-1 ring-black/5 dark:ring-white/10 relative overflow-hidden max-h-[90vh] sm:max-h-[85vh]">
        {/* Bottom Sheet Handle */}
        <div className="flex w-full items-center justify-center pt-3 pb-1">
          <div className="h-1.5 w-10 rounded-full bg-[#cfdbe7] dark:bg-slate-600" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Kapat"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Content */}
        <div className="flex flex-col w-full pt-2 pb-8 overflow-y-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center pt-4 pb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-2xl">
                notes
              </span>
              <h2 className="text-2xl font-bold text-text-main dark:text-white">
                Konu Notları
              </h2>
            </div>
            <h3 className="text-lg font-semibold text-text-main dark:text-white mt-2">
              {topic.name}
            </h3>
            <p className="text-sm text-text-sub dark:text-slate-400 mt-1">
              {formatDate(topic.dateRange.start, "d MMMM")} -{" "}
              {formatDate(topic.dateRange.end, "d MMMM yyyy")}
            </p>
          </div>

          {/* Notes List */}
          <div className="flex flex-col gap-3 mb-6">
            {topicNotes.length === 0 ? (
              <Card className="py-8">
                <div className="text-center text-text-sub dark:text-slate-400">
                  <span className="material-symbols-outlined text-4xl mb-2 block opacity-50">
                    note_add
                  </span>
                  <p>Henüz not eklenmemiş.</p>
                  <p className="text-xs mt-1">İlk notunuzu ekleyerek başlayın.</p>
                </div>
              </Card>
            ) : (
              topicNotes.map((note) => {
                const isEditing = editingNoteId === note.id;
                
                return (
                  <Card key={note.id} className="relative group">
                    {isEditing ? (
                      // Edit Mode
                      <div className="flex flex-col gap-3">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={4}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-sm sm:text-base"
                          placeholder="Notunuzu buraya yazın..."
                          autoFocus
                        />
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          <Button
                            onClick={handleCancelEdit}
                            variant="outline"
                            size="sm"
                            disabled={isUpdating}
                            className="text-xs sm:text-sm"
                          >
                            İptal
                          </Button>
                          <Button
                            onClick={() => handleSaveEdit(note.id)}
                            variant="primary"
                            size="sm"
                            disabled={!editContent.trim() || isUpdating}
                            icon={isUpdating ? "hourglass_empty" : "check"}
                            className="text-xs sm:text-sm"
                          >
                            {isUpdating ? "Kaydediliyor..." : "Kaydet"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <span className="material-symbols-outlined text-text-sub dark:text-slate-400 text-lg sm:text-xl">
                            sticky_note_2
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-text-main dark:text-white whitespace-pre-wrap break-words">
                            {note.content}
                          </p>
                          <p className="text-[10px] sm:text-xs text-text-sub dark:text-slate-400 mt-2">
                            {formatDate(note.createdAt, "d MMMM yyyy, HH:mm")}
                            {note.updatedAt !== note.createdAt && (
                              <span className="ml-1 sm:ml-2 text-primary text-[10px] sm:text-xs">(Düzenlendi)</span>
                            )}
                          </p>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-0.5 sm:gap-1">
                          <button
                            onClick={() => handleEditNote(note)}
                            disabled={isDeleting === note.id}
                            className={cn(
                              "p-1.5 sm:p-2 rounded-lg transition-colors",
                              "text-text-sub dark:text-slate-400 hover:text-primary dark:hover:text-blue-400",
                              "hover:bg-primary/10 dark:hover:bg-primary/20",
                              isDeleting === note.id && "opacity-50 cursor-not-allowed"
                            )}
                            aria-label="Notu düzenle"
                          >
                            <span className="material-symbols-outlined text-base sm:text-sm">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            disabled={isDeleting === note.id}
                            className={cn(
                              "p-1.5 sm:p-2 rounded-lg transition-colors",
                              "text-text-sub dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400",
                              "hover:bg-red-50 dark:hover:bg-red-900/20",
                              isDeleting === note.id && "opacity-50 cursor-not-allowed"
                            )}
                            aria-label="Notu sil"
                          >
                            {isDeleting === note.id ? (
                              <span className="material-symbols-outlined text-base sm:text-sm animate-spin">
                                hourglass_empty
                              </span>
                            ) : (
                              <span className="material-symbols-outlined text-base sm:text-sm">
                                delete_outline
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>

          {/* Add Note Form */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <label className="block text-sm font-medium text-text-main dark:text-white mb-2">
              Yeni Not Ekle
            </label>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Bu konu hakkında notlarınızı buraya yazın..."
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-sm sm:text-base"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleAddNote();
                }
              }}
            />
            <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
              <p className="text-[10px] sm:text-xs text-text-sub dark:text-slate-400">
                {newNote.length} karakter
              </p>
              <Button
                onClick={handleAddNote}
                disabled={!newNote.trim() || isAdding}
                variant="primary"
                icon={isAdding ? "hourglass_empty" : "add"}
                size="sm"
                className="text-xs sm:text-sm"
              >
                {isAdding ? "Ekleniyor..." : "Not Ekle"}
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-6 w-full" />
      </div>
    </div>
  );
}
