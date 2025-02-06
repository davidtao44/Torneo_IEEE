import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Configuración de Supabase
const supabaseUrl = 'https://vomdmiogipuenyjdqzdp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvbWRtaW9naXB1ZW55amRxemRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4NTMyNzYsImV4cCI6MjA1NDQyOTI3Nn0.XHwc6dz-PxBZDMxSqNoydjF44Ku-Fsr8RL3kUvoRsZA';

// Inicializa Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

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

  try {
    // Subir archivo a Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('comprobantes')
      .upload(`${paymentProof.name}`, paymentProof);

    if (storageError) throw storageError;

    const fileUrl = `${supabaseUrl}/storage/v1/object/public/comprobantes/${paymentProof.name}`;

    // Guardar datos en la base de datos
    const { data, error } = await supabase.from('inscriptions').insert([
      {
        full_name: fullName,
        lol_username: lolUsername,
        phone,
        email,
        payment_proof: fileUrl,
        approved: false,
      },
    ]);

    if (error) throw error;

    document.getElementById('message').textContent = '¡Inscripción enviada exitosamente!';
    document.getElementById('inscriptionForm').reset();
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('message').textContent = 'Error al enviar la inscripción.';
  }
});