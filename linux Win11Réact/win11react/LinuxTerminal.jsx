import React, { useEffect, useMemo, useRef, useState } from "react";
import "./LinuxTerminal.scss";

const initialFiles = {
  "/": ["home", "etc", "var", "usr", "tmp"],
  "/home": ["win11react"],
  "/home/win11react": ["Desktop", "Documents", "Projects", "README.txt"],
  "/home/win11react/Desktop": ["linux-terminal.desktop"],
  "/home/win11react/Documents": ["notes.md", "todo.txt"],
  "/home/win11react/Projects": ["win11React"],
  "/home/win11react/Projects/win11React": ["package.json", "src", "README.md"],
  "/home/win11react/Projects/win11React/src": ["apps", "utils", "store"],
  "/etc": ["hosts", "os-release"],
  "/var": ["log"],
  "/var/log": ["boot.log"],
  "/usr": ["bin"],
  "/usr/bin": ["node", "npm", "git", "bash"],
  "/tmp": []
};

const fileContents = {
  "/home/win11react/README.txt":
    "Linux Terminal pour Win11React.\nTape `help` pour voir les commandes.",
  "/home/win11react/Documents/notes.md":
    "# Notes\n- App compatible BlueEdge Win11React\n- Ajouter l'entrée dans les apps\n- Lancer dans une fenêtre du bureau",
  "/home/win11react/Documents/todo.txt": "clone repo\nadd app\nopen terminal\n",
  "/etc/os-release":
    'NAME="Win11React Linux Layer"\nVERSION="1.0"\nID=win11react-linux\n',
  "/etc/hosts": "127.0.0.1 localhost\n::1 localhost\n",
  "/var/log/boot.log": "[ OK ] Linux Terminal loaded inside Win11React\n",
  "/home/win11react/Projects/win11React/package.json":
    '{\n  "name": "win11react",\n  "scripts": {\n    "start": "vite"\n  }\n}\n',
  "/home/win11react/Projects/win11React/README.md":
    "# Win11React\nWindows 11 desktop experience on the web.\n"
};

const commandNames = [
  "help",
  "clear",
  "pwd",
  "ls",
  "cd",
  "cat",
  "echo",
  "date",
  "whoami",
  "uname",
  "neofetch",
  "history",
  "touch",
  "mkdir",
  "rm",
  "tree",
  "git",
  "npm"
];

function normalizePath(currentPath, target = "") {
  if (!target || target === ".") return currentPath;
  const parts = target.startsWith("/")
    ? []
    : currentPath.split("/").filter(Boolean);

  target.split("/").forEach((part) => {
    if (!part || part === ".") return;
    if (part === "..") parts.pop();
    else parts.push(part);
  });

  return "/" + parts.join("/");
}

function isDirectory(path, files) {
  return Object.prototype.hasOwnProperty.call(files, path);
}

function isFile(path) {
  return Object.prototype.hasOwnProperty.call(fileContents, path);
}

function basename(path) {
  return path.split("/").filter(Boolean).at(-1) || "/";
}

function buildTree(path, files, depth = 0) {
  const entries = files[path] || [];
  const prefix = "  ".repeat(depth);
  const lines = depth === 0 ? [path] : [];

  entries.forEach((entry) => {
    const childPath = normalizePath(path, entry);
    lines.push(`${prefix}${depth > 0 ? "" : "  "}${entry}`);
    if (isDirectory(childPath, files) && depth < 4) {
      lines.push(...buildTree(childPath, files, depth + 1));
    }
  });

  return lines;
}

