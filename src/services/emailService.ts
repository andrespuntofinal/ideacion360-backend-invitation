import { Resend } from 'resend';

// Configure Resend with the API key
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.warn('⚠️ Advertencia: RESEND_API_KEY no está definida. El servicio de correo no funcionará.');
}
const resend = new Resend(apiKey || 'missing_key');

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
    <div style="background-color: #0b1120; padding: 40px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; width: 100%; margin: 0; box-sizing: border-box;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #111827; border-radius: 16px; overflow: hidden; border: 1px solid #1f2937; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);">
        
        <!-- Header/Logo -->
        <tr>
          <td style="padding: 32px 40px 16px 40px; text-align: center;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
              <tr>
                <td style="vertical-align: middle; padding-right: 10px;">
                  <!-- Circle Logo Icon -->
                  <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #6366f1 0%, #d946ef 100%); display: inline-block; text-align: center; line-height: 36px;">
                    <span style="color: #ffffff; font-size: 18px; font-weight: bold;">💡</span>
                  </div>
                </td>
                <td style="vertical-align: middle;">
                  <span style="font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">
                    Ideación<span style="color: #818cf8;">360</span>
                  </span>
                </td>
              </tr>
            </table>
            <div style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px; margin-top: 8px; font-weight: 600;">Invitaciones de Boda</div>
          </td>
        </tr>

        <!-- Main Content -->
        <tr>
          <td style="padding: 16px 40px 32px 40px;">
            <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0 0 12px 0; text-align: center; line-height: 1.3;">
              Confirmación de Asistencia
            </h1>
            <p style="color: #9ca3af; font-size: 15px; margin: 0 0 24px 0; text-align: center; line-height: 1.5;">
              Has recibido una nueva respuesta para la boda de <strong style="color: #ffffff;">${data.coupleNames}</strong>.
            </p>

            <!-- Details Box -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #1f2937; border-radius: 12px; border: 1px solid #374151; overflow: hidden;">
              <tr>
                <td style="padding: 24px;">
                  
                  <!-- Guest Name -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px;">
                    <tr>
                      <td width="35%" style="color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; padding-bottom: 4px;">
                        Invitado
                      </td>
                      <td width="65%" style="color: #ffffff; font-size: 16px; font-weight: 600; padding-bottom: 4px;">
                        ${data.guestName}
                      </td>
                    </tr>
                  </table>

                  <!-- Attendance -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px;">
                    <tr>
                      <td width="35%" style="color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; padding-bottom: 4px; vertical-align: middle;">
                        Asistencia
                      </td>
                      <td width="65%" style="padding-bottom: 4px; vertical-align: middle;">
                        ${data.attendance === 'si' 
                          ? `<span style="background-color: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); font-size: 13px; font-weight: 700; padding: 4px 12px; border-radius: 6px; display: inline-block;">Sí asistirá</span>`
                          : `<span style="background-color: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); font-size: 13px; font-weight: 700; padding: 4px 12px; border-radius: 6px; display: inline-block;">No asistirá</span>`
                        }
                      </td>
                    </tr>
                  </table>

                  <!-- Companions -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px;">
                    <tr>
                      <td width="35%" style="color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; padding-bottom: 4px;">
                        Acompañantes
                      </td>
                      <td width="65%" style="color: #ffffff; font-size: 16px; font-weight: 600; padding-bottom: 4px;">
                        ${data.companions}
                      </td>
                    </tr>
                  </table>

                  <!-- Message -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%;">
                    <tr>
                      <td colspan="2" style="color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; padding-bottom: 6px;">
                        Mensaje
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" style="background-color: #111827; border-radius: 8px; padding: 12px 16px; border: 1px solid #374151;">
                        <p style="color: #d1d5db; font-size: 14px; font-style: italic; margin: 0; line-height: 1.5;">
                          "${data.message || 'Sin mensaje adicional'}"
                        </p>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 0 40px 32px 40px; text-align: center;">
            <div style="border-top: 1px solid #1f2937; padding-top: 20px; color: #6b7280; font-size: 12px;">
              Confirmación recibida el ${data.date}
            </div>
            <div style="margin-top: 8px; color: #4b5563; font-size: 11px;">
              Este correo fue enviado de forma automática por Ideación 360.
            </div>
          </td>
        </tr>

      </table>
    </div>
  `;

  try {
    const response = await resend.emails.send({
      from: `Ideacion360 <${senderEmail}>`,
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

export const sendOTPEmail = async (recipientEmail: string, coupleNames: string, otpCode: string) => {
  const senderEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  const html = `
    <div style="background-color: #0b1120; padding: 40px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; width: 100%; margin: 0; box-sizing: border-box;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #111827; border-radius: 16px; overflow: hidden; border: 1px solid #1f2937; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);">
        
        <!-- Header/Logo -->
        <tr>
          <td style="padding: 32px 40px 16px 40px; text-align: center;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
              <tr>
                <td style="vertical-align: middle; padding-right: 10px;">
                  <!-- Circle Logo Icon -->
                  <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #6366f1 0%, #d946ef 100%); display: inline-block; text-align: center; line-height: 36px;">
                    <span style="color: #ffffff; font-size: 18px; font-weight: bold;">💡</span>
                  </div>
                </td>
                <td style="vertical-align: middle;">
                  <span style="font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">
                    Ideación<span style="color: #818cf8;">360</span>
                  </span>
                </td>
              </tr>
            </table>
            <div style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px; margin-top: 8px; font-weight: 600;">Invitaciones de Boda</div>
          </td>
        </tr>

        <!-- Main Content -->
        <tr>
          <td style="padding: 16px 40px 32px 40px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0 0 12px 0; line-height: 1.3;">
              Código de Verificación
            </h1>
            <p style="color: #9ca3af; font-size: 15px; margin: 0 0 32px 0; line-height: 1.5;">
              Has solicitado un código para ingresar a gestionar los invitados de la boda de <strong style="color: #ffffff;">${coupleNames}</strong>.
            </p>

            <!-- OTP Code Box -->
            <table align="center" border="0" cellpadding="0" cellspacing="0" style="background-color: #1f2937; border-radius: 12px; border: 1px solid #374151; overflow: hidden; margin: 0 auto 32px auto;">
              <tr>
                <td style="padding: 24px 48px; text-align: center;">
                  <div style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; font-weight: 700;">Tu código de seguridad</div>
                  <div style="font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #818cf8; font-family: 'Courier New', Courier, monospace;">
                    ${otpCode}
                  </div>
                </td>
              </tr>
            </table>

            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Este código expirará en <strong style="color: #9ca3af;">1 hora</strong> por seguridad.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 0 40px 32px 40px; text-align: center;">
            <div style="border-top: 1px solid #1f2937; padding-top: 20px; color: #6b7280; font-size: 12px;">
              Si no solicitaste este código, puedes ignorar este correo de forma segura.
            </div>
            <div style="margin-top: 8px; color: #4b5563; font-size: 11px;">
              Este correo fue enviado de forma automática por Ideación 360.
            </div>
          </td>
        </tr>

      </table>
    </div>
  `;

  try {
    const response = await resend.emails.send({
      from: `Ideacion360 <${senderEmail}>`,
      to: recipientEmail,
      subject: `Código de verificación gestión Boda ${coupleNames}`,
      html,
    });
    return response;
  } catch (error) {
    console.error('Error sending OTP email with Resend:', error);
    throw error;
  }
};
