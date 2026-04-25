import { useState, useEffect, useRef } from “react”;

const COLORS = {
bg: “#0a0e1a”,
card: “#111827”,
cardBorder: “#1f2937”,
accent: “#14F195”,
accentDim: “#0d9e63”,
sol: “#9945FF”,
solDim: “#6b2fb3”,
warn: “#F59E0B”,
danger: “#EF4444”,
text: “#F9FAFB”,
muted: “#6B7280”,
sub: “#9CA3AF”,
};

const TOKENS = [
{ symbol: “SOL”, name: “Solana”, price: 148.32, change: 3.21, icon: “◎” },
{ symbol: “BTC”, name: “Bitcoin”, price: 64821.5, change: -1.12, icon: “₿” },
{ symbol: “ETH”, name: “Ethereum”, price: 3124.8, change: 1.87, icon: “Ξ” },
{ symbol: “JUP”, name: “Jupiter”, price: 0.842, change: 5.43, icon: “♃” },
{ symbol: “BONK”, name: “Bonk”, price: 0.0000218, change: 8.91, icon: “🐶” },
{ symbol: “WIF”, name: “dogwifhat”, price: 2.341, change: -2.34, icon: “🎩” },
{ symbol: “PYTH”, name: “Pyth Network”, price: 0.412, change: 4.11, icon: “🔮” },
{ symbol: “RAY”, name: “Raydium”, price: 1.87, change: -0.88, icon: “⚡” },
];

const STRATEGIES = [
{
id: “dca”,
name: “DCA Bot”,
desc: “Dollar-cost averaging at set intervals”,
icon: “📅”,
risk: “Low”,
color: “#14F195”,
},
{
id: “grid”,
name: “Grid Trading”,
desc: “Buy low / sell high within a price range”,
icon: “📊”,
risk: “Medium”,
color: “#9945FF”,
},
{
id: “momentum”,
name: “Momentum”,
desc: “Ride breakouts with RSI & MACD signals”,
icon: “🚀”,
risk: “High”,
color: “#F59E0B”,
},
{
id: “arb”,
name: “Arbitrage”,
desc: “Exploit price gaps across DEXs”,
icon: “⚡”,
risk: “Medium”,
color: “#60A5FA”,
},
{
id: “sniper”,
name: “Sniper Bot”,
desc: “Auto-buy new token listings instantly”,
icon: “🎯”,
risk: “Very High”,
color: “#EF4444”,
},
{
id: “custom”,
name: “Custom Strategy”,
desc: “Build your own logic with visual editor”,
icon: “⚙️”,
risk: “Custom”,
color: “#14F195”,
},
];

function Sparkline({ data, color }) {
const w = 80, h = 32;
const min = Math.min(…data), max = Math.max(…data);
const pts = data.map((v, i) => {
const x = (i / (data.length - 1)) * w;
const y = h - ((v - min) / (max - min || 1)) * h;
return `${x},${y}`;
}).join(” “);
return (
<svg width={w} height={h}>
<polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
</svg>
);
}

function PriceRow({ t, idx }) {
const [price, setPrice] = useState(t.price);
const [history, setHistory] = useState(() => Array.from({ length: 12 }, () => t.price * (0.97 + Math.random() * 0.06)));
const [flash, setFlash] = useState(null);

useEffect(() => {
const id = setInterval(() => {
const delta = (Math.random() - 0.49) * t.price * 0.003;
setPrice(p => {
const np = p + delta;
setHistory(h => […h.slice(-11), np]);
setFlash(delta > 0 ? “up” : “down”);
setTimeout(() => setFlash(null), 400);
return np;
});
}, 1800 + idx * 300);
return () => clearInterval(id);
}, []);

const fmt = (p) => p < 0.001 ? p.toFixed(8) : p < 1 ? p.toFixed(4) : p < 100 ? p.toFixed(3) : p.toFixed(2);
const color = t.change >= 0 ? COLORS.accent : COLORS.danger;

return (
<div style={{
display: “flex”, alignItems: “center”, padding: “12px 16px”,
borderBottom: `1px solid ${COLORS.cardBorder}`,
background: flash === “up” ? “rgba(20,241,149,0.04)” : flash === “down” ? “rgba(239,68,68,0.04)” : “transparent”,
transition: “background 0.3s”,
}}>
<div style={{ width: 36, height: 36, borderRadius: “50%”, background: `${COLORS.sol}22`, display: “flex”, alignItems: “center”, justifyContent: “center”, fontSize: 16, marginRight: 12 }}>{t.icon}</div>
<div style={{ flex: 1 }}>
<div style={{ fontWeight: 700, color: COLORS.text, fontSize: 14 }}>{t.symbol}</div>
<div style={{ color: COLORS.muted, fontSize: 11 }}>{t.name}</div>
</div>
<Sparkline data={history} color={color} />
<div style={{ textAlign: “right”, marginLeft: 12 }}>
<div style={{ fontWeight: 700, color: flash ? (flash === “up” ? COLORS.accent : COLORS.danger) : COLORS.text, fontSize: 14, fontFamily: “monospace”, transition: “color 0.3s” }}>${fmt(price)}</div>
<div style={{ color, fontSize: 11, fontWeight: 600 }}>{t.change >= 0 ? “▲” : “▼”} {Math.abs(t.change).toFixed(2)}%</div>
</div>
</div>
);
}

