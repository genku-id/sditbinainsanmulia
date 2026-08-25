// Ortu diidentifikasi dari nomor HP, bukan email. Agar tetap bisa login di
// plan Firebase gratis (Spark, tanpa OTP), kita simpan akun Firebase Auth
// dengan email turunan dari nomor HP — email ini tidak pernah ditampilkan ke
// orang tua, mereka cukup memasukkan nomor HP + kata sandi.
const ORTU_EMAIL_DOMAIN = "sditbinainsanmulia.sch.id";

export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("8")) return "62" + digits;
  return digits;
}

export function ortuEmailFromPhone(phone: string): string {
  return `${normalizePhone(phone)}@${ORTU_EMAIL_DOMAIN}`;
}

export function formatPhoneDisplay(phone: string): string {
  const d = normalizePhone(phone);
  return d.startsWith("62") ? `+${d}` : d;
}
