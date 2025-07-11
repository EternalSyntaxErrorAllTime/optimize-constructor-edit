import https from "https";
import fs from "fs";
import path from "path";
import next from "next";

const DEV = false;
const app = next({ dev: DEV });
const handle = app.getRequestHandler();

const CERT_DIR = process.env.CERT_DIR ?? "./certs";
const KEY_PATH = path.join(CERT_DIR, "privkey.pem");
const CRT_PATH = path.join(CERT_DIR, "fullchain.pem");

const httpsOptions = {
  key: fs.readFileSync(KEY_PATH),
  cert: fs.readFileSync(CRT_PATH),
};

const PORT = Number(process.env.PORT) || 443;

app.prepare().then(() => {
  https
    .createServer(httpsOptions, (req, res) => handle(req, res))
    .listen(PORT, "0.0.0.0", (err?: Error) => {
      if (err) {
        console.error("❌ Server error:", err);
        process.exit(1);
      }
      console.log(`🚀 HTTPS на порту ${PORT} (локальная сеть)`);
    });
});