function SecurityBadge({ label, icon }) {
return (
<div style={{ display: “flex”, alignItems: “center”, gap: 8, padding: “8px 12px”, background: `${COLORS.accent}11`, border: `1px solid ${COLORS.accent}33`, borderRadius: 8, marginBottom: 8 }}>
<span style={{ fontSize: 16 }}>{icon}</span>
<span style={{ color: COLORS.sub, fontSize: 12 }}>{label}</span>
</div>
);
}

function Modal({ title, children, onClose }) {
return (
<div style={{ position: “fixed”, inset: 0, background: “rgba(0,0,0,0.75)”, zIndex: 100, display: “flex”, alignItems: “center”, justifyContent: “center”, padding: 16 }}>
<div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 20, padding: 24, width: “100%”, maxWidth: 480, maxHeight: “90vh”, overflowY: “auto” }}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 20 }}>
<span style={{ fontWeight: 800, fontSize: 18, color: COLORS.text }}>{title}</span>
<button onClick={onClose} style={{ background: COLORS.cardBorder, border: “none”, color: COLORS.text, borderRadius: 8, width: 32, height: 32, cursor: “pointer”, fontSize: 16 }}>✕</button>
</div>
{children}
</div>
</div>
);
}

function Input({ label, …props }) {
return (
<div style={{ marginBottom: 14 }}>
{label && <div style={{ color: COLORS.sub, fontSize: 12, marginBottom: 6, fontWeight: 600 }}>{label}</div>}
<input {…props} style={{ width: “100%”, background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`, color: COLORS.text, borderRadius: 10, padding: “11px 14px”, fontSize: 14, outline: “none”, boxSizing: “border-box”, …props.style }} />
</div>
);
}

function Btn({ children, onClick, variant = “primary”, style = {}, small }) {
const base = {
border: “none”, borderRadius: 12, cursor: “pointer”, fontWeight: 700,
padding: small ? “8px 16px” : “13px 20px”, fontSize: small ? 12 : 14,
transition: “opacity 0.2s, transform 0.1s”,
…style,
};
const variants = {
primary: { background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDim})`, color: “#0a0e1a” },
sol: { background: `linear-gradient(135deg, ${COLORS.sol}, ${COLORS.solDim})`, color: “#fff” },
ghost: { background: COLORS.cardBorder, color: COLORS.text },
danger: { background: COLORS.danger, color: “#fff” },
};
return <button style={{ …base, …variants[variant] }} onClick={onClick}>{children}</button>;
}

function Card({ children, style = {} }) {
return <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 16, padding: 16, …style }}>{children}</div>;
}

// ── AUTH SCREEN ──────────────────────────────────────────────
function AuthScreen({ onAuth }) {
const [mode, setMode] = useState(“login”); // login | register | wallet
const [walletMode, setWalletMode] = useState(“create”); // create | import
const [form, setForm] = useState({ email: “”, password: “”, confirm: “”, mnemonic: “” });
const [step, setStep] = useState(1);
const [generated, setGenerated] = useState(null);
const [show2FA, setShow2FA] = useState(false);

const FAKE_MNEMONIC = “sunrise token orbit bright cactus valley flame storm echo pulse dawn sky”;
const FAKE_ADDR = “7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU”;

const handleCreate = () => {
setGenerated({ mnemonic: FAKE_MNEMONIC, address: FAKE_ADDR });
setStep(2);
};

const field = (k) => ({ value: form[k], onChange: e => setForm(f => ({ …f, [k]: e.target.value })) });

if (mode === “wallet”) {
return (
<div style={{ minHeight: “100vh”, background: COLORS.bg, display: “flex”, flexDirection: “column”, alignItems: “center”, justifyContent: “center”, padding: 20 }}>
<div style={{ width: “100%”, maxWidth: 420 }}>
<div style={{ textAlign: “center”, marginBottom: 28 }}>
<div style={{ fontSize: 40, marginBottom: 8 }}>◎</div>
<div style={{ fontWeight: 900, fontSize: 24, color: COLORS.text }}>Solana Wallet</div>
<div style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>Create or import your Solana wallet</div>
</div>
<Card>
<div style={{ display: “flex”, gap: 8, marginBottom: 20 }}>
{[“create”, “import”].map(m => (
<Btn key={m} variant={walletMode === m ? “primary” : “ghost”} onClick={() => { setWalletMode(m); setStep(1); setGenerated(null); }} style={{ flex: 1 }}>
{m === “create” ? “🆕 Create New” : “📥 Import”}
</Btn>
))}
</div>

```
        {walletMode === "create" && step === 1 && (
          <>
            <div style={{ background: `${COLORS.accent}11`, border: `1px solid ${COLORS.accent}33`, borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <div style={{ color: COLORS.accent, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>🔐 How Your Wallet is Secured</div>
              <div style={{ color: COLORS.sub, fontSize: 12, lineHeight: 1.6 }}>
                Your wallet keys are generated <b style={{ color: COLORS.text }}>locally in your browser</b>. We never see your private key or seed phrase. Your assets are protected by military-grade AES-256 encryption.
              </div>
            </div>
            <Btn onClick={handleCreate} style={{ width: "100%" }}>Generate New Wallet ✨</Btn>
          </>
        )}

        {walletMode === "create" && step === 2 && generated && (
          <>
            <div style={{ background: "#1a0a0a", border: `1px solid ${COLORS.danger}44`, borderRadius: 12, padding: 14, marginBottom: 14 }}>
              <div style={{ color: COLORS.danger, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>⚠️ SAVE THIS SEED PHRASE — NEVER SHARE IT</div>
              <div style={{ fontFamily: "monospace", fontSize: 13, color: COLORS.warn, lineHeight: 1.8 }}>
                {generated.mnemonic.split(" ").map((w, i) => (
                  <span key={i} style={{ marginRight: 6 }}><span style={{ color: COLORS.muted, fontSize: 10 }}>{i + 1}. </span>{w}</span>
                ))}
              </div>
            </div>
            <div style={{ background: COLORS.bg, borderRadius: 10, padding: 10, marginBottom: 14 }}>
              <div style={{ color: COLORS.muted, fontSize: 11, marginBottom: 4 }}>Wallet Address</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: COLORS.sub, wordBreak: "break-all" }}>{generated.address}</div>
            </div>
            <Btn onClick={() => { setShow2FA(true); }} style={{ width: "100%" }}>I Saved It — Continue →</Btn>
          </>
        )}

        {walletMode === "import" && (
          <>
            <div style={{ color: COLORS.sub, fontSize: 12, marginBottom: 12 }}>Enter your 12 or 24-word seed phrase to restore your wallet.</div>
            <Input label="Seed Phrase" {...field("mnemonic")} placeholder="word1 word2 word3 ..." style={{ fontFamily: "monospace" }} />
            <Btn onClick={() => setShow2FA(true)} style={{ width: "100%" }}>Import Wallet 📥</Btn>
          </>
        )}

        {show2FA && (
          <div style={{ marginTop: 20 }}>
            <div style={{ color: COLORS.accent, fontWeight: 700, fontSize: 14, marginBottom: 10 }}>🔑 Set Up 2-Factor Authentication</div>
            <Input label="Create PIN (6 digits)" placeholder="••••••" type="password" maxLength={6} />
            <Input label="Confirm PIN" placeholder="••••••" type="password" maxLength={6} />
            <Btn onClick={() => onAuth({ wallet: FAKE_ADDR })} style={{ width: "100%", marginTop: 6 }}>Activate Wallet & Enter Platform 🚀</Btn>
          </div>
        )}
      </Card>

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <span style={{ color: COLORS.muted, fontSize: 13 }}>Have an account? </span>
        <span style={{ color: COLORS.accent, cursor: "pointer", fontSize: 13, fontWeight: 700 }} onClick={() => setMode("login")}>Sign In</span>
      </div>
    </div>
  </div>
);
```

}

return (
<div style={{ minHeight: “100vh”, background: COLORS.bg, display: “flex”, flexDirection: “column”, alignItems: “center”, justifyContent: “center”, padding: 20 }}>
<div style={{ width: “100%”, maxWidth: 420 }}>
<div style={{ textAlign: “center”, marginBottom: 28 }}>
<div style={{ fontSize: 48, marginBottom: 8 }}>◎</div>
<div style={{ fontWeight: 900, fontSize: 28, background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.sol})`, WebkitBackgroundClip: “text”, WebkitTextFillColor: “transparent” }}>SolTrader AI</div>
<div style={{ color: COLORS.muted, fontSize: 13, marginTop: 6 }}>Automated Crypto Trading on Solana</div>
</div>

```
    <Card>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["login", "register"].map(m => (
          <Btn key={m} variant={mode === m ? "primary" : "ghost"} onClick={() => setMode(m)} style={{ flex: 1 }}>
            {m === "login" ? "Sign In" : "Register"}
          </Btn>
        ))}
      </div>

      <Input label="Email Address" {...field("email")} placeholder="you@example.com" type="email" />
      <Input label="Password" {...field("password")} placeholder="••••••••" type="password" />
      {mode === "register" && <Input label="Confirm Password" {...field("confirm")} placeholder="••••••••" type="password" />}

      {mode === "login" && (
        <div style={{ color: COLORS.accent, fontSize: 12, textAlign: "right", marginBottom: 14, cursor: "pointer" }}>Forgot password?</div>
      )}

      <Btn onClick={() => onAuth({ email: form.email })} style={{ width: "100%", marginBottom: 12 }}>
        {mode === "login" ? "🔑 Sign In" : "🚀 Create Account"}
      </Btn>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 1, height: 1, background: COLORS.cardBorder }} />
        <span style={{ color: COLORS.muted, fontSize: 11 }}>OR</span>
        <div style={{ flex: 1, height: 1, background: COLORS.cardBorder }} />
      </div>

      <Btn variant="sol" onClick={() => setMode("wallet")} style={{ width: "100%" }}>◎ Connect / Create Wallet</Btn>
    </Card>

    <Card style={{ marginTop: 16 }}>
      <div style={{ color: COLORS.accent, fontWeight: 700, fontSize: 13, marginBottom: 10 }}>🛡️ Your Data is Safe</div>
      <SecurityBadge label="Passwords encrypted with bcrypt (cost factor 14)" icon="🔐" />
      <SecurityBadge label="Private keys never leave your device" icon="🔑" />
      <SecurityBadge label="AES-256 wallet encryption at rest" icon="🧊" />
      <SecurityBadge label="2FA via PIN or Authenticator App" icon="📱" />
      <SecurityBadge label="TLS 1.3 for all data in transit" icon="🌐" />
    </Card>
  </div>
</div>
```

);
}

// ── MAIN DASHBOARD ──────────────────────────────────────────
function Dashboard({ user, onLogout }) {
const [tab, setTab] = useState(“home”);
const [botModal, setBotModal] = useState(null);
const [bots, setBots] = useState([
{ id: 1, strategy: “dca”, token: “SOL”, amount: 50, interval: “1h”, status: “running”, profit: 12.4 },
{ id: 2, strategy: “grid”, token: “BTC”, amount: 200, interval: “4h”, status: “paused”, profit: -2.1 },
]);
const [showSecurity, setShowSecurity] = useState(false);
const [portfolioValue] = useState(3842.5);
const [profitToday] = useState(+84.2);

const TABS = [
{ id: “home”, icon: “🏠”, label: “Home” },
{ id: “prices”, icon: “📈”, label: “Prices” },
{ id: “bots”, icon: “🤖”, label: “Bots” },
{ id: “wallet”, icon: “◎”, label: “Wallet” },
{ id: “security”, icon: “🛡️”, label: “Security” },
];

const toggleBot = (id) => setBots(b => b.map(x => x.id === id ? { …x, status: x.status === “running” ? “paused” : “running” } : x));
const deleteBot = (id) => setBots(b => b.filter(x => x.id !== id));

return (
<div style={{ minHeight: “100vh”, background: COLORS.bg, display: “flex”, flexDirection: “column”, maxWidth: 768, margin: “0 auto” }}>
{/* Header */}
<div style={{ padding: “16px 20px 12px”, display: “flex”, alignItems: “center”, justifyContent: “space-between”, borderBottom: `1px solid ${COLORS.cardBorder}`, position: “sticky”, top: 0, background: COLORS.bg, zIndex: 50 }}>
<div>
<div style={{ fontWeight: 900, fontSize: 20, background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.sol})`, WebkitBackgroundClip: “text”, WebkitTextFillColor: “transparent” }}>SolTrader AI</div>
<div style={{ color: COLORS.muted, fontSize: 11 }}>Solana Network · Mainnet</div>
</div>
<div style={{ display: “flex”, alignItems: “center”, gap: 10 }}>
<div style={{ width: 8, height: 8, borderRadius: “50%”, background: COLORS.accent, boxShadow: `0 0 8px ${COLORS.accent}` }} />
<span style={{ color: COLORS.sub, fontSize: 12 }}>Live</span>
<div style={{ background: COLORS.cardBorder, borderRadius: 10, padding: “6px 12px”, color: COLORS.text, fontSize: 12, fontWeight: 600, cursor: “pointer” }} onClick={onLogout}>Sign Out</div>
</div>
</div>

