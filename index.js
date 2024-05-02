const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/search', async (req, res) => {
    const cardName = req.body.cardName;
    try {
        const url = `https://api.scryfall.com/cards/search?q=%21%22${encodeURIComponent(cardName)}%22+include%3Aextras&order=released&unique=prints`;
        const apiResponse = await axios.get(url);
        const cards = apiResponse.data.data;
        const detailedCards = cards.map(card => {
            return {
                setName: card.set_name,
                setUri: card.set_uri,
                releasedAt: card.released_at,
                lang: card.lang,
                uri: card.uri,
                imageUrl: card.image_uris ? card.image_uris.normal : 'No image available',
                rarity: card.rarity
            };
        });
        res.json({ cards: detailedCards });
    } catch (error) {
        console.error("Error fetching card data", error);
        res.status(500).json({ message: 'Error fetching card data', error });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
