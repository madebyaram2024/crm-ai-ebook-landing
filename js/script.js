// Download YOUR actual PDF file - UPDATED ROOT DOMAIN URL
        function generatePDF() {
            // Updated URL for root domain (after repository rename)
            const pdfUrl = 'https://madebyaram2024.github.io/downloads/building-crm-agentic-ai.pdf';

            // Direct download
            const a = document.createElement('a');
            a.href = pdfUrl;
            a.download = 'Building CRM with Agentic AI.pdf';
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Track download
            if (typeof gtag !== 'undefined') {
                gtag('event', 'file_download', {
                    'event_category': 'ebook',
                    'event_label': 'pdf-download-success',
                    'value': 1
                });
            }

            console.log('Downloading PDF from:', pdfUrl);
        }

        // Close download popup
        function closeDownloadPopup() {
            document.getElementById('downloadPopup').classList.remove('show');
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }

        // Start countdown and show popup
        function startDownloadProcess() {
            const popup = document.getElementById('downloadPopup');
            const countdownTimer = document.getElementById('countdownTimer');
            const progressBar = document.getElementById('countdownProgressBar');
            const downloadReady = document.getElementById('downloadReady');
            const countdownSection = document.querySelector('.countdown-section');

            // Show popup
            popup.classList.add('show');
            document.body.style.overflow = 'hidden'; // Disable background scrolling

            let timeLeft = 10;
            const totalTime = 10;

            const countdownInterval = setInterval(() => {
                timeLeft--;
                countdownTimer.textContent = timeLeft;

                // Update progress bar
                const progress = ((totalTime - timeLeft) / totalTime) * 100;
                progressBar.style.width = progress + '%';

                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);

                    // Hide countdown section
                    countdownSection.style.display = 'none';

                    // Show download ready section
                    downloadReady.classList.add('show');

                    // Start download automatically
                    generatePDF();

                    // Track download event
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'download_completed', {
                            'event_category': 'ebook',
                            'event_label': 'Building CRM with Agentic AI'
                        });
                    }

                    // Auto-close popup after 5 seconds
                    setTimeout(() => {
                        closeDownloadPopup();
                    }, 5000);
                }
            }, 1000);
        }

        // Form submission handler with lead capture
        document.getElementById('downloadForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const company = formData.get('company');

            // Validate form
            if (!name || !email) {
                alert('Please fill in all required fields.');
                return;
            }

            // Disable form temporarily
            const submitBtn = document.getElementById('downloadBtn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';

            // Show success message briefly
            const successMessage = document.getElementById('successMessage');
            successMessage.classList.add('show');

            // LEAD CAPTURE - Send lead data
            const leadData = {
                name: name,
                email: email,
                company: company || 'Not provided',
                timestamp: new Date().toISOString(),
                source: 'CRM AI eBook Landing Page'
            };

            // Store locally
            localStorage.setItem('ebookDownloaded', JSON.stringify(leadData));

            // Send to your lead capture system
            sendLeadData(leadData);

            // Track form submission
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'lead_generation',
                    'event_label': 'ebook_download_form'
                });
            }

            // Start download process after short delay
            setTimeout(() => {
                successMessage.classList.remove('show');
                startDownloadProcess();

                // Reset form
                submitBtn.disabled = false;
                submitBtn.textContent = '📥 Download Free Ebook';
            }, 1500);
        });

        // Lead capture function - SENDS TO YOUR EMAIL
        function sendLeadData(leadData) {
            // Log to console for backup
            console.log('NEW LEAD CAPTURED:', leadData);

            // These IDs are available in the EmailJS dashboard
            // https://dashboard.emailjs.com/admin
            const serviceID = 'YOUR_SERVICE_ID';
            const templateID = 'YOUR_TEMPLATE_ID';

            emailjs.send(serviceID, templateID, {
                to_email: 'madebyaram@gmail.com', // This can be a variable in your template
                from_name: leadData.name,
                from_email: leadData.email,
                company: leadData.company,
                message: `New lead: ${leadData.name} (${leadData.email}) from ${leadData.company || 'Unknown company'} downloaded the CRM AI eBook.`
            }).then(res => {
                console.log('EmailJS response:', res);
            }).catch(err => {
                console.error('EmailJS error:', err);
                // Fallback to mailto if EmailJS fails
                const subject = `🚀 New eBook Lead: ${leadData.name}`;
                const body = `
NEW LEAD from CRM AI eBook Landing Page!
📝 Name: ${leadData.name}
📧 Email: ${leadData.email}
🏢 Company: ${leadData.company}
🕐 Downloaded: ${new Date(leadData.timestamp).toLocaleString()}
📍 Source: CRM AI eBook Landing Page
This lead just downloaded your Building CRM with Agentic AI guide!
                `;
                const mailtoLink = `mailto:madebyaram@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.open(mailtoLink);
            });
        }

        // Scroll to form function
        function scrollToForm() {
            document.querySelector('.download-section').scrollIntoView({
                behavior: 'smooth'
            });
        }

        // Track form interactions
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', function() {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_interaction', {
                        'event_category': 'engagement',
                        'event_label': this.name
                    });
                }
            });
        });

        // Keyboard event handling
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const popup = document.getElementById('downloadPopup');
                if (popup.classList.contains('show')) {
                    closeDownloadPopup();
                }
            }
        });

        // Prevent popup close during countdown unless explicitly closed
        document.getElementById('downloadPopup').addEventListener('click', function(e) {
            if (e.target === this) {
                // Only allow closing by clicking outside if countdown is complete
                const downloadReady = document.getElementById('downloadReady');
                if (downloadReady.classList.contains('show')) {
                    closeDownloadPopup();
                }
            }
        });

        // Initialize AdSense
        (adsbygoogle = window.adsbygoogle || []).push({});