```
  {/* Content */}
  <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
    {tab === "home" && <HomeTab bots={bots} portfolioValue={portfolioValue} profitToday={profitToday} onNewBot={() => setTab("bots")} />}
    {tab === "prices" && <PricesTab />}
    {tab === "bots" && <BotsTab bots={bots} setBots={setBots} onNew={() => setBotModal(true)} onToggle={toggleBot} onDelete={deleteBot} />}
    {tab === "wallet" && <WalletTab user={user} />}
    {tab === "security" && <SecurityTab />}
  </div>

  {/* Bottom Nav */}
  <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 768, background: COLORS.card, borderTop: `1px solid ${COLORS.cardBorder}`, display: "flex", padding: "8px 0" }}>
    {TABS.map(t => (
      <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
        <span style={{ fontSize: 20 }}>{t.icon}</span>
        <span style={{ fontSize: 9, color: tab === t.id ? COLORS.accent : COLORS.muted, fontWeight: tab === t.id ? 700 : 400 }}>{t.label}</span>
      </button>
    ))}
  </div>

  {botModal && <BotCreatorModal onClose={() => setBotModal(null)} onAdd={bot => { setBots(b => [...b, { ...bot, id: Date.now(), profit: 0, status: "running" }]); setBotModal(null); }} />}
</div>
```

);
}

