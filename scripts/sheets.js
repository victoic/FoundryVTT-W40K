function enableEditor(){
  document.getElementById("data-send-button").style.display = 'block';
  document.getElementById("data-text-editor").style.display = 'block';
  document.getElementById("data-edit-button").style.display = 'none';
  document.getElementById("data-text-display").style.display = 'none';
}

function disableEditor(){
  document.getElementById("data-text-display").innerText = document.getElementById("data-text-editor").value
  document.getElementById("data-send-button").style.display = 'none';
  document.getElementById("data-text-editor").style.display = 'none';
  document.getElementById("data-edit-button").style.display = 'block';
  document.getElementById("data-text-display").style.display = 'block';
}

function onAttributeChange(ev){
  if (ev.currentTarget.name == "data.profile.w.value") {
    document.getElementsByName("data.profile.w.max")[0].value = ev.currentTarget.value;
  }
}

function toggleModelNumbersEditor(ev) {
  inputs = ev.currentTarget.parentElement.getElementsByTagName("input");
  for (var input of inputs){
    if (input.hidden) {
      input.hidden = false;
    } else {
      input.hidden = true;
    }
  }

  spans = ev.currentTarget.parentElement.getElementsByTagName("span");
  for (var span of spans){
    if (span.hidden) {
      span.hidden = false;
    } else {
      span.hidden = true;
    }
  }
}

setTimeout(function(){
  document.getElementsByTagName("canvas")[0].onclick = function (ev) {
    var x = canvas.scene._viewPosition.x + ((ev.clientX - screen.width/2) * canvas.scene._viewPosition.scale);
    var y = canvas.scene._viewPosition.y + ((ev.clientY - screen.height/2) * canvas.scene._viewPosition.scale);
    lastClick = [x, y];
    game.scenes.active.data.lastClick = lastClick;
  };
}, 7000);

Handlebars.registerHelper("debug", function(optionalValue) {
  console.log("Current Context");
  console.log("====================");
  console.log(this);
  console.log(typeof(optionalValue));
  if (optionalValue) {
    console.log("Value");
    console.log("====================");
    console.log(optionalValue);
  }
});