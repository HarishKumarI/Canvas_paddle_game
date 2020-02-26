// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Paddle =
/*#__PURE__*/
function () {
  function Paddle(gameHeight, gameWidth) {
    _classCallCheck(this, Paddle);

    this.paddleWidth = 100;
    this.paddleHeight = 20;
    this.paddleStartX = gameWidth / 2 - this.paddleWidth / 2;
    this.paddleStartY = gameHeight - this.paddleHeight - 2;
    this.paddleSpeed = 10;
    this.gameDimensions = [gameWidth, gameHeight];
  }

  _createClass(Paddle, [{
    key: "draw",
    value: function draw(ctx, factor) {
      this.paddleStartX += this.paddleSpeed * factor;
      if (this.paddleStartX < 5) this.paddleStartX = 5;
      if (this.paddleStartX > this.gameDimensions[0] - this.paddleWidth - 5) this.paddleStartX = this.gameDimensions[0] - this.paddleWidth - 5;
      ctx.beginPath();
      ctx.fillStyle = "#00f";
      ctx.rect(this.paddleStartX, this.paddleStartY, this.paddleWidth, this.paddleHeight);
      ctx.fill();
      ctx.closePath();
    }
  }]);

  return Paddle;
}();

var Ball =
/*#__PURE__*/
function () {
  function Ball(gameHeight, gameWidth, paddle) {
    _classCallCheck(this, Ball);

    this.ballRadius = 10;
    this.ballX = Math.ceil(gameWidth / 2);
    this.ballY = Math.ceil(gameHeight - paddle.paddleHeight - this.ballRadius - 5);
    this.ballSpeed = {
      x: 2,
      y: -2
    };
    this.gameDimensions = [gameWidth, gameHeight];
    this.paddle = paddle;
  }

  _createClass(Ball, [{
    key: "moveBall",
    value: function moveBall(ctx, paddle) {
      this.ballX = paddle.paddleStartX + paddle.paddleWidth / 2;
      this.ballY = paddle.paddleStartY - paddle.paddleHeight / 2;
      ctx.beginPath();
      ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, 2 * Math.PI);
      ctx.fillStyle = "#f00";
      ctx.fill();
      ctx.closePath();
    }
  }, {
    key: "draw",
    value: function draw(ctx, gameStatus, lives) {
      if (this.ballX + this.ballRadius > this.gameDimensions[0] - 2 || this.ballX - this.ballRadius < 2) this.ballSpeed.x = -this.ballSpeed.x;
      if (this.ballY - this.ballRadius < 2 || this.ballY + this.ballRadius > this.gameDimensions[1] - this.paddle.paddleHeight - 1) this.ballSpeed.y = -this.ballSpeed.y;

      if (gameStatus === 2) {
        this.ballX += this.ballSpeed.x;
        this.ballY += this.ballSpeed.y;
      }

      ctx.beginPath();
      ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, 2 * Math.PI);
      ctx.fillStyle = "#f00";
      ctx.fill();
      ctx.closePath();

      if (this.ballX < this.paddle.paddleStartX && this.ballY + this.ballRadius === this.gameDimensions[1] - this.paddle.paddleHeight - 2 || this.ballX > this.paddle.paddleStartX + this.paddle.paddleWidth && this.ballY + this.ballRadius === this.gameDimensions[1] - this.paddle.paddleHeight - 2) {
        document.getElementById('lives').innerText = lives -= 1;
      }

      return lives;
    }
  }]);

  return Ball;
}();

var Block =
/*#__PURE__*/
function () {
  function Block(gameHeight, gameWidth, paddle, x, y, blockWidth) {
    _classCallCheck(this, Block);

    this.blockHeight = 20;
    this.blockWidth = blockWidth;
    this.blockX = x;
    this.blockY = y;
    this.broke = false;
    this.gameDimensions = [gameHeight, gameWidth];
    this.paddle = paddle;
  }

  _createClass(Block, [{
    key: "draw",
    value: function draw(ctx) {
      ctx.beginPath();
      ctx.fillStyle = "#0ff";
      ctx.rect(this.blockX, this.blockY, this.blockWidth, this.blockHeight);
      ctx.fill();
      ctx.strokeStyle = "fff";
      ctx.stroke();
      ctx.closePath();
    }
  }, {
    key: "updateBroke",
    value: function updateBroke(ctx, ball, score, currentLevel) {
      if (!this.broke) {
        var ballTop = ball.ballY - ball.ballRadius;
        var ballBottom = ball.ballY + ball.ballRadius;
        var ballLeft = ball.ballX - ball.ballRadius;
        var ballRight = ball.ballX + ball.ballRadius;
        var blockTop = this.blockY;
        var blockBottom = this.blockY + this.blockHeight;
        var blockLeft = this.blockX;
        var blockRight = this.blockX + this.blockWidth; // if touches block

        if (ballTop <= blockBottom && ballTop >= blockTop && ballLeft >= blockLeft && ballLeft <= blockRight || ballBottom >= blockTop && ballBottom <= blockBottom && ballRight >= blockLeft && ballRight <= blockRight) {
          this.broke = !this.broke;
          score++;
          document.getElementById('score').innerText = score;
          ball.ballSpeed = {
            x: ball.ballSpeed.x,
            y: -ball.ballSpeed.y
          };
        }
      }

      if (!this.broke) this.draw(ctx);
      return score;
    }
  }]);

  return Block;
}();

