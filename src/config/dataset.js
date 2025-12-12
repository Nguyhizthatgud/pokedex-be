import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadPokemonData = () => {
    const csvPath = path.resolve(process.cwd(), "pokemon.csv");

    if (!fs.existsSync(csvPath)) {
        console.error("pokemon.csv not found at:", csvPath);
        return [];
    }
    const csvData = fs.readFileSync(csvPath, "utf-8");

    const lines = csvData.trim().split("\n");
    const headers = lines[0].split(",");

    const pokemons = lines.slice(1).map((line, index) => {
        const values = line.split(",");
        const pokemonId = index + 1;
        const pokemon = {
            id: pokemonId,
            name: values[0].toLowerCase().trim(),
            types: [values[1].trim()],
            url: `/images/pokemon/${values[0].toLowerCase().trim()}.png`
        };

        // Add Type2 if exists
        if (values[2] && values[2].trim()) {
            pokemon.types.push(values[2].trim());
        }

        return pokemon;
    });

    return pokemons;
};
