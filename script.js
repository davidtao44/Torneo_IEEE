// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCMibEPcfb2Tq5lSjGoh10sld1z56vfizM",
    authDomain: "registro-torneo-lol.firebaseapp.com",
    projectId: "registro-torneo-lol",
    storageBucket: "registro-torneo-lol.firebasestorage.app",
    messagingSenderId: "181636238566",
    appId: "1:181636238566:web:fb41e3fdf2952e3885bf27",
    measurementId: "G-SCKV8TDRRP"
  };
  
  // Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

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
    // Subir archivo a Firebase Storage
    const storageRef = storage.ref(`comprobantes/${paymentProof.name}`);
    await storageRef.put(paymentProof);
    const fileUrl = await storageRef.getDownloadURL();

    // Guardar datos en Firestore
    await db.collection('inscriptions').add({
      fullName,
      lolUsername,
      phone,
      email,
      paymentProof: fileUrl,
      approved: false,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    document.getElementById('message').textContent = '¡Inscripción enviada exitosamente!';
    document.getElementById('inscriptionForm').reset();
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('message').textContent = 'Error al enviar la inscripción.';
  }
});