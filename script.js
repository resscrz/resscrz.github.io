let localStream;
let peerConnection;
const config = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

async function start() {
  // Pega a câmera e microfone
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  document.getElementById('localVideo').srcObject = localStream;

  // Cria uma nova conexão
  peerConnection = new RTCPeerConnection(config);

  // Adiciona a mídia local
  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  // Mostra vídeo remoto quando chegar
  peerConnection.ontrack = event => {
    document.getElementById('remoteVideo').srcObject = event.streams[0];
  };

  // ICE candidates (iremos enviar via WebSocket no futuro)
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      console.log("Novo ICE candidate: ", event.candidate);
      // Aqui você vai enviar pro outro peer via WebSocket
    }
  };

  // Offer inicial (só de exemplo)
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  console.log("Offer criada:", offer);
  // Enviar offer pro servidor via WebSocket aqui no futuro
}
