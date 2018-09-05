(function () {
  var colorPicker = document.querySelector('#color-picker');
  var colorCode = document.querySelector('#color-code');
  var colorCodeHex = document.querySelector('#color-display > span');
  var body = document.querySelector('body');

  var network = new brain.NeuralNetwork();
  var data = [
    { "input": { "r": "0.00", "g": "0.00", "b": "0.00" }, "output": { "white": 1 } },
    { "input": { "r": "0.85", "g": "0.88", "b": "0.56" }, "output": { "black": 1 } },
    { "input": { "r": "0.33", "g": "0.35", "b": "0.84" }, "output": { "white": 1 } },
    { "input": { "r": "0.00", "g": "0.99", "b": "1.00" }, "output": { "black": 1 } }
  ]

  network.train(data);

  var hex2rgb = function hex2rgb (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: Math.round(parseInt(result[1], 16) / 2.55) / 100,
      g: Math.round(parseInt(result[2], 16) / 2.55) / 100,
      b: Math.round(parseInt(result[3], 16) / 2.55) / 100
    } : null;
  }

  var updateScreen = function updateScreen(hex) {
    var rgb = hex2rgb(event.target.value);
    var contrastColor = brain.likely(rgb, network);
    body.style.backgroundColor = hex;
    colorCode.style.color = contrastColor;
    colorCode.style.borderColor = contrastColor;
    colorCode.value = hex.substr(1);
    colorCodeHex.style.color = hex;
    colorCodeHex.style.backgroundColor = contrastColor;
    colorPicker.value = hex;
    console.log('rgb', rgb)
  }

  colorCode.value = colorPicker.value.substr(1);

  colorPicker.addEventListener('change', function (event) {
    var hex = event.target.value;
    updateScreen(hex);
  });

  colorCode.addEventListener('keyup', function (event) {
    var regex = /[0-9a-f]{6}|#[0-9a-f]{3}/gi;
    if (event.keyCode === 13 && 
        event.target.value.match(regex)) {
      updateScreen('#' + event.target.value);
    }
  });
})()