import { Request, Response, NextFunction } from "express";
import ipaddr from "ipaddr.js";

const ALLOWED_SUBNET = "10.0.0.0/23"; // Change as needed

export default function vpnOnlyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const rawIp: string =
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.socket.remoteAddress ||
    req.ip ||
    "";

  // Remove IPv6 prefix if present (e.g., "::ffff:10.0.0.25")
  const clientIp = rawIp.replace(/^::ffff:/, "");

  let parsedIp: ipaddr.IPv4 | ipaddr.IPv6;

  try {
    parsedIp = ipaddr.parse(clientIp);
  } catch (err) {
    res.status(400).json({
      error: "Invalid IP",
      message: `The provided IP address "${clientIp}" is not valid.`,
    });
    return
  }

  // Reject public IPs
  if (parsedIp.kind() !== "ipv4" || parsedIp.range() !== "private") {
    res.status(403).json({
      error: "Access Denied",
      message: "Your IP address is not on the internal network.",
    });
    return
  }

  // Check if IP is within allowed subnet
  const [subnetIpStr, subnetMask] = ALLOWED_SUBNET.split("/");
  const subnetIp = ipaddr.parse(subnetIpStr);
  const maskLength = parseInt(subnetMask, 10);

  if (!(parsedIp instanceof ipaddr.IPv4) || !subnetIp.match(parsedIp, maskLength)) {
    res.status(403).json({
      error: "Access Denied",
      message: `IP ${clientIp} is not within the allowed subnet`,
    });
    return
  }

  next();
}