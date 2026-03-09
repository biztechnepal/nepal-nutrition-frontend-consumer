"use client";

import React from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12">
          {/* Header Section */}
          <div className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full">
              <MessageSquare size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                Get in Touch
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-secondary tracking-tight">
              Let's build a{" "}
              <span className="text-primary italic underline decoration-primary/20 underline-offset-8">
                healthier
              </span>{" "}
              Nepal together.
            </h1>
            <p className="text-muted-foreground font-medium text-lg lg:text-xl">
              Have questions about the INIMS platform or nutritional data? Our
              team is here to help.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Contact Info Cards */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                <Card className="bg-white border-none shadow-xl shadow-black/5 rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-8 flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Mail size={28} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">
                        Email Support
                      </h4>
                      <p className="text-lg font-bold text-secondary">
                        info@inims.gov.np
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-none shadow-xl shadow-black/5 rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-8 flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-secondary/5 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                      <Phone size={28} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">
                        Phone Inquiry
                      </h4>
                      <p className="text-lg font-bold text-secondary">
                        +977 01 4262862
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-none shadow-xl shadow-black/5 rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="p-8 flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <MapPin size={28} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">
                        Headquarters
                      </h4>
                      <p className="text-lg font-bold text-secondary text-balance">
                        Department of Health Services, Teku, Kathmandu
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <Card className="bg-white border-none shadow-2xl shadow-black/5 rounded-[40px] overflow-hidden">
                <CardContent className="p-10 md:p-12">
                  <form
                    className="flex flex-col gap-6"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black uppercase tracking-widest ml-1">
                          Full Name
                        </label>
                        <input
                          placeholder="John Doe"
                          className="h-14 px-4 rounded-2xl border-muted-foreground/10 bg-muted/10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white transition-all font-bold outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-black uppercase tracking-widest ml-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="john@company.com"
                          className="h-14 px-4 rounded-2xl border-muted-foreground/10 bg-muted/10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white transition-all font-bold outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black uppercase tracking-widest ml-1">
                        Subject
                      </label>
                      <input
                        placeholder="How can we help?"
                        className="h-14 px-4 rounded-2xl border-muted-foreground/10 bg-muted/10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white transition-all font-bold outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black uppercase tracking-widest ml-1">
                        Message
                      </label>
                      <textarea
                        placeholder="Describe your inquiry in detail..."
                        className="min-h-[160px] p-4 rounded-2xl border-muted-foreground/10 bg-muted/10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white transition-all font-bold outline-none"
                      />
                    </div>
                    <Button className="h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/30 transition-all active:scale-95 flex items-center gap-3">
                      Send Message <Send size={18} />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
