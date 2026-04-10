import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import WaiverContent from "./WaiverContent";

interface WaiverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticketType: string;
  ticketLabel: string;
}

const C = {
  bg: "#0D4A47",
  bgAlt: "#111410",
  bgDark: "#091A18",
  gold: "#C9973A",
  goldLight: "#E8C97A",
  cream: "#F5EDD6",
  creamMuted: "#C8B99A",
  border: "rgba(201,151,58,0.25)",
};

const fonts = {
  heading: "'Josefin Sans', sans-serif",
  body: "'Lora', Georgia, serif",
};

const WaiverDialog = ({ open, onOpenChange, ticketType, ticketLabel }: WaiverDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setAgreed(false);
      setError("");
      setScrolledToBottom(false);
    }
  }, [open]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (el) {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
      if (nearBottom) setScrolledToBottom(true);
    }
  };

  const canSubmit = name.trim() && email.trim() && agreed && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError("");

    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const url = `https://${projectId}.supabase.co/functions/v1/create-checkout`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${anonKey}`,
          apikey: anonKey,
        },
        body: JSON.stringify({
          ticketType,
          attendeeName: name.trim(),
          attendeeEmail: email.trim(),
          attendeePhone: phone.trim(),
          attendeeAddress: address.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create checkout session");
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    fontFamily: fonts.body,
    fontSize: "14px",
    color: C.cream,
    background: "rgba(13,74,71,0.3)",
    border: `1px solid ${C.border}`,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: fonts.heading,
    fontSize: "11px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: C.creamMuted,
    marginBottom: "6px",
    display: "block",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 border-0 bg-transparent max-w-2xl"
        style={{
          background: C.bgAlt,
          border: `1px solid ${C.border}`,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Sticky header */}
        <DialogHeader
          style={{
            padding: "20px 24px",
            borderBottom: `1px solid ${C.border}`,
            background: C.bgAlt,
            flexShrink: 0,
          }}
        >
          <DialogTitle
            style={{
              fontFamily: fonts.heading,
              fontSize: "13px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: C.gold,
              textAlign: "center",
            }}
          >
            Liability Waiver Agreement — {ticketLabel}
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable waiver body */}
        <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            style={{
              padding: "24px",
              overflowY: "auto",
              maxHeight: "40vh",
            }}
          >
            <WaiverContent />
          </div>
          {/* Bottom fade */}
          {!scrolledToBottom && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "60px",
                background: `linear-gradient(transparent, ${C.bgAlt})`,
                pointerEvents: "none",
              }}
            />
          )}
        </div>

        {/* Form section */}
        <div
          style={{
            padding: "20px 24px",
            borderTop: `1px solid ${C.border}`,
            background: C.bgAlt,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input
                style={inputStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input
                style={inputStyle}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input
                style={inputStyle}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div>
              <label style={labelStyle}>Address</label>
              <input
                style={inputStyle}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Agreement checkbox */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ marginTop: "3px", accentColor: C.gold }}
            />
            <span
              style={{
                fontFamily: fonts.body,
                fontSize: "13px",
                color: C.creamMuted,
                lineHeight: 1.5,
              }}
            >
              I have read this Agreement in full, understand its contents, and voluntarily agree to its terms. I understand that I am waiving certain legal rights, including the right to bring legal claims.
            </span>
          </div>

          {error && (
            <p style={{ color: "#EF4444", fontSize: "13px", fontFamily: fonts.body, marginBottom: "12px" }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              width: "100%",
              fontFamily: fonts.heading,
              fontSize: "12px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: canSubmit ? C.bgAlt : C.creamMuted,
              background: canSubmit
                ? `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`
                : "rgba(201,151,58,0.15)",
              padding: "14px 36px",
              border: "none",
              cursor: canSubmit ? "pointer" : "not-allowed",
              transition: "all 0.3s ease",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Redirecting to payment..." : "Proceed to Payment"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WaiverDialog;
