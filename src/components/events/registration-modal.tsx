"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RegistrationModalProps {
    isOpen: boolean
    onClose: () => void
    eventUrl: string | null
}

export default function RegistrationModal({ isOpen, onClose, eventUrl }: RegistrationModalProps) {
    if (!eventUrl) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full max-w-4xl bg-background rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-secondary/20">
                            <h3 className="text-lg font-semibold">Event Registration</h3>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="hidden sm:flex text-neon border-neon/50 hover:bg-neon hover:text-black"
                                >
                                    <a
                                        href={eventUrl.replace("/embed", "")}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Open in New Tab
                                        <ExternalLink className="ml-2 h-3 w-3" />
                                    </a>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="hover:bg-white/10 rounded-full"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Iframe Content */}
                        <div className="flex-1 overflow-y-auto bg-background">
                            <iframe
                                src={eventUrl}
                                width="100%"
                                height="700"
                                style={{ border: "none" }}
                                loading="lazy"
                                title="Event Registration"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
