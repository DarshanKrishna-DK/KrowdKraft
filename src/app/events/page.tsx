"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Navigation from "@/components/navigation"
import Footer from "@/components/sections/footer"
import { supabase } from "@/lib/supabase"
import { Event } from "@/types/supabase"
import { EventCard } from "@/components/events/event-card"
import ParallaxWrapper from "@/components/parallax-wrapper"
import { ChevronLeft, ChevronRight } from "lucide-react"

const EVENTS_PER_PAGE = 7

export default function EventsPage() {
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
    const [pastEvents, setPastEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
    const [upcomingPage, setUpcomingPage] = useState(1)
    const [pastPage, setPastPage] = useState(1)

    useEffect(() => {
        async function getEvents() {
            try {
                const { data: events, error } = await supabase
                    .from('events')
                    .select('*')
                    .order('registration_deadline', { ascending: true })

                if (error) {
                    console.error('Error fetching events:', error)
                    return
                }

                const eventList = (events as Event[]) || []
                const now = new Date()

                setUpcomingEvents(eventList.filter(event => new Date(event.registration_deadline || '') > now))
                setPastEvents(eventList.filter(event => new Date(event.registration_deadline || '') <= now))
            } catch (err) {
                console.error("Unexpected error fetching events:", err)
            } finally {
                setLoading(false)
            }
        }

        getEvents()
    }, [])

    const currentPage = activeTab === 'upcoming' ? upcomingPage : pastPage
    const setCurrentPage = activeTab === 'upcoming' ? setUpcomingPage : setPastPage
    const currentEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents

    const totalPages = Math.ceil(currentEvents.length / EVENTS_PER_PAGE)
    const paginatedEvents = useMemo(() => {
        const start = (currentPage - 1) * EVENTS_PER_PAGE
        return currentEvents.slice(start, start + EVENTS_PER_PAGE)
    }, [currentEvents, currentPage])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        // Scroll to the events section smoothly
        document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <main className="min-h-screen">
            <Navigation />

            <section className="pt-32 pb-4 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-4xl text-center">
                    <div className="animate-fade-in-up">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                            Experience <span className="neon-text">KrowdKraft</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 text-balance">
                            Join our vibrant community events, workshops, and gatherings.
                        </p>
                    </div>
                </div>
            </section>

            {loading ? (
                <div className="flex justify-center items-center py-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon"></div>
                </div>
            ) : (
                <>
                    <section id="events-section" className="py-12 min-h-[600px]">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                            {/* Toggle Switch */}
                            <div className="flex justify-center mb-16">
                                <div className="bg-secondary/30 p-1.5 rounded-full flex relative border border-white/5 backdrop-blur-sm">
                                    <button
                                        onClick={() => setActiveTab('upcoming')}
                                        className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 ${activeTab === 'upcoming'
                                            ? 'text-black'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        Upcoming
                                        {activeTab === 'upcoming' && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-neon rounded-full -z-10"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('past')}
                                        className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 ${activeTab === 'past'
                                            ? 'text-black'
                                            : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        Past
                                        {activeTab === 'past' && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-neon rounded-full -z-10"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <ParallaxWrapper speed={0.2}>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`${activeTab}-${currentPage}`}
                                        initial={{ opacity: 0, scale: 0.92, y: 40, filter: "blur(8px)" }}
                                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, scale: 0.92, y: -40, filter: "blur(8px)" }}
                                        transition={{ duration: 0.5, type: "spring", bounce: 0.3, damping: 15 }}
                                    >
                                        {paginatedEvents.length > 0 ? (
                                            <div className="flex flex-row gap-5 overflow-x-auto py-4 px-2 -mx-2" style={{ scrollbarWidth: 'none' }}>
                                                {paginatedEvents.map((event, index) => (
                                                    <div key={event.id} className="flex-shrink-0 w-[280px] sm:w-[300px]">
                                                        <EventCard event={event} index={index} />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <p className="text-xl text-muted-foreground">
                                                    {activeTab === 'upcoming'
                                                        ? 'No upcoming events at the moment. Stay tuned!'
                                                        : 'No past events found.'}
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-10">
                                        {/* Previous arrow */}
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-secondary/30 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:border-neon/50 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>

                                        {/* Page numbers */}
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${currentPage === page
                                                    ? 'bg-neon text-black shadow-[0_0_15px_rgba(0,255,170,0.4)]'
                                                    : 'border border-white/10 bg-secondary/30 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:border-neon/50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        {/* Next arrow */}
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-secondary/30 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:border-neon/50 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </ParallaxWrapper>
                        </div>
                    </section>
                </>
            )}

            <Footer />
        </main>
    )
}
