# Coderdex backend api

## setup

1. Install dependencies:

```bash
npm install
```

2. Add Pokemon images to `public/images/` directory with naming format: `{pokemon-name}.png`

   - Example: `bulbasaur.png`, `pikachu.png`, `charizard.png`

3. Start the server:

```bash
npm run dev  # Development mode with nodemon
npm start    # Production mode
```

## API endpoints

### Get All Pokemon

```
GET /pokemons
```

Query Parameters:

- `type` - Filter by Pokemon type (e.g., `fire`, `water`, `grass`)
- `search` - Search Pokemon by name (partial match)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Examples:**

```
GET /pokemons                           # Get all Pokemon (paginated)
GET /pokemons?type=fire                 # Get all Fire-type Pokemon
GET /pokemons?search=char               # Search Pokemon with "char" in name
GET /pokemons?type=fire&search=char     # Combined filters
GET /pokemons?page=2&limit=10           # Pagination
```

### Get Pokemon by ID

```
GET /pokemons/:id
```

**example:**

```
GET /pokemons/25  # Get Pikachu
```

### Get All Types

```
GET /types
```

Returns a list of all unique Pokemon types.

## Response Format

### Success Response

```json
{
  "data": [
    {
      "id": 1,
      "name": "bulbasaur",
      "types": ["Grass", "Poison"],
      "url": "/images/bulbasaur.png"
    }
  ],
  "total": 810,
  "page": 1,
  "totalPages": 41
}
```
