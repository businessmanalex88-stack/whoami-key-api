// File: api/admin.js
// API Admin untuk mengelola keys dengan HWID support

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const { password } = req.query;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Whoamidev1819";
    
    // Validasi password admin
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({
            error: "Password admin salah"
        });
    }
    
    try {
        // Simulasi database keys dengan HWID support
        // Dalam implementasi nyata, ini akan dibaca dari database
        const keys = [
            {
                key: "TestKey123",
                user: "Player1",
                hwid: "a1b2c3d4e5f6g7h8",
                first_used: Math.floor(Date.now() / 1000) - 86400,
                device_info: "Roblox Client"
            },
            {
                key: "DemoKey456", 
                user: null,
                hwid: null,
                first_used: null,
                device_info: null
            },
            {
                key: "SampleKey789",
                user: "Player2", 
                hwid: "h8g7f6e5d4c3b2a1",
                first_used: Math.floor(Date.now() / 1000) - 172800,
                device_info: "Roblox Client"
            }
        ];
        
        // Tambahkan fallback keys untuk admin
        const adminKeys = [
            {
                key: "Adminganteng",
                user: "Admin",
                hwid: "admin_bypass",
                first_used: Math.floor(Date.now() / 1000),
                device_info: "Admin Access"
            },
            {
                key: "Whoamidev",
                user: "Admin", 
                hwid: "admin_bypass",
                first_used: Math.floor(Date.now() / 1000),
                device_info: "Admin Access"
            },
            {
                key: "WhoAmIAdmin2025",
                user: "Admin",
                hwid: "admin_bypass", 
                first_used: Math.floor(Date.now() / 1000),
                device_info: "Admin Access"
            }
        ];
        
        // Gabungkan keys biasa dengan admin keys
        const allKeys = [...keys, ...adminKeys];
        
        // Statistik HWID
        const stats = {
            total_keys: allKeys.length,
            bound_keys: allKeys.filter(k => k.hwid && k.hwid !== 'admin_bypass').length,
            unbound_keys: allKeys.filter(k => !k.hwid || k.hwid === null).length,
            admin_keys: adminKeys.length,
            unique_devices: new Set(allKeys.filter(k => k.hwid && k.hwid !== 'admin_bypass').map(k => k.hwid)).size
        };
        
        return res.json({
            success: true,
            keys: allKeys,
            stats: stats,
            timestamp: Math.floor(Date.now() / 1000)
        });
        
    } catch (error) {
        console.error('Admin API error:', error);
        return res.status(500).json({
            error: "Error server internal"
        });
    }
}
