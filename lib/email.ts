// Email service using Resend
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendVerificationCodeParams {
  to: string
  code: string
}

export async function sendVerificationCode({ to, code }: SendVerificationCodeParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'SWATWORKS <onboarding@resend.dev>',
      to: [to],
      subject: 'Tu codigo de verificacion - SWATWORKS Demo',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 40px 20px; margin: 0;">
          <div style="max-width: 400px; margin: 0 auto; background-color: #141414; border-radius: 12px; padding: 40px; border: 1px solid #262626;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="font-size: 24px; font-weight: bold; margin: 0;">
                SWAT<span style="color: #00d4ff;">WORKS</span>
              </h1>
            </div>
            
            <p style="color: #a0a0a0; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
              Usa el siguiente codigo para verificar tu email y acceder al demo:
            </p>
            
            <div style="background-color: #1a1a2e; border: 2px solid #00d4ff; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #00d4ff;">
                ${code}
              </span>
            </div>
            
            <p style="color: #666666; font-size: 12px; line-height: 1.5; margin: 0;">
              Este codigo expira en 10 minutos. Si no solicitaste este codigo, puedes ignorar este email.
            </p>
          </div>
          
          <p style="text-align: center; color: #444444; font-size: 11px; margin-top: 30px;">
            &copy; ${new Date().getFullYear()} SWATWORKS. Tampa, Florida.
          </p>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('[Email] Failed to send verification code:', error)
      return { success: false, error: error.message }
    }

    console.log('[Email] Verification code sent successfully:', data?.id)
    return { success: true, id: data?.id }
  } catch (error) {
    console.error('[Email] Exception sending email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}