export default function LinuxTerminal() {
  const [path, setPath] = useState("/home/win11react");
  const [files, setFiles] = useState(initialFiles);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState([
    {
      type: "system",
      text: "Win11React Linux Terminal 1.0\nTape `help` pour commencer."
    }
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  const prompt = useMemo(() => `win11react@blueedge:${path}$`, [path]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    terminalRef.current?.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [lines]);

  function pushOutput(command, output, type = "output") {
    setLines((current) => [
      ...current,
      { type: "command", prompt, text: command },
      ...(output ? [{ type, text: output }] : [])
    ]);
  }

  function listDirectory(targetPath) {
    const entries = files[targetPath];
    if (!entries) return `ls: impossible d'accéder à '${targetPath}': Aucun dossier`;

    return entries
      .map((entry) => {
        const fullPath = normalizePath(targetPath, entry);
        return isDirectory(fullPath, files) ? `${entry}/` : entry;
      })
      .join("  ");
  }

  function runCommand(rawCommand) {
    const command = rawCommand.trim();
    if (!command) return;

    const [name, ...args] = command.split(/\s+/);
    setCommandHistory((current) => [...current, command]);
    setHistoryIndex(null);

    if (name === "clear") {
      setLines([]);
      return;
    }

    if (name === "help") {
      pushOutput(
        command,
        [
          "Commandes disponibles:",
          "help, clear, pwd, ls, cd, cat, echo, date, whoami, uname, neofetch",
          "history, touch, mkdir, rm, tree, git status, npm run start",
          "",
          "Touches: ↑ / ↓ pour l'historique, Tab pour compléter."
        ].join("\n")
      );
      return;
    }

    if (name === "pwd") {
      pushOutput(command, path);
      return;
    }

    if (name === "ls") {
      pushOutput(command, listDirectory(normalizePath(path, args[0] || ".")));
      return;
    }

    if (name === "cd") {
      const targetPath = normalizePath(path, args[0] || "/home/win11react");
      if (!isDirectory(targetPath, files)) {
        pushOutput(command, `cd: ${args[0] || targetPath}: Aucun dossier`, "error");
        return;
      }
      setLines((current) => [...current, { type: "command", prompt, text: command }]);
      setPath(targetPath);
      return;
    }

    if (name === "cat") {
      const targetPath = normalizePath(path, args[0]);
      pushOutput(
        command,
        args[0] && isFile(targetPath)
          ? fileContents[targetPath]
          : `cat: ${args[0] || ""}: Aucun fichier`,
        args[0] && isFile(targetPath) ? "output" : "error"
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
      pushOutput(command, "win11react");
      return;
    }

    if (name === "uname") {
      pushOutput(command, "Linux blueedge 6.7.0-win11react #1 SMP x86_64 GNU/Linux");
      return;
    }

    if (name === "neofetch") {
      pushOutput(
        command,
        [
          "       .--.        win11react@blueedge",
          "      |o_o |       OS: Win11React Linux Layer",
          "      |:_/ |       Project: blueedgetechno/win11React",
          "     //   \\ \\      Shell: bash-sim",
          "    (|     | )     Stack: React + SCSS",
          "   /'\\_   _/`\\     Kernel: simulated",
          "   \\___)=(___/"
        ].join("\n")
      );
      return;
    }

    if (name === "history") {
      pushOutput(
        command,
        commandHistory.map((item, index) => `${index + 1}  ${item}`).join("\n")
      );
      return;
    }

    if (name === "tree") {
      pushOutput(command, buildTree(normalizePath(path, args[0] || "."), files).join("\n"));
      return;
    }

    if (name === "mkdir") {
      const targetPath = normalizePath(path, args[0]);
      const parentPath = normalizePath(targetPath, "..");
      if (!args[0] || !isDirectory(parentPath, files)) {
        pushOutput(command, "mkdir: dossier parent introuvable", "error");
        return;
      }
      setFiles((current) => ({
        ...current,
        [parentPath]: [...new Set([...current[parentPath], basename(targetPath)])],
        [targetPath]: []
      }));
      pushOutput(command, "");
      return;
    }

    if (name === "touch") {
      const targetPath = normalizePath(path, args[0]);
      const parentPath = normalizePath(targetPath, "..");
      if (!args[0] || !isDirectory(parentPath, files)) {
        pushOutput(command, "touch: dossier parent introuvable", "error");
        return;
      }
      setFiles((current) => ({
        ...current,
        [parentPath]: [...new Set([...current[parentPath], basename(targetPath)])]
      }));
      pushOutput(command, "");
      return;
    }

    if (name === "rm") {
      const targetPath = normalizePath(path, args[0]);
      const parentPath = normalizePath(targetPath, "..");
      if (!args[0] || !files[parentPath]?.includes(basename(targetPath))) {
        pushOutput(command, `rm: ${args[0] || ""}: introuvable`, "error");
        return;
      }
      setFiles((current) => ({
        ...current,
        [parentPath]: current[parentPath].filter((item) => item !== basename(targetPath))
      }));
      pushOutput(command, "");
      return;
    }

    if (name === "git") {
      pushOutput(
        command,
        args[0] === "status"
          ? "Sur la branche master\nApp Linux Terminal prête à intégrer dans Win11React."
          : "git: simulation disponible: git status"
      );
      return;
    }

    if (name === "npm") {
      pushOutput(
        command,
        args.join(" ") === "run start"
          ? "VITE prêt sur http://localhost:3000/"
          : "npm: simulation disponible: npm run start"
      );
      return;
    }

    pushOutput(command, `${name}: commande introuvable`, "error");
  }

  function completeInput() {
    const [first, ...rest] = input.split(/\s+/);
    if (!rest.length) {
      const match = commandNames.find((command) => command.startsWith(first));
      if (match) setInput(match);
      return;
    }

    const partial = rest.at(-1) || "";
    const match = (files[path] || []).find((entry) => entry.startsWith(partial));
    if (match) setInput(`${first} ${rest.slice(0, -1).join(" ")} ${match}`.trim());
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      runCommand(input);
      setInput("");
    }

    if (event.key === "Tab") {
      event.preventDefault();
      completeInput();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex =
        historyIndex === null
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
      if (nextIndex >= 0) {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    }
  }

  return (
    <div
      className="linux-terminal-app"
      onClick={() => inputRef.current?.focus()}
      role="application"
      aria-label="Linux Terminal"
    >
      <div className="linux-terminal-app__screen" ref={terminalRef}>
        {lines.map((line, index) => (
          <div className={`linux-terminal-app__line is-${line.type}`} key={`${line.text}-${index}`}>
            {line.type === "command" ? (
              <>
                <span className="linux-terminal-app__prompt">{line.prompt}</span>
                <span>{line.text}</span>
              </>
            ) : (
              <pre>{line.text}</pre>
            )}
          </div>
        ))}

        <div className="linux-terminal-app__input-line">
          <span className="linux-terminal-app__prompt">{prompt}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck="false"
            autoComplete="off"
            aria-label="Commande Linux"
          />
        </div>
      </div>
    </div>
  );
}
