import React, { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { Mail, MessageCircle, Send, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mb-8"
        >
          <CheckCircle2 size={40} />
        </motion.div>
        <h1 className="text-3xl font-bold mb-4">Message Sent!</h1>
        <p className="text-gray-500 mb-8">
          Thank you for reaching out. We've received your message and will get back to you at the email address provided as soon as possible.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-900 transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Get in Touch</h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Have questions about our products or your order? We're here to help. Contact us via the form below or through our direct channels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1 space-y-8">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Direct Contact</h3>
            <div className="space-y-4">
              <a 
                href="https://wa.me/447871081869" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-black/5 hover:border-emerald-500/20 transition-all group"
              >
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">WhatsApp</p>
                  <p className="font-medium">+44 7871 081869</p>
                </div>
              </a>
              <a 
                href="mailto:crezzyocco@gmail.com" 
                className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-black/5 hover:border-blue-500/20 transition-all group"
              >
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Email</p>
                  <p className="font-medium">crezzyocco@gmail.com</p>
                </div>
              </a>
            </div>
          </div>

          <div className="p-6 bg-black text-white rounded-3xl">
            <h4 className="font-bold mb-2">Fast Support</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Our team typically responds to WhatsApp messages within 1-2 hours during business hours.
            </p>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white p-8 rounded-3xl border border-black/5">
            <h3 className="text-xl font-bold mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Name</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Subject</label>
                <input
                  required
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-black/5"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Message</label>
                <textarea
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry..."
                  className="w-full px-4 py-3 rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-black/5 min-h-[150px]"
                />
              </div>
              <button
                disabled={loading}
                type="submit"
                className="flex items-center justify-center gap-2 w-full bg-black text-white py-4 rounded-2xl font-semibold hover:bg-gray-900 transition-all disabled:opacity-50"
              >
                {loading ? "Sending..." : (
                  <>
                    Send Message
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