function changeBlocks(currentLevel, gameWidth, gameHeight, Levels) {
  var blocks = [];
  var noOfBricks = typeof Levels[currentLevel - 1][0] === "number" ? Levels[currentLevel - 1].length : Levels[currentLevel - 1][0].length;
  var blockWidth = Math.ceil((gameWidth - 20) / noOfBricks);
  Levels[currentLevel - 1].map(function (row, rowNo) {
    if (typeof row === "number") {
      if (row === 1) blocks.push(new Block(gameHeight, gameWidth, paddle, rowNo * blockWidth + 5, 10, blockWidth));
    } else row.map(function (column, colNo) {
      if (column === 1) blocks.push(new Block(gameHeight, gameWidth, paddle, colNo * blockWidth + 5, (rowNo + 1) * 20, blockWidth));
    });
  });
  return blocks;
}

var canvas = document.querySelector('#paddleGame');
var scoreSpan = document.getElementById('score');
var livesSpan = document.getElementById('lives');
var levelSpan = document.getElementById('level');
var gameWidth = canvas.width = 3 * (window.innerWidth / 4);
var gameHeight = canvas.height = window.innerHeight / 2;
var ctx = canvas.getContext('2d');
var blocks = [];
var Levels = [[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]];
var score = 0;
var lives = 3;
var currentLevel = 1;
var gameStatus = 0;
var GAMESTATE = {
  NOTSTARTED: 0,
  PAUSED: 1,
  RUNNING: 2,
  LEVELCHANGE: 3,
  GAMEOVER: 4,
  WON: 5
};
var paddle = new Paddle(gameHeight, gameWidth);
var ball = new Ball(gameHeight, gameWidth, paddle);
blocks = changeBlocks(currentLevel, gameWidth, gameHeight, Levels);
document.addEventListener("keydown", keyDownHandler, false); // document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.keyCode === 39) {
    if (gameStatus !== GAMESTATE.GAMEOVER && gameStatus !== GAMESTATE.WON) paddle.draw(ctx, +1);
    if (gameStatus === GAMESTATE.NOTSTARTED && gameStatus !== GAMESTATE.WON) ball.moveBall(ctx, paddle);
  } else if (e.keyCode === 37) {
    if (gameStatus !== GAMESTATE.GAMEOVER && gameStatus !== GAMESTATE.WON) paddle.draw(ctx, -1);
    if (gameStatus === GAMESTATE.NOTSTARTED && gameStatus !== GAMESTATE.WON) ball.moveBall(ctx, paddle);
  } else if (e.keyCode === 32) {
    spaceHandler(e);
  }
}

function spaceHandler(e) {
  if (gameStatus !== GAMESTATE.GAMEOVER && gameStatus !== GAMESTATE.WON) {
    gameStatus = GAMESTATE.RUNNING;
    lives = ball.draw(ctx, gameStatus, lives);
  }
}

scoreSpan.innerText = score;
livesSpan.innerText = lives;
levelSpan.innerText = currentLevel;

