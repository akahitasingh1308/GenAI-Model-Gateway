import {
    createContext,
    useContext,
    useState,
    useEffect
} from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
    const [latest, setLatest] = useState(null);

    const [logs, setLogs] = useState([]);

    const [logCount, setLogCount] = useState(0);

    function addLog(data) {
        setLatest(data);
        setLogs(prev => [
            data,
            ...prev
        ].slice(0, 50));
    }

    useEffect(() => {
        const loadLogs = async () => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/logs?limit=1000"
                );

                const data = await response.json();
                setLogs(data.logs || []);
                setLogCount(data.count || 0);
            }
            catch(error) {
                console.error(
                    "Failed to fetch logs:",
                    error
                );
            }
        };
        loadLogs();
        const interval = setInterval(
            loadLogs,
            5000
        );
        return () => clearInterval(interval);
    }, []);

    return (
        <AppContext.Provider
            value={{
                latest,
                setLatest,
                logs,
                setLogs,
                logCount,
                addLog
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);



