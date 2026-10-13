/** Construye un enlace de WhatsApp (wa.me) con mensaje opcional. */
export function whatsappUrl(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 8) throw new Error(`Número de WhatsApp inválido: ${phone}`);

  const url = new URL(`https://wa.me/${digits}`);
  if (message !== undefined && message.trim() !== '') url.searchParams.set('text', message.trim());
  return url.href;
}

/** Enlace mailto con asunto y cuerpo codificados. */
export function mailtoUrl(email: string, subject?: string, body?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  // URLSearchParams codifica los espacios como "+", que los clientes de correo no siempre entienden
  const query = params.toString().replace(/\+/g, '%20');
  return `mailto:${email}${query ? `?${query}` : ''}`;
}