function messageHandling() {
  if (gameStatus === GAMESTATE.GAMEOVER) {
    ctx.rect(0, 0, gameWidth, gameHeight);
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fill();
    ctx.font = "40px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", gameWidth / 2, gameHeight / 2);
  } else if (gameStatus === GAMESTATE.NOTSTARTED) {
    ctx.rect(0, 0, gameWidth, gameHeight);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fill();
    ctx.font = "30px Arial";
    ctx.fillStyle = "Green";
    ctx.textAlign = "center";
    ctx.fillText("Press SPACEBAR to START", gameWidth / 2, gameHeight / 2);
    ctx.fillStyle = "green";
    requestAnimationFrame(play);
  } else if (gameStatus === GAMESTATE.PAUSED) {
    ctx.rect(0, 0, gameWidth, gameHeight);
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fill();
    ctx.font = "30px Arial";
    ctx.fillStyle = "green";
    ctx.textAlign = "center";
    ctx.fillText("Press SPACEBAR to Resume", gameWidth / 2, gameHeight / 2);
    requestAnimationFrame(play);
  } else if (gameStatus === GAMESTATE.LEVELCHANGE) {
    ctx.rect(0, 0, gameWidth, gameHeight);
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fill();
    ctx.font = "24px Arial";
    ctx.fillStyle = "green";
    ctx.textAlign = "center";
    ctx.fillText("Cleared Level" + (currentLevel - 1) + "!!!", gameWidth / 2, gameHeight / 2 - 12);
    ctx.fillText("Press SPACEBAR To Play Next LEVEL. ", gameWidth / 2, gameHeight / 2 + 12);
    requestAnimationFrame(play); // gameStatus = GAMESTATE.PAUSED;
  } else if (blocks.length === 0 && currentLevel === Levels.length) {
    ctx.rect(0, 0, gameWidth, gameHeight);
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fill();
    ctx.font = "30px Arial";
    ctx.fillStyle = "green";
    ctx.textAlign = "center";
    ctx.fillText("YOU WON!!!", gameWidth / 2, gameHeight / 2);
    gameStatus = GAMESTATE.WON;
  } else if (blocks.length === 0) {
    currentLevel++;
    blocks = changeBlocks(currentLevel, gameWidth, gameHeight, Levels);
    gameStatus = GAMESTATE.LEVELCHANGE;
    paddle = new Paddle(gameHeight, gameWidth);
    ball = new Ball(gameHeight, gameWidth, paddle);
    ball.ballSpeed = {
      x: currentLevel - 1 + Math.abs(ball.ballSpeed.x),
      y: -(currentLevel - 1) - Math.abs(ball.ballSpeed.y)
    };
    requestAnimationFrame(play);
  } else requestAnimationFrame(play);
}

function play() {
  ctx.clearRect(0, 0, gameWidth, gameHeight);
  paddle.draw(ctx, 0);

  if (gameStatus === GAMESTATE.RUNNING && gameStatus !== GAMESTATE.PAUSED) {
    var tempLives = lives;
    lives = ball.draw(ctx, gameStatus, lives); // /* start */
    // // formula angle = 90 - 2 * ( x / L) * ( 90 - minimum angle)
    // if ((ball.ballY + ball.ballRadius >= gameHeight - paddle.paddleHeight - 2) &&
    //     (ball.ballX >= paddle.paddleStartX && ball.ballX <= paddle.paddleStartX + paddle.paddleWidth)) {
    //     let dist = paddle.paddleStartX + paddle.paddleWidth / 2 - ball.ballX;
    //     let angle = 90 - (dist / (paddle.paddleWidth)) * 120;  // minimum angle 30
    //     let magnitude = Math.sqrt(2 * (currentLevel + 1) ** 2)
    //     let X = magnitude * Math.cos(Math.ceil(90 - angle));
    //     let Y = magnitude * Math.sin(Math.ceil(90 - angle));
    //     ball.ballSpeed = { x: Math.ceil(X), y: -Math.ceil(Y) }
    //     console.log(angle, X, Y, ball.ballSpeed, ball.ballX, ball.ballY);
    // }
    // /*  end */

    if (lives !== tempLives) {
      gameStatus = GAMESTATE.PAUSED;
      ball.ballSpeed = {
        x: ball.ballSpeed.x,
        y: -ball.ballSpeed.y
      };
    }

    if (lives === 0) gameStatus = GAMESTATE.GAMEOVER;
  } else if (gameStatus === GAMESTATE.NOTSTARTED || gameStatus === GAMESTATE.PAUSED || GAMESTATE.LEVELCHANGE) ball.moveBall(ctx, paddle);

  blocks.forEach(function (block) {
    score = block.updateBroke(ctx, ball, score, currentLevel);
  });
  blocks = blocks.filter(function (block) {
    return !block.broke;
  });
  messageHandling();
}

requestAnimationFrame(play);
},{}],"../../../.npm/_npx/1621/lib/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "44639" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../.npm/_npx/1621/lib/node_modules/parcel/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/paddle_game.e31bb0bc.js.map