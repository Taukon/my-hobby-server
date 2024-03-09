export const peerConnectionConfig = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  // configuration: {
  //   offerToReceiveAudio: true,
  //   offerToReceiveVideo: true
  // },
};


// --------socket.io server options--------
// export const opts = undefined;
export const opts = { cors: { origin: "*" } };
