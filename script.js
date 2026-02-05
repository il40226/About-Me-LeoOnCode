// Command portal behavior: typed terminal lines and button-to-command mapping
const LINES = document.getElementById('lines');
const PROMPT = document.getElementById('prompt');
const cursor = document.getElementById('cursor');

const links = {
  'open-yt': 'https://www.youtube.com/@Frostsonscripts',
  'open-games': 'https://sites.google.com/students.mcpasd.k12.wi.us/kromeryunbl0ked/home?authuser=0',
  'open-doc': 'https://docs.google.com/document/d/1Xz_cLd-elIEiJySCcBvk6i-nl41usZW2hxCHF0YjgS4/edit?tab=t.u5oai76irguf'
};

let busy = false;

function appendLine(text, cls){
  const div = document.createElement('div');
  div.className = 'line' + (cls ? ' ' + cls : '');
  div.textContent = text;
  LINES.appendChild(div);
  LINES.scrollTop = LINES.scrollHeight;
}

// simple type effect, returns a promise
function typeText(targetEl, text, speed = 30){
  return new Promise(resolve => {
    let i = 0;
    const interval = setInterval(() => {
      targetEl.textContent = text.slice(0, ++i);
      if (i >= text.length) {
        clearInterval(interval);
        setTimeout(resolve, 220);
      }
    }, speed);
  });
}

// run a command name (typed effect + action)
async function runCommand(cmd){
  if(busy) return;
  busy = true;
  const promptNode = document.createElement('div');
  promptNode.className = 'line';
  const user = 'frostson@macbook:~$ ';
  LINES.appendChild(promptNode);
  LINES.scrollTop = LINES.scrollHeight;

  // show typing in-place
  await typeText(promptNode, user + cmd, 30);

  // small simulated output
  if(cmd === 'help'){
    appendLine('Commands: open-yt, open-games, open-doc, help', 'dim');
  } else if (links[cmd]){
    appendLine('Opening ' + cmd + ' ...', 'dim');
    // slight delay so user sees the typed command
    setTimeout(() => {
      window.open(links[cmd], '_blank', 'noopener,noreferrer');
    }, 450);
  } else {
    appendLine('Command not found: ' + cmd, 'dim');
  }

  LINES.scrollTop = LINES.scrollHeight;
  busy = false;
}

// wire up top action buttons
document.getElementById('openYT').addEventListener('click', ()=>runCommand('open-yt'));
document.getElementById('openGames').addEventListener('click', ()=>runCommand('open-games'));
document.getElementById('openDoc').addEventListener('click', ()=>runCommand('open-doc'));

// wire up command bar buttons
document.querySelectorAll('.cmd').forEach(b=>{
  b.addEventListener('click', e=>{
    const cmd = e.currentTarget.dataset.cmd;
    runCommand(cmd);
  });
});

// allow keyboard input for quick commands (basic)
window.addEventListener('keydown', (e) => {
  if (e.key === '1') runCommand('open-yt');
  if (e.key === '2') runCommand('open-games');
  if (e.key === '3') runCommand('open-doc');
  if (e.key === 'h') runCommand('help');
});

// initial welcome messages
appendLine('> frostson@macbook — Command Portal ready');
appendLine('> Press 1 (YouTube), 2 (Unblocked), 3 (Doc) or click a button above', 'dim');
