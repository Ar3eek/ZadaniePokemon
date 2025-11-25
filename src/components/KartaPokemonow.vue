<script>
export default {
  name: 'PokemonExplorerFixed',
  data() {
    return {
      searchInput: '',
      search: '',
      searchTimer: null,

      selectedTypes: [],
      pokemony: [],
      limit: 12,
      offset: 0,

      types: [
        'normal','fire','water','electric','grass','ice','fighting','poison','ground',
        'flying','psychic','bug','rock','ghost','dragon','dark','steel','fairy'
      ],

      typeColors: {
        normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
        grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
        ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
        rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
        steel: '#B7B7CE', fairy: '#D685AD'
      },

      modalOpen: false,
      modalPokemon: {},
      modalSprites: {},
      evolutions: [],
      locations: [],

      placeholderImage: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png'
    }
  },
  computed: {
    pokemonyFiltrowane() {
      const q = (this.search || '').toLowerCase()
      return this.pokemony
          .filter(p => p.name.includes(q))
          .filter(p => {
            if (this.selectedTypes.length === 0) return true
            return p.types.some(t => this.selectedTypes.includes(t))
          })
    }
  },
  methods: {
    formatId(id) {
      try {
        return String(id).padStart(3, '0')
      } catch (e) {
        return id
      }
    },
    onSearchInput() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.search = this.searchInput
        console.log('search set to:', this.search)
      }, 250)
    },
    clearSearch() {
      this.searchInput = ''
      this.search = ''
    },
    toggleType(type) {
      if (this.selectedTypes.includes(type)) {
        this.selectedTypes = this.selectedTypes.filter(t => t !== type)
      } else {
        this.selectedTypes.push(type)
      }
      console.log('selectedTypes:', this.selectedTypes)
    },
    cardStyle(pokemon) {
      if (!pokemon || !pokemon.types || pokemon.types.length === 0) return { backgroundColor: '#666' }
      if (pokemon.types.length === 1) {
        return { backgroundColor: this.typeColors[pokemon.types[0]] || '#888' }
      }
      const a = this.typeColors[pokemon.types[0]] || '#888'
      const b = this.typeColors[pokemon.types[1]] || '#666'
      return { background: `linear-gradient(135deg, ${a}, ${b})` }
    },

    async wiecejPokemonow() {
      console.log('fetching pokemon list offset=', this.offset)
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${this.limit}&offset=${this.offset}`)
        if (!res.ok) throw new Error('Network response not ok: ' + res.status)
        const data = await res.json()
        console.log('fetched list length:', Array.isArray(data.results) ? data.results.length : 0)

        const lista = await Promise.all(
            data.results.map(async item => {
              try {
                const r = await fetch(item.url)
                if (!r.ok) throw new Error('detail fetch not ok: ' + r.status)
                const d = await r.json()
                return {
                  id: d.id,
                  name: d.name,
                  image: d.sprites?.front_default || '',
                  types: d.types.map(t => t.type.name)
                }
              } catch (err) {
                console.error('item fetch error', err)
                return null
              }
            })
        )
        const valid = lista.filter(Boolean)
        this.pokemony = [...this.pokemony, ...valid]
        this.offset += this.limit
        console.log('pokemony length now:', this.pokemony.length)
      } catch (e) {
        console.error('Fetch error in wiecejPokemonow:', e)
      }
    },

    async openModal(pokemon) {
      console.log('openModal', pokemon && pokemon.name)
      if (!pokemon) return
      this.modalPokemon = pokemon
      this.modalOpen = true
      this.modalSprites = {}
      this.evolutions = []
      this.locations = []

      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`)
        if (!res.ok) throw new Error('detail fetch not ok: ' + res.status)
        const data = await res.json()
        this.modalSprites = data.sprites || {}

        if (data.species && data.species.url) {
          const sp = await fetch(data.species.url)
          if (sp.ok) {
            const spData = await sp.json()
            if (spData.evolution_chain && spData.evolution_chain.url) {
              const ev = await fetch(spData.evolution_chain.url)
              if (ev.ok) {
                const evData = await ev.json()
                this.evolutions = this.parseEvolutions(evData.chain)
              }
            }
          }
        }

        const loc = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}/encounters`)
        if (loc.ok) {
          const locData = await loc.json()
          this.locations = Array.isArray(locData) ? locData.slice(0, 12) : []
        }
      } catch (e) {
        console.error('openModal fetch error:', e)
      }
    },

    closeModal() {
      this.modalOpen = false
      this.modalPokemon = {}
      this.modalSprites = {}
      this.evolutions = []
      this.locations = []
    },

    parseEvolutions(chain) {
      const list = []
      function walk(node) {
        if (!node) return
        if (node.species && node.species.name) list.push(node.species.name)
        if (node.evolves_to && node.evolves_to.length) {
          node.evolves_to.forEach(child => walk(child))
        }
      }
      walk(chain)
      return Array.from(new Set(list))
    }
  },
  mounted() {
    console.log('PokemonExplorer mounted')
    this.wiecejPokemonow()
  }
}
</script>
<template>
  <div class="min-h-screen bg-[#0e0e0e] text-white">
    <div class="max-w-6xl mx-auto p-6">
      <div class="text-center mb-6">
        <div class="flex items-center justify-center gap-3">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
               alt="pokeball" class="w-8 h-8" />
          <h1 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Pokémon Explorer
          </h1>
        </div>
        <div class="mt-4 flex justify-center">
          <div class="relative w-3/5 max-w-2xl">
            <input
                v-model="searchInput"
                @input="onSearchInput"
                type="text"
                placeholder="Search Pokémon..."
                class="w-full p-3 rounded-full bg-[#161616] text-gray-100 placeholder:text-gray-400
                     border border-transparent focus:border-white focus:ring-2 focus:ring-white outline-none transition"
            />
            <button
                v-if="searchInput"
                @click="clearSearch"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
                type="button"
            >✕</button>
          </div>
        </div>
        <div class="mt-4 flex justify-center">
          <div class="flex gap-2 flex-wrap items-center">
            <button
                v-for="type in types"
                :key="type"
                @click="toggleType(type)"
                :style="{ backgroundColor: typeColors[type] }"
                class="px-3 py-1 rounded-full text-sm text-white transition cursor-pointer"
                :class="selectedTypes.includes(type) ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0e0e0e]' : ''"
            >
              <span class="capitalize">{{ type }}</span>
            </button>
          </div>
        </div>
      </div>
      <main>
        <section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div
              v-for="p in pokemonyFiltrowane"
              :key="p.id"
              class="rounded-lg p-6 text-center cursor-pointer transform transition hover:scale-105"
              :style="cardStyle(p)"
              @click="openModal(p)"
          >
            <img :src="p.image || placeholderImage" alt="" class="mx-auto w-24 h-24 mb-3" />
            <div class="font-semibold text-lg capitalize">{{ p.name }}</div>
            <div class="text-xs opacity-80 mt-1 mb-3">#{{ formatId(p.id) }}</div>
            <div class="flex justify-center gap-2">
              <span
                  v-for="t in p.types"
                  :key="t"
                  class="text-xs px-3 py-1 rounded-full bg-white/20 capitalize"
              >
                {{ t }}
              </span>
            </div>
          </div>
        </section>

        <div class="flex justify-center mt-8">
          <button @click="wiecejPokemonow" class="px-4 py-2 rounded-md bg-blue-600 text-white">Load more</button>
        </div>
      </main>
    </div>
    <teleport to="body">
      <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/60" @click="closeModal"></div>

        <div class="relative bg-white text-black rounded-lg max-w-2xl w-11/12 p-4 z-10">
          <div class="flex justify-between items-start">
            <h3 class="text-2xl font-bold capitalize">{{ modalPokemon.name }}</h3>
            <button @click="closeModal" class="ml-4 text-xl">✕</button>
          </div>

          <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <img :src="modalSprites.front_default || modalPokemon.image || placeholderImage" class="mx-auto mb-3 w-32 h-32" />
              <div class="flex gap-2 justify-center flex-wrap text-xs">
                <img v-if="modalSprites.back_default" :src="modalSprites.back_default" class="w-16 h-16" />
                <img v-if="modalSprites.front_shiny" :src="modalSprites.front_shiny" class="w-16 h-16" />
                <img v-if="modalSprites.back_shiny" :src="modalSprites.back_shiny" class="w-16 h-16" />
              </div>
            </div>

            <div>
              <div class="mb-3">
                <strong>Typy:</strong>
                <div class="mt-2">
                  <span v-for="t in modalPokemon.types" :key="t" class="px-3 py-1 rounded-full bg-gray-200 mr-2 capitalize text-xs">
                    {{ t }}
                  </span>
                </div>
              </div>

              <div class="mb-3">
                <strong>Ewolucje:</strong>
                <ul class="text-sm list-inside list-disc ml-4">
                  <li v-for="e in evolutions" :key="e" class="capitalize">{{ e }}</li>
                </ul>
              </div>

              <div>
                <strong>Lokacje:</strong>
                <ul class="text-sm list-inside list-disc ml-4">
                  <li v-for="l in locations" :key="l.location_area?.name" class="capitalize">
                    {{ (l.location_area?.name || '').replace('-', ' ') }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="mt-6 text-right">
            <button class="px-4 py-2 rounded bg-gray-200" @click="closeModal">Zamknij</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<style scoped>

</style>
