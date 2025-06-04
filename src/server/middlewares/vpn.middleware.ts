// vpn.middleware
import { Request, Response, NextFunction } from "express";
import ip from "ip";

const ALLOWED_SUBNET = "10.0.0.0/23";

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

  if (!ip.isPrivate(clientIp)) {
    res.status(403).json({
      error: "Access Denied",
      message: "Your IP address is not on the internal network.",
    });
    return;
  }

  if (!ip.cidrSubnet(ALLOWED_SUBNET).contains(clientIp)) {
    res.status(403).send({
      error: "Access Denied",
      message: `IP ${clientIp} is not within the allowed subnet: ${ALLOWED_SUBNET}`,
    });
    return;
  }

  next();
}
