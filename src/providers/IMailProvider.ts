export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface IMailProvider {
  // Retorna o link de pré-visualização, se houver
  sendMail(message: MailMessage): Promise<string | false>;
}
