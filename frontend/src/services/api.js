export async function chatRequest(payload) {
    const res = await fetch(
        "http://127.0.0.1:8000/chat",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }
    );
    if(!res.ok){
        const err = await res.text();
        throw new Error(err);
    }
    return await res.json();
}

export async function fetchLogs(limit = 50) {
    try {
        const res = await fetch(
            `http://127.0.0.1:8000/logs?limit=${limit}`
        );
        if(!res.ok){
            throw new Error(
                await res.text()
            );
        }
        const data = await res.json();
        return data.logs || [];
    }
    catch(err){
        console.error(
            "fetchLogs error:",
            err
        );
        return [];
    }
}

export async function fetchStats() {
    const res = await fetch(
        "http://127.0.0.1:8000/stats"
    );
    if(!res.ok){
        throw new Error(
            "Failed to fetch stats"
        );
    }
    return await res.json();
}