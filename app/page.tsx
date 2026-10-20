export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
        background: "#F4F2EE",
        color: "#16171B",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Bogey TP — site statique</h1>
      <p style={{ maxWidth: "32rem", textAlign: "center", lineHeight: 1.6 }}>
        La page livrée (identique au dossier « bogey-tp 2 ») se trouve dans{" "}
        <code style={{ background: "#fff", padding: "2px 6px", borderRadius: 4 }}>site/</code>.
        Lancez{" "}
        <code style={{ background: "#fff", padding: "2px 6px", borderRadius: 4 }}>
          npm run site:dev
        </code>{" "}
        puis ouvrez le lien ci-dessous.
      </p>
      <a
        href="http://127.0.0.1:8080/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          height: 46,
          padding: "0 20px",
          borderRadius: 999,
          background: "#F2621B",
          color: "#fff",
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        Voir le site (port 8080)
      </a>
    </main>
  );
}
