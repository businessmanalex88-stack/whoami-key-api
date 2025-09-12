// File: api/logs.js
// API untuk menampilkan logs aktivitas dengan HWID tracking

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
        // Simulasi data logs dengan HWID tracking
        // Dalam implementasi nyata, ini akan dibaca dari database logs
        const logs = [
            {
                key: "TestKey123",
                user: "Player1",
                hwid: "a1b2c3d4e5f6g7h8",
                timestamp: Math.floor(Date.now() / 1000) - 3600, // 1 jam yang lalu
                action: "login_success",
                ip: "192.168.1.100",
                place_id: "123456789",
                device_info: "Roblox Client",
                first_time_bind: false
            },
            {
                key: "DemoKey456",
                user: "Player2", 
                hwid: "h8g7f6e5d4c3b2a1",
                timestamp: Math.floor(Date.now() / 1000) - 7200, // 2 jam yang lalu
                action: "first_bind",
                ip: "192.168.1.101",
                place_id: "123456789", 
                device_info: "Roblox Client",
                first_time_bind: true
            },
            {
                key: "SampleKey789",
                user: "Player3",
                hwid: "x1y2z3a4b5c6d7e8", 
                timestamp: Math.floor(Date.now() / 1000) - 10800, // 3 jam yang lalu
                action: "login_success",
                ip: "192.168.1.102",
                place_id: "123456789",
                device_info: "Roblox Client", 
                first_time_bind: false
            },
            {
                key: "TestKey123",
                user: "UnknownUser",
                hwid: "different_hwid_123",
                timestamp: Math.floor(Date.now() / 1000) - 14400, // 4 jam yang lalu
                action: "login_failed",
                ip: "192.168.1.200",
                place_id: "123456789",
                device_info: "Roblox Client",
                first_time_bind: false,
                error: "Key already bound to different device"
            },
            {
                key: "NewKey999",
                user: "Player4",
                hwid: "z9y8x7w6v5u4t3s2",
                timestamp: Math.floor(Date.now() / 1000) - 18000, // 5 jam yang lalu  
                action: "first_bind",
                ip: "192.168.1.103",
                place_id: "123456789",
                device_info: "Roblox Client",
                first_time_bind: true
            }
        ];
        
        // Statistik logs
        const stats = {
            total_logs: logs.length,
            successful_logins: logs.filter(l => l.action === 'login_success').length,
            failed_logins: logs.filter(l => l.action === 'login_failed').length,
            first_time_binds: logs.filter(l => l.action === 'first_bind').length,
            unique_users: new Set(logs.map(l => l.user)).size,
            unique_devices: new Set(logs.map(l => l.hwid)).size,
            today_logs: logs.filter(l => {
                const today = new Date();
                const logDate = new Date(l.timestamp * 1000);
                return logDate.toDateString() === today.toDateString();
            }).length
        };
        
        // Filter logs by date range jika ada parameter
        let filteredLogs = logs;
        if (req.query.from || req.query.to) {
            const fromDate = req.query.from ? parseInt(req.query.from) : 0;
            const toDate = req.query.to ? parseInt(req.query.to) : Math.floor(Date.now() / 1000);
            
            filteredLogs = logs.filter(log => 
                log.timestamp >= fromDate && log.timestamp <= toDate
            );
        }
        
        // Sorting - newest first
        filteredLogs.sort((a, b) => b.timestamp - a.timestamp);
        
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedLogs = filteredLogs.slice(startIndex, endIndex);
        
        return res.json({
            success: true,
            logs: paginatedLogs,
            stats: stats,
            pagination: {
                current_page: page,
                total_pages: Math.ceil(filteredLogs.length / limit),
                total_logs: filteredLogs.length,
                per_page: limit
            },
            timestamp: Math.floor(Date.now() / 1000)
        });
        
    } catch (error) {
        console.error('Logs API error:', error);
        return res.status(500).json({
            error: "Error server internal"
        });
    }
}
