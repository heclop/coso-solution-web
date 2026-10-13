/** Canales de contacto. Valores genéricos SOLO para maquetar: sustituir antes de lanzar. */
export interface ContactData {
  email: string;
  /** Solo dígitos, con código de país (formato wa.me). */
  whatsapp: string;
  phoneDisplay: string;
  hours: string;
}

export const contact: ContactData = {
  email: 'contacto@cososolution.example',
  whatsapp: '15550100000',
  phoneDisplay: '+1 555 010 0000',
  hours: '[HORARIO POR CONFIRMAR]',
};
