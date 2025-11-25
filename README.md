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

##  Funkcje aplikacji

### ✔ Lista Pokémonów
- Miniaturka  
- Nazwa  
- Formatowany numer (#001)  
- Typy w formie pill  
- Tło zależne od typu (gradient przy 2 typach)

### ✔ Filtrowanie po typach
- Wszystkie oficjalne typy  
- Możliwość wybrania wielu typów jednocześnie  
- Aktywne typy wyróżnione białym ringiem  

### ✔ Wyszukiwanie
- Pole wyszukiwania z debounce (250 ms)  
- Przycisk „✕” do czyszczenia  
- Styl zgodny z designem  

### ✔ Szczegóły Pokémona (modal)
Zawiera:
- Sprite’y (default/shiny/back)
- Typy
- Ewolucje (parsowane z evolution chain)
- Lokacje (pierwsze 12 wyników)

Modal używa teleport → zawsze pojawia się na środku ekranu.

### ✔ Ładowanie kolejnych wyników
- Przycisk **Load more**
- Pobiera kolejne 12 Pokémonów

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

## 📁 Struktura projektu

```
src/
 ├─ components/
 │   └─ PokemonExplorer.vue
 ├─ App.vue
 ├─ main.js
 ├─ routes.js
 └─ style.css
```

---

## 🔧 Naive UI — konfiguracja

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

---

## Wymagania zadania — status

| Wymaganie | Status |
|----------|--------|
| Lista Pokémonów | ✔ |
| Kolorowe tła kart | ✔ |
| Filtry typów | ✔ |
| Multi-select filtrów | ✔ |
| Search bar + debounce | ✔ |
| Modal ze szczegółami | ✔ |
| Load More | ✔ |
| Tailwind CSS | ✔ |
| Biblioteka komponentów | ✔ Naive UI |
| Responsywność | ✔ |
| Czytelny kod | ✔ |

---

## 🌐 Deployment (opcjonalnie)
Aplikację można udostępnić na:
- GitHub Pages  
- Netlify  
- Vercel  

---
