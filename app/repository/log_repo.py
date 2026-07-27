from app.db import get_connection

def save_request(data):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO requests(
            request_id,
            timestamp,
            user_id,
            application,
            query,
            task_type,
            selected_model,
            routing_reason,
            fallback_used,
            fallback_chain,
            latency_ms,
            estimated_cost,
            tokens,
            status,
            priority,
            max_latency_ms
        )
        VALUES (
            %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s
        )
    """, (
        data["request_id"],
        data["timestamp"],
        data["user_id"],
        data["application"],
        data["query"],
        data["task_type"],
        data["model_used"],      # maps to selected_model column
        
        data["explainability"]["decision_source"],
        
        0,
        None,
        0,
        0,
        0,
        data["status"],
        data["priority"],
        data["max_latency_ms"]
    ))

    conn.commit()

    cursor.close()
    conn.close()


def get_logs(limit=20):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM requests
        ORDER BY timestamp DESC
        LIMIT %s
    """, (limit,))

    rows = cursor.fetchall()

    for row in rows:
        row["model_used"] = row["selected_model"]

    cursor.close()
    conn.close()

    return rows

