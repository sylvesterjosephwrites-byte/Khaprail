// Khaprail Tiles' WhatsApp Business number — public contact info, not a secret.
const WHATSAPP_NUMBER = "923016878978"

export const WHATSAPP_DISPLAY_NUMBER = "+92 301 6878 978"

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
