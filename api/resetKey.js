// File: api/resetKey.js
// API untuk reset key dan HWID binding

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const { key, password, hwid_only } = req.query;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Whoamidev1819";
    
    // Validasi input
    if (!key || !password) {
        return res.status(400).json({
            error: "Key dan password diperlukan"
        });
    }
    
    // Validasi password admin
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({
            error: "Password admin salah"
        });
    }
    
    try {
        // Dalam implementasi nyata, ini akan query ke database
        // Simulasi pencarian key
        const keyExists = true; // Simulasi key ditemukan
        
        if (!keyExists) {
            return res.status(404).json({
                error: "Key tidak ditemukan"
            });
        }
        
        // Log reset activity
        const resetAction = hwid_only === 'true' ? 'hwid_reset' : 'full_reset';
        console.log(`Reset activity:`, {
            key: key.substring(0, 8) + '...',
            action: resetAction,
            timestamp: new Date().toISOString(),
            admin: 'system'
        });
        
        if (hwid_only === 'true') {
            // Reset hanya HWID binding, keep user data
            return res.json({
                success: true,
                message: "HWID binding berhasil direset. Key dapat digunakan di device lain.",
                action: "hwid_reset",
                timestamp: Math.floor(Date.now() / 1000)
            });
        } else {
            // Reset semua data key
            return res.json({
                success: true,
                message: "Key berhasil direset. Semua data user dan HWID dihapus.",
                action: "full_reset", 
                timestamp: Math.floor(Date.now() / 1000)
            });
        }
        
    } catch (error) {
        console.error('Reset key error:', error);
        return res.status(500).json({
            error: "Gagal mereset key"
        });
    }
}