function HomeTab({ bots, portfolioValue, profitToday, onNewBot }) {
const runningBots = bots.filter(b => b.status === “running”).length;
const [sol] = useState(148.32);

return (
<div style={{ padding: 20 }}>
{/* Portfolio Card */}
<div style={{ background: `linear-gradient(135deg, ${COLORS.sol}33, ${COLORS.accent}22)`, border: `1px solid ${COLORS.sol}44`, borderRadius: 20, padding: 24, marginBottom: 16, textAlign: “center” }}>
<div style={{ color: COLORS.sub, fontSize: 12, marginBottom: 4 }}>Total Portfolio Value</div>
<div style={{ fontWeight: 900, fontSize: 36, color: COLORS.text }}>${portfolioValue.toLocaleString(“en-US”, { minimumFractionDigits: 2 })}</div>
<div style={{ color: COLORS.accent, fontSize: 14, fontWeight: 700, marginTop: 4 }}>▲ +${profitToday} today (+2.24%)</div>
<div style={{ display: “flex”, gap: 12, marginTop: 16, justifyContent: “center” }}>
<Btn variant="primary" small>Deposit</Btn>
<Btn variant="ghost" small>Withdraw</Btn>
<Btn variant="sol" small onClick={onNewBot}>+ New Bot</Btn>
</div>
</div>

```
  {/* Stats Row */}
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
    {[
      { label: "Active Bots", value: runningBots, icon: "🤖", color: COLORS.accent },
      { label: "SOL Price", value: `$${sol}`, icon: "◎", color: COLORS.sol },
      { label: "Win Rate", value: "68%", icon: "🎯", color: COLORS.warn },
    ].map(s => (
      <Card key={s.label} style={{ textAlign: "center", padding: 14 }}>
        <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
        <div style={{ fontWeight: 800, color: s.color, fontSize: 18 }}>{s.value}</div>
        <div style={{ color: COLORS.muted, fontSize: 10 }}>{s.label}</div>
      </Card>
    ))}
  </div>

  {/* Active Bots */}
  <div style={{ marginBottom: 16 }}>
    <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>🤖 Active Bots</div>
    {bots.filter(b => b.status === "running").length === 0 ? (
      <Card style={{ textAlign: "center", padding: 24 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🤖</div>
        <div style={{ color: COLORS.muted, fontSize: 13 }}>No active bots</div>
        <Btn onClick={onNewBot} style={{ marginTop: 12 }}>Create Your First Bot</Btn>
      </Card>
    ) : (
      bots.filter(b => b.status === "running").map(bot => <BotCard key={bot.id} bot={bot} compact />)
    )}
  </div>

  {/* Quick Market */}
  <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>📊 Top Movers</div>
  <Card style={{ padding: 0, overflow: "hidden" }}>
    {TOKENS.slice(0, 4).map((t, i) => <PriceRow key={t.symbol} t={t} idx={i} />)}
  </Card>
</div>
```

);
}

