// File: api/log-hwid.js
// API untuk log penggunaan key dengan HWID

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
    
    try {
        const logData = req.body;
        
        // Validasi data log
        if (!logData.key || !logData.hwid || !logData.user) {
            return res.status(400).json({ error: 'Data log tidak lengkap' });
        }
        
        // Tambahkan timestamp jika belum ada
        if (!logData.timestamp) {
            logData.timestamp = Math.floor(Date.now() / 1000);
        }
        
        // Log ke console (dalam implementasi nyata, simpan ke database)
        console.log('HWID Usage Log:', {
            key: logData.key.substring(0, 8) + '...',
            hwid: logData.hwid.substring(0, 8) + '...',
            user: logData.user,
            userId: logData.userId,
            timestamp: new Date(logData.timestamp * 1000).toISOString(),
            place: logData.place,
            success: logData.success
        });
        
        // Dalam implementasi nyata, Anda akan:
        // 1. Simpan ke database logs
        // 2. Update usage count
        // 3. Track suspicious activities
        
        return res.json({
            success: true,
            message: 'Log berhasil disimpan'
        });
        
    } catch (error) {
        console.error('Log error:', error);
        return res.status(500).json({
            success: false,
            error: 'Gagal menyimpan log'
        });
    }
}
