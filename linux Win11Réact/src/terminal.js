export const initialFiles = {
  "/": ["home", "etc", "var", "usr", "tmp"],
  "/home": ["eliottine"],
  "/home/eliottine": ["Desktop", "Documents", "Projects", "README.txt"],
  "/home/eliottine/Desktop": ["win11react-terminal.desktop"],
  "/home/eliottine/Documents": ["notes.md", "todo.txt"],
  "/home/eliottine/Projects": ["win11react"],
  "/home/eliottine/Projects/win11react": ["package.json", "src", "README.md"],
  "/home/eliottine/Projects/win11react/src": ["App.jsx", "main.jsx"],
  "/etc": ["hosts", "os-release"],
  "/var": ["log"],
  "/var/log": ["boot.log"],
  "/usr": ["bin"],
  "/usr/bin": ["node", "npm", "git", "bash"],
  "/tmp": []
};

export const fileContents = {
  "/home/eliottine/README.txt":
    "Bienvenue dans Linux Terminal pour Win11React.\nTape `help` pour voir les commandes disponibles.",
  "/home/eliottine/Documents/notes.md":
    "# Notes\n- Créer une interface style Windows 11\n- Simuler des commandes Linux\n- Publier le projet sur GitHub",
  "/home/eliottine/Documents/todo.txt": "install\nbuild\npush github\n",
  "/etc/os-release":
    'NAME="Win11React Linux Layer"\nVERSION="1.0"\nID=win11react-linux\n',
  "/etc/hosts": "127.0.0.1 localhost\n::1 localhost\n",
  "/var/log/boot.log": "[ OK ] Terminal Linux démarré dans Win11React\n",
  "/home/eliottine/Projects/win11react/package.json":
    '{\n  "name": "win11react-terminal",\n  "scripts": {\n    "dev": "vite"\n  }\n}\n',
  "/home/eliottine/Projects/win11react/README.md":
    "# Win11React Terminal\nUn terminal Linux simulé.\n",
  "/home/eliottine/Projects/win11react/src/App.jsx":
    "export default function App() {\n  return <Terminal />;\n}\n",
  "/home/eliottine/Projects/win11react/src/main.jsx": "import React from 'react';\n"
};

export const commands = [
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

export function normalizePath(currentPath, target = "") {
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

export function isDirectory(path, files) {
  return Object.prototype.hasOwnProperty.call(files, path);
}

export function isFile(path) {
  return Object.prototype.hasOwnProperty.call(fileContents, path);
}

export function basename(path) {
  return path.split("/").filter(Boolean).at(-1) || "/";
}

export function buildTree(path, files, depth = 0) {
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