function PricesTab() {
return (
<div style={{ padding: 20 }}>
<div style={{ color: COLORS.text, fontWeight: 700, fontSize: 18, marginBottom: 4 }}>📈 Live Price Feed</div>
<div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 16 }}>Real-time prices · Updates every 2s</div>
<div style={{ display: “flex”, alignItems: “center”, gap: 8, marginBottom: 16 }}>
<div style={{ width: 8, height: 8, borderRadius: “50%”, background: COLORS.accent, animation: “pulse 1s infinite” }} />
<span style={{ color: COLORS.accent, fontSize: 12, fontWeight: 600 }}>LIVE — Solana Network + Cross-chain</span>
</div>
<Card style={{ padding: 0, overflow: “hidden” }}>
{TOKENS.map((t, i) => <PriceRow key={t.symbol} t={t} idx={i} />)}
</Card>
<div style={{ marginTop: 16, color: COLORS.muted, fontSize: 11, textAlign: “center” }}>
Data powered by Pyth Network oracles on Solana · Jupiter aggregator pricing
</div>
</div>
);
}

function BotCard({ bot, compact, onToggle, onDelete, onEdit }) {
const strat = STRATEGIES.find(s => s.id === bot.strategy) || STRATEGIES[0];
return (
<Card style={{ marginBottom: 10, padding: 14 }}>
<div style={{ display: “flex”, alignItems: “center”, gap: 10, marginBottom: compact ? 0 : 10 }}>
<div style={{ width: 36, height: 36, borderRadius: 10, background: `${strat.color}22`, display: “flex”, alignItems: “center”, justifyContent: “center”, fontSize: 18 }}>{strat.icon}</div>
<div style={{ flex: 1 }}>
<div style={{ fontWeight: 700, color: COLORS.text, fontSize: 14 }}>{strat.name} — {bot.token}</div>
<div style={{ color: COLORS.muted, fontSize: 11 }}>${bot.amount} · Every {bot.interval}</div>
</div>
<div style={{ textAlign: “right” }}>
<div style={{ fontWeight: 700, fontSize: 14, color: bot.profit >= 0 ? COLORS.accent : COLORS.danger }}>{bot.profit >= 0 ? “+” : “”}{bot.profit}%</div>
<div style={{ display: “flex”, alignItems: “center”, gap: 4 }}>
<div style={{ width: 6, height: 6, borderRadius: “50%”, background: bot.status === “running” ? COLORS.accent : COLORS.muted }} />
<span style={{ color: COLORS.muted, fontSize: 10 }}>{bot.status}</span>
</div>
</div>
</div>
{!compact && (
<div style={{ display: “flex”, gap: 8, marginTop: 10 }}>
<Btn small variant={bot.status === “running” ? “ghost” : “primary”} onClick={() => onToggle && onToggle(bot.id)} style={{ flex: 1 }}>
{bot.status === “running” ? “⏸ Pause” : “▶ Resume”}
</Btn>
<Btn small variant=“ghost” onClick={() => onEdit && onEdit(bot)} style={{ flex: 1 }}>⚙️ Edit</Btn>
<Btn small variant=“danger” onClick={() => onDelete && onDelete(bot.id)}>🗑</Btn>
</div>
)}
</Card>
);
}

