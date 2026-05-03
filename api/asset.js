export default async function handler(req, res) {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: 'missing fields' });
    }
    const supabaseBaseUrl = "https://dgngxyqbtecqudhqlogp.supabase.co/storage/v1/object/public/game-assets";
    try {
        const thumbUrl = `${supabaseBaseUrl}/thumbnails/${id}.png`;
        const response = await fetch(thumbUrl);
        if (response.ok) {
            const buffer = await response.arrayBuffer();
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Content-Disposition', `attachment; filename="asset_${id}.png"`);
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            return res.send(Buffer.from(buffer));
        }
        const rbxlUrl = `${supabaseBaseUrl}/places/${id}.rbxl`;
        const rbxlResponse = await fetch(rbxlUrl);
        if (rbxlResponse.ok) {
            const buffer = await rbxlResponse.arrayBuffer();
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="game_${id}.rbxl"`);
            return res.send(Buffer.from(buffer));
        }
        return res.status(404).json({ error: 'could not fetch' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
