// File: api/generateKeys.js
// API untuk generate keys baru dengan HWID support

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: "Method tidak diizinkan"
        });
    }
    
    try {
        const { password, amount } = req.body;
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Whoamidev1819";
        
        // Validasi password admin
        if (password !== ADMIN_PASSWORD) {
            return res.status(401).json({
                error: "Password admin salah"
            });
        }
        
        // Validasi jumlah keys
        const keyAmount = parseInt(amount) || 1;
        if (keyAmount < 1 || keyAmount > 20) {
            return res.status(400).json({
                error: "Jumlah keys harus antara 1-20"
            });
        }
        
        // Generate random keys
        const generatedKeys = [];
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        
        for (let i = 0; i < keyAmount; i++) {
            let key = 'WRP-'; // Prefix untuk WarpahVip
            
            // Generate 3 segmen masing-masing 4 karakter
            for (let seg = 0; seg < 3; seg++) {
                for (let char = 0; char < 4; char++) {
                    key += characters.charAt(Math.floor(Math.random() * characters.length));
                }
                if (seg < 2) key += '-'; // Tambah dash kecuali segment terakhir
            }
            
            generatedKeys.push(key);
        }
        
        // Dalam implementasi nyata, keys ini akan disimpan ke database
        // dengan status: unbound (belum ada HWID)
        const keyData = generatedKeys.map(key => ({
            key: key,
            user: null,
            hwid: null,
            first_used: null,
            device_info: null,
            created_at: Math.floor(Date.now() / 1000),
            created_by: 'admin'
        }));
        
        // Log generation activity
        console.log(`Generated ${keyAmount} keys:`, {
            keys: generatedKeys.map(k => k.substring(0, 8) + '...'),
            timestamp: new Date().toISOString(),
            admin: 'system'
        });
        
        return res.json({
            success: true,
            message: `${keyAmount} keys berhasil digenerate`,
            keys: generatedKeys,
            key_data: keyData,
            generated_at: Math.floor(Date.now() / 1000)
        });
        
    } catch (error) {
        console.error('Generate keys error:', error);
        return res.status(500).json({
            error: "Gagal generate keys"
        });
    }
}