function BotsTab({ bots, setBots, onNew, onToggle, onDelete }) {
const [editBot, setEditBot] = useState(null);
return (
<div style={{ padding: 20 }}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 16 }}>
<div>
<div style={{ color: COLORS.text, fontWeight: 700, fontSize: 18 }}>🤖 Trading Bots</div>
<div style={{ color: COLORS.muted, fontSize: 12 }}>{bots.length} bots · {bots.filter(b => b.status === “running”).length} running</div>
</div>
<Btn onClick={onNew} small>+ Create Bot</Btn>
</div>

```
  {/* Strategies */}
  <div style={{ color: COLORS.sub, fontSize: 12, fontWeight: 600, marginBottom: 10 }}>AVAILABLE STRATEGIES</div>
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
    {STRATEGIES.map(s => (
      <div key={s.id} onClick={onNew} style={{ background: COLORS.card, border: `1px solid ${s.color}44`, borderRadius: 14, padding: 14, cursor: "pointer" }}>
        <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
        <div style={{ fontWeight: 700, color: COLORS.text, fontSize: 13 }}>{s.name}</div>
        <div style={{ color: COLORS.muted, fontSize: 11, marginBottom: 6 }}>{s.desc}</div>
        <div style={{ background: `${s.color}22`, borderRadius: 6, padding: "2px 8px", display: "inline-block", color: s.color, fontSize: 10, fontWeight: 700 }}>Risk: {s.risk}</div>
      </div>
    ))}
  </div>

  {/* My Bots */}
  <div style={{ color: COLORS.sub, fontSize: 12, fontWeight: 600, marginBottom: 10 }}>MY BOTS</div>
  {bots.length === 0 ? (
    <Card style={{ textAlign: "center", padding: 32 }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>🤖</div>
      <div style={{ color: COLORS.muted }}>No bots yet. Create your first one!</div>
    </Card>
  ) : (
    bots.map(bot => <BotCard key={bot.id} bot={bot} onToggle={onToggle} onDelete={onDelete} onEdit={setEditBot} />)
  )}

  {editBot && <BotCreatorModal existing={editBot} onClose={() => setEditBot(null)} onAdd={updated => { setBots(b => b.map(x => x.id === updated.id ? updated : x)); setEditBot(null); }} />}
</div>
```

);
}

function BotCreatorModal({ onClose, onAdd, existing }) {
const [step, setStep] = useState(1);
const [strategy, setStrategy] = useState(existing?.strategy || “”);
const [form, setForm] = useState({
token: existing?.token || “SOL”,
amount: existing?.amount || 50,
interval: existing?.interval || “1h”,
stopLoss: existing?.stopLoss || 5,
takeProfit: existing?.takeProfit || 10,
maxTrades: existing?.maxTrades || 10,
gridLow: existing?.gridLow || 120,
gridHigh: existing?.gridHigh || 180,
gridLines: existing?.gridLines || 10,
});
const field = (k) => ({ value: form[k], onChange: e => setForm(f => ({ …f, [k]: e.target.value })) });
const strat = STRATEGIES.find(s => s.id === strategy);

const handleSave = () => {
onAdd({ …form, strategy, id: existing?.id });
};

return (
<Modal title={existing ? “Edit Bot” : “Create Trading Bot”} onClose={onClose}>
{step === 1 && (
<>
<div style={{ color: COLORS.sub, fontSize: 12, marginBottom: 12, fontWeight: 600 }}>SELECT STRATEGY</div>
{STRATEGIES.map(s => (
<div key={s.id} onClick={() => setStrategy(s.id)} style={{ display: “flex”, alignItems: “center”, gap: 12, padding: 14, borderRadius: 12, border: `2px solid ${strategy === s.id ? s.color : COLORS.cardBorder}`, marginBottom: 8, cursor: “pointer”, background: strategy === s.id ? `${s.color}11` : “transparent” }}>
<span style={{ fontSize: 24 }}>{s.icon}</span>
<div style={{ flex: 1 }}>
<div style={{ fontWeight: 700, color: COLORS.text, fontSize: 14 }}>{s.name}</div>
<div style={{ color: COLORS.muted, fontSize: 12 }}>{s.desc}</div>
</div>
<div style={{ color: s.color, fontSize: 11, fontWeight: 700 }}>{s.risk}</div>
</div>
))}
<Btn onClick={() => strategy && setStep(2)} style={{ width: “100%”, marginTop: 8, opacity: strategy ? 1 : 0.5 }}>Next: Configure →</Btn>
</>
)}

```
  {step === 2 && strat && (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: 12, background: `${strat.color}11`, borderRadius: 12 }}>
        <span style={{ fontSize: 24 }}>{strat.icon}</span>
        <div>
          <div style={{ fontWeight: 700, color: COLORS.text }}>{strat.name}</div>
          <div style={{ color: COLORS.muted, fontSize: 12 }}>{strat.desc}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div>
          <div style={{ color: COLORS.sub, fontSize: 12, marginBottom: 6 }}>Token</div>
          <select value={form.token} onChange={e => setForm(f => ({ ...f, token: e.target.value }))} style={{ width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`, color: COLORS.text, borderRadius: 10, padding: "10px", fontSize: 14 }}>
            {TOKENS.map(t => <option key={t.symbol} value={t.symbol}>{t.symbol}</option>)}
          </select>
        </div>
        <div>
          <div style={{ color: COLORS.sub, fontSize: 12, marginBottom: 6 }}>Interval</div>
          <select value={form.interval} onChange={e => setForm(f => ({ ...f, interval: e.target.value }))} style={{ width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`, color: COLORS.text, borderRadius: 10, padding: "10px", fontSize: 14 }}>
            {["5m", "15m", "30m", "1h", "4h", "1d"].map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
      </div>

      <Input label="Trade Amount (USD)" {...field("amount")} type="number" placeholder="50" />

      {strategy === "grid" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Input label="Grid Low ($)" {...field("gridLow")} type="number" />
            <Input label="Grid High ($)" {...field("gridHigh")} type="number" />
          </div>
          <Input label="Grid Lines" {...field("gridLines")} type="number" />
        </>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Input label="Stop Loss (%)" {...field("stopLoss")} type="number" />
        <Input label="Take Profit (%)" {...field("takeProfit")} type="number" />
      </div>
      <Input label="Max Trades per Day" {...field("maxTrades")} type="number" />

      <div style={{ background: `${COLORS.warn}11`, border: `1px solid ${COLORS.warn}44`, borderRadius: 10, padding: 12, marginBottom: 16 }}>
        <div style={{ color: COLORS.warn, fontWeight: 700, fontSize: 12 }}>⚠️ Risk Disclosure</div>
        <div style={{ color: COLORS.sub, fontSize: 11, marginTop: 4 }}>Automated trading carries risk. Never invest more than you can afford to lose. Past performance is not indicative of future results.</div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <Btn variant="ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</Btn>
        <Btn onClick={handleSave} style={{ flex: 2 }}>🚀 {existing ? "Save Changes" : "Launch Bot"}</Btn>
      </div>
    </>
  )}
</Modal>
```

);
}

