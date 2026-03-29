"use client"

import { motion } from "framer-motion"
import { Handshake, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { collaborators } from "@/data/collaborators"

export default function PastCollaborations() {
  const [showPartnerForm, setShowPartnerForm] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    organizationName: "",
    mobile: "",
    email: ""
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/partner-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: formData
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)

        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false)
          setShowPartnerForm(false)
          setFormData({
            organizationName: "",
            mobile: "",
            email: ""
          })
        }, 3000)
      } else {
        throw new Error('Failed to send email')
      }
    } catch (error) {
      console.error('Error submitting partnership form:', error)
      alert("There was an error submitting your partnership request. Please try again.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section className="py-24 bg-gradient-to-b from-secondary/10 via-secondary/20 to-secondary/10 relative overflow-hidden section">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
            Our{" "}
            <span className="neon-text">
              Collaborations
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're proud to have partnered with amazing organizations and brands
            that share our vision of community-driven innovation.
          </p>
        </motion.div>

        {/* Infinite Scrolling Marquees */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 max-w-7xl mx-auto"
        >
          {/* Marquee Keyframes */}
          <style>{`
            @keyframes marquee-scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes marquee-scroll-reverse {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
            .marquee-track {
              display: flex;
              width: max-content;
              animation: marquee-scroll 20s linear infinite;
            }
            .marquee-track-reverse {
              display: flex;
              width: max-content;
              animation: marquee-scroll-reverse 22s linear infinite;
            }
          `}</style>

          {/* Row 1: Companies & Organizations */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
              <h3 className="text-sm sm:text-base font-semibold tracking-widest uppercase text-purple-300/80">
                Companies and Clubs
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
            </div>

            <div className="relative overflow-hidden py-4">
              {/* Left fade */}
              <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
              {/* Right fade */}
              <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

              <div className="marquee-track">
                {[...collaborators.filter(p => p.type === 'organization' || p.type === 'community'),
                ...collaborators.filter(p => p.type === 'organization' || p.type === 'community'),
                ...collaborators.filter(p => p.type === 'organization' || p.type === 'community'),
                ...collaborators.filter(p => p.type === 'organization' || p.type === 'community')
                ].map((partner, index) => (
                  <div
                    key={`org-${partner.name}-${index}`}
                    className="flex-shrink-0 mx-3 sm:mx-5 group cursor-pointer"
                  >
                    <div className="bg-white rounded-xl sm:rounded-2xl px-6 sm:px-10 py-4 sm:py-6 flex items-center justify-center gap-3 sm:gap-4 shadow-lg shadow-purple-500/5 border border-white/20 group-hover:shadow-xl group-hover:shadow-purple-500/20 group-hover:scale-105 transition-all duration-300 min-w-[180px] sm:min-w-[220px] h-[70px] sm:h-[85px]">
                      {partner.logoImage ? (
                        <Image
                          src={partner.logoImage}
                          alt={`${partner.name} logo`}
                          width={40}
                          height={40}
                          className="object-contain flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.parentNode?.querySelector('.fallback-text') as HTMLElement | null;
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <span className={`text-sm sm:text-base font-bold text-gray-800 whitespace-nowrap ${partner.logoImage ? 'hidden fallback-text' : ''}`}>
                        {partner.logo}
                      </span>
                      <span className={`text-sm sm:text-base font-bold text-gray-800 whitespace-nowrap ${partner.logoImage ? '' : 'hidden'}`}>
                        {partner.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Universities & Institutions */}
          <div>
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
              <h3 className="text-sm sm:text-base font-semibold tracking-widest uppercase text-purple-300/80">
                Universities & Institutions
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
            </div>

            <div className="relative overflow-hidden py-4">
              {/* Left fade */}
              <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
              {/* Right fade */}
              <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

              <div className="marquee-track-reverse">
                {[...collaborators.filter(p => p.type === 'institution'),
                ...collaborators.filter(p => p.type === 'institution')
                ].map((partner, index) => (
                  <div
                    key={`inst-${partner.name}-${index}`}
                    className="flex-shrink-0 mx-3 sm:mx-5 group cursor-pointer"
                  >
                    <div className="bg-white rounded-xl sm:rounded-2xl px-6 sm:px-10 py-4 sm:py-6 flex items-center justify-center gap-3 sm:gap-4 shadow-lg shadow-purple-500/5 border border-white/20 group-hover:shadow-xl group-hover:shadow-purple-500/20 group-hover:scale-105 transition-all duration-300 min-w-[180px] sm:min-w-[220px] h-[70px] sm:h-[85px]">
                      {partner.logoImage ? (
                        <Image
                          src={partner.logoImage}
                          alt={`${partner.name} logo`}
                          width={40}
                          height={40}
                          className="object-contain flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.parentNode?.querySelector('.fallback-text') as HTMLElement | null;
                            if (fallback) fallback.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <span className={`text-sm sm:text-base font-bold text-gray-800 whitespace-nowrap ${partner.logoImage ? 'hidden fallback-text' : ''}`}>
                        {partner.logo}
                      </span>
                      <span className={`text-sm sm:text-base font-bold text-gray-800 whitespace-nowrap ${partner.logoImage ? '' : 'hidden'}`}>
                        {partner.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center"
        >
          <div className="glass-card p-3 sm:p-4 lg:p-6 max-w-4xl mx-auto relative overflow-hidden group">

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.08),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            {/* Animated Borders */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {/* Outer border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/30 group-hover:border-purple-400/60 transition-colors duration-500"></div>
              {/* Pulsing border */}
              <motion.div
                className="absolute inset-0 rounded-2xl border border-purple-500/40"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.01, 1]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Inner glow border */}
              <div className="absolute inset-[2px] rounded-2xl border border-purple-400/10"></div>
            </motion.div>

            {/* Corner Accent Elements */}
            <div className="absolute top-0 left-0 w-8 sm:w-12 lg:w-14 h-8 sm:h-12 lg:h-14 border-l-2 border-t-2 border-purple-500/30 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 right-0 w-8 sm:w-12 lg:w-14 h-8 sm:h-12 lg:h-14 border-r-2 border-b-2 border-purple-500/30 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              <motion.div
                className="inline-flex items-center justify-center mb-2 sm:mb-3 lg:mb-4"
                initial={{ scale: 0.7, opacity: 0, y: 20 }}
                whileInView={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 15 }}
                whileHover={{
                  scale: 1.08,
                  rotate: [0, -10, 10, -10, 0],
                  transition: { duration: 0.6 },
                }}
              >
                <div className="relative">
                  {/* Outer glow ring */}
                  <motion.div
                    className="absolute -inset-4 sm:-inset-6 lg:-inset-8 bg-purple-500/20 rounded-full blur-3xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* Middle glow */}
                  <div className="absolute -inset-2 sm:-inset-3 lg:-inset-4 bg-gradient-to-br from-purple-500/40 to-purple-600/20 rounded-full blur-2xl"></div>

                  <div className="relative p-1.5 sm:p-2 lg:p-3 bg-gradient-to-br from-purple-500/30 via-purple-500/20 to-purple-600/10 rounded-xl sm:rounded-2xl border border-purple-500/50 sm:border-2 shadow-lg sm:shadow-xl shadow-purple-500/20">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent rounded-xl sm:rounded-2xl"></div>
                    <Handshake className="h-5 w-5 sm:h-6 sm:w-6 lg:h-10 lg:w-10 text-neon relative z-10" />
                  </div>

                  {/* Orbiting particles */}
                  <motion.div
                    className="absolute top-0 right-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full hidden sm:block"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: '-20px 20px' }}
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-300 rounded-full hidden sm:block"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: '20px -20px' }}
                  />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h3
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4 bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent relative px-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
              >
                Want to Collaborate?

                <motion.div
                  className="absolute -bottom-1 sm:-bottom-2 left-1/2 -translate-x-1/2 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "40%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                />
              </motion.h3>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="my-4 sm:my-6 lg:my-8"
              >
                <p className="text-sm sm:text-sm lg:text-sm text-muted-foreground max-w-xl mx-auto leading-tight px-4 sm:px-0">
                  We're always looking for new partners. Reach out to explore collaboration opportunities.
                </p>
                <motion.div
                  className="hidden sm:flex flex-wrap items-center justify-center gap-2 sm:gap-2 mt-2 sm:mt-3 px-2"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 }}
                >
                  <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs font-medium text-purple-300 flex items-center gap-1 sm:gap-1.5">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></span>
                    <span className="whitespace-nowrap">Fast Response</span>
                  </div>
                  <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs font-medium text-purple-300 flex items-center gap-1 sm:gap-1.5">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></span>
                    <span className="whitespace-nowrap">Mutual Growth</span>
                  </div>
                  <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs font-medium text-purple-300 flex items-center gap-1 sm:gap-1.5">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></span>
                    <span className="whitespace-nowrap">Long-term Partnership</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-2 sm:px-0"
              >
                <button
                  onClick={() => setShowPartnerForm(true)}
                  className="group/btn relative px-3 py-1.5 sm:px-5 sm:py-2 lg:px-8 lg:py-2.5 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-500 hover:to-purple-600 text-white rounded-md sm:rounded-lg transition-all duration-400 font-semibold text-sm sm:text-sm lg:text-sm shadow-md sm:shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 overflow-hidden border border-purple-400/20 sm:border sm:border-purple-400/40 hover:border-purple-300/50 w-full sm:w-auto"
                >
                  {/* Animated layers */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/20 to-purple-400/0 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-800/30 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>

                  {/* Button Content */}
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <span className="tracking-wide">Partner With Us</span>
                  </span>

                  {/* Side glows */}
                  <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-full bg-purple-500/40 blur-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-full bg-purple-500/40 blur-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                </button>
              </motion.div>

              <motion.p
                className="text-xs text-purple-300/60 mt-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2 }}
              >
                Join {collaborators.length}+ organizations and communities already partnering with us
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Partnership Form Modal */}
      {mounted && showPartnerForm && createPortal(
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black/70 backdrop-blur-lg overflow-y-auto"
          style={{ zIndex: 99999 }}
          onClick={() => setShowPartnerForm(false)}
        >
          <div className="min-h-screen flex items-center justify-center p-4 py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-background/98 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 max-w-md w-full relative shadow-2xl shadow-purple-500/20"
              onClick={(e) => e.stopPropagation()}
              style={{ zIndex: 100000 }}
            >
              <button
                onClick={() => setShowPartnerForm(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-purple-500/20 hover:bg-purple-500/30 rounded-full flex items-center justify-center transition-all duration-300 border border-purple-500/40 hover:border-purple-400/60 group z-10"
              >
                <X className="h-5 w-5 text-purple-300 group-hover:text-white transition-colors" />
              </button>

              {!isSubmitted ? (
                <>
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center mb-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-purple-500/30 rounded-xl blur-xl"></div>
                        <div className="relative p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl border border-purple-500/40">
                          <Handshake className="h-12 w-12 text-neon" />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">Partner With Us</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Let's create something amazing together! Our team will get in touch with you soon.
                    </p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-purple-200">Community/Organization Name</label>
                      <Input
                        name="organizationName"
                        placeholder="Enter your organization name"
                        value={formData.organizationName}
                        onChange={handleChange}
                        required
                        className="bg-background/50 border-purple-500/30 focus:border-purple-400/60 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-purple-200">Mobile Number</label>
                      <Input
                        name="mobile"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                        className="bg-background/50 border-purple-500/30 focus:border-purple-400/60 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-purple-200">Email Address</label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-background/50 border-purple-500/30 focus:border-purple-400/60 transition-colors"
                      />
                    </div>

                    <Button type="submit" variant="neon" size="lg" className="w-full mt-6">
                      Show Interest
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <motion.div
                    className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500/40"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <Handshake className="h-10 w-10 text-green-400" />
                  </motion.div>
                  <motion.h3
                    className="text-3xl font-bold mb-3 text-green-400"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Thank You!
                  </motion.h3>
                  <motion.p
                    className="text-muted-foreground leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Thank you for showing interest in partnering with us. Our team will get in touch with you soon!
                  </motion.p>
                </div>
              )}
            </motion.div>
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}
