export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { name, email, phone, company, service, message } = req.body;

        // Basic server-side validation
        if (!name || !email || !phone || !company || !service) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Prepare the email content
        const htmlContent = `
            <h2>New Inquiry Received</h2>
            <p><strong>Full Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Work Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Phone / WhatsApp:</strong> ${escapeHtml(phone)}</p>
            <p><strong>Company / Brand:</strong> ${escapeHtml(company)}</p>
            <p><strong>Service Required:</strong> ${escapeHtml(service)}</p>
            <p><strong>Project Details:</strong><br/> ${escapeHtml(message || 'No additional details provided.')}</p>
            <hr />
            <p><small>Submission Date & Time: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}</small></p>
        `;

        // Send email using Resend API
        // For Vercel, process.env.RESEND_API_KEY must be set in the project settings
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev'; // Use onboarding for testing, or a custom domain for production
        
        if (!RESEND_API_KEY) {
            console.error('RESEND_API_KEY is not configured');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: `Bee Digital Website <${SENDER_EMAIL}>`,
                to: 'lokeshvanumu61@gmail.com',
                reply_to: email,
                subject: 'New Website Inquiry — Bee Digital',
                html: htmlContent
            })
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            console.error('Resend API Error:', data);
            return res.status(response.status).json({ 
                error: 'Failed to send email', 
                details: data 
            });
        }

        return res.status(200).json({ success: true, message: 'Inquiry sent successfully' });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}

// Basic HTML escaping for security
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
         .toString()
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