function WalletTab({ user }) {
const addr = user?.wallet || “7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU”;
const short = addr.slice(0, 8) + “…” + addr.slice(-8);
const [copied, setCopied] = useState(false);

const copy = () => {
navigator.clipboard?.writeText(addr);
setCopied(true);
setTimeout(() => setCopied(false), 1500);
};

const BALANCES = [
{ symbol: “SOL”, amount: 12.4, usd: 1839.2, icon: “◎” },
{ symbol: “USDC”, amount: 850.0, usd: 850.0, icon: “💵” },
{ symbol: “JUP”, amount: 340, usd: 286.28, icon: “♃” },
{ symbol: “BONK”, amount: 12000000, usd: 261.6, icon: “🐶” },
];

return (
<div style={{ padding: 20 }}>
<div style={{ color: COLORS.text, fontWeight: 700, fontSize: 18, marginBottom: 16 }}>◎ My Wallet</div>

```
  <div style={{ background: `linear-gradient(135deg, ${COLORS.sol}44, ${COLORS.accent}22)`, borderRadius: 20, padding: 20, marginBottom: 16 }}>
    <div style={{ color: COLORS.sub, fontSize: 12, marginBottom: 4 }}>Solana Wallet Address</div>
    <div style={{ fontFamily: "monospace", fontSize: 12, color: COLORS.text, marginBottom: 12, wordBreak: "break-all" }}>{addr}</div>
    <Btn small variant="ghost" onClick={copy}>{copied ? "✅ Copied!" : "📋 Copy Address"}</Btn>
  </div>

  <div style={{ color: COLORS.sub, fontSize: 12, fontWeight: 600, marginBottom: 10 }}>TOKEN BALANCES</div>
  {BALANCES.map(b => (
    <Card key={b.symbol} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${COLORS.sol}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{b.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, color: COLORS.text }}>{b.symbol}</div>
        <div style={{ color: COLORS.muted, fontSize: 12 }}>{b.amount.toLocaleString()} {b.symbol}</div>
      </div>
      <div style={{ fontWeight: 700, color: COLORS.text }}>${b.usd.toFixed(2)}</div>
    </Card>
  ))}

  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
    <Btn variant="primary">📥 Receive</Btn>
    <Btn variant="sol">📤 Send</Btn>
  </div>

  <Card style={{ marginTop: 16 }}>
    <div style={{ color: COLORS.accent, fontWeight: 700, fontSize: 13, marginBottom: 10 }}>🔐 Wallet Security</div>
    <SecurityBadge label="Keys stored encrypted in browser (AES-256-GCM)" icon="🔑" />
    <SecurityBadge label="Biometric unlock supported" icon="👆" />
    <SecurityBadge label="Auto-lock after 5 min inactivity" icon="⏰" />
    <Btn variant="ghost" small style={{ marginTop: 8, width: "100%" }}>Export Encrypted Backup</Btn>
  </Card>
</div>
```

);
}

