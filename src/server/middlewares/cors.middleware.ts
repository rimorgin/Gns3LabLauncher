import cors, { CorsOptions } from "cors";

const allowedOrigins = [
  "http://localhost:5000",
  "http://10.0.0.1:5000",
  "http://54.252.135.175",
  "https://54.252.135.175",
  "https://gns3lablauncher.mapua.netlab:8443",
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default cors(corsOptions);
