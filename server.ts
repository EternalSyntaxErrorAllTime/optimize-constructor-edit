import https from "https";
import fs from "fs";
import path from "path";
import os from "os";
import next from "next";
import dotenv from "dotenv";

dotenv.config();

const DEV = false;
const app = next({ dev: DEV });
const handle = app.getRequestHandler();

const CERT_DIR = process.env.CERT_DIR ?? "./certs";
const KEY_PATH = path.join(CERT_DIR, process.env.KEY_CERT ?? "privkey.pem");
const CRT_PATH = path.join(
  CERT_DIR,
  process.env.DOMAIN_CERT ?? "fullchain.pem"
);

const httpsOptions = {
  key: fs.readFileSync(KEY_PATH),
  cert: fs.readFileSync(CRT_PATH),
};

const PORT = Number(process.env.PORT) || 443;

app.prepare().then(() => {
  const server = https.createServer(httpsOptions, (req, res) =>
    handle(req, res)
  );
  server.listen(PORT, "0.0.0.0", (err?: Error) => {
    if (err) {
      console.error("❌ Server error:", err);
      process.exit(1);
    }

    const nets = os.networkInterfaces();
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]!) {
        if (net.family === "IPv4" && !net.internal) {
          console.log(`   🔗 https://${net.address}:${PORT}`);
        }
      }
    }
    console.log(`   🔗 https://localhost:${PORT}`);
  });
});
