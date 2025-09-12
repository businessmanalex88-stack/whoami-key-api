// File: api/validate-hwid.js
// Letakkan file ini di folder api/ di project Vercel Anda

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const { key, hwid, user } = req.query;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Whoamidev1819";
    
    // Validasi input
    if (!key || !hwid || !user) {
        return res.status(400).json({
            success: false,
            error: "Parameter tidak lengkap"
        });
    }
    
    try {
        // Ambil data keys dari API admin yang sudah ada
        const adminResponse = await fetch(`${req.headers.host}/api/admin?password=${ADMIN_PASSWORD}`);
        const adminData = await adminResponse.json();
        
        if (adminData.error || !adminData.keys) {
            return res.status(500).json({
                success: false,
                error: "Gagal mengambil data keys"
            });
        }
        
        // Cari key di database
        let keyData = null;
        for (const k of adminData.keys) {
            if (k.key === key) {
                keyData = k;
                break;
            }
        }
        
        if (!keyData) {
            return res.json({
                success: false,
                error: "Key tidak valid"
            });
        }
        
        // LOGIKA HWID:
        
        // 1. Jika key sudah memiliki HWID dan HWID tidak cocok = TOLAK
        if (keyData.hwid && keyData.hwid !== hwid) {
            return res.json({
                success: false,
                error: "Key sudah terikat dengan device lain",
                bound_user: keyData.user,
                bound_date: keyData.first_used
            });
        }
        
        // 2. Jika key belum memiliki HWID = BIND HWID baru
        if (!keyData.hwid) {
            // Update key dengan HWID dan data user
            const updateData = {
                key: key,
                user: user,
                hwid: hwid,
                first_used: Math.floor(Date.now() / 1000),
                device_info: req.headers['user-agent'] || 'Roblox'
            };
            
            // Panggil API untuk update key (Anda perlu buat endpoint ini)
            try {
                const updateResponse = await fetch(`${req.headers.host}/api/update-key`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        password: ADMIN_PASSWORD,
                        ...updateData
                    })
                });
                
                if (!updateResponse.ok) {
                    throw new Error('Update failed');
                }
            } catch (error) {
                console.log('Update key failed, continuing anyway:', error);
            }
            
            return res.json({
                success: true,
                message: "Key berhasil terikat dengan device Anda",
                first_time: true
            });
        }
        
        // 3. Jika HWID cocok = IZINKAN akses
        if (keyData.hwid === hwid) {
            return res.json({
                success: true,
                message: "Device terverifikasi",
                user: keyData.user,
                first_time: false
            });
        }
        
        // Fallback - seharusnya tidak sampai sini
        return res.json({
            success: false,
            error: "Error tidak diketahui"
        });
        
    } catch (error) {
        console.error('HWID validation error:', error);
        return res.status(500).json({
            success: false,
            error: "Error server internal"
        });
    }
}
