import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { loadPokemonData } from "./config/dataset.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors({
    // origin: 'https://your-netlify-site.netlify.app',
    origin: 'https://jinglingbao.netlify.app/',
    credentials: true
}));
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public/images")));

// get Pokemon data
let pokemonData = [];
try {
    pokemonData = loadPokemonData();
    console.log(`Loaded ${pokemonData.length} Pokemon`);
} catch (error) {
    console.error("Error loading Pokemon data:", error);
}

// api routes - get all pokemon with opt filters
app.get("/pokemons", (req, res) => {
    try {
        const { type, search, page = 1, limit = 20 } = req.query;
        let filteredPokemons = [...pokemonData];

        // Filter by type (case-insensitive)
        if (type) {
            const typeFilter = type.toLowerCase();
            filteredPokemons = filteredPokemons.filter((pokemon) =>
                pokemon.types.some((t) => t.toLowerCase() === typeFilter)
            );
        }

        // search by name 
        if (search) {
            const searchTerm = search.toLowerCase();
            filteredPokemons = filteredPokemons.filter((pokemon) =>
                pokemon.name.toLowerCase().includes(searchTerm)
            );
        }

        // pagination 
        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const endIndex = startIndex + parseInt(limit);
        const paginatedPokemons = filteredPokemons.slice(startIndex, endIndex);

        res.json({
            data: paginatedPokemons,
            total: filteredPokemons.length,
            page: parseInt(page),
            totalPages: Math.ceil(filteredPokemons.length / parseInt(limit)),
        });
    } catch (error) {
        res.status(500).json({ error: "Server error", message: error.message });
    }
});

// api routes - get a single pokemon by id with previous and next pokemon
app.get("/pokemons/:id", (req, res) => {
    try {
        const { id } = req.params;
        const pokemonId = parseInt(id);
        const currentIndex = pokemonData.findIndex((p) => p.id === pokemonId);

        if (currentIndex === -1) {
            return res.status(404).json({ error: "Pokemon not found" });
        }

        const pokemon = pokemonData[currentIndex];
        const previousPokemon = currentIndex > 0 ? pokemonData[currentIndex - 1] : null;
        const nextPokemon = currentIndex < pokemonData.length - 1 ? pokemonData[currentIndex + 1] : null;

        res.json({
            pokemon,
            previousPokemon,
            nextPokemon
        });
    } catch (error) {
        res.status(500).json({ error: "Server error", message: error.message });
    }
});

// api routes - get all pokemon types
app.get("/types", (req, res) => {
    try {
        const typesSet = new Set();
        pokemonData.forEach((pokemon) => {
            pokemon.types.forEach((type) => typesSet.add(type));
        });

        const types = Array.from(typesSet).sort();
        res.json({ types });
    } catch (error) {
        res.status(500).json({ error: "Server error", message: error.message });
    }
});

// root route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Pokedex API",
        endpoints: {
            allPokemons: "/pokemons",
            pokemonById: "/pokemons/:id (includes previous and next pokemon)",
            searchByName: "/pokemons?search=pikachu",
            filterByType: "/pokemons?type=fire",
            combined: "/pokemons?type=fire&search=char",
            types: "/types",
        },
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
