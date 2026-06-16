import crypto from "crypto";

export function generateInviteCode() {
  const part = () => crypto.randomBytes(2).toString("hex").toUpperCase().slice(0, 4);
  return `COLLAB-${part()}-${part()}`;
}

export function generateAvatar(username) {
  const initials = username.slice(0, 2).toUpperCase();
  const bg = "FF4D02";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bg}&color=fff&size=128`;
}
