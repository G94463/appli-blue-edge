import {
  basename,
  buildTree,
  commands,
  fileContents,
  initialFiles,
  isDirectory,
  isFile,
  normalizePath
} from "./terminal.js";

const state = {
  path: "/home/eliottine",
  files: structuredClone(initialFiles),
  lines: [
    {
      type: "system",
      text: "Win11React Linux Terminal 1.0\nTape `help` pour commencer."
    }
  ],
  commandHistory: [],
  historyIndex: null
};

const app = document.getElementById("root");

app.innerHTML = `
  <main class="desktop">
    <section class="terminal-window" aria-label="Terminal Linux Win11React">
      <header class="titlebar">
        <div class="window-title">
          <span class="icon" aria-hidden="true">▣</span>
          <span>Linux Terminal</span>
        </div>
        <div class="window-actions" aria-label="Actions fenêtre">
          <button aria-label="Réduire">−</button>
          <button aria-label="Agrandir">□</button>
          <button aria-label="Fermer" class="close">×</button>
        </div>
      </header>

      <div class="toolbar">
        <div class="tab active">
          <span class="icon" aria-hidden="true">▣</span>
          bash
        </div>
        <button title="Chercher" aria-label="Chercher">⌕</button>
        <button title="Dossiers" aria-label="Dossiers">▤</button>
      </div>

      <div class="terminal" id="terminal" tabindex="-1">
        <div id="history"></div>
        <div class="input-line">
          <span class="prompt" id="prompt"></span>
          <input
            id="command-input"
            aria-label="Commande terminal"
            spellcheck="false"
            autocomplete="off"
          />
        </div>
      </div>
    </section>

    <aside class="status-panel" aria-label="État système">
      <div class="status-item">
        <span class="icon" aria-hidden="true">▥</span>
        <span>WSL layer</span>
        <strong>Actif</strong>
      </div>
      <div class="status-item">
        <span class="icon" aria-hidden="true">⌘</span>
        <span>GitHub</span>
        <strong>Ready</strong>
      </div>
      <div class="status-item">
        <span class="icon" aria-hidden="true">⏻</span>
        <span>Session</span>
        <strong id="clock"></strong>
      </div>
    </aside>
  </main>
`;

const terminal = document.getElementById("terminal");
const historyNode = document.getElementById("history");
const input = document.getElementById("command-input");
const promptNode = document.getElementById("prompt");
const clock = document.getElementById("clock");

