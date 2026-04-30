import { Resend } from 'resend';

// Configure Resend with the API key
const resend = new Resend(process.env.RESEND_API_KEY);

interface RSVPData {
  guestName: string;
  coupleNames: string;
  message: string;
  companions: number;
  attendance: string;
  date: string;
  recipientEmail: string;
}

export const sendRSVPEmail = async (data: RSVPData) => {
  const senderEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #19284c; padding: 40px 20px; color: #27272B;">
      <div style="background-color: #F7F9FA; border-radius: 8px; padding: 40px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: center;">
        <h1 style="color: #19284c; margin-bottom: 10px; font-size: 24px;">Confirmación de Asistencia boda ${data.coupleNames}</h1>
        <p style="color: #A5ADB8; font-size: 16px; margin-bottom: 30px;">Has recibido una nueva respuesta al evento</p>
        
        <div style="text-align: left; background-color: #E8E2D9; padding: 25px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #D7B272;">
          <p style="margin: 0 0 15px 0; color: #A5ADB8; font-size: 15px;">
            <strong style="color: #735309;">Invitado:</strong> ${data.guestName}
          </p>
          <p style="margin: 0 0 15px 0; color: #F7F9FA; font-size: 15px;">
            <strong style="color: #735309;">Respuesta de asistencia:</strong> 
            <span style="color: ${data.attendance === 'si' ? '#A5ADB8' : '#A5ADB8'}; font-weight: bold;">
              ${data.attendance === 'si' ? 'Sí asistirá' : 'No asistirá'}
            </span>
          </p>
          <p style="margin: 0 0 15px 0; color: #A5ADB8; font-size: 15px;">
            <strong style="color: #735309;">Número de acompañantes:</strong> ${data.companions}
          </p>
          <p style="margin: 0; color: #A5ADB8; font-size: 15px;">
            <strong style="color: #735309;">Mensaje:</strong> <br/>
            <span style="color: #A5ADB8; font-style: italic; display: inline-block; margin-top: 8px;">
              "${data.message || 'Sin mensaje'}"
            </span> 
          </p>
        </div>
        
        <div style="border-top: 1px solid #E8E2D9; padding-top: 20px; color: #A5ADB8; font-size: 12px;">
          Confirmación recibida el ${data.date}
        </div>
      </div>
    </div>
  `;

  try {
    const response = await resend.emails.send({
      from: `Invitaciones Boda <${senderEmail}>`,
      to: data.recipientEmail,
      subject: `Confirmación Asistencia Boda ${data.coupleNames}`,
      html,
    });
    return response;
  } catch (error) {
    console.error('Error sending email with Resend:', error);
    throw error;
  }
};
