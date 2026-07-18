import { PrintQueue } from './printQueue';

/**
 * Sends HTML content to print via the browser window.print API using an iframe.
 * @param {string} htmlContent - The receipt HTML content
 * @param {string} type - 'KOT' | 'BILL'
 * @returns {Promise<boolean>} True if print succeeded
 */
export const printReceipt = async (htmlContent, type = 'BILL') => {
  try {
    // 1. Create a temporary iframe for clean isolation
    let iframe = document.getElementById('print-iframe');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'print-iframe';
      // Hide iframe offscreen
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Print ${type}</title>
          <style>
            body { margin: 0; padding: 0; }
            @media print {
              body { font-family: monospace; font-size: 12px; }
            }
          </style>
        </head>
        <body>
          <div id="print-area">
            ${htmlContent}
          </div>
          <script>
            // Auto trigger print when loaded
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    doc.close();

    // Trigger iframe window print dialog
    setTimeout(() => {
      iframe.contentWindow.focus();
      // Browser will pause here for print dialog
    }, 250);

    return true;
  } catch (error) {
    console.error('printService: Error sending to print', error);
    // Queue the job to allow re-print later
    await PrintQueue.enqueue(type, htmlContent);
    return false;
  }
};
