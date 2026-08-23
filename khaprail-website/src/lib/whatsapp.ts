// Khaprail Tiles' WhatsApp Business number — public contact info, not a secret.
const WHATSAPP_NUMBER = "923016878978"

export const WHATSAPP_DISPLAY_NUMBER = "+92 301 6878 978"

export const DEFAULT_WHATSAPP_MESSAGE = "Hi, I'm interested in Khaprail's roof tiles."

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

// Single source of truth for the "request a sample" message wording, reused
// by the PDP sample dialog, product cards, and the floating WhatsApp button
// so the copy never drifts between them.
export function buildSampleRequestMessage(productName: string): string {
  return `Hi, I'd like to request a sample of ${productName}.`
}
