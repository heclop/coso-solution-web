/**
 * Lógica del formulario de contacto (sin DOM, testeable).
 * El sitio es estático: al enviar, se abre WhatsApp o el cliente de correo del visitante
 * con el mensaje ya redactado. Si más adelante se añade un backend, solo cambia contactHref.
 */
import { mailtoUrl, whatsappUrl } from './whatsapp';

export type Channel = 'correo' | 'whatsapp' | 'llamada';

export interface ContactFormData {
  nombre: string;
  empresa: string;
  correo: string;
  telefono: string;
  mensaje: string;
  canal: Channel;
}

export type FieldErrors = Partial<Record<keyof ContactFormData, string>>;

const CHANNELS: readonly Channel[] = ['correo', 'whatsapp', 'llamada'];
const CHANNEL_LABEL: Record<Channel, string> = {
  correo: 'correo',
  whatsapp: 'WhatsApp',
  llamada: 'llamada telefónica',
};
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Lee el formulario y normaliza espacios. Un canal desconocido se trata como «correo». */
export function parseContactForm(form: FormData): ContactFormData {
  const text = (name: string) => String(form.get(name) ?? '').trim();
  const canal = text('canal') as Channel;
  return {
    nombre: text('nombre'),
    empresa: text('empresa'),
    correo: text('correo'),
    telefono: text('telefono'),
    mensaje: text('mensaje'),
    canal: CHANNELS.includes(canal) ? canal : 'correo',
  };
}

/** Devuelve un mensaje claro por cada campo con problemas (vacío = todo correcto). */
export function validateContact(data: ContactFormData): FieldErrors {
  const errors: FieldErrors = {};
  if (data.nombre.length < 2) errors.nombre = 'Escribe tu nombre.';
  if (!EMAIL.test(data.correo)) errors.correo = 'Introduce un correo electrónico válido.';
  if (data.mensaje.length < 10) errors.mensaje = 'Cuéntanos un poco más sobre lo que necesitas.';
  if (data.canal === 'llamada' && data.telefono.replace(/\D/g, '').length < 7)
    errors.telefono = 'Introduce un teléfono si prefieres que te llamemos.';
  return errors;
}

export function buildContactMessage(data: ContactFormData): string {
  const who = data.empresa ? `${data.nombre}, de ${data.empresa}` : data.nombre;
  return [
    `Hola, soy ${who}.`,
    '',
    data.mensaje,
    '',
    `Correo: ${data.correo}`,
    ...(data.telefono ? [`Teléfono: ${data.telefono}`] : []),
    `Prefiero que me contacten por ${CHANNEL_LABEL[data.canal]}.`,
  ].join('\n');
}

/** Enlace que abre el canal elegido con el mensaje redactado. */
export function contactHref(
  data: ContactFormData,
  contact: { email: string; whatsapp: string },
): string {
  const message = buildContactMessage(data);
  if (data.canal === 'whatsapp') return whatsappUrl(contact.whatsapp, message);
  const subject = `Nuevo caso: ${data.nombre}${data.empresa ? ` (${data.empresa})` : ''}`;
  return mailtoUrl(contact.email, subject, message);
}
