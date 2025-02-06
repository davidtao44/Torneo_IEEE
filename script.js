document.getElementById('inscriptionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const fullName = document.getElementById('fullName').value;
    const lolUsername = document.getElementById('lolUsername').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const paymentProof = document.getElementById('paymentProof').files[0];
  
    if (!paymentProof) {
      alert('Por favor, sube un comprobante de pago.');
      return;
    }
  
    // Leer el archivo como base64
    const reader = new FileReader();
    reader.readAsDataURL(paymentProof);
    reader.onload = async () => {
      const base64 = reader.result;
  
      // Enviar datos al backend de Google Apps Script
      const response = await fetch('https://cors-anywhere.herokuapp.com/https://script.google.com/macros/s/AKfycbyyLv-YBWMlOXO0AffVRmWOQC9Zzj4rekcJrfNTHS5oBOhDVuOCfl2s4enViA4TV8ON9A/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          lolUsername,
          phone,
          email,
          paymentProof: base64,
          fileType: paymentProof.type,
        }),
      });
  
      const result = await response.json();
      if (result.success) {
        document.getElementById('message').textContent = '¡Inscripción enviada exitosamente!';
        document.getElementById('inscriptionForm').reset();
      } else {
        document.getElementById('message').textContent = 'Error al enviar la inscripción.';
      }
    };
  });