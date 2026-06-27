# Linux Terminal pour BlueEdge Win11React

Une app qui simule un terminal Linux pour le projet BlueEdge Win11React:

https://win11.blueedge.me/

Le repo officiel est ici:

https://github.com/blueedgetechno/win11React

J'ai inclus deux versions:

- `index.html` + `src/`: preview autonome qui s'ouvre directement dans un navigateur
- `win11react/`: composant React/SCSS à intégrer dans un fork de BlueEdge Win11React

## Fonctionnalités

- Terminal Linux simulé
- Commandes simulées: `help`, `ls`, `cd`, `pwd`, `cat`, `tree`, `mkdir`, `touch`, `rm`, `git status`, `npm run dev`
- Historique avec les touches `↑` et `↓`
- Autocomplétion simple avec `Tab`
- Mini système de fichiers en mémoire

## Tester la preview autonome

Option simple: ouvre directement `index.html` dans ton navigateur.

Option avec Vite:

```bash
npm install
npm run dev
```

Puis ouvre l'adresse affichée par Vite, souvent:

```text
http://127.0.0.1:5173/
```

## Intégrer dans Win11React

Lis:

```text
win11react/INTEGRATION.md
```

Les fichiers à intégrer sont:

```text
win11react/LinuxTerminal.jsx
win11react/LinuxTerminal.scss
```

## Publier sur GitHub

```bash
git init
git add .
git commit -m "Initial Linux terminal app"
git branch -M main
git remote add origin https://github.com/TON-PSEUDO/linux-win11-react-terminal.git
git push -u origin main
```
