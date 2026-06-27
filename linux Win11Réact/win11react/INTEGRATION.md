# Intégration dans BlueEdge Win11React

Ce dossier contient une version React/SCSS du terminal à copier dans le projet officiel:

https://github.com/blueedgetechno/win11React

Le dépôt officiel est archivé, donc l'approche normale est de le forker, puis d'ajouter cette app dans ton fork.

## Fichiers à copier

Copie ces deux fichiers dans le repo `win11React`:

```text
src/apps/linux-terminal/LinuxTerminal.jsx
src/apps/linux-terminal/LinuxTerminal.scss
```

Tu peux garder les noms du dossier et du composant.

## Déclarer l'application

Win11React a déjà un système d'apps/fenêtres. Cherche dans ton fork les fichiers qui déclarent les apps existantes avec:

```bash
rg "Terminal|Calculator|Notepad|Vscode|File Explorer" src
```

Ajoute une entrée similaire à celle des apps existantes, par exemple:

```js
import LinuxTerminal from "./apps/linux-terminal/LinuxTerminal";

{
  id: "linux-terminal",
  name: "Linux Terminal",
  icon: "terminal",
  component: LinuxTerminal,
  width: 760,
  height: 480
}
```

Le nom exact des champs peut varier selon l'endroit où ton fork déclare les apps. Copie la forme d'une app déjà présente, puis remplace seulement le nom, l'icône, la taille et le composant.

## Lancer

Dans le repo Win11React:

```bash
npm install
npm run start
```

Ensuite ouvre le menu démarrer de Win11React et lance `Linux Terminal`.
