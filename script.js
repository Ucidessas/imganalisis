let videoElement = document.getElementById('video');
let outputElement = document.getElementById('detected-objects');
let targetObjectElement = document.getElementById('target-object');
let messageElement = document.getElementById('message');
let model;

// Inicializar la cámara web
async function initCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  videoElement.srcObject = stream;
}

// Cargar el modelo COCO-SSD de TensorFlow.js
async function loadModel() {
  model = await cocoSsd.load();
  console.log('Modelo cargado');
  detectFrame();
}

// Detectar objetos en cada cuadro del video
function detectFrame() {
  model.detect(videoElement).then(predictions => {
    showDetections(predictions);
    checkForTarget(predictions);
    requestAnimationFrame(detectFrame); // Continuar detectando en tiempo real
  });
}

// Mostrar las detecciones en la caja de escritura
function showDetections(predictions) {
  outputElement.innerHTML = ''; // Limpiar detecciones anteriores
  if (predictions.length > 0) {
    predictions.forEach(prediction => {
      const objectName = prediction.class;
      const confidence = (prediction.score * 100).toFixed(2);
      const detected = `<p><strong>${objectName}</strong> - Confianza: ${confidence}%</p>`;
      outputElement.innerHTML += detected;
    });
  } else {
    outputElement.innerHTML = '<p>No se detectaron objetos.</p>';
  }
}

// Verificar si el objeto ingresado está en las detecciones
function checkForTarget(predictions) {
  const targetObject = targetObjectElement.value.toLowerCase();
  let objectFound = false;

  predictions.forEach(prediction => {
    const detectedObject = prediction.class.toLowerCase();

    if (detectedObject === targetObject) {
      objectFound = true;
    }
  });

  if (objectFound) {
    messageElement.innerHTML = `<p style="color: green;">¡Objeto detectado: ${targetObject}!</p>`;
  } else if (targetObject) {
    messageElement.innerHTML = `<p style="color: red;">El objeto "${targetObject}" no ha sido detectado.</p>`;
  } else {
    messageElement.innerHTML = '';
  }
}

// Iniciar todo cuando la página se carga
window.onload = async () => {
  await initCamera();
  await loadModel();
};
