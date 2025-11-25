# Pokémon Explorer

Aplikacja stworzona w ramach zadania rekrutacyjnego **Wave Frontend Dev 2025**.  
Pozwala przeglądać Pokémony, filtrować je po typach, wyszukiwać oraz wyświetlać szczegóły (ewolucje, lokacje, sprite’y).

---

##  Technologie

- Vue 3  
- Tailwind CSS  
- Naive UI  
- Vite  
- PokeAPI  
- @vueuse/head  

---


##  Instalacja i uruchomienie

### 1. Klonowanie
```bash
git clone <link-do-repo>
cd <folder>
```

### 2. Instalacja zależności
```bash
npm install
```

### 3. Uruchomienie dev servera
```bash
npm run dev
```

Aplikacja uruchomi się pod adresem:

```
http://localhost:5173
```

### 4. Build produkcyjny
```bash
npm run build
```

---


##  Naive UI — konfiguracja

Plik `main.js`:

```js
import { createApp } from 'vue'
import App from './App.vue'
import naive from 'naive-ui'
import { createHead } from '@vueuse/head'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import './style.css'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes
})

app.use(naive)
app.use(router)
app.use(createHead())

app.mount('#app')
```

---

## Stylowanie

- TailwindCSS  
- Kolory typów zgodne z PokeAPI  
- Search bar dopasowany do makiety  
- Responsywny układ kart  
