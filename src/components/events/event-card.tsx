"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Calendar, MapPin, XCircle } from "lucide-react"
import { Event } from "@/types/supabase"
import Image from "next/image"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"

interface EventCardProps {
    event: Event
    index: number
}

export function EventCard({ event, index }: EventCardProps) {
    const handleRegister = () => {
        if (event.luma_event_url) {
            window.open(event.luma_event_url, "_blank", "noopener,noreferrer")
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group relative h-full glass-card overflow-hidden hover:border-neon/50 transition-colors duration-300 flex flex-col"
        >
                {/* Image Container */}
                <div className="relative h-52 w-full overflow-hidden">
                    {event.banner_url ? (
                        <Image
                            src={event.banner_url}
                            alt={event.title || "Event Image"}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
                            <span className="text-muted-foreground">No Image</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium border border-white/10 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-neon" />
                        {event.registration_deadline ? new Date(event.registration_deadline).toLocaleDateString() : 'TBA'}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-neon transition-colors line-clamp-1">
                        {event.title}
                    </h3>

                    {event.location && (
                        <div className="flex items-center text-sm text-muted-foreground mb-4">
                            <MapPin className="w-4 h-4 mr-1 text-neon" />
                            <span className="truncate">{event.location}</span>
                        </div>
                    )}

                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
                        {event.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground">
                        <Button
                            onClick={handleRegister}
                            variant="outline"
                            className="border-neon/50 text-neon hover:bg-neon hover:text-black transition-colors px-6"
                        >
                            Register
                        </Button>

                        <span className={`px-2 py-0.5 rounded-full ${event.mode === 'online' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'
                            }`}>
                            {event.mode || 'TBD'}
                        </span>
                    </div>
        </div>
    </motion.div>
    )
}
