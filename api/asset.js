export default async function handler(req, res) {
    const { id, type } = req.query; //just type

    if (!id) {
        return res.status(400).json({ error: 'id required' });
    }

    const supabaseBaseUrl = "https://dgngxyqbtecqudhqlogp.supabase.co/storage/v1/object/public/game-assets";

    try {
        if (type === 'place') {
            const rbxlUrl = `${supabaseBaseUrl}/places/${id}.rbxl`;
            const response = await fetch(rbxlUrl);
            
            if (response.ok) {
                const buffer = await response.arrayBuffer();
                res.setHeader('Content-Type', 'application/octet-stream');
                res.setHeader('Content-Disposition', `attachment; filename="place_${id}.rbxl"`);
                return res.send(Buffer.from(buffer));
            }
        }

        const thumbUrl = `${supabaseBaseUrl}/thumbnails/${id}.png`;
        const thumbResponse = await fetch(thumbUrl);

        if (thumbResponse.ok) {
            const buffer = await thumbResponse.arrayBuffer();
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            return res.send(Buffer.from(buffer));
        }

        if (!type) {
            const rbxlUrl = `${supabaseBaseUrl}/places/${id}.rbxl`;
            const rbxlResponse = await fetch(rbxlUrl);
            if (rbxlResponse.ok) {
                const buffer = await rbxlResponse.arrayBuffer();
                res.setHeader('Content-Type', 'application/octet-stream');
                return res.send(Buffer.from(buffer));
            }
        }

        return res.status(404).json({ error: 'could not fetch' });

    } catch (error) {
        console.error("Asset Delivery Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
