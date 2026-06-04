import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

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

// Helper to get logo attachment details
const getLogoAttachment = () => {
  try {
    const logoPath = path.resolve(__dirname, '../../../frontend/src/assets/logositio.jpg');
    if (fs.existsSync(logoPath)) {
      return {
        content: fs.readFileSync(logoPath),
        filename: 'logositio.jpg',
        contentId: 'logositio',
        contentType: 'image/jpeg'
      };
    }
  } catch (error) {
    console.error('Error loading email logo attachment:', error);
  }
  return null;
};

export const sendRSVPEmail = async (data: RSVPData) => {
  const senderEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const logo = getLogoAttachment();

  const html = `
    <div style="background-color: #0B0A24; background: radial-gradient(circle at top, #161545 0%, #0B0A24 100%); padding: 40px 0; font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; width: 100%; margin: 0; box-sizing: border-box;">
      <!--[if !mso]><!-->
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet">
      <!--<![endif]-->
      
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #12113A; border-radius: 24px; overflow: hidden; border: 1px solid #1E1B6B; box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);">
        
        <!-- Header/Logo -->
        <tr>
          <td style="padding: 36px 40px 20px 40px; text-align: center;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
              <tr>
                <td style="text-align: center;">
                  ${logo 
                    ? `<img src="cid:logositio" alt="Ideación 360" style="display: block; margin: 0 auto; max-height: 55px; width: auto; border: none; outline: none; text-decoration: none;" height="55" />`
                    : `<span style="font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">Ideación<span style="color: #818cf8;">360</span></span>`
                  }
                </td>
              </tr>
            </table>
            <div style="font-size: 16px; font-family: 'Playfair Display', Georgia, serif; color: #ffffff; letter-spacing: 0.5px; margin-top: 14px; font-weight: 700; text-transform: none;">
              Ideación <span style="color: #4b7bec; font-family: 'Outfit', sans-serif; font-weight: 800;">3</span><span style="color: #a55eea; font-family: 'Outfit', sans-serif; font-weight: 800;">6</span><span style="color: #ffb142; font-family: 'Outfit', sans-serif; font-weight: 800;">0</span>
            </div>
          </td>
        </tr>

        <!-- Main Content -->
        <tr>
          <td style="padding: 16px 40px 32px 40px;">
            <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 12px 0; text-align: center; line-height: 1.3; letter-spacing: -0.5px;">
              Confirmación de Asistencia
            </h1>
            <p style="color: #94a3b8; font-size: 15px; margin: 0 0 24px 0; text-align: center; line-height: 1.6;">
              Has recibido una nueva respuesta para la boda de <strong style="color: #ffffff; font-weight: 600;">${data.coupleNames}</strong>.
            </p>

            <!-- Details Box -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #18174D; border-radius: 16px; border: 1px solid #2B2883; overflow: hidden;">
              <tr>
                <td style="padding: 24px;">
                  
                  <!-- Guest Name -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 18px;">
                    <tr>
                      <td width="35%" style="color: #a5b4fc; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; padding-bottom: 4px;">
                        Invitado
                      </td>
                      <td width="65%" style="color: #ffffff; font-size: 16px; font-weight: 600; padding-bottom: 4px;">
                        ${data.guestName}
                      </td>
                    </tr>
                  </table>

                  <!-- Attendance -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 18px;">
                    <tr>
                      <td width="35%" style="color: #a5b4fc; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; padding-bottom: 4px; vertical-align: middle;">
                        Asistencia
                      </td>
                      <td width="65%" style="padding-bottom: 4px; vertical-align: middle;">
                        ${data.attendance === 'si' 
                          ? `<span style="background-color: rgba(16, 185, 129, 0.12); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.25); font-size: 13px; font-weight: 700; padding: 6px 16px; border-radius: 8px; display: inline-block;">Sí asistirá</span>`
                          : `<span style="background-color: rgba(239, 68, 68, 0.12); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.25); font-size: 13px; font-weight: 700; padding: 6px 16px; border-radius: 8px; display: inline-block;">No asistirá</span>`
                        }
                      </td>
                    </tr>
                  </table>

                  <!-- Companions -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 18px;">
                    <tr>
                      <td width="35%" style="color: #a5b4fc; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; padding-bottom: 4px;">
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
                      <td colspan="2" style="color: #a5b4fc; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; padding-bottom: 8px;">
                        Mensaje
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" style="background-color: #0B0A24; border-radius: 12px; padding: 14px 18px; border: 1px solid #1E1B6B;">
                        <p style="color: #e2e8f0; font-size: 14px; font-style: italic; margin: 0; line-height: 1.6;">
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
          <td style="padding: 0 40px 36px 40px; text-align: center;">
            <div style="border-top: 1px solid rgba(99, 102, 241, 0.12); padding-top: 24px; color: #64748b; font-size: 12px;">
              Confirmación recibida el ${data.date}
            </div>
            <div style="margin-top: 8px; color: #475569; font-size: 11px;">
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
      attachments: logo ? [logo] : [],
    });
    return response;
  } catch (error) {
    console.error('Error sending email with Resend:', error);
    throw error;
  }
};

export const sendOTPEmail = async (recipientEmail: string, coupleNames: string, otpCode: string) => {
  const senderEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const logo = getLogoAttachment();

  const html = `
    <div style="background-color: #0B0A24; background: radial-gradient(circle at top, #161545 0%, #0B0A24 100%); padding: 40px 0; font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; width: 100%; margin: 0; box-sizing: border-box;">
      <!--[if !mso]><!-->
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet">
      <!--<![endif]-->

      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #12113A; border-radius: 24px; overflow: hidden; border: 1px solid #1E1B6B; box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);">
        
        <!-- Header/Logo -->
        <tr>
          <td style="padding: 36px 40px 20px 40px; text-align: center;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
              <tr>
                <td style="text-align: center;">
                  ${logo 
                    ? `<img src="cid:logositio" alt="Ideación 360" style="display: block; margin: 0 auto; max-height: 55px; width: auto; border: none; outline: none; text-decoration: none;" height="55" />`
                    : `<span style="font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">Ideación<span style="color: #818cf8;">360</span></span>`
                  }
                </td>
              </tr>
            </table>
            <div style="font-size: 16px; font-family: 'Playfair Display', Georgia, serif; color: #ffffff; letter-spacing: 0.5px; margin-top: 14px; font-weight: 700; text-transform: none;">
              Ideación <span style="color: #4b7bec; font-family: 'Outfit', sans-serif; font-weight: 800;">3</span><span style="color: #a55eea; font-family: 'Outfit', sans-serif; font-weight: 800;">6</span><span style="color: #ffb142; font-family: 'Outfit', sans-serif; font-weight: 800;">0</span>
            </div>
          </td>
        </tr>

        <!-- Main Content -->
        <tr>
          <td style="padding: 16px 40px 32px 40px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 12px 0; line-height: 1.3; letter-spacing: -0.5px;">
              Código de Verificación
            </h1>
            <p style="color: #94a3b8; font-size: 15px; margin: 0 0 32px 0; line-height: 1.6;">
              Has solicitado un código para ingresar a gestionar los invitados de la boda de <strong style="color: #ffffff; font-weight: 600;">${coupleNames}</strong>.
            </p>

            <!-- OTP Code Box -->
            <table align="center" border="0" cellpadding="0" cellspacing="0" style="background-color: #18174D; border-radius: 16px; border: 1px solid #2B2883; overflow: hidden; margin: 0 auto 32px auto;">
              <tr>
                <td style="padding: 28px 48px; text-align: center;">
                  <div style="font-size: 12px; color: #a5b4fc; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; font-weight: 700;">Tu código de seguridad</div>
                  <div style="font-size: 40px; font-weight: 800; letter-spacing: 8px; color: #ffffff; font-family: 'Courier New', Courier, monospace; text-shadow: 0 0 15px rgba(99, 102, 241, 0.4);">
                    ${otpCode}
                  </div>
                </td>
              </tr>
            </table>

            <p style="color: #64748b; font-size: 14px; margin: 0;">
              Este código expirará en <strong style="color: #94a3b8;">1 hora</strong> por seguridad.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 0 40px 36px 40px; text-align: center;">
            <div style="border-top: 1px solid rgba(99, 102, 241, 0.12); padding-top: 24px; color: #64748b; font-size: 12px;">
              Si no solicitaste este código, puedes ignorar este correo de forma segura.
            </div>
            <div style="margin-top: 8px; color: #475569; font-size: 11px;">
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
      attachments: logo ? [logo] : [],
    });
    return response;
  } catch (error) {
    console.error('Error sending OTP email with Resend:', error);
    throw error;
  }
};
