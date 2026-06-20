"use client";

import React, { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // If the app is already installed, hide the prompt
    window.addEventListener("appinstalled", () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-2xl shadow-2xl border border-pink-100 p-4 z-[9999] flex items-start space-x-4"
        >
          <div className="bg-pink-50 p-3 rounded-xl flex-shrink-0">
            <Download className="w-6 h-6 text-pink-600" />
          </div>
          <div className="flex-1 pt-1">
            <h4 className="text-sm font-bold text-slate-800">Install Mirayya ERP</h4>
            <p className="text-xs text-slate-500 mt-1 mb-3">
              Install aplikasi ini di perangkat Anda untuk akses lebih cepat dan pengalaman yang lebih baik.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleInstallClick}
                className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Install Sekarang
              </button>
              <button
                onClick={handleDismiss}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Nanti
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-600 absolute top-3 right-3"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