function SecurityTab() {
const [twoFA, setTwoFA] = useState(true);
const [autoLock, setAutoLock] = useState(true);
const [notifications, setNotifications] = useState(true);

const Toggle = ({ on, onChange }) => (
<div onClick={() => onChange(!on)} style={{ width: 44, height: 24, borderRadius: 12, background: on ? COLORS.accent : COLORS.cardBorder, cursor: “pointer”, position: “relative”, transition: “background 0.2s” }}>
<div style={{ width: 20, height: 20, borderRadius: “50%”, background: “#fff”, position: “absolute”, top: 2, left: on ? 22 : 2, transition: “left 0.2s” }} />
</div>
);

return (
<div style={{ padding: 20 }}>
<div style={{ color: COLORS.text, fontWeight: 700, fontSize: 18, marginBottom: 4 }}>🛡️ Security Center</div>
<div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 20 }}>Your account and funds protection</div>

```
  {/* Security Score */}
  <Card style={{ textAlign: "center", marginBottom: 16, padding: 20 }}>
    <div style={{ color: COLORS.sub, fontSize: 12, marginBottom: 8 }}>Security Score</div>
    <div style={{ fontWeight: 900, fontSize: 48, color: COLORS.accent }}>92</div>
    <div style={{ color: COLORS.sub, fontSize: 12 }}>/ 100 · Excellent</div>
    <div style={{ background: COLORS.cardBorder, borderRadius: 99, height: 6, marginTop: 12 }}>
      <div style={{ width: "92%", height: 6, borderRadius: 99, background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.sol})` }} />
    </div>
  </Card>

  {/* Settings */}
  {[
    { label: "Two-Factor Authentication", sub: "Extra sign-in protection via PIN or app", icon: "📱", on: twoFA, set: setTwoFA },
    { label: "Auto-Lock (5 min)", sub: "Lock app when inactive", icon: "⏰", on: autoLock, set: setAutoLock },
    { label: "Trade Notifications", sub: "Alerts for bot trades and price changes", icon: "🔔", on: notifications, set: setNotifications },
  ].map(s => (
    <Card key={s.label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
      <span style={{ fontSize: 24 }}>{s.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 14 }}>{s.label}</div>
        <div style={{ color: COLORS.muted, fontSize: 11 }}>{s.sub}</div>
      </div>
      <s.set.constructor === Function ? null : <Toggle on={s.on} onChange={s.set} />}
    </Card>
  ))}

  {/* Where Data is Stored */}
  <div style={{ color: COLORS.sub, fontSize: 12, fontWeight: 600, marginTop: 20, marginBottom: 12 }}>WHERE YOUR DATA IS STORED</div>

  {[
    { icon: "🌐", title: "Vercel Edge Network (Global CDN)", desc: "App files delivered from servers closest to you. Encrypted in transit via TLS 1.3." },
    { icon: "🔑", title: "Private Keys — Your Device Only", desc: "Your wallet private key and seed phrase never leave your device. Encrypted with AES-256-GCM using your PIN as the key." },
    { icon: "☁️", title: "Account Data — Encrypted Cloud DB", desc: "Email, hashed password (bcrypt), and bot configs stored in a secure database (e.g. Supabase/PlanetScale). Your password is never stored in plain text — only a hash." },
    { icon: "📊", title: "Trade History — On-Chain (Solana)", desc: "All transactions are recorded immutably on the Solana blockchain. Publicly verifiable. You own your transaction history." },
    { icon: "🔐", title: "API Keys (if any) — Vault Encrypted", desc: "Exchange API keys are encrypted server-side using industry standard key vaults (e.g. AWS KMS). Never exposed in logs or to third parties." },
    { icon: "🚫", title: "We Never Sell Your Data", desc: "SolTrader AI does not share, sell, or rent your personal information to any third party for advertising or analytics." },
  ].map(s => (
    <div key={s.title} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
      <div style={{ width: 36, height: 36, minWidth: 36, borderRadius: 10, background: `${COLORS.accent}11`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{s.icon}</div>
      <div>
        <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 13 }}>{s.title}</div>
        <div style={{ color: COLORS.sub, fontSize: 12, lineHeight: 1.5 }}>{s.desc}</div>
      </div>
    </div>
  ))}

  <Card style={{ marginTop: 8, background: `${COLORS.danger}11`, borderColor: `${COLORS.danger}44` }}>
    <div style={{ color: COLORS.danger, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>⚠️ Important Reminder</div>
    <div style={{ color: COLORS.sub, fontSize: 12, lineHeight: 1.6 }}>
      SolTrader AI is a <b style={{ color: COLORS.text }}>non-custodial</b> platform. We never hold your crypto. You remain in full control of your wallet at all times. Always keep your seed phrase safe and offline.
    </div>
  </Card>
</div>
```

);
}

// ── APP ROOT ─────────────────────────────────────────────────
export default function App() {
const [user, setUser] = useState(null);

return (
<div style={{ fontFamily: “‘SF Pro Display’, ‘Segoe UI’, sans-serif”, background: COLORS.bg, minHeight: “100vh” }}>
<style>{`* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; } input, select { font-family: inherit; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0a0e1a; } ::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 4px; } @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }`}</style>
{!user ? (
<AuthScreen onAuth={setUser} />
) : (
<Dashboard user={user} onLogout={() => setUser(null)} />
)}
</div>
);
}