function prompt() {
  return `eliottine@win11react:${state.path}$`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function render() {
  promptNode.textContent = prompt();
  historyNode.innerHTML = state.lines
    .map((line) => {
      if (line.type === "command") {
        return `<div class="terminal-line command"><span class="prompt">${escapeHtml(
          line.prompt
        )}</span><span class="command-text">${escapeHtml(line.text)}</span></div>`;
      }

      return `<div class="terminal-line ${line.type}"><pre>${escapeHtml(
        line.text
      )}</pre></div>`;
    })
    .join("");

  terminal.scrollTo({
    top: terminal.scrollHeight,
    behavior: "smooth"
  });
}

function pushOutput(command, output, kind = "output") {
  state.lines.push({ type: "command", prompt: prompt(), text: command });
  if (output) state.lines.push({ type: kind, text: output });
  render();
}

function listDirectory(targetPath) {
  const entries = state.files[targetPath];
  if (!entries) return `ls: impossible d'accéder à '${targetPath}': Aucun dossier`;

  return entries
    .map((entry) => {
      const fullPath = normalizePath(targetPath, entry);
      return isDirectory(fullPath, state.files) ? `${entry}/` : entry;
    })
    .join("  ");
}

function runCommand(rawCommand) {
  const command = rawCommand.trim();
  if (!command) return;

  const [name, ...args] = command.split(/\s+/);
  state.commandHistory.push(command);
  state.historyIndex = null;

  if (name === "clear") {
    state.lines = [];
    render();
    return;
  }

  if (name === "help") {
    pushOutput(
      command,
      [
        "Commandes disponibles:",
        "help, clear, pwd, ls, cd, cat, echo, date, whoami, uname, neofetch",
        "history, touch, mkdir, rm, tree, git status, npm run dev",
        "",
        "Astuce: utilise ↑ / ↓ pour l'historique et Tab pour compléter."
      ].join("\n")
    );
    return;
  }

  if (name === "pwd") {
    pushOutput(command, state.path);
    return;
  }

  if (name === "ls") {
    pushOutput(command, listDirectory(normalizePath(state.path, args[0] || ".")));
    return;
  }

  if (name === "cd") {
    const targetPath = normalizePath(state.path, args[0] || "/home/eliottine");
    if (!isDirectory(targetPath, state.files)) {
      pushOutput(command, `cd: ${args[0] || targetPath}: Aucun dossier`, "error");
      return;
    }
    state.lines.push({ type: "command", prompt: prompt(), text: command });
    state.path = targetPath;
    render();
    return;
  }

  if (name === "cat") {
    if (!args[0]) {
      pushOutput(command, "cat: indique un fichier", "error");
      return;
    }
    const targetPath = normalizePath(state.path, args[0]);
    pushOutput(
      command,
      isFile(targetPath)
        ? fileContents[targetPath]
        : `cat: ${args[0]}: Aucun fichier`,
      isFile(targetPath) ? "output" : "error"
    );
    return;
  }

  if (name === "echo") {
    pushOutput(command, args.join(" "));
    return;
  }

  if (name === "date") {
    pushOutput(command, new Date().toString());
    return;
  }

  if (name === "whoami") {
    pushOutput(command, "eliottine");
    return;
  }

  if (name === "uname") {
    pushOutput(command, "Linux win11react 6.7.0-static #1 SMP x86_64 GNU/Linux");
    return;
  }

  if (name === "neofetch") {
    pushOutput(
      command,
      [
        "       .--.        eliottine@win11react",
        "      |o_o |       OS: Win11React Linux Layer",
        "      |:_/ |       Shell: bash-sim",
        "     //   \\ \\      UI: HTML + CSS + JS",
        "    (|     | )     Theme: Fluent terminal",
        "   /'\\_   _/`\\     Kernel: simulated",
        "   \\___)=(___/"
      ].join("\n")
    );
    return;
  }

  if (name === "history") {
    pushOutput(
      command,
      state.commandHistory.map((item, index) => `${index + 1}  ${item}`).join("\n")
    );
    return;
  }

  if (name === "tree") {
    const targetPath = normalizePath(state.path, args[0] || ".");
    pushOutput(command, buildTree(targetPath, state.files).join("\n"));
    return;
  }

  if (name === "mkdir") {
    if (!args[0]) {
      pushOutput(command, "mkdir: indique un nom de dossier", "error");
      return;
    }
    const targetPath = normalizePath(state.path, args[0]);
    const parentPath = normalizePath(targetPath, "..");
    if (!isDirectory(parentPath, state.files)) {
      pushOutput(command, "mkdir: dossier parent introuvable", "error");
      return;
    }
    state.files[parentPath] = [...new Set([...state.files[parentPath], basename(targetPath)])];
    state.files[targetPath] = [];
    pushOutput(command, "");
    return;
  }

  if (name === "touch") {
    if (!args[0]) {
      pushOutput(command, "touch: indique un nom de fichier", "error");
      return;
    }
    const targetPath = normalizePath(state.path, args[0]);
    const parentPath = normalizePath(targetPath, "..");
    if (!isDirectory(parentPath, state.files)) {
      pushOutput(command, "touch: dossier parent introuvable", "error");
      return;
    }
    state.files[parentPath] = [...new Set([...state.files[parentPath], basename(targetPath)])];
    pushOutput(command, "");
    return;
  }

  if (name === "rm") {
    if (!args[0]) {
      pushOutput(command, "rm: indique un fichier ou dossier", "error");
      return;
    }
    const targetPath = normalizePath(state.path, args[0]);
    const parentPath = normalizePath(targetPath, "..");
    if (!state.files[parentPath]?.includes(basename(targetPath))) {
      pushOutput(command, `rm: ${args[0]}: introuvable`, "error");
      return;
    }
    state.files[parentPath] = state.files[parentPath].filter(
      (item) => item !== basename(targetPath)
    );
    pushOutput(command, "");
    return;
  }

  if (name === "git") {
    pushOutput(
      command,
      args[0] === "status"
        ? "Sur la branche main\nRien à valider, la copie de travail est propre."
        : "git: simulation disponible: git status"
    );
    return;
  }

  if (name === "npm") {
    pushOutput(
      command,
      args.join(" ") === "run dev"
        ? "VITE prêt sur http://127.0.0.1:5173/"
        : "npm: simulation disponible: npm run dev"
    );
    return;
  }

  pushOutput(command, `${name}: commande introuvable`, "error");
}

function completeInput() {
  const [first, ...rest] = input.value.split(/\s+/);
  if (!rest.length) {
    const match = commands.find((command) => command.startsWith(first));
    if (match) input.value = match;
    return;
  }

  const partial = rest.at(-1) || "";
  const match = (state.files[state.path] || []).find((entry) => entry.startsWith(partial));
  if (match) input.value = `${first} ${rest.slice(0, -1).join(" ")} ${match}`.trim();
}

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    runCommand(input.value);
    input.value = "";
  }

  if (event.key === "Tab") {
    event.preventDefault();
    completeInput();
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    const nextIndex =
      state.historyIndex === null
        ? state.commandHistory.length - 1
        : Math.max(0, state.historyIndex - 1);
    if (nextIndex >= 0) {
      state.historyIndex = nextIndex;
      input.value = state.commandHistory[nextIndex];
    }
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    if (state.historyIndex === null) return;
    const nextIndex = state.historyIndex + 1;
    if (nextIndex >= state.commandHistory.length) {
      state.historyIndex = null;
      input.value = "";
    } else {
      state.historyIndex = nextIndex;
      input.value = state.commandHistory[nextIndex];
    }
  }
});

terminal.addEventListener("click", () => input.focus());

setInterval(() => {
  clock.textContent = new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}, 1000);

render();
input.focus();
