// File: api/update-key.js
// API untuk update key dengan data HWID

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method tidak diizinkan' });
    }
    
    const { password, key, user, hwid, first_used, device_info } = req.body;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Whoamidev1819";
    
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Password admin salah' });
    }
    
    if (!key || !user || !hwid) {
        return res.status(400).json({ error: 'Data tidak lengkap' });
    }
    
    try {
        // Simulasi update ke database
        // Dalam implementasi nyata, Anda akan update ke database yang sebenarnya
        
        // Untuk sementara, kita hanya return success
        // Karena tidak ada database persist di example ini
        
        return res.json({
            success: true,
            message: 'Key berhasil diupdate',
            data: {
                key,
                user,
                hwid,
                first_used,
                device_info
            }
        });
        
    } catch (error) {
        console.error('Update key error:', error);
        return res.status(500).json({
            success: false,
            error: 'Gagal update key'
        });
    }
}
