var port = chrome.runtime.connect({name: "pokebot-connection"});
port.onMessage.addListener(function(msg) {
  switch(msg.type) {
    case 'responseToRequest':
      handleResponse(msg);
      break;
  }
});

function updateStats(obj) {
  if(obj.legend) port.postMessage({type:'updateMapStats', legend:obj.legend==='checked'});
  else if(obj.unique) port.postMessage({type:'updateMapStats', legend:obj.unique==='checked'});
  else if(obj.nonnormal) port.postMessage({type:'updateMapStats', legend:obj.nonnormal==='checked'});

  else if(obj.mode) port.postMessage({type:'updateMapMode', mode: obj.mode});
  else port.postMessage(obj);

}

function handleResponse(res) {
  console.log(res.text);
}
